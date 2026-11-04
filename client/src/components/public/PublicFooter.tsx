/**
 * Pied de page unique du site public (2026-11-04).
 *
 * Avant : 21 variantes de <footer> (de « Retour a l'accueil » seul jusqu'a
 * quatre colonnes), plus un faux voyant « Serveurs operationnels » qui ne
 * mesurait rien et un lien vers une section temoignages vide. Ici : les pages
 * qui comptent, sans indicateur ni promesse invérifiable.
 *
 * Fond #111111 (W&B du CLAUDE.md, aucune teinte « slate »).
 */
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const COLONNES = [
  {
    titre: 'Produit',
    liens: [
      { to: '/fonctionnalites', label: 'Fonctionnalités' },
      { to: '/pricing', label: 'Tarifs' },
      { to: '/demo', label: 'Démo' },
      { to: '/blog', label: 'Blog' },
    ],
  },
  {
    titre: 'Ressources',
    liens: [
      { to: '/blog/calcul-marge-restaurant', label: 'Marge restaurant : taux moyen et calcul' },
      { to: '/outils/calculateur-marge-restaurant', label: 'Calculateur de marge' },
      { to: '/outils/calculateur-food-cost', label: 'Calculateur de food cost' },
      { to: '/outils/generateur-qr-menu', label: 'Générateur de QR menu' },
      { to: '/glossaire-restauration', label: 'Glossaire de la restauration' },
    ],
  },
  {
    titre: 'Par établissement',
    liens: [
      { to: '/logiciel-marge-pizzeria', label: 'Pizzeria' },
      { to: '/logiciel-marge-bistrot', label: 'Bistrot et brasserie' },
      { to: '/logiciel-marge-food-truck', label: 'Food truck' },
      { to: '/logiciel-marge-boulangerie', label: 'Boulangerie' },
      { to: '/logiciel-marge-traiteur', label: 'Traiteur' },
    ],
  },
  {
    titre: 'Légal',
    liens: [
      { to: '/mentions-legales', label: 'Mentions légales' },
      { to: '/cgu', label: 'CGU' },
      { to: '/cgv', label: 'CGV' },
      { to: '/politique-confidentialite', label: 'Politique de confidentialité' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-[#111111] text-white/70 px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label="RestauMargin, retour à l'accueil">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-[#34D399]" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white font-satoshi">RestauMargin</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-white/60 max-w-xs">
            Le logiciel de gestion des marges pour les restaurants : fiches techniques, food cost, commandes et
            inventaire.
          </p>
          <a
            href="mailto:contact@restaumargin.fr"
            className="mt-4 inline-block text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/30"
          >
            contact@restaumargin.fr
          </a>
        </div>

        {COLONNES.map((c) => (
          <div key={c.titre}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white mb-4">{c.titre}</p>
            <ul className="space-y-2.5 text-sm">
              {c.liens.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-xs text-white/50">
        © {new Date().getFullYear()} RestauMargin. Tous droits réservés.
      </div>
    </footer>
  );
}
