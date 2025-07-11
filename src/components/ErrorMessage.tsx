import { AlertCircle, X } from "lucide-react";
import React from "react";

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
