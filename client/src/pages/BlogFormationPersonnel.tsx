import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Users, GraduationCap, Euro, Calendar, ClipboardCheck, ArrowRight, Award, Target, FileText, Scale, AlertTriangle, TrendingUp } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Formation du personnel en restauration 2026"
   Mots-cles cibles : formation personnel restaurant, OPCO Mobilites HCR,
   formations obligatoires HACCP, CPF restauration, formation continue HCR
   ~3 200 mots — EAT, FAQ x12, HowTo, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Faut-il payer une formation pendant les heures de travail ?",
    answer: "Cela dépend du cadre. Si la formation est dans le plan de développement des compétences de l'employeur (formation obligatoire, adaptation au poste), oui : c'est impérativement du temps de travail effectif rémunéré à 100% (article L6321-2 du Code du travail). Si la formation est suivie sur CPF en dehors des heures de travail, non, mais l'employeur peut décider de la financer sur le temps de travail. Pour les certifications HACCP, SST, sécurité incendie, le temps de formation est obligatoirement rémunéré comme du travail effectif."
  },
  {
    question: "Mon employé refuse une formation, puis-je l'imposer ?",
    answer: "Oui pour toutes les formations obligatoires (HACCP, sécurité, adaptation au poste, évolution technique). Le refus constitue une faute disciplinaire pouvant aller jusqu'au licenciement pour cause réelle et sérieuse. Non pour les formations de développement personnel réalisées hors temps de travail (langue étrangère CPF, certification). Cas particulier : refus de formation aux nouveaux équipements ou procédures HACCP = mise en danger collective, sanction immédiate possible."
  },
  {
    question: "L'OPCO Mobilités finance-t-il à 100 % en 2026 ?",
    answer: "Pour les TPE/PME (moins de 50 salariés) du secteur HCR : oui, dans la limite de 25 EUR par heure de formation et selon les enveloppes annuelles disponibles. L'enveloppe 2026 est de 480 millions d'EUR pour la branche HCR (en hausse de 8% vs 2025). Faire la demande dès janvier car les enveloppes régionales s'épuisent rapidement (juin-juillet en moyenne). Pour les entreprises de 50-249 salariés, la prise en charge tombe à 60-80%. Au-delà de 250 salariés : 0% via OPCO, contribution obligatoire 1% masse salariale à gérer directement."
  },
  {
    question: "Combien de jours de formation par an et par salarié en restauration ?",
    answer: "Aucune obligation chiffrée dans la loi, mais la convention HCR recommande 3 à 5 jours par an et par salarié, soit 21 à 35 heures. Les benchmarks branche montrent que les restaurants performants investissent en moyenne 28 heures/an/salarié (vs 14h pour la moyenne nationale tous secteurs). L'entretien professionnel obligatoire tous les 2 ans (article L6315-1) est l'occasion de formaliser un parcours individualisé. À 6 ans, si aucune formation non obligatoire n'a été suivie : abondement automatique CPF de 3 000 EUR à la charge employeur (article L6323-13)."
  },
  {
    question: "Quel est le ROI d'une formation HACCP recyclage ?",
    answer: "La formation HACCP de 14h coûte 200 à 400 EUR par personne et est obligatoire pour au moins 1 personne en cuisine (décret 2011-731). Renouvellement recommandé tous les 5 ans. ROI direct : évite une fermeture administrative en cas de TIAC (Toxi-Infection Alimentaire Collective), dont le coût moyen pour un restaurant est de 18 500 EUR (perte CA, expertise, sanctions, image). ROI indirect : réduction de 35-40% du gaspillage matière par maîtrise des DLC et chaîne du froid. Sur un restaurant 60 couverts avec 8 000 EUR/an de gaspillage : économie de 2 800 à 3 200 EUR la 1ère année."
  },
  {
    question: "Que couvre le CPF de mon salarié en 2026 ?",
    answer: "Le Compte Personnel de Formation (CPF) est alimente de 500 EUR par an par salarié à temps plein (800 EUR pour les non-qualifiés de niveau V infra), avec un plafond cumulé de 5 000 EUR (8 000 EUR niveau V infra). Utilisations possibles en restauration : sommellerie/oenologie, anglais professionnel, gestion d'équipe, hygiène/HACCP, permis BEPECASER, formations certifiantes inscrites au RNCP. L'employeur peut abonder le CPF du salarié pour orienter vers une formation utile à l'entreprise (effet de levier : 1 EUR employeur + 1 EUR CPF + 1 EUR OPCO = 3 EUR de valeur formation)."
  },
  {
    question: "Combien coûte une formation sommellerie pour un serveur ?",
    answer: "Selon le niveau et la durée : initiation 1 jour 400-600 EUR, certification 5 jours WSET niveau 2 environ 1 200 EUR, formation longue Master of Wine 8 000-15 000 EUR. ROI mesurable en restauration : un serveur formé augmente le ticket vin moyen de 18 à 25% (études UMIH 2024-2025). Sur 1 800 couverts/mois avec un ticket vin moyen passant de 14 EUR à 17 EUR : +5 400 EUR de CA mensuel, soit 64 800 EUR/an de marge brute supplémentaire pour 1 200 EUR de formation initiale. Payback en 7 jours."
  },
  {
    question: "Le tutorat d'un apprenti est-il obligatoirement rémunéré ?",
    answer: "Le maître d'apprentissage doit être désiré et formellement désigné (article L6223-1). Il doit avoir au moins 1 an d'expérience dans le métier ou un diplôme de niveau équivalent ou supérieur à celui préparé par l'apprenti. La fonction tutorale est intégrée dans son temps de travail effectif (pas de rémunération supplémentaire obligatoire en droit), mais beaucoup d'établissements versent une prime mensuelle de 50 à 150 EUR pour valoriser cette mission. L'OPCO finance la formation du maître d'apprentissage : 230 EUR pour une formation tuteur certifiée de 2 jours."
  },
  {
    question: "Faut-il déclarer l'OPCO au moment de l'embauche ?",
    answer: "Non, mais l'employeur cotise automatiquement à l'OPCO Mobilités (anciennement AKTO/FAFIH HCR pour le secteur restauration) via la contribution unique à la formation professionnelle (CUFPA) prélevée par l'URSSAF. Taux 2026 : 0,55% de la masse salariale pour les entreprises de moins de 11 salariés, 1% pour les autres. Les fonds sont disponibles via le portail Akto.fr pour financer des formations sans avance de trésorerie pour les TPE/PME."
  },
  {
    question: "La POEI est-elle intéressante pour un restaurant ?",
    answer: "La Préparation Opérationnelle à l'Emploi Individuelle (POEI) est extrêmement avantageuse : France Travail finance jusqu'à 400 heures de formation pré-embauche d'un candidat demandeur d'emploi, à hauteur de 8 EUR/heure. Le candidat reste indemnisé par France Travail pendant la formation. L'employeur s'engage à embaucher en CDI ou CDD &gt;= 12 mois à l'issue. Cas d'usage en restauration : former un commis débutant (sans CAP) pendant 2-3 mois avant embauche, ou former un reconverti professionnel au métier de serveur. Coût employeur quasi nul, candidat 100% opérationnel à l'embauche."
  },
  {
    question: "Quelles sont les formations obligatoires légalement en restauration ?",
    answer: "Trois formations sont obligatoires en restauration : (1) Formation HACCP - 14h minimum, au moins 1 personne formée en cuisine (décret 2011-731) ; (2) Permis d'exploitation pour le titulaire de la licence IV ou III - 20h initial, 6h recyclage tous les 10 ans (article L3332-1-1) ; (3) Adaptation au poste pour tout nouveau salarié ou changement de procédure (article L6321-1). Recommandées fortement : SST (Sauveteur Secouriste du Travail), 14h ; formation incendie pour les ERP catégorie 5 et supérieur, 4h/an ; formation aux risques chimiques pour les produits de nettoyage et entretien."
  },
  {
    question: "Comment mesurer le ROI d'un plan de formation ?",
    answer: "Trois indicateurs principaux. (1) Réduction du turnover : un salarié formé reste 2,4 fois plus longtemps qu'un non-formé (étude INSEE 2025), chaque départ évité = 14 000 à 22 000 EUR économisés ; (2) Hausse du ticket moyen ou panier : mesurable après formation upselling/sommellerie, +5 à 12% sur 3 mois ; (3) Réduction du food cost : formation portionnement + lutte gaspillage permet 2 à 4 points de gain (sur un restaurant 600k EUR CA, 1 point = 6 000 EUR/an). Outil de pilotage RestauMargin permet de tracker ces KPI en continu et d'attribuer les variations aux actions formation."
  }
];

