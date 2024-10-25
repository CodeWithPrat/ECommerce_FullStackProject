import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Footer sections data
  const footerSections = [
    {
      title: 'Get to Know Us',
      links: [
        { label: 'About Amazon', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press Releases', path: '/press' },
        { label: 'Amazon Science', path: '/science' },
      ],
    },
    {
      title: 'Make Money with Us',
      links: [
        { label: 'Sell products on Amazon', path: '/sell' },
        { label: 'Sell apps on Amazon', path: '/sell-apps' },
        { label: 'Become an Affiliate', path: '/affiliate' },
        { label: 'Advertise Your Products', path: '/advertise' },
      ],
    },
    {
      title: 'Amazon Payment Products',
      links: [
        { label: 'Amazon Rewards Visa', path: '/visa' },
        { label: 'Amazon Store Card', path: '/store-card' },
        { label: 'Amazon Secured Card', path: '/secured-card' },
        { label: 'Amazon Business Card', path: '/business-card' },
      ],
    },
    {
      title: 'Let Us Help You',
      links: [
        { label: 'Your Account', path: '/account' },
        { label: 'Your Orders', path: '/orders' },
        { label: 'Shipping Rates & Policies', path: '/shipping' },
        { label: 'Returns & Replacements', path: '/returns' },
      ],
    },
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: 'https://facebook.com/amazon' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/amazon' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/amazon' },
    { icon: Youtube, label: 'YouTube', url: 'https://youtube.com/amazon' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/amazon' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-gray-800 hover:bg-gray-700 py-4 text-center text-sm font-medium transition-colors"
      >
        Back to top
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social media and language selector */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo and social links */}
            <div className="flex flex-col items-center md:items-start space-y-4 mb-6 md:mb-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon Logo"
                className="h-8 w-auto filter brightness-0 invert"
              />
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                    </a>
                ))}
              </div>
            </div>

            {/* Language selector (optional) */}
            <div className="flex items-center space-x-4">
              <select className="bg-gray-800 text-gray-400 border border-gray-700 rounded-md py-1 px-2">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                {/* Add more languages as needed */}
              </select>
              <span className="text-gray-400 text-sm">© 2024 Amazon. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
