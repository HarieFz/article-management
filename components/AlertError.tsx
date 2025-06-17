import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

export default function AlertError({
  message = "Error! Something went wrong",
  duration = 5000,
  onClose,
}: {
  message?: string | undefined;
  duration: number;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, message]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-top-2 fade-in-0 duration-300">
      <div className="bg-red-50 border border-red-200 text-red-800 shadow-lg rounded-lg p-4 relative">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-red-800 pr-6">{message}</h4>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Close alert"
          >
            <X className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
