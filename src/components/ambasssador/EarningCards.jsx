import React from 'react';

export default function EarningsCard({ 
  title, 
  amount, 
  percentageChange, 
  subText, 
  showButton = false,
  buttonText = "Check Earning",
  onButtonClick,
  isActive = false 
}) {
  
  const isPositive = percentageChange >= 0;
  const hasPercentage = percentageChange !== null && 
                        percentageChange !== undefined && 
                        percentageChange !== '';
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-t-4 ${
      isActive ? 'border-[#345867]' : 'border-transparent'
    }`}>
      {/* Title */}
      <p className='text-sm text-gray-500 mb-3'>{title}</p>
      
      {/* Amount */}
      <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
        {amount}
      </h2>
      
      {/* Percentage Change or Button */}
      {showButton ? (
        <button 
          onClick={onButtonClick}
          className='w-full bg-[#345867] text-white font-semibold py-3 rounded-lg hover:bg-[#2a4755] transition'
        >
          {buttonText}
        </button>
      ) : (
        <div className='space-y-1'>
          {/* Percentage */}
           {hasPercentage && (
        <div className='flex items-center gap-2'>
          <span className={`text-sm font-semibold ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? '▲' : '▼'} {Math.abs(percentageChange)}%
          </span>
        </div>
      )}
          
          {/* Subtext */}
          <p className='text-xs text-gray-400'>{subText}</p>
        </div>
      )}
    </div>
  );
}