const breadcrumbItems = [
  { name: "Accueil", url: "https://www.restaumargin.fr/" },
  { name: "Blog", url: "https://www.restaumargin.fr/blog" },
  { name: "Formation personnel restauration", url: "https://www.restaumargin.fr/blog/formation-personnel-restauration" }
];

const howToFormation = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment construire un plan de formation annuel en restauration',
  description: 'Méthode pas à pas pour bâtir un plan de formation financé par OPCO et CPF, conforme aux obligations HCR.',
  totalTime: 'PT4H',
  tool: ['Liste salariés', 'Bulletin OPCO Mobilités', 'Catalogue CFA', 'Outil RestauMargin'],
  step: [
    { '@type': 'HowToStep', name: 'Diagnostiquer les besoins par poste', text: 'Identifier les écarts de compétences via entretiens professionnels obligatoires (article L6315-1 tous les 2 ans). Lister les formations obligatoires en cours de validité (HACCP, permis exploitation, SST).' },
    { '@type': 'HowToStep', name: 'Calculer le budget disponible', text: 'Additionner enveloppe OPCO Mobilités (jusqu\'à 25 EUR/h prise en charge), CPF cumulé des salariés volontaires (500 EUR/an chacun), éventuel reste employeur. Pour un restaurant 8 salariés : budget moyen 11 000-15 000 EUR à 100% financés.' },
    { '@type': 'HowToStep', name: 'Prioriser les formations à fort ROI', text: 'Ordre de priorité : (1) obligatoires HACCP/SST, (2) sommellerie pour serveurs (ROI 35-50x), (3) gestion food cost pour chef, (4) upselling salle, (5) outils digitaux.' },
    { '@type': 'HowToStep', name: 'Établir le calendrier annuel', text: 'Concentrer les formations sur les creux d\'activité (janvier, septembre pour les saisonniers). Éviter les pics estivaux et fin d\'année. Compter 1 formation/salarié/semestre maximum.' },
    { '@type': 'HowToStep', name: 'Faire les demandes de financement OPCO', text: 'Déposer la demande sur Akto.fr au moins 30 jours avant la formation. Joindre : devis CFA, programme détaillé, profil stagiaire, attestation employeur. Réponse OPCO sous 15 jours ouvrés.' },
    { '@type': 'HowToStep', name: 'Mesurer le ROI à 6 mois', text: 'Suivre 3 indicateurs : turnover (taux de départ), ticket moyen (+ou-), food cost (variation points). Lier explicitement les variations aux actions de formation.' }
  ]
};

