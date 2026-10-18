import React, { useState,useEffect } from 'react'
import { images } from '../../assets/Photo';
import { api } from '../../utils/apiClient';
import EarningCards from './EarningCards';
import { useNavigate } from 'react-router-dom';
import ReferalActivities from '../../pages/ReferalActivities';

function formatMoney(value) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value));
}

function percentChange(current, previous) {
  const c = Number(current);
  const p = Number(previous);
  if (p === 0) return null;            // can't divide by zero; "no comparison" instead of a fake number
  return Math.round(((c - p) / p) * 100);
}

export default function DashBody() {
   console.log("DASHBODY FILE VERSION CHECK 1");
    const navigate = useNavigate();

const [ambassador, setAmbassador] = useState(null);
const [stats, setStats] = useState(null);
const [loadingAmbassador, setLoadingAmbassador] = useState(true);

useEffect(() => {
  async function fetchDashboard() {
    try {
      const [meRes, statsRes] = await Promise.all([
        api.get('/api/ambassadors/me'),
        api.get('/api/ambassadors/me/stats'),
      ]);
      setAmbassador(meRes.data.ambassador);
      setStats(statsRes.data.stats);
    } catch (err) {
      setAmbassador(null);
    } finally {
      setLoadingAmbassador(false);
    }
  }
  fetchDashboard();
}, []);

    const [copy, setCopy] = useState(false)
  
    const handleCopy =()=>{
        navigator.clipboard.writeText(referralLink);
        setCopy(true)
        setTimeout(()=>{
            setCopy(false)
        }, 2000)
    }
   const handleEmail = () => {
  window.location.href = `mailto:?subject=Join Travora&body=Hey! I found Travora, a platform that offers incredible travel experiences. I think you'd love it! Use my referral link to sign up and get started: ${referralLink}`;
};
    const handleFacebookShare = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${ShareUrl}`, "_blank");
};
const handleTwitterShare = () => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Join Travora! Incredible travel experiences. Sign up with my referral link: ")}&url=${ShareUrl}`, "_blank");
};
    
if (loadingAmbassador) {
  return <div className="p-8 text-gray-500">Loading your dashboard...</div>;
}

