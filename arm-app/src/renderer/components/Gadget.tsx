import React from 'react';
import { Activity } from 'lucide-react';

interface GadgetProps {
  onExpand: () => void;
}

const Gadget: React.FC<GadgetProps> = ({ onExpand }) => {
  const handleClick = () => {
    onExpand();
    if (window.electronAPI) {
      window.electronAPI.expandGadget();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <div 
        className="gadget-container"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Expandir ARM - Apoio à Receita Médica"
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <Activity className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default Gadget;