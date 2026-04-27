import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, Eye, Users, Brain, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

export default function BlogPrixCarte() {
  const faqSchema = buildFAQSchema([
    {
      question: "Faut-il afficher les prix avec ou sans le symbole € ?",
      answer: "Sans le symbole, idéalement. Études comportementales (Cornell) : panier moyen +8 %. Si vous voulez un compromis : symbole € très discret, même typo, taille réduite."
    },
    {
      question: "Quel coefficient pour un food truck ou snacking ?",
      answer: "Plus bas qu'un restaurant traditionnel (2,8 à 3,2) car le client compare au prix d'un kebab ou d'une salade Picard. Mais vos charges fixes sont aussi plus basses, donc la marge tient."
    },
    {
      question: "Mon coefficient idéal donne un prix bizarre (24,30 €). Que faire ?",
      answer: "Arrondissez au prix psychologique le plus proche : 24 € (premium), 23,90 € (bon plan) ou 24,50 € (intermédiaire). Ne laissez jamais des prix biscornus type 24,30 €."
    },
    {
      question: "Combien de fois par an dois-je revoir mes prix ?",
      answer: "Tous les 6 mois pour le contrôle, et au minimum à chaque rotation de carte (printemps-été, automne-hiver). Une révision annuelle est insuffisante en période d'inflation."
    },
    {
      question: "Mes concurrents sont 20 % moins chers, je dois m'aligner ?",
      answer: "Pas automatiquement. Vérifiez d'abord : ont-ils la même qualité ? Mêmes origines ? Même service ? Si oui, regardez votre food cost. Si non, assumez votre positionnement supérieur."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Fixer les prix de sa carte de restaurant", url: "https://www.restaumargin.fr/blog/fixer-prix-carte-restaurant" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Comment fixer les prix de sa carte de restaurant : méthode et stratégie 2026"
        description="3 méthodes pour fixer vos prix : par le coût, par la valeur, par la concurrence. Coefficients multiplicateurs par poste et psychologie des prix."
        path="/blog/fixer-prix-carte-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment fixer les prix de sa carte de restaurant : méthode et stratégie 2026",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/fixer-prix-carte-restaurant"
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
          <span className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Carte & Prix
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Comment fixer les prix de sa carte de restaurant : méthode et stratégie 2026
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            Une variation de 0,50 € sur un plat phare = 18 000 € de marge nette annuelle. Méthode rigoureuse, coefficients par poste, psychologie des prix.
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
          Saviez-vous qu'une variation de seulement 0,50 € sur le prix d'un plat phare peut représenter 18 000 € de marge nette annuelle pour un restaurant qui sert 100 couverts par jour ? La tarification est l'acte le plus stratégique du restaurateur — et pourtant, c'est aussi celui qu'on bâcle le plus souvent. Trois clics sur une carte concurrente, un "ça me semble cohérent", et l'on imprime. Erreur. Fixer ses prix, c'est arbitrer entre coût, valeur perçue, positionnement et psychologie.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#strategie" className="hover:text-teal-600 transition-colors">1. Pourquoi la tarification est l'acte le plus stratégique</a></li>
            <li><a href="#methode-cout" className="hover:text-teal-600 transition-colors">2. Méthode 1 — Par le coût (coefficient multiplicateur)</a></li>
            <li><a href="#methode-valeur" className="hover:text-teal-600 transition-colors">3. Méthode 2 — Par la valeur perçue</a></li>
            <li><a href="#psychologie" className="hover:text-teal-600 transition-colors">4. Psychologie des prix sur la carte</a></li>
            <li><a href="#coefficients" className="hover:text-teal-600 transition-colors">5. Coefficients multiplicateurs par poste</a></li>
            <li><a href="#augmenter" className="hover:text-teal-600 transition-colors">6. Quand et comment augmenter ses prix</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="strategie" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Pourquoi la tarification est l'acte le plus stratégique</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Dans un restaurant indépendant, la marge nette moyenne se situe entre 3 % et 6 % du chiffre d'affaires. Un restaurant qui réalise 500 000 € de CA annuel ne dégage que 15 000 à 30 000 € de bénéfice net. À ce niveau, <strong>chaque euro de prix mal positionné se paie cash</strong>.
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block mt-2 flex-shrink-0" /> <span><strong>Sous-tarifer</strong> : travailler beaucoup pour gagner peu, signal "low cost" qui dévalue la cuisine.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block mt-2 flex-shrink-0" /> <span><strong>Sur-tarifer</strong> : chute de fréquentation, mauvais bouche-à-oreille, étoile en moins sur Google.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block mt-2 flex-shrink-0" /> <span><strong>Tarifer sans cohérence</strong> : clients déboussolés, panier moyen qui plafonne, équipe qui ne sait pas suggérer.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            La tarification n'est pas un calcul ponctuel : c'est un <strong>système qui doit être révisé tous les 6 mois minimum</strong>, idéalement à chaque rotation de carte.
          </p>
        </section>

        {/* Section 2 */}
        <section id="methode-cout" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Méthode 1 — Par le coût (coefficient multiplicateur)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La méthode de base, celle qu'on apprend en école hôtelière : appliquer un coefficient multiplicateur sur le coût de revient matière du plat.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Prix HT = Coût matière × Coefficient multiplicateur</div>
            <div>Prix TTC = Prix HT × 1,10 (TVA restauration)</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Exemple :</strong> magret de canard, coût matière 6,80 €, coefficient 3,5 → 23,80 € HT → <strong>26,18 € TTC arrondi à 25,90 €</strong>.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le coefficient intègre coût matière brut, charges directes de production (énergie cuisine), main-d'œuvre cuisine, pertes (casse, retours) et marge brute attendue. Un coefficient 3,5 correspond grossièrement à un food cost cible de 28-30 %.
          </p>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-700">Limite</p>
            <p className="text-sm text-amber-700">Cette méthode ne tient pas compte de ce que le client est prêt à payer. Des pâtes carbonara à 1,80 € de coût × 3,5 = 6,30 €, beaucoup trop bas pour un ticket moyen 25 €.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="methode-valeur" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Méthode 2 — Par la valeur perçue</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Ici, le prix n'est pas dérivé du coût mais de <strong>ce que le client est prêt à payer pour l'expérience</strong>. Trois facteurs : positionnement, expérience, localisation.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Évaluation :</strong> études qualitatives auprès de 10 clients fidèles, étude Van Westendorp (Price Sensitivity Meter), A/B testing sur 2 semaines.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Exemple :</strong> un plat signature "Cabillaud, beurre noisette" à 7,20 € de coût matière donnerait 25,20 € HT au coefficient 3,5. Mais l'étude clientèle révèle que les clients le perçoivent à <strong>32-35 €</strong>. Vous avez 5 à 7 € de marge supplémentaire à capter sans perdre de couverts. C'est typiquement la méthode des restaurants gastronomiques : coefficient 5x, 6x, voire 8x sur les plats signature.
          </p>
        </section>

        {/* Section 4 */}
        <section id="psychologie" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Psychologie des prix sur la carte</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le prix affiché est un <strong>signal</strong>. Voici les leviers validés par la recherche en behavioral pricing.
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
              <span><strong>Charm pricing</strong> : .90/.95 = bon rapport qualité-prix (populaire), prix entiers = signal premium (bistronomie/gastronomique). Étude Cornell : retirer le symbole € fait monter le panier moyen de <strong>+8 %</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
              <span><strong>Effet d'ancrage</strong> : un plat très cher en haut de carte (ex : Côte de bœuf 95 €) fait paraître les autres plats à 25-30 € raisonnables par contraste.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
              <span><strong>Decoy effect</strong> : 3 versions (14/21/23 €), le grand format est un leurre qui pousse au format normal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
              <span><strong>Mise en page</strong> : pas de colonne alignée des prix, prix discret inline avec la description, pas de symbole €, pas de pointillés "menu de cantine".</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
              <span><strong>Description qui justifie</strong> : "Filet de cabillaud" 24 € vs "Filet de cabillaud de ligne, beurre noisette, légumes du potager Bernard" 26 €.</span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="coefficients" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Coefficients multiplicateurs par poste</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            On <strong>module le coefficient par poste</strong> car la cible est un mix global food cost à 28-30 %, pas plat par plat.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Apéritifs / softs : 5 à 6 (food cost 17-20 %)</div>
            <div>Entrées froides : 4,5 à 5 (food cost 20-22 %)</div>
            <div>Plats viande nobles : 3 à 3,5 (food cost 28-33 %)</div>
            <div>Plats poisson : 3 à 3,5 (food cost 28-33 %)</div>
            <div>Plats végé / pâtes : 4,5 à 5 (food cost 20-22 %)</div>
            <div>Desserts : 5 à 5,5 (food cost 18-20 %)</div>
            <div>Vins au verre : 4 à 5 (food cost 20-25 %)</div>
            <div>Bière, soft, café : 5 à 7 (food cost 14-20 %)</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Règle d'or</strong> : compensez les plats à fort food cost (poisson noble) par les plats à faible food cost (pâtes, desserts). Le mix global doit converger vers la cible.
          </p>
        </section>

        {/* Section 6 */}
        <section id="augmenter" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Quand et comment augmenter ses prix</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Quand :</strong> inflation matières {'>'} 5 % sur 6 mois, hausse SMIC annuelle, hausse énergie {'>'} 10 %, loyer indexé ILC en hausse, food cost qui dépasse 32 %.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Comment augmenter sans perdre de clients :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Petits incréments : +0,50 € tous les 6 mois plutôt que +2 € d'un coup</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Augmentations ciblées : montez les plats à forte marge (desserts, pâtes)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Repensez les portions : -10 % grammage compense souvent +5 % de prix</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Renouvelez la carte : nouveaux noms = pas de comparaison directe</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Communiquez sur la qualité (origine, label, AOP) plutôt que sur la hausse</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            <strong>Cas concret</strong> : un bistro lyonnais qui vendait son plat du jour à 12,50 € (food cost 41 %) est passé à 14,90 € (food cost 33 %). Résultat : −8 % de couverts, <strong>+22 % de marge brute</strong>, équipe moins stressée.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Faut-il afficher les prix avec ou sans le symbole € ?",
                a: "Sans le symbole, idéalement. Études comportementales (Cornell) : panier moyen +8 %. Si vous voulez un compromis : symbole € très discret, même typo, taille réduite."
              },
              {
                q: "Quel coefficient pour un food truck ou snacking ?",
                a: "Plus bas qu'un restaurant traditionnel (2,8 à 3,2) car le client compare au prix d'un kebab ou d'une salade Picard. Mais vos charges fixes sont aussi plus basses, donc la marge tient."
              },
              {
                q: "Mon coefficient idéal donne un prix bizarre (24,30 €). Que faire ?",
                a: "Arrondissez au prix psychologique le plus proche : 24 € (premium), 23,90 € (bon plan) ou 24,50 € (intermédiaire). Ne laissez jamais des prix biscornus type 24,30 €."
              },
              {
                q: "Combien de fois par an dois-je revoir mes prix ?",
                a: "Tous les 6 mois pour le contrôle, et au minimum à chaque rotation de carte (printemps-été, automne-hiver). Une révision annuelle est insuffisante en période d'inflation."
              },
              {
                q: "Mes concurrents sont 20 % moins chers, je dois m'aligner ?",
                a: "Pas automatiquement. Vérifiez d'abord : ont-ils la même qualité ? Mêmes origines ? Même service ? Si oui, regardez votre food cost. Si non, assumez votre positionnement supérieur."
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
          <h2 className="text-2xl font-bold mb-3">Tarifez vos plats avec la rigueur d'un chef d'entreprise</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin calcule vos coefficients par poste, simule l'impact d'une hausse de prix sur votre marge et benchmarke automatiquement votre carte avec les standards du secteur.
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
