
import VoiceRecorder from "./components/Record";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import VoiceDetection from "./components/VoiceDetection";
import SignUp from "./components/SignUp";
import PatientRecord from "./components/PatientRecord";
import Appointments from "./components/Appointments";
import TreatmentPlan from "./components/TreatmentPlan";
import PatientDetails from "./components/PatientDetails";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VoiceRecorder/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard/:doctorId" element={<Dashboard/>}/>
        <Route path="/voice" element={<VoiceDetection/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/patient" element={<PatientRecord/>}/>
        <Route path="/appointments" element={<Appointments/>}/>
        <Route path="/treatment" element={<TreatmentPlan/>}/>
        <Route path="/patient/:id" element={<PatientDetails/>} />


        
      </Routes>
        
    </div>
  );
}

export default App;
