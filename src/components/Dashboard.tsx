import React from 'react';
import { useState } from 'react';
import { 
    User, 
    AlignJustify, 
    Calendar, 
    FileText, 
    Stethoscope, 
    PlusCircle 
  } from 'lucide-react';
import PatientRecord from './PatientRecord';
import Appointments from './Appointments';
import TreatmentPlan from './TreatmentPlan';

const sidebarItems = [
    {
        icon : <FileText className='text-emerald-600' />,
        label : 'Patient Records',
        section : 'patients'
    }, 
    {
        icon : <Calendar className='text-emerald-600' />,
        label : 'Appointments',
        section : 'appointments'
    },    {
        icon : <Stethoscope className='text-emerald-600' />,
        label : 'Treatment Plans',
        section : 'treatments'
    },
];

const Dashboard: React.FC = () => {
    const [section, setSection] = useState('patients');

    const renderSection = () => {
        switch(section){
            case 'patients':
                return <PatientRecord />;
            case 'appointments':
                return <Appointments />;
            case 'treatments':
                return <TreatmentPlan />;
            default:
                return <PatientRecord />;
        }
    };
    
    return (
        <div className='min-h-screen bg-gray-100'>
            <nav className ='bg-emerald-800 p-3 width-full'>

                    <div className='flex justify-end items-center space-x-4'>
              
                        <User className='text-white' size={30}/>
                        <AlignJustify className='text-white' size={30}/>
                    </div>
       
            </nav>

            <div className='flex'>
                <div className='w-1/6 bg-white shadow-md min-h-screen'>
                <nav className='flex justify-center items-center flex-col p-4'>
                    <div className=''>
                        <h1 className='text-emerald-800 text-3xl font-bold my-4'>MedaVonix</h1>
                    </div>
                
                    <div>
                    {sidebarItems.map((item) =>(
                            <button
                            key={item.section}
                            onClick={()=> setSection(item.section)}
                            className={`flex items-center p-2 w-full my-4 rounded-lg 
                                ${section === item.section ? 'bg-emerald-100 text-emerald-800' : 'hover:text-gray-600'}`}
                            >
                                {item.icon}
                                <span className='ml-2 text-[18px]'>{item.label}</span>{}
                            </button>
                        ))}
                    </div>

                </nav>
                
                </div>
                
                <div className="w-5/6 p-6">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {sidebarItems.find(item => item.section ===section)?.label}
                    </h2>
                    <div className="flex space-x-4">
                        <User className="text-emerald-600" size={24} />
                        <AlignJustify className="text-emerald-600" size={24} />
                    </div>
                    </div>
                    {renderSection()}
                </div>
                </div>

            </div>
    );
};

export default Dashboard;