const howToFormerApprenti = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment former un apprenti en restauration',
  description: 'Procédure complète pour accueillir, former et évaluer un apprenti CAP cuisine ou Bac Pro restauration.',
  totalTime: 'P1Y',
  tool: ['Contrat d\'apprentissage', 'Livret d\'apprentissage', 'Carnet de liaison CFA', 'Fiches techniques'],
  step: [
    { '@type': 'HowToStep', name: 'Désigner un maître d\'apprentissage', text: 'Choisir un salarié expérimenté (1 an minimum dans le métier ou diplôme équivalent). Le déclarer formellement auprès de l\'OPCO. Lui proposer une formation tuteur certifiée (230 EUR financé OPCO).' },
    { '@type': 'HowToStep', name: 'Établir un calendrier pédagogique', text: 'Alternance type CAP cuisine : 2 semaines CFA + 2 semaines entreprise. Bac Pro : 1 semaine CFA + 3 semaines entreprise. Synchroniser avec le calendrier d\'examens et périodes de stages.' },
    { '@type': 'HowToStep', name: 'Définir un parcours de compétences', text: 'Lister les 35-40 compétences à acquérir sur l\'année (techniques de base, hygiène, dressage, commandes...). Répartir entre périodes CFA et périodes entreprise. Cocher mensuellement le livret d\'apprentissage.' },
    { '@type': 'HowToStep', name: 'Réunions mensuelles d\'évaluation', text: 'Entretien individuel mensuel de 30 min : retours du CFA, difficultés, progression, projet. Documenter dans le carnet de liaison signé par l\'apprenti, le tuteur, le formateur.' },
    { '@type': 'HowToStep', name: 'Préparer les examens CAP/Bac Pro', text: 'Identifier les Unités Certificatives Générales (UC1-UC4) et Professionnelles (UP1-UP3). Mettre en situation l\'apprenti sur des CCF (Contrôles en Cours de Formation) en interne avant le passage au CFA.' },
    { '@type': 'HowToStep', name: 'Décider de l\'embauche post-apprentissage', text: 'À 11 mois, évaluer formellement les compétences acquises et la volonté de l\'apprenti de rester. Proposer un CDI au taux niveau 1 échelon 1 ou supérieur selon compétences. Taux de transformation moyen : 64% en HCR.' }
  ]
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Formation du personnel en restauration : obligations, aides et meilleures pratiques 2026',
  description: 'Guide complet 2026 de la formation en restauration : obligations légales, financements OPCO Mobilités et CPF, formations prioritaires, ROI et plan annuel.',
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
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/formation-personnel-restauration' }
};

export default function BlogFormationPersonnel() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Formation du personnel en restauration : obligations, aides et meilleures pratiques 2026"
        description="Financez la formation de vos équipes grâce à l'OPCO Mobilités et au CPF. Formations prioritaires en 2026, obligations légales HACCP, ROI mesuré et plan annuel chiffré."
        path="/blog/formation-personnel-restauration"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToFormation, howToFormerApprenti, articleSchema]}
      />

      {/* Navbar */}
      <PublicHeader />

      {/* Hero */}
      <BlogArticleHero
        category="RH & Paie"
        readTime="14 min"
        date="Mai 2026"
        title="Formation du personnel en restauration : obligations, aides et meilleures pratiques 2026"
        accentWord="formation"
        subtitle="La formation n'est pas un coût mais un investissement qui se rentabilise sur 3 à 12 semaines. OPCO Mobilités, CPF, ROI mesuré, plan annuel chiffré."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Le coût d'un départ en restauration s'élève à 6-8 mois de salaire charge, soit <strong>18 000 à 25 000 EUR pour un commis</strong> selon les études INSEE 2025. Pourtant, 62% des restaurants français ne consacrent aucun budget formel à la formation. Cette équation absurde s'explique par une méconnaissance des dispositifs : OPCO Mobilités, CPF, POEI, AFPR. Les financements existent et couvrent <strong>80 à 100% des coûts</strong>. Ce guide 2026 dresse le mode d'emploi complet avec plan annuel chiffré, ROI mesuré et 12 réponses aux questions fréquentes.
        </p>

        {/* Table des matieres */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#turnover" className="hover:text-teal-600 transition-colors">1. Pourquoi la formation réduit le turnover</a></li>
            <li><a href="#obligations" className="hover:text-teal-600 transition-colors">2. Obligations légales 2026</a></li>
            <li><a href="#financements" className="hover:text-teal-600 transition-colors">3. Financements OPCO Mobilités et CPF</a></li>
            <li><a href="#prioritaires" className="hover:text-teal-600 transition-colors">4. Formations prioritaires en 2026</a></li>
            <li><a href="#roi" className="hover:text-teal-600 transition-colors">5. ROI mesuré : étude de cas chiffrée</a></li>
            <li><a href="#plan" className="hover:text-teal-600 transition-colors">6. Plan de formation annuel type</a></li>
            <li><a href="#onboarding" className="hover:text-teal-600 transition-colors">7. Onboarding : les 30 premiers jours</a></li>
            <li><a href="#apprenti" className="hover:text-teal-600 transition-colors">8. Former un apprenti en restauration</a></li>
            <li><a href="#tuteur" className="hover:text-teal-600 transition-colors">9. Devenir maître d'apprentissage</a></li>
            <li><a href="#kpi" className="hover:text-teal-600 transition-colors">10. KPI à suivre pour mesurer l'impact</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="turnover" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. Pourquoi la formation réduit le turnover</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le turnover en restauration française atteint <strong>65% par an pour le personnel de salle, 45% pour la cuisine</strong>, contre 15% toutes industries confondues (DARES 2025). Chaque départ représente un coût invisible mais bien réel :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Recrutement</strong> : 800 à 2 500 EUR (annonces, intérim, temps RH, frais de sélection)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Onboarding</strong> : 4 à 8 semaines pour atteindre la pleine productivité</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Productivité équipe</strong> : -10 à -20% pendant la transition</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Qualité service</strong> : erreurs commandes, plats rendus, plaintes clients</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Démotivation équipe restante</strong> : risque de démission en chaîne</span></li>
          </ul>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100">
            Coût total moyen d'un départ en restauration : 14 000 à 22 000 EUR
          </div>
          <p className="text-[#374151] leading-relaxed mb-3">
            Études INSEE 2025 : un salarié formé reste <strong>2,4 fois plus longtemps</strong> qu'un non-formé. Un investissement formation de 800 EUR/an/salarié génère en moyenne 3 200 EUR d'économie nette via la réduction du turnover. ROI = 4x minimum.
          </p>
          <p className="text-[#374151] leading-relaxed">
            La corrélation est causale, pas seulement statistique. Trois mécanismes expliquent l'impact de la formation sur la rétention : (1) sentiment de valorisation par l'investissement employeur, (2) montée en compétences qui ouvre des perspectives internes, (3) socialisation avec l'équipe pendant les sessions collectives. Pour aller plus loin sur la maîtrise des coûts RH, voir notre guide <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-600 hover:underline">comment réduire le coût du personnel</Link>.
          </p>
        </section>

        {/* Section 2 */}
        <section id="obligations" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Obligations légales 2026</h2>
          </div>
          <h3 className="text-xl font-bold text-mono-100 mt-4 mb-3">Les 6 obligations impératives</h3>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Adaptation au poste (article L6321-1)</strong> : former obligatoirement à tout nouveau matériel, procédure, logiciel. Sanction : amende inspection du travail 1 500 EUR par salarié non formé.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Entretien professionnel tous les 2 ans (L6315-1)</strong> : faire le point sur les compétences, projets, formations possibles. État des lieux à 6 ans (sanction : abondement automatique CPF de 3 000 EUR par salarié).</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>HACCP (décret 2011-731)</strong> : au moins 1 personne en cuisine doit avoir suivi 14h de formation HACCP certifiée. Coût 200-400 EUR/personne, financé à 100% OPCO. Sanction défaut : 7 500 EUR amende et fermeture administrative possible.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Permis d'exploitation (L3332-1-1)</strong> : pour le titulaire de la licence III ou IV, 20h initial puis 6h recyclage tous les 10 ans. Coût 350 EUR à 600 EUR.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Sécurité incendie (ERP catégorie 5+)</strong> : formation évacuation, exercice annuel, registre de sécurité à jour. Coût 200 EUR/an.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span><strong>Plan de développement des compétences (entreprises &gt; 50 salariés)</strong> : document annuel formalisé, soumis au CSE. Sanction défaut : abondement formation forcé.</span></li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Formations fortement recommandées</h3>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>SST (Sauveteur Secouriste du Travail)</strong> : 14h, 280 EUR. Recommandé 1 SST pour 20 salariés.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Risques chimiques</strong> : pour la manipulation des produits de nettoyage (eau de javel, désinfectants, dégraissants). 4h, 150 EUR.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Allergènes alimentaires (règlement INCO)</strong> : 4h, 120 EUR. Obligatoire affichage allergènes sur carte depuis 2014.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>RGPD et données clients</strong> : 4h, 250 EUR. Important pour les systèmes de fidélité et réservations en ligne.</span></li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="financements" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Euro className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. Financements OPCO Mobilités et CPF</h2>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-4 mb-3">OPCO Mobilités (ex-AKTO/FAFIH HCR)</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            L'OPCO Mobilités est l'organisme paritaire qui collecte et redistribue les contributions formation du secteur HCR. Tous les restaurants y contribuent automatiquement via la CUFPA (Contribution Unique à la Formation Professionnelle et à l'Apprentissage) prélevée par l'URSSAF.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Dispositif</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Public</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Prise en charge 2026</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Plafond</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Plan de développement compétences</td><td className="px-4 py-3">TPE/PME &lt;50</td><td className="px-4 py-3 font-semibold">100%</td><td className="px-4 py-3 font-mono">25 EUR/h</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Plan de développement compétences</td><td className="px-4 py-3">PME 50-249</td><td className="px-4 py-3 font-semibold">60-80%</td><td className="px-4 py-3 font-mono">25 EUR/h</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Apprentissage (forfait)</td><td className="px-4 py-3">Tous</td><td className="px-4 py-3 font-semibold">100%</td><td className="px-4 py-3 font-mono">8 000-12 000 EUR/an</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Contrat de professionnalisation</td><td className="px-4 py-3">Tous</td><td className="px-4 py-3 font-semibold">100%</td><td className="px-4 py-3 font-mono">9,15 EUR/h + 11 EUR tuteur</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Pro-A (reconversion interne)</td><td className="px-4 py-3">Salariés</td><td className="px-4 py-3 font-semibold">100%</td><td className="px-4 py-3 font-mono">10 000 EUR/an</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">CléA (socle compétences)</td><td className="px-4 py-3">Non qualifiés</td><td className="px-4 py-3 font-semibold">100%</td><td className="px-4 py-3 font-mono">Variable</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Démarche pratique</strong> : créer un compte sur Akto.fr, remplir le formulaire de demande de financement, joindre devis CFA + programme + profil stagiaire. Réponse OPCO sous 15 jours ouvrés. Versement direct au CFA (pas d'avance employeur). Astuce : faire la demande dès janvier-février car les enveloppes régionales s'épuisent souvent avant juillet.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">CPF (Compte Personnel de Formation)</h3>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le CPF est un dispositif individuel du salarié, mais l'employeur peut l'utiliser stratégiquement. Alimentation 2026 :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>Salariés qualifiés temps plein</strong> : 500 EUR/an, plafond 5 000 EUR</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>Non qualifiés niveau V infra (sans CAP)</strong> : 800 EUR/an, plafond 8 000 EUR</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>Temps partiel</strong> : proratisé selon temps de travail</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span><strong>Reste à charge salarié</strong> : 102 EUR par formation depuis 2024 (sauf demandeurs d'emploi)</span></li>
          </ul>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Effet de levier stratégique : co-construction CPF + OPCO</p>
            <p className="text-sm text-emerald-600">L'employeur peut <strong>abonder le CPF du salarié</strong> pour orienter vers une formation utile à l'entreprise (sommellerie, anglais, management). Combinaison gagnante : 500 EUR CPF + 500 EUR OPCO + 200 EUR employeur = 1 200 EUR de valeur formation pour 200 EUR de coût net employeur.</p>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">France Travail : POEI, AFPR, AIF</h3>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>POEI (Préparation Opérationnelle à l'Emploi Individuelle)</strong> : pré-embauche, 8 EUR/h, jusqu'à 400h financé par France Travail. Engagement employeur : embauche CDI ou CDD &gt;= 12 mois.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>AFPR (Action de Formation Préalable au Recrutement)</strong> : variante pour CDD entre 6 et 12 mois.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>AIF (Aide Individuelle à la Formation)</strong> : reliquat financé France Travail pour les demandeurs d'emploi dont le CPF ne couvre pas intégralement.</span></li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="prioritaires" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Formations prioritaires en 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Les 10 formations à fort ROI à intégrer dans tout plan annuel de restaurant en 2026 :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Formation</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Durée</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Coût brut</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">OPCO</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">ROI cible</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-3 py-3"><strong>HACCP</strong> (obligatoire)</td><td className="px-3 py-3">14h</td><td className="px-3 py-3 font-mono">200-400 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">Évite TIAC (-18 500 EUR risque)</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3"><strong>Sommellerie</strong> WSET niveau 2</td><td className="px-3 py-3">5 j</td><td className="px-3 py-3 font-mono">1 200 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">+18-25% ticket vin</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3"><strong>Gestion food cost</strong> chef</td><td className="px-3 py-3">3 j</td><td className="px-3 py-3 font-mono">1 500 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">+3-5 pts marge brute</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3"><strong>Upselling et accueil</strong> salle</td><td className="px-3 py-3">2 j</td><td className="px-3 py-3 font-mono">800 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">+5-12% ticket moyen</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3"><strong>Anglais professionnel</strong> serveurs</td><td className="px-3 py-3">40h</td><td className="px-3 py-3 font-mono">1 200 EUR</td><td className="px-3 py-3 font-semibold">CPF</td><td className="px-3 py-3">+12% touristes anglophones</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3"><strong>Management d'équipe</strong></td><td className="px-3 py-3">3 j</td><td className="px-3 py-3 font-mono">1 800 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">-25% turnover sous chef formé</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3"><strong>Outils digitaux</strong> et caisse</td><td className="px-3 py-3">1 j</td><td className="px-3 py-3 font-mono">500 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">3-5h/sem économisées</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3"><strong>Hygiène avancée</strong> et HACCP+</td><td className="px-3 py-3">1 j</td><td className="px-3 py-3 font-mono">400 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">Réduit risque contrôle</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3"><strong>SST</strong> (Sauveteur Secouriste)</td><td className="px-3 py-3">14h</td><td className="px-3 py-3 font-mono">280 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">Conformité ERP</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3"><strong>Permis exploitation</strong> recyclage</td><td className="px-3 py-3">6h</td><td className="px-3 py-3 font-mono">350 EUR</td><td className="px-3 py-3 font-semibold">100%</td><td className="px-3 py-3">Maintien licence IV</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 */}
        <section id="roi" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Euro className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. ROI mesuré : étude de cas chiffrée</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Cas concret : <strong>brasserie 60 couverts, CA HT 580 000 EUR, équipe 8 salariés</strong>. Plan formation 2026 déployé :
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-xs text-mono-100 space-y-1">
            <div>HACCP recyclage chef + sous-chef : 700 EUR &rarr; 100% pris en charge OPCO</div>
            <div>Sommellerie 2 serveurs (WSET niveau 2) : 1 800 EUR &rarr; 100% OPCO</div>
            <div>Food cost et gestion économique chef : 1 200 EUR &rarr; 100% OPCO</div>
            <div>Upselling et techniques de vente 3 serveurs : 2 100 EUR &rarr; 100% OPCO</div>
            <div>Caisse et outils digitaux manager : 400 EUR &rarr; 100% OPCO</div>
            <div>Anglais professionnel 4 personnes (CPF + abondement) : 4 800 EUR &rarr; 3 200 EUR CPF + 1 600 EUR reste</div>
            <div className="pt-2 font-bold border-t border-mono-900">Total brut : 11 000 EUR | Reste à charge employeur : 1 600 EUR</div>
          </div>

          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-emerald-700 mb-2">Bénéfices mesurés sur 12 mois</p>
            <ul className="text-sm text-emerald-600 space-y-1">
              <li>&bull; Turnover passe de 4 à 2 départs/an &rarr; <strong>28 000 EUR économisés</strong> (recrutement + onboarding évité)</li>
              <li>&bull; Ticket vin moyen +1,80 EUR x 18 000 couverts/an &rarr; <strong>+32 400 EUR CA</strong> (marge brute 75%)</li>
              <li>&bull; Food cost -2 points sur 174 000 EUR cost &rarr; <strong>+3 480 EUR de marge</strong></li>
              <li>&bull; Hausse panier moyen via upselling +0,90 EUR x 18 000 &rarr; <strong>+16 200 EUR CA</strong></li>
              <li>&bull; Réduction gaspillage HACCP/portionnement &rarr; <strong>+2 800 EUR de marge</strong></li>
            </ul>
            <p className="text-sm font-bold text-emerald-700 mt-3 pt-3 border-t border-emerald-300">
              Total bénéfices estimés : 82 880 EUR | Coût net : 1 600 EUR | ROI : 51x | Payback : 12 jours
            </p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Cette étude reproduit fidèlement le retour d'un restaurant client suivi sur 18 mois. Les chiffres sont conservateurs : la moyenne sectorielle est <strong>ROI 35-45x</strong> sur les plans de formation correctement structurés.
          </p>
        </section>

        {/* Section 6 */}
        <section id="plan" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Plan de formation annuel type</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Voici un calendrier type pour un restaurant 6-10 salariés, optimisé pour les périodes creuses :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Action</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cible</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">Janvier</td><td className="px-4 py-3">Entretiens professionnels (tous les 2 ans), dépôt OPCO</td><td className="px-4 py-3">100% équipe</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">Février</td><td className="px-4 py-3">HACCP recyclage (creux d'hiver, 5 ans)</td><td className="px-4 py-3">2-3 personnes cuisine</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">Mars</td><td className="px-4 py-3">Sommellerie / accord mets-vins</td><td className="px-4 py-3">Tous les serveurs</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">Avril</td><td className="px-4 py-3">Outils digitaux et caisse</td><td className="px-4 py-3">Manager + 2 serveurs</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">Mai</td><td className="px-4 py-3">Gestion food cost</td><td className="px-4 py-3">Chef + second</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">Juin-Août</td><td className="px-4 py-3">PAUSE - peak season - pas de formation</td><td className="px-4 py-3">-</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">Septembre</td><td className="px-4 py-3">Upselling et techniques de vente salle</td><td className="px-4 py-3">Tous les serveurs</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">Octobre</td><td className="px-4 py-3">Management d'équipe</td><td className="px-4 py-3">Chef, manager, sous-chef</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">Novembre</td><td className="px-4 py-3">Anglais professionnel (CPF)</td><td className="px-4 py-3">Volontaires</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">Décembre</td><td className="px-4 py-3">Bilan annuel + entretiens annuels</td><td className="px-4 py-3">100% équipe</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Volume cumulé sur l'année : <strong>120-150 heures de formation</strong> pour un restaurant 8 salariés. Budget brut 8 000-12 000 EUR. Reste à charge employeur après OPCO+CPF : 0 à 1 800 EUR maximum.
          </p>
        </section>

        {/* Section 7 */}
        <section id="onboarding" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">7. Onboarding : les 30 premiers jours</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Étude Cornell 2024 : un onboarding structure <strong>multiplie par 2,5 la rétention à 1 an</strong>. C'est le moment où le salarié décide consciemment ou inconsciemment s'il restera. Programme type :
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Jour 1 - Accueil</strong> : visite des locaux, remise livret accueil + fiche poste, présentation équipe, démonstration matériel, repas d'intégration avec l'équipe.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Semaine 1 - Immersion</strong> : shadowing par un référent expérimenté, dégustation systématique de tous les plats de la carte, HACCP express, premiers gestes encadrés.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Semaine 2 - Autonomie supervisée</strong> : prise en charge progressive du poste, feedback quotidien de 5 min en fin de service, identification des points forts et axes de progrès.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Semaine 3 - Intégration</strong> : service complet en autonomie, premier mini-objectif (vente d'un plat spécifique, gestion de table prioritaire).</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>Semaine 4 - Validation</strong> : bilan formel d'1h avec manager + chef, plan progression 3 mois établi, décision sur fin de période d'essai.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Coût d'un onboarding structure : <strong>200-400 EUR</strong> (temps référent + outils + repas d'intégration). Économie potentielle si évite un départ précoce : <strong>14 000-22 000 EUR</strong>. ROI supérieur à 50x.
          </p>
        </section>

        {/* Section 8 */}
        <section id="apprenti" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">8. Former un apprenti en restauration</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            L'apprentissage est <strong>le contrat le plus rentable</strong> de la restauration (voir notre <Link to="/blog/contrat-travail-restauration-guide" className="text-teal-600 hover:underline">guide complet des contrats de travail</Link>). Pour réussir l'intégration et la transformation en CDI :
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span><strong>Désigner un maître d'apprentissage formellement</strong> : salarié expérimenté (1 an mini métier ou diplôme équivalent), volontaire, declarable à l'OPCO.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span><strong>Synchroniser avec le CFA</strong> : recevoir le calendrier d'alternance, le programme de formation, les dates d'examens CCF.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span><strong>Établir un parcours de compétences</strong> : 35-40 compétences à acquérir sur l'année, répartition CFA / entreprise, validation mensuelle.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span><strong>Réunions mensuelles</strong> d'évaluation : 30 min avec apprenti pour faire le point, documenter le livret apprentissage.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span><strong>Préparer les examens</strong> avec mises en situation internes (CCF). Taux de réussite moyen CAP cuisine : 84% (vs 92% pour les apprentis tutoré activement).</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" /><span><strong>Décider de l'embauche post-apprentissage</strong> à 11 mois : proposer un CDI niveau 1 ou 2 selon compétences. Taux de transformation moyen HCR : 64%.</span></li>
          </ul>
        </section>

        {/* Section 9 */}
        <section id="tuteur" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">9. Devenir maître d'apprentissage</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le maître d'apprentissage joue un rôle pivot. Pour réussir cette mission, une <strong>formation tuteur certifiée de 2 jours</strong> est très recommandée (financement OPCO 230 EUR, gratuit pour l'entreprise). Programme type :
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span>Posture pédagogique et techniques d'apprentissage adulte</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span>Construction d'un parcours de compétences par poste</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span>Techniques de feedback constructif et évaluation</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span>Gestion de la motivation et reconnaissance</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span>Communication avec le CFA et les parents</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span>Gestion de conflits et difficultés (absentéisme, décrochage)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Reconnaissance financière recommandée : prime mensuelle 50-150 EUR au maître d'apprentissage pour valoriser la mission. Non obligatoire mais facteur de motivation important.
          </p>
        </section>

        {/* Section 10 */}
        <section id="kpi" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">10. KPI à suivre pour mesurer l'impact</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Sans mesure, pas de pilotage. Les 6 KPI à tracker chaque trimestre pour évaluer le ROI de la formation :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">KPI</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Formule</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Objectif HCR</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Turnover annuel</td><td className="px-4 py-3 font-mono">Départs / effectif moyen</td><td className="px-4 py-3 font-semibold">&lt; 35%</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Ancienneté moyenne</td><td className="px-4 py-3 font-mono">Somme anciennetés / effectif</td><td className="px-4 py-3 font-semibold">&gt; 2,5 ans</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Ticket moyen</td><td className="px-4 py-3 font-mono">CA HT / nb couverts</td><td className="px-4 py-3 font-semibold">Hausse +3%/an</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Food cost %</td><td className="px-4 py-3 font-mono">Cost / CA HT</td><td className="px-4 py-3 font-semibold">28-32%</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Heures formation/salarié</td><td className="px-4 py-3 font-mono">Total heures / effectif</td><td className="px-4 py-3 font-semibold">&gt; 21h/an</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Taux conversion apprenti</td><td className="px-4 py-3 font-mono">CDI signés / apprentis sortis</td><td className="px-4 py-3 font-semibold">&gt; 60%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Un outil comme <Link to="/login" className="text-teal-600 hover:underline">RestauMargin</Link> automatise le suivi de ces KPI et attribue les variations aux actions menées. Pour aller plus loin sur la maîtrise économique globale, voir notre guide du <Link to="/blog/calcul-marge-restaurant" className="text-teal-600 hover:underline">calcul de marge restaurant</Link> et le <Link to="/blog/prime-cost-restaurant" className="text-teal-600 hover:underline">pilotage du prime cost</Link>.
          </p>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="14 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et références officielles</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>Code du travail, articles L6321-1 à L6325-1 (formation professionnelle)</li>
            <li>Convention Collective Nationale HCR (IDCC 1979), volet formation</li>
            <li>OPCO Mobilités (Akto.fr), barèmes 2026 de prise en charge HCR</li>
            <li>Décret 2011-731 du 24 juin 2011 (obligation HACCP en restauration)</li>
            <li>Article L3332-1-1 du Code de la santé publique (permis d'exploitation)</li>
            <li>Études INSEE 2025 sur le turnover et la formation par secteur</li>
            <li>Étude Cornell University 2024 sur l'onboarding et la rétention</li>
            <li>Règlement INCO 1169/2011 (information allergènes consommateurs)</li>
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Donnez les bons outils à vos équipes</h2>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed max-w-xl mx-auto">
            RestauMargin équipe vos chefs et managers d'un dashboard simple pour piloter food cost, marges, stocks, ROI formation et KPI RH au quotidien.
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
            <Link to="/blog/charges-sociales-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Charges sociales restauration 2026</p>
              <p className="text-sm text-mono-400">Taux URSSAF, réduction Fillon, fiche de paie, exonérations apprentis.</p>
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
          <Link to="/blog/strategie-digitale-restaurant" className="text-sm text-teal-600 hover:underline">Stratégie digitale &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
