
import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
  sender: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(42);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample anonymous names for random senders
  const anonymousNames = [
    'Anonymous Owl', 'Mystery Cat', 'Secret Panda', 'Hidden Fox', 
    'Stealth Bear', 'Phantom Wolf', 'Ghost Rabbit', 'Shadow Duck',
    'Mystic Deer', 'Silent Tiger'
  ];

  // Simulate receiving random messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        const randomMessages = [
          "Hey everyone! How's your day going? 😊",
          "Anyone else procrastinating right now? 😅",
          "Just discovered this app, pretty cool!",
          "What's the weather like where you are?",
          "Random thought: pineapple on pizza is actually great 🍕",
          "Does anyone have any good book recommendations?",
          "Working late tonight, anyone else?",
          "Just wanted to say hi to everyone! 👋",
          "This anonymous chat is so fun!",
          "Hope you all are having a great day! ✨"
        ];
        
        const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
        const randomText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        const newMsg: Message = {
          id: Date.now().toString(),
          text: randomText,
          isOwn: false,
          timestamp: new Date(),
          sender: randomName
        };
        
        setMessages(prev => [...prev, newMsg]);
        setOnlineCount(prev => Math.max(20, Math.min(99, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isOwn: true,
      timestamp: new Date(),
      sender: 'You'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-blue-600">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Anonymous Chat</h1>
                <p className="text-white/80 text-sm">Chat with random people worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white font-medium">{onlineCount} online</span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl max-w-md">
                <MessageCircle className="w-16 h-16 text-white/80 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Anonymous Chat!</h2>
                <p className="text-white/80 mb-4">
                  Start a conversation with random people from around the world. 
                  No registration required - just type and send!
                </p>
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Waiting for messages...</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl ${
                    message.isOwn
                      ? 'bg-white text-gray-800 rounded-br-md'
                      : 'bg-black/20 backdrop-blur-sm text-white rounded-bl-md border border-white/20'
                  }`}
                >
                  {!message.isOwn && (
                    <p className="text-xs opacity-70 mb-1 font-medium">{message.sender}</p>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-gray-500' : 'text-white/60'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white/20 backdrop-blur-lg border-t border-white/20">
          <div className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/90 border-white/20 text-gray-800 placeholder:text-gray-500 focus:bg-white transition-colors"
              maxLength={500}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-white/90 hover:bg-white text-purple-600 hover:text-purple-700 transition-colors shrink-0"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-white/60 text-xs mt-2 text-center">
            Be kind and respectful. Messages are public and anonymous.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Index;
