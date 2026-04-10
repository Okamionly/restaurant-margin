import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, ChefHat, ShoppingBasket, Scale, ArrowLeft } from 'lucide-react';

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

      <p className="text-2xl font-bold text-[#111111] dark:text-white mb-2 mt-2">
        Page introuvable
      </p>
      <p className="text-[#737373] dark:text-[#A3A3A3] mb-8 max-w-md">
        La page que vous recherchez a peut-etre ete deplacee ou n'existe plus.
        Essayez de rechercher ce que vous cherchez.
      </p>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une page, une recette..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 transition-all"
          />
        </div>
      </form>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 w-full max-w-lg">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] hover:border-teal-600 dark:hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <link.icon className="w-6 h-6 text-[#737373] dark:text-[#A3A3A3] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
            <span className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">
              {link.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </button>
    </div>
  );
}
