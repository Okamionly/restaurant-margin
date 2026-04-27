import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Layers, Server, Package, ShieldCheck, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BlogLogicielGestion() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel de gestion restaurant : comparatif et guide d'achat 2026"
        description="Comparez les meilleurs logiciels de gestion pour restaurant : caisse, stocks, comptabilité, plannings, marges. Stack idéal selon votre taille."
        path="/blog/logiciel-gestion-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Logiciel de gestion restaurant : comparatif et guide d'achat 2026",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/logiciel-gestion-restaurant"
          })
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-b from-teal-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-[720px] mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Outils
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Logiciel de gestion restaurant : comparatif et guide d'achat 2026
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            5 catégories d'outils, 8 solutions analysées (Lightspeed, Skello, Pennylane, RestauMargin…) et stack idéal selon la taille de votre établissement.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#737373]">
            <span>27 avril 2026</span>
            <span>·</span>
            <span>12 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          La marge nette moyenne en restauration française est de <strong>3 à 6 %</strong> du chiffre d'affaires. Sur un restaurant à 600 000 € de CA, vous oscillez entre 18 000 et 36 000 € de bénéfice. À ce niveau, un seul mauvais choix d'outil peut faire basculer votre exercice dans le rouge. Et pourtant, <strong>52 % des restaurateurs indépendants</strong> pilotent encore leurs marges sur Excel ou en mémoire.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#pourquoi" className="hover:text-teal-600 transition-colors">1. Pourquoi un logiciel est devenu incontournable</a></li>
            <li><a href="#categories" className="hover:text-teal-600 transition-colors">2. Les 5 catégories d'outils</a></li>
            <li><a href="#solutions" className="hover:text-teal-600 transition-colors">3. Comparatif de 8 solutions</a></li>
            <li><a href="#stack" className="hover:text-teal-600 transition-colors">4. Stack idéal selon la taille</a></li>
            <li><a href="#vigilance" className="hover:text-teal-600 transition-colors">5. Points de vigilance avant d'acheter</a></li>
            <li><a href="#roi" className="hover:text-teal-600 transition-colors">6. ROI : exemple sur 12 mois</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="pourquoi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Pourquoi un logiciel est devenu incontournable</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>La marge se joue sur 1-2 points</strong> : sans logiciel, vous ne connaissez pas votre food cost réel jour après jour. Vous découvrez le bilan en fin d'année. Trop tard.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Les fournisseurs augmentent en silence</strong> : inflation 2024-2026 = +15 à +35 % sur certains produits. Sans suivi automatique, vous n'ajustez pas vos recettes ni vos prix.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Le temps administratif explose</strong> : DSN, FACTUR-X, NF525, URSSAF, mutuelle HCR, plannings = 15-25h/semaine sans outils. Avec le bon stack : 5-8h.</span>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="categories" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Les 5 catégories d'outils</h2>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>1. Caisse POS (NF525 obligatoire)</div>
            <div>2. Gestion des stocks (FIFO, alertes seuil)</div>
            <div>3. Comptabilité (multi-TVA, FACTUR-X)</div>
            <div>4. RH & Plannings (CCN HCR, DSN)</div>
            <div>5. Calcul des marges & pilotage</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Caisse POS</strong> : Lightspeed, L'Addition, Tiller, Square, Hiboutik. Depuis 2018, certification NF525 obligatoire (amende 7 500 €/caisse non conforme).
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Stocks</strong> : Inpulse, Easilys, Foodics, Marketman. Le stock matière représente 30-40 % du CA mensuel — sans pilotage, on stocke trop ou trop peu.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Comptabilité</strong> : Pennylane, Tiime, iPaidThat, Sage. <strong>RH</strong> : Skello, Snapshift, Combo, PayFit. <strong>Marges</strong> : RestauMargin, Inpulse (module), Foodics (analytics).
          </p>
        </section>

        {/* Section 3 */}
        <section id="solutions" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Comparatif de 8 solutions</h2>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Lightspeed (POS) : 89-149 €/mois — multi-sites mature</div>
            <div>L'Addition (POS) : 49-89 €/mois — indépendants FR</div>
            <div>Progirest (ERP) : 150-300 €/mois — tout-en-un</div>
            <div>Deliverect (Livraison) : 49-99 €/mois — UberEats/Deliveroo</div>
            <div>Skello (RH) : 6-8 €/salarié/mois — CCN HCR native</div>
            <div>Pennylane (Compta) : 49-99 €/mois — collaborative EC</div>
            <div>Inpulse (Stock+Marge) : 129-249 €/mois — fiches avancées</div>
            <div>RestauMargin (Marges) : 0-19-49 €/mois — pilotage rentabilité</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>RestauMargin</strong> : ultra-spécialisé sur la marge (food cost, prime cost, simulation prix), import factures fournisseurs auto, fiches techniques avec gestion perte au parage, kiosk mode + balance Bluetooth pour pesée live. Version gratuite à vie pour les indépendants.
          </p>
        </section>

        {/* Section 4 */}
        <section id="stack" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Server className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Stack idéal selon la taille</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Restaurant solo</strong> ({'<'} 50 couverts/jour, 1-3 salariés) — Budget : <strong>80-150 €/mois</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>POS : L'Addition (49 €) ou Tiller</div>
            <div>Compta : Pennylane ou Tiime (49 €)</div>
            <div>Marges : RestauMargin gratuit ou 19 €</div>
            <div>RH : Excel + DSN trimestrielle via EC</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Restaurant PME</strong> (50-150 couverts/jour, 4-15 salariés) — Budget : <strong>300-500 €/mois</strong>
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>POS : Lightspeed (99 €) ou L'Addition Pro (79 €)</div>
            <div>Compta : Pennylane (79 €)</div>
            <div>Marges : RestauMargin Pro (49 €) ou Inpulse (129 €)</div>
            <div>Plannings : Skello (60 €)</div>
            <div>Livraison : Deliverect (49 €) si plateformes</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Multi-sites</strong> ({'>'} 150 couverts, {'>'} 15 salariés) — Budget : <strong>800-1 800 €/mois</strong> avec Lightspeed Pro, Progirest/Foodics, Pennylane Premium, Inpulse Pro, Skello + PayFit, BI Looker Studio.
          </p>
        </section>

        {/* Section 5 */}
        <section id="vigilance" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Points de vigilance avant d'acheter</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Formation</strong> : 80 % des échecs viennent du défaut de formation. Prévoyez 2-4h par utilisateur, un référent par site, période double-saisie 1-2 semaines.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Migration</strong> : export fiches techniques, import fournisseurs/codes articles, reprise historique 3 mois minimum. Allouez 1-2 mois.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Intégration</strong> : APIs natives POS → Compta → Stocks → Livraison. Stack non intégrée = double saisie = erreurs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Conformité</strong> : NF525 (caisse), RGPD, FACTUR-X, DSN automatisée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Coûts cachés</strong> : matériel 1 000-3 000 €/poste, frais de paiement 1,2-2 % du CA, maintenance 50-150 €/an, renouvellement matériel tous les 4-5 ans.</span>
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="roi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. ROI : exemple sur 12 mois</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Cas concret : restaurant indépendant, 80 couverts/jour, <strong>600 000 € CA annuel</strong>.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>AVANT (sans stack)</div>
            <div>Food cost à la louche : 33 % réel</div>
            <div>Pertes stock non détectées : 2 % CA</div>
            <div>Heures admin : 18h/sem (50 €/h)</div>
            <div>Marge nette : 4 % = 24 000 €</div>
            <div>---</div>
            <div>APRÈS (stack 350 €/mois = 4 200 €/an)</div>
            <div>Food cost piloté à 29,5 % : +21 000 €</div>
            <div>Pertes stock /2 : +6 000 €</div>
            <div>Erreurs caisse {'<'} 0,2 % : +4 800 €</div>
            <div>Gain net : 31 800 - 4 200 = +27 600 €</div>
            <div>ROI x6,5 — Marge passe à 8,6 %</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Puis-je tout faire avec Excel ?",
                a: "Théoriquement oui, en pratique non. Excel ne gère pas la NF525, ne déduit pas le stock automatiquement, ne fait pas la DSN. Vous pouvez piloter une partie de la marge sur Excel — mais vous y passez 3x plus de temps qu'avec un outil dédié."
              },
              {
                q: "Quelle est la durée d'engagement habituelle ?",
                a: "La plupart des SaaS (Lightspeed, Skello, Pennylane, RestauMargin) sont sans engagement ou en mensuel. Évitez les contrats > 12 mois sauf forte remise (50 %+) car le marché évolue vite."
              },
              {
                q: "Les solutions cloud sont-elles fiables en cas de coupure internet ?",
                a: "Les bonnes solutions ont un mode offline (cache local) qui permet de continuer la prise de commande et l'encaissement même sans internet. Vérifiez ce point avant de signer — c'est critique en zone rurale."
              },
              {
                q: "Combien de temps pour amortir un logiciel à 200 €/mois ?",
                a: "Si l'outil vous fait gagner 1 point de food cost sur 600 000 € CA, c'est 6 000 €/an = remboursé en 12 jours. Le ROI est presque toujours positif si l'outil est bien utilisé."
              },
              {
                q: "Faut-il intégrer ChatGPT / IA dans son stack restaurant ?",
                a: "Pas en remplacement, mais en complément. L'IA est utile pour : prévoir la fréquentation, générer des descriptions de plats, suggérer des accords vins, automatiser le scoring de revues clients. Plusieurs solutions intègrent ces fonctions en 2026 (Skello, Lightspeed AI, RestauMargin)."
              }
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-[#525252] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Testez RestauMargin sans engagement</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Connectez votre caisse, importez vos factures fournisseurs, calculez food cost et prime cost en temps réel — version gratuite à vie pour les indépendants.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
      </main>
    </div>
  );
}
