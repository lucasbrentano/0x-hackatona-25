import React, { useEffect, useState } from 'react';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  children: React.ReactNode;
};

export default function CustomSnackbar({
  visible,
  onDismiss,
  duration = 3000,
  children,
}: Props) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 px-4 pb-10">
      <div 
        className="bg-white rounded-lg shadow-lg px-4 py-3 max-w-sm w-full cursor-pointer"
        onClick={onDismiss}
      >
        <p className="text-center text-gray-500 font-normal text-sm">
          {children}
        </p>
      </div>
    </div>
  );
}