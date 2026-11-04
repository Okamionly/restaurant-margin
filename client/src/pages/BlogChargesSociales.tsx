import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Scale, Calculator, Users, AlertTriangle, FileText, TrendingUp, ArrowRight, Receipt, ShieldCheck, Briefcase, Target } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Charges sociales en restauration : guide 2026"
   Mots-cles cibles : charges sociales restaurant calcul, taux URSSAF 2026 HCR,
   reduction Fillon restauration, fiche de paie cuisinier HCR
   ~3 200 mots — EAT, FAQ x12, HowTo, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Le repas du salarié est-il obligatoire en restauration ?",
    answer: "Oui, c'est une obligation conventionnelle HCR (article 22). L'employeur doit fournir le repas en nature ou verser une indemnité compensatrice nourriture. La valeur 2026 est de 4,22 EUR par repas du, soit 8,44 EUR/jour pour 2 repas, ou 185,68 EUR/mois pour 22 jours travaillés. Cet avantage en nature doit être intégré dans le brut soumis à cotisations URSSAF. L'employeur peut aussi distribuer des titres-restaurant à la place, mais c'est plus rare en HCR (les titres ne sont pas exonérés comme l'indemnité nourriture conventionnelle)."
  },
  {
    question: "La mutuelle HCR est-elle obligatoire ?",
    answer: "Oui, depuis la loi ANI de 2016 et l'avenant 24bis de la CCN HCR. Tous les salariés en CDI ou CDD &gt;= 3 mois doivent être affiliés à une mutuelle collective. L'employeur prend en charge au minimum 50% de la cotisation, le salarié le solde. HCR Prévoyance est l'organisme désigné par défaut, mais l'employeur peut choisir un autre organisme avec garanties au moins équivalentes. Cas d'exonération (CDD courts, apprentis, temps partiels &lt; 15h) : dispense possible sur demande écrite du salarié. Couverture minimum obligatoire : panier de soins ANI (consultations, hospitalisation, optique, dentaire de base)."
  },
  {
    question: "Combien coûte un apprenti par mois en restauration ?",
    answer: "Un apprenti âgé de 18-20 ans en 1ère année perçoit 43% du SMIC, soit environ 775 EUR/mois brut. Les charges patronales sont quasi nulles grâce aux exonérations spécifiques apprentissage (Sécurité sociale, retraite complémentaire, chômage, FNAL). Coût employeur réel : environ 830 EUR/mois brut, auquel il faut déduire l'aide unique de 6 000 EUR la 1ère année (500 EUR/mois lissés) versée par l'ASP. Coût net mensuel : ~330 EUR. À comparer à un CDI cuisinier au SMIC HCR à 2 460 EUR/mois. Soit 7,5 fois moins cher la 1ère année. Ajouter le crédit d'impôt apprentissage 1 600 EUR/an pour les entreprises &lt; 250 salariés."
  },
  {
    question: "La réduction Fillon est-elle automatique ?",
    answer: "Elle est intégrée automatiquement dans la DSN (Déclaration Sociale Nominative) mensuelle si votre logiciel de paie est correctement paramétré. Vérifiez chaque mois sur le bulletin URSSAF qu'elle est bien appliquée, en particulier après tout changement (effectif, statut salarié, montant brut, heures supplémentaires). Le montant de la réduction varie chaque mois selon la formule : Réduction = (T / 0,6) x ((1,6 x SMIC x heures / brut) - 1), où T = 0,3194 (entreprises &lt; 50 salariés en 2026) ou T = 0,3234 (50 salariés et plus). Au niveau du SMIC, la réduction efface ~540 EUR/mois de cotisations."
  },
  {
    question: "Que se passe-t-il en cas de contrôle URSSAF ?",
    answer: "Le contrôleur URSSAF peut remonter sur les 3 dernières années (5 ans en cas de travail dissimulé). Il vérifie : DPAE, contrats de travail, fiches de paie, plannings, livre de paie, déclarations DSN, registre du personnel, registre unique du personnel, déclarations TVA, livre de caisse. Redressements moyens en restauration : 15 000 à 80 000 EUR. Sanctions complémentaires : majoration de 25%, annulation des réductions de cotisations sur la période contrôlée, éventuelle inscription au fichier des fraudeurs (perte des aides publiques pendant 5 ans). En cas de désaccord, recours possible devant le tribunal des affaires de sécurité sociale (TASS) sous 2 mois."
  },
  {
    question: "Comment calculer le coût total d'un employé au SMIC HCR ?",
    answer: "Cuisinier SMIC HCR 39h, 169h mensuelles : salaire brut 2 008 EUR (incluant 4h sup structurelles à 10%), avantage repas 185,68 EUR (2 repas x 4,22 x 22 jours), soit brut total 2 193,68 EUR. Charges patronales brutes ~798 EUR (36,4%), réduction Fillon -540 EUR, charges nettes +258 EUR. Ajouter médecine du travail SPST 7 EUR. Coût employeur total : 2 459 EUR/mois. Coût annuel sur 12,5 mois (avec congés payés) : 30 733 EUR. Coefficient coût/brut = 1,12 au SMIC, qui monte à 1,42 pour salaires &gt; 2,5 SMIC."
  },
  {
    question: "Quelle est la différence entre cotisations salariales et patronales ?",
    answer: "Les cotisations salariales (~22% du brut) sont prélevées sur le salaire brut du salarié pour calculer son net imposable et net à payer. Elles comprennent : Sécurité sociale maladie (0,75% déductible), CSG (9,2% dont 6,8% déductible et 2,4% non déductible), CRDS (0,5%), assurance chômage (2,4% non déductible), retraite complémentaire (4,01%), prévoyance (0,38%). Les cotisations patronales (~42% du brut) sont payées par l'employeur EN PLUS du brut salarial. Elles couvrent les mêmes risques sociaux mais à des taux différents et avec des bases parfois plafonnées. La réduction Fillon ne s'applique qu'aux patronales."
  },
  {
    question: "Pourquoi le bandeau maladie passe-t-il de 7% à 13% ?",
    answer: "Le bandeau maladie réduit s'applique à 7% (au lieu de 13% taux normal) pour les salaires inférieurs ou égaux à 2,5 SMIC (~4 500 EUR brut/mois en 2026). C'est un avantage automatique sans démarche. Au-delà de 2,5 SMIC, l'employeur paie le taux plein de 13%. Le passage est progressif (dégressivité) sur la fraction qui dépasse 2,5 SMIC. Stratégiquement, recruter des profils proches du SMIC est mécaniquement plus rentable. Même principe pour le bandeau famille : 3,45% jusqu'à 3,5 SMIC, puis 5,25% au-delà."
  },
  {
    question: "Les pourboires sont-ils soumis à cotisations en 2026 ?",
    answer: "Cas 1 - Pourboires volontaires (laissés directement au serveur par le client) : exonérés de cotisations sociales et d'impôt sur le revenu jusqu'au 31 décembre 2026 pour les salariés rémunérés jusqu'à 1,6 SMIC (2 882 EUR brut/mois). Au-delà : soumis aux cotisations normales. Cas 2 - Service compris (15%) intégré dans le prix factur : c'est du salaire déguisé et doit être intégralement intégré au brut soumis à cotisations. Cas 3 - Pourboires centralisés (caisse commune, TPE pourboires, répartition par roulement) : redistribués aux salariés, traités comme du salaire, soumis aux cotisations normales. Bien différencier les 3 cas pour éviter le redressement URSSAF."
  },
  {
    question: "Qu'est-ce que l'AT/MP en restauration ?",
    answer: "L'AT/MP (Accidents du Travail / Maladies Professionnelles) est une cotisation patronale spécifique au secteur d'activité, fixée annuellement par la CARSAT (Caisse d'Assurance Retraite et de la Santé Au Travail). Taux 2026 secteur restauration : environ 2,10% pour la restauration traditionnelle, 1,80% pour la restauration rapide, 2,50% pour les débits de boissons. Cette cotisation finance les indemnités en cas d'accident du travail (chutes, brûlures, coupures - fréquents en cuisine). Le taux est individualisé pour les entreprises de plus de 20 salariés : plus l'entreprise a d'accidents, plus son taux augmente l'année suivante."
  },
  {
    question: "Comment optimiser légalement ses charges sociales ?",
    answer: "Cinq leviers légaux. (1) Recruter en apprentissage : exonérations massives + aide 6 000 EUR. (2) Embaucher proche du SMIC : réduction Fillon optimale + bandeaux maladie/famille réduits. (3) Utiliser le contrat d'usage HCR (extra) : pas de prime précarité si conditions remplies. (4) Mettre en place des heures supplémentaires structurelles : exonérées de cotisations patronales jusqu'à 7 500 EUR/an/salarié. (5) Verser des primes exonérées : prime de partage de la valeur (ex-prime Macron) jusqu'à 3 000 EUR/an, 6 000 EUR si accord d'intéressement. Éviter absolument : optimisations risquées (auto-entrepreneur déguisé, faux extras) qui exposent à un redressement majoré."
  },
  {
    question: "Combien coûte une faute grave en termes URSSAF ?",
    answer: "Le licenciement pour faute grave (vol, ivresse au travail, abandon de poste) n'ouvre pas droit aux indemnités de licenciement ni à l'indemnité compensatrice de préavis. Il faut suivre strictement la procédure : convocation à entretien préalable avec mention des griefs (RAR + 5 jours minimum), notification de licenciement par lettre RAR sous 1 mois max après entretien. Erreur fréquente : ne pas respecter ces délais ou les motifs invoqués transforme la faute grave en cause réelle et sérieuse. Coût : rétablissement préavis (1-2 mois selon classification) + indemnité légale (25% brut/an d'ancienneté) + rappel cotisations sociales sur l'ensemble. Pour un salarié 3 ans à 2 000 EUR : 4 500 à 6 500 EUR de coût d'erreur."
  }
];

