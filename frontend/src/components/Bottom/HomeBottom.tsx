import React from 'react';
import { Home, Plus, MessageCircle } from 'lucide-react';

interface HomeBottomProps {
  selectedTab: number;
  onTabChange: (index: number) => void;
}

const HomeBottom: React.FC<HomeBottomProps> = ({ selectedTab, onTabChange }) => {
  const tabs = [
    { icon: Home, label: 'Home' },
    { icon: Plus, label: 'Add' },
    { icon: MessageCircle, label: 'Messages' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center w-full px-4 py-4">
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon;
          const isSelected = selectedTab === index;
          
          return (
            <button
              key={index}
              onClick={() => onTabChange(index)}
              className={`flex flex-col items-center justify-center p-4 transition-all duration-200 ${
                isSelected
                  ? 'text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent
                size={28}
                strokeWidth={isSelected ? 2.5 : 2}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HomeBottom;