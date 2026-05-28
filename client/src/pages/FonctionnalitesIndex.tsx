import { Link } from 'react-router-dom';
import {
  ChefHat, Send, Sparkles, ClipboardList, Truck, Scale,
  Thermometer, Camera, TrendingUp, ArrowRight,
} from 'lucide-react';
import SEOHead, { buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page index Fonctionnalités — hub qui liste les 8 modules
   Mot-clé : fonctionnalités logiciel restaurant, modules gestion resto
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const FEATURES = [
  { n: '01', icon: Send, title: 'Commandes fournisseurs en 1 clic', body: 'Email ou WhatsApp envoyés directement depuis la mercuriale, avec votre BL pré-rempli.', slug: 'commandes-fournisseurs' },
  { n: '02', icon: Sparkles, title: "L'IA qui parle cuisine", body: "Dictez la recette, l'IA structure ingrédients, allergènes et coût. Pas de jargon SaaS.", slug: 'ia-cuisine' },
  { n: '03', icon: ClipboardList, title: 'Fiches techniques en 10 s', body: 'Food cost, marge, coefficient, allergènes — calculés en temps réel, prêts pour l\'inspection.', slug: 'fiches-techniques' },
  { n: '04', icon: Truck, title: 'Mercuriale & alertes prix', body: 'Suivi automatique des prix par fournisseur. Alerte dès que le beurre dérive.', slug: 'mercuriale-alertes-prix' },
  { n: '05', icon: Scale, title: 'Pesage Bluetooth', body: 'Balance connectée à la fiche, en plein service. Plus de Post-it sur le plan de travail.', slug: 'pesage-bluetooth' },
  { n: '06', icon: Thermometer, title: 'HACCP digital', body: 'Températures, nettoyage, traçabilité — un tap. Inspection : un PDF. Fini le classeur.', slug: 'haccp-digital' },
  { n: '07', icon: Camera, title: 'OCR factures', body: 'Photo de la facture, prix injectés dans la mercuriale en 4 secondes. Aucune saisie.', slug: 'ocr-factures' },
  { n: '08', icon: TrendingUp, title: 'Menu Engineering', body: 'Stars, puzzles, plowhorses, dogs. Sait quel plat sortir de la carte avant qu\'il vous coûte cher.', slug: 'menu-engineering' },
];

export default function FonctionnalitesIndex() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <SEOHead
        title="Fonctionnalités RestauMargin | 8 modules pour piloter une cuisine rentable"
        description="Les 8 modules RestauMargin : commandes fournisseurs, IA cuisine, fiches techniques, mercuriale & alertes prix, pesage Bluetooth, HACCP digital, OCR factures et Menu Engineering. Une suite intégrée pour restaurateurs."
        path="/fonctionnalites"
        schema={[
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Fonctionnalités RestauMargin',
            itemListElement: FEATURES.map((f, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: f.title,
              url: `https://www.restaumargin.fr/fonctionnalites/${f.slug}`,
            })),
          },
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-bold text-lg" style={{ color: TEXT, textDecoration: 'none' }}>
            <ChefHat className="w-7 h-7" style={{ color: ACCENT }} />
            <span>RestauMargin</span>
          </Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-full transition-colors"
            style={{ background: ACCENT, textDecoration: 'none' }}
          >
            Essai gratuit 7 jours
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="text-sm" style={{ color: TEXT_MUTED }} aria-label="Fil d'Ariane">
          <Link to="/landing" style={{ color: ACCENT_DARK, textDecoration: 'none' }}>Accueil</Link>
          <span> › </span>
          <span>Fonctionnalités</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
          Fonctionnalités
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-3xl" style={{ color: TEXT }}>
          Tout ce qu'il faut pour piloter une <span style={{ color: ACCENT }}>cuisine rentable.</span>
        </h1>
        <p className="mt-6 text-lg max-w-2xl leading-relaxed" style={{ color: TEXT_MUTED }}>
          Huit modules qui se parlent — pas une suite d'outils dispersés. Construits avec des chefs,
          sur le pass, à 23 h. Chaque module est pensé pour faire gagner du temps et de la marge,
          sans jargon SaaS.
        </p>
      </section>

      {/* Grid des 8 fonctionnalités */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.slug}
                to={`/fonctionnalites/${f.slug}`}
                className="group flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{ border: `1px solid ${BORDER}`, textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ACCENT; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; }}
              >
                <div className="text-xs font-semibold mb-3" style={{ color: TEXT_MUTED, fontFamily: 'monospace' }}>{f.n}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold mb-2" style={{ color: TEXT }}>{f.title}</h2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: TEXT_MUTED }}>{f.body}</p>
                <span className="mt-auto text-xs font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: ACCENT_DARK }}>
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-3xl p-8 sm:p-12 text-center" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Une cuisine, une seule application.
          </h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Calculez vos marges, gérez vos fiches techniques, commandez vos fournisseurs et optimisez votre carte —
            tout au même endroit. Essai gratuit 7 jours, sans carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login?mode=register" className="inline-flex items-center gap-2 px-6 py-3 bg-white font-semibold rounded-full transition-transform hover:scale-105" style={{ color: ACCENT_DARK, textDecoration: 'none' }}>
              Démarrer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-full transition-colors hover:bg-white/25 backdrop-blur-sm" style={{ textDecoration: 'none' }}>
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: TEXT_MUTED }}>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" style={{ color: ACCENT }} />
            <span>© 2026 RestauMargin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog" style={{ color: TEXT_MUTED, textDecoration: 'none' }}>Blog</Link>
            <Link to="/pricing" style={{ color: TEXT_MUTED, textDecoration: 'none' }}>Tarifs</Link>
            <Link to="/mentions-legales" style={{ color: TEXT_MUTED, textDecoration: 'none' }}>Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
