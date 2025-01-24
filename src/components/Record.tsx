import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResponseEntry {
  text: string;
  timestamp: string;
  audioUrl?: string;
}

const VoiceRecorder: React.FC = () => {
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const [currentStreamingText, setCurrentStreamingText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const dataChunksRef = useRef<Blob[]>([]);
  const streamTextRef = useRef<string>('');
  const streamIndexRef = useRef<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const googleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

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

  useEffect(() => {
    if (currentStreamingText && currentStreamingText !== streamTextRef.current) {
      const currentText = String(streamTextRef.current);
      const newText = currentStreamingText;
      
      streamTextRef.current = currentStreamingText;
      streamIndexRef.current = 0;
      
      if (newText) {
        setIsStreaming(true);
        let streamedText = '';
        
        const streamText = () => {
          if (streamIndexRef.current < newText.length) {
            streamedText += newText[streamIndexRef.current] || '';
          
            setResponses(prevResponses => {
              const updatedResponses = [...prevResponses];
              if (updatedResponses.length > 0) {
                updatedResponses[updatedResponses.length - 1].text = streamedText;
              }
              return updatedResponses;
            });
            streamIndexRef.current++;
            setTimeout(streamText, 50);
          } else {
            setIsStreaming(false);
          }
        };

        streamText();
      }
    }
  }, [currentStreamingText]);

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
          setAudio(blob);
          await uploadAudio(blob);
        } catch (error) {
          console.error('Error processing audio:', error);
          setMessage('Error processing audio. Please try again.');
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setMessage('Recording in progress...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMessage('Error accessing microphone.');
    }
  };

  const stopRecording = (): void => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMessage('Processing recording...');
    }
  };

  const uploadAudio = async (audioBlob: Blob | null): Promise<void> => {
    if (!audioBlob) {
      setMessage('No audio to upload.');
      return;
    }

    const formData = new FormData();
    const file = new File([audioBlob], 'recording.webm', {
      type: 'audio/webm',
    });
    
    formData.append('audio', file);

    try {
      console.log('Uploading audio file...');
      const response = await fetch('/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const textResponse = await response.text();
      console.log('Raw server response:', textResponse);
      
      if (!textResponse) {
        throw new Error('Empty response from server');
      }

      try {
        const processedData = JSON.parse(textResponse);
        if (processedData) {
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const newResponse: ResponseEntry = {
            text: processedData,
            timestamp: new Date().toLocaleTimeString(),
            audioUrl: audioUrl
          };
          
          setResponses(prev => [...prev, newResponse]);
          setCurrentStreamingText(processedData);
          setMessage('Transcription successful');
        } else {
          throw new Error('No problem description in response');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setMessage('Error processing server response');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      if (error instanceof Error) {
        setMessage(`Upload failed: ${error.message}`);
      } else {
        setMessage('Upload failed. Please try again.');
      }
    }
  };

  const handleRecordingClick = (): void => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playWithGoogleVoice = () => {
    if (!synthRef.current || !googleVoiceRef.current || !responses.length) return;
    
    
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    const lastResponse = responses[responses.length - 1];
    
   
    const utterance = new SpeechSynthesisUtterance(lastResponse.text);
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

     useEffect(() => {
        let activityTimeout: NodeJS.Timeout | null = null;

      
        const resetSessionTimer = () => {
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
           
            activityTimeout = setTimeout(() => {
                
                localStorage.removeItem('session');
                alert('Session expired due to inactivity. Please log in again.');
                navigate('/login');
            }, 30000000);
        };

        
        const handleActivity = () => {
            const session = localStorage.getItem('session');
            if (session) {
                resetSessionTimer();
            } else {
               
                navigate('/login');
            }
        };

     
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

       
        resetSessionTimer();

        return () => {
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-800">
      {!isRecording && (
        <div className="mb-10">
          <p className="text-white text-2xl font-bold mb-4">How can we assist you today?</p>
        </div>
      )}

      {isRecording && (
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="wave-dot w-8 h-8 bg-white rounded-full transition-transform duration-100"
              style={{
                animationDelay: `${index * 250}ms`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex flex-col items-center gap-10">
        <div className="flex gap-4">
          <button
            onClick={handleRecordingClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              p-4
              rounded-full
              transition-all
              duration-200
              ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-white hover:bg-gray-200'}
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white"/>
            ) : (
              <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-emerald-800'}`} />
            )}
          </button>

 
        </div>

        {responses.length > 0 && (
          <div className="w-[45%] bg-white rounded-lg p-4 shadow-lg fixed bottom-10">
            <div className="relative h-[100px] overflow-y-auto text-black-700 text-sm custom-scrollbar">
              {responses.map((response, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="text-xs text-gray-500 mb-1">{response.timestamp}</div>
                  <div className="text-gray-800">
                    {response.text}


                    {index === responses.length - 1 && isStreaming && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block ml-1 animate-pulse"/>
                    )}
                  </div>

                </div>
              ))}

                {responses.length > 0 && (
                  <button
                   onClick={playWithGoogleVoice}
                 className="sticky bottom-1 right-1 float-right p-2 rounded-full bg-gray-300 hover:bg-gray-200 transition-all duration-200"
                 >
                {isPlaying ? (
                <Pause className="w-4 h-4 text-emerald-800" />
                ) : (
                <Play className="w-4 h-4 text-emerald-800" />
                  )}
                </button>
                  )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-28px); }
        }

        .wave-dot {
          animation: wave 2s infinite;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4ade80 #ffffff;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4ade80;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;