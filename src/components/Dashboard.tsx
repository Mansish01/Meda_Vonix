import React from 'react';
import { useState } from 'react';
import { sidebarItems } from './DashboardSidebar';
import { 
    User, 
    AlignJustify, 

  } from 'lucide-react';
import PatientRecord from './PatientRecord';
import Appointments from './Appointments';
import TreatmentPlan from './TreatmentPlan';
import DashboardSidebar from './DashboardSidebar';

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

            <div className='flex'>
                <div className="h-screen w-56">
                    <DashboardSidebar section={section} setSection={setSection}/>
                </div>
                

                <div className='w-5/6'>
                    <nav className ='bg-gray-300 p-3 width-full'>

                        <div className='flex justify-end items-center space-x-4'>
                        <User className='text-emerald-600' size={30}/>
                        <AlignJustify className='text-emerald-600' size={30}/>
                        </div>

                    </nav>
                    
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {sidebarItems.find(item => item.section ===section)?.label}
                        </h2>

                        </div>
                        {renderSection()}
                    </div>
                    </div>
                </div>

            </div>
    );
};

export default Dashboard;