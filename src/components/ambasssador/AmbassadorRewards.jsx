import React, { useState } from 'react';
import { images, payoutHistory } from '../../assets/Photo'; 
import AccountSetupModal from './AccountSetupModal';
import PayoutModal from './PayoutModal';

export default function AmbassadorRewards() {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  const [activeTab, setActiveTab] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showAll, setShowAll] = useState(false);
  
  // Modal states
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isAccountSetupModalOpen, setIsAccountSetupModalOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════
  const PREVIEW_COUNT = 3;
  const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'];

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Extract year from date string (e.g., "December 15, 2026" -> "2026")
  const getYearFromDate = (dateString) => dateString.split(', ')[1];

  // Filter history by year and tab type
  const getFilteredHistory = () => {
    let filtered = payoutHistory.filter(
      (item) => getYearFromDate(item.date) === selectedYear
    );
    
    if (activeTab === 'deposits') {
      filtered = filtered.filter((i) => i.type === 'deposit');
    } else if (activeTab === 'transfers') {
      filtered = filtered.filter((i) => i.type === 'transfer');
    }
    
    return filtered;
  };

  const filteredHistory = getFilteredHistory();
  const visibleHistory = showAll ? filteredHistory : filteredHistory.slice(0, PREVIEW_COUNT);
  const hasMore = filteredHistory.length > PREVIEW_COUNT;

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Handle year change and collapse list
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setShowAll(false);
  };

  // Handle tab change and collapse list
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  // Toggle view all/show less
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODAL HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Open first modal (Payout Terms)
  const openPayoutModal = () => {
    setIsPayoutModalOpen(true);
  };

  // Close first modal
  const closePayoutModal = () => {
    setIsPayoutModalOpen(false);
  };

  // Continue from first modal to second modal (Account Setup)
  const continueToAccountSetup = () => {
    setIsPayoutModalOpen(false);
    setIsAccountSetupModalOpen(true);
  };

  // Close second modal
  const closeAccountSetupModal = () => {
    setIsAccountSetupModalOpen(false);
  };

  // Go back from second modal to first modal
  const backToPayoutModal = () => {
    setIsAccountSetupModalOpen(false);
    setIsPayoutModalOpen(true);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      
      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}
      <PayoutModal 
        isOpen={isPayoutModalOpen}
        onClose={closePayoutModal}
        onContinue={continueToAccountSetup}
      />

      <AccountSetupModal
        isOpen={isAccountSetupModalOpen}
        onClose={closeAccountSetupModal}
        onBack={backToPayoutModal}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Rewards
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ════════════════════════════════════════════════════════════════
              LEFT CARD - Current Rewards Balance
          ════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Balance Header */}
            <h2 className="text-sm font-semibold text-gray-700 mb-1">
              Current Rewards Balance
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              Transferable Amount
            </p>
            <p className="text-3xl font-bold text-gray-800 mb-6">
              $132.45
            </p>

            {/* Setup Account Banner */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-start shadow-sm gap-4">
              <div className="flex-shrink-0">
                <div className="h-[70px] w-[70px] bg-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={images.benance} 
                    alt="Bank icon" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Set up your payout account to get paid
                </p>
                <p className="text-xs text-gray-500">
                  To get paid, you'll need to set up your payout account. 
                  It should only take a few minutes.
                </p>
              </div>
            </div>

            {/* Continue Button - Opens Modal */}
            <button
              onClick={openPayoutModal}
              className="w-full bg-[#456573] hover:bg-[#3a5461] text-white font-medium py-3 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT CARD - Payout History
          ════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Header with Year Dropdown */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Payout History
              </h2>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'all', label: 'All' },
                { key: 'deposits', label: 'Reward Deposits' },
                { key: 'transfers', label: 'Reward Transfers' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === key
                      ? 'bg-[#456573] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {visibleHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">—</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-teal-600">
                    + ${item.amount.toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Empty State */}
              {filteredHistory.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-8">
                  No payout history available for {selectedYear}
                </p>
              )}
            </div>

            {/* View All / Show Less Button */}
            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={toggleShowAll}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  {showAll 
                    ? 'Show less' 
                    : `View all (${filteredHistory.length})`
                  }
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showAll ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}