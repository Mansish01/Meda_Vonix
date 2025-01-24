import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const PatientRecord: React.FC = () => {

    const [patient, setPatient] = useState([
        { 
          id: 1, 
          name: 'Manish Gyawali', 
          age: 25, 
          condition: 'Hypertension' 
        },
        { 
          id: 2, 
          name: 'Saugat Thapa', 
          age: 22, 
          condition: 'Diabetes' 
        }, 
        { 
            id: 3, 
            name: 'Aahwast Pandit', 
            age: 24, 
            condition: 'Pneumonia' 
          }

      ]);
    return (
        <div className='bg-white shadow rounded-lg p-6'>
            <div className='flex justify-between items-center'>
                <h3 className='text-3xl font-semibold'>Patient List</h3>
               <button className='bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center'>
                    <PlusCircle size={20} className='mr-2'/>                 
                    Add Patient
                </button>
            </div>

            <table className='w-full'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='p-3 text-left'>Name</th>
                        <th  className='p-3 text-left'>Age</th>
                        <th  className='p-3 text-left'>Conditon</th>
                        <th  className='p-3 text-left'>More Details</th>
                    </tr>
                </thead>

                <tbody>
                    { patient.map((patient) => (
                        <tr key={patient.id} className='border-b'>
                            <td className='p-3'>{patient.name}</td>
                            <td className='p-3'>{patient.age}</td>
                            <td className='p-3'>{patient.condition}</td>
                            <td className='p-3'>
                                <button className='text-emerald-600 hover:underline'>
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientRecord;