
import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Heart, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

interface Interest {
  id: string;
  name: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [showInterests, setShowInterests] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonInterests = [
    'Gaming', 'Movies', 'Music', 'Sports', 'Travel', 'Food', 'Books', 
    'Technology', 'Art', 'Photography', 'Fitness', 'Cooking'
  ];

  const anonymousNames = [
    'Anonymous Owl', 'Mystery Cat', 'Secret Panda', 'Hidden Fox', 
    'Stealth Bear', 'Phantom Wolf', 'Ghost Rabbit', 'Shadow Duck'
  ];

  // Simulate partner messages when matched
  useEffect(() => {
    if (!isMatched) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 4 seconds
        const randomMessages = [
          "Hey! Nice to meet you! 😊",
          "What are you up to today?",
          "This is pretty cool, right?",
          "Where are you from?",
          "What do you like to do for fun?",
          "Have you used apps like this before?",
          "Hope you're having a good day!",
          "What's your favorite hobby?",
          "Any interesting plans for the weekend?",
          "This anonymous chat is fun!"
        ];
        
        const randomText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        const newMsg: Message = {
          id: Date.now().toString(),
          text: randomText,
          isOwn: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMsg]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isMatched]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addInterest = (interestName: string) => {
    if (interests.length >= 5) return; // Limit to 5 interests
    
    const newInterestObj: Interest = {
      id: Date.now().toString(),
      name: interestName
    };
    setInterests(prev => [...prev, newInterestObj]);
    setNewInterest('');
  };

  const removeInterest = (id: string) => {
    setInterests(prev => prev.filter(interest => interest.id !== id));
  };

  const startMatching = () => {
    setIsMatching(true);
    setShowInterests(false);
    
    // Simulate matching process
    setTimeout(() => {
      const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
      setPartnerName(randomName);
      setIsMatched(true);
      setIsMatching(false);
    }, 2000 + Math.random() * 3000); // 2-5 seconds
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isMatched) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isOwn: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const disconnectChat = () => {
    setIsMatched(false);
    setIsMatching(false);
    setMessages([]);
    setPartnerName('');
    setShowInterests(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Random Chat</h1>
                <p className="text-gray-600 text-sm">
                  {isMatched ? `Chatting with ${partnerName}` : 'Connect with random people'}
                </p>
              </div>
            </div>
            {isMatched && (
              <Button 
                onClick={disconnectChat}
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </header>

        {/* Interest Selection */}
        {showInterests && (
          <div className="bg-white p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Your Interests (Optional)</h2>
            <p className="text-gray-600 text-sm mb-4">
              Add interests to get matched with someone who shares them, or skip for random matching
            </p>
            
            {/* Selected Interests */}
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((interest) => (
                <div key={interest.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {interest.name}
                  <button onClick={() => removeInterest(interest.id)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Interest */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Type an interest..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && newInterest.trim() && addInterest(newInterest)}
              />
              <Button 
                onClick={() => newInterest.trim() && addInterest(newInterest)}
                disabled={interests.length >= 5}
                size="sm"
              >
                Add
              </Button>
            </div>

            {/* Common Interests */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Or choose from common interests:</p>
              <div className="flex flex-wrap gap-2">
                {commonInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    disabled={interests.length >= 5 || interests.some(i => i.name === interest)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Matching Button */}
            <Button onClick={startMatching} className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              {interests.length > 0 ? 'Find Someone with Similar Interests' : 'Find Random Person'}
            </Button>
          </div>
        )}

        {/* Matching Screen */}
        {isMatching && (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Finding Your Match...</h2>
              <p className="text-gray-600">
                {interests.length > 0 
                  ? 'Looking for someone who shares your interests...' 
                  : 'Connecting you with a random person...'
                }
              </p>
              {interests.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {interests.map((interest) => (
                    <span key={interest.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {interest.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        {isMatched && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-16 h-16 text-pink-400 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Connected!</h2>
                  <p className="text-gray-600 mb-2">Say hello to {partnerName}</p>
                  {interests.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">Shared interests:</span>
                      {interests.slice(0, 3).map((interest) => (
                        <span key={interest.id} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {interest.name}
                        </span>
                      ))}
                    </div>
                  )}
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
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={500}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-500 hover:bg-blue-600 text-white transition-colors shrink-0"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-500 text-xs mt-2 text-center">
                Be respectful. You can disconnect anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
