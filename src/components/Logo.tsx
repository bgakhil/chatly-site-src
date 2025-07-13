
import { MessageCircle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: 'gap-2',
      icon: 'w-6 h-6',
      iconBg: 'p-1.5',
      text: 'text-lg font-bold'
    },
    md: {
      container: 'gap-3',
      icon: 'w-8 h-8',
      iconBg: 'p-2',
      text: 'text-2xl font-bold'
    },
    lg: {
      container: 'gap-4',
      icon: 'w-12 h-12',
      iconBg: 'p-3',
      text: 'text-4xl font-bold'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.container}`}>
      <div className={`${currentSize.iconBg} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg`}>
        <MessageCircle className={`${currentSize.icon} text-white`} />
      </div>
      {showText && (
        <span className={`${currentSize.text} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          Chatly
        </span>
      )}
    </div>
  );
};

export default Logo;
