// FeedbackBox.tsx
import React from 'react';
import { User2 } from 'lucide-react';

interface FeedbackBoxProps {
  userName: string;
  text: string;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ userName, text }) => {
  return (
    <div className="flex flex-col w-full max-w-md rounded-2xl bg-gray-200 p-4 shadow-md">
      <div className="flex items-center gap-2 bg-emerald-400 text-black font-semibold text-sm px-3 py-1 rounded-t-2xl">
        <User2 size={16} />
        <span>{userName}</span>
      </div>
      <div className="text-sm text-gray-800 p-2">
        {text}
      </div>
    </div>
  );
};

export default FeedbackBox;