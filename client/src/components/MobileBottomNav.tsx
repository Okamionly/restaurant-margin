import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, ClipboardList, Scale, ChefHat, MoreHorizontal, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// All other navigation links for the "Plus" drawer
const MORE_LINKS = [
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/inventory', label: 'Inventaire' },
  { to: '/suppliers', label: 'Fournisseurs' },
  { to: '/menu', label: 'La Carte' },
  { to: '/analytics', label: 'Analytiques' },
  { to: '/scanner-factures', label: 'Factures' },
  { to: '/mercuriale', label: 'Mercuriale' },
  { to: '/commandes', label: 'Commandes' },
  { to: '/planning', label: 'Planning' },
  { to: '/messagerie', label: 'Messages' },
  { to: '/haccp', label: 'HACCP' },
  { to: '/gaspillage', label: 'Gaspillage' },
  { to: '/comptabilite', label: 'Comptabilite' },
  { to: '/settings', label: 'Parametres' },
  { to: '/assistant', label: 'Assistant IA' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/abonnement', label: 'Abonnement' },
];

const MAIN_TABS = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/recipes', icon: ClipboardList, label: 'Recettes' },
  { to: '/station', icon: Scale, label: 'Balance' },
  { to: '/kitchen-mode', icon: ChefHat, label: 'Cuisine' },
];

export default function MobileBottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Close drawer on click outside
  useEffect(() => {
    if (!drawerOpen) return;
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [drawerOpen]);

  // Check if "Plus" should be highlighted (current route is in MORE_LINKS)
  const isMoreActive = MORE_LINKS.some(l => location.pathname === l.to || location.pathname.startsWith(l.to + '/'));

  return (
    <>
      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* More drawer */}
      {drawerOpen && (
        <div
          ref={drawerRef}
          className="md:hidden fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-[101] bg-white dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A] rounded-t-2xl shadow-2xl animate-slide-up max-h-[60vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <span className="text-sm font-semibold text-[#111111] dark:text-white">Plus de pages</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-[#737373]" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-3">
            {MORE_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-center px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-600/10 text-teal-600 dark:text-teal-400'
                      : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav aria-label="Navigation mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#E5E7EB] dark:border-[#1A1A1A] no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-14">
          {MAIN_TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-[#9CA3AF] dark:text-[#737373]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <span className="text-[10px] font-semibold leading-tight">{tab.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Plus/More button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 ${
              isMoreActive || drawerOpen
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-[#9CA3AF] dark:text-[#737373]'
            }`}
          >
            <MoreHorizontal className={`w-5 h-5 transition-transform duration-200 ${drawerOpen ? 'rotate-90' : ''}`} />
            {(isMoreActive || drawerOpen) && (
              <span className="text-[10px] font-semibold leading-tight">Plus</span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
