import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface GlobalErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const GlobalError: React.FC<GlobalErrorProps> = ({
  title = 'System Error Occurred',
  message = 'Failed to communicate with fleet management services. Please check your network connection or try again.',
  onRetry,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4 text-slate-800">
      <div className="flex items-start">
        <div className="p-2 bg-red-100 rounded-lg text-red-600 mr-4 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-red-900">{title}</h4>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
