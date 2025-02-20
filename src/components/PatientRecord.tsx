import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PatientRecord: React.FC = () => {

    const navigate = useNavigate();
    const {doctorId} = useParams();

    const [patient, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


      const handleviewDetails = (patientID: number) => {
        navigate(`/patient/${doctorId}/${patientID}`)
      };

    useEffect(() =>{
        const fetchpatients = async () =>{
        if(!doctorId) return;
        
        try{
            setLoading(true);
            setError(null);

            const response = await fetch(`/doctor/details/?doctor_id=${doctorId}`, {
                headers: {
                  "ngrok-skip-browser-warning": "true"
                }
              });

            if(!response.ok){
                throw new Error(`Error status: ${response.status}`)
            }

            const data = await response.json()

            console.log(data)
            setPatients(data.assigned_patients)
        } catch(err){
            setError(err instanceof Error ? err.message : 'Failed to fetch patients');
        } finally {
            setLoading(false)
        }
    };
        fetchpatients();
    }, [doctorId]);

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
                        <th  className='p-3 text-left'>Gender</th>
                        <th  className='p-3 text-left'>More Details</th>
                    </tr>
                </thead>

                <tbody>
                    { patient.map((patient) => (
                        <tr key={patient.id} className='border-b'>
                            <td className='p-3'>{patient.name}</td>
                            <td className='p-3'>{patient.age}</td>
                            <td className='p-3'>{patient.gender}</td>
                            <td className='p-3'>
                                <button 
                                onClick={() => handleviewDetails(patient.patient_id)}
                                className='text-emerald-600 hover:underline'>
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