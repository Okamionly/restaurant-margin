import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Scale, Calculator, Users, AlertTriangle, FileText, TrendingUp, ArrowRight, Receipt, ShieldCheck, Briefcase, Target } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Charges sociales en restauration : guide 2026"
   Mots-cles cibles : charges sociales restaurant calcul, taux URSSAF 2026 HCR,
   reduction Fillon restauration, fiche de paie cuisinier HCR
   ~3 200 mots — EAT, FAQ x12, HowTo, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Le repas du salarie est-il obligatoire en restauration ?",
    answer: "Oui, c'est une obligation conventionnelle HCR (article 22). L'employeur doit fournir le repas en nature ou verser une indemnite compensatrice nourriture. La valeur 2026 est de 4,22 EUR par repas du, soit 8,44 EUR/jour pour 2 repas, ou 185,68 EUR/mois pour 22 jours travailles. Cet avantage en nature doit etre integre dans le brut soumis a cotisations URSSAF. L'employeur peut aussi distribuer des titres-restaurant a la place, mais c'est plus rare en HCR (les titres ne sont pas exoneres comme l'indemnite nourriture conventionnelle)."
  },
  {
    question: "La mutuelle HCR est-elle obligatoire ?",
    answer: "Oui, depuis la loi ANI de 2016 et l'avenant 24bis de la CCN HCR. Tous les salaries en CDI ou CDD &gt;= 3 mois doivent etre affilies a une mutuelle collective. L'employeur prend en charge au minimum 50% de la cotisation, le salarie le solde. HCR Prevoyance est l'organisme designe par defaut, mais l'employeur peut choisir un autre organisme avec garanties au moins equivalentes. Cas d'exoneration (CDD courts, apprentis, temps partiels &lt; 15h) : dispense possible sur demande ecrite du salarie. Couverture minimum obligatoire : panier de soins ANI (consultations, hospitalisation, optique, dentaire de base)."
  },
  {
    question: "Combien coute un apprenti par mois en restauration ?",
    answer: "Un apprenti age de 18-20 ans en 1ere annee perçoit 43% du SMIC, soit environ 775 EUR/mois brut. Les charges patronales sont quasi nulles grace aux exonerations specifiques apprentissage (Sécurité sociale, retraite complementaire, chomage, FNAL). Cout employeur reel : environ 830 EUR/mois brut, auquel il faut deduire l'aide unique de 6 000 EUR la 1ere annee (500 EUR/mois lisses) versee par l'ASP. Cout net mensuel : ~330 EUR. A comparer a un CDI cuisinier au SMIC HCR a 2 460 EUR/mois. Soit 7,5 fois moins cher la 1ere annee. Ajouter le credit d'impot apprentissage 1 600 EUR/an pour les entreprises &lt; 250 salaries."
  },
  {
    question: "La reduction Fillon est-elle automatique ?",
    answer: "Elle est integree automatiquement dans la DSN (Declaration Sociale Nominative) mensuelle si votre logiciel de paie est correctement parametre. Verifiez chaque mois sur le bulletin URSSAF qu'elle est bien appliquee, en particulier apres tout changement (effectif, statut salarie, montant brut, heures supplementaires). Le montant de la reduction varie chaque mois selon la formule : Reduction = (T / 0,6) x ((1,6 x SMIC x heures / brut) - 1), ou T = 0,3194 (entreprises &lt; 50 salaries en 2026) ou T = 0,3234 (50 salaries et plus). Au niveau du SMIC, la reduction efface ~540 EUR/mois de cotisations."
  },
  {
    question: "Que se passe-t-il en cas de controle URSSAF ?",
    answer: "Le controleur URSSAF peut remonter sur les 3 dernieres annees (5 ans en cas de travail dissimule). Il verifie : DPAE, contrats de travail, fiches de paie, plannings, livre de paie, declarations DSN, registre du personnel, registre unique du personnel, declarations TVA, livre de caisse. Redressements moyens en restauration : 15 000 a 80 000 EUR. Sanctions complementaires : majoration de 25%, annulation des reductions de cotisations sur la periode controlee, eventuelle inscription au fichier des fraudeurs (perte des aides publiques pendant 5 ans). En cas de desaccord, recours possible devant le tribunal des affaires de securite sociale (TASS) sous 2 mois."
  },
  {
    question: "Comment calculer le cout total d'un employe au SMIC HCR ?",
    answer: "Cuisinier SMIC HCR 39h, 169h mensuelles : salaire brut 2 008 EUR (incluant 4h sup structurelles a 10%), avantage repas 185,68 EUR (2 repas x 4,22 x 22 jours), soit brut total 2 193,68 EUR. Charges patronales brutes ~798 EUR (36,4%), reduction Fillon -540 EUR, charges nettes +258 EUR. Ajouter medecine du travail SPST 7 EUR. Cout employeur total : 2 459 EUR/mois. Cout annuel sur 12,5 mois (avec conges payes) : 30 733 EUR. Coefficient cout/brut = 1,12 au SMIC, qui monte a 1,42 pour salaires &gt; 2,5 SMIC."
  },
  {
    question: "Quelle est la difference entre cotisations salariales et patronales ?",
    answer: "Les cotisations salariales (~22% du brut) sont prelevees sur le salaire brut du salarie pour calculer son net imposable et net a payer. Elles comprennent : Securite sociale maladie (0,75% deductible), CSG (9,2% dont 6,8% deductible et 2,4% non deductible), CRDS (0,5%), assurance chomage (2,4% non deductible), retraite complementaire (4,01%), prevoyance (0,38%). Les cotisations patronales (~42% du brut) sont payees par l'employeur EN PLUS du brut salarial. Elles couvrent les memes risques sociaux mais a des taux differents et avec des bases parfois plafonnees. La reduction Fillon ne s'applique qu'aux patronales."
  },
  {
    question: "Pourquoi le bandeau maladie passe-t-il de 7% a 13% ?",
    answer: "Le bandeau maladie reduit s'applique a 7% (au lieu de 13% taux normal) pour les salaires inferieurs ou egaux a 2,5 SMIC (~4 500 EUR brut/mois en 2026). C'est un avantage automatique sans demarche. Au-dela de 2,5 SMIC, l'employeur paie le taux plein de 13%. Le passage est progressif (degressivite) sur la fraction qui depasse 2,5 SMIC. Strategiquement, recruter des profils proches du SMIC est mecaniquement plus rentable. Meme principe pour le bandeau famille : 3,45% jusqu'a 3,5 SMIC, puis 5,25% au-dela."
  },
  {
    question: "Les pourboires sont-ils soumis a cotisations en 2026 ?",
    answer: "Cas 1 - Pourboires volontaires (laisses directement au serveur par le client) : exoneres de cotisations sociales et d'impot sur le revenu jusqu'au 31 decembre 2026 pour les salaries remuneres jusqu'a 1,6 SMIC (2 882 EUR brut/mois). Au-dela : soumis aux cotisations normales. Cas 2 - Service compris (15%) integre dans le prix factur : c'est du salaire deguise et doit etre integralement integre au brut soumis a cotisations. Cas 3 - Pourboires centralises (caisse commune, TPE pourboires, repartition par roulement) : redistribues aux salaries, traites comme du salaire, soumis aux cotisations normales. Bien differencier les 3 cas pour eviter le redressement URSSAF."
  },
  {
    question: "Qu'est-ce que l'AT/MP en restauration ?",
    answer: "L'AT/MP (Accidents du Travail / Maladies Professionnelles) est une cotisation patronale specifique au secteur d'activite, fixee annuellement par la CARSAT (Caisse d'Assurance Retraite et de la Sante Au Travail). Taux 2026 secteur restauration : environ 2,10% pour la restauration traditionnelle, 1,80% pour la restauration rapide, 2,50% pour les debits de boissons. Cette cotisation finance les indemnites en cas d'accident du travail (chutes, brulures, coupures - frequents en cuisine). Le taux est individualise pour les entreprises de plus de 20 salaries : plus l'entreprise a d'accidents, plus son taux augmente l'annee suivante."
  },
  {
    question: "Comment optimiser legalement ses charges sociales ?",
    answer: "Cinq leviers legaux. (1) Recruter en apprentissage : exonerations massives + aide 6 000 EUR. (2) Embaucher proche du SMIC : reduction Fillon optimale + bandeaux maladie/famille reduits. (3) Utiliser le contrat d'usage HCR (extra) : pas de prime precarite si conditions remplies. (4) Mettre en place des heures supplementaires structurelles : exonerees de cotisations patronales jusqu'a 7 500 EUR/an/salarie. (5) Verser des primes exonerees : prime de partage de la valeur (ex-prime Macron) jusqu'a 3 000 EUR/an, 6 000 EUR si accord d'interessement. Eviter absolument : optimisations risquees (auto-entrepreneur deguise, faux extras) qui exposent a un redressement majore."
  },
  {
    question: "Combien coute une faute grave en termes URSSAF ?",
    answer: "Le licenciement pour faute grave (vol, ivresse au travail, abandon de poste) n'ouvre pas droit aux indemnites de licenciement ni a l'indemnite compensatrice de preavis. Il faut suivre strictement la procedure : convocation a entretien prealable avec mention des griefs (RAR + 5 jours minimum), notification de licenciement par lettre RAR sous 1 mois max apres entretien. Erreur frequente : ne pas respecter ces delais ou les motifs invoques transforme la faute grave en cause reelle et serieuse. Cout : retablissement preavis (1-2 mois selon classification) + indemnite legale (25% brut/an d'anciennete) + rappel cotisations sociales sur l'ensemble. Pour un salarie 3 ans a 2 000 EUR : 4 500 a 6 500 EUR de cout d'erreur."
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
  name: 'Comment calculer les charges sociales d\'un employe en restauration',
  description: 'Methode pas a pas pour calculer charges salariales et patronales, et obtenir le cout total employeur en HCR.',
  totalTime: 'PT30M',
  tool: ['Bulletin de paie', 'Calculatrice', 'Logiciel paie ou Excel', 'Logiciel RestauMargin'],
  step: [
    { '@type': 'HowToStep', name: 'Determiner le salaire brut de reference', text: 'Salaire base 39h x 4,33 semaines = 169h x SMIC horaire 11,88 EUR = 2 008,12 EUR. Inclut les 4h sup structurelles a 10%.' },
    { '@type': 'HowToStep', name: 'Ajouter avantages en nature', text: 'Repas : 4,22 EUR x 2 par jour x 22 jours = 185,68 EUR/mois. Logement saisonnier eventuel : forfait 76 EUR/mois URSSAF.' },
    { '@type': 'HowToStep', name: 'Calculer les cotisations salariales', text: 'Environ 22% du brut total : Sécu maladie (0,75% ded.), CSG-CRDS (9,7%), chomage (2,4%), Agirc-Arrco (4,01%), prevoyance (0,38%). Sur 2 193,68 EUR : -481,16 EUR.' },
    { '@type': 'HowToStep', name: 'Calculer les cotisations patronales brutes', text: 'Environ 42% du brut total : maladie 7%, vieillesse 8,55%+2,02%, Agirc-Arrco 4,72%+1,29%, famille 3,45%, AT/MP 2,10%, chomage 4,05%, FNAL 0,5%, formation 0,55%, prevoyance 0,38%, mutuelle ~27 EUR. Total : ~798 EUR sur 2 193,68 EUR brut.' },
    { '@type': 'HowToStep', name: 'Appliquer la reduction Fillon', text: 'Formule : Reduction = (T / 0,6) x ((1,6 x SMIC x heures / brut) - 1). T = 0,3194 (entreprises <50 salaries). Au SMIC HCR 39h : ~540 EUR/mois deduits.' },
    { '@type': 'HowToStep', name: 'Calculer le cout total employeur', text: 'Brut total + charges patronales nettes + mutuelle + medecine du travail. Au SMIC HCR : 2 193,68 + 258 + 7 = 2 459 EUR/mois. Annuel : x 12,5 (avec CP) = 30 733 EUR.' },
    { '@type': 'HowToStep', name: 'Verifier la DSN mensuelle', text: 'Controler que la reduction Fillon, l\'exoneration heures sup, et les avantages en nature sont bien declares. Erreur frequente : oubli de regularisation lors de changements d\'effectif ou de statut.' }
  ]
};

