import React from 'react';

interface AdUnitProps {
  type: 'header' | 'inline' | 'sidebar' | 'footer';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type, className = '' }) => {
  const getDimensions = () => {
    switch (type) {
      case 'header': return 'h-[100px] md:h-[90px] w-full max-w-[728px]';
      case 'inline': return 'h-[250px] w-full';
      case 'sidebar': return 'h-[250px] md:h-[600px] w-full md:w-[300px]';
      case 'footer': return 'h-[250px] md:h-[90px] w-full';
      default: return 'h-[250px] w-full';
    }
  };

  return (
    <div className={`bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm font-medium mx-auto my-4 no-print rounded-lg overflow-hidden ${getDimensions()} ${className}`}>
      <div className="text-center p-2">
        <p className="uppercase tracking-wider mb-1 text-xs">Advertisement</p>
        <p className="text-[10px] opacity-75">{type} placement</p>
      </div>
    </div>
  );
};

export default AdUnit;