const breadcrumbItems = [
  { name: "Accueil", url: "https://www.restaumargin.fr/" },
  { name: "Blog", url: "https://www.restaumargin.fr/blog" },
  { name: "Charges sociales en restauration", url: "https://www.restaumargin.fr/blog/charges-sociales-restauration" }
];

const howToCalculerCharges = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment calculer les charges sociales d\'un employé en restauration',
  description: 'Méthode pas à pas pour calculer charges salariales et patronales, et obtenir le coût total employeur en HCR.',
  totalTime: 'PT30M',
  tool: ['Bulletin de paie', 'Calculatrice', 'Logiciel paie ou Excel', 'Logiciel RestauMargin'],
  step: [
    { '@type': 'HowToStep', name: 'Déterminer le salaire brut de référence', text: 'Salaire base 39h x 4,33 semaines = 169h x SMIC horaire 11,88 EUR = 2 008,12 EUR. Inclut les 4h sup structurelles à 10%.' },
    { '@type': 'HowToStep', name: 'Ajouter avantages en nature', text: 'Repas : 4,22 EUR x 2 par jour x 22 jours = 185,68 EUR/mois. Logement saisonnier éventuel : forfait 76 EUR/mois URSSAF.' },
    { '@type': 'HowToStep', name: 'Calculer les cotisations salariales', text: 'Environ 22% du brut total : Sécu maladie (0,75% ded.), CSG-CRDS (9,7%), chômage (2,4%), Agirc-Arrco (4,01%), prévoyance (0,38%). Sur 2 193,68 EUR : -481,16 EUR.' },
    { '@type': 'HowToStep', name: 'Calculer les cotisations patronales brutes', text: 'Environ 42% du brut total : maladie 7%, vieillesse 8,55%+2,02%, Agirc-Arrco 4,72%+1,29%, famille 3,45%, AT/MP 2,10%, chômage 4,05%, FNAL 0,5%, formation 0,55%, prévoyance 0,38%, mutuelle ~27 EUR. Total : ~798 EUR sur 2 193,68 EUR brut.' },
    { '@type': 'HowToStep', name: 'Appliquer la réduction Fillon', text: 'Formule : Réduction = (T / 0,6) x ((1,6 x SMIC x heures / brut) - 1). T = 0,3194 (entreprises <50 salariés). Au SMIC HCR 39h : ~540 EUR/mois déduits.' },
    { '@type': 'HowToStep', name: 'Calculer le coût total employeur', text: 'Brut total + charges patronales nettes + mutuelle + médecine du travail. Au SMIC HCR : 2 193,68 + 258 + 7 = 2 459 EUR/mois. Annuel : x 12,5 (avec CP) = 30 733 EUR.' },
    { '@type': 'HowToStep', name: 'Vérifier la DSN mensuelle', text: 'Contrôler que la réduction Fillon, l\'exonération heures sup, et les avantages en nature sont bien déclarés. Erreur fréquente : oubli de régularisation lors de changements d\'effectif ou de statut.' }
  ]
};

