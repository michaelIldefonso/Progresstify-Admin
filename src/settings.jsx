import React from "react";

function Settings() {
  const handleFeatureToggle = (event) => {
    console.log(`Feature ${event.target.name} is now ${event.target.checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Site Name</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="featureX"
          name="featureX"
          onChange={handleFeatureToggle}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featureX" className="ml-2 block text-sm text-gray-900">
          Enable Feature X
        </label>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="featureY"
          name="featureY"
          onChange={handleFeatureToggle}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featureY" className="ml-2 block text-sm text-gray-900">
          Enable Feature Y
        </label>
      </div>
      <button className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Save Settings
      </button>
    </div>
  );
}

export default Settings;