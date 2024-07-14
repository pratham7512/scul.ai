import React from 'react';

const Sidebar = ({ isOpen, chatHistory, onClose }:any) => {
  return (
    <div className={`bg-black border-r z-10 border-gray-700 hover:border-white hover:transition-none text-white w-64 h-screen overflow-y-auto fixed left-0 top-0 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium">Projects</h2>
          <button 
            className="md:hidden p-2 rounded"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <ul>
          {chatHistory.map((chat:any, index:any) => (
            <li key={index} className="mb-2 p-2 bg-gray-900 rounded">
              <p className="text-sm">{chat.message}</p>
              <p className="text-xs text-gray-400">{chat.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;