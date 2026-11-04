import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, FileText, Users, Clock, GraduationCap, Calendar, Calculator, Scale, AlertTriangle, Briefcase, Shield, BookOpen, TrendingUp } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026"
   Mots-cles cibles : contrat travail restaurant, CDI CDD extra HCR, convention collective HCR 1979
   ~3 200 mots — EAT, FAQ x12, HowTo, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on embaucher en CDD pour ouvrir un nouveau restaurant ?",
    answer: "Non. L'ouverture d'un restaurant est une activité durable et pérenne : les postes doivent être pourvus en CDI dès le départ. Le recours au CDD n'est légalement possible que dans 5 cas limitatifs (remplacement, accroissement temporaire d'activité, emplois saisonniers, contrat d'usage HCR, contrat à objet défini). Un CDD requalifié pour ouverture coûte en moyenne 4 à 6 mois de salaire brut en dommages prud'homaux, plus 10% d'indemnité de précarité + indemnité de requalification d'1 mois minimum (article L1245-2 du Code du travail)."
  },
  {
    question: "Combien d'heures supplémentaires peut-on faire en HCR ?",
    answer: "Le contingent annuel d'heures supplémentaires en convention collective HCR (IDCC 1979) est de 360 heures par salarié et par an, contre 220h dans le régime général. Au-delà de ce contingent, le repos compensateur obligatoire (RCR) s'applique : 50% des heures excédant le contingent dans les entreprises de 20 salariés et moins, 100% au-delà. Les heures supplémentaires sont majorées à 10% (36e à 39e heure), 20% (40e à 43e heure) et 50% (au-delà de 43h/semaine)."
  },
  {
    question: "Faut-il un contrat écrit pour un extra d'un seul service ?",
    answer: "Oui, impérativement. Tout CDD, y compris un extra de 4h pour un banquet, doit faire l'objet d'un contrat écrit signé au plus tard dans les 48 heures suivant l'embauche (article L1242-13 du Code du travail). À défaut d'écrit dans ce délai, le contrat est réputé conclu pour une durée indéterminée. La sanction est lourde : requalification automatique en CDI + indemnité minimum d'1 mois de salaire (L1245-2) + 10% d'indemnité de précarité + arriérés URSSAF sur 3 ans."
  },
  {
    question: "Le pourboire entre-t-il dans le salaire ?",
    answer: "Non, en convention HCR les pourboires ne peuvent jamais se substituer au salaire minimum conventionnel. Ils s'ajoutent obligatoirement. Si le restaurant centralise les pourboires (caisse commune, TPE pourboires, répartition équitable), il doit les redistribuer intégralement aux salariés et les déclarer. Les pourboires volontaires (laissés directement par le client au serveur) sont exonérés de cotisations sociales jusqu'au 31/12/2026 pour les salariés rémunérés jusqu'à 1,6 SMIC."
  },
  {
    question: "Peut-on imposer 2 jours de repos non consécutifs ?",
    answer: "Non. La convention collective HCR (article 21.1) impose 2 jours de repos hebdomadaire dont au moins 1,5 jour consécutif. Pour les entreprises ouvertes 7j/7, l'organisation classique est 1 jour fermé (lundi ou mardi) + une demi-journée supplémentaire fixe ou tournante. Un repos hebdomadaire fractionné en 2 jours isolés constitue une infraction passible d'une amende de 1 500 EUR par salarié et par infraction (article R3174-1)."
  },
  {
    question: "Quelle est la durée légale du travail en restauration ?",
    answer: "La durée conventionnelle de référence en HCR est de 39 heures par semaine (et non 35h comme dans le régime général), avec 4 heures supplémentaires structurelles majorées à 10%. La durée maximale quotidienne est de 11h30 (12h pour le personnel de cuisine), la durée hebdomadaire absolue de 48h sur une semaine et 46h en moyenne sur 12 semaines. La durée minimum de repos quotidien est de 11 heures consécutives."
  },
  {
    question: "Quel est le SMIC HCR en 2026 ?",
    answer: "Le SMIC horaire brut en 2026 est de 11,88 EUR, soit 1 801,80 EUR brut/mois pour 35h ou 2 008,12 EUR brut/mois pour 39h (base HCR avec 4h sup majorées à 10%). La grille conventionnelle HCR prévoit 5 niveaux x 3 échelons : Niveau 1 échelon 1 (commis, plonge) démarre au SMIC ; Niveau 5 échelon 3 (chef exécutif) atteint environ 3 500 EUR brut/mois selon les avenants régionaux."
  },
  {
    question: "Combien coûte un apprenti par mois en restaurant ?",
    answer: "Un apprenti de 18-20 ans en 1ère année perçoit 43% du SMIC, soit environ 795 EUR/mois brut. Les charges patronales sont quasi nulles grâce aux exonérations spécifiques apprentissage (Sécu, retraite, chômage). Le coût employeur réel s'élève à environ 830 EUR/mois, auxquels il faut déduire l'aide unique de 6 000 EUR la 1ère année versée par l'État. Sur 12 mois, le coût net d'un apprenti CAP cuisine 1ère année tourne autour de 4 000 EUR, soit l'embauche la plus rentable du secteur."
  },
  {
    question: "Combien coûte une rupture conventionnelle en restaurant ?",
    answer: "L'indemnité minimale de rupture conventionnelle est identique à l'indemnité légale de licenciement : 25% du salaire brut mensuel moyen par année d'ancienneté jusqu'à 10 ans, puis 33,33% au-delà. Pour un employé avec 3 ans d'ancienneté à 2 000 EUR brut/mois : 1 500 EUR minimum. Avantage : exonéré de charges sociales (sauf CSG/CRDS) jusqu'à 2 PASS (94 200 EUR en 2026), versement chômage immédiat sans délai de carence, pas de risque prud'homal contrairement au licenciement."
  },
  {
    question: "Peut-on rompre la période d'essai sans motif ?",
    answer: "Oui, la période d'essai peut être rompue librement par l'employeur ou le salarié, sans motif à fournir. Cependant, un délai de prévenance est obligatoire selon l'ancienneté du salarié : 24h si moins de 8 jours, 48h entre 8 jours et 1 mois, 2 semaines après 1 mois, 1 mois après 3 mois. Durée maximale d'essai en HCR : employés 2 mois renouvelables (4 mois max), agents de maîtrise 6 mois, cadres 8 mois. Le renouvellement doit être prévu au contrat et accepté par écrit."
  },
  {
    question: "Un saisonnier a-t-il droit à une prime de précarité ?",
    answer: "Non. Le contrat saisonnier (article L1242-2 3°) et le contrat d'usage HCR (extra) sont les deux seuls CDD exonérés de l'indemnité de fin de contrat de 10%. En contrepartie, le saisonnier qui revient pour la 2ème année consécutive bénéficie d'une clause de reconduction prioritaire (article L1244-2 issu de la loi Travail 2017). Après 3 saisons consécutives, le droit prioritaire de réembauche devient quasi-systématique."
  },
  {
    question: "Le contrat d'extra peut-il être utilisé sans limite ?",
    answer: "Non. Le contrat d'usage HCR (extra) est strictement encadré par les conventions collectives nationales. Conditions cumulatives : (1) emploi temporaire d'usage constant figurant sur la liste limitative HCR ; (2) durée maximale 2 mois cumulés par mission ; (3) pas d'usage continu sur un même poste pour éviter la requalification. L'URSSAF requalifie en CDI tout extra utilisé plus de 30 jours/an chez le même employeur sans justification objective d'usage temporaire."
  }
];

