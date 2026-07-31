import { Link } from 'react-router-dom';
import { ChefHat, Calculator, TrendingUp, Wallet, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

const faqItems = [
  {
    question: "Quelle réserve de trésorerie un restaurant doit-il maintenir ?",
    answer: "L'idéal est de maintenir en permanence l'équivalent de 4 à 6 semaines de charges fixes (loyer + masse salariale + charges sociales). Pour un restaurant avec 30 000 EUR de charges fixes mensuelles, cela représente 30 000 à 45 000 EUR de réserve minimum.",
  },
  {
    question: "Comment calculer mon besoin en fonds de roulement (BFR) ?",
    answer: "BFR = Stocks + Créances clients - Dettes fournisseurs. En restauration traditionnelle, le BFR est souvent négatif (vous encaissez avant de payer), ce qui est un avantage. Si votre BFR devient positif, vous devez le financer.",
  },
  {
    question: "Mon restaurant est rentable mais je suis en tension de trésorerie — pourquoi ?",
    answer: "Cela arrive quand les charges sont concentrées en début de mois (loyer, paie) et les encaissements étalés. La solution est de constituer une réserve permanente d'un mois de charges et de lisser les paiements fournisseurs.",
  },
  {
    question: "Dois-je avoir un compte séparé pour la TVA ?",
    answer: "Ce n'est pas obligatoire mais fortement recommandé. Virementez chaque semaine la TVA collectée sur un compte dédié pour éviter de dépenser de l'argent qui ne vous appartient pas et la mauvaise surprise des déclarations.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Gestion de la trésorerie en restauration : guide complet 2026",
  description: "Comment piloter la trésorerie de votre restaurant : plan sur 13 semaines, 8 leviers concrets, solutions de financement d'urgence.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-07-31',
  dateModified: '2026-07-31',
  wordCount: 1500,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/gestion-tresorerie-restaurant' },
};

const FALLBACK = (
  <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function BlogGestionTresorerie() {
  return (
    <div className="min-h-screen bg-white dark:bg-black" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Gestion de la trésorerie restaurant : guide complet 2026 (plan 13 semaines)"
        description="Comment piloter la trésorerie de votre restaurant : plan prévisionnel 13 semaines, 8 leviers pour améliorer le cash, solutions d'urgence. Guide expert 2026."
        path="/blog/gestion-tresorerie-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Gestion trésorerie restaurant', url: 'https://www.restaumargin.fr/blog/gestion-tresorerie-restaurant' },
          ]),
          articleSchema,
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-bold text-lg text-[#111111] dark:text-white">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Essayer gratuitement
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#737373] dark:text-[#A3A3A3] mb-8">
          <Link to="/landing" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-[#111111] dark:text-white">Gestion trésorerie restaurant</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-semibold rounded-full mb-4">
            <Wallet className="w-3.5 h-3.5" />
            Gestion financière
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white leading-tight mb-4">
            Gestion de la trésorerie en restauration : le guide complet pour ne jamais manquer de liquidités
          </h1>
          <p className="text-lg text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            La plupart des restaurants qui ferment ne manquent pas de clients — ils manquent de cash. Voici le guide concret pour sécuriser vos liquidités et piloter votre trésorerie comme un professionnel.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-[#737373] dark:text-[#A3A3A3]">
            <span>31 juillet 2026</span>
            <span>·</span>
            <span>8 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </header>

        {/* Table des matières */}
        <nav className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
          <p className="font-semibold text-[#111111] dark:text-white mb-3">Table des matières</p>
          <ol className="space-y-2 text-sm text-teal-600 dark:text-teal-400">
            {[
              "Pourquoi la trésorerie tue plus de restaurants que la concurrence",
              "Les 5 outils indispensables pour piloter votre cash",
              "Comment créer un plan de trésorerie sur 13 semaines",
              "Les 8 leviers pour améliorer votre trésorerie immédiatement",
              "Financement d'urgence : les solutions quand le cash manque",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold shrink-0">{i + 1}.</span>
                <span className="hover:underline cursor-pointer">{item}</span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4">
            1. Pourquoi la trésorerie tue plus de restaurants que la concurrence
          </h2>
          <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
            En France, <strong>25 % des restaurants ferment dans leur première année</strong>, et 60 % avant 5 ans. Dans la grande majorité des cas, la cause n'est pas un mauvais concept ou une mauvaise cuisine — c'est un manque de liquidités au mauvais moment.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">La différence entre rentabilité et trésorerie</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Un restaurant peut être <strong>rentable comptablement</strong> (recettes &gt; charges sur l'exercice) tout en étant <strong>en rupture de trésorerie</strong>. Vous payez vos fournisseurs à 30 jours mais encaissez vos clients le jour même — le décalage peut vous tuer.
              </p>
            </div>
          </div>
          <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
            <strong>Exemple concret :</strong> Un restaurant réalise 40 000 € de CA en décembre. Il paie 12 000 € de marchandises, 15 000 € de personnel, 4 000 € de loyer = marge nette de 9 000 €. Mais en janvier, les fournisseurs de décembre arrivent à échéance et le CA chute à 22 000 €. Sans réserve, le compte est dans le rouge alors que l'exercice annuel est bénéficiaire.
          </p>
          <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">Les 3 moments critiques de l'année</h3>
          <ul className="space-y-2 text-[#111111] dark:text-[#D4D4D4]">
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-1" /><span><strong>Janvier–février :</strong> après les fêtes, baisse brutale de fréquentation + paiement des charges de fin d'année</span></li>
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-1" /><span><strong>Avril–mai :</strong> avant la saison estivale, besoin de cash pour reconstituer les stocks et anticiper les embauches</span></li>
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-1" /><span><strong>Octobre–novembre :</strong> fin de saison pour les établissements saisonniers, charges qui continuent</span></li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4">
            2. Les 5 outils indispensables pour piloter votre cash
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Le tableau de bord trésorerie hebdomadaire",
                desc: "Chaque lundi matin, 15 minutes pour vérifier : solde compte courant, encours fournisseurs à payer, CA prévisionnel de la semaine et cash disponible net. Ce tableau vous dit en un coup d'œil si vous allez passer la semaine.",
              },
              {
                title: "Le prévisionnel glissant sur 13 semaines",
                desc: "Contrairement au budget annuel (trop lointain), le prévisionnel sur 13 semaines vous donne une visibilité opérationnelle. Vous voyez les creux et les pics à venir avec suffisamment d'avance pour agir.",
              },
              {
                title: "Le suivi des encours fournisseurs",
                desc: "Listez chaque fournisseur avec sa date d'échéance et son montant. Ce tableau simple vous évite les oublis et vous permet de négocier les délais au bon moment.",
              },
              {
                title: "Le délai moyen de paiement fournisseurs (DPO)",
                desc: "DPO = (Dettes fournisseurs / Achats TTC) × 30. Si votre DPO est de 15 jours et que vos concurrents ont négocié 45 jours, vous perdez 30 jours de cash chaque mois. Chaque jour de DPO sur 10 000 € d'achats = 333 € de cash libéré.",
              },
              {
                title: "Le seuil d'alerte de trésorerie",
                desc: "Définissez votre matelas de sécurité minimum : l'équivalent de 4 à 6 semaines de charges fixes (loyer + salaires + charges sociales). En dessous de ce seuil, déclenchez votre plan d'urgence.",
              },
            ].map((tool, i) => (
              <div key={i} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <p className="font-semibold text-[#111111] dark:text-white mb-1">Outil {i + 1} : {tool.title}</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4">
            3. Comment créer un plan de trésorerie sur 13 semaines
          </h2>
          <div className="space-y-4 text-[#111111] dark:text-[#D4D4D4] leading-relaxed">
            <div>
              <h3 className="font-semibold mb-1">Étape 1 : Listez vos encaissements prévisionnels</h3>
              <p>Pour chaque semaine des 13 prochaines : CA en salle (historique N-1 × taux de croissance), CA livraison, remboursements TVA attendus. <strong>Conseil :</strong> prenez 80 % de votre meilleure hypothèse — mieux vaut être agréablement surpris.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Étape 2 : Listez vos décaissements certains</h3>
              <p>Loyer (date exacte), salaires (date de paie), charges sociales URSSAF, fournisseurs par date d'échéance, remboursements de prêts, assurances.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Étape 3 : Calculez le solde semaine par semaine</h3>
              <div className="bg-[#F5F5F5] dark:bg-[#262626] rounded-xl p-4 font-mono text-sm">
                Solde semaine N = Solde N-1 + Encaissements N − Décaissements N
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Étape 4 : Actualisez chaque semaine</h3>
              <p>Le plan de trésorerie n'a de valeur que s'il est mis à jour régulièrement. Chaque lundi, remplacez les prévisions de la semaine écoulée par les chiffres réels et ajoutez une 13e semaine au bout.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4">
            4. Les 8 leviers pour améliorer votre trésorerie immédiatement
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Négocier les délais fournisseurs", desc: "Passer de 30 à 45 jours sur 20 000 €/mois d'achats libère 10 000 € de cash en permanence." },
              { title: "Activer les encaissements rapides", desc: "Cartes cadeaux, prépaiement séminaires, abonnements déjeuner prépayés : cash encaissé avant la prestation." },
              { title: "Réduire les stocks dormants", desc: "30 % de produits peu utilisés sur 5 000 € de stock = 1 500 € immobilisés inutilement." },
              { title: "Optimiser la rotation des stocks", desc: "Visez 15 à 20 rotations par an. En dessous de 12, vous sur-stockez. Commandez plus souvent, en plus petite quantité." },
              { title: "Anticiper la TVA", desc: "Provisionnez la TVA collectée (10 %) sur un compte séparé dès l'encaissement." },
              { title: "Décaler les investissements", desc: "Alignez les achats d'équipement sur vos pics de trésorerie, ou optez pour la location avec option d'achat." },
              { title: "Activer la médiation du crédit", desc: "Service public gratuit si un client professionnel tarde à payer. Délai de résolution : 3 semaines." },
              { title: "Ouvrir une ligne de découvert autorisé", desc: "Négociez 2 à 3 mois de charges fixes avec votre banque avant d'en avoir besoin — jamais après." },
            ].map((levier, i) => (
              <div key={i} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="font-semibold text-[#111111] dark:text-white text-sm">{levier.title}</p>
                </div>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{levier.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-4">
            5. Financement d'urgence : les solutions quand le cash manque
          </h2>
          <div className="space-y-4 text-[#111111] dark:text-[#D4D4D4] leading-relaxed">
            <div>
              <h3 className="font-semibold mb-1">L'affacturage</h3>
              <p>Cédez vos créances clients à un organisme qui avance 80 à 90 % du montant immédiatement. Coût : 1 à 3 %. Idéal pour la livraison d'entreprise ou le traiteur avec facturation différée.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Le prêt Bpifrance Rebond</h3>
              <p>Prêts sans garantie de 10 000 à 100 000 € sur 5 ans, avec 2 ans de différé d'amortissement. Dossier à monter avec votre banque partenaire.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">L'avance sur recettes caisse</h3>
              <p>Certaines solutions de caisse proposent des avances sur le CA des 3 derniers mois. Rapide (48h) mais coûteux (5 à 8 % de frais). À utiliser en dernier recours.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Les aides territoriales</h3>
              <p>Chambres de commerce, régions, mairies — de nombreuses aides locales existent. Renseignez-vous auprès de votre CCI locale ou de la DDFIP.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6">FAQ : vos questions sur la trésorerie restaurant</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <p className="font-semibold text-[#111111] dark:text-white mb-2">{item.question}</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
          <Wallet className="w-10 h-10 text-teal-400 dark:text-teal-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white dark:text-[#111111] mb-3">
            Pilotez vos marges et votre trésorerie en temps réel
          </h2>
          <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 max-w-md mx-auto">
            RestauMargin automatise le suivi de votre food cost, de vos marges et de votre rentabilité pour que vous passiez moins de temps dans les tableurs.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
          >
            Découvrir RestauMargin
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#737373] dark:text-[#A3A3A3]">
          <Link to="/landing" className="flex items-center gap-2 font-bold text-[#111111] dark:text-white">
            <ChefHat className="w-5 h-5 text-teal-600" />
            RestauMargin
          </Link>
          <div className="flex gap-4">
            <Link to="/blog" className="hover:text-teal-600">Blog</Link>
            <Link to="/pricing" className="hover:text-teal-600">Tarifs</Link>
            <Link to="/mentions-legales" className="hover:text-teal-600">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
