import { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card = ({ children, className, hoverable = false, onClick }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        hoverable && 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

Card.Header = ({ children, className }: CardHeaderProps) => (
  <div className={cn('px-6 py-4 border-b border-gray-100', className)}>
    {children}
  </div>
);

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

Card.Body = ({ children, className }: CardBodyProps) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

Card.Footer = ({ children, className }: CardFooterProps) => (
  <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl', className)}>
    {children}
  </div>
);

export default Card;
