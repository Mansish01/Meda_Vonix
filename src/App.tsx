
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
import PatientLogin from "./components/PatientLogin";
import SignupForm from "./components/SignupDoctor";
import LoginFormDoctor from "./components/LoginDoctor";

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
        <Route path="/patient/:doctorID/:patientID" element={<PatientDetails/>} />

        <Route path="/patientlogin" element={<PatientLogin/> } />
        <Route path="/signupdoctor" element={<SignupForm/> } />
        <Route path="/logindoctor" element={<LoginFormDoctor/> } />

        
      </Routes>
        
    </div>
  );
}

export default App;
