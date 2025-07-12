import { useState } from "react";

interface AccessControlSettings {
  accessPointName: string;
  accessServer: string;
  enableSmartCard: boolean;
  enableGateAccess: boolean;
  enableDoorLock: boolean;
  syncInterval: number;
}

export default function AccessControl() {
  const [settings, setSettings] = useState<AccessControlSettings>({
    accessPointName: "Main Entrance",
    accessServer: "",
    enableSmartCard: true,
    enableGateAccess: false,
    enableDoorLock: true,
    syncInterval: 15,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Access control settings submitted:", settings);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Access Control Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage how members interact with secure facility entry points.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* General Section */}
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Access Point Name</label>
                <input
                  type="text"
                  name="accessPointName"
                  value={settings.accessPointName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Server Address</label>
                <input
                  type="text"
                  name="accessServer"
                  value={settings.accessServer}
                  onChange={handleChange}
                  placeholder="e.g. 192.168.1.10"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">Access Options</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableSmartCard"
                  checked={settings.enableSmartCard}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Smart Card Access
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableGateAccess"
                  checked={settings.enableGateAccess}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Gate Entry
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableDoorLock"
                  checked={settings.enableDoorLock}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Door Lock System
                </label>
              </div>
            </div>
          </div>

          {/* Sync Section */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Device Sync Interval (minutes)
            </label>
            <input
              type="number"
              name="syncInterval"
              value={settings.syncInterval}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
