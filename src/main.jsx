import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { BlogProvider } from './context/BlogContext'
import { AmbassadorProvider } from './context/AmbassadorContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <BlogProvider>
        <AmbassadorProvider>
          <App />
        </AmbassadorProvider>
      </BlogProvider>
    </BrowserRouter>
  </StrictMode>,
)
