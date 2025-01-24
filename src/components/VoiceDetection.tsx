import React, { useState, useEffect } from 'react';
import { useMicVAD } from "@ricky0123/vad-react";
import { Mic } from 'lucide-react';

const SimpleVoiceDetector = () => {
  const [showNoVoice, setShowNoVoice] = useState(false);
  
  const vad = useMicVAD({
    onSpeechEnd: () => {
      console.log("Speech ended");
    }
  });
 
  useEffect(() => {
    let timer;
    if (!vad.userSpeaking) { 
      timer = setTimeout(() => {
        setShowNoVoice(true);
      }, 10000);
    } else {
      setShowNoVoice(false);
    }
    return () => clearTimeout(timer);
  }, [vad.userSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <Mic 
        className={`w-16 h-16 ${vad.userSpeaking ? 'text-green-500 animate-pulse' : 'text-gray-400'}`}
      />
      
      <div className="text-lg font-medium">
        {vad.userSpeaking ? (
          <span className="text-green-500">Voice Detected!</span>
        ) : showNoVoice ? (
          <span className="text-red-500">No Voice Detected</span>
        ) : (
          <span className="text-blue-500">Listening...</span>
        )}
      </div>
    </div>
  );
};

export default SimpleVoiceDetector;