/**
 * Page introuvable du site public (2026-11-04).
 *
 * Avant : toute adresse inconnue tombait dans la route protegee de l'application
 * et renvoyait un visiteur vers la page de connexion. Un lien casse menait donc a
 * un formulaire de mot de passe. Ici : un message clair et les pages utiles.
 * noindex : l'adresse repond 200 (application monopage), Google ne doit pas l'indexer.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

const PAGES_UTILES = [
  { to: '/blog/calcul-marge-restaurant', label: 'Calculer la marge d’un restaurant' },
  { to: '/outils/calculateur-marge-restaurant', label: 'Calculateur de marge gratuit' },
  { to: '/fonctionnalites', label: 'Fonctionnalités' },
  { to: '/pricing', label: 'Tarifs' },
  { to: '/blog', label: 'Tous les articles' },
];

export default function PublicNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead
        title="Page introuvable — RestauMargin"
        description="Cette page n'existe pas ou a été déplacée."
        noindex={true}
      />
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20">
        <div className="max-w-xl w-full">
          <p className="text-sm font-semibold text-[#047857]">Erreur 404</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] font-satoshi">
            Cette page est introuvable
          </h1>
          <p className="mt-4 text-base text-[#525252] leading-relaxed">
            Le lien que vous avez suivi est peut-être ancien, ou l’adresse contient une faute de frappe.
            Voici les pages les plus consultées.
          </p>
          <ul className="mt-8 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
            {PAGES_UTILES.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  className="flex items-center justify-between py-3.5 text-[#111111] hover:text-[#047857] transition-colors"
                >
                  <span className="font-medium">{p.label}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-sm font-semibold transition-colors"
          >
            Retour à l’accueil
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
