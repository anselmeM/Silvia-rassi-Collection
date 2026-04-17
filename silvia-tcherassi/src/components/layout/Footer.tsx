import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-stone-50 text-custom-black py-12 px-6 md:px-12 border-t">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-2xl mb-4">SILVIA TCHERASSI</h3>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Boutiques
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">About</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={ROUTES.ABOUT} className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Stories
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Tcherassi Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Atelier
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <a aria-label="Facebook" className="hover:underline" href="#">
            FACEBOOK
          </a>
          <a aria-label="Instagram" className="hover:underline" href="#">
            INSTAGRAM
          </a>
        </div>
        <p>&copy;{currentYear} Silvia Tcherassi</p>
      </div>
    </footer>
  );
}
