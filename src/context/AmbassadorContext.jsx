import { createContext, useContext, useMemo, useState } from 'react'

const AmbassadorContext = createContext(null)

const initialAmbassadors = [
  {
    id: '001',
    name: 'Ava Mensah',
    email: 'ava.mensah@example.com',
    phone: '+233 20 123 4567',
    regDate: '02-04-2024, 7:00AM',
    lastLogin: '24-05-2026, 11:02AM',
    status: 'Productive',
    earningsThisMonth: '$240.00',
    pendingEarnings: '$120.00',
    totalPaid: '$2,400.00',
    unpaidEarnings: '$40.00',
    currentBalance: '$132.45',
    payoutSetup: true,
    payoutHistory: [
      { id: 1, title: 'Referral commission', date: 'May 22 2026', amount: '+$28.00' },
      { id: 2, title: 'Referral commission', date: 'May 18 2026', amount: '+$18.00' },
      { id: 3, title: 'Referral commission', date: 'May 15 2026', amount: '+$34.00' },
    ],
    payoutAccountInfo: {
      method: 'Bank Account',
      bankName: 'Access Bank',
      accountNumber: '0036475858',
      bankBranch: 'Octagon',
    },
  },
  {
    id: '002',
    name: 'Kojo Asante',
    email: 'kojo.asante@example.com',
    phone: '+233 24 987 6543',
    regDate: '14-03-2024, 9:15AM',
    lastLogin: '24-05-2026, 8:45AM',
    status: 'Productive',
    earningsThisMonth: '$0.00',
    pendingEarnings: '$0.00',
    totalPaid: '$0.00',
    unpaidEarnings: '$0.00',
    currentBalance: '$0.00',
    payoutSetup: false,
    payoutHistory: [],
    payoutAccountInfo: null,
  },
  {
    id: '003',
    name: 'Nana Agyemang',
    email: 'nana.agyemang@example.com',
    phone: '+233 55 123 9876',
    regDate: '26-10-2023, 4:40PM',
    lastLogin: '20-05-2026, 8:00AM',
    status: 'Suspended',
    earningsThisMonth: '$60.00',
    pendingEarnings: '$0.00',
    totalPaid: '$660.00',
    unpaidEarnings: '$0.00',
    currentBalance: '$60.00',
    payoutSetup: true,
    payoutHistory: [],
    payoutAccountInfo: {
      method: 'Mobile Money',
      bankName: 'MTN Mobile Money',
      accountNumber: '0241234567',
      bankBranch: 'Digital Wallet',
    },
  },
  {
    id: '004',
    name: 'Efua Owusu',
    email: 'efua.owusu@example.com',
    phone: '+233 26 789 1234',
    regDate: '11-02-2025, 10:30AM',
    lastLogin: '22-05-2026, 2:12PM',
    status: 'Deactivated',
    earningsThisMonth: '$90.00',
    pendingEarnings: '$30.00',
    totalPaid: '$980.00',
    unpaidEarnings: '$30.00',
    currentBalance: '$90.00',
    payoutSetup: true,
    payoutHistory: [
      { id: 1, title: 'Referral commission', date: 'May 10 2026', amount: '+$12.00' },
      { id: 2, title: 'Referral commission', date: 'May 3 2026', amount: '+$10.00' },
    ],
    payoutAccountInfo: {
      method: 'Bank Account',
      bankName: 'GCB Bank',
      accountNumber: '0012345678',
      bankBranch: 'Accra Main',
    },
  },
  {
    id: '005',
    name: 'Kwabena Boateng',
    email: 'kwabena.boateng@example.com',
    phone: '+233 20 555 1234',
    regDate: '05-01-2024, 1:20PM',
    lastLogin: '23-05-2026, 9:10AM',
    status: 'Productive',
    earningsThisMonth: '$180.00',
    pendingEarnings: '$25.00',
    totalPaid: '$1,320.00',
    unpaidEarnings: '$25.00',
    currentBalance: '$70.00',
    payoutSetup: true,
    payoutHistory: [
      { id: 1, title: 'Referral commission', date: 'May 20 2026', amount: '+$20.00' },
      { id: 2, title: 'Referral commission', date: 'May 14 2026', amount: '+$15.00' },
      { id: 3, title: 'Referral commission', date: 'May 11 2026', amount: '+$20.00' },
    ],
    payoutAccountInfo: {
      method: 'Bank Account',
      bankName: 'Zenith Bank',
      accountNumber: '0076543210',
      bankBranch: 'Circle',
    },
  },
]

const API_BASE = 'http://localhost:4000'

export function AmbassadorProvider({ children }) {
  const [ambassadors, setAmbassadors] = useState(initialAmbassadors)
  const [selectedAmbassador, setSelectedAmbassador] = useState(null)
  const [loadingAmbassador, setLoadingAmbassador] = useState(false)

  const getAmbassadorById = (id) => ambassadors.find((amb) => amb.id === id)

  const loadAmbassador = async (id) => {
    const cached = getAmbassadorById(id)
    if (cached) {
      setSelectedAmbassador(cached)
      return cached
    }

    setLoadingAmbassador(true)
    try {
      const res = await fetch(`${API_BASE}/api/ambassadors/${id}`)
      if (!res.ok) throw new Error('Failed to fetch ambassador')
      const data = await res.json()
      setSelectedAmbassador(data)
      return data
    } catch (error) {
      console.warn(error)
      const fallback = {
        id,
        name: 'Kweiba Blankson',
        email: 'newston@gmail.com',
        phone: '+233598362042',
        registrationDate: '02-04-2024, 7:00AM',
        lastLogin: '02-04-2024, 7:00AM',
        status: 'Productive',
        earningsThisMonth: '$120',
        pendingEarnings: '$50',
        totalPaid: '$1500',
        unpaidEarnings: '$50',
        payoutSetup: true,
        payoutHistory: [
          { id: 1, title: 'New customers', date: 'Nov 12 2023', amount: '+$4.56' },
          { id: 2, title: 'Returning customer', date: 'Nov 11 2023', amount: '+$4.56' },
          { id: 3, title: 'App installation', date: 'Nov 10 2023', amount: '+$8.24' },
          { id: 4, title: 'New customers', date: 'Nov 9 2023', amount: '+$8.24' },
        ],
        payoutAccountInfo: {
          method: 'Bank Account',
          bankName: 'Access Bank',
          accountNumber: '0036475858',
          bankBranch: 'Octagon',
        },
      }
      setSelectedAmbassador(fallback)
      return fallback
    } finally {
      setLoadingAmbassador(false)
    }
  }

  const updateAmbassadorStatus = (id, status) => {
    setAmbassadors((prev) => prev.map((amb) => (amb.id === id ? { ...amb, status } : amb)))
    if (selectedAmbassador?.id === id) {
      setSelectedAmbassador((prev) => (prev ? { ...prev, status } : prev))
    }
  }

  const value = useMemo(
    () => ({
      ambassadors,
      selectedAmbassador,
      loadingAmbassador,
      getAmbassadorById,
      loadAmbassador,
      updateAmbassadorStatus,
    }),
    [ambassadors, selectedAmbassador, loadingAmbassador]
  )

  return <AmbassadorContext.Provider value={value}>{children}</AmbassadorContext.Provider>
}

export function useAmbassadors() {
  return useContext(AmbassadorContext)
}
