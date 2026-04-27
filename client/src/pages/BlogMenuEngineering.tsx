import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Star, TrendingUp, HelpCircle, Trash2, LayoutGrid, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BlogMenuEngineering() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Menu Engineering & Matrice BCG restaurant : optimisez votre carte (2026)"
        description="Stars, Plowhorses, Puzzles, Dogs : apprenez à classer vos plats avec la matrice de menu engineering pour augmenter le ticket moyen et réduire le food cost."
        path="/blog/menu-engineering-boston-matrix"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Menu Engineering et Matrice BCG : optimisez votre carte de restaurant en 2026",
            "description": "Stars, Plowhorses, Puzzles, Dogs : classez vos plats selon leur popularité et rentabilité pour maximiser votre marge.",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": { "@type": "Organization", "name": "La rédaction RestauMargin", "url": "https://www.restaumargin.fr/a-propos" },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/images/blog/menu-engineering-boston-matrix.jpg",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/menu-engineering-boston-matrix",
            "keywords": "menu engineering restaurant, matrice BCG restauration, optimiser carte restaurant, stars plowhorses puzzles dogs, rentabilité carte menu, food cost carte restaurant",
            "about": [
              { "@type": "Thing", "name": "Menu Engineering" },
              { "@type": "Thing", "name": "Matrice BCG restauration" },
              { "@type": "Thing", "name": "Optimisation de carte de restaurant" }
            ]
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
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      {/* Hero image */}
      <div className="w-full bg-gradient-to-br from-purple-700 to-purple-900 h-56 sm:h-72 flex items-center justify-center relative overflow-hidden">
        <img
          src="/images/blog/menu-engineering-boston-matrix.jpg"
          alt="Matrice de menu engineering restaurant - Stars, Plowhorses, Puzzles, Dogs"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="relative z-10 text-center px-4">
          <span className="inline-flex items-center gap-1.5 text-purple-200 bg-purple-800/60 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Menu &amp; Rentabilité
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight max-w-[640px]">
            Menu Engineering &amp; Matrice BCG : optimisez votre carte de restaurant
          </h1>
        </div>
      </div>

      {/* Meta + tags */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4 text-sm text-[#737373] border-b border-[#E5E7EB]">
        <span>27 avril 2026</span>
        <span>·</span>
        <span>9 min de lecture</span>
        <span>·</span>
        <span>La rédaction RestauMargin</span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {['Carte', 'Menu engineering', 'Marge', 'BCG'].map(tag => (
            <span key={tag} className="bg-[#F5F5F5] text-[#525252] text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24 pt-8">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Votre carte est votre meilleur commercial — ou votre pire ennemi. Un menu mal conçu peut faire perdre plusieurs milliers d'euros par mois, même avec une cuisine excellente et une salle pleine. Le menu engineering transforme votre carte en outil de rentabilité. Au cœur de cette approche : la <strong>matrice BCG adaptée à la restauration</strong>.
        </p>

        {/* Sommaire */}
        <nav className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#definition" className="hover:text-purple-600 transition-colors">1. Qu'est-ce que le menu engineering ?</a></li>
            <li><a href="#matrice" className="hover:text-purple-600 transition-colors">2. La matrice BCG adaptée à la restauration</a></li>
            <li><a href="#classifier" className="hover:text-purple-600 transition-colors">3. Comment classer vos plats</a></li>
            <li><a href="#strategies" className="hover:text-purple-600 transition-colors">4. Stratégies par catégorie</a></li>
            <li><a href="#visuel" className="hover:text-purple-600 transition-colors">5. Optimiser visuellement votre carte</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="definition" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Qu'est-ce que le menu engineering ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le menu engineering est l'analyse systématique de chaque plat selon deux critères : sa <strong>popularité</strong> (volume de ventes) et sa <strong>rentabilité</strong> (marge brute). Formalisé en 1982 par Kasavana &amp; Smith (Michigan State University), c'est un standard dans les groupes de restauration — et un avantage massif pour les indépendants qui l'appliquent.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Ticket moyen', value: '+5 à +15 %', color: 'teal' },
              { label: 'Food cost', value: '−2 à −4 pts', color: 'blue' },
              { label: 'Marge nette', value: '+3 à +8 %', color: 'purple' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-4 text-center`}>
                <p className={`text-2xl font-extrabold text-${color}-700 mb-1`}>{value}</p>
                <p className="text-sm text-[#525252]">{label} après optimisation</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Matrice */}
        <section id="matrice" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. La matrice BCG en restauration</h2>
          </div>

          {/* Image placeholder matrice */}
          <div className="w-full bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl border border-purple-100 overflow-hidden mb-5 relative">
            <img
              src="/images/blog/matrice-menu-engineering.jpg"
              alt="Matrice de menu engineering : axe popularité vs axe rentabilité, 4 quadrants Stars Plowhorses Puzzles Dogs"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              loading="lazy"
            />
            <div className="relative z-10 grid grid-cols-2 gap-0">
              {[
                { emoji: '⭐', name: 'Stars', desc: 'Haute marge + haute popularité', bg: 'bg-emerald-100/80', text: 'text-emerald-800' },
                { emoji: '❓', name: 'Puzzles', desc: 'Haute marge + basse popularité', bg: 'bg-blue-100/80', text: 'text-blue-800' },
                { emoji: '🐄', name: 'Plowhorses', desc: 'Basse marge + haute popularité', bg: 'bg-orange-100/80', text: 'text-orange-800' },
                { emoji: '🐕', name: 'Dogs', desc: 'Basse marge + basse popularité', bg: 'bg-red-100/80', text: 'text-red-800' },
              ].map(({ emoji, name, desc, bg, text }) => (
                <div key={name} className={`${bg} p-5 border border-white/50`}>
                  <p className="text-2xl mb-1">{emoji}</p>
                  <p className={`font-bold ${text} mb-1`}>{name}</p>
                  <p className="text-xs text-[#525252]">{desc}</p>
                </div>
              ))}
            </div>
            <div className="relative z-10 flex justify-between px-4 py-2 bg-white/60 text-xs text-[#737373] border-t border-purple-100">
              <span>← Marge faible · Marge élevée →</span>
              <span>↕ Popularité</span>
            </div>
          </div>
        </section>

        {/* Section 3 — Classifier */}
        <section id="classifier" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Classer vos plats en 3 étapes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                n: '01', title: 'Calculer la marge brute de chaque plat',
                content: (
                  <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] mt-2">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-[#F5F5F5]"><th className="text-left px-3 py-2">Plat</th><th className="text-center px-3 py-2">Prix HT</th><th className="text-center px-3 py-2">Food cost</th><th className="text-center px-3 py-2 text-teal-700">Marge brute</th></tr></thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {[
                          ['Bavette échalote', '24 €', '7,80 €', '16,20 €'],
                          ['Salade César', '14 €', '2,90 €', '11,10 €'],
                          ['Côte de bœuf', '38 €', '18,00 €', '20,00 €'],
                        ].map(([p, prix, fc, mb]) => (
                          <tr key={p} className="bg-white"><td className="px-3 py-2">{p}</td><td className="px-3 py-2 text-center">{prix}</td><td className="px-3 py-2 text-center text-red-500">{fc}</td><td className="px-3 py-2 text-center font-bold text-teal-700">{mb}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              },
              {
                n: '02', title: 'Calculer la popularité de chaque plat',
                content: (
                  <div className="bg-[#F5F5F5] rounded-xl p-4 mt-2 text-sm text-[#374151] space-y-1">
                    <p>Popularité (%) = Ventes du plat / Couverts totaux × 100</p>
                    <p>Seuil = 70 % × (1 / nombre de plats)</p>
                    <p className="text-[#737373]">Pour 10 plats : seuil = 70 % × 10 % = <strong>7 %</strong></p>
                  </div>
                )
              },
              {
                n: '03', title: 'Croiser les deux axes → catégorie',
                content: <p className="text-sm text-[#525252] mt-2">Placez chaque plat dans le quadrant correspondant. Cette analyse prend 30 à 60 minutes avec vos données de caisse et fiches techniques.</p>
              },
            ].map(({ n, title, content }) => (
              <div key={n} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#111111] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{n}</div>
                <div className="flex-1">
                  <p className="font-semibold text-[#111111]">{title}</p>
                  {content}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Stratégies */}
        <section id="strategies" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Stratégies par catégorie</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                emoji: '⭐', name: 'Stars', color: 'emerald',
                strat: 'Protégez-les. Placez-les en position de visibilité maximale (coin supérieur droit, première section). Entraînez votre équipe à les recommander. Une hausse de 1–2 € sur un plat Star vendu 300 fois/mois = +600 € de marge mensuelle.',
              },
              {
                emoji: '🐄', name: 'Plowhorses', color: 'orange',
                strat: 'Réduisez le food cost sans dégrader la qualité perçue (portion légèrement réduite, ingrédient substitué), ou augmentez légèrement le prix. Associez-les à des accompagnements à forte marge (bundling). Exemple : burger populaire, food cost 38 % → 32 % = +144 €/mois sur 200 ventes.',
              },
              {
                emoji: '❓', name: 'Puzzles', color: 'blue',
                strat: 'Testez la mise en valeur avant de supprimer : encadré "Coup de cœur du chef", recommandation des serveurs, renommage, description plus appétissante. Si 4 semaines d\'efforts ne changent rien → plat du jour ou suppression.',
              },
              {
                emoji: '🐕', name: 'Dogs', color: 'red',
                strat: 'Supprimez ou transformez radicalement. Chaque Dog retiré simplifie la mise en place, réduit le gaspillage et améliore la lisibilité de la carte. Une carte de 10 plats bien choisis est plus rentable que 25 plats dont 10 Dogs.',
              },
            ].map(({ emoji, name, color, strat }) => (
              <div key={name} className={`border border-${color}-100 bg-${color}-50/30 rounded-2xl p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{emoji}</span>
                  <p className={`font-bold text-${color}-700`}>{name}</p>
                </div>
                <p className="text-sm text-[#374151] leading-relaxed">{strat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Visuel */}
        <section id="visuel" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Optimiser visuellement votre carte</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="text-left px-4 py-3 font-semibold text-[#111111]">Levier visuel</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">Impact prouvé</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#111111]">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  ['Triangle d\'or (coin sup. droit)', 'Zone de lecture privilégiée', 'Études eye-tracking'],
                  ['Encadré autour d\'un plat', '+15 à +20 % de ventes', 'Cornell University'],
                  ['Prix sans symbole €', '+8 % de dépenses moy.', 'Cornell University (2009)'],
                  ['Description sensorielle 5–8 mots', '+27 % de ventes du plat', 'Cornell University (2010)'],
                  ['Max 7 ± 2 choix par catégorie', 'Réduit la paralysie décisionnelle', 'Loi de Hick'],
                  ['Photos haute qualité', 'Augmente la crédibilité', 'Études comportementales'],
                ].map(([levier, impact, source]) => (
                  <tr key={levier} className="bg-white hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 text-[#374151]">{levier}</td>
                    <td className="px-4 py-3 text-center font-semibold text-teal-700">{impact}</td>
                    <td className="px-4 py-3 text-[#737373] text-xs">{source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-2">À éviter absolument</p>
            <ul className="space-y-1 text-sm text-red-600">
              {[
                'Prix en colonne alignée → facilite la comparaison, oriente vers le moins cher',
                'Photos de mauvaise qualité → discrédite le plat et l\'établissement',
                'Descriptions génériques ("servi avec frites ou salade")',
              ].map(i => <li key={i}>• {i}</li>)}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: 'À quelle fréquence faire une analyse de menu engineering ?', a: 'Idéalement tous les 3 mois, ou après chaque changement de carte saisonnière. Une analyse annuelle est le minimum. Les données de caisse des 3 derniers mois suffisent.' },
              { q: 'Mon restaurant a 20 couverts. Est-ce pertinent ?', a: 'Encore plus. Un petit restaurant a moins de marge d\'erreur. Éliminer 2 Dogs et transformer 1 Plowhorse en Star peut représenter 500 à 1 000 € de marge supplémentaire par mois.' },
              { q: 'Que faire d\'un plat iconique avec un mauvais food cost ?', a: 'Gardez-le en Plowhorse mais travaillez à améliorer sa marge progressivement. Un plat iconique crée de la fidélité et une valeur d\'image qu\'une analyse purement chiffrée ne capture pas.' },
              { q: 'Comment calculer le seuil de popularité ?', a: 'Seuil = 70 % × (1 / nombre de plats dans la catégorie). Pour 8 entrées : 70 % × 12,5 % = 8,75 %. Une entrée vendue à plus de 8,75 % des couverts est "populaire".' },
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-sm text-[#525252] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Analysez votre carte en quelques clics</h2>
          <p className="text-purple-100 mb-6 text-sm max-w-[480px] mx-auto leading-relaxed">
            RestauMargin calcule la marge brute de chaque plat et vous classe automatiquement vos Stars, Plowhorses, Puzzles et Dogs — pour des décisions de carte basées sur vos chiffres réels.
          </p>
          <a href="https://www.restaumargin.fr/pricing" className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/seuil-rentabilite-restaurant" className="text-sm text-teal-600 hover:underline">Seuil de rentabilité →</Link>
        </div>
      </main>
    </div>
  );
}
