import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, AlignJustify, Mic, Square, Play, Pause } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

interface MedicalCondition {
  id: number;
  condition: string;
  description: string;
  diagnosisDate: string;
  status: 'Active' | 'Resolved' | 'Under Observation';
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender?: string;
  bloodGroup?: string;
  lastVisit?: string;
  nextAppointment?: string;
  medicalHistory: MedicalCondition[];
}

interface ResponseEntry {
  text: string;
  timestamp: string;
  audioUrl?: string;
}

interface Transcription {
  start_time: string;
  end_time: string;
  speaker: "doctor" | "patient";
  text: string;
}

const PatientDetails: React.FC = () => {
  const { doctorID, patientID } = useParams();

  // console.log(doctorID, patientID)

  const navigate = useNavigate();

  
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('patients');
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [clicked, setclicked ] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<MedicalCondition | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const dataChunksRef = useRef<Blob[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const googleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const [error, setError] = useState<string | null>(null);
     
  const [patientdetails, setPatientsdetails] = useState<any[]>([]);

  const [file, setFile ] = useState()
  const [uploading, setUploading] = useState(false)
  const [refuploading, setRefUploading] = useState(false)

  const [messages, setMessages] = useState<Transcription[]>([]);
  const [medicalanalysis, setMedicalanalysis] =  useState(null);

  useEffect(() => {

    const fetchpatientsdetails = async () =>{
      if(!doctorID) return;
      
      try{
         
          setError(null);

          const response = await fetch(`/doctor_dashboard/${doctorID}`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "true",
                'Accept': 'application/json',
            },
        });


          if(!response.ok){
              throw new Error(`Error status: ${response.status}`)
          }

          const data = await response.json()
          console.log(data)

          const patient = data.find((p) => p.patient_id === patientID)
          // console.log(patient)
          setPatientsdetails(patient)    
          console.log(patient)

      } catch(err){
          setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      } finally {
          setLoading(false)
      }
  };
      fetchpatientsdetails();

    setLoading(false);
  }, [doctorID]);

  
  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    const findGoogleVoice = () => {
      const voices = synthRef.current?.getVoices() || [];
      const googleVoice = voices.find(voice =>
        voice.name.includes('Google US English') ||
        (voice.name.includes('Google') && voice.lang.startsWith('en-US'))
      );

      if (googleVoice) {
        googleVoiceRef.current = googleVoice;
      } else {
        const fallbackVoice = voices.find(voice => voice.lang.startsWith('en-US'));
        if (fallbackVoice) {
          googleVoiceRef.current = fallbackVoice;
        }
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = findGoogleVoice;
    }

    findGoogleVoice();

    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;

      dataChunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          dataChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(dataChunksRef.current, { type: 'audio/webm' });
          await uploadAudio(blob);
        } catch (error) {
          console.error('Error processing audio:', error);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = (): void => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob | null): Promise<void> => {
    if (!audioBlob) return;

    const formData = new FormData();
    const files = new File([audioBlob], 'recording.webm', {
      type: 'audio/webm',
    });
    formData.append('audio', files);

    // try {
    //   const response = await fetch('patient/problem', {
    //     method: 'POST',
    //     body: formData,
    //   });
      try {
        const response = await fetch('/transcribe/', {
          method: 'POST',
          body: formData,
        });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const textResponse = await response.text();
      console.log(textResponse)
    
      const processedData = JSON.parse(textResponse);
      

      if (processedData) {
        const newResponse: ResponseEntry = {
          text: processedData,
          timestamp: new Date().toLocaleTimeString()
        };
        setResponses(prev => [...prev, newResponse]);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const handleRecordingClick = (): void => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playWithGoogleVoice = (textToRead?: string) => {
    if (!synthRef.current || !googleVoiceRef.current || !responses.length) return;

    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    let text = textToRead
    if(!text && responses.length > 0){
      text = responses[responses.length -1].text
    }

    if(!text)  return;

    // const lastResponse = responses[responses.length - 1];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = googleVoiceRef.current;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    synthRef.current.speak(utterance);
  };

  const handleDivclick = (patientdetails) => {
    setSelectedCondition(patientdetails)
    setclicked(!clicked)  
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-red-600 bg-red-50';
      case 'Resolved':
        return 'text-green-600 bg-green-50';
      case 'Under Observation':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleUploadChange = (event) =>{
    setFile(event.target.files[0])
  }

  const handleRefUploadChange = (event) =>{
    setFile(event.target.files[0])
  }

  const handleRefFileUpload = async () => {
    if(!file) {
      alert("Please Upload the file first")
      return;
    }

    const formdata = new FormData();
    formdata.append("audio_file", file)

    setRefUploading(true);


    try{
      const response = await fetch(`/set_reference_speaker`, {
        method : 'POST',
        body : formdata
      });

      if(response.ok){
        alert("File Uploaded  Successfully")
    
      } else{
        alert("Error in uploading file")
      }
    }catch(error){
        console.error("Error in uploading file", error)
        alert("An error occured in uploading file")
      }
     
      setRefUploading(false)
    }
  

  const handleFileUpload = async () => {
    if(!file) {
      alert("Please Upload the file first")
      return;
    }

    const formdata = new FormData();
    formdata.append("patient_id", patientID)
    formdata.append("audio_file", file)

    setUploading(true);


    try{
      const response = await fetch(`/diarize/?patient_id=${patientID}`, {
        method : 'POST',
        body : formdata
      });

      if(response.ok){
        // alert("File Uploaded  Successfully")
        const data = await response.json()
        console.log(data.transcription_result)
        setMessages(data.transcription_result);
        setMedicalanalysis(data.medical_analysis);

      
        const conditionOverview = data.medical_analysis.condition_overview;
        const symptoms = data.medical_analysis.symptoms;
        const diagnosis = data.medical_analysis.diagnosis;
        const treatment = data.medical_analysis.treatment;
        const prevention = data.medical_analysis.prevention;

        // Log the data to check if it is correct
        console.log("Condition Overview:", conditionOverview);
        console.log("Symptoms:", symptoms);
        console.log("Diagnosis:", diagnosis);
        console.log("Treatment:", treatment);
        console.log("Prevention:", prevention);
        console.log(messages)
        console.log(medicalanalysis);
            
      
  
   
        
      } else{
        alert("Error in uploading file")
      }
    }catch(error){
        console.error("Error in uploading file", error)
        alert("An error occured in uploading file")
      }
     
      setUploading(false)
    }
  
 
    const conditionOverview = medicalanalysis?.condition_overview;
    const symptoms = medicalanalysis?.symptoms;
    const diagnosis = medicalanalysis?.diagnosis;
    const treatment = medicalanalysis?.treatment;
    const prevention = medicalanalysis?.prevention;


  if (loading) {
    return (
    
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading patient details...</div>
      </div>
    );
  }

  if (!patientdetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Patient not found</div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-screen w-56">
        <DashboardSidebar
          section={currentSection}
          setSection={setCurrentSection}
          onSidebarItemClick={() => navigate('/dashboard/')}
        />
      </div>

      <div className="flex-1 pl-56">
        <div className="fixed top-0 right-0 left-56 bg-gray-300 p-3 z-10">
          <div className="flex justify-end items-center px-2">
            <User className="text-emerald-600 mr-4" size={30} />
            <AlignJustify className="text-emerald-600" size={30} />
          </div>
        </div>

        <div className="custom-scrollbar pt-16 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Patient List
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-6">Patient Details</h2>
                <div className="grid grid-cols-1 md:grid-rows-2 gap-2">
                  <div className="md:grid grid-cols-4 gap-2">
                    <div>
                      <h3 className="text-gray-500 text-sm">Full Name</h3>
                      <p className="text-lg font-medium">{patientdetails.patient_name}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm">Age</h3>
                      <p className="text-lg">{patientdetails.age} years</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm">Gender</h3>
                      <p className="text-lg">{patientdetails.gender}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm">Patient ID</h3>
                      <p className="text-lg">{patientdetails.patient_id}</p>
                    </div>
                  </div>
                  <div className="md:grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <h3 className="text-gray-500 text-sm">Last Visit</h3>
                      <p className="text-lg">2025/01/03</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm">Next Appointment</h3>
                      <p className="text-lg">2025/03/02</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-300"></div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Medical History</h2>
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('tab1')}
                      className={`px-4 py-2 rounded-l-lg ${
                        activeTab === 'tab1'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Visit History
                    </button>
                    <button
                      onClick={() => setActiveTab('tab2')}
                      className={`px-4 py-2 rounded-r-lg ${
                        activeTab === 'tab2'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Voice Notes
                    </button>
                  </div>
                  <div className="flex items-center gap-4">

                  <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                      Choose File1
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleRefUploadChange} 
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleRefFileUpload}
                      disabled={refuploading}
                      className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400 hover:bg-green-600"
                    >
                      {refuploading ? "Uploading..." : "Upload"}
                    </button>

                    {/* <span className="text-gray-700">Initiate Call</span>
                    <button
                      onClick={handleRecordingClick}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <Mic
                        className={`w-5 h-5 text-white ${isRecording ? 'animate-pulse' : ''}`}
                      />
                    </button> */}
                    {/* <span className="text-gray-700">or</span> */}
                    <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                      Choose File2
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleUploadChange} 
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleFileUpload}
                      disabled={uploading}
                      className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400 hover:bg-green-600"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-auto">
                  {activeTab === 'tab1' && (
                    <div>
                      {/* {patientdetails.problem_description.map((condition) => (
                        <div key={condition.id} className="border rounded-lg p-4" onClick={() =>handleDivclick(condition)}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className='flex'>
                                <h3 className="text-lg font-medium mr-4">{condition.condition}</h3>
                                <span className={`px-3 py-1 rounded-full text-[15px] font-medium ${getStatusColor(condition.status)}`}>
                                  {condition.status}
                                </span>
                  
                              </div> 
                               <p className="text-sm text-gray-500">Diagnosed on: {condition.diagnosisDate}</p>


                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{condition.problem_description}</p>
                        </div>
                      ))} */}
                      <div onClick={() =>handleDivclick(patientdetails)}>
                        <p className="text-gray-700 mt-2">{patientdetails.problem_description}</p>

                      </div>
                     
                      <div className="flex justify-end gap-4">
                        <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50">
                          Edit Details
                        </button>
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                          Add Medical Record
                        </button>
                      </div>
                    </div>
                  )}
                  {activeTab === 'tab2' && (
                    <div className='flex gap-6 p-6 h-full'>
                      <div className='flex-1 min-w-0 bg-gray-100'>
                        {/* <p>Medical Info</p>/ */}


                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            msg.speaker === "doctor" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg max-w-xs my-3 ${
                              msg.speaker === "doctor"
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            <p className="text-sm ">
                              <strong>{msg.speaker === "doctor" ? "Doctor" : "Patient"}:</strong>{" "}
                              {msg.text}
                            </p>
                
                          </div>
                        </div>
                      ))}


                    
                      </div>

                      <div className="flex-1 shrink-0 relative">
                        <div className="border rounded-lg p-6 bg-white shadow-sm h-full">
                          <h2 className="text-lg font-semibold mb-4">Summary</h2>
                          <div className="space-y-4 mb-8">
                           
                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Key Point 1: Disease Overview</h3>
                            <p className="text-sm text-gray-600">{conditionOverview}</p>
                          </div>

                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Key Point 2: Symptoms</h3>
                            <p className="text-sm text-gray-600">
                              {symptoms.map((symptom, index) => (
                                <span key={index}>- {symptom}<br /></span>
                              ))}
                            </p>
                          </div>

                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Key Point 3: Diagnosis</h3>
                            <p className="text-sm text-gray-600">
                              {diagnosis.map((diagnosis, index) => (
                                <span key={index}>- {diagnosis}<br /></span>
                              ))}
                            </p>
                          </div>

                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Key Point 4: Treatment</h3>
                            <p className="text-sm text-gray-600">
                              {treatment.map((treatment, index) => (
                                <span key={index}>- {treatment}<br /></span>
                              ))}
                            </p>
                          </div>

                          <div className="border-b pb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Key Point 5: Prevention</h3>
                            <p className="text-sm text-gray-600">
                              {prevention.map((prevention, index) => (
                                <span key={index}>- {prevention}<br /></span>
                              ))}
                            </p>
                          </div>

                        
                          </div>
                          <button className="fixed bottom-2 right-4 bg-emerald-600 text-white p-2 rounded-lg shadow-lg hover:bg-emerald-700">
                              Generate Report
                          </button>

                        </div>
                         
                      </div>
                    </div>
                    
                  )}
                </div>

             
              </div>


            </div>
          </div>
        </div>
 
      </div>

      {clicked && selectedCondition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
          <button 
              onClick={() => setclicked(false)}
              className="absolute top-0 right-2 text-gray-500 font-bold text-[20px] hover:text-gray-700"
            >
              ×
            </button>
            <div className='bg-gray-100 p-3 rounded-md relative'>

        
  
            <h3 className="text-xl font-semibold mb-4">{selectedCondition.problem_description}</h3>
            <div className="space-y-4 re">
              <div>
                <p className="text-sm text-gray-500">Diagnosis Date</p>
                <p className="font-medium">2025/03/05</p>
              </div>
              
              <div className='flex justify-between items-center'>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{selectedCondition.problem_description}</p>
                </div>
                <button 
                      onClick={() => playWithGoogleVoice(`${selectedCondition.problem_description}`)}
                      className="absolute bottom-2 right-2 p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 ml-2"
                    >
                      {isPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                </button>
                
              </div>
            </div>

            </div>
              <div className='bg-gray-100 mt-5'>
                rest of the content here
              </div>
            </div>
          </div>


      )}
      
    </div>


  </>
  );
};

export default PatientDetails;