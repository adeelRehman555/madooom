import React from 'react';

interface NavbarProps {
  currentPage?: string;
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoutClick, onNavigate }) => {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-14 w-14 object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  if (img.parentElement) {
                    img.parentElement.innerHTML = '<span className="text-2xl">🎂</span>';
                  }
                }}
              />
            </div>

            {/* Logout Button (Visible on all devices) */}
            {onLogoutClick && (
              <div className="flex items-center">
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-semibold rounded-xl transition-all duration-300 whitespace-nowrap text-sm md:text-base border border-white/20 shadow-sm"
                >
                  Logout 🚪
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to account for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
