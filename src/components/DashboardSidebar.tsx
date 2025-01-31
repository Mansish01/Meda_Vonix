import React from 'react';

import { 
 
    Calendar, 
    FileText, 
    Stethoscope, 
  } from 'lucide-react';
  
export const sidebarItems = [
    {
        icon : <FileText className='text-white' />,
        label : 'Patient Records',
        section : 'patients'
    }, 
    {
        icon : <Calendar className='text-white' />,
        label : 'Appointments',
        section : 'appointments'
    },    {
        icon : <Stethoscope className='text-white' />,
        label : 'Treatment Plans',
        section : 'treatments'
    },
];

interface DashboardSidebarProps {
    section: string;
    onSidebarItemClick: (section: string) => void; 
  }
    const DashboardSidebar: React.FC<DashboardSidebarProps> = ({section, setSection, onSidebarItemClick}) => {


    return (
        <div className='w-auto bg-emerald-800 shadow-md min-h-screen'>
        <nav className='flex justify-center items-center flex-col p-4'>
           <div className='mb-4'>
               <h1 className='text-white text-3xl font-bold my-4'>MedaVonix</h1>
           </div>
       
           <div>
           {sidebarItems.map((item) =>(
                   <button
                   key={item.section}
                   onClick={()=> (setSection(item.section), onSidebarItemClick(item.section))}
                   className={`flex items-center p-2 w-full my-4 rounded-lg font-medium
                                transition-colors duration-200
                       ${section === item.section ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'}`}
                   >
                       {item.icon}
                       <span className='ml-2 text-lg'>{item.label}</span>{}
                   </button>
               ))}
           </div>

           </nav>
       
       </div>

    );
};

export default DashboardSidebar;