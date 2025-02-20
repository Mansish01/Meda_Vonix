import React from "react";
import { X } from "lucide-react";

interface SettingsPageProps {
  onClose: () => void;
}

const AppointmentPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  // Sample data for now; later, this will be fetched from a CSV file
  const appointments = [
    { doctor: "Dr. Samyam Shrestha", event: "Check-up", date: "2025-02-15", time: "10:00 AM", status: "Confirmed" },
    { doctor: "Dr. Pradeep Raj Basnet", event: "Gyno", date: "2025-02-10", time: "02:00 PM", status: "Completed" },
    { doctor: "Dr. Nabin Kripa Oli", event: "Whole Body Check-up", date: "2025-02-17", time: "02:00 PM", status: "Pending" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Settings container */}
      <div className="relative bg-white rounded-lg w-full max-w-3xl mx-4 shadow-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">My Appointments</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Doctor</th>
                <th className="px-4 py-2 border">Event</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="px-4 py-2 border">{appointment.doctor}</td>
                  <td className="px-4 py-2 border">{appointment.event}</td>
                  <td className="px-4 py-2 border">{appointment.date}</td>
                  <td className="px-4 py-2 border">{appointment.time}</td>
                  <td className="px-4 py-2 border font-semibold text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-lg ${
                        appointment.status === "Confirmed"
                          ? "bg-green-200 text-green-800"
                          : appointment.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
