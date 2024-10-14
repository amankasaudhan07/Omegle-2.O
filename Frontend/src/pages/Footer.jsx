import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Links and Social */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
                <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
                <li><Link to="/support" className="hover:text-yellow-400">Support</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
                <li><Link to="/report-issue" className="hover:text-yellow-400">Report Issue</Link></li>
              </ul>
            </div>

            {/* Additional Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-yellow-400">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-yellow-400">Privacy Policy</Link></li>
                <li><Link to="/faq" className="hover:text-yellow-400">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col md:items-end">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <FaFacebookF size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <FaLinkedin size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Logo, Address, and Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Logo
            <div className="mb-4 md:mb-0">
              <img src="/assets/logo.jpg" alt="Logo" className="w-32 h-auto" />
            </div> */}

            {/* Address */}
            <div className="text-center md:text-left text-sm text-gray-500 dark:text-gray-400">
              <p>1234 Chat Lane, Talk City, Web World</p>
              <p>Email: support@chatapp.com</p>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-sm text-gray-500 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} Omegle 2.O. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