const breadcrumbItems = [
  { name: "Accueil", url: "https://www.restaumargin.fr/" },
  { name: "Blog", url: "https://www.restaumargin.fr/blog" },
  { name: "Contrat de travail restauration", url: "https://www.restaumargin.fr/blog/contrat-travail-restauration-guide" }
];

const howToEmbaucher = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment embaucher un salarié en restauration en 7 étapes',
  description: 'Procédure complète et conforme pour embaucher en CDI, CDD ou extra en convention HCR.',
  totalTime: 'PT2H',
  tool: ['Document d\'identité salarié', 'RIB', 'Contrat de travail HCR', 'Logiciel paie'],
  step: [
    { '@type': 'HowToStep', name: 'Choisir le bon type de contrat', text: 'CDI pour poste pérenne, CDD pour remplacement ou surcroît, extra (CDD usage HCR) pour mission de quelques jours, saisonnier pour activité cyclique. Le mauvais choix coûte en moyenne 4-6 mois de salaire en requalification.' },
    { '@type': 'HowToStep', name: 'Établir la DPAE 8 jours avant', text: 'Déclaration Préalable à l\'Embauche obligatoire sur net-entreprises.fr ou via DSN. À faire au plus tôt 8 jours avant l\'embauche, au plus tard avant le début effectif. Sanction : 1 500 EUR par DPAE manquante.' },
    { '@type': 'HowToStep', name: 'Rédiger le contrat écrit', text: 'CDI : recommandé mais non obligatoire sauf temps partiel. CDD/extra : écrit obligatoire signé sous 48h. Mentions impératives : identité, poste, CCN HCR (IDCC 1979), salaire brut, durée, période d\'essai, lieu, horaires.' },
    { '@type': 'HowToStep', name: 'Vérifier l\'aptitude médicale', text: 'Visite d\'information et de prévention (VIP) dans les 3 mois suivant l\'embauche (Service de Prévention et de Santé au Travail). Sanction inspection du travail : 1 500 EUR par salarié non visité.' },
    { '@type': 'HowToStep', name: 'Affilier à la mutuelle HCR', text: 'Mutuelle obligatoire (HCR Prévoyance ou équivalent), employeur prend en charge au minimum 50% de la cotisation. Affiliation sous 30 jours suivant l\'embauche.' },
    { '@type': 'HowToStep', name: 'Remettre les documents obligatoires', text: 'Contrat signé, fiche de poste, livret d\'accueil, règlement intérieur (si >20 salariés), grille horaire, conventions collectives consultables, mentions DUERP.' },
    { '@type': 'HowToStep', name: 'Déclarer dans le registre du personnel', text: 'Inscription obligatoire dans le registre unique du personnel (nom, prénom, nationalité, date entrée, qualification, type contrat). Doit être tenu à jour en permanence sur le lieu de travail.' }
  ]
};

const howToCoutEmploye = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment calculer le coût total d\'un employé en restauration',
  description: 'Méthode pas à pas pour passer du salaire brut au coût total employeur, charges incluses.',
  totalTime: 'PT20M',
  tool: ['Bulletin de paie', 'Calculatrice', 'Logiciel RestauMargin'],
  step: [
    { '@type': 'HowToStep', name: 'Partir du salaire brut', text: 'Le brut affiché au contrat. Exemple : 2 008 EUR pour 39h niveau 2 échelon 1 HCR 2026.' },
    { '@type': 'HowToStep', name: 'Ajouter les avantages en nature', text: 'Repas (2 x 4,22 EUR x 22 jours = 185,68 EUR/mois), éventuellement logement saisonnier. À intégrer au brut pour calcul cotisations.' },
    { '@type': 'HowToStep', name: 'Calculer les charges patronales brutes', text: 'Environ 42-45% du brut total. Sur 2 193,68 EUR de base : ~920 EUR de cotisations.' },
    { '@type': 'HowToStep', name: 'Déduire la réduction Fillon', text: 'Réduction générale des cotisations patronales (T = 0,3194 entreprises <50 salariés). Au SMIC : ~540 EUR/mois déduits.' },
    { '@type': 'HowToStep', name: 'Ajouter mutuelle et médecine du travail', text: 'Part employeur mutuelle ~30-40 EUR/mois, cotisation SPST ~7 EUR/mois.' },
    { '@type': 'HowToStep', name: 'Obtenir le coût total mensuel', text: 'Brut + charges nettes + mutuelle + médecine + repas. Au SMIC HCR : ~2 460 EUR. Multiplier par 12,5 (avec CP) pour coût annuel.' }
  ]
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026',
  description: 'Guide complet 2026 des contrats en restauration : CDI, CDD, extras HCR, apprentissage, saisonnier. Coûts employeur réels, mentions obligatoires, convention HCR, risques URSSAF.',
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' }
  },
  datePublished: '2026-05-05',
  dateModified: '2026-05-26',
  wordCount: 3200,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/contrat-travail-restauration-guide' }
};

