import React, { useState, useEffect } from 'react';
import { images } from '../../assets/Photo';
import { api } from '../../utils/apiClient';
import { showSuccess, showError } from '../../utils/toastConfig';
import AccountSetupModal from './AccountSetupModal';
import PayoutModal from './PayoutModal';

// The database stores keys like 'bank_transfer'; people should read friendly words.
const methodLabels = {
  bank_transfer: 'bank account',
  mobile_money: 'mobile money wallet',
  paypal: 'PayPal account',
  crypto: 'crypto wallet',
};

function formatMoney(value) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value));
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AmbassadorRewards() {
  // ═══════════ STATE ═══════════
  const [rewards, setRewards] = useState(null);       // everything from the server
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [requesting, setRequesting] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [showAll, setShowAll] = useState(false);

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isAccountSetupModalOpen, setIsAccountSetupModalOpen] = useState(false);

  // ═══════════ LOAD DATA ═══════════
  const loadRewards = async () => {
    try {
      const res = await api.get('/api/ambassadors/me/rewards');
      setRewards(res.data.rewards);
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  // ═══════════ EARLY RETURNS (after all hooks) ═══════════
  if (loading) {
    return <div className="p-8 text-gray-500">Loading your rewards...</div>;
  }

  if (loadError || !rewards) {
    return (
      <div className="p-8">
        <p className="text-red-500 mb-3">{loadError || 'Could not load your rewards.'}</p>
        <button
          onClick={() => { setLoading(true); loadRewards(); }}
          className="px-4 py-2 bg-[#456573] text-white rounded-lg"
        >
          Try again
        </button>
      </div>
    );
  }

  // ═══════════ DERIVED VALUES ═══════════
  const { availableBalance, payoutMethod, payoutSetup, hasOpenPayout, history } = rewards;

  const PREVIEW_COUNT = 3;
  const currentYear = String(new Date().getFullYear());
  const years = [...new Set([currentYear, ...history.map((i) => String(new Date(i.date).getFullYear()))])]
    .sort((a, b) => b - a);

  const getFilteredHistory = () => {
    let filtered = history.filter(
      (item) => String(new Date(item.date).getFullYear()) === selectedYear
    );
    if (activeTab === 'deposits') filtered = filtered.filter((i) => i.type === 'deposit');
    else if (activeTab === 'transfers') filtered = filtered.filter((i) => i.type === 'transfer');
    return filtered;
  };

  const filteredHistory = getFilteredHistory();
  const visibleHistory = showAll ? filteredHistory : filteredHistory.slice(0, PREVIEW_COUNT);
  const hasMore = filteredHistory.length > PREVIEW_COUNT;

  // ═══════════ HANDLERS ═══════════
  const handleYearChange = (year) => { setSelectedYear(year); setShowAll(false); };
  const handleTabChange = (tab) => { setActiveTab(tab); setShowAll(false); };
  const toggleShowAll = () => setShowAll((prev) => !prev);

  const openPayoutModal = () => setIsPayoutModalOpen(true);
  const closePayoutModal = () => setIsPayoutModalOpen(false);
  const continueToAccountSetup = () => { setIsPayoutModalOpen(false); setIsAccountSetupModalOpen(true); };
  const closeAccountSetupModal = () => setIsAccountSetupModalOpen(false);
  const backToPayoutModal = () => { setIsAccountSetupModalOpen(false); setIsPayoutModalOpen(true); };

  const handleRequestPayout = async () => {
    const ok = window.confirm(
      `Request a payout of ${formatMoney(availableBalance)} to your ${methodLabels[payoutMethod]}?`
    );
    if (!ok) return;

    setRequesting(true);
    try {
      await api.post('/api/ambassadors/payouts', {});
      showSuccess('Payout requested! We will review it shortly.');
      await loadRewards();            // refresh balance, history and button
    } catch (err) {
      showError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  // ═══════════ WHICH BUTTON DO WE SHOW? ═══════════
  let mainButton;
  if (!payoutSetup) {
    mainButton = { label: 'Continue', disabled: false, onClick: openPayoutModal };
  } else if (hasOpenPayout) {
    mainButton = { label: 'Payout in progress', disabled: true, onClick: undefined };
  } else if (Number(availableBalance) <= 0) {
    mainButton = { label: 'No funds available yet', disabled: true, onClick: undefined };
  } else {
    mainButton = {
      label: requesting ? 'Requesting...' : `Request payout of ${formatMoney(availableBalance)}`,
      disabled: requesting,
      onClick: handleRequestPayout,
    };
  }

  // ═══════════ RENDER ═══════════
  return (
    <div className="bg-gray-50 p-6 min-h-screen">

      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={closePayoutModal}
        onContinue={continueToAccountSetup}
      />

      <AccountSetupModal
        isOpen={isAccountSetupModalOpen}
        onClose={closeAccountSetupModal}
        onBack={backToPayoutModal}
        onSaved={loadRewards}
      />

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Rewards</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT CARD - Current Rewards Balance */}
          <div className="bg-white rounded-lg shadow-md p-6">

            <h2 className="text-sm font-semibold text-gray-700 mb-1">Current Rewards Balance</h2>
            <p className="text-xs text-gray-500 mb-2">Transferable Amount</p>
            <p className="text-3xl font-bold text-gray-800 mb-6">{formatMoney(availableBalance)}</p>

            {!payoutSetup ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-start shadow-sm gap-4">
                <div className="hidden sm:block flex-shrink-0">
                  <div className="h-[70px] w-[70px] bg-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={images.benance} alt="Bank icon" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Set up your payout account to get paid
                  </p>
                  <p className="text-xs text-gray-500">
                    To get paid, you'll need to set up your payout account.
                    It should only take a few minutes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Payouts go to your {methodLabels[payoutMethod]}
                </p>
                <button
                  onClick={() => setIsAccountSetupModalOpen(true)}
                  className="text-xs text-[#456573] hover:underline font-medium"
                >
                  Change payout details
                </button>
              </div>
            )}

            <button
              onClick={mainButton.onClick}
              disabled={mainButton.disabled}
              className={`w-full font-medium py-3 rounded-lg transition-colors ${
                mainButton.disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#456573] hover:bg-[#3a5461] text-white'
              }`}
            >
              {mainButton.label}
            </button>
          </div>

          {/* RIGHT CARD - Payout History */}
          <div className="bg-white rounded-lg shadow-md p-6">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Payout History</h2>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

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

            <div className="space-y-3">
              {visibleHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">{item.type === 'deposit' ? '+' : '−'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${item.type === 'deposit' ? 'text-teal-600' : 'text-gray-700'}`}>
                    {item.type === 'deposit' ? '+ ' : '− '}{formatMoney(item.amount)}
                  </p>
                </div>
              ))}

              {filteredHistory.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-8">
                  No payout history available for {selectedYear}
                </p>
              )}
            </div>

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={toggleShowAll}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  {showAll ? 'Show less' : `View all (${filteredHistory.length})`}
                  <svg
                    className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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