import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      const navbar = document.querySelector('nav');
      
      if (footer && navbar) {
        const footerTop = footer.offsetTop;
        const navbarBottom = navbar.offsetTop + navbar.offsetHeight;
        const scrollY = window.scrollY;
        
        // Check if we've scrolled past the navbar and haven't reached the footer
        setIsSticky(scrollY > navbarBottom && scrollY < footerTop - navbar.offsetHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'E-Learning', href: '/elearning' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`bg-primary-900 shadow-xl border-b border-primary-700 transition-all duration-300 ${
      isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="./images/logo/LOGO.svg" 
                alt="AFCF Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium font-sans transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-accent-400 bg-primary-800'
                    : 'text-gray-300 hover:text-accent-400 hover:bg-primary-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
                 <div className="flex items-center space-x-3">
                   <Link to="/login" className="btn-secondary">
                     Login
                   </Link>
                   <Link to="/register" className="btn-primary">
                     Register
                   </Link>
                 </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-accent-400 focus:outline-none focus:text-accent-400"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-800 border-t border-primary-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium font-sans ${
                    isActive(item.href)
                      ? 'text-accent-400 bg-primary-700'
                      : 'text-gray-300 hover:text-accent-400 hover:bg-primary-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Link to="/login" className="btn-secondary w-full block text-center" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary w-full block text-center" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
