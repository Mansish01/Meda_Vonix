import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState([
        { 
          id: 1, 
          patient: 'John Doe', 
          date: '2024-02-15', 
          time: '10:00 AM', 
          doctor: 'Dr. Smith' 
        }
      ]);
    
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center">
              <PlusCircle className="mr-2" size={20} />
              Schedule Appointment
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Doctor</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b">
                  <td className="p-3">{appt.patient}</td>
                  <td className="p-3">{appt.date}</td>
                  <td className="p-3">{appt.time}</td>
                  <td className="p-3">{appt.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
};

export default Appointments;