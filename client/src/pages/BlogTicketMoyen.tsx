import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, Wine, Utensils, Sparkles, Coffee, BookOpen as BookIcon, GraduationCap, Star, Shield, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BlogTicketMoyen() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Augmenter le ticket moyen de son restaurant : 10 techniques efficaces"
        description="Upselling, cross-selling, design de carte, formation de la salle… 10 techniques concrètes pour augmenter le ticket moyen de votre restaurant."
        path="/blog/augmenter-ticket-moyen-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Augmenter le ticket moyen de son restaurant : 10 techniques efficaces",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/augmenter-ticket-moyen-restaurant"
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
            Revenus
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Augmenter le ticket moyen de son restaurant : 10 techniques
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            +3€ de ticket moyen sur 800 couverts/mois = +28 800€ de CA annuel sur des couverts déjà acquis. Le levier le plus rentable et le plus sous-exploité.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#737373]">
            <span>27 avril 2026</span>
            <span>·</span>
            <span>10 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Beaucoup de restaurateurs cherchent à remplir davantage la salle (plus dur, plus coûteux en marketing) plutôt qu'à valoriser chaque client présent. Ces euros supplémentaires arrivent sur des couverts déjà acquis, sur des charges fixes déjà payées, donc avec une marge nette quasi pure.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-teal-600 transition-colors">1. Définition et calcul du ticket moyen</a></li>
            <li><a href="#actionnable" className="hover:text-teal-600 transition-colors">2. Pourquoi c'est plus actionnable que le volume</a></li>
            <li><a href="#impact" className="hover:text-teal-600 transition-colors">3. Calcul d'impact d'une hausse de 3€</a></li>
            <li><a href="#techniques" className="hover:text-teal-600 transition-colors">4. Les 10 techniques à mettre en place</a></li>
            <li><a href="#tableau" className="hover:text-teal-600 transition-colors">5. Tableau d'impact selon volume</a></li>
            <li><a href="#ethique" className="hover:text-teal-600 transition-colors">6. Upselling éthique : la frontière</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Définition et calcul du ticket moyen</h2>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Ticket moyen = CA HT (ou TTC) / Nombre de couverts servis
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Toujours diviser par le <strong>nombre de couverts</strong>, jamais par le nombre d'additions. Le ticket moyen midi est typiquement 30-45% inférieur au soir : les suivre séparément.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Benchmarks :</strong></p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Bistrot : midi 22-32€, soir 32-48€</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Brasserie : midi 25-35€, soir 38-58€</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Pizzeria : midi 18-25€, soir 22-32€</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Sushi à la carte : midi 28-40€, soir 38-65€</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Gastronomique 1* : midi 65-95€, soir 95-160€</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="actionnable" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Pourquoi c'est plus actionnable que le volume</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Augmenter le volume (+10%)</strong> : coût marketing important, charges variables proportionnelles, risque de saturation cuisine, investissement capacité.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Augmenter le ticket moyen (+10%)</strong> : coût marketing nul, charges variables limitées au food cost (souvent {'<'}35%), aucun stress opérationnel, aucun investissement.
          </p>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-emerald-700">La règle d'or</p>
            <p className="text-sm text-emerald-700">Pour un restaurant qui tourne déjà bien (taux {'>'}65%), augmenter le ticket est statistiquement 3 à 5 fois plus rentable que d'augmenter le volume.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="impact" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Calcul d'impact d'une hausse de 3€</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant L'Olivier : 800 couverts/mois, ticket 31€, food cost 32%.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>+3€ → CA annuel : +28 800€</div>
            <div>Food cost incrémental (30%) : -0,90€/couvert</div>
            <div>Marge nette par couvert : 2,10€</div>
            <div><strong>Marge nette annuelle additionnelle : +20 160€</strong></div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Sur un restaurant à 1 500 couverts/mois, ce serait +37 800€/an. Sur 2 000 couverts/mois, +50 400€/an.
          </p>
        </section>

        {/* Section 4 */}
        <section id="techniques" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Wine className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Les 10 techniques à mettre en place</h2>
          </div>

          <div className="space-y-5">
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2 flex items-center gap-2"><Wine className="w-4 h-4 text-purple-600" /> 1. Upselling boissons : carafe → bouteille</p>
              <p className="text-[#525252] text-sm leading-relaxed">"Une grande bouteille pour la table ?" Impact : +1,50 à +3€/couvert. Une bouteille à 32€ = même CA que 4 verres mais marge supérieure et réincitation.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2 flex items-center gap-2"><Utensils className="w-4 h-4 text-purple-600" /> 2. Suggérer entrées et desserts systématiquement</p>
              <p className="text-[#525252] text-sm leading-relaxed">La règle des 70% : viser 70% de prise d'entrée et 60% de prise de dessert. Impact : +4 à +7€/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2">3. Construire une formule "offre complète"</p>
              <p className="text-[#525252] text-sm leading-relaxed">Plat 22€ + dessert 8€ + café 3€ = 33€ → formule à 32€. L'addition gonfle, food cost incrémental faible. +6 à +12€/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2">4. Carte des vins intelligente</p>
              <p className="text-[#525252] text-sm leading-relaxed">3 niveaux de prix, accords mets-vins, vins au verre de qualité (15cl à 8-12€), 3 coups de cœur. Impact : +3 à +6€/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2">5. Formule déjeuner premium</p>
              <p className="text-[#525252] text-sm leading-relaxed">Ajouter une formule 24-29€ à côté du 15-19€ habituel. Effet "ancrage" : 30-40% des clients basculent. +4 à +7€/couvert midi.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2">6. Plats du jour à marge élevée</p>
              <p className="text-[#525252] text-sm leading-relaxed">Annoncé oralement, taux de prise 35-50%. Choisissez-le pour sa marge. Impact : +1 à +2€ de marge/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2 flex items-center gap-2"><Coffee className="w-4 h-4 text-purple-600" /> 7. Café et digestif systématiques</p>
              <p className="text-[#525252] text-sm leading-relaxed">Marges 80-92%. Café avec mignardise = ticket 5-6€ pour 80 centimes de food cost. +3 à +6€/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2 flex items-center gap-2"><BookIcon className="w-4 h-4 text-purple-600" /> 8. Design de carte (menu engineering)</p>
              <p className="text-[#525252] text-sm leading-relaxed">Lecture en Z, plats Stars en haut-gauche/bas-droite, prix sans le €, descriptions de 12-18 mots (+28% de prise). +2 à +4€/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-600" /> 9. Former intensivement la salle</p>
              <p className="text-[#525252] text-sm leading-relaxed">4 sessions de 2h : produits, scripts upselling, vins, gestion d'objections. Incentive sur ventes additionnelles. +3 à +6€/couvert.</p>
            </div>
            <div className="border border-[#E5E7EB] rounded-xl p-5">
              <p className="font-semibold text-[#111111] mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-purple-600" /> 10. Offres spéciales premium</p>
              <p className="text-[#525252] text-sm leading-relaxed">Plateau anniversaire (45€), magnum du chef, soirée accord mets-vins (65€), menu dégustation (48€). +1 à +3€/couvert moyen.</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="tableau" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Tableau d'impact selon volume</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Marge nette additionnelle par an</strong> (food cost incrémental 30%) :</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> +3€ × 800 couv./mois = <strong>+20 160€/an</strong></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> +5€ × 1 200 couv./mois = <strong>+50 400€/an</strong></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> +5€ × 2 000 couv./mois = <strong>+84 000€/an</strong></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> +10€ × 1 200 couv./mois = <strong>+100 800€/an</strong></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> +10€ × 2 000 couv./mois = <strong>+168 000€/an</strong></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un restaurant à 1 200 couverts/mois qui réussit +5€ de ticket génère 50 400€ de marge nette annuelle. C'est 1,5 salaire chargé, sans coût d'acquisition.
          </p>
        </section>

        {/* Section 6 */}
        <section id="ethique" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Upselling éthique : la frontière</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            L'upselling agressif détruit la fidélisation. Un client qui sort en ayant l'impression qu'on lui a "vendu" ne revient pas.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 5 règles d'or :</strong></p>
          <ol className="space-y-2 text-[#374151] list-decimal pl-5 mb-4">
            <li>Ne jamais forcer. Une suggestion non prise est respectée immédiatement.</li>
            <li>Suggérer, pas imposer. Éviter "vous voulez la mousse ou la tarte ?" qui force le choix.</li>
            <li>Adapter au profil. Lire le client (déjeuner d'affaires vs couple modeste).</li>
            <li>Ne pas mentir. Pas de "fait maison" exagéré, pas de fausse rareté.</li>
            <li>Annoncer les prix. "Plat du jour à 24€" est éthique.</li>
          </ol>
          <p className="text-[#374151] leading-relaxed">
            <strong>Le KPI à surveiller :</strong> le taux de retour client (clients qui reviennent dans les 90 jours). Un bon restaurant maintient un taux {'>'}35% tout en faisant grimper son ticket.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Mon ticket moyen baisse depuis 6 mois, que faire ?",
                a: "Trois pistes : cannibalisation par une formule trop bon marché, baisse de la prise de boissons (bouteilles → carafes), changement de profil clientèle. Comparer midi et soir séparément aide à identifier la zone problématique."
              },
              {
                q: "Comment mesurer l'efficacité d'une nouvelle technique ?",
                a: "Comparez le ticket moyen sur 2 semaines avant et 2 semaines après. Segmentez par jour de la semaine (un mardi vs un mardi) car les profils diffèrent. Une hausse {'>'}5% est statistiquement significative."
              },
              {
                q: "Faut-il augmenter ses prix ou augmenter le ticket moyen ?",
                a: "Les deux sont des leviers différents. Combiner légère hausse de prix annuelle (3-4%) + travail continu sur le ticket via les 10 techniques est la stratégie la plus durable."
              },
              {
                q: "Comment ne pas frustrer le client en proposant trop ?",
                a: "Maximum 3 suggestions durant un repas : à l'arrivée (apéritif/eau), entre commande et plat (vin ou entrée à partager), en fin de plat (dessert + café). Au-delà, l'expérience devient pesante."
              },
              {
                q: "Le digital peut-il aider ?",
                a: "Oui, énormément. La commande au QR code ou tablette montre toujours les options et boissons, suggère automatiquement des desserts. Augmente le ticket de 8 à 15% par rapport à une prise de commande traditionnelle."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez votre ticket moyen comme un pro</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Suivi automatique du ticket moyen par jour, par service et par catégorie de plat. Identification des plats Stars, Puzzles et Dogs. Calcul d'impact de chaque action sur le résultat.
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
          <Link to="/blog/inventaire-restaurant-guide" className="text-sm text-teal-600 hover:underline">Maîtriser ses inventaires →</Link>
        </div>
      </main>
    </div>
  );
}
