import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-gray-100 border-t border-primary-700">
      <div className="container-custom">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/logo/LOGO.svg`} 
                  alt="AFCF Logo" 
                  className="h-8 w-auto hover:opacity-80 transition-opacity duration-200"
                />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md font-serif">
              Facilitating the efficient flow of funds and resources within the agricultural ecosystem 
              to promote sustainable agricultural growth in Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-sans mb-4">Quick Links</h4>
                 <ul className="space-y-2">
                   <li>
                     <Link to="/about" className="text-gray-400 hover:text-accent-400 transition-colors duration-200">
                       About AFCF
                     </Link>
                   </li>
                   <li>
                     <Link to="/elearning" className="text-gray-400 hover:text-accent-400 transition-colors duration-200">
                       E-Learning
                     </Link>
                   </li>
                   <li>
                     <Link to="/contact" className="text-gray-400 hover:text-accent-400 transition-colors duration-200">
                       Contact Us
                     </Link>
                   </li>
                   <li>
                     <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors duration-200">
                       Portal Login
                     </a>
                   </li>
                 </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold font-sans mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400 font-serif">
              <p>Agricultural and Rural Management Training Institute</p>
              <p>Ilorin, Kwara State, Nigeria</p>
              <p>Email: info@afcf.gov.ng</p>
              <p>Phone: +234 XXX XXX XXXX</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-serif">
              © 2024 Agricultural Finance Coordination Framework. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
