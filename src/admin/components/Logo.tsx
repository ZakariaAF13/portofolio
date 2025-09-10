import React from 'react';
import { Tent } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Tent className={`text-primary-500 ${className}`} />
  );
};

export default Logo;