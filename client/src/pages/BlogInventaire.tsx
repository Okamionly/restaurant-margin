import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, Calendar, ListChecks, RefreshCw, AlertTriangle, Smartphone, ClipboardList, UserCheck, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogInventaire() {
  const faqSchema = buildFAQSchema([
    {
      question: "Combien de temps prend un inventaire complet ?",
      answer: "Pour un bistrot 50 couverts (~150 références), comptez 2h30 à 4h en équipe de 2 personnes. Avec logiciel + code-barres : 1h30 à 2h30. Le premier inventaire est toujours plus long (3-5h)."
    },
    {
      question: "Faut-il faire l'inventaire portes fermées ?",
      answer: "Idéalement oui, après le dernier service ou avant le premier. Pendant le service, les sorties non comptées rendent l'inventaire faux. Si nécessaire, isolez les zones (sec, cave) qui ne sont pas en flux."
    },
    {
      question: "Que faire si je détecte un grand écart soudain ?",
      answer: "1) Recompter physiquement la zone. 2) Vérifier les bons de livraison récents. 3) Vérifier les fiches techniques (changement de portion ?). 4) Si l'écart persiste, enquêter discrètement sur les procédures et accès."
    },
    {
      question: "Est-il légal de tenir le personnel responsable d'un manque ?",
      answer: "Non, le restaurateur est légalement responsable de ses stocks. Toutefois, en cas de vol avéré (preuves), des sanctions disciplinaires sont possibles selon la convention collective. Un règlement intérieur clair sur la consommation personnelle est indispensable."
    },
    {
      question: "Comment gérer les produits 'consommation gratuite équipe' ?",
      answer: "Tracez-les obligatoirement dans une fiche 'consommation interne' mensuelle (en valeur ou quantités). Cette consommation s'ajoute à la sortie de stock théorique et réduit l'écart d'inventaire apparent. Sans cette traçabilité, vos calculs sont biaisés."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Inventaire restaurant", url: "https://www.restaumargin.fr/blog/inventaire-restaurant-guide" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Faire l'inventaire de son restaurant : méthode, fréquence et outils 2026"
        description="Guide complet pour faire l'inventaire de votre restaurant : méthode pas à pas, fréquence recommandée, calcul de rotation des stocks et outils digitaux."
        path="/blog/inventaire-restaurant-guide"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Faire l'inventaire de son restaurant : méthode, fréquence et outils 2026",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/inventaire-restaurant-guide"
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
      <BlogArticleHero
        category="Stocks"
        readTime="11 min"
        date="Avril 2026"
        title="Faire l'inventaire de son restaurant : méthode, fréquence et outils"
        accentWord="inventaire"
        subtitle="Un restaurant moyen perd 2 000€ à 5 000€ par mois en écarts non détectés. Vol, gaspillage, casse, surdosage : voici comment les détecter et les stopper."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Vol interne, gaspillage, surproduction, casse, erreurs de portionnage : autant de fuites silencieuses qui peuvent gonfler un food cost de 28% à 33% sans que personne ne s'en aperçoive. La différence entre un restaurant bien géré et un restaurant à la dérive tient souvent à un seul rituel : <strong>l'inventaire régulier, méthodique, exploité</strong>.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#pourquoi" className="hover:text-teal-600 transition-colors">1. Pourquoi l'inventaire est fondamental</a></li>
            <li><a href="#frequence" className="hover:text-teal-600 transition-colors">2. Quelle fréquence selon les produits</a></li>
            <li><a href="#methode" className="hover:text-teal-600 transition-colors">3. La méthode pas à pas</a></li>
            <li><a href="#rotation" className="hover:text-teal-600 transition-colors">4. Calculer la rotation des stocks</a></li>
            <li><a href="#cas" className="hover:text-teal-600 transition-colors">5. Cas chiffré : 2 000€ d'écart</a></li>
            <li><a href="#digital" className="hover:text-teal-600 transition-colors">6. Inventaire digital vs papier</a></li>
            <li><a href="#management" className="hover:text-teal-600 transition-colors">7. L'inventaire comme outil de management</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="pourquoi" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Pourquoi l'inventaire est fondamental</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 5 raisons :</strong></p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Calculer le vrai food cost.</strong> Sans inventaire, on confond achats et consommation. Avec inventaire : Consommation = Stock initial + Achats - Stock final.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Détecter le gaspillage.</strong> 10g de surdose sur 150 plats/jour = 700€/mois invisible.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Détecter le vol.</strong> 3 à 7% du CA dans les restaurants sans contrôle.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Détecter les écarts de production.</strong> Les fiches techniques sur le papier vs leur application en cuisine.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span><strong>Optimiser les achats.</strong> Quels produits dorment en stock, quels fournisseurs sont en retard.</span>
            </li>
          </ul>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Sans inventaire : food cost réel souvent 33-36%<br />
            Avec inventaire mensuel : 30-32%<br />
            Gain : 2 à 4 points = 1 200 à 2 400€/mois
          </div>
          <p className="text-[#374151] leading-relaxed">
            Sur l'année, l'absence d'inventaire coûte facilement 20 000 à 40 000€ par restaurant — l'équivalent de 6 mois de loyer.
          </p>
        </section>

        {/* Section 2 */}
        <section id="frequence" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Quelle fréquence selon les produits</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">Plus le produit est fragile et rotatif, plus l'inventaire doit être fréquent.</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Frais ultra-périssable (poissons, fruits de mer) : <strong>quotidien</strong> 5-10 min</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Frais court (viandes, charcuterie) : <strong>bi-hebdo</strong> 15-25 min</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Frais moyen (légumes, fruits, laitiers) : <strong>hebdo</strong> 20-30 min</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Boissons et alcools : <strong>hebdo</strong> 30-45 min</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Épicerie sèche : <strong>bihebdo</strong> 20-30 min</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Inventaire complet : <strong>mensuel</strong> 2-4 heures</li>
          </ul>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-amber-700">La règle du 80/20</p>
            <p className="text-sm text-amber-700">20% des produits représentent 80% de la valeur du stock (viandes, poissons, vins premium). Concentrez votre énergie sur ces 20%-là en quotidien ou bi-hebdomadaire.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="methode" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. La méthode pas à pas</h2>
          </div>
          <ol className="space-y-3 text-[#374151] list-decimal pl-5 mb-4">
            <li><strong>Préparer les fiches d'inventaire.</strong> Classer par ordre physique de rangement (gauche → droite, haut → bas). Gain : 30% de temps.</li>
            <li><strong>Compter par zone, jamais par produit.</strong> Ordre : réserve sèche → cave → chambres froides positives → négatives → cellules dessert → cuisine.</li>
            <li><strong>Mesurer précisément.</strong> Balance pour viandes/poissons, bouteille graduée pour liquides. Pesez le sac de riz : "5,4 kg", pas "1 sac".</li>
            <li><strong>Valoriser au prix d'achat HT.</strong> Toujours le dernier prix réel facturé. Tenir une base produits centralisée à jour.</li>
            <li><strong>Saisir et vérifier.</strong> Total par zone, par famille, comparaison avec l'inventaire précédent. +200% ou -80% sur une ligne = recompter.</li>
            <li><strong>Calculer et analyser les écarts.</strong> Stock théorique vs stock physique = écart à expliquer (casse, vol, gaspillage).</li>
          </ol>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Écart = Stock physique - Stock théorique<br />
            Seuil acceptable : {'<'}1% du CA mensuel<br />
            {'>'}2% : alerte · {'>'}3% : intervention immédiate
          </div>
        </section>

        {/* Section 4 */}
        <section id="rotation" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Calculer la rotation des stocks</h2>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Rotation = Achats du mois / Stock moyen<br />
            Stock moyen = (Stock initial + Stock final) / 2
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Exemple : stock initial 4 200€, achats 21 000€, stock final 4 800€. Stock moyen 4 500€. Rotation = 21 000 / 4 500 = 4,67 fois/mois (renouvellement tous les 6,4 jours).
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Benchmarks (rotations/mois) :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Poissons frais : 30-60 (12-24h de stock)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Viandes fraîches : 15-25 (1-2 jours)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Légumes / fruits : 12-20 (1,5-2,5 jours)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Épicerie sèche : 2-4 (7-15 jours)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Vins / spiritueux : 1-3 (10-30 jours)</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Rotation trop basse = sur-stock (risque de pertes). Trop haute = ruptures (perte de ventes). Réduire un stock de vins de 30% libère 1 500-3 000€ de trésorerie sans impact ventes.
          </p>
        </section>

        {/* Section 5 */}
        <section id="cas" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Cas chiffré : 2 000€ d'écart par mois</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant Le Marais : CA 65 000€, achats 22 000€, stock initial 4 500€, stock final attendu 4 800€, stock final compté 2 800€ → <strong>écart -2 000€</strong>.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Food cost théorique : 21 700€ → 33,4%</div>
            <div>Food cost réel : 23 700€ → 36,5%</div>
            <div>Écart : <strong>3,1 points perdus</strong></div>
            <div>Pertes annuelles : 24 000€</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-2"><strong>Plan d'action 30 jours :</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">Semaine 1 : audit complet, procédure casse signée. Semaines 2-3 : inventaires bi-hebdo sur les 10 produits chers, pesage en cuisine, vérification bons de livraison. Semaine 4 : nouvel inventaire, comparaison.</p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Résultat typique :</strong> -60 à -80% de l'écart en 1 mois, soit 1 200 à 1 600€ récupérés mensuellement.
          </p>
        </section>

        {/* Section 6 */}
        <section id="digital" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Inventaire digital vs papier</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Papier / Excel :</strong> coût zéro, mais saisie manuelle (erreurs), calculs lents, pas d'historique exploitable, pas d'alertes. Acceptable pour un petit établissement (&lt; 30 couverts).
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Logiciel dédié :</strong> 30-80€/mois, saisie sur tablette, lecture code-barres, calculs automatiques (consommation, écart, rotation), historique, alertes, export comptable, photos d'inventaire.
          </p>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-emerald-700">ROI</p>
            <p className="text-sm text-emerald-700">Atteint en moins de 2 mois pour 90% des restaurants. Indispensable au-delà de 40 couverts.</p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Solutions 2026 : RestauMargin (à partir de 29€/mois, focus marges + stocks), Easilys (multi-sites, dès 80€/mois), Foodmeup (pâtisseries, dès 50€/mois), Tablo (bistrots, dès 39€/mois).
          </p>
        </section>

        {/* Section 7 */}
        <section id="management" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">7. L'inventaire comme outil de management</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Ce qui marche :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Désigner un responsable inventaire par zone</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Récompenser les inventaires impeccables (-1% d'écart sur 3 mois = prime collective)</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Communiquer les résultats : "Ce mois, on a gagné 800€"</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /> Compter à 2 personnes (un compte, un saisit) — réduit les erreurs de 70%</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>La règle FIFO</strong> (First In, First Out) : étiqueter chaque réception avec la date, ranger les nouveaux arrivages derrière les anciens, sortir toujours du devant. Une cuisine sans FIFO génère facilement 5-10% de pertes en plus.</p>
          <p className="text-[#374151] leading-relaxed">
            Les meilleurs restaurants ont fait de l'inventaire un <strong>rituel hebdomadaire</strong>. Toujours le même jour, à la même heure, avec la même équipe. La régularité crée l'habitude, l'habitude crée la rigueur, la rigueur crée la marge.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Combien de temps prend un inventaire complet ?",
                a: "Pour un bistrot 50 couverts (~150 références), comptez 2h30 à 4h en équipe de 2 personnes. Avec logiciel + code-barres : 1h30 à 2h30. Le premier inventaire est toujours plus long (3-5h)."
              },
              {
                q: "Faut-il faire l'inventaire portes fermées ?",
                a: "Idéalement oui, après le dernier service ou avant le premier. Pendant le service, les sorties non comptées rendent l'inventaire faux. Si nécessaire, isolez les zones (sec, cave) qui ne sont pas en flux."
              },
              {
                q: "Que faire si je détecte un grand écart soudain ?",
                a: "1) Recompter physiquement la zone. 2) Vérifier les bons de livraison récents. 3) Vérifier les fiches techniques (changement de portion ?). 4) Si l'écart persiste, enquêter discrètement sur les procédures et accès."
              },
              {
                q: "Est-il légal de tenir le personnel responsable d'un manque ?",
                a: "Non, le restaurateur est légalement responsable de ses stocks. Toutefois, en cas de vol avéré (preuves), des sanctions disciplinaires sont possibles selon la convention collective. Un règlement intérieur clair sur la consommation personnelle est indispensable."
              },
              {
                q: "Comment gérer les produits 'consommation gratuite équipe' ?",
                a: "Tracez-les obligatoirement dans une fiche 'consommation interne' mensuelle (en valeur ou quantités). Cette consommation s'ajoute à la sortie de stock théorique et réduit l'écart d'inventaire apparent. Sans cette traçabilité, vos calculs sont biaisés."
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
          <h2 className="text-2xl font-bold mb-3">Pilotez vos stocks et vos marges</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Inventaire digital sur tablette, scan code-barres, calcul automatique de l'écart et du food cost réel, alertes en cas de dérive. Le copilote qui détecte les 2 000€ que vous perdez chaque mois sans le savoir.
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
          <Link to="/blog/prime-cost-restaurant" className="text-sm text-teal-600 hover:underline">Maîtriser le prime cost →</Link>
        </div>
      </main>
    </div>
  );
}
