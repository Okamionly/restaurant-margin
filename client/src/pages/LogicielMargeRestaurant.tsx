import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, Check, X, Sparkles, Zap, Shield, Cloud, BarChart3, Receipt, Bell, FileSpreadsheet, Users, Star, AlertTriangle, Lightbulb, Brain, TrendingUp, Target } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Landing transactionnelle — Logiciel marge restaurant
   Mot-clé principal : logiciel marge restaurant (KD 50, ~200/mois)
   Intent commercial fort
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le meilleur logiciel de marge restaurant en 2026 ?',
    answer: "RestauMargin est le logiciel de marge restaurant le plus complet du marché français. Il combine fiches techniques automatisées, scan de factures par OCR, alertes en temps réel, intelligence artificielle (19 actions IA) et menu engineering. Tarif : 29 EUR/mois avec essai gratuit 7 jours.",
  },
  {
    question: 'Combien coûte un logiciel de gestion de marge restaurant ?',
    answer: "Les prix varient de 0 EUR (Excel manuel) à 200 EUR/mois (solutions enterprise comme Yokitup ou Datameal). RestauMargin se positionne à 29 EUR/mois en plan Pro et 79 EUR/mois en plan Business multi-restaurants. C'est entre 5 et 10 fois moins cher que les solutions enterprise pour un périmètre fonctionnel comparable.",
  },
  {
    question: "Faut-il un logiciel ou Excel suffit ?",
    answer: "Excel fonctionne pour moins de 30 plats sans variations fréquentes de prix. Au-delà, vous perdez 5 à 10 heures par mois en saisie et vos calculs deviennent obsolètes dès qu'un fournisseur change un prix. Un logiciel SaaS automatise tout ce travail et vous fait gagner 8 à 15 heures par mois sur la gestion.",
  },
  {
    question: "Le logiciel fonctionne-t-il sur tablette et smartphone ?",
    answer: "RestauMargin est une PWA (Progressive Web App) qui fonctionne sur ordinateur, tablette (iPad, Android) et smartphone. Elle s'installe comme une app native depuis le navigateur, fonctionne hors ligne et synchronise automatiquement quand vous êtes reconnecté.",
  },
  {
    question: "Puis-je importer mes fiches techniques existantes ?",
    answer: "Oui. RestauMargin importe vos fiches techniques au format Excel ou CSV. L'équipe support vous accompagne sur la migration les 7 premiers jours (essai gratuit). En général, l'import de 50 à 100 fiches techniques prend moins de 2 heures avec notre assistant.",
  },
  {
    question: "Les données sont-elles sécurisées et hébergées où ?",
    answer: "Toutes les données sont hébergées en Europe (Frankfurt/Paris) sur Supabase, conformes RGPD. Les sauvegardes sont automatiques (point-in-time recovery 7 jours). Authentification sécurisée, chiffrement TLS 1.3, audit log complet. Vos données restent votre propriété et peuvent être exportées à tout moment.",
  },
  {
    question: "Y a-t-il un engagement contractuel ?",
    answer: "Aucun engagement. Vous payez au mois et résiliez quand vous voulez. L'essai gratuit dure 7 jours, sans carte bancaire requise à l'inscription. Vous pouvez tester toutes les fonctionnalités Pro pendant l'essai.",
  },
  {
    question: "Le logiciel se connecte-t-il à ma caisse et à mes fournisseurs ?",
    answer: "RestauMargin propose des intégrations pour les caisses (Lightspeed, Sumup, Square, Tiller) et les principaux fournisseurs alimentaires français (Metro, Transgourmet, Sysco). Le module Mercuriale suit automatiquement vos prix fournisseurs et alerte sur les variations.",
  },
];

// FIX 2026-09-24 : ce tableau contenait des temoignages nominatifs ENTIEREMENT
// INVENTES (nom, etablissement, ville, citation et resultats chiffres), alors que
// la base compte une vingtaine de comptes et aucun abonne payant. Publier de faux
// avis de consommateurs est une pratique commerciale trompeuse (Code de la
// consommation, art. L121-2 et suivants) — et un prospect qui cherche un de ces
// etablissements et ne le trouve pas est perdu definitivement.
// Vide, pas supprime : y remettre de VRAIS temoignages autorises rallume la section.
const testimonials: Array<{ name: string; role: string; company: string; text: string; rating: number }> = [];

export default function LogicielMargeRestaurant() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Logiciel de calcul de marge restaurant | RestauMargin 29 EUR/mois"
        description="Logiciel de calcul de marge restaurant 100 % automatique : food cost, fiches techniques, scan factures OCR, alertes IA, menu engineering. Calcule votre marge sans Excel. Essai gratuit 7 jours, 29 EUR/mois."
        path="/logiciel-marge-restaurant"
        type="website"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciel marge restaurant', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Restaurant Management Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr',
            description: 'Logiciel de gestion des marges pour restaurants. Calcul food cost automatique, fiches techniques, scan de factures OCR, IA, menu engineering, alertes en temps réel.',
            featureList: [
              'Calcul automatique du food cost et de la marge brute',
              'Fiches techniques connectées aux prix fournisseurs',
              'Scan de factures par OCR',
              'Menu engineering intégré',
              'Alertes en temps réel sur les variations de prix',
              'Intelligence artificielle (19 actions IA)',
              'Multi-restaurants',
              'PWA mobile et tablette',
            ],
            offers: [
              {
                '@type': 'Offer',
                name: 'Pro',
                price: '29',
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '29',
                  priceCurrency: 'EUR',
                  unitText: 'MONTH',
                },
              },
              {
                '@type': 'Offer',
                name: 'Business',
                price: '79',
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '79',
                  priceCurrency: 'EUR',
                  unitText: 'MONTH',
                },
              },
            ],

          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-6xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge restaurant</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-teal-50 via-white to-white pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            #1 Logiciel marge restaurant France
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mono-100 leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de calcul de marge restaurant, 100 % automatique
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Le logiciel SaaS qui calcule la marge de votre restaurant automatiquement : fiches techniques,
            prix fournisseurs et food cost, sans Excel ni saisie manuelle.
            <strong> +5 points de marge brute en 6 mois en moyenne.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg shadow-teal-600/30"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-mono-100 text-mono-100 font-semibold rounded-full hover:bg-mono-100 hover:text-white transition-colors"
            >
              Voir la demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-mono-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans carte bancaire</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans engagement</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> des restaurants clients</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Essai 7 jours sans carte</span>
          </div>
        </div>
      </header>

      {/* ── Section comparative ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              RestauMargin vs alternatives du marché
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Comparatif factuel des principaux logiciels de marge restaurant en France
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Fonctionnalité</th>
                  <th className="text-center py-4 px-4 font-bold text-teal-700 bg-teal-50">RestauMargin</th>
                  <th className="text-center py-4 px-4 font-semibold">Ratatool</th>
                  <th className="text-center py-4 px-4 font-semibold">Yokitup</th>
                  <th className="text-center py-4 px-4 font-semibold">Excel</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { f: 'Fiches techniques automatisées', r: true, ra: true, y: true, e: false },
                  { f: 'Calcul food cost temps réel', r: true, ra: true, y: true, e: false },
                  { f: 'Scan de factures OCR', r: true, ra: false, y: true, e: false },
                  { f: 'Intelligence artificielle (19 actions)', r: true, ra: false, y: false, e: false },
                  { f: 'Alertes hausse fournisseurs', r: true, ra: false, y: true, e: false },
                  { f: 'Menu engineering intégré', r: true, ra: true, y: true, e: false },
                  { f: 'Multi-restaurants', r: true, ra: false, y: true, e: false },
                  { f: 'PWA mobile / tablette', r: true, ra: true, y: false, e: false },
                  { f: 'Mode hors-ligne', r: true, ra: false, y: false, e: true },
                  { f: 'HACCP intégré', r: true, ra: false, y: false, e: false },
                  { f: 'Négociation IA fournisseurs', r: true, ra: false, y: false, e: false },
                  { f: 'Hébergement Europe (RGPD)', r: true, ra: true, y: true, e: 'local' },
                  { f: 'Tarif (par mois)', r: '29 EUR', ra: '49 EUR', y: '99 EUR', e: '0 EUR' },
                  { f: 'Engagement', r: 'Aucun', ra: '12 mois', y: '12 mois', e: 'N/A' },
                  { f: 'Essai gratuit', r: '7 jours', ra: '14 jours', y: 'Demo seulement', e: 'N/A' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.f}</td>
                    <td className="py-3 px-4 text-center bg-teal-50/50">
                      {typeof row.r === 'boolean' ? (row.r ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : <strong className="text-teal-700">{row.r}</strong>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.ra === 'boolean' ? (row.ra ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : row.ra}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.y === 'boolean' ? (row.y ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : row.y}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.e === 'boolean' ? (row.e ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : row.e}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-mono-500 mt-4 text-center">
            Comparatif établi en avril 2026 sur la base des informations publiées par les éditeurs.
          </p>
        </div>
      </section>

      {/* ── Logiciel vs tableau Excel ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Logiciel vs tableau Excel : pourquoi automatiser le calcul de marge
            </h2>
            <p className="text-lg text-mono-400 max-w-3xl mx-auto">
              Beaucoup de restaurateurs calculent encore leur marge à la main sur un tableur. Un logiciel qui
              calcule la marge automatiquement supprime la saisie, les erreurs de formule et les fiches
              obsolètes. Voici la comparaison concrète entre le calcul manuel sur Excel et un logiciel de
              calcul de marge restaurant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Excel manuel */}
            <div className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-mono-975 text-mono-400 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-mono-100 text-xl">Calcul manuel sur Excel</h3>
              </div>
              <ul className="space-y-3 text-sm text-mono-400">
                {[
                  'Vous recopiez chaque formule de food cost et de marge brute à la main, plat par plat.',
                  'Dès qu\'un prix fournisseur change, vous devez retrouver et corriger chaque cellule concernée.',
                  'Aucune alerte : un food cost qui dérive au-dessus de 35 % passe inaperçu pendant des semaines.',
                  'Risque d\'erreur élevé (mauvaise référence de cellule, oubli de la TVA, mélange HT/TTC).',
                  'Pas de mise à jour temps réel : le fichier devient obsolète dès le lendemain.',
                  'Comptez 6 à 10 heures par mois rien qu\'en saisie et en vérification.',
                ].map((line, i) => (
                  <li key={i} className="flex gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logiciel automatique */}
            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 sm:p-7 relative">
              <span className="absolute -top-3 left-6 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Recommandé
              </span>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-teal-600 text-white rounded-xl flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-mono-100 text-xl">Logiciel qui calcule la marge automatiquement</h3>
              </div>
              <ul className="space-y-3 text-sm text-mono-350">
                {[
                  'Le logiciel calcule le food cost, la marge brute et le coefficient dès que vous saisissez une fiche technique.',
                  'Un prix fournisseur change ? Toutes les fiches qui utilisent l\'ingrédient se recalculent en cascade.',
                  'Alertes en temps réel dès qu\'un plat dépasse votre seuil de food cost.',
                  'Zéro erreur de formule : la TVA et le passage HT/TTC sont gérés automatiquement.',
                  'Données toujours à jour, synchronisées avec vos factures via le scan OCR.',
                  'Environ 1 heure par mois : vous pilotez, le logiciel calcule.',
                ].map((line, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-7 text-center">
            <p className="text-mono-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              <strong className="text-mono-100">En résumé :</strong> Excel reste viable en-dessous de 30 plats sans
              variations fréquentes de prix. Au-delà, un logiciel de calcul de marge restaurant qui calcule tout
              automatiquement vous fait gagner 8 à 15 heures par mois et évite de piloter vos prix sur des chiffres
              périmés. Pour comprendre les formules en détail, lisez notre{' '}
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline font-semibold hover:text-teal-800">
                guide complet du calcul de marge restaurant
              </Link>{' '}
              ou testez d'abord notre{' '}
              <Link to="/outils/calculateur-marge-restaurant" className="text-teal-700 underline font-semibold hover:text-teal-800">
                calculateur de marge gratuit
              </Link>{' '}
              avant de passer au logiciel.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pourquoi un logiciel ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Pourquoi un logiciel et pas Excel ?
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              5 raisons pour lesquelles les restaurateurs sérieux passent au logiciel dès qu'ils ont plus de 30 plats.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Gain de temps massif',
                desc: 'Excel demande 6 à 10 heures/mois en saisie. Un logiciel SaaS réduit ce temps à 1 heure/mois grâce aux automatisations.',
              },
              {
                icon: <FileSpreadsheet className="w-6 h-6" />,
                title: 'Calculs toujours à jour',
                desc: 'Les prix matières changent chaque semaine. Excel devient obsolète dès qu\'un fournisseur change un prix. Le logiciel recalcule tout en temps réel.',
              },
              {
                icon: <Receipt className="w-6 h-6" />,
                title: 'Scan de factures',
                desc: 'Photographiez vos bordereaux : l\'OCR extrait les prix et met à jour vos fiches automatiquement. Impossible avec Excel.',
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: 'Alertes en temps réel',
                desc: 'Recevez une notification quand un prix matière dépasse votre seuil et impacte un plat. Excel ne sait pas alerter.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Tableaux de bord interactifs',
                desc: 'Marge brute par catégorie, top 10 plats rentables, évolution food cost mois par mois. Excel exige des heures de mise en page.',
              },
              {
                icon: <Cloud className="w-6 h-6" />,
                title: 'Mobilité et collaboration',
                desc: 'Modifiez vos fiches depuis votre cuisine sur tablette, votre comptable depuis son bureau. Sauvegardes automatiques. Excel = fichier local fragile.',
              },
            ].map((reason, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                  {reason.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2 text-lg">{reason.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fonctionnalites RestauMargin ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Fonctionnalités RestauMargin
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Le logiciel le plus complet du marché, conçu par des restaurateurs pour des restaurateurs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Calculator className="w-6 h-6" />, title: 'Fiches techniques auto', desc: 'Grammages, allergènes, étapes. Le food cost se calcule à chaque mise à jour de prix.' },
              { icon: <Receipt className="w-6 h-6" />, title: 'Scan factures OCR', desc: 'Photographiez vos bordereaux Metro, Transgourmet, Sysco : prix mis à jour automatiquement.' },
              { icon: <Brain className="w-6 h-6" />, title: '19 actions IA', desc: 'Suggestion recettes, optimisation marges, analyse food cost, détection anomalies, commande vocale.' },
              { icon: <Bell className="w-6 h-6" />, title: 'Alertes intelligentes', desc: 'Notification temps réel quand un prix fournisseur impacte la marge d\'un plat.' },
              { icon: <Target className="w-6 h-6" />, title: 'Menu engineering', desc: 'Stars, chevaux de labour, énigmes, poids morts. Optimisez votre carte data-driven.' },
              { icon: <Shield className="w-6 h-6" />, title: 'HACCP intégré', desc: 'Plan de maîtrise sanitaire, relevés de températures, traçabilité. Compliance 2026.' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Mercuriale fournisseurs', desc: 'Suivi historique des prix, comparaison fournisseurs, négociation IA des hausses.' },
              { icon: <Cloud className="w-6 h-6" />, title: 'Multi-restaurants', desc: 'Pilotage centralisé de plusieurs établissements. Comparatifs et reporting consolidé.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-mono-100 text-white font-semibold rounded-full hover:bg-[#333] transition-colors">
              Voir la demo interactive
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tarifs ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Tarifs simples, sans engagement
          </h2>
          <p className="text-lg text-mono-400 mb-12">
            Choisissez le plan qui correspond à votre établissement. Résiliable à tout moment.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-teal-600 rounded-2xl p-8 text-left relative shadow-lg shadow-teal-600/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                LE PLUS POPULAIRE
              </div>
              <h3 className="font-extrabold text-mono-100 text-2xl mb-2">Pro</h3>
              <p className="text-sm text-mono-400 mb-4">Pour un restaurant indépendant</p>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-mono-100">29 EUR</span>
                <span className="text-mono-500">/mois</span>
              </div>
              <ul className="space-y-2 text-sm mb-8">
                {['Fiches techniques illimitées', 'Scan de factures OCR', '19 actions IA', 'Menu engineering', 'Alertes temps réel', 'Support email <24h'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link
                to="/login?mode=register"
                className="block text-center w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors"
              >
                Essai gratuit 7 jours
              </Link>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-8 text-left">
              <h3 className="font-extrabold text-mono-100 text-2xl mb-2">Business</h3>
              <p className="text-sm text-mono-400 mb-4">Pour les groupes multi-restaurants</p>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-mono-100">79 EUR</span>
                <span className="text-mono-500">/mois</span>
              </div>
              <ul className="space-y-2 text-sm mb-8">
                {['Tout le plan Pro', 'Multi-restaurants illimités', 'Reporting consolidé', 'API & intégrations', 'Onboarding personnalisé', 'Support prioritaire <2h'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link
                to="/login?mode=register"
                className="block text-center w-full py-3 bg-mono-100 hover:bg-[#333] text-white font-bold rounded-full transition-colors"
              >
                Essai gratuit 7 jours
              </Link>
            </div>
          </div>

          <p className="text-sm text-mono-500 mt-8">
            Voir le <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800">détail complet des plans</Link> et la grille tarifaire.
          </p>
        </div>
      </section>

      {/* ── Temoignages ── */}
      {/* Section masquee tant qu aucun temoignage REEL n existe (cf. note sur le tableau). */}
      {testimonials.length > 0 && (
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-mono-400">
              des restaurants utilisent RestauMargin au quotidien.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-mono-350 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="font-bold text-mono-100 text-sm">{t.name}</div>
                  <div className="text-xs text-mono-500">{t.role}</div>
                  <div className="text-xs text-teal-700 font-medium">{t.company}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/temoignages" className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-800 transition-colors">
              Lire tous les témoignages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              FAQ logiciel marge restaurant
            </h2>
            <p className="text-lg text-mono-400">
              Les questions fréquentes des restaurateurs avant de choisir.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Une question spécifique ?</strong> Contactez notre équipe via la <Link to="/demo" className="underline font-semibold hover:text-teal-700">page demo</Link> ou écrivez à contact@restaumargin.fr. Réponse sous 4h ouvrées.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Prêt à reprendre le contrôle de vos marges ?
          </h2>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-3">
            Rejoignez les des restaurants qui ont gagné en moyenne 5 points de marge brute en 6 mois avec RestauMargin.
          </p>
          <p className="text-teal-50 mb-10">
            Essai gratuit 7 jours - Sans carte bancaire - Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 font-extrabold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-2xl"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Voir la demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-mono-100 mb-8 text-center">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Calcul marge restaurant : guide complet</h3>
              <p className="text-sm text-mono-500">Formules, benchmarks, tableau à copier et cas pratiques chiffrés pour maîtriser le calcul de marge.</p>
            </Link>
            <Link to="/outils/calculateur-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <FileSpreadsheet className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Calculateur de marge gratuit</h3>
              <p className="text-sm text-mono-500">L'outil en ligne qui calcule food cost, marge brute et nette en 30 secondes, sans Excel.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <TrendingUp className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Calculer le prix de vente d'un plat</h3>
              <p className="text-sm text-mono-500">Méthodes coefficient, marge cible, pricing psychologique. Cas pratique chiffré.</p>
            </Link>
            <Link to="/pricing" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Target className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Tarifs RestauMargin</h3>
              <p className="text-sm text-mono-500">Détail des plans Pro et Business. Voir l'essai gratuit 7 jours.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <PublicFooter />
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 mt-8 flex gap-3 text-sm leading-relaxed`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-mono-1000 border border-mono-900 rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
