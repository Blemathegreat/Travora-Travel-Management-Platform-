import React, { useState } from 'react'
import { images } from '../../assets/Photo';
import EarningCards from './EarningCards';
import { useNavigate } from 'react-router-dom';
import ReferalActivities from '../../pages/ReferalActivities';

export default function DashBody() {
    const navigate = useNavigate();
    const [copy, setCopy] = useState(false)
    const referralLink = "https://viaggioabroad.com/signup?ref=your-referral-code";
    const ShareUrl = encodeURIComponent(referralLink)
    const handleCopy =()=>{
        navigator.clipboard.writeText(referralLink);
        setCopy(true)
        setTimeout(()=>{
            setCopy(false)
        }, 2000)
    }
    const handleEmail = ()=>{
        window.location.href=`mailto:?subject=Join Viaggio Abroad&body=Hey! I found this amazing platform called Viaggio Abroad that offers incredible travel experiences. I think you'd love it! Use my referral link to sign up and get started: ${referralLink}`;
    }
    const handleFacebookShare = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${ShareUrl}`, "_blank");
};
const handleTwitterShare = () => {
  window.open(`https://twitter.com/intent/tweet?text="Join Viaggio Abroad! I found this amazing platform called Viaggio Abroad that offers incredible travel experiences. I think you'd love it! Use my referral link to sign up and get started: ${referralLink}"&url=${ShareUrl}`, "_blank");
};
    console.log("im working")
  return (
    <div className='max-w-[1580px]  mx-auto min-h-screen rounded-t-[5px]'>
    <div className=''>
        <h1 className="text-[#333232] py-4 font-bold  text-2xl md:text-[36px] leading-[150%] tracking-[0.4%]">Referral Dashboard</h1>
        <div className='flex gap-3 items-start justify-between'>
           {/* left side*/} 
           <div className='flex flex-col gap-3 max-w-[960px] w-full'>
            <div className='shadow-[0px_2px_6.47px_0px_rgba(0,0,0,0.05)] flex items-center justify-between'
             style={{
       background: 'linear-gradient(180deg, #245B87 0%, #34627A 33%, #4E597B 66%, #677AF0 100%)'
     }}>
                    {/*text content*/}
                    <div className=' space-y-6 px-4 md:px-10 lg:px-16 py-6 md:py-16 lg:20 flex flex-col gap-2'>
                    <p className="text-[#FFFFFF] w-[560px] h-[41px] text-base md:text-[20px] leading-[150%]">Refer your friends to viaggio Abroad, earn a commission for referral</p>
                    <p className='text-[#FFFFFF] w-[560px]  text-base md:text-[20px] leading-[150%]'>invite & Earn with viaggio abroad! Share your unique referral link. Earn 10% when your referral 
                         subscribe. Start building your passive income, </p>
                    </div>
                    {/*illustration*/}
                    <div className='max-w-[1000px] h-[240px] px-4 '>
                               <img src={images.referal} alt="referal" className='w-[900px] h-[190px] object-cover  ' />
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
          className="px-6 py-3 bg-[#345867] text-white font-semibold rounded-lg hover:bg-[#2a4755] transition"
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
      <div className='py-4 md:py-6 max-w-[754px]'>
        <p className='text-[15px] leading-[150%] tracking-[0.4%] text-gray-500'>Just make sure they use this link to book consultation and earn a fee.
             To view details, visit <span className='text-[#345867]'>Terms & Conditions</span> 
To see your Refer-A-Friend bonus, please go to your <span className='text-[#345867]'>Referral Activity</span></p>
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
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 py-4 w-3/4'>
    {/* Card 1 - Earnings this month */}
    <EarningCards
      title="Earnings this month"
      amount="$142.15"
      percentageChange={3}
      subText="vs previous month"
      isActive={true}
    />

    {/* Card 2 - Total earnings */}
    <EarningCards
      title="Total earnings (All-time)"
      amount="$1,245.78"
      percentageChange={0}
      subText=""
    />

    {/* Card 3 - Referrals */}
    <EarningCards
      title="Referrals this month"
      amount="5"
      percentageChange={-21}
      subText="vs previous period"
    />

    {/* Card 4 - Current Earnings with button */}
    <EarningCards
      title="Current Earning4"
      amount="$132.45"
      showButton={true}
      buttonText="Check Earning"
      onButtonClick={() => console.log('Check earnings clicked')}
    />
  </div>
</div>
    </div>
    </div>
  )
}
