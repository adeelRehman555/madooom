import React, { useState } from 'react';

interface NavbarProps {
  currentPage?: string;
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home', onLogoutClick, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Your Pictures', id: 'pictures' },
    { label: 'Your Videos', id: 'videos' },
    { label: 'Your WishList', id: 'wishlist' },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/logo.png"
                alt="Nibi Logo"
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  if (img.parentElement) {
                    img.parentElement.innerHTML = '<span className="text-2xl">🎂</span>';
                  }
                }}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-8 flex-1 justify-center px-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-2 lg:px-3 py-2 text-sm lg:text-base font-semibold transition-all duration-300 whitespace-nowrap ${
                    currentPage === link.id
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {currentPage === link.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Logout Button */}
            {onLogoutClick && (
              <div className="hidden md:flex">
                <button
                  onClick={onLogoutClick}
                  className="px-4 lg:px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 whitespace-nowrap text-sm lg:text-base"
                >
                  Logout 🚪
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-pink-600 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-b from-pink-600 to-rose-600 border-t border-pink-400/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentPage === link.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {onLogoutClick && (
                <button
                  onClick={() => {
                    onLogoutClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white border-t border-pink-400/30 mt-2"
                >
                  Logout 🚪
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to account for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
