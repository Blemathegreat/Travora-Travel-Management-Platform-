import React from 'react';

const Footer = () => {
  const footerLinks = {
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Safety information', href: '#' },
      { label: 'Cancellation options', href: '#' }
    ],
    company: [
      { label: 'About us', href: '#' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Community Blog', href: '#' },
      { label: 'Terms of service', href: '#' }
    ],
    contact: [
      { label: 'FAQ', href: '#' },
      { label: 'Get in touch', href: '#' },
      { label: 'Partnerships', href: '#' }
    ]
  };

  return (
    <footer className="bg-[#001721] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Support Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-5">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-5">Contact</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-5">Social</h3>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#"
                aria-label="Pinterest"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © Copyright 2025
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            {/* Visa */}
            <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[50px] h-[32px]">
              <svg className="h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <path d="M17.2 23.6h-3.4l-2.1-8.3c-.1-.4-.3-.7-.6-.9-.7-.4-1.5-.7-2.3-1v-.4h4c.6 0 1.1.4 1.2 1l1.1 5.9 2.7-6.9h3.3l-4.9 10.6zm5 0h-3.1l2.6-10.6h3.1L19.2 23.6zm8.3.3c-3.3 0-5.5-1.8-5.5-4.3 0-2.6 2.2-4.3 5.5-4.3s5.5 1.7 5.5 4.3c0 2.5-2.2 4.3-5.5 4.3zm0-7c-1.3 0-2.3.8-2.3 2.3s1 2.3 2.3 2.3 2.3-.8 2.3-2.3-1-2.3-2.3-2.3zm11.7 6.7h-3.4l-.2-1.3c-.6.8-1.6 1.3-2.8 1.3-2.3 0-4.1-1.8-4.1-4.3s1.8-4.3 4.1-4.3c1.2 0 2.2.5 2.8 1.3l.2-1.3h3.3l-2.9 8.6zm-5.1-2.3c1.3 0 2.3-.8 2.3-2.3s-1-2.3-2.3-2.3-2.3.8-2.3 2.3 1 2.3 2.3 2.3z" fill="#1434CB"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[50px] h-[32px]">
              <svg className="h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <circle cx="18" cy="16" r="9" fill="#EB001B"/>
                <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
                <path d="M24 8.5c-1.8 1.4-3 3.6-3 6.1s1.2 4.7 3 6.1c1.8-1.4 3-3.6 3-6.1s-1.2-4.7-3-6.1z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* Discover */}
            <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[50px] h-[32px]">
              <svg className="h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <path d="M38 16c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z" fill="#FF6000"/>
                <path d="M12 13h8v6h-8z" fill="#FF6000"/>
                <path d="M10 13h2v6h-2z" fill="#231F20"/>
              </svg>
            </div>

            {/* PayPal */}
            <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[50px] h-[32px]">
              <svg className="h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <path d="M20.5 9h5.3c2.8 0 4.7 1.8 4.7 4.5 0 3.2-2.3 5.5-5.4 5.5h-2.2l-.7 3.5h-2.4l1.7-13.5zm3.8 7.5h1.5c1.6 0 2.8-1.1 2.8-2.8 0-1.2-.8-2-2-2h-1.5l-.8 4.8z" fill="#003087"/>
                <path d="M31.5 9h5.3c2.8 0 4.7 1.8 4.7 4.5 0 3.2-2.3 5.5-5.4 5.5h-2.2l-.7 3.5h-2.4l1.7-13.5zm3.8 7.5h1.5c1.6 0 2.8-1.1 2.8-2.8 0-1.2-.8-2-2-2h-1.5l-.8 4.8z" fill="#0070E0"/>
              </svg>
            </div>

            {/* Apple Pay */}
            <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[50px] h-[32px]">
              <svg className="h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <path d="M15.5 11.8c-.3.4-.8.7-1.3.6-.1-.5.1-1.1.4-1.4.3-.4.9-.7 1.3-.7.1.5-.1 1.1-.4 1.5zm.4.7c-.7 0-1.3.4-1.6.4s-.9-.4-1.5-.4c-.8 0-1.5.4-1.9 1.1-.8 1.4-.2 3.5.6 4.6.4.6.9 1.2 1.5 1.2s.8-.4 1.5-.4.9.4 1.5.4 1.1-.5 1.5-1.1c.3-.4.4-.6.6-1-.6-.2-1-.9-1-1.6s.4-1.3 1-1.5c-.4-.6-1-1-1.6-1-.3-.1-.5-.1-.6-.1zm5.6-1.3v8.3h1.3v-2.8h1.8c1.6 0 2.7-1.1 2.7-2.8s-1.1-2.7-2.7-2.7h-3.1zm1.3 1.1h1.5c1.1 0 1.7.6 1.7 1.6s-.6 1.6-1.7 1.6h-1.5v-3.2zm7.7 7.3c.8 0 1.5-.4 1.8-1h.1v.9h1.2v-4.3c0-1.3-1-2.1-2.6-2.1-1.5 0-2.5.8-2.6 2h1.2c.1-.6.6-1 1.4-1 .9 0 1.4.4 1.4 1.2v.5l-1.9.1c-1.8.1-2.7.8-2.7 2 0 1.2.9 2 2.2 2 .9 0 1.6-.4 1.9-1h.1v.9c0-.1-.5-.2-.5-.3zm-1.9-1c-.7 0-1.2-.3-1.2-1 0-.6.4-1 1.3-1l1.8-.1v.5c0 .9-.7 1.6-1.9 1.6zm5.2 3.4c1.3 0 1.9-.5 2.4-2l2.3-6.5h-1.3l-1.6 5.2h-.1l-1.6-5.2h-1.4l2.2 6.2-.1.3c-.2.6-.5.8-1.1.8h-1v1.1h1.3z" fill="#000"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;