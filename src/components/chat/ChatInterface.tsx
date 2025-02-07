import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Send, User, History, LogOut, Settings, Calendar, MessageCircle, Mic, MessageCircleCodeIcon } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const ChatInterface: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isUserMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { type: 'user', content: inputMessage }]);
      setInputMessage('');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: "I'm a demo chatbot. I'll be fully functional soon!" }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#104823] w-full px-4 py-2 flex justify-between items-center z-50 backdrop-filter backdrop-blur-lg bg-opacity-80">
        <div className="flex items-center ml-sti">
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#174627] rounded-lg mr-2"
            >
              <Menu size={20} color='white' />
            </button>
          )}
          <img src="https://i.ibb.co/6RGt3CCZ/Minimalist-Hospital-and-Medical-Health-Logo.png" alt="logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold text-white">Mero Doctor</span>
        </div>
        
        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 hover:bg-[#174627] rounded-lg"
          >
            <User size={24} color='white'/>
            <span className="text-white hidden md:inline">Samyam Shrestha</span>
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                <User size={16} className="mr-2" />
                My Account
              </a>
              <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                <History size={16} className="mr-2" />
                Chat History
              </a>
              <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600">
                <LogOut size={16} className="mr-2" />
                Logout
              </a>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 w-50 h-full bg-[#1E5631] text-white transition-transform duration-300 ease-in-out z-40 backdrop-filter backdrop-blur-lg bg-opacity-80 flex flex-col justify-between`}> 
          <div className="p-4">
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-1 right-4 p-2 hover:bg-[#174627] rounded-lg"
              >
                <X size={18} />
              </button>
            )}
            <button className="w-full bg-[#e5fbf1] text-[#1E5631] rounded-lg py-2 mb-4 hover:bg-gray-100 transition-colors mt-8 md:mt-0 flex items-center justify-center space-x-2">
              <MessageCircleCodeIcon size={16} />
              <span>New Chat</span>
            </button>
            <div className="space-y-2">
                <div className="p-2 hover:bg-[#174627] rounded cursor-pointer flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Previous Chat 1</span>
                </div>
                <div className="p-2 hover:bg-[#174627] rounded cursor-pointer flex items-center space-x-2 mt-2">
                  <MessageCircle size={16} />
                  <span>Previous Chat 2</span>
                </div>
            </div>
          </div>
          {/* Bottom Section */}
          <div className="p-4 mt-auto">
            <div className="p-2 hover:bg-[#174627] rounded cursor-pointer flex items-center space-x-2">
              <Settings size={16} />
              <span>Settings</span>
            </div>
            <div className="p-2 hover:bg-[#174627] rounded cursor-pointer flex items-center space-x-2 mt-2">
              <Calendar size={16} />
              <span>My Appointment</span>
            </div>
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#dff2e9] relative">
          {/* Messages container with conditional overflow */}
          <div className={`flex-1 p-4 space-y-4 pb-24 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-gray-700 font-belleza">Welcome to Mero Doctor 🩺 </h1>
                  <p className="text-gray-500">How may I help you today?</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user' 
                      ? 'bg-[#1E5631] text-white' 
                      : 'bg-white text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area - Now with increased width */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl mx-auto bg-[#e5fbf1] p-4 rounded-2xl backdrop-filter backdrop-blur-lg bg-opacity-90 shadow-lg">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1E5631] max-h-32"
                rows={1}
              />
              <button type="submit" className="bg-[#1E5631] text-white rounded-lg px-4 py-2 hover:bg-[#174627] transition-colors">
                <Send size={20} />
              </button>
              <button type="button" className="bg-[#1E5631] text-white rounded-lg px-4 py-2 hover:bg-[#174627] transition-colors">
                <Mic size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