const howToOptimiser = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment optimiser légalement les charges sociales en restauration',
  description: 'Cinq leviers d\'optimisation légale et durable pour réduire le coût employeur sans risque URSSAF.',
  totalTime: 'PT2H',
  tool: ['Plan de masse salariale', 'Logiciel paie', 'Conseil expert-comptable'],
  step: [
    { '@type': 'HowToStep', name: 'Privilégier l\'apprentissage', text: 'Recruter 1 apprenti par tranche de 5 salariés. Exonérations massives URSSAF + aide unique 6 000 EUR/an + crédit d\'impôt 1 600 EUR. Coût 5 fois inférieur à un CDI.' },
    { '@type': 'HowToStep', name: 'Calibrer les salaires sous 1,6 SMIC', text: 'Maximiser la réduction Fillon : reste forte jusqu\'à 1,6 SMIC (2 882 EUR brut/mois), nulle au-delà. Pour postes opérationnels, profiter de cette zone d\'optimisation.' },
    { '@type': 'HowToStep', name: 'Utiliser le contrat d\'usage HCR', text: 'Pour les missions ponctuelles (banquets, événements), l\'extra (CDDU) est exonéré de prime de précarité si conditions strictes remplies (liste limitative, max 2 mois cumulés, usage objectivement temporaire).' },
    { '@type': 'HowToStep', name: 'Structurer les heures supplémentaires', text: 'Au-delà de 35h jusqu\'à 7 500 EUR/an, les heures sup sont exonérées de cotisations patronales. Profiter de cette opportunité pour les 4h sup structurelles HCR (35h->39h).' },
    { '@type': 'HowToStep', name: 'Verser des primes exonérées', text: 'Prime de partage de la valeur (PPV, ex-Macron) jusqu\'à 3 000 EUR/an exonérée de toutes charges, 6 000 EUR si accord d\'intéressement. Alternative attractive aux augmentations de salaires.' }
  ]
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)',
  description: 'Guide complet 2026 des charges sociales en restauration : taux URSSAF, CCN HCR, réduction Fillon, fiche de paie cuisinier, exonérations apprentis, risques contrôle.',
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' }
  },
  datePublished: '2026-04-27',
  dateModified: '2026-05-26',
  wordCount: 3200,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/charges-sociales-restauration' }
};

