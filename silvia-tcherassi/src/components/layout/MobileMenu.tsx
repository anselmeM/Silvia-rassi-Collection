import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants';

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  };

  if (!isMobileMenuOpen) return null;

  return (
    <div
      className="mobile-menu md:hidden bg-black bg-opacity-50 fixed inset-0 z-30"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        ref={menuRef}
        className="mobile-menu-content bg-stone-100 p-6 absolute top-0 right-0 h-full w-64 shadow-lg"
      >
        <button
          ref={closeButtonRef}
          id="close-menu-button"
          className="absolute top-4 right-4 text-2xl"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          &times;
        </button>
        <nav className="flex flex-col space-y-4 text-center mt-12">
          <NavLink
            to={ROUTES.HOME}
            className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to={ROUTES.COLLECTIONS}
            className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
            onClick={closeMobileMenu}
          >
            Collections
          </NavLink>
          <NavLink
            to={ROUTES.ABOUT}
            className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
            onClick={closeMobileMenu}
          >
            About
          </NavLink>
          <a href="#" className="hover:underline pt-4 border-t mt-2">
            Log in
          </a>
        </nav>
      </div>
    </div>
  );
}
