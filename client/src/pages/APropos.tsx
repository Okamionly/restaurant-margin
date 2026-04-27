import { Link } from 'react-router-dom';
import {
  ChefHat, Mail, MapPin, Target, Heart, Lightbulb, Users,
  ArrowRight, CheckCircle2, Calculator, Scale, BarChart3, Sparkles,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   À propos — Page AboutPage pour E-E-A-T
   Mot-clé : équipe RestauMargin, qui sommes-nous, Montpellier
   ═══════════════════════════════════════════════════════════════ */

export default function APropos() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="À propos — RestauMargin"
        description="Découvrez RestauMargin, la plateforme SaaS française de gestion de marge pour restaurateurs. Basée à Montpellier, notre mission est d'aider les chefs à maîtriser leur food cost et leurs marges."
        path="/a-propos"
      />

      {/* Article schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            'inLanguage': 'fr-FR',
            'name': 'À propos de RestauMargin',
            'url': 'https://www.restaumargin.fr/a-propos',
            'mainEntity': {
              '@type': 'Organization',
              'name': 'RestauMargin',
              'url': 'https://www.restaumargin.fr',
              'logo': 'https://www.restaumargin.fr/icon-512.png',
              'description': "RestauMargin est la plateforme SaaS de gestion de marge pour restaurateurs. Calcul du food cost, fiches techniques, commandes fournisseurs et optimisation des marges par intelligence artificielle.",
              'foundingDate': '2025',
              'location': {
                '@type': 'Place',
                'address': {
                  '@type': 'PostalAddress',
                  'addressLocality': 'Montpellier',
                  'addressRegion': 'Occitanie',
                  'postalCode': '34000',
                  'addressCountry': 'FR',
                },
              },
              'contactPoint': {
                '@type': 'ContactPoint',
                'email': 'contact@restaumargin.fr',
                'contactType': 'customer service',
                'areaServed': 'FR',
                'availableLanguage': 'French',
              },
            },
          }),
        }}
      />

      {/* ═══ Navbar ═══ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <section className="pt-16 pb-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-6">
          <Heart className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700 uppercase tracking-wider">Notre histoire</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111111] mb-6 leading-tight"
         
        >
          Nous aidons les restaurateurs à maîtriser leurs marges
        </h1>
        <p className="text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed">
          RestauMargin est né d'une conviction : chaque restaurateur mérite des outils professionnels
          pour calculer ses marges, optimiser son food cost et gérer son activité avec précision.
        </p>
      </section>

      {/* ═══ Notre équipe ═══ */}
      <section className="pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#f8fafb] to-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-lg">
                RM
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Notre équipe</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#111111] mb-3"
               
              >
                L'équipe RestauMargin
              </h2>
              <p className="text-sm text-[#737373] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Montpellier, France
              </p>
              <p className="text-base text-[#525252] leading-relaxed mb-4">
                Passionnés par la restauration et la technologie, nous avons fondé RestauMargin en 2025
                avec une mission simple : rendre accessibles à tous les restaurateurs les outils de gestion
                habituellement réservés aux grandes chaînes.
              </p>
              <p className="text-base text-[#525252] leading-relaxed mb-6">
                Avec RestauMargin, un chef ou un gérant peut calculer ses marges en temps réel, créer
                ses fiches techniques, suivre son food cost et automatiser ses commandes fournisseurs —
                le tout depuis une interface claire, en français, conçue pour le quotidien d'un restaurant.
              </p>
              <a
                href="mailto:contact@restaumargin.fr"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@restaumargin.fr
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Mission ═══ */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-4">
            <Target className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700 uppercase tracking-wider">Notre mission</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black text-[#111111] mb-4"
           
          >
            Démocratiser la gestion professionnelle en restauration
          </h2>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto">
            72% des restaurants ferment dans les 5 ans. La gestion approximative des marges est l'une
            des premières causes. Nous changeons cela.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Calculator,
              title: 'Précision',
              text: 'Calcul automatique du food cost et des marges, au centime près, sur chaque plat.',
            },
            {
              icon: Lightbulb,
              title: 'Intelligence',
              text: "Suggestions d'optimisation de recettes, analyse des coûts matière, alertes anomalies par l'IA.",
            },
            {
              icon: Heart,
              title: 'Accessibilité',
              text: 'Une interface claire, en français, adaptée aux petits établissements comme aux chaînes.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-teal-500 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
              <p className="text-sm text-[#525252] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ What makes us different ═══ */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto bg-[#f8fafb] rounded-3xl my-8">
        <h2
          className="text-3xl sm:text-4xl font-black text-[#111111] mb-8 text-center"
         
        >
          Ce qui nous distingue
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            '100% français — interface, support, hébergement (Supabase Europe)',
            'Conforme RGPD — vos données restent en Europe, chiffrées',
            'Station de pesée connectée — compatible toute balance Bluetooth',
            'IA intégrée — suggestions, analyses, commandes automatisées',
            'Fiches techniques — grammages, allergènes, HACCP, traçabilité',
            'Sans engagement — essai gratuit 7 jours, annulation simple',
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#525252] leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Tech stack ═══ */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#111111] mb-6 text-center"
         
        >
          Notre expertise technique
        </h2>
        <p className="text-center text-[#525252] mb-8 max-w-2xl mx-auto">
          Nous développons RestauMargin avec les meilleures technologies modernes pour garantir
          rapidité, fiabilité et évolutivité.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Scale, label: 'Balance Bluetooth' },
            { icon: BarChart3, label: 'Analyses temps réel' },
            { icon: Sparkles, label: 'IA Claude Sonnet' },
            { icon: ChefHat, label: 'Fiches techniques' },
          ].map((tech) => (
            <div
              key={tech.label}
              className="flex flex-col items-center gap-2 p-4 border border-[#E5E7EB] rounded-xl text-center"
            >
              <tech.icon className="w-6 h-6 text-teal-600" />
              <span className="text-xs font-semibold text-[#525252]">{tech.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#111111] to-[#1f2937] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h3
            className="text-2xl sm:text-3xl font-bold mb-3"
           
          >
            Prêt à maîtriser vos marges ?
          </h3>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Rejoignez les restaurateurs qui utilisent RestauMargin pour optimiser leur rentabilité
            au quotidien. Essai gratuit 7 jours, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-colors"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors backdrop-blur-sm"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#737373]">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-teal-600" />
            <span>© 2026 RestauMargin — Tous droits réservés</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialité</Link>
            <Link to="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
