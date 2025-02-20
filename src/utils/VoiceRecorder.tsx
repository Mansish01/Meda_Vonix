import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, X } from 'lucide-react';

interface ResponseEntry {
  text: string;
  timestamp: string;
  audioUrl?: string;
}

interface TranscriptionResponse {
  problem_description: string;
}

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const [currentStreamingText, setCurrentStreamingText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showRipple, setShowRipple] = useState(false);

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

  const startRecording = async () => {
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
      setShowRipple(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMessage('Error accessing microphone.');
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setShowRipple(false);
      setMessage('Processing recording...');
    }
  };

  const uploadAudio = async (audioBlob: Blob | null) => {
    if (!audioBlob) {
      setMessage('No audio to upload.');
      return;
    }

    const formData = new FormData();
    const files = new File([audioBlob], 'recording.webm', {
      type: 'audio/webm',
    });
    
    formData.append('audio_file', files);

    try {
      const response = await fetch('patient/problem', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const textResponse = await response.text();
      
      if (!textResponse) {
        throw new Error('Empty response from server');
      }

      try {
        const processedData: TranscriptionResponse = JSON.parse(textResponse);
        
        if (processedData.problem_description) {
          const newResponse: ResponseEntry = {
            text: '',  
            timestamp: new Date().toLocaleTimeString()
          };
          
          setResponses(prev => [...prev, newResponse]);
          setCurrentStreamingText(processedData.problem_description);
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
      setMessage('Upload failed. Please try again.');
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className=" rounded-lg p-8 w-[500px] max-h-[600px] relative flex flex-col items-center">
        {/* <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button> */}

        {!isRecording && (
          <div className="mb-8">
            <p className="text-white text-xl font-bold text-center">Press to speak</p>
          </div>
        )}

        {isRecording && (
          <div className="flex gap-3 mb-8">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="wave-dot w-6 h-6 bg-white rounded-full transition-transform duration-100"
                style={{
                  animationDelay: `${index * 250}ms`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-6 relative">
          {showRipple && (
            <>
              <div className="ripple-1 absolute inset-0 rounded-full bg-white/20" />
              <div className="ripple-2 absolute inset-0 rounded-full bg-white/20" />
              <div className="ripple-3 absolute inset-0 rounded-full bg-white/20" />
            </>
          )}
          <button
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              p-4
              rounded-full
              transition-all
              duration-200
              z-10
              ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-white hover:bg-gray-200'}
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white"/>
            ) : (
              <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-emerald-800'}`} />
            )}
          </button>
        </div>

        {responses.length > 0 && (
          <div className="w-full bg-white rounded-lg p-4 shadow-lg mt-6">
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

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .wave-dot {
          animation: wave 2s infinite;
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .ripple-1 {
          animation: ripple 2s linear infinite;
        }

        .ripple-2 {
          animation: ripple 2s linear infinite;
          animation-delay: 0.6s;
        }

        .ripple-3 {
          animation: ripple 2s linear infinite;
          animation-delay: 1.2s;
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

export default VoiceRecorderModal;