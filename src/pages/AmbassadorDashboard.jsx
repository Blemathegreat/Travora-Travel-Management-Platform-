import React from 'react';
import { Link } from 'react-router-dom';
import DashNav from '../components/ambasssador/DashNav.jsx';
import DashBody from '../components/ambasssador/DashBody.jsx';

export default function AmbassadorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashNav />
      <DashBody />

      <main className="max-w-[1300px] mx-auto px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Ambassador dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, Ambassador</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Monitor your referral performance, campaign progress, and latest tasks from a single central workspace.
            </p>
          </div>
          <Link
            to="/ambassador"
            className="inline-flex items-center justify-center rounded-full bg-[#345867] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a4755]"
          >
            Back to Ambassador Signup
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Active referrals</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">124</p>
            <p className="mt-3 text-sm text-slate-600">New opportunities and verified leads this month.</p>
          </div>
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Pending approvals</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">18</p>
            <p className="mt-3 text-sm text-slate-600">Requests waiting for review by the support team.</p>
          </div>
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total earnings</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">$8,450</p>
            <p className="mt-3 text-sm text-slate-600">Estimated commission from active campaigns.</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="rounded-[30px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Campaign summary</h2>
                <p className="mt-2 text-sm text-slate-600">A quick overview of the campaigns currently under management.</p>
              </div>
              <button className="rounded-full bg-[#345867] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a4755]">
                Create new campaign
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Live campaigns</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">6</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Conversion rate</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">12.4%</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">Top performing campaign</p>
                <p className="mt-2 text-base text-slate-600">Referral boost program - 34 new leads this week.</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">Next milestone</p>
                <p className="mt-2 text-base text-slate-600">Reach 200 active referrals to unlock premium commission benefits.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
              <div className="mt-5 grid gap-3">
                <button className="w-full rounded-3xl border border-slate-200 px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Review pending leads
                </button>
                <button className="w-full rounded-3xl border border-slate-200 px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Update ambassador profile
                </button>
                <button className="w-full rounded-3xl border border-slate-200 px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Contact support
                </button>
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Latest activity</h2>
              <ul className="mt-5 space-y-4 text-sm text-slate-600">
                <li>Verified 2 new referrals today.</li>
                <li>Received approval for campaign launch.</li>
                <li>Updated payout information.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
