import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SectionCards() {
  const [data, setData] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeAccounts: 0,
    growthRate: "0%",
  })

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("Token")
      if (!token) {
        console.error("No token found in localStorage")
        return
      }

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL
        const [totalUsersRes, newUsersRes, activeAccountsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/admin/dashboard/charts/total-users`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`${baseUrl}/api/admin/dashboard/charts/new-users`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`${baseUrl}/api/admin/dashboard/charts/active-accounts`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ])

        const totalUsers = totalUsersRes.data.totalUsers || 0
        const newUsers = newUsersRes.data.newUsers || 0
        const activeAccounts = activeAccountsRes.data.activeAccounts || 0
        const growthRate =
          totalUsers > 0 ? `${((newUsers / totalUsers) * 100).toFixed(1)}%` : "0%"

        setData({ totalUsers, newUsers, activeAccounts, growthRate })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setData({
          totalUsers: 0,
          newUsers: 0,
          activeAccounts: 0,
          growthRate: "0%",
        })
      }
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="bg-gray-800 text-white shadow-md">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {data.totalUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-gray-800 text-white shadow-md">
        <CardHeader>
          <CardDescription>New Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {data.newUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-gray-800 text-white shadow-md">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {data.activeAccounts}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-gray-800 text-white shadow-md">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {data.growthRate}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