const howToOptimiser = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment optimiser legalement les charges sociales en restauration',
  description: 'Cinq leviers d\'optimisation legale et durable pour reduire le cout employeur sans risque URSSAF.',
  totalTime: 'PT2H',
  tool: ['Plan de masse salariale', 'Logiciel paie', 'Conseil expert-comptable'],
  step: [
    { '@type': 'HowToStep', name: 'Privilegier l\'apprentissage', text: 'Recruter 1 apprenti par tranche de 5 salaries. Exonerations massives URSSAF + aide unique 6 000 EUR/an + credit d\'impot 1 600 EUR. Cout 5 fois inferieur a un CDI.' },
    { '@type': 'HowToStep', name: 'Calibrer les salaires sous 1,6 SMIC', text: 'Maximiser la reduction Fillon : reste forte jusqu\'a 1,6 SMIC (2 882 EUR brut/mois), nulle au-dela. Pour postes operationnels, profiter de cette zone d\'optimisation.' },
    { '@type': 'HowToStep', name: 'Utiliser le contrat d\'usage HCR', text: 'Pour les missions ponctuelles (banquets, evenements), l\'extra (CDDU) est exonere de prime de precarite si conditions strictes remplies (liste limitative, max 2 mois cumules, usage objectivement temporaire).' },
    { '@type': 'HowToStep', name: 'Structurer les heures supplementaires', text: 'Au-dela de 35h jusqu\'a 7 500 EUR/an, les heures sup sont exonerees de cotisations patronales. Profiter de cette opportunite pour les 4h sup structurelles HCR (35h->39h).' },
    { '@type': 'HowToStep', name: 'Verser des primes exonerees', text: 'Prime de partage de la valeur (PPV, ex-Macron) jusqu\'a 3 000 EUR/an exoneree de toutes charges, 6 000 EUR si accord d\'interessement. Alternative attractive aux augmentations de salaires.' }
  ]
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Charges sociales en restauration : guide 2026 (taux, exonerations, URSSAF)',
  description: 'Guide complet 2026 des charges sociales en restauration : taux URSSAF, CCN HCR, reduction Fillon, fiche de paie cuisinier, exonerations apprentis, risques controle.',
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La redaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
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
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Charges sociales en restauration : guide 2026 (taux, exonerations, URSSAF)"
        description="Maitrisez vos cotisations sociales en restauration : taux 2026 URSSAF, CCN HCR, reduction Fillon, fiche de paie cuisinier au SMIC, comparatif CDI/CDD/extras/apprentis."
        path="/blog/charges-sociales-restauration"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToCalculerCharges, howToOptimiser, articleSchema]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <BlogArticleHero
        category="RH & Paie"
        readTime="15 min"
        date="Mai 2026"
        title="Charges sociales en restauration : guide 2026 (taux, exonerations, URSSAF)"
        accentWord="charges sociales"
        subtitle="Embaucher au SMIC coute 2 460 EUR par mois. Taux 2026 CCN HCR, reduction Fillon, fiche de paie detaillee, optimisations legales et pieges a eviter."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          En restauration, embaucher un cuisinier au SMIC a 2 008 EUR brut/mois vous coute en realite <strong>2 460 EUR</strong> cote employeur. Soit <strong>22,5% de charges sociales patronales nettes apres allegements</strong>. Sans optimisation, ce ratio peut grimper a 45%. Quand on sait que la masse salariale represente <strong>32-40% du chiffre d'affaires</strong>, mal piloter ses charges sociales c'est perdre 2 a 3 points de marge nette. Ce guide 2026 dresse l'etat des lieux complet : decomposition des cotisations, reduction Fillon, fiche de paie detaillee, comparatif statuts, optimisations legales et pieges URSSAF.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#vue-densemble" className="hover:text-teal-600 transition-colors">1. Vue d'ensemble : 36 a 45% du brut</a></li>
            <li><a href="#cotisations" className="hover:text-teal-600 transition-colors">2. Decomposition des cotisations patronales</a></li>
            <li><a href="#salariales" className="hover:text-teal-600 transition-colors">3. Cotisations salariales : 22% du brut</a></li>
            <li><a href="#allegements" className="hover:text-teal-600 transition-colors">4. Allegements et exonerations (Fillon)</a></li>
            <li><a href="#fiche-paie" className="hover:text-teal-600 transition-colors">5. Exemple de fiche de paie cuisinier SMIC</a></li>
            <li><a href="#statuts" className="hover:text-teal-600 transition-colors">6. CDI vs CDD vs extras vs apprentis</a></li>
            <li><a href="#optimisation" className="hover:text-teal-600 transition-colors">7. Optimisations legales 2026</a></li>
            <li><a href="#pieges" className="hover:text-teal-600 transition-colors">8. Pieges juridiques a eviter</a></li>
            <li><a href="#controle" className="hover:text-teal-600 transition-colors">9. Controle URSSAF : preparation et procedure</a></li>
            <li><a href="#cas-pratique" className="hover:text-teal-600 transition-colors">10. Cas pratique : 8 salaries</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="vue-densemble" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. Vue d'ensemble : 36 a 45% du brut</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour 100 EUR de salaire brut verse en restauration, voici la repartition reelle :
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Net salarie reçu : ~78 EUR (apres 22% charges salariales)</div>
            <div>Coût employeur AVANT Fillon : 140-145 EUR</div>
            <div>Coût employeur APRES Fillon : 122-137 EUR</div>
            <div>Coefficient brut -&gt; cout employeur : 1,22 a 1,45</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Specificites de la restauration HCR</strong> :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Convention HCR avec mutuelle obligatoire et avantages en nature repas</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Beaucoup de salaires proches du SMIC = forts allegements possibles</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Recours frequent aux extras et saisonniers (regimes specifiques)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Statut specifique des pourboires (exoneration jusqu'au 31/12/2026)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>AT/MP eleve : 2,10% (vs 0,8% en moyenne tertiaire)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span>Heures sup contingent eleve : 360h/an HCR (vs 220h regime general)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Pour piloter precisement votre masse salariale dans votre <Link to="/blog/calcul-marge-restaurant" className="text-teal-600 hover:underline">calcul de marge restaurant</Link>, comprendre la decomposition fine des cotisations est essentiel.
          </p>
        </section>

        {/* Section 2 */}
        <section id="cotisations" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Decomposition des cotisations patronales</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Les <strong>10 familles de cotisations patronales</strong> payees par l'employeur en 2026, applicables a la restauration traditionnelle (code NAF 5610A) :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cotisation</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Taux</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Base</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Finalite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Sécu maladie</td><td className="px-4 py-3 font-mono">7% (≤2,5 SMIC) / 13% (&gt;)</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Soins, indemnites journalieres</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Vieillesse plafonnee</td><td className="px-4 py-3 font-mono">8,55%</td><td className="px-4 py-3">PMSS (3 925 EUR)</td><td className="px-4 py-3">Retraite de base</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Vieillesse deplafonnee</td><td className="px-4 py-3 font-mono">2,02%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Retraite de base</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Agirc-Arrco T1</td><td className="px-4 py-3 font-mono">4,72% + 1,29% CEG</td><td className="px-4 py-3">PMSS</td><td className="px-4 py-3">Retraite complementaire</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Agirc-Arrco T2</td><td className="px-4 py-3 font-mono">12,95% + 1,62% CEG</td><td className="px-4 py-3">Tranche T2</td><td className="px-4 py-3">Retraite complementaire</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Allocations familiales</td><td className="px-4 py-3 font-mono">3,45% (≤3,5 SMIC) / 5,25%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">CAF</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">AT/MP restauration</td><td className="px-4 py-3 font-mono">~2,10%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Accidents travail/MP</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Chomage Unedic</td><td className="px-4 py-3 font-mono">4,05%</td><td className="px-4 py-3">Plafond x 4</td><td className="px-4 py-3">Allocation chomage</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">FNAL</td><td className="px-4 py-3 font-mono">0,1% (&lt;50) / 0,5% (50+)</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Aide au logement</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CSA (Sol. autonomie)</td><td className="px-4 py-3 font-mono">0,3%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Caisse Nationale Sol. Autonomie</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Formation pro</td><td className="px-4 py-3 font-mono">0,55% / 1%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">CUFPA / OPCO</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Apprentissage</td><td className="px-4 py-3 font-mono">0,68%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">Taxe d'apprentissage</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Prevoyance HCR</td><td className="px-4 py-3 font-mono">0,38%</td><td className="px-4 py-3">Brut total</td><td className="px-4 py-3">HCR Prevoyance</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Mutuelle HCR</td><td className="px-4 py-3 font-mono">~27 EUR/mois (50%)</td><td className="px-4 py-3">Forfait</td><td className="px-4 py-3">Sante complementaire</td></tr>
                <tr className="border-t-2 border-mono-100 font-bold"><td className="px-4 py-3">TOTAL avant Fillon</td><td className="px-4 py-3 font-mono">~42-45%</td><td className="px-4 py-3">-</td><td className="px-4 py-3">-</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Ces taux peuvent etre revaloriees en cours d'annee (LFSS, baremes URSSAF). Verifier toujours sur le bulletin officiel URSSAF (urssaf.fr) ou via votre expert-comptable.
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
            Les cotisations salariales sont prelevees sur le salaire brut pour calculer le net imposable et le net a payer. Elles ne couttent rien a l'employeur (qui les preleve pour le compte de l'Etat et des organismes sociaux). Decomposition :
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
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Sécu maladie deductible</td><td className="px-4 py-3 font-mono">0,75%</td><td className="px-4 py-3 font-mono">16,45 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CSG deductible</td><td className="px-4 py-3 font-mono">6,8%</td><td className="px-4 py-3 font-mono">149,16 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">CSG non deductible</td><td className="px-4 py-3 font-mono">2,4%</td><td className="px-4 py-3 font-mono">52,64 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CRDS non deductible</td><td className="px-4 py-3 font-mono">0,5%</td><td className="px-4 py-3 font-mono">10,97 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Chomage non deductible</td><td className="px-4 py-3 font-mono">2,4%</td><td className="px-4 py-3 font-mono">52,64 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Agirc-Arrco T1</td><td className="px-4 py-3 font-mono">3,15%</td><td className="px-4 py-3 font-mono">69,10 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">CEG (cot. equilibre general)</td><td className="px-4 py-3 font-mono">0,86%</td><td className="px-4 py-3 font-mono">18,86 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">APEC (cadres uniquement)</td><td className="px-4 py-3 font-mono">0,024%</td><td className="px-4 py-3 font-mono">-</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Prevoyance HCR</td><td className="px-4 py-3 font-mono">0,38%</td><td className="px-4 py-3 font-mono">8,34 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Mutuelle HCR (50% part sal.)</td><td className="px-4 py-3 font-mono">~27 EUR</td><td className="px-4 py-3 font-mono">27,00 EUR</td></tr>
                <tr className="border-t-2 border-mono-100 font-bold"><td className="px-4 py-3">TOTAL salariales</td><td className="px-4 py-3 font-mono">~22%</td><td className="px-4 py-3 font-mono">~481 EUR</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Net imposable = Brut - cotisations deductibles = 2 193 - 244 = 1 949 EUR (sert au calcul de l'impot sur le revenu). Net a payer = Brut - toutes cotisations salariales = 2 193 - 481 = 1 712 EUR (verse au salarie avant prelevement a la source).
          </p>
        </section>

        {/* Section 4 */}
        <section id="allegements" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Allegements et exonerations (Fillon)</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La <strong>reduction generale des cotisations patronales</strong> (anciennement "reduction Fillon", instauree en 2003 et plusieurs fois revisee) est l'allegement le plus puissant. Elle s'applique automatiquement aux salaries dont la remuneration est inferieure a <strong>1,6 SMIC</strong> (soit 2 882,88 EUR brut/mois en 2026 pour 169h).
          </p>
          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Formule officielle 2026</h3>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            Reduction = (T / 0,6) x ((1,6 x SMIC x heures / brut) - 1)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Avec :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>T = 0,3194</strong> pour les entreprises de moins de 50 salaries en 2026</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>T = 0,3234</strong> pour les entreprises de 50 salaries et plus</span></li>
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
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Reduction Fillon</th>
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

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Autres allegements specifiques</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Bandeau maladie</strong> : 7% au lieu de 13% si remuneration ≤ 2,5 SMIC (~4 504 EUR)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Bandeau famille</strong> : 3,45% au lieu de 5,25% si remuneration ≤ 3,5 SMIC (~6 306 EUR)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>ZFU-TE (Zones Franches Urbaines)</strong> : exonerations larges sur 5 ans en zone franche</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Apprentis</strong> : exonerations Sécu + chomage + retraite jusqu'a 79% du SMIC</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Pourboires volontaires</strong> exoneres jusqu'au 31/12/2026 (≤ 1,6 SMIC)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Heures supplementaires</strong> : exoneration patronale jusqu'a 7 500 EUR/an/salarie</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><strong>Prime partage valeur (ex-Macron)</strong> : exoneree jusqu'a 3 000 EUR/an (6 000 EUR avec interessement)</li>
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
            Cas concret : <strong>cuisinier SMIC HCR Niveau 1 echelon 1</strong>, 39h/semaine (169h mensuelles), restaurant 8 salaries, en 2026.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>== ELEMENTS DE SALAIRE ==</div>
            <div>Salaire base 169h x 11,88 EUR (incl. 4h sup a 10%) : 2 008,12 EUR</div>
            <div>Avantage repas (2 x 4,22 x 22 j) : 185,68 EUR</div>
            <div>BRUT TOTAL : 2 193,80 EUR</div>
            <div className="pt-2">== COTISATIONS SALARIALES ==</div>
            <div>Sécu maladie ded. (0,75%) : -16,45 EUR</div>
            <div>CSG ded. (6,8%) : -149,18 EUR</div>
            <div>CSG non ded. (2,4%) : -52,65 EUR</div>
            <div>CRDS (0,5%) : -10,97 EUR</div>
            <div>Chomage non ded. (2,4%) : -52,65 EUR</div>
            <div>Agirc-Arrco T1 (3,15%) : -69,10 EUR</div>
            <div>CEG (0,86%) : -18,87 EUR</div>
            <div>Prevoyance HCR (0,38%) : -8,34 EUR</div>
            <div>Mutuelle (50%) : -27,00 EUR</div>
            <div>Avantage repas retenu : -185,68 EUR</div>
            <div>Total cotisations : -590,89 EUR</div>
            <div className="pt-2">== NETS ==</div>
            <div>Net imposable : 1 712,52 EUR</div>
            <div>Prelevement a la source (~0% au SMIC) : 0 EUR</div>
            <div>Net a payer : ~1 627 EUR</div>
            <div className="pt-2">== COUT EMPLOYEUR ==</div>
            <div>Cotisations patronales brutes : +798,28 EUR</div>
            <div>Reduction generale (Fillon) : -540,00 EUR</div>
            <div>Cotisations patronales nettes : +258,28 EUR</div>
            <div>Medecine du travail SPST : +7,00 EUR</div>
            <div className="font-bold border-t border-mono-900 pt-3">COUT EMPLOYEUR TOTAL : 2 459,08 EUR</div>
            <div className="font-bold">COUT ANNUEL (12,5 mois) : 30 738 EUR</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Ratio cout/brut = 1,12</strong> au niveau du SMIC HCR apres allegements. C'est le plus bas du marche grace a la reduction Fillon, ce qui rend les recrutements proches du SMIC mecaniquement plus rentables. Pour les profils &gt; 2,5 SMIC, le ratio grimpe a 1,42-1,45 (perte des allegements).
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
            Comparatif chiffre pour un meme brut de <strong>2 000 EUR/mois</strong> (39h HCR), tous statuts confondus :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Statut</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Charges totales</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Prime precarite</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Cout total/mois</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Cout annuel</th>
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
            <strong>Analyse strategique</strong> :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span>Un apprenti coute <strong>2,5 fois moins cher</strong> qu'un CDI en equivalent productif. C'est un levier sous-utilise (seuls 14% des restaurants embauchent des apprentis).</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span>Un extra HCR est plus rentable qu'un CDD classique (pas de prime de precarite), mais necessite des conditions strictes pour eviter la requalification.</span></li>
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
            <h2 className="text-2xl font-bold text-mono-100">7. Optimisations legales 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Cinq leviers legaux et durables</strong> pour optimiser vos charges sociales sans risque URSSAF :
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 1 - Maximiser l'apprentissage</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            Recruter 1 apprenti par tranche de 5-6 salaries. Beneficier des exonerations massives URSSAF + aide unique 6 000 EUR/an + credit d'impot 1 600 EUR. ROI imbattable la 1ere annee. Voir <Link to="/blog/formation-personnel-restauration" className="text-teal-600 hover:underline">guide formation personnel</Link> pour la mise en place.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 2 - Calibrer les salaires sous 1,6 SMIC</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            La reduction Fillon est maximale au SMIC et decroit lineairement jusqu'a 1,6 SMIC (2 882 EUR brut/mois 2026). Pour les postes operationnels (commis, serveur, plongeur), rester dans cette zone optimise mecaniquement le cout employeur. Au-dela : perte de tous les bandeaux maladie/famille en plus de la fin de Fillon.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 3 - Utiliser le contrat d'usage HCR</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            Pour les missions ponctuelles (banquets, evenements, surcroits week-end), l'extra (CDDU) est exonere de prime de precarite. Conditions strictes : liste limitative HCR + max 2 mois cumules + usage objectivement temporaire. Sinon : requalification automatique.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 4 - Structurer les heures supplementaires</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            Au-dela de 35h jusqu'a 7 500 EUR/an/salarie, les heures supplementaires sont exonerees de cotisations patronales (et salariales). En HCR, profiter des 4h sup structurelles (35h -&gt; 39h) pour optimiser. Sur 4h sup x 4,33 sem x 12 mois = 208h/an a ~12,40 EUR (10% maj.) = 2 580 EUR exoneres patronales.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Levier 5 - Verser des primes exonerees</h3>
          <p className="text-[#374151] leading-relaxed mb-3">
            La prime de partage de la valeur (PPV, ex-Macron) jusqu'a 3 000 EUR/an par salarie est exoneree de toutes charges sociales et fiscales (sauf CSG/CRDS sur salaire au-dela de 3 SMIC). Plafond porte a 6 000 EUR/an si l'entreprise a mis en place un accord d'interessement.
          </p>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Exemple chiffre</p>
            <p className="text-sm text-emerald-600">Augmenter un cuisinier de 100 EUR brut/mois coute 142 EUR/mois a l'employeur (avec charges) et n'augmente le net que de 78 EUR. Verser 1 500 EUR de PPV en une fois coute 1 500 EUR a l'employeur ET le salarie reçoit 1 500 EUR net. Soit <strong>+72% de pouvoir d'achat pour le salarie</strong> et 12% d'economie pour l'employeur sur l'equivalent annuel.</p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="pieges" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">8. Pieges juridiques a eviter</h2>
          </div>
          <ul className="space-y-4 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Travail dissimule (article L8221-1)</strong> : pas de fiche de paie, defaut DPAE, sous-declaration heures. Sanction penale jusqu'a 3 ans + 45 000 EUR + redressement URSSAF sur 5 ans (vs 3 ans normal). Nouveau dispositif 2025 : DPAE temps reel + croisement automatique avec donnees de caisse Z. <strong>78% des controles HCR detectent du travail dissimule</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Auto-entrepreneur deguise</strong> : un cuisinier ou serveur en micro-entreprise qui ne travaille que pour un seul restaurant, avec horaires imposes, materiel fourni, est considere comme salarie deguise. Requalification automatique en CDI + redressement 3 ans + indemnites licenciement abusif. Cout median 22 000 EUR.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Heures sup CCN HCR non majorees</strong> : 36e-39e a +10%, 40e-43e a +20%, au-dela a +50%. Ne pas majorer constitue du travail dissimule partiel. Prud'hommes : rappel salaires 3 ans + 50% indemnite forfaitaire + dommages-interets. Cout median 8 500 EUR/salarie.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Repas non integres au brut</strong> : forfait 2026 = 4,22 EUR par repas du. 2 repas/jour x 22 jours = 185,68 EUR/mois a integrer dans le brut soumis a cotisations. Oubli systematique = redressement +25%.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Pourboires mal traites</strong> : le "service compris" (15% historique) est du salaire, donc soumis a cotisations. Seuls les pourboires volontaires (laisses directement au serveur) sont exoneres (jusqu'au 31/12/2026, ≤ 1,6 SMIC). Si caisse commune ou TPE pourboires : redistributuons traites comme salaire.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>CDD/extras requalifies</strong> : usage abusif des extras au-dela de 30 j/an sans justification d'usage constant. Voir <Link to="/blog/contrat-travail-restauration-guide" className="text-teal-600 hover:underline">guide complet des contrats</Link>. Cout median 22 000 EUR/extra requalifie.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Defaut visite medicale d'embauche</strong> : 1 500 EUR par salarie non vu en VIP dans les 3 mois suivant l'embauche au Service de Prevention Sante au Travail (SPST).</span>
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section id="controle" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">9. Controle URSSAF : preparation et procedure</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Le secteur HCR est dans le top 3 des secteurs les plus controles</strong> par l'URSSAF. En 2024, 18% des controles nationaux portaient sur les CHR pour seulement 4% de la masse salariale francaise. Voici comment se preparer.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Documents a tenir a jour en permanence</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Declarations Prealables a l'Embauche (DPAE) - archivees 5 ans minimum</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Contrats de travail signes (CDI, CDD, extras, apprentis) - archives 5 ans</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Fiches de paie - archivees 5 ans (preconise 10 ans pour litiges)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Plannings hebdomadaires et releves d'heures - 1 an minimum</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Registre unique du personnel - en permanence sur lieu de travail</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Declarations Sociales Nominatives (DSN) mensuelles - URSSAF, 5 ans</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Livre de caisse / journaux de vente - 6 ans (Code commerce)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Declarations TVA et bilans comptables - 10 ans</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Affiliations mutuelle et prevoyance HCR - en cours</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Visite medicale (VIP) des salaries - 3 mois apres embauche</span></li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Procedure de controle (4 phases)</h3>
          <ol className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span><span><strong>Avis de passage</strong> : RAR 15 jours avant le controle, mentionnant la periode controlee, le nom du controleur, la liste des documents a preparer.</span></li>
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span><span><strong>Controle sur place</strong> : 1 a 5 jours selon taille entreprise. Le controleur examine pieces, interroge salaries, consulte logiciels paie et caisse, demande explications.</span></li>
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span><span><strong>Lettre d'observations</strong> : envoyee dans les 3 mois suivant la fin du controle. Detaille les anomalies relevees et chiffre le redressement propose. Delai de reponse de l'employeur : 30 jours.</span></li>
            <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span><span><strong>Mise en demeure et recours</strong> : si desaccord, recours commission de recours amiable (CRA) sous 2 mois, puis Tribunal des affaires de securite sociale (TASS) en cas de rejet.</span></li>
          </ol>
        </section>

        {/* Section 10 */}
        <section id="cas-pratique" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">10. Cas pratique : restaurant 8 salaries</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Brasserie 60 couverts, CA HT 720 000 EUR, equipe composee de 8 salaries. Synthese des couts charges incluses :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Poste</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Brut/mois</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Charges patr.</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Fillon</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Cout total</th>
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
              <li>Cout mensuel total : <strong>20 227 EUR</strong> (244 700 EUR/an sur 12,1 mois)</li>
              <li>Total reduction Fillon : <strong>2 350 EUR/mois</strong>, soit 28 400 EUR/an d'economie</li>
              <li>Cout net par salarie equivalent CDI moyen : 2 884 EUR/mois</li>
              <li>Ratio masse salariale / CA HT : <strong>34%</strong> (objectif HCR 30-35% pour brasserie)</li>
              <li>Sans Fillon : cout 22 577 EUR/mois soit 38% du CA (au-dessus seuil critique)</li>
            </ul>
            <p className="mt-3 text-sm">L'apprenti pese seulement 1,5% des couts pour 12,5% des effectifs. Pour maitriser globalement votre <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-600 hover:underline">seuil de rentabilite restaurant</Link>, surveiller en continu le ratio masse salariale / CA et le <Link to="/blog/prime-cost" className="text-teal-600 hover:underline">prime cost (food + masse salariale)</Link> qui ne devrait pas depasser 65-70%.</p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et references officielles</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>URSSAF Caisse Nationale, baremes 2026 cotisations sociales (urssaf.fr)</li>
            <li>Convention Collective Nationale HCR (IDCC 1979), Legifrance</li>
            <li>Code de la Sécurité sociale, articles L241-1 et suivants (cotisations)</li>
            <li>Article L241-13 du Code de la Sécurité sociale (reduction Fillon)</li>
            <li>Article L8221-1 et suivants du Code du travail (travail dissimule)</li>
            <li>Decret n°2025-1234 du 27 decembre 2025 (revalorisation cotisations 2026)</li>
            <li>HCR Prevoyance, baremes mutuelle obligatoire branche restauration</li>
            <li>CARSAT, taux AT/MP secteur restauration 2026</li>
            <li>OPCO Mobilites (Akto.fr), prise en charge formation HCR 2026</li>
            <li>Bareme Macron (article L1235-3), indemnites prud'homales</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
            RestauMargin integre vos charges sociales par statut, calcule votre prime cost en temps reel, simule le cout total d'une embauche avec et sans reduction Fillon.
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
              <p className="text-sm text-mono-400">CDI, CDD, extras HCR, apprentissage, saisonnier : couts et risques.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Formation du personnel</p>
              <p className="text-sm text-mono-400">OPCO, CPF, ROI formation, plan 2026 et formations prioritaires.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Reduire le cout personnel</p>
              <p className="text-sm text-mono-400">5 leviers pour economiser 10-20% sur votre masse salariale.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul de marge restaurant</p>
              <p className="text-sm text-mono-400">Methode complete : food cost, coefficient, marge brute/nette.</p>
            </Link>
            <Link to="/blog/prime-cost" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Prime cost restaurant</p>
              <p className="text-sm text-mono-400">Indicateur cle food cost + masse salariale. Objectifs HCR.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Seuil de rentabilite</p>
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
