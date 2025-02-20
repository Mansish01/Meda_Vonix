import React from "react";
import { X } from "lucide-react";

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Settings container */}
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Account Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-gray-700 font-medium">Dark Mode</span>
                    <p className="text-sm text-gray-500">
                      Enable dark mode for a better viewing experience in low
                      light
                    </p>
                  </div>
                  <button className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-gray-700 font-medium">
                      Notifications
                    </span>
                    <p className="text-sm text-gray-500">
                      Receive notifications for new messages and updates
                    </p>
                  </div>
                  <button className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-gray-700 font-medium">Logout</span>
                    <p className="text-sm text-gray-500">
                      Logout on this device
                    </p>
                  </div>
                  <button className="w-20 bg-[#e12727]  text-sm py-2 rounded-lg text-white ">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
