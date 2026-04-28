import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  'dashboard': 'Tableau de bord',
  'recipes': 'Fiches techniques',
  'ingredients': 'Ingredients',
  'suppliers': 'Fournisseurs',
  'planning': 'Planning',
  'assistant': 'Assistant IA',
  'mercuriale': 'Mercuriale',
  'menu': 'Menu',
  'inventory': 'Inventaire',
  'gaspillage': 'Gaspillage',
  'rfqs': 'Appels d\'offres',
  'scanner-factures': 'Scanner factures',
  'actualites': 'Actualites',
  'menu-engineering': 'Menu Engineering',
  'qr-menu': 'QR Menu',
  'commandes': 'Commandes auto',
  'seminaires': 'Seminaires',
  'haccp': 'HACCP',
  'recettes-semaine': 'Recettes de la semaine',
  'messagerie': 'Messagerie',
  'clients': 'Clients',
  'marketplace': 'Marketplace',
  'fournisseur': 'Fournisseur',
  'integrations': 'Integrations',
  'comptabilite': 'Comptabilite',
  'devis': 'Devis',
  'restaurants': 'Restaurants',
  'pricing': 'Tarifs',
  'abonnement': 'Abonnement',
  'settings': 'Parametres',
  'users': 'Utilisateurs',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on dashboard / home
  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
    return null;
  }

  return (
    <nav aria-label="Fil d'Ariane" className="mb-4">
      <ol className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
        {/* Home / Accueil */}
        <li>
          <Link
            to="/dashboard"
            className="breadcrumb-link text-[#9CA3AF] dark:text-mono-500 hover:text-teal-500 dark:hover:text-teal-400 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          const label = ROUTE_LABELS[segment] || decodeURIComponent(segment);

          return (
            <li key={path} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-mono-350 flex-shrink-0" />
              {isLast ? (
                <span className="text-mono-100 dark:text-white font-semibold truncate max-w-[200px]">
                  {label}
                </span>
              ) : (
                <Link
                  to={path}
                  className="breadcrumb-link text-[#9CA3AF] dark:text-mono-500 hover:text-teal-500 dark:hover:text-teal-400 transition-colors truncate max-w-[150px]"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
