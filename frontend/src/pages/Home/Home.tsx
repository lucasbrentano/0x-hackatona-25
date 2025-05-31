import React, { useState } from 'react';
import FeedbackBox from '../../components/Feedback';
import HomeBottom from '../../components/Bottom/HomeBottom';
import { User } from 'lucide-react';

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const feedbacks = [
    { userName: 'User01', text: 'Maecenas non commodo nisi. Integer hendrerit est at ullamcorper tincidunt. Sed lacinia accumsan sapien.' },
    { userName: 'AnonymousUser1005', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet nibh.' },
    { userName: 'User02', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet nibh tincidunt.' },
    { userName: 'AnonymousUser0066', text: 'Maecenas non commodo nisi. Integer hendrerit est at ullamcorper tincidunt. Sed lacinia accumsan sapien.' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-gray-700">Town Square</h1>
        <button>
          <User size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <button className="bg-emerald-400 text-white font-semibold px-4 py-2 rounded-full mb-4">
          Filtros
        </button>

        <div className="flex flex-col gap-4 items-center">
          {feedbacks.map((feedback, index) => (
            <FeedbackBox key={index} userName={feedback.userName} text={feedback.text} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <HomeBottom selectedTab={selectedTab} onTabChange={setSelectedTab} />
    </div>
  );
};

export default Home;