import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center pt-8 pb-16">
        <h1 className="text-6xl md:text-8xl font-serif">Effortless elegance</h1>
        <Link
          to={ROUTES.COLLECTIONS}
          className="inline-block mt-4 text-sm underline hover:no-underline"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products - Crucial for E2E tests and UX */}
      <FeaturedProducts />

      {/* Hero Image */}
      <section className="px-6 md:px-12">
        <img
          alt="Two models in elegant summer dresses"
          className="w-full h-auto rounded-lg object-cover object-center"
          src="/images/hero-dress.png"
          loading="eager"
        />
      </section>

      {/* Featured Section */}
      <section className="px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center text-center">
          <img
            alt="Close-up of a stylish handbag"
            className="w-1/2 h-auto rounded-lg mb-8"
            src="/images/handbag-homepage.png"
            loading="lazy"
          />
          <h2 className="text-4xl font-serif mb-4">The Holiday Edit</h2>
          <Link
            to={ROUTES.COLLECTIONS}
            className="text-sm underline hover:no-underline"
          >
            Shop Collection
          </Link>
        </div>
        <div>
          <img
            alt="Model in a straw hat and stylish outfit"
            className="w-full h-auto rounded-lg object-cover object-center"
            src="/images/lady-in-black.png"
            loading="lazy"
          />
        </div>
      </section>

      {/* The World of Tcherassi Section */}
      <section className="px-6 md:px-12 py-16">
        <h2 className="text-center text-5xl font-serif mb-8">The World of Tcherassi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <img
              alt="Model in a vibrant dress"
              className="w-full h-full object-cover object-center rounded-lg"
              src="/images/homepage-section-dress.png"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition-all flex items-center justify-center rounded-lg">
              <Link
                to={ROUTES.DRESSES}
                className="text-white font-serif text-2xl tracking-wider"
              >
                Dresses
              </Link>
            </div>
          </div>
          <div className="relative group">
            <img
              alt="Close-up of a stylish handbag"
              className="w-full h-full object-cover object-center rounded-lg"
              src="/images/handbag-alt.png"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition-all flex items-center justify-center rounded-lg">
              <Link
                to={ROUTES.HANDBAGS}
                className="text-white font-serif text-2xl tracking-wider"
              >
                Handbags
              </Link>
            </div>
          </div>
          <div className="relative group">
            <img
              alt="Close-up of hands with artisanal jewelry"
              className="w-full h-full object-cover object-center rounded-lg"
              src="/images/rings.png"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition-all flex items-center justify-center rounded-lg">
              <Link
                to={ROUTES.ACCESSORIES}
                className="text-white font-serif text-2xl tracking-wider"
              >
                Accessories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen In Section */}
      <section className="py-16 bg-stone-100">
        <div className="px-6 md:px-12">
          <h3 className="text-center text-sm uppercase tracking-widest text-gray-500 mb-8">
            As Seen In
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-16 gap-y-4 text-gray-400 font-serif text-xl md:text-2xl">
            <span>VOGUE</span>
            <span>Harper's BAZAAR</span>
            <span>ELLE</span>
            <span>W Magazine</span>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="px-6 md:px-12 py-16">
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-7xl font-serif">@silviatcherassi</h2>
          <a href="#" className="inline-block mt-2 text-sm underline hover:no-underline">
            Follow the Journey
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img
            alt="Instagram post preview"
            className="w-full h-auto object-cover object-center rounded-lg aspect-square"
            src="/images/instagram-icecream.png"
            loading="lazy"
          />
          <img
            alt="Instagram post preview"
            className="w-full h-auto object-cover object-center rounded-lg aspect-square"
            src="/images/red-flowers.png"
            loading="lazy"
          />
          <img
            alt="Instagram post preview"
            className="w-full h-auto object-cover object-center rounded-lg aspect-square"
            src="/images/silver-dress.png"
            loading="lazy"
          />
          <img
            alt="Instagram post preview"
            className="w-full h-auto object-cover object-center rounded-lg aspect-square"
            src="/images/stylist.png"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
