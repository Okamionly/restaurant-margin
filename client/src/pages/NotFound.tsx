import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, ChefHat, ShoppingBasket, Scale, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const quickLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/recipes', icon: ChefHat, label: 'Recettes' },
  { to: '/ingredients', icon: ShoppingBasket, label: 'Ingredients' },
  { to: '/weigh-station', icon: Scale, label: 'Station Balance' },
];

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Trigger command palette search
      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <SEOHead
        title="Page introuvable — RestauMargin"
        description="La page que vous recherchez n'existe pas. Retournez a l'accueil pour explorer RestauMargin."
        noindex={true}
      />
      {/* Large 404 with gradient */}
      <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none select-none notfound-gradient">
        404
      </h1>
      <style>{`
        .notfound-gradient {
          background: linear-gradient(135deg, #111111 0%, #0D9488 50%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dark .notfound-gradient {
          background: linear-gradient(135deg, #FFFFFF 0%, #2DD4BF 50%, #22D3EE 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <p className="text-2xl font-bold text-mono-100 dark:text-white mb-2 mt-2">
        Page introuvable
      </p>
      <p className="text-mono-500 dark:text-mono-700 mb-8 max-w-md">
        La page que vous recherchez a peut-etre ete deplacee ou n'existe plus.
        Essayez de rechercher ce que vous cherchez.
      </p>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] dark:text-mono-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une page, une recette..."
            className="w-full pl-12 pr-4 py-3.5 bg-mono-975 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-500 focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 transition-all"
          />
        </div>
      </form>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 w-full max-w-lg">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-mono-50 hover:border-teal-600 dark:hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <link.icon className="w-6 h-6 text-mono-500 dark:text-mono-700 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
            <span className="text-xs font-medium text-mono-500 dark:text-mono-700 group-hover:text-mono-100 dark:group-hover:text-white transition-colors">
              {link.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 bg-mono-100 dark:bg-white text-white dark:text-mono-100 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </button>
    </div>
  );
}