export default function BlogContratTravail() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026"
        description="Tous les contrats de travail en restauration : CDI, CDD, extras HCR, apprentissage, saisonnier. Coût employeur réel, mentions obligatoires, convention collective HCR (IDCC 1979), risques URSSAF et prud'homaux."
        path="/blog/contrat-travail-restauration-guide"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToEmbaucher, howToCoutEmploye, articleSchema]}
      />

      <PublicHeader />

      <BlogArticleHero
        category="RH & Paie"
        readTime="15 min"
        date="Mai 2026"
        title="Contrat de travail en restauration : CDI, CDD, extras, apprentissage"
        accentWord="contrat"
        subtitle="Le secteur HCR est l'un des plus contrôlés en France pour le droit du travail. Mode d'emploi 2026 avec coûts employeur réels, risques URSSAF et exemples chiffrés."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          URSSAF, inspection du travail, prud'hommes pleuvent dès qu'un contrat est mal rédigé en restauration. Le secteur HCR (Hôtels, Cafés, Restaurants) concentre <strong>18 % des contrôles URSSAF nationaux pour seulement 4 % de la masse salariale française</strong>. Redressement moyen en 2025 : <strong>23 400 EUR par établissement contrôlé</strong>. Ce guide dresse l'état des lieux 2026 des 6 contrats utilisables, avec coûts employeur réels, mentions obligatoires, risques juridiques et cas d'usage concrets.
        </p>

        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#ccn-hcr" className="hover:text-teal-600 transition-colors">1. La convention collective HCR : socle obligatoire</a></li>
            <li><a href="#cdi" className="hover:text-teal-600 transition-colors">2. Le CDI : référence pour les postes pérennes</a></li>
            <li><a href="#cdd" className="hover:text-teal-600 transition-colors">3. Le CDD : à utiliser avec précaution</a></li>
            <li><a href="#extra" className="hover:text-teal-600 transition-colors">4. Le contrat d'extra (CDD d'usage HCR)</a></li>
            <li><a href="#apprentissage" className="hover:text-teal-600 transition-colors">5. L'apprentissage : levier sous-utilisé</a></li>
            <li><a href="#saisonnier" className="hover:text-teal-600 transition-colors">6. Le contrat saisonnier</a></li>
            <li><a href="#comparatif" className="hover:text-teal-600 transition-colors">7. Tableau comparatif des 6 contrats</a></li>
            <li><a href="#cout-employeur" className="hover:text-teal-600 transition-colors">8. Coût employeur réel : du brut au total</a></li>
            <li><a href="#risques" className="hover:text-teal-600 transition-colors">9. Risques URSSAF et prud'homaux</a></li>
            <li><a href="#cas-pratique" className="hover:text-teal-600 transition-colors">10. Cas pratique : restaurant 8 salariés</a></li>
          </ol>
        </nav>

        <Section icon={<FileText className="w-5 h-5" />} number="1" title="La convention collective HCR : socle obligatoire" id="ccn-hcr">
          <p>Tout contrat dans la restauration commerciale est impérativement régi par la <strong>convention collective nationale HCR (IDCC 1979)</strong>, étendue par arrêté du 3 décembre 1997. Elle s'applique à tous les établissements dont l'activité principale relève des codes NAF 5610A (restauration traditionnelle), 5610B (cafétérias et libres-services), 5610C (restauration de type rapide), 5630Z (débits de boissons) et 5510Z (hôtellerie).</p>
          <p>Les <strong>10 points clés</strong> de la convention HCR 2026 :</p>
          <ul>
            <li><strong>Grille salariale</strong> : 5 niveaux x 3 échelons, du commis (Niveau 1) au directeur (Niveau 5). Salaires minima conventionnels revalorisés chaque année, généralement en janvier.</li>
            <li><strong>Indemnité nourriture</strong> : 4,22 EUR par repas du en 2026 (soit 8,44 EUR/jour pour 2 repas, ~185 EUR/mois pour 22 jours travaillés).</li>
            <li><strong>Durée du travail</strong> : 39h/semaine référence HCR (et non 35h), avec 4h supplémentaires structurelles majorées à 10%.</li>
            <li><strong>Heures supplémentaires</strong> : 10% (36e-39e), 20% (40e-43e), 50% (au-delà). Contingent annuel 360h (vs 220h régime général).</li>
            <li><strong>Travail de nuit (22h-7h)</strong> : majoration 30% du salaire horaire de base.</li>
            <li><strong>Repos hebdomadaire</strong> : 2 jours/semaine dont 1,5 jour consécutif minimum (article 21.1).</li>
            <li><strong>Préavis CDI</strong> : 1 mois employés, 2 mois agents de maîtrise et cadres.</li>
            <li><strong>Mutuelle obligatoire</strong> : depuis 2016, prise en charge employeur minimum 50% (HCR Prévoyance).</li>
            <li><strong>Prévoyance</strong> : 0,38% du brut pour la garantie décès/invalidité (article 26).</li>
            <li><strong>Formation</strong> : entretien professionnel obligatoire tous les 2 ans, bilan à 6 ans (sanction 3 000 EUR abondement CPF si manquement).</li>
          </ul>
          <p>Pour piloter ces obligations finement, voir notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-600 hover:underline">guide du calcul de marge restaurant</Link> qui intègre les charges RH dans le calcul du prime cost.</p>
        </Section>

        <Section icon={<Users className="w-5 h-5" />} number="2" title="Le CDI : référence pour les postes pérennes" id="cdi">
          <p>Le CDI (Contrat à Durée Indéterminée) est la <strong>forme normale et générale du contrat de travail</strong> en France (article L1221-2 du Code du travail). En HCR, il doit être privilégié pour tous les postes durables : cuisinier titulaire, second de cuisine, chef de partie, serveur permanent, responsable de salle, manager, plongeur attitré.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Mentions obligatoires du CDI HCR</h3>
          <ul>
            <li>Identité des parties (nom, adresse, numéro SIRET employeur)</li>
            <li>Date d'embauche et date de prise effective des fonctions</li>
            <li>Lieu de travail (établissement principal et mobilité éventuelle)</li>
            <li>Référence à la <strong>CCN HCR (IDCC 1979)</strong></li>
            <li>Intitulé du poste, classification (niveau + échelon), qualification</li>
            <li>Salaire brut mensuel ou horaire</li>
            <li>Durée du travail (39h standard HCR, 35h si choix entreprise)</li>
            <li>Période d'essai et conditions de renouvellement</li>
            <li>Modalités de rupture (préavis, indemnités)</li>
            <li>Affiliation mutuelle et prévoyance HCR</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Période d'essai HCR 2026</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Statut</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Durée initiale</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Renouvellement</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Maximum total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Employés (serveurs, commis, plongeurs)</td><td className="px-4 py-3">2 mois</td><td className="px-4 py-3">1 fois</td><td className="px-4 py-3 font-semibold">4 mois</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Agents de maîtrise (chef de rang, chef de partie)</td><td className="px-4 py-3">3 mois</td><td className="px-4 py-3">1 fois</td><td className="px-4 py-3 font-semibold">6 mois</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Cadres (chef exécutif, directeur)</td><td className="px-4 py-3">4 mois</td><td className="px-4 py-3">1 fois</td><td className="px-4 py-3 font-semibold">8 mois</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">Le renouvellement doit être <strong>prévu au contrat initial</strong> ET <strong>accepté par écrit</strong> par le salarié avant l'expiration de la période initiale. À défaut, le CDI est définitivement acquis.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Rupture du CDI : 5 modes possibles</h3>
          <ul>
            <li><strong>Démission</strong> du salarié : préavis 1-2 mois selon classification</li>
            <li><strong>Licenciement</strong> économique ou pour motif personnel : procédure stricte, indemnité légale (25% brut/an jusqu'à 10 ans)</li>
            <li><strong>Rupture conventionnelle</strong> : négociée, exonérée de charges jusqu'à 2 PASS, chômage immédiat</li>
            <li><strong>Retraite</strong> : départ volontaire ou mise à la retraite (à 67 ans)</li>
            <li><strong>Prise d'acte</strong> ou <strong>résiliation judiciaire</strong> : initiative salariale, équivaut à licenciement sans cause</li>
          </ul>
        </Section>

        <Section icon={<Clock className="w-5 h-5" />} number="3" title="Le CDD : à utiliser avec précaution" id="cdd">
          <p>Le CDD (Contrat à Durée Déterminée) ne peut être utilisé que dans <strong>5 cas légalement limitatifs</strong> (article L1242-2 du Code du travail) :</p>
          <ol>
            <li>Remplacement d'un salarié absent (maladie, congé parental, formation longue)</li>
            <li>Accroissement temporaire d'activité (saison touristique, événement ponctuel)</li>
            <li>Emplois saisonniers ou contrats d'usage HCR (extras)</li>
            <li>Contrat à objet défini (cadres uniquement, 18-36 mois)</li>
            <li>Contrat d'insertion ou de retour à l'emploi (CUI, PEC)</li>
          </ol>
          <p>En dehors de ces cas, tout CDD est présumé être un CDI (article L1245-1).</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Risque majeur : la requalification en CDI</h3>
          <p>Quand un CDD est mal motivé, mal rédigé ou utilisé hors des cas légaux, le Conseil de prud'hommes le <strong>requalifie en CDI</strong>. Coût moyen pour l'employeur :</p>
          <ul>
            <li>Indemnité de requalification : <strong>1 mois de salaire brut minimum</strong> (article L1245-2)</li>
            <li>Indemnité de fin de contrat (précarité) : <strong>10% du salaire brut total perçu</strong></li>
            <li>Indemnité de licenciement sans cause réelle et sérieuse : <strong>3 à 6 mois de salaire</strong> (barème Macron)</li>
            <li>Arriérés URSSAF sur 3 ans : <strong>régularisation des charges sur la totalité de la relation</strong></li>
            <li>Rappels de salaires (ancienneté, primes conventionnelles)</li>
          </ul>
          <p>Coût total moyen pour un CDD requalifié après 8 mois à 2 000 EUR brut : <strong>environ 12 000 à 18 000 EUR</strong>.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Indemnité de précarité : 10% du brut</h3>
          <p>À la fin du CDD, l'employeur doit verser une indemnité de précarité égale à <strong>10% du salaire brut total versé</strong> pendant le contrat (article L1243-8). Exceptions où elle n'est PAS due :</p>
          <ul>
            <li>CDD saisonnier (saison touristique, montagne, plage)</li>
            <li>Contrat d'usage HCR (extra)</li>
            <li>Refus par le salarié d'un CDI proposé pour le même poste</li>
            <li>Rupture du fait du salarié ou pour faute grave</li>
            <li>Contrats d'insertion (CUI, PEC, contrat de professionnalisation)</li>
          </ul>
        </Section>

        <Section icon={<Calendar className="w-5 h-5" />} number="4" title="Le contrat d'extra (CDD d'usage)" id="extra">
          <p>Le contrat d'extra, juridiquement appelé <strong>contrat d'usage HCR</strong>, est une spécificité forte du secteur. Il permet d'embaucher un salarié pour une mission très courte (1 service, 1 banquet, 1 événement) sans prime de précarité, lorsque cela correspond à un emploi temporaire d'usage constant dans la profession.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Conditions cumulatives strictes</h3>
          <ul>
            <li>Le poste doit figurer sur la <strong>liste limitative HCR</strong> des emplois temporaires d'usage : serveur extra, commis extra, plongeur ponctuel, équipier banquet, demi-chef de rang renfort.</li>
            <li>Durée maximum d'une mission : <strong>2 mois cumulés</strong> chez le même employeur sur une période glissante de 12 mois.</li>
            <li>Pas d'utilisation continue ou répétitive sur le même poste (caractérise l'emploi permanent).</li>
            <li>Justification objective d'un besoin temporaire (banquet, surcroît dimanche, événement spécifique).</li>
            <li>Contrat écrit signé sous 48h impérativement.</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Tarif pratique du marché 2026</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Poste</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Tarif brut/h</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Coût employeur/h</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Net salarié/h</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Plongeur extra</td><td className="px-4 py-3 font-mono">11,88 EUR</td><td className="px-4 py-3 font-mono">16,80 EUR</td><td className="px-4 py-3 font-mono">9,30 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Commis extra</td><td className="px-4 py-3 font-mono">12,50 EUR</td><td className="px-4 py-3 font-mono">17,70 EUR</td><td className="px-4 py-3 font-mono">9,80 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Serveur extra</td><td className="px-4 py-3 font-mono">13,00 EUR</td><td className="px-4 py-3 font-mono">18,40 EUR</td><td className="px-4 py-3 font-mono">10,20 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Chef de rang extra</td><td className="px-4 py-3 font-mono">14,50 EUR</td><td className="px-4 py-3 font-mono">20,55 EUR</td><td className="px-4 py-3 font-mono">11,40 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Cuisinier extra</td><td className="px-4 py-3 font-mono">16,00 EUR</td><td className="px-4 py-3 font-mono">22,70 EUR</td><td className="px-4 py-3 font-mono">12,60 EUR</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">Ajouter le repas servi (4,22 EUR par service) qui est imposable mais reste un bénéfice net pour le salarié. Pas d'indemnité de congés payés en sus en contrat d'usage (intégrée dans le tarif horaire pratique).</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Risque URSSAF : la requalification en CDI</h3>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-red-700 mb-1">Cas fréquent en 2025-2026</p>
            <p className="text-sm text-red-600">L'URSSAF requalifie en CDI tout extra utilisé plus de <strong>30 jours/an</strong> chez le même employeur sans justification d'usage constant. Le redressement type : 3 ans d'arriérés + indemnité licenciement + prime précarité + 25% majoration. Coût médian : <strong>22 000 EUR par extra requalifié</strong>.</p>
          </div>
        </Section>

        <Section icon={<GraduationCap className="w-5 h-5" />} number="5" title="L'apprentissage : levier sous-utilisé" id="apprentissage">
          <p>Le contrat d'apprentissage est <strong>financièrement le plus avantageux</strong> de tous les contrats de travail en restauration. Pourtant, seuls <strong>14% des restaurants français</strong> emploient au moins un apprenti, contre 32% dans l'industrie. Voici pourquoi cette sous-utilisation est une erreur stratégique.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Rémunération de l'apprenti en 2026</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Âge</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">1ère année</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">2ème année</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">3ème année</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">16-17 ans</td><td className="px-4 py-3 font-mono">27% SMIC<br />~487 EUR</td><td className="px-4 py-3 font-mono">39% SMIC<br />~703 EUR</td><td className="px-4 py-3 font-mono">55% SMIC<br />~991 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">18-20 ans</td><td className="px-4 py-3 font-mono">43% SMIC<br />~775 EUR</td><td className="px-4 py-3 font-mono">51% SMIC<br />~919 EUR</td><td className="px-4 py-3 font-mono">67% SMIC<br />~1 208 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">21-25 ans</td><td className="px-4 py-3 font-mono">53% SMIC<br />~955 EUR</td><td className="px-4 py-3 font-mono">61% SMIC<br />~1 099 EUR</td><td className="px-4 py-3 font-mono">78% SMIC<br />~1 405 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">26 ans et +</td><td className="px-4 py-3 font-mono" colSpan={3}>100% SMIC ou minimum conventionnel HCR si plus favorable</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Aides employeur et exonérations</h3>
          <ul>
            <li><strong>Aide unique à l'apprentissage</strong> : 6 000 EUR la 1ère année (apprenti &lt; 30 ans), versée mensuellement par l'ASP</li>
            <li><strong>Exonération URSSAF</strong> : Sécurité sociale, retraite complémentaire, chômage exonérés jusqu'à 79% du SMIC</li>
            <li><strong>OPCO Mobilités</strong> : prise en charge totale des frais de formation au CFA</li>
            <li><strong>Crédit d'impôt apprentissage</strong> : 1 600 EUR/an par apprenti (entreprises &lt; 250 salariés)</li>
            <li><strong>Aucune indemnité de fin de contrat</strong>, aucune prime de précarité</li>
            <li><strong>Pas d'impact sur les seuils sociaux</strong> (effectif comptabilisé partiellement)</li>
          </ul>

          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 my-6">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Calcul réel d'un apprenti CAP cuisine 18 ans 1ère année</p>
            <p className="text-sm text-emerald-600">
              Salaire brut : <strong>775 EUR/mois</strong><br />
              Charges patronales (~5%) : <strong>+39 EUR</strong><br />
              Indemnité repas (2 x 4,22 x 22) : <strong>+186 EUR</strong><br />
              Coût brut mensuel : <strong>1 000 EUR</strong><br />
              <strong>- Aide unique</strong> 6 000 EUR/12 : <strong>-500 EUR</strong><br />
              <strong>Coût net mensuel : 500 EUR</strong> (vs 2 460 EUR pour un cuisinier CDI au SMIC).
            </p>
          </div>
          <p>L'apprenti coûte en réalité <strong>5 fois moins cher</strong> qu'un CDI au SMIC la 1ère année. Sur 3 ans de formation CAP + Bac Pro, le ROI est imbattable. Pour calculer l'impact sur votre prime cost global, voir notre <Link to="/blog/prime-cost-restaurant" className="text-teal-600 hover:underline">guide du prime cost restaurant</Link>.</p>
        </Section>

        <Section icon={<Calendar className="w-5 h-5" />} number="6" title="Le contrat saisonnier" id="saisonnier">
          <p>Spécifique aux activités cycliques, le <strong>contrat de travail saisonnier</strong> permet d'embaucher pour la durée d'une saison touristique : restaurants de plages (mai-septembre), restaurants de montagne (décembre-mars), guinguettes estivales, restaurants de festivals.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Caractéristiques juridiques</h3>
          <ul>
            <li>Pas de durée précise obligatoire (peut être conclu pour la "saison" sans date butoir exacte)</li>
            <li>Renouvelable d'une saison sur l'autre (clause de reconduction)</li>
            <li><strong>Pas d'indemnité de précarité</strong> (article L1243-10)</li>
            <li>Clause de reconduction <strong>obligatoire si 2 saisons consécutives</strong> chez le même employeur (loi Travail 2017)</li>
            <li>Droit prioritaire de réembauche après 3 saisons consécutives</li>
            <li>Ancienneté cumulative entre les saisons pour calcul des droits</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Logement du saisonnier</h3>
          <p>Beaucoup d'établissements saisonniers proposent un logement. Règle 2026 :</p>
          <ul>
            <li>Logement décent obligatoire (article L4533-1) : 9 m² minimum, sanitaires, chauffage, électricité</li>
            <li>Avantage en nature logement : <strong>76 EUR/mois forfait URSSAF</strong> (ou valeur réelle si supérieure)</li>
            <li>Possibilité de prélèvement sur salaire pour participation : max 30% du SMIC mensuel</li>
            <li>Pour les saisonniers étrangers : titre de séjour valable, visa "travailleur saisonnier" si nécessaire</li>
          </ul>
        </Section>

        <Section icon={<Scale className="w-5 h-5" />} number="7" title="Tableau comparatif des 6 contrats" id="comparatif">
          <p>Vue synthétique pour choisir le bon contrat en fonction de la situation. Tarifs basés sur un salaire brut équivalent <strong>2 000 EUR/mois</strong> (39h niveau 2 échelon 1 HCR) :</p>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Critère</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">CDI</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">CDD classique</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Extra (CDDU)</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Saisonnier</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Apprenti 18-20</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Pro alternance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Durée</td><td className="px-3 py-3">Illimitée</td><td className="px-3 py-3">Max 18 mois</td><td className="px-3 py-3">1 j - 2 mois</td><td className="px-3 py-3">Saison</td><td className="px-3 py-3">1-3 ans</td><td className="px-3 py-3">6-24 mois</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Écrit obligatoire</td><td className="px-3 py-3">Recommandé</td><td className="px-3 py-3">Oui &lt;48h</td><td className="px-3 py-3">Oui &lt;48h</td><td className="px-3 py-3">Oui &lt;48h</td><td className="px-3 py-3">Oui</td><td className="px-3 py-3">Oui</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Période d'essai</td><td className="px-3 py-3">2-4 mois</td><td className="px-3 py-3">1 j/sem (max 1 mois)</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">2 sem</td><td className="px-3 py-3">45 j</td><td className="px-3 py-3">2 mois</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Prime précarité 10%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3"><strong>Oui</strong></td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Charges patronales</td><td className="px-3 py-3">~25-28%</td><td className="px-3 py-3">~30%</td><td className="px-3 py-3">~28%</td><td className="px-3 py-3">~25%</td><td className="px-3 py-3"><strong>~5%</strong></td><td className="px-3 py-3">~15%</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Coût employeur/mois</td><td className="px-3 py-3 font-mono">2 540 EUR</td><td className="px-3 py-3 font-mono">2 800 EUR</td><td className="px-3 py-3 font-mono">2 560 EUR</td><td className="px-3 py-3 font-mono">2 500 EUR</td><td className="px-3 py-3 font-mono"><strong>1 000 EUR</strong></td><td className="px-3 py-3 font-mono">2 100 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Aide État</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3"><strong>6 000 EUR</strong></td><td className="px-3 py-3">2 000 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Risque requalif.</td><td className="px-3 py-3">Faible</td><td className="px-3 py-3"><strong>Élevé</strong></td><td className="px-3 py-3"><strong>Très élevé</strong></td><td className="px-3 py-3">Moyen</td><td className="px-3 py-3">Faible</td><td className="px-3 py-3">Faible</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Cas d'usage</td><td className="px-3 py-3">Poste pérenne</td><td className="px-3 py-3">Remplacement, surcroît</td><td className="px-3 py-3">Banquets, événements</td><td className="px-3 py-3">Saison</td><td className="px-3 py-3">Formation initiale</td><td className="px-3 py-3">Reconversion</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={<Calculator className="w-5 h-5" />} number="8" title="Coût employeur réel : du brut au total" id="cout-employeur">
          <p>Comprendre le coût total d'un salarié est essentiel pour piloter sa masse salariale et son <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-600 hover:underline">seuil de rentabilité restaurant</Link>. Le brut affiché sur le contrat ne représente que <strong>65-70% du coût réel</strong> pour l'employeur.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Décomposition complète : cuisinier HCR niveau 2 échelon 1, 39h</h3>
          <div className="bg-mono-975 rounded-xl p-5 my-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Salaire base 39h (169h x 11,88 EUR) : 2 008,00 EUR</div>
            <div>Heures sup. structurelles 10% déjà incluses</div>
            <div>Avantage repas 2 x 4,22 x 22 j : 185,68 EUR</div>
            <div>BRUT TOTAL : 2 193,68 EUR</div>
            <div className="pt-2">--- Charges patronales ---</div>
            <div>Sécurité sociale maladie (7%) : 153,56 EUR</div>
            <div>Vieillesse plafonnée (8,55%) : 187,56 EUR</div>
            <div>Vieillesse déplafonnée (2,02%) : 44,31 EUR</div>
            <div>Agirc-Arrco T1 (4,72%) + CEG (1,29%) : 131,82 EUR</div>
            <div>Allocations familiales (3,45%) : 75,68 EUR</div>
            <div>AT/MP (~2,10%) : 46,07 EUR</div>
            <div>Chômage Unédic (4,05%) : 88,84 EUR</div>
            <div>FNAL + CSA + Formation (~1,6%) : 35,10 EUR</div>
            <div>Prévoyance HCR (0,38%) : 8,34 EUR</div>
            <div>Mutuelle obligatoire part employeur : 27,00 EUR</div>
            <div>Total charges brutes : 798,28 EUR</div>
            <div className="pt-2">--- Réduction Fillon ---</div>
            <div>Réduction générale (au SMIC) : -540,30 EUR</div>
            <div>Charges nettes : +257,98 EUR</div>
            <div className="pt-2">+ Médecine du travail (SPST) : +7,00 EUR</div>
            <div className="pt-2 font-bold border-t border-mono-900 pt-3">COÛT EMPLOYEUR TOTAL : 2 458,66 EUR</div>
            <div className="font-bold">COÛT ANNUEL (12,5 mois CP) : 30 733 EUR</div>
          </div>

          <p>Le <strong>ratio coût total / brut = 1,12</strong> au niveau du SMIC HCR, qui grimpe à <strong>1,42-1,45</strong> pour des salaires &gt; 2,5 SMIC (perte des allègements). C'est pourquoi recruter des profils proches du SMIC est mécaniquement plus rentable en restauration.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Coefficients par tranche de salaire</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Salaire brut/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Coefficient coût</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Coût total estimé</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Profil typique</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">1 801 EUR (SMIC 35h)</td><td className="px-4 py-3 font-mono">1,12</td><td className="px-4 py-3 font-mono">2 017 EUR</td><td className="px-4 py-3">Commis, plongeur</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">2 008 EUR (SMIC 39h)</td><td className="px-4 py-3 font-mono">1,22</td><td className="px-4 py-3 font-mono">2 460 EUR</td><td className="px-4 py-3">Cuisinier débutant</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">2 500 EUR</td><td className="px-4 py-3 font-mono">1,32</td><td className="px-4 py-3 font-mono">3 300 EUR</td><td className="px-4 py-3">Chef de partie</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">3 000 EUR</td><td className="px-4 py-3 font-mono">1,38</td><td className="px-4 py-3 font-mono">4 140 EUR</td><td className="px-4 py-3">Sous-chef</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">4 000 EUR</td><td className="px-4 py-3 font-mono">1,43</td><td className="px-4 py-3 font-mono">5 720 EUR</td><td className="px-4 py-3">Second de cuisine</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">5 500 EUR</td><td className="px-4 py-3 font-mono">1,45</td><td className="px-4 py-3 font-mono">7 975 EUR</td><td className="px-4 py-3">Chef exécutif</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={<AlertTriangle className="w-5 h-5" />} number="9" title="Risques URSSAF et prud'homaux" id="risques">
          <p>Le secteur HCR est dans le top 3 des secteurs les plus contrôlés par l'URSSAF et l'inspection du travail. Voici les <strong>7 risques majeurs</strong> à connaître et les sanctions associées en 2026.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">1. Travail dissimulé (article L8221-1)</h3>
          <p>Le travail dissimulé recouvre l'absence de DPAE, de fiche de paie, de déclaration URSSAF. Sanctions :</p>
          <ul>
            <li>Pénal : 3 ans de prison + 45 000 EUR d'amende (personne physique), 225 000 EUR (personne morale)</li>
            <li>Redressement URSSAF sur 5 ans (vs 3 ans en régime normal)</li>
            <li>Annulation de toutes les réductions de cotisations sur 5 ans</li>
            <li>Inscription au fichier des fraudeurs (perte des aides publiques pendant 5 ans)</li>
            <li>Indemnité forfaitaire au salarié : 6 mois de salaire (L8223-1)</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">2. Faux statut auto-entrepreneur</h3>
          <p>Un cuisinier ou serveur en micro-entreprise qui travaille uniquement pour un seul restaurant, avec horaires imposés et matériel fourni, est considéré comme un <strong>salarié déguisé</strong>. Requalification automatique en CDI sur 3 ans + redressement URSSAF + indemnités licenciement abusif.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">3. Défaut de visite médicale</h3>
          <p>Sanction : 1 500 EUR par salarié non vu en visite d'information et de prévention (VIP) dans les 3 mois suivant l'embauche. Fréquent en restauration où les nouveaux arrivants ne sont pas systématiquement envoyés au Service de Prévention et Santé au Travail (SPST).</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">4. Heures supplémentaires non payées</h3>
          <p>L'oubli de majoration des heures sup HCR (10/20/50%) constitue du <strong>travail dissimulé partiel</strong>. Prud'hommes : rappel de salaires sur 3 ans + 50% indemnité forfaitaire + dommages-intérêts. Coût médian : 8 500 EUR par salarié.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">5. Repas non intégrés au brut</h3>
          <p>L'avantage en nature repas (4,22 EUR/repas en 2026) doit être intégré au brut soumis à cotisations. Oubli = redressement URSSAF + majoration 25%. Calcul : 2 repas/jour x 22 jours x 4,22 EUR = 185,68 EUR à intégrer mensuellement.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">6. CDD/extras requalifies</h3>
          <p>Cas le plus fréquent en restauration. Voir section 3 et 4. Coût moyen : <strong>15 000 à 25 000 EUR par salarié requalifié</strong>.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">7. Période d'essai mal rédigée</h3>
          <p>Période non prévue au contrat, renouvellement non accepté par écrit, durée excessive : la rupture en cours d'essai est requalifiée en licenciement sans cause réelle. Barème Macron : 1-3 mois de salaire selon ancienneté.</p>

          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 my-6">
            <p className="text-sm font-semibold text-amber-700 mb-1">Coût médian d'un contrôle URSSAF réussi en restauration (2025)</p>
            <p className="text-sm text-amber-600">23 400 EUR de redressement + 5 200 EUR de majorations. <strong>78% des contrôles aboutissent à un redressement</strong> dans le secteur HCR (source URSSAF Caisse Nationale, rapport activité 2024).</p>
          </div>
        </Section>

        <Section icon={<Briefcase className="w-5 h-5" />} number="10" title="Cas pratique : restaurant 8 salariés" id="cas-pratique">
          <p>Brasserie parisienne ouverte 6j/7, CA HT 720 000 EUR, équipe composée de :</p>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Poste</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Contrat</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Brut/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Coût total/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Coût annuel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Chef de cuisine</td><td className="px-4 py-3">CDI cadre</td><td className="px-4 py-3 font-mono">3 800 EUR</td><td className="px-4 py-3 font-mono">5 320 EUR</td><td className="px-4 py-3 font-mono">66 500 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Second de cuisine</td><td className="px-4 py-3">CDI</td><td className="px-4 py-3 font-mono">2 800 EUR</td><td className="px-4 py-3 font-mono">3 752 EUR</td><td className="px-4 py-3 font-mono">46 900 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Cuisinier</td><td className="px-4 py-3">CDI</td><td className="px-4 py-3 font-mono">2 200 EUR</td><td className="px-4 py-3 font-mono">2 728 EUR</td><td className="px-4 py-3 font-mono">34 100 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Apprenti CAP cuisine</td><td className="px-4 py-3">Apprentissage</td><td className="px-4 py-3 font-mono">775 EUR</td><td className="px-4 py-3 font-mono">500 EUR*</td><td className="px-4 py-3 font-mono">6 250 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Plongeur</td><td className="px-4 py-3">CDI 35h</td><td className="px-4 py-3 font-mono">1 802 EUR</td><td className="px-4 py-3 font-mono">2 017 EUR</td><td className="px-4 py-3 font-mono">25 200 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Chef de rang</td><td className="px-4 py-3">CDI</td><td className="px-4 py-3 font-mono">2 400 EUR</td><td className="px-4 py-3 font-mono">3 168 EUR</td><td className="px-4 py-3 font-mono">39 600 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Serveur</td><td className="px-4 py-3">CDI</td><td className="px-4 py-3 font-mono">2 008 EUR</td><td className="px-4 py-3 font-mono">2 460 EUR</td><td className="px-4 py-3 font-mono">30 750 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Extras week-end</td><td className="px-4 py-3">CDDU x 8j/mois</td><td className="px-4 py-3 font-mono">650 EUR</td><td className="px-4 py-3 font-mono">820 EUR</td><td className="px-4 py-3 font-mono">9 840 EUR</td></tr>
                <tr className="border-t-2 border-mono-100 font-bold"><td className="px-4 py-3">TOTAL</td><td className="px-4 py-3">-</td><td className="px-4 py-3 font-mono">16 435 EUR</td><td className="px-4 py-3 font-mono">20 765 EUR</td><td className="px-4 py-3 font-mono">259 140 EUR</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-mono-500 mt-2">* Net d'aide unique 6 000 EUR/an versée par l'État</p>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 my-6">
            <p className="font-bold text-mono-100 mb-3">Analyse</p>
            <ul className="space-y-2 text-[#374151]">
              <li>Coût personnel total : <strong>259 140 EUR/an</strong></li>
              <li>Ratio coût personnel / CA HT : <strong>36%</strong> (objectif HCR 30-35% pour une brasserie)</li>
              <li>Coefficient moyen brut → total : <strong>1,32</strong></li>
              <li>Économie grâce à l'apprenti : <strong>~24 500 EUR/an</strong> vs CDI équivalent</li>
              <li>Économie grâce aux extras vs CDI temps partiel : <strong>~6 000 EUR/an</strong></li>
            </ul>
            <p className="mt-3 text-sm">Le ratio 36% est légèrement au-dessus de la cible. Action prioritaire : ajuster le planning par <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-600 hover:underline">tranches de creux et pics</Link>, augmenter la part d'apprentis (passer de 1 à 2 alternants ferait baisser le ratio à 33%).</p>
          </div>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et références officielles</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>Convention Collective Nationale HCR (IDCC 1979), Légifrance — texte étendu en vigueur 2026</li>
            <li>Code du travail, articles L1221-1 à L1245-2 (CDI/CDD), L1242-2 (contrats d'usage), L1244-2 (saisonnier)</li>
            <li>URSSAF Caisse Nationale, barèmes 2026 réduction générale des cotisations patronales</li>
            <li>Ministère du Travail, barèmes apprentissage 2026 et aide unique</li>
            <li>Barème Macron (article L1235-3 Code du travail), indemnités prud'homales</li>
            <li>OPCO Mobilités, financement formation HCR 2026</li>
            <li>HCR Prévoyance, régime de mutuelle obligatoire branche restauration</li>
          </ul>
        </section>

        <CTABlock />

        <FAQSection items={faqItems.map(f => ({ q: f.question, a: f.answer }))} />

        {/* Internal links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/charges-sociales-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Charges sociales restauration 2026</p>
              <p className="text-sm text-mono-400">Taux URSSAF 2026, réduction Fillon, fiche de paie cuisinier, exonérations apprentis.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Réduire le coût personnel</p>
              <p className="text-sm text-mono-400">5 leviers pour économiser 10-20% sur votre masse salariale sans licencier.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Formation du personnel</p>
              <p className="text-sm text-mono-400">OPCO, CPF, ROI formation, plan 2026 et formations prioritaires en restauration.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul de marge restaurant</p>
              <p className="text-sm text-mono-400">Méthode complète : food cost, coefficient multiplicateur, marge brute et nette.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Prime cost restaurant</p>
              <p className="text-sm text-mono-400">Indicateur clé food cost + coût personnel. Objectifs par type d'établissement.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Seuil de rentabilité</p>
              <p className="text-sm text-mono-400">CA minimum à réaliser pour couvrir charges fixes incluant masse salariale.</p>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ icon, number, title, id, children }: { icon: React.ReactNode; number: string; title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
        <h2 className="text-2xl font-bold text-mono-100">{number}. {title}</h2>
      </div>
      <div className="prose-content text-[#374151] leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
            <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
              {item.q}
              <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTABlock() {
  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Maîtrisez vos coûts RH avec RestauMargin</h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">Module RH : coût employeur réel par poste, plannings optimisés, alertes heures supplémentaires, simulation embauche CDI/CDD/extra/apprenti.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-blue-50 transition-colors">
          Essayer gratuitement
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <PublicFooter />
  );
}
