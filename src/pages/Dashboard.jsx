// src/pages/Dashboard.jsx
import { useState } from 'react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-blue-800 text-white w-64 min-h-screen ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="p-4">
          <h2 className="text-2xl font-semibold">HamroDoctor</h2>
        </div>
        <nav className="mt-8">
          <a 
            href="#" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
          >
            Dashboard
          </a>
          <a 
            href="#" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
          >
            Appointments
          </a>
          <a 
            href="#" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
          >
            Medical History
          </a>
          <a 
            href="#" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
          >
            Chat
          </a>
          <a 
            href="#" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
          >
            Profile
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            <div className="flex items-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
              <p className="text-gray-600">You have no upcoming appointments</p>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <p className="text-gray-600">No recent activity</p>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded">
                  Book New Appointment
                </button>
                <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded">
                  Start Chat
                </button>
                <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded">
                  View Medical History
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;