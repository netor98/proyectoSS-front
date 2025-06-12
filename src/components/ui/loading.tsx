import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  className,
  fullScreen = false
}) => {
  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && (
        <p className={cn('text-gray-600 dark:text-gray-400', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderDots = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex space-x-1">
        <div className={cn('bg-blue-600 rounded-full animate-bounce',
          size === 'sm' ? 'w-2 h-2' :
          size === 'md' ? 'w-3 h-3' :
          size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
        )} style={{ animationDelay: '0ms' }}></div>
        <div className={cn('bg-blue-600 rounded-full animate-bounce',
          size === 'sm' ? 'w-2 h-2' :
          size === 'md' ? 'w-3 h-3' :
          size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
        )} style={{ animationDelay: '150ms' }}></div>
        <div className={cn('bg-blue-600 rounded-full animate-bounce',
          size === 'sm' ? 'w-2 h-2' :
          size === 'md' ? 'w-3 h-3' :
          size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
        )} style={{ animationDelay: '300ms' }}></div>
      </div>
      {text && (
        <p className={cn('text-gray-600 dark:text-gray-400', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderPulse = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={cn('bg-blue-600 rounded-full animate-pulse', sizeClasses[size])}></div>
      {text && (
        <p className={cn('text-gray-600 dark:text-gray-400 animate-pulse', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  const renderSkeleton = () => (
    <div className="space-y-3">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className={cn('p-6', className)}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      {renderContent()}
    </div>
  );
};

// Specific loading components for common use cases
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => (
  <Loader2 className={cn('animate-spin', sizeClasses[size])} />
);

export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Cargando...' }) => (
  <Loading variant="spinner" size="lg" text={text} fullScreen />
);

export const CardLoading: React.FC = () => (
  <div className="p-6 space-y-4">
    <Loading variant="skeleton" />
  </div>
);

export const InlineLoading: React.FC<{ text?: string }> = ({ text }) => (
  <Loading variant="dots" size="sm" text={text} className="py-2" />
);

export default Loading;
