import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { ROUTES, UI_TEXT } from '@/lib/constants';
import { User, LogOut, ShoppingBag } from 'lucide-react';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { toggleMobileMenu } = useUIStore();
  const { customer, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      role="banner"
      className="py-4 px-6 md:px-12 flex justify-between items-center bg-stone-50 sticky top-0 z-20 border-b border-gray-200"
    >
      {/* Left Section: Search and Desktop Navigation */}
      <div className="flex items-center space-x-6">
        <button aria-label="Search">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
        <nav className="hidden md:flex space-x-6 text-sm" role="navigation" aria-label="Main navigation">
          <NavLink
            to={ROUTES.HOME}
            className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
          >
            Home
          </NavLink>
          <NavLink
            to={ROUTES.COLLECTIONS}
            className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
          >
            Collections
          </NavLink>
          <NavLink
            to={ROUTES.ABOUT}
            className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}
          >
            About
          </NavLink>
        </nav>
      </div>

      {/* Center Section: Main Branding */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link to={ROUTES.HOME} className="text-3xl font-serif tracking-widest">
          SILVIA TCHERASSI
        </Link>
      </div>

      {/* Right Section: Login, Cart, and Mobile Menu Toggle */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-6 text-[10px] uppercase tracking-widest font-bold">
          {customer ? (
            <>
              <Link to="/my-orders" className="hover:text-stone-500 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Orders
              </Link>
              <Link to="/profile" className="hover:text-stone-500 flex items-center gap-1">
                <User className="w-3 h-3" /> Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-stone-500 flex items-center gap-1">
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">
              Log in
            </Link>
          )}
        </div>
        <button
          id="cart-button"
          className="relative"
          aria-label={`${UI_TEXT.SHOPPING_BAG} (${itemCount} items)`}
          onClick={openCart}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span
            id="cart-badge"
            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {itemCount}
          </span>
        </button>
        <button
          id="menu-button"
          className="md:hidden"
          aria-label="Open Menu"
          onClick={toggleMobileMenu}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
