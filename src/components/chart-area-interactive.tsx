"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"




const chartConfig = {
  active_accounts: {
    label: "Active Accounts",
    color: "#4F46E5", // Adjusted for dark theme
  },
} satisfies ChartConfig


export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("Token")
        if (!token) {
          setError("No token found")
          setChartData([])
          setLoading(false)
          return
        }
        const baseUrl = import.meta.env.VITE_API_BASE_URL
        // Calculate startDate and endDate
        const endDate = new Date()
        const days = timeRange === "7d" ? 7 : 30
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)
        // Format as yyyy-mm-dd
        const format = (d: Date) => d.toISOString().slice(0, 10)
        const res = await axios.get(`${baseUrl}/api/admin/dashboard/charts/daily-metrics`, {
          params: {
            metricType: "active_accounts",
            startDate: format(startDate),
            endDate: format(endDate),
          },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        setChartData(res.data.metrics || [])
      } catch (err: any) {
        setError("Failed to fetch chart data")
        setChartData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [timeRange])

  const filteredData = chartData

  return (
    <Card className="bg-gray-800 text-white shadow-md">
      <CardHeader>
        <CardTitle>Active Accounts</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily active accounts for the selected range
          </span>
          <span className="@[540px]/card:hidden">Active accounts (daily)</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">Loading...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] text-red-400">{error}</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillActiveAccounts" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tick={{ fill: "#D1D5DB" }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                {/* Add YAxis for value */}
                <YAxis
                  dataKey="value"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#D1D5DB" }}
                  width={48}
                />
                <ChartTooltip
                  cursor={false}
                  defaultIndex={isMobile ? -1 : 10}
                  content={({ label, payload }) => (
                    <div style={{ minWidth: 0, maxWidth: 220, padding: 8, background: '#23272f', borderRadius: 8, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {label && new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      {payload && payload.length > 0 && (
                        <div style={{ fontSize: 16 }}>
                          Active Accounts: <span style={{ fontWeight: 700 }}>{payload[0].value}</span>
                        </div>
                      )}
                    </div>
                  )}
                />
                <Area
                  dataKey="value"
                  type="natural"
                  fill="url(#fillActiveAccounts)"
                  stroke="#4F46E5"
                />
              </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