if (!ambassador || ambassador.status !== 'active') {
  return (
    <div className="w-full max-w-[1580px] mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl shadow-md p-10 text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-[#333232] mb-3">
          {ambassador?.status === 'rejected' ? 'Application Not Approved' : 'Application Under Review'}
        </h1>
        <p className="text-gray-600">
          {ambassador?.status === 'rejected'
            ? 'Your ambassador application was not approved. Contact support if you think this is a mistake.'
            : 'Thanks for applying! An admin is reviewing your ambassador application. You\'ll get full dashboard access once approved.'}
        </p>
      </div>
    </div>
  );
}

  
    const referralLink = `${window.location.origin}/signup?ref=${ambassador.referral_code}`;
    const ShareUrl = encodeURIComponent(referralLink)

  return (
    <div className='w-full max-w-[1580px] mx-auto min-h-screen rounded-t-[5px] px-4 sm:px-6 lg:px-8'>
      <div className=''>
        <h1 className="text-[#333232] py-4 font-bold text-2xl md:text-[36px] leading-[150%] tracking-[0.4%]">Referral Dashboard</h1>
        <div className='flex flex-col lg:flex-row gap-6 items-start'>
           {/* left side*/} 
           <div className='flex flex-col gap-3 w-full'>
            <div className='shadow-[0px_2px_6.47px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-center justify-between w-full rounded-3xl overflow-hidden'
             style={{
       background: 'linear-gradient(180deg, #245B87 0%, #34627A 33%, #4E597B 66%, #677AF0 100%)'
     }}>
                    {/*text content*/}
                    <div className='space-y-6 px-4 py-6 md:px-10 lg:px-16 md:py-10 lg:py-16 flex flex-col gap-2 w-full lg:max-w-[560px]'>
                      <p className="text-[#FFFFFF] w-full max-w-[560px] text-base md:text-[20px] leading-[150%]">Refer your friends to Travora and earn a commission for every successful referral.</p>
                      <p className='text-[#FFFFFF] w-full max-w-[560px] text-base md:text-[20px] leading-[150%]'>Invite & earn with Travora! Share your unique referral link and get rewarded when your referrals book a consultation. Start building your passive income.</p>
                    </div>
                    {/*illustration*/}
                    <div className='w-full lg:w-[560px] px-4 py-6'>
                      <img src={images.referal} alt="referal" className='w-full h-auto max-h-[260px] object-cover rounded-3xl' />
                    </div>
             
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Viaggio Abroad Referral Code:
      </h2>

      {/* Copy Link Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
        <button
          onClick={handleCopy}
          className="px-2 md:px-6 py-3 bg-[#345867] text-white font-semibold rounded-lg hover:bg-[#2a4755] transition"
        >
          {copy ? "COPIED!" : "COPY"}
        </button>
      </div>

      {/* Share Buttons */}
      <div>
        <p className="text-[20px] text-[#333232] leading-[150%] mb-3">Share with:</p>
        <div className="flex gap-3 space-x-6 flex-wrap">
          {/* Email */}
          <button onClick={handleEmail} className="flex items-center gap-2 px-4 md:px-10 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <span>✉️</span>
            <span className="text-sm text-gray-700">Email</span>
          </button>

          {/* Facebook */}
          <button onClick={handleFacebookShare} className="flex items-center gap-2 px-4 md:px-10 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <span>📘</span>
            <span className="text-sm text-gray-700">Facebook</span>
          </button>

          {/* Instagram */}
          <button className="flex items-center gap-2 px-4 md:px-10 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <span>📷</span>
            <span className="text-sm text-gray-700">Instagram</span>
          </button>

          {/* Twitter */}
          <button onClick={handleTwitterShare} className="flex items-center gap-2 px-4 md:px-10 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <span>🐦</span>
            <span className="text-sm text-gray-700">Twitter</span>
          </button>
        </div>
      </div>
      {/* text beneath */}
      <div className='py-4 md:py-6 w-full'>
        <p className='text-[15px] leading-[150%] tracking-[0.4%] text-gray-500'>Just make sure they use this link to book consultation and earn a fee. To view details, visit <span className='text-[#345867]'>Terms & Conditions</span>. To see your Refer-A-Friend bonus, please go to your <span className='text-[#345867]'>Referral Activity</span>.</p>
      </div>
    </div>
           </div>
           {/* RIGHT SIDE - New Section */}
<div className='flex flex-col gap-6 max-w-[570px] w-full'>
  {/* How It Works Card */}
  <div className='bg-white rounded-lg shadow-md p-6'>
    <h2 className='text-xl font-semibold text-[#333232] mb-6'>How It Works</h2>
    
    <div className='space-y-5'>
      {/* Step 1 */}
      <div className='flex gap-4'>
        <div className='flex-shrink-0 w-8 h-8 rounded-full bg-[#333232] text-white flex items-center justify-center font-semibold text-sm'>
          1
        </div>
        <div>
          <h3 className='font-semibold text-[#333232] text-base mb-1'>
            Share your Viaggio Abroad Link
          </h3>
          <p className='text-sm text-gray-600 leading-relaxed'>
            to your social media followers
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className='flex gap-4'>
        <div className='flex-shrink-0 w-8 h-8 rounded-full bg-[#333232] text-white flex items-center justify-center font-semibold text-sm'>
          2
        </div>
        <div>
          <h3 className='font-semibold text-[#333232] text-base mb-1'>
            They use the link to book consultation,
          </h3>
          <p className='text-sm text-gray-600 leading-relaxed'>
            when they book consultation successfully
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className='flex gap-4'>
        <div className='flex-shrink-0 w-8 h-8 rounded-full bg-[#333232] text-white flex items-center justify-center font-semibold text-sm'>
          3
        </div>
        <div>
          <h3 className='font-semibold text-[#333232] text-base mb-1'>
            You get a share of their consultation fee!
          </h3>
          <p className='text-sm text-gray-600 leading-relaxed'>
            Terms & condition apply.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Referral Activities Card */}
  <div className='bg-white rounded-lg shadow-md p-6'>
    <h2 className='text-xl font-semibold text-[#333232] mb-4'>Referral Activities</h2>
    
   <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-6'>
      <p className='text-sm text-gray-600 leading-relaxed mb-4'>
      Analyze the performance of your referrals, track sign-ups, and measure the success of the referral program.
    </p>

    {/* Simple chart placeholder */}
   <div className='flex items-end justify-center gap-2 h-24 mb-6 px-4'>
  {/* Bar 1 with baseline */}
  <div className='flex flex-col items-center gap-2'>
    <div className='w-1 bg-[#345867] rounded-t' style={{height: '40px'}}></div>
    <div className='w-4 h-[2px] bg-[#345867]'></div> {/* Horizontal baseline */}
  </div>

  {/* Bar 2 with baseline */}
  <div className='flex flex-col items-center gap-2'>
    <div className='w-1 bg-[#345867] rounded-t' style={{height: '70px'}}></div>
    <div className='w-4 h-[2px] bg-[#345867]'></div>
  </div>

  {/* Bar 3 with baseline */}
  <div className='flex flex-col items-center gap-2'>
    <div className='w-1 bg-[#345867] rounded-t' style={{height: '55px'}}></div>
    <div className='w-4 h-[2px] bg-[#345867]'></div>
  </div>

  {/* Bar 4 with baseline */}
  <div className='flex flex-col items-center gap-2'>
    <div className='w-1 bg-[#345867] rounded-t' style={{height: '85px'}}></div>
    <div className='w-4 h-[2px] bg-[#345867]'></div>
  </div>
</div>
   </div>

    <button onClick={()=>navigate("/referal-activities")} className='w-full bg-[#345867] text-white font-semibold py-3 rounded-lg hover:bg-[#2a4755] transition'>
      View Referral Activity
    </button>
  </div>
</div>
        </div>
      <div>
 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 py-4 w-full'>
  {/* Card 1 - Earnings this month */}
  <EarningCards
    title="Earnings this month"
    amount={formatMoney(stats?.earningsThisMonth ?? 0)}
    percentageChange={percentChange(stats?.earningsThisMonth, stats?.earningsLastMonth)}
    subText={Number(stats?.earningsLastMonth) === 0 ? 'No earnings last month' : 'vs previous month'}
    isActive={true}
  />

  {/* Card 2 - Total earnings */}
  <EarningCards
    title="Total earnings (All-time)"
    amount={formatMoney(stats?.totalEarnings ?? 0)}
    subText="Approved and paid commissions"
  />

  {/* Card 3 - Referrals */}
  <EarningCards
    title="Referrals this month"
    amount={String(stats?.referralsThisMonth ?? 0)}
    percentageChange={percentChange(stats?.referralsThisMonth, stats?.referralsLastMonth)}
    subText={Number(stats?.referralsLastMonth) === 0 ? 'No referrals last month' : 'vs previous month'}
  />

  {/* Card 4 - Available balance with button */}
  <EarningCards
    title="Available balance"
    amount={formatMoney(stats?.availableBalance ?? 0)}
    showButton={true}
    buttonText="Check Earning"
    onButtonClick={() => navigate("/ambassador-reward")}
  />
</div>
</div>
    </div>
    </div>
  )
}