export default function BlogChargesSociales() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)"
        description="Maîtrisez vos cotisations sociales en restauration : taux 2026 URSSAF, CCN HCR, réduction Fillon, fiche de paie cuisinier au SMIC, comparatif CDI/CDD/extras/apprentis."
        path="/blog/charges-sociales-restauration"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToCalculerCharges, howToOptimiser, articleSchema]}
      />

      {/* Navbar */}
      <PublicHeader />

      {/* Hero */}
      <BlogArticleHero
        category="RH & Paie"
        readTime="15 min"
        date="Mai 2026"
        title="Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)"
        accentWord="charges sociales"
        subtitle="Embaucher au SMIC coûte 2 460 EUR par mois. Taux 2026 CCN HCR, réduction Fillon, fiche de paie détaillée, optimisations légales et pièges à éviter."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          En restauration, embaucher un cuisinier au SMIC à 2 008 EUR brut/mois vous coûte en réalité <strong>2 460 EUR</strong> côté employeur. Soit <strong>22,5% de charges sociales patronales nettes après allègements</strong>. Sans optimisation, ce ratio peut grimper à 45%. Quand on sait que la masse salariale représente <strong>32-40% du chiffre d'affaires</strong>, mal piloter ses charges sociales c'est perdre 2 à 3 points de marge nette. Ce guide 2026 dresse l'état des lieux complet : décomposition des cotisations, réduction Fillon, fiche de paie détaillée, comparatif statuts, optimisations légales et pièges URSSAF.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#vue-densemble" className="hover:text-teal-600 transition-colors">1. Vue d'ensemble : 36 à 45% du brut</a></li>
            <li><a href="#cotisations" className="hover:text-teal-600 transition-colors">2. Décomposition des cotisations patronales</a></li>
            <li><a href="#salariales" className="hover:text-teal-600 transition-colors">3. Cotisations salariales : 22% du brut</a></li>
            <li><a href="#allegements" className="hover:text-teal-600 transition-colors">4. Allègements et exonérations (Fillon)</a></li>
            <li><a href="#fiche-paie" className="hover:text-teal-600 transition-colors">5. Exemple de fiche de paie cuisinier SMIC</a></li>
            <li><a href="#statuts" className="hover:text-teal-600 transition-colors">6. CDI vs CDD vs extras vs apprentis</a></li>
            <li><a href="#optimisation" className="hover:text-teal-600 transition-colors">7. Optimisations légales 2026</a></li>
            <li><a href="#pieges" className="hover:text-teal-600 transition-colors">8. Pièges juridiques à éviter</a></li>
            <li><a href="#controle" className="hover:text-teal-600 transition-colors">9. Contrôle URSSAF : préparation et procédure</a></li>
            <li><a href="#cas-pratique" className="hover:text-teal-600 transition-colors">10. Cas pratique : 8 salariés</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="vue-densemble" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. Vue d'ensemble : 36 à 45% du brut</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour 100 EUR de salaire brut versé en restauration, voici la répartition réelle :
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Net salarié reçu : ~78 EUR (après 22% charges salariales)</div>
            <div>Coût employeur AVANT Fillon : 140-145 EUR</div>
            <div>Coût employeur APRÈS Fillon : 122-137 EUR</div>
            <div>Coefficient brut -&gt; coût employeur : 1,22 à 1,45</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Spécificités de la restauration HCR</strong> :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Convention HCR avec mutuelle obligatoire et avantages en nature repas</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Beaucoup de salaires proches du SMIC = forts allègements possibles</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Recours fréquent aux extras et saisonniers (régimes spécifiques)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Statut spécifique des pourboires (exonération jusqu'au 31/12/2026)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>AT/MP élevé : 2,10% (vs 0,8% en moyenne tertiaire)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Heures sup contingent élevé : 360h/an HCR (vs 220h régime général)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Pour piloter précisément votre masse salariale dans votre <Link to="/blog/calcul-marge-restaurant" className="text-teal-600 hover:underline">calcul de marge restaurant</Link>, comprendre la décomposition fine des cotisations est essentiel.
          </p>
        </section>

        {/* Section 2 */}
        <section id="cotisations" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Décomposition des cotisations patronales</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Les <strong>10 familles de cotisations patronales</strong> payées par l'employeur en 2026, applicables à la restauration traditionnelle (code NAF 5610A) :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cotisation</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Taux</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Base</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Finalité</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Sécu maladie</td><td className="px-4 py-3 font-mono">7% (≤2,5 SMIC) / 13% (&gt;)</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Soins, indemnités journalières</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Vieillesse plafonnée</td><td className="px-4 py-3 font-mono">8,55%</td><td className="px-4 py-3">PMSS (3 925 EUR)</td><td className="px-4 py-3">Retraite de base</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Vieillesse déplafonnée</td><td className="px-4 py-3 font-mono">2,02%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Retraite de base</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Agirc-Arrco T1</td><td className="px-4 py-3 font-mono">4,72% + 1,29% CEG</td><td className="px-4 py-3">PMSS</td><td className="px-4 py-3">Retraite complémentaire</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Agirc-Arrco T2</td><td className="px-4 py-3 font-mono">12,95% + 1,62% CEG</td><td className="px-4 py-3">Tranche T2</td><td className="px-4 py-3">Retraite complémentaire</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Allocations familiales</td><td className="px-4 py-3 font-mono">3,45% (≤3,5 SMIC) / 5,25%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">CAF</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">AT/MP restauration</td><td className="px-4 py-3 font-mono">~2,10%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Accidents travail/MP</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Chômage Unédic</td><td className="px-4 py-3 font-mono">4,05%</td><td className="px-4 py-3">Plafond x 4</td><td className="px-4 py-3">Allocation chômage</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">FNAL</td><td className="px-4 py-3 font-mono">0,1% (&lt;50) / 0,5% (50+)</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Aide au logement</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CSA (Sol. autonomie)</td><td className="px-4 py-3 font-mono">0,3%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Caisse Nationale Sol. Autonomie</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Formation pro</td><td className="px-4 py-3 font-mono">0,55% / 1%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">CUFPA / OPCO</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Apprentissage</td><td className="px-4 py-3 font-mono">0,68%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Taxe d'apprentissage</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Prévoyance HCR</td><td className="px-4 py-3 font-mono">0,38%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">HCR Prévoyance</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Mutuelle HCR</td><td className="px-4 py-3 font-mono">~27 EUR/mois (50%)</td><td className="px-4 py-3">Forfait</td><td className="px-4 py-3">Santé complémentaire</td></tr>
                <tr className="border-t-2 border-mono-100 font-bold"><td className="px-4 py-3">TOTAL avant Fillon</td><td className="px-4 py-3 font-mono">~42-45%</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Ces taux peuvent être revaloriees en cours d'année (LFSS, barèmes URSSAF). Vérifier toujours sur le bulletin officiel URSSAF (urssaf.fr) ou via votre expert-comptable.
          </p>
        </section>

        {/* Section 3 */}
        <section id="salariales" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. Cotisations salariales : 22% du brut</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Les cotisations salariales sont prélevées sur le salaire brut pour calculer le net imposable et le net à payer. Elles ne couttent rien à l'employeur (qui les prélève pour le compte de l'État et des organismes sociaux). Décomposition :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cotisation salariale</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Taux</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Sur 2 193 EUR brut</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Sécu maladie déductible</td><td className="px-4 py-3 font-mono">0,75%</td><td className="px-4 py-3 font-mono">16,45 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CSG déductible</td><td className="px-4 py-3 font-mono">6,8%</td><td className="px-4 py-3 font-mono">149,16 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">CSG non déductible</td><td className="px-4 py-3 font-mono">2,4%</td><td className="px-4 py-3 font-mono">52,64 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CRDS non déductible</td><td className="px-4 py-3 font-mono">0,5%</td><td className="px-4 py-3 font-mono">10,97 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Chômage non déductible</td><td className="px-4 py-3 font-mono">2,4%</td><td className="px-4 py-3 font-mono">52,64 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Agirc-Arrco T1</td><td className="px-4 py-3 font-mono">3,15%</td><td className="px-4 py-3 font-mono">69,10 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">CEG (cot. équilibre général)</td><td className="px-4 py-3 font-mono">0,86%</td><td className="px-4 py-3 font-mono">18,86 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">APEC (cadres uniquement)</td><td className="px-4 py-3 font-mono">0,024%</td><td className="px-4 py-3 font-mono">-</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Prévoyance HCR</td><td className="px-4 py-3 font-mono">0,38%</td><td className="px-4 py-3 font-mono">8,34 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Mutuelle HCR (50% part sal.)</td><td className="px-4 py-3 font-mono">~27 EUR</td><td className="px-4 py-3 font-mono">27,00 EUR</td></tr>
                <tr className="border-t-2 border-mono-100 font-bold"><td className="px-4 py-3">TOTAL salariales</td><td className="px-4 py-3 font-mono">~22%</td><td className="px-4 py-3 font-mono">~481 EUR</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Net imposable = Brut - cotisations déductibles = 2 193 - 244 = 1 949 EUR (sert au calcul de l'impôt sur le revenu). Net à payer = Brut - toutes cotisations salariales = 2 193 - 481 = 1 712 EUR (versé au salarié avant prélèvement à la source).
          </p>
        </section>

        {/* Section 4 */}
        <section id="allegements" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Allègements et exonérations (Fillon)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La <strong>réduction générale des cotisations patronales</strong> (anciennement "réduction Fillon", instaurée en 2003 et plusieurs fois révisée) est l'allègement le plus puissant. Elle s'applique automatiquement aux salariés dont la rémunération est inférieure à <strong>1,6 SMIC</strong> (soit 2 882,88 EUR brut/mois en 2026 pour 169h).
          </p>
          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Formule officielle 2026</h3>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            Réduction = (T / 0,6) x ((1,6 x SMIC x heures / brut) - 1)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Avec :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>T = 0,3194</strong> pour les entreprises de moins de 50 salariés en 2026</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>T = 0,3234</strong> pour les entreprises de 50 salariés et plus</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>SMIC horaire = 11,88 EUR</strong> en 2026</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>Brut</strong> = salaire brut total y compris heures sup et avantages en nature</span></li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Calculs pratiques par niveau de salaire</h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Brut/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Multiple SMIC</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Réduction Fillon</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Charges nettes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">1 802 EUR (SMIC 35h)</td><td className="px-4 py-3">1,00 SMIC</td><td className="px-4 py-3 font-mono font-semibold">~576 EUR</td><td className="px-4 py-3 font-mono">~216 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">2 008 EUR (SMIC 39h)</td><td className="px-4 py-3">1,11 SMIC</td><td className="px-4 py-3 font-mono font-semibold">~540 EUR</td><td className="px-4 py-3 font-mono">~258 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">2 300 EUR</td><td className="px-4 py-3">1,28 SMIC</td><td className="px-4 py-3 font-mono font-semibold">~388 EUR</td><td className="px-4 py-3 font-mono">~580 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">2 600 EUR</td><td className="px-4 py-3">1,44 SMIC</td><td className="px-4 py-3 font-mono font-semibold">~199 EUR</td><td className="px-4 py-3 font-mono">~885 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">2 882 EUR (1,6 SMIC)</td><td className="px-4 py-3">1,60 SMIC</td><td className="px-4 py-3 font-mono font-semibold">0 EUR</td><td className="px-4 py-3 font-mono">~1 213 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">3 500 EUR</td><td className="px-4 py-3">1,94 SMIC</td><td className="px-4 py-3 font-mono font-semibold">0 EUR</td><td className="px-4 py-3 font-mono">~1 470 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Autres allègements spécifiques</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Bandeau maladie</strong> : 7% au lieu de 13% si rémunération ≤ 2,5 SMIC (~4 504 EUR)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Bandeau famille</strong> : 3,45% au lieu de 5,25% si rémunération ≤ 3,5 SMIC (~6 306 EUR)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>ZFU-TE (Zones Franches Urbaines)</strong> : exonérations larges sur 5 ans en zone franche</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Apprentis</strong> : exonérations Sécu + chômage + retraite jusqu'à 79% du SMIC</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Pourboires volontaires</strong> exonérés jusqu'au 31/12/2026 (≤ 1,6 SMIC)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Heures supplémentaires</strong> : exonération patronale jusqu'à 7 500 EUR/an/salarié</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Prime partage valeur (ex-Macron)</strong> : exonérée jusqu'à 3 000 EUR/an (6 000 EUR avec intéressement)</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="fiche-paie" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. Exemple de fiche de paie cuisinier SMIC</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Cas concret : <strong>cuisinier SMIC HCR Niveau 1 échelon 1</strong>, 39h/semaine (169h mensuelles), restaurant 8 salariés, en 2026.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>== ÉLÉMENTS DE SALAIRE ==</div>
            <div>Salaire base 169h x 11,88 EUR (incl. 4h sup à 10%) : 2 008,12 EUR</div>
            <div>Avantage repas (2 x 4,22 x 22 j) : 185,68 EUR</div>
            <div>BRUT TOTAL : 2 193,80 EUR</div>
            <div className="pt-2">== COTISATIONS SALARIALES ==</div>
            <div>Sécu maladie ded. (0,75%) : -16,45 EUR</div>
            <div>CSG ded. (6,8%) : -149,18 EUR</div>
            <div>CSG non ded. (2,4%) : -52,65 EUR</div>
            <div>CRDS (0,5%) : -10,97 EUR</div>
            <div>Chômage non ded. (2,4%) : -52,65 EUR</div>
            <div>Agirc-Arrco T1 (3,15%) : -69,10 EUR</div>
            <div>CEG (0,86%) : -18,87 EUR</div>
            <div>Prévoyance HCR (0,38%) : -8,34 EUR</div>
            <div>Mutuelle (50%) : -27,00 EUR</div>
            <div>Avantage repas retenu : -185,68 EUR</div>
            <div>Total cotisations : -590,89 EUR</div>
            <div className="pt-2">== NETS ==</div>
            <div>Net imposable : 1 712,52 EUR</div>
            <div>Prélèvement à la source (~0% au SMIC) : 0 EUR</div>
            <div>Net à payer : ~1 627 EUR</div>
            <div className="pt-2">== COÛT EMPLOYEUR ==</div>
            <div>Cotisations patronales brutes : +798,28 EUR</div>
            <div>Réduction générale (Fillon) : -540,00 EUR</div>
            <div>Cotisations patronales nettes : +258,28 EUR</div>
            <div>Médecine du travail SPST : +7,00 EUR</div>
            <div className="font-bold border-t border-mono-900 pt-3">COÛT EMPLOYEUR TOTAL : 2 459,08 EUR</div>
            <div className="font-bold">COÛT ANNUEL (12,5 mois) : 30 738 EUR</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Ratio coût/brut = 1,12</strong> au niveau du SMIC HCR après allègements. C'est le plus bas du marché grâce à la réduction Fillon, ce qui rend les recrutements proches du SMIC mécaniquement plus rentables. Pour les profils &gt; 2,5 SMIC, le ratio grimpe à 1,42-1,45 (perte des allègements).
          </p>
        </section>

        {/* Section 6 */}
        <section id="statuts" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. CDI vs CDD vs extras vs apprentis</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Comparatif chiffré pour un même brut de <strong>2 000 EUR/mois</strong> (39h HCR), tous statuts confondus :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Statut</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Charges totales</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Prime précarité</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Coût total/mois</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Coût annuel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">CDI plein temps</td><td className="px-3 py-3 font-mono">~25-28%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3 font-mono">2 540 EUR</td><td className="px-3 py-3 font-mono">31 750 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">CDD &lt; 3 mois</td><td className="px-3 py-3 font-mono">~30%</td><td className="px-3 py-3">+10%</td><td className="px-3 py-3 font-mono">2 800 EUR</td><td className="px-3 py-3 font-mono">35 000 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Extra (CDDU HCR)</td><td className="px-3 py-3 font-mono">~28%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3 font-mono">2 560 EUR</td><td className="px-3 py-3 font-mono">32 000 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Saisonnier</td><td className="px-3 py-3 font-mono">~25-28%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3 font-mono">2 540 EUR</td><td className="px-3 py-3 font-mono">N/A (saisons)</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Apprenti 18-20 ans</td><td className="px-3 py-3 font-mono">~5-7%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3 font-mono"><strong>1 000 EUR</strong></td><td className="px-3 py-3 font-mono"><strong>12 500 EUR</strong></td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Contrat pro alternance</td><td className="px-3 py-3 font-mono">~15%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3 font-mono">2 100 EUR</td><td className="px-3 py-3 font-mono">26 250 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Stagiaire gratification</td><td className="px-3 py-3 font-mono">0% si ≤4,35 EUR/h</td><td className="px-3 py-3">Non</td><td className="px-3 py-3 font-mono">600 EUR</td><td className="px-3 py-3 font-mono">N/A (6 mois max)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Analyse stratégique</strong> :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span>Un apprenti coûte <strong>2,5 fois moins cher</strong> qu'un CDI en équivalent productif. C'est un levier sous-utilisé (seuls 14% des restaurants embauchent des apprentis).</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span>Un extra HCR est plus rentable qu'un CDD classique (pas de prime de précarité), mais nécessite des conditions strictes pour éviter la requalification.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span>Un contrat de professionnalisation (alternance pour adultes 26+ ans) est moins avantageux qu'apprentissage mais utile pour reconversion senior.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span>Pour aller plus loin : guide complet des <Link to="/blog/contrat-travail-restauration-guide" className="text-teal-600 hover:underline">contrats de travail en restauration</Link>.</span></li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="optimisation" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">7. Optimisations légales 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Cinq leviers légaux et durables</strong> pour optimiser vos charges sociales sans risque URSSAF :
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 1 - Maximiser l'apprentissage</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            Recruter 1 apprenti par tranche de 5-6 salariés. Bénéficier des exonérations massives URSSAF + aide unique 6 000 EUR/an + crédit d'impôt 1 600 EUR. ROI imbattable la 1ère année. Voir <Link to="/blog/formation-personnel-restauration" className="text-teal-600 hover:underline">guide formation personnel</Link> pour la mise en place.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 2 - Calibrer les salaires sous 1,6 SMIC</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            La réduction Fillon est maximale au SMIC et décroît linéairement jusqu'à 1,6 SMIC (2 882 EUR brut/mois 2026). Pour les postes opérationnels (commis, serveur, plongeur), rester dans cette zone optimise mécaniquement le coût employeur. Au-delà : perte de tous les bandeaux maladie/famille en plus de la fin de Fillon.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 3 - Utiliser le contrat d'usage HCR</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            Pour les missions ponctuelles (banquets, événements, surcroîts week-end), l'extra (CDDU) est exonéré de prime de précarité. Conditions strictes : liste limitative HCR + max 2 mois cumulés + usage objectivement temporaire. Sinon : requalification automatique.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 4 - Structurer les heures supplémentaires</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            Au-delà de 35h jusqu'à 7 500 EUR/an/salarié, les heures supplémentaires sont exonérées de cotisations patronales (et salariales). En HCR, profiter des 4h sup structurelles (35h -&gt; 39h) pour optimiser. Sur 4h sup x 4,33 sem x 12 mois = 208h/an à ~12,40 EUR (10% maj.) = 2 580 EUR exonérés patronales.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 5 - Verser des primes exonérées</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            La prime de partage de la valeur (PPV, ex-Macron) jusqu'à 3 000 EUR/an par salarié est exonérée de toutes charges sociales et fiscales (sauf CSG/CRDS sur salaire au-delà de 3 SMIC). Plafond porté à 6 000 EUR/an si l'entreprise a mis en place un accord d'intéressement.
          </p>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Exemple chiffré</p>
            <p className="text-sm text-emerald-600">Augmenter un cuisinier de 100 EUR brut/mois coûte 142 EUR/mois à l'employeur (avec charges) et n'augmente le net que de 78 EUR. Verser 1 500 EUR de PPV en une fois coûte 1 500 EUR à l'employeur ET le salarié reçoit 1 500 EUR net. Soit <strong>+72% de pouvoir d'achat pour le salarié</strong> et 12% d'économie pour l'employeur sur l'équivalent annuel.</p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="pieges" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">8. Pièges juridiques à éviter</h2>
          </div>
          <ul className="space-y-4 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Travail dissimulé (article L8221-1)</strong> : pas de fiche de paie, défaut DPAE, sous-déclaration heures. Sanction pénale jusqu'à 3 ans + 45 000 EUR + redressement URSSAF sur 5 ans (vs 3 ans normal). Nouveau dispositif 2025 : DPAE temps réel + croisement automatique avec données de caisse Z. <strong>78% des contrôles HCR détectent du travail dissimulé</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Auto-entrepreneur déguisé</strong> : un cuisinier ou serveur en micro-entreprise qui ne travaille que pour un seul restaurant, avec horaires imposés, matériel fourni, est considéré comme salarié déguisé. Requalification automatique en CDI + redressement 3 ans + indemnités licenciement abusif. Coût médian 22 000 EUR.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Heures sup CCN HCR non majorées</strong> : 36e-39e à +10%, 40e-43e à +20%, au-delà à +50%. Ne pas majorer constitue du travail dissimulé partiel. Prud'hommes : rappel salaires 3 ans + 50% indemnité forfaitaire + dommages-intérêts. Coût médian 8 500 EUR/salarié.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Repas non intégrés au brut</strong> : forfait 2026 = 4,22 EUR par repas du. 2 repas/jour x 22 jours = 185,68 EUR/mois à intégrer dans le brut soumis à cotisations. Oubli systématique = redressement +25%.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Pourboires mal traités</strong> : le "service compris" (15% historique) est du salaire, donc soumis à cotisations. Seuls les pourboires volontaires (laissés directement au serveur) sont exonérés (jusqu'au 31/12/2028, ≤ 1,6 SMIC). Si caisse commune ou TPE pourboires : redistribution traitée comme salaire. Détail complet : <Link to="/blog/pourboires-restaurant-legislation-fiscalite" className="text-teal-600 hover:underline">pourboires en restauration, législation et répartition</Link>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>CDD/extras requalifies</strong> : usage abusif des extras au-delà de 30 j/an sans justification d'usage constant. Voir <Link to="/blog/contrat-travail-restauration-guide" className="text-teal-600 hover:underline">guide complet des contrats</Link>. Coût médian 22 000 EUR/extra requalifié.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Défaut visite médicale d'embauche</strong> : 1 500 EUR par salarié non vu en VIP dans les 3 mois suivant l'embauche au Service de Prévention Santé au Travail (SPST).</span>
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section id="controle" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">9. Contrôle URSSAF : préparation et procédure</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Le secteur HCR est dans le top 3 des secteurs les plus contrôlés</strong> par l'URSSAF. En 2024, 18% des contrôles nationaux portaient sur les CHR pour seulement 4% de la masse salariale française. Voici comment se préparer.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Documents à tenir à jour en permanence</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Déclarations Préalables à l'Embauche (DPAE) - archivées 5 ans minimum</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Contrats de travail signés (CDI, CDD, extras, apprentis) - archivés 5 ans</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Fiches de paie - archivées 5 ans (préconise 10 ans pour litiges)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Plannings hebdomadaires et relevés d'heures - 1 an minimum</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Registre unique du personnel - en permanence sur lieu de travail</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Déclarations Sociales Nominatives (DSN) mensuelles - URSSAF, 5 ans</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Livre de caisse / journaux de vente - 6 ans (Code commerce)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Déclarations TVA et bilans comptables - 10 ans</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Affiliations mutuelle et prévoyance HCR - en cours</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Visite médicale (VIP) des salariés - 3 mois après embauche</span></li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Procédure de contrôle (4 phases)</h3>
          <ol className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span><span><strong>Avis de passage</strong> : RAR 15 jours avant le contrôle, mentionnant la période contrôlée, le nom du contrôleur, la liste des documents à préparer.</span></li>
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span><span><strong>Contrôle sur place</strong> : 1 à 5 jours selon taille entreprise. Le contrôleur examine pièces, interroge salariés, consulte logiciels paie et caisse, demande explications.</span></li>
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span><span><strong>Lettre d'observations</strong> : envoyée dans les 3 mois suivant la fin du contrôle. Détaille les anomalies relevées et chiffre le redressement proposé. Délai de réponse de l'employeur : 30 jours.</span></li>
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span><span><strong>Mise en demeure et recours</strong> : si désaccord, recours commission de recours amiable (CRA) sous 2 mois, puis Tribunal des affaires de sécurité sociale (TASS) en cas de rejet.</span></li>
          </ol>
        </section>

        {/* Section 10 */}
        <section id="cas-pratique" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">10. Cas pratique : restaurant 8 salariés</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Brasserie 60 couverts, CA HT 720 000 EUR, équipe composée de 8 salariés. Synthèse des coûts charges incluses :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Poste</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Brut/mois</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Charges patr.</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Fillon</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Coût total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-3 py-3">Chef de cuisine</td><td className="px-3 py-3 font-mono">3 800 EUR</td><td className="px-3 py-3 font-mono">+1 596 EUR</td><td className="px-3 py-3 font-mono">0 EUR</td><td className="px-3 py-3 font-mono"><strong>5 396 EUR</strong></td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3">Second de cuisine</td><td className="px-3 py-3 font-mono">2 800 EUR</td><td className="px-3 py-3 font-mono">+1 064 EUR</td><td className="px-3 py-3 font-mono">-50 EUR</td><td className="px-3 py-3 font-mono"><strong>3 814 EUR</strong></td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3">Cuisinier</td><td className="px-3 py-3 font-mono">2 200 EUR</td><td className="px-3 py-3 font-mono">+836 EUR</td><td className="px-3 py-3 font-mono">-310 EUR</td><td className="px-3 py-3 font-mono"><strong>2 726 EUR</strong></td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3">Apprenti CAP cuisine</td><td className="px-3 py-3 font-mono">775 EUR</td><td className="px-3 py-3 font-mono">+39 EUR</td><td className="px-3 py-3 font-mono">-aide 500</td><td className="px-3 py-3 font-mono"><strong>314 EUR</strong></td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3">Plongeur 35h</td><td className="px-3 py-3 font-mono">1 802 EUR</td><td className="px-3 py-3 font-mono">+685 EUR</td><td className="px-3 py-3 font-mono">-580 EUR</td><td className="px-3 py-3 font-mono"><strong>1 907 EUR</strong></td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3">Chef de rang</td><td className="px-3 py-3 font-mono">2 400 EUR</td><td className="px-3 py-3 font-mono">+912 EUR</td><td className="px-3 py-3 font-mono">-260 EUR</td><td className="px-3 py-3 font-mono"><strong>3 052 EUR</strong></td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3">Serveur SMIC HCR</td><td className="px-3 py-3 font-mono">2 008 EUR</td><td className="px-3 py-3 font-mono">+763 EUR</td><td className="px-3 py-3 font-mono">-540 EUR</td><td className="px-3 py-3 font-mono"><strong>2 231 EUR</strong></td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3">Extras 8j/mois</td><td className="px-3 py-3 font-mono">650 EUR</td><td className="px-3 py-3 font-mono">+247 EUR</td><td className="px-3 py-3 font-mono">-110 EUR</td><td className="px-3 py-3 font-mono"><strong>787 EUR</strong></td></tr>
                <tr className="border-t-2 border-mono-100 font-bold"><td className="px-3 py-3">TOTAL</td><td className="px-3 py-3 font-mono">16 435 EUR</td><td className="px-3 py-3 font-mono">+6 142 EUR</td><td className="px-3 py-3 font-mono">-2 350 EUR</td><td className="px-3 py-3 font-mono"><strong>20 227 EUR</strong></td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 my-6">
            <p className="font-bold text-mono-100 mb-3">Analyse</p>
            <ul className="space-y-2 text-[#374151]">
              <li>Coût mensuel total : <strong>20 227 EUR</strong> (244 700 EUR/an sur 12,1 mois)</li>
              <li>Total réduction Fillon : <strong>2 350 EUR/mois</strong>, soit 28 400 EUR/an d'économie</li>
              <li>Coût net par salarié équivalent CDI moyen : 2 884 EUR/mois</li>
              <li>Ratio masse salariale / CA HT : <strong>34%</strong> (objectif HCR 30-35% pour brasserie)</li>
              <li>Sans Fillon : coût 22 577 EUR/mois soit 38% du CA (au-dessus seuil critique)</li>
            </ul>
            <p className="mt-3 text-sm">L'apprenti pèse seulement 1,5% des coûts pour 12,5% des effectifs. Pour maîtriser globalement votre <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-600 hover:underline">seuil de rentabilité restaurant</Link>, surveiller en continu le ratio masse salariale / CA et le <Link to="/blog/prime-cost-restaurant" className="text-teal-600 hover:underline">prime cost (food + masse salariale)</Link> qui ne devrait pas dépasser 65-70%.</p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et références officielles</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>URSSAF Caisse Nationale, barèmes 2026 cotisations sociales (urssaf.fr)</li>
            <li>Convention Collective Nationale HCR (IDCC 1979), Légifrance</li>
            <li>Code de la Sécurité sociale, articles L241-1 et suivants (cotisations)</li>
            <li>Article L241-13 du Code de la Sécurité sociale (réduction Fillon)</li>
            <li>Article L8221-1 et suivants du Code du travail (travail dissimulé)</li>
            <li>Décret n°2025-1234 du 27 décembre 2025 (revalorisation cotisations 2026)</li>
            <li>HCR Prévoyance, barèmes mutuelle obligatoire branche restauration</li>
            <li>CARSAT, taux AT/MP secteur restauration 2026</li>
            <li>OPCO Mobilités (Akto.fr), prise en charge formation HCR 2026</li>
            <li>Barème Macron (article L1235-3), indemnités prud'homales</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
                <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
                  {item.question}
                  <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center text-white mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Pilotez votre masse salariale et votre prime cost</h2>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed max-w-xl mx-auto">
            RestauMargin intègre vos charges sociales par statut, calcule votre prime cost en temps réel, simule le coût total d'une embauche avec et sans réduction Fillon.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Internal links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/contrat-travail-restauration-guide" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Contrat de travail en restauration</p>
              <p className="text-sm text-mono-400">CDI, CDD, extras HCR, apprentissage, saisonnier : coûts et risques.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Formation du personnel</p>
              <p className="text-sm text-mono-400">OPCO, CPF, ROI formation, plan 2026 et formations prioritaires.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Réduire le coût personnel</p>
              <p className="text-sm text-mono-400">5 leviers pour économiser 10-20% sur votre masse salariale.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul de marge restaurant</p>
              <p className="text-sm text-mono-400">Méthode complète : food cost, coefficient, marge brute/nette.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Prime cost restaurant</p>
              <p className="text-sm text-mono-400">Indicateur clé food cost + masse salariale. Objectifs HCR.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Seuil de rentabilité</p>
              <p className="text-sm text-mono-400">CA minimum pour couvrir charges fixes RH incluses.</p>
            </Link>
          </div>
        </section>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">&larr; Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
