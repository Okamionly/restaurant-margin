import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, FileText, Users, Clock, GraduationCap, Calendar, Calculator, Scale, AlertTriangle, Briefcase, Shield, BookOpen, TrendingUp } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026"
   Mots-cles cibles : contrat travail restaurant, CDI CDD extra HCR, convention collective HCR 1979
   ~3 200 mots — EAT, FAQ x12, HowTo, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on embaucher en CDD pour ouvrir un nouveau restaurant ?",
    answer: "Non. L'ouverture d'un restaurant est une activite durable et perenne : les postes doivent etre pourvus en CDI des le depart. Le recours au CDD n'est legalement possible que dans 5 cas limitatifs (remplacement, accroissement temporaire d'activite, emplois saisonniers, contrat d'usage HCR, contrat a objet defini). Un CDD requalifie pour ouverture coute en moyenne 4 a 6 mois de salaire brut en dommages prud'homaux, plus 10% d'indemnite de precarite + indemnite de requalification d'1 mois minimum (article L1245-2 du Code du travail)."
  },
  {
    question: "Combien d'heures supplementaires peut-on faire en HCR ?",
    answer: "Le contingent annuel d'heures supplementaires en convention collective HCR (IDCC 1979) est de 360 heures par salarie et par an, contre 220h dans le regime general. Au-dela de ce contingent, le repos compensateur obligatoire (RCR) s'applique : 50% des heures excedant le contingent dans les entreprises de 20 salaries et moins, 100% au-dela. Les heures supplementaires sont majorees a 10% (36e a 39e heure), 20% (40e a 43e heure) et 50% (au-dela de 43h/semaine)."
  },
  {
    question: "Faut-il un contrat ecrit pour un extra d'un seul service ?",
    answer: "Oui, imperativement. Tout CDD, y compris un extra de 4h pour un banquet, doit faire l'objet d'un contrat ecrit signe au plus tard dans les 48 heures suivant l'embauche (article L1242-13 du Code du travail). A defaut d'ecrit dans ce delai, le contrat est repute conclu pour une duree indeterminee. La sanction est lourde : requalification automatique en CDI + indemnite minimum d'1 mois de salaire (L1245-2) + 10% d'indemnite de precarite + arrieres URSSAF sur 3 ans."
  },
  {
    question: "Le pourboire entre-t-il dans le salaire ?",
    answer: "Non, en convention HCR les pourboires ne peuvent jamais se substituer au salaire minimum conventionnel. Ils s'ajoutent obligatoirement. Si le restaurant centralise les pourboires (caisse commune, TPE pourboires, repartition equitable), il doit les redistribuer integralement aux salaries et les declarer. Les pourboires volontaires (laisses directement par le client au serveur) sont exoneres de cotisations sociales jusqu'au 31/12/2026 pour les salaries remuneres jusqu'a 1,6 SMIC."
  },
  {
    question: "Peut-on imposer 2 jours de repos non consecutifs ?",
    answer: "Non. La convention collective HCR (article 21.1) impose 2 jours de repos hebdomadaire dont au moins 1,5 jour consecutif. Pour les entreprises ouvertes 7j/7, l'organisation classique est 1 jour ferme (lundi ou mardi) + une demi-journee supplementaire fixe ou tournante. Un repos hebdomadaire fractionne en 2 jours isoles constitue une infraction passible d'une amende de 1 500 EUR par salarie et par infraction (article R3174-1)."
  },
  {
    question: "Quelle est la duree legale du travail en restauration ?",
    answer: "La duree conventionnelle de reference en HCR est de 39 heures par semaine (et non 35h comme dans le regime general), avec 4 heures supplementaires structurelles majorees a 10%. La duree maximale quotidienne est de 11h30 (12h pour le personnel de cuisine), la duree hebdomadaire absolue de 48h sur une semaine et 46h en moyenne sur 12 semaines. La duree minimum de repos quotidien est de 11 heures consecutives."
  },
  {
    question: "Quel est le SMIC HCR en 2026 ?",
    answer: "Le SMIC horaire brut en 2026 est de 11,88 EUR, soit 1 801,80 EUR brut/mois pour 35h ou 2 008,12 EUR brut/mois pour 39h (base HCR avec 4h sup majorees a 10%). La grille conventionnelle HCR prevoit 5 niveaux x 3 echelons : Niveau 1 echelon 1 (commis, plonge) demarre au SMIC ; Niveau 5 echelon 3 (chef executif) atteint environ 3 500 EUR brut/mois selon les avenants regionaux."
  },
  {
    question: "Combien coute un apprenti par mois en restaurant ?",
    answer: "Un apprenti de 18-20 ans en 1ere annee perçoit 43% du SMIC, soit environ 795 EUR/mois brut. Les charges patronales sont quasi nulles grace aux exonerations specifiques apprentissage (Sécu, retraite, chomage). Le cout employeur reel s'eleve a environ 830 EUR/mois, auxquels il faut deduire l'aide unique de 6 000 EUR la 1ere annee versee par l'Etat. Sur 12 mois, le cout net d'un apprenti CAP cuisine 1ere annee tourne autour de 4 000 EUR, soit l'embauche la plus rentable du secteur."
  },
  {
    question: "Combien coute une rupture conventionnelle en restaurant ?",
    answer: "L'indemnite minimale de rupture conventionnelle est identique a l'indemnite legale de licenciement : 25% du salaire brut mensuel moyen par annee d'anciennete jusqu'a 10 ans, puis 33,33% au-dela. Pour un employe avec 3 ans d'anciennete a 2 000 EUR brut/mois : 1 500 EUR minimum. Avantage : exonere de charges sociales (sauf CSG/CRDS) jusqu'a 2 PASS (94 200 EUR en 2026), versement chomage immediat sans delai de carence, pas de risque prud'homal contrairement au licenciement."
  },
  {
    question: "Peut-on rompre la periode d'essai sans motif ?",
    answer: "Oui, la periode d'essai peut etre rompue librement par l'employeur ou le salarie, sans motif a fournir. Cependant, un delai de prevenance est obligatoire selon l'anciennete du salarie : 24h si moins de 8 jours, 48h entre 8 jours et 1 mois, 2 semaines apres 1 mois, 1 mois apres 3 mois. Duree maximale d'essai en HCR : employes 2 mois renouvelables (4 mois max), agents de maitrise 6 mois, cadres 8 mois. Le renouvellement doit etre prevu au contrat et accepte par ecrit."
  },
  {
    question: "Un saisonnier a-t-il droit a une prime de precarite ?",
    answer: "Non. Le contrat saisonnier (article L1242-2 3°) et le contrat d'usage HCR (extra) sont les deux seuls CDD exoneres de l'indemnite de fin de contrat de 10%. En contrepartie, le saisonnier qui revient pour la 2eme annee consecutive beneficie d'une clause de reconduction prioritaire (article L1244-2 issu de la loi Travail 2017). Apres 3 saisons consecutives, le droit prioritaire de reembauche devient quasi-systematique."
  },
  {
    question: "Le contrat d'extra peut-il etre utilise sans limite ?",
    answer: "Non. Le contrat d'usage HCR (extra) est strictement encadre par les conventions collectives nationales. Conditions cumulatives : (1) emploi temporaire d'usage constant figurant sur la liste limitative HCR ; (2) duree maximale 2 mois cumules par mission ; (3) pas d'usage continu sur un meme poste pour eviter la requalification. L'URSSAF requalifie en CDI tout extra utilise plus de 30 jours/an chez le meme employeur sans justification objective d'usage temporaire."
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
  name: 'Comment embaucher un salarie en restauration en 7 etapes',
  description: 'Procedure complete et conforme pour embaucher en CDI, CDD ou extra en convention HCR.',
  totalTime: 'PT2H',
  tool: ['Document d\'identite salarie', 'RIB', 'Contrat de travail HCR', 'Logiciel paie'],
  step: [
    { '@type': 'HowToStep', name: 'Choisir le bon type de contrat', text: 'CDI pour poste perenne, CDD pour remplacement ou surcroit, extra (CDD usage HCR) pour mission de quelques jours, saisonnier pour activite cyclique. Le mauvais choix coute en moyenne 4-6 mois de salaire en requalification.' },
    { '@type': 'HowToStep', name: 'Etablir la DPAE 8 jours avant', text: 'Declaration Prealable a l\'Embauche obligatoire sur net-entreprises.fr ou via DSN. A faire au plus tot 8 jours avant l\'embauche, au plus tard avant le debut effectif. Sanction : 1 500 EUR par DPAE manquante.' },
    { '@type': 'HowToStep', name: 'Rediger le contrat ecrit', text: 'CDI : recommande mais non obligatoire sauf temps partiel. CDD/extra : ecrit obligatoire signe sous 48h. Mentions imperatives : identite, poste, CCN HCR (IDCC 1979), salaire brut, duree, periode d\'essai, lieu, horaires.' },
    { '@type': 'HowToStep', name: 'Verifier l\'aptitude medicale', text: 'Visite d\'information et de prevention (VIP) dans les 3 mois suivant l\'embauche (Service de Prevention et de Sante au Travail). Sanction inspection du travail : 1 500 EUR par salarie non visite.' },
    { '@type': 'HowToStep', name: 'Affilier a la mutuelle HCR', text: 'Mutuelle obligatoire (HCR Prevoyance ou equivalent), employeur prend en charge au minimum 50% de la cotisation. Affiliation sous 30 jours suivant l\'embauche.' },
    { '@type': 'HowToStep', name: 'Remettre les documents obligatoires', text: 'Contrat signe, fiche de poste, livret d\'accueil, reglement interieur (si >20 salaries), grille horaire, conventions collectives consultables, mentions DUERP.' },
    { '@type': 'HowToStep', name: 'Declarer dans le registre du personnel', text: 'Inscription obligatoire dans le registre unique du personnel (nom, prenom, nationalite, date entree, qualification, type contrat). Doit etre tenu a jour en permanence sur le lieu de travail.' }
  ]
};

const howToCoutEmploye = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment calculer le cout total d\'un employe en restauration',
  description: 'Methode pas a pas pour passer du salaire brut au cout total employeur, charges incluses.',
  totalTime: 'PT20M',
  tool: ['Bulletin de paie', 'Calculatrice', 'Logiciel RestauMargin'],
  step: [
    { '@type': 'HowToStep', name: 'Partir du salaire brut', text: 'Le brut affiche au contrat. Exemple : 2 008 EUR pour 39h niveau 2 echelon 1 HCR 2026.' },
    { '@type': 'HowToStep', name: 'Ajouter les avantages en nature', text: 'Repas (2 x 4,22 EUR x 22 jours = 185,68 EUR/mois), eventuellement logement saisonnier. A integrer au brut pour calcul cotisations.' },
    { '@type': 'HowToStep', name: 'Calculer les charges patronales brutes', text: 'Environ 42-45% du brut total. Sur 2 193,68 EUR de base : ~920 EUR de cotisations.' },
    { '@type': 'HowToStep', name: 'Deduire la reduction Fillon', text: 'Reduction generale des cotisations patronales (T = 0,3194 entreprises <50 salaries). Au SMIC : ~540 EUR/mois deduits.' },
    { '@type': 'HowToStep', name: 'Ajouter mutuelle et medecine du travail', text: 'Part employeur mutuelle ~30-40 EUR/mois, cotisation SPST ~7 EUR/mois.' },
    { '@type': 'HowToStep', name: 'Obtenir le cout total mensuel', text: 'Brut + charges nettes + mutuelle + medecine + repas. Au SMIC HCR : ~2 460 EUR. Multiplier par 12,5 (avec CP) pour cout annuel.' }
  ]
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026',
  description: 'Guide complet 2026 des contrats en restauration : CDI, CDD, extras HCR, apprentissage, saisonnier. Couts employeur reels, mentions obligatoires, convention HCR, risques URSSAF.',
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La redaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
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
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026"
        description="Tous les contrats de travail en restauration : CDI, CDD, extras HCR, apprentissage, saisonnier. Cout employeur reel, mentions obligatoires, convention collective HCR (IDCC 1979), risques URSSAF et prud'homaux."
        path="/blog/contrat-travail-restauration-guide"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToEmbaucher, howToCoutEmploye, articleSchema]}
      />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero
        category="RH & Paie"
        readTime="15 min"
        date="Mai 2026"
        title="Contrat de travail en restauration : CDI, CDD, extras, apprentissage"
        accentWord="contrat"
        subtitle="Le secteur HCR est l'un des plus controles en France pour le droit du travail. Mode d'emploi 2026 avec couts employeur reels, risques URSSAF et exemples chiffres."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          URSSAF, inspection du travail, prud'hommes pleuvent des qu'un contrat est mal redige en restauration. Le secteur HCR (Hotels, Cafes, Restaurants) concentre <strong>18 % des controles URSSAF nationaux pour seulement 4 % de la masse salariale francaise</strong>. Redressement moyen en 2025 : <strong>23 400 EUR par etablissement controle</strong>. Ce guide dresse l'etat des lieux 2026 des 6 contrats utilisables, avec couts employeur reels, mentions obligatoires, risques juridiques et cas d'usage concrets.
        </p>

        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#ccn-hcr" className="hover:text-teal-600 transition-colors">1. La convention collective HCR : socle obligatoire</a></li>
            <li><a href="#cdi" className="hover:text-teal-600 transition-colors">2. Le CDI : reference pour les postes perennes</a></li>
            <li><a href="#cdd" className="hover:text-teal-600 transition-colors">3. Le CDD : a utiliser avec precaution</a></li>
            <li><a href="#extra" className="hover:text-teal-600 transition-colors">4. Le contrat d'extra (CDD d'usage HCR)</a></li>
            <li><a href="#apprentissage" className="hover:text-teal-600 transition-colors">5. L'apprentissage : levier sous-utilise</a></li>
            <li><a href="#saisonnier" className="hover:text-teal-600 transition-colors">6. Le contrat saisonnier</a></li>
            <li><a href="#comparatif" className="hover:text-teal-600 transition-colors">7. Tableau comparatif des 6 contrats</a></li>
            <li><a href="#cout-employeur" className="hover:text-teal-600 transition-colors">8. Cout employeur reel : du brut au total</a></li>
            <li><a href="#risques" className="hover:text-teal-600 transition-colors">9. Risques URSSAF et prud'homaux</a></li>
            <li><a href="#cas-pratique" className="hover:text-teal-600 transition-colors">10. Cas pratique : restaurant 8 salaries</a></li>
          </ol>
        </nav>

        <Section icon={<FileText className="w-5 h-5" />} number="1" title="La convention collective HCR : socle obligatoire" id="ccn-hcr">
          <p>Tout contrat dans la restauration commerciale est imperativement regi par la <strong>convention collective nationale HCR (IDCC 1979)</strong>, etendue par arrete du 3 decembre 1997. Elle s'applique a tous les etablissements dont l'activite principale releve des codes NAF 5610A (restauration traditionnelle), 5610B (cafeterias et libres-services), 5610C (restauration de type rapide), 5630Z (debits de boissons) et 5510Z (hotellerie).</p>
          <p>Les <strong>10 points cles</strong> de la convention HCR 2026 :</p>
          <ul>
            <li><strong>Grille salariale</strong> : 5 niveaux x 3 echelons, du commis (Niveau 1) au directeur (Niveau 5). Salaires minima conventionnels revalorises chaque annee, generalement en janvier.</li>
            <li><strong>Indemnite nourriture</strong> : 4,22 EUR par repas du en 2026 (soit 8,44 EUR/jour pour 2 repas, ~185 EUR/mois pour 22 jours travailles).</li>
            <li><strong>Duree du travail</strong> : 39h/semaine reference HCR (et non 35h), avec 4h supplementaires structurelles majorees a 10%.</li>
            <li><strong>Heures supplementaires</strong> : 10% (36e-39e), 20% (40e-43e), 50% (au-dela). Contingent annuel 360h (vs 220h regime general).</li>
            <li><strong>Travail de nuit (22h-7h)</strong> : majoration 30% du salaire horaire de base.</li>
            <li><strong>Repos hebdomadaire</strong> : 2 jours/semaine dont 1,5 jour consecutif minimum (article 21.1).</li>
            <li><strong>Preavis CDI</strong> : 1 mois employes, 2 mois agents de maitrise et cadres.</li>
            <li><strong>Mutuelle obligatoire</strong> : depuis 2016, prise en charge employeur minimum 50% (HCR Prevoyance).</li>
            <li><strong>Prevoyance</strong> : 0,38% du brut pour la garantie deces/invalidite (article 26).</li>
            <li><strong>Formation</strong> : entretien professionnel obligatoire tous les 2 ans, bilan a 6 ans (sanction 3 000 EUR abondement CPF si manquement).</li>
          </ul>
          <p>Pour piloter ces obligations finement, voir notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-600 hover:underline">guide du calcul de marge restaurant</Link> qui integre les charges RH dans le calcul du prime cost.</p>
        </Section>

        <Section icon={<Users className="w-5 h-5" />} number="2" title="Le CDI : reference pour les postes perennes" id="cdi">
          <p>Le CDI (Contrat a Duree Indeterminee) est la <strong>forme normale et generale du contrat de travail</strong> en France (article L1221-2 du Code du travail). En HCR, il doit etre privilegie pour tous les postes durables : cuisinier titulaire, second de cuisine, chef de partie, serveur permanent, responsable de salle, manager, plongeur attitre.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Mentions obligatoires du CDI HCR</h3>
          <ul>
            <li>Identite des parties (nom, adresse, numero SIRET employeur)</li>
            <li>Date d'embauche et date de prise effective des fonctions</li>
            <li>Lieu de travail (etablissement principal et mobilite eventuelle)</li>
            <li>Reference a la <strong>CCN HCR (IDCC 1979)</strong></li>
            <li>Intitule du poste, classification (niveau + echelon), qualification</li>
            <li>Salaire brut mensuel ou horaire</li>
            <li>Duree du travail (39h standard HCR, 35h si choix entreprise)</li>
            <li>Periode d'essai et conditions de renouvellement</li>
            <li>Modalites de rupture (preavis, indemnites)</li>
            <li>Affiliation mutuelle et prevoyance HCR</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Periode d'essai HCR 2026</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Statut</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Duree initiale</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Renouvellement</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Maximum total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Employes (serveurs, commis, plongeurs)</td><td className="px-4 py-3">2 mois</td><td className="px-4 py-3">1 fois</td><td className="px-4 py-3 font-semibold">4 mois</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">Agents de maitrise (chef de rang, chef de partie)</td><td className="px-4 py-3">3 mois</td><td className="px-4 py-3">1 fois</td><td className="px-4 py-3 font-semibold">6 mois</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">Cadres (chef executif, directeur)</td><td className="px-4 py-3">4 mois</td><td className="px-4 py-3">1 fois</td><td className="px-4 py-3 font-semibold">8 mois</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">Le renouvellement doit etre <strong>prevu au contrat initial</strong> ET <strong>accepte par ecrit</strong> par le salarie avant l'expiration de la periode initiale. A defaut, le CDI est definitivement acquis.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Rupture du CDI : 5 modes possibles</h3>
          <ul>
            <li><strong>Demission</strong> du salarie : preavis 1-2 mois selon classification</li>
            <li><strong>Licenciement</strong> economique ou pour motif personnel : procedure stricte, indemnite legale (25% brut/an jusqu'a 10 ans)</li>
            <li><strong>Rupture conventionnelle</strong> : negociee, exoneree de charges jusqu'a 2 PASS, chomage immediat</li>
            <li><strong>Retraite</strong> : depart volontaire ou mise a la retraite (a 67 ans)</li>
            <li><strong>Prise d'acte</strong> ou <strong>resiliation judiciaire</strong> : initiative salariale, equivaut a licenciement sans cause</li>
          </ul>
        </Section>

        <Section icon={<Clock className="w-5 h-5" />} number="3" title="Le CDD : a utiliser avec precaution" id="cdd">
          <p>Le CDD (Contrat a Duree Determinee) ne peut etre utilise que dans <strong>5 cas legalement limitatifs</strong> (article L1242-2 du Code du travail) :</p>
          <ol>
            <li>Remplacement d'un salarie absent (maladie, conge parental, formation longue)</li>
            <li>Accroissement temporaire d'activite (saison touristique, evenement ponctuel)</li>
            <li>Emplois saisonniers ou contrats d'usage HCR (extras)</li>
            <li>Contrat a objet defini (cadres uniquement, 18-36 mois)</li>
            <li>Contrat d'insertion ou de retour a l'emploi (CUI, PEC)</li>
          </ol>
          <p>En dehors de ces cas, tout CDD est presume etre un CDI (article L1245-1).</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Risque majeur : la requalification en CDI</h3>
          <p>Quand un CDD est mal motive, mal redige ou utilise hors des cas legaux, le Conseil de prud'hommes le <strong>requalifie en CDI</strong>. Cout moyen pour l'employeur :</p>
          <ul>
            <li>Indemnite de requalification : <strong>1 mois de salaire brut minimum</strong> (article L1245-2)</li>
            <li>Indemnite de fin de contrat (precarite) : <strong>10% du salaire brut total perçu</strong></li>
            <li>Indemnite de licenciement sans cause reelle et serieuse : <strong>3 a 6 mois de salaire</strong> (bareme Macron)</li>
            <li>Arrieres URSSAF sur 3 ans : <strong>regularisation des charges sur la totalite de la relation</strong></li>
            <li>Rappels de salaires (anciennete, primes conventionnelles)</li>
          </ul>
          <p>Cout total moyen pour un CDD requalifie apres 8 mois a 2 000 EUR brut : <strong>environ 12 000 a 18 000 EUR</strong>.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Indemnite de precarite : 10% du brut</h3>
          <p>A la fin du CDD, l'employeur doit verser une indemnite de precarite egale a <strong>10% du salaire brut total verse</strong> pendant le contrat (article L1243-8). Exceptions ou elle n'est PAS due :</p>
          <ul>
            <li>CDD saisonnier (saison touristique, montagne, plage)</li>
            <li>Contrat d'usage HCR (extra)</li>
            <li>Refus par le salarie d'un CDI propose pour le meme poste</li>
            <li>Rupture du fait du salarie ou pour faute grave</li>
            <li>Contrats d'insertion (CUI, PEC, contrat de professionnalisation)</li>
          </ul>
        </Section>

        <Section icon={<Calendar className="w-5 h-5" />} number="4" title="Le contrat d'extra (CDD d'usage)" id="extra">
          <p>Le contrat d'extra, juridiquement appele <strong>contrat d'usage HCR</strong>, est une specificite forte du secteur. Il permet d'embaucher un salarie pour une mission tres courte (1 service, 1 banquet, 1 evenement) sans prime de precarite, lorsque cela correspond a un emploi temporaire d'usage constant dans la profession.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Conditions cumulatives strictes</h3>
          <ul>
            <li>Le poste doit figurer sur la <strong>liste limitative HCR</strong> des emplois temporaires d'usage : serveur extra, commis extra, plongeur ponctuel, equipier banquet, demi-chef de rang renfort.</li>
            <li>Duree maximum d'une mission : <strong>2 mois cumules</strong> chez le meme employeur sur une periode glissante de 12 mois.</li>
            <li>Pas d'utilisation continue ou repetitive sur le meme poste (caracterise l'emploi permanent).</li>
            <li>Justification objective d'un besoin temporaire (banquet, surcroit dimanche, evenement specifique).</li>
            <li>Contrat ecrit signe sous 48h imperativement.</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Tarif pratique du marche 2026</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Poste</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Tarif brut/h</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cout employeur/h</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Net salarie/h</th>
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
          <p className="mt-4">Ajouter le repas servi (4,22 EUR par service) qui est imposable mais reste un benefice net pour le salarie. Pas d'indemnite de conges payes en sus en contrat d'usage (integree dans le tarif horaire pratique).</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Risque URSSAF : la requalification en CDI</h3>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-red-700 mb-1">Cas frequent en 2025-2026</p>
            <p className="text-sm text-red-600">L'URSSAF requalifie en CDI tout extra utilise plus de <strong>30 jours/an</strong> chez le meme employeur sans justification d'usage constant. Le redressement type : 3 ans d'arrieres + indemnite licenciement + prime precarite + 25% majoration. Cout median : <strong>22 000 EUR par extra requalifie</strong>.</p>
          </div>
        </Section>

        <Section icon={<GraduationCap className="w-5 h-5" />} number="5" title="L'apprentissage : levier sous-utilise" id="apprentissage">
          <p>Le contrat d'apprentissage est <strong>financierement le plus avantageux</strong> de tous les contrats de travail en restauration. Pourtant, seuls <strong>14% des restaurants francais</strong> emploient au moins un apprenti, contre 32% dans l'industrie. Voici pourquoi cette sous-utilisation est une erreur strategique.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Remuneration de l'apprenti en 2026</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Age</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">1ere annee</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">2eme annee</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">3eme annee</th>
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

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Aides employeur et exonerations</h3>
          <ul>
            <li><strong>Aide unique a l'apprentissage</strong> : 6 000 EUR la 1ere annee (apprenti &lt; 30 ans), versee mensuellement par l'ASP</li>
            <li><strong>Exoneration URSSAF</strong> : Securite sociale, retraite complementaire, chomage exoneres jusqu'a 79% du SMIC</li>
            <li><strong>OPCO Mobilites</strong> : prise en charge totale des frais de formation au CFA</li>
            <li><strong>Credit d'impot apprentissage</strong> : 1 600 EUR/an par apprenti (entreprises &lt; 250 salaries)</li>
            <li><strong>Aucune indemnite de fin de contrat</strong>, aucune prime de precarite</li>
            <li><strong>Pas d'impact sur les seuils sociaux</strong> (effectif comptabilise partiellement)</li>
          </ul>

          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 my-6">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Calcul reel d'un apprenti CAP cuisine 18 ans 1ere annee</p>
            <p className="text-sm text-emerald-600">
              Salaire brut : <strong>775 EUR/mois</strong><br />
              Charges patronales (~5%) : <strong>+39 EUR</strong><br />
              Indemnite repas (2 x 4,22 x 22) : <strong>+186 EUR</strong><br />
              Cout brut mensuel : <strong>1 000 EUR</strong><br />
              <strong>- Aide unique</strong> 6 000 EUR/12 : <strong>-500 EUR</strong><br />
              <strong>Cout net mensuel : 500 EUR</strong> (vs 2 460 EUR pour un cuisinier CDI au SMIC).
            </p>
          </div>
          <p>L'apprenti coute en realite <strong>5 fois moins cher</strong> qu'un CDI au SMIC la 1ere annee. Sur 3 ans de formation CAP + Bac Pro, le ROI est imbattable. Pour calculer l'impact sur votre prime cost global, voir notre <Link to="/blog/prime-cost" className="text-teal-600 hover:underline">guide du prime cost restaurant</Link>.</p>
        </Section>

        <Section icon={<Calendar className="w-5 h-5" />} number="6" title="Le contrat saisonnier" id="saisonnier">
          <p>Specifique aux activites cycliques, le <strong>contrat de travail saisonnier</strong> permet d'embaucher pour la duree d'une saison touristique : restaurants de plages (mai-septembre), restaurants de montagne (decembre-mars), guinguettes estivales, restaurants de festivals.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Caracteristiques juridiques</h3>
          <ul>
            <li>Pas de duree precise obligatoire (peut etre conclu pour la "saison" sans date butoir exacte)</li>
            <li>Renouvelable d'une saison sur l'autre (clause de reconduction)</li>
            <li><strong>Pas d'indemnite de precarite</strong> (article L1243-10)</li>
            <li>Clause de reconduction <strong>obligatoire si 2 saisons consecutives</strong> chez le meme employeur (loi Travail 2017)</li>
            <li>Droit prioritaire de reembauche apres 3 saisons consecutives</li>
            <li>Anciennete cumulative entre les saisons pour calcul des droits</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Logement du saisonnier</h3>
          <p>Beaucoup d'etablissements saisonniers proposent un logement. Regle 2026 :</p>
          <ul>
            <li>Logement decent obligatoire (article L4533-1) : 9 m² minimum, sanitaires, chauffage, electricite</li>
            <li>Avantage en nature logement : <strong>76 EUR/mois forfait URSSAF</strong> (ou valeur reelle si superieure)</li>
            <li>Possibilite de prelevement sur salaire pour participation : max 30% du SMIC mensuel</li>
            <li>Pour les saisonniers etrangers : titre de sejour valable, visa "travailleur saisonnier" si necessaire</li>
          </ul>
        </Section>

        <Section icon={<Scale className="w-5 h-5" />} number="7" title="Tableau comparatif des 6 contrats" id="comparatif">
          <p>Vue synthetique pour choisir le bon contrat en fonction de la situation. Tarifs bases sur un salaire brut equivalent <strong>2 000 EUR/mois</strong> (39h niveau 2 echelon 1 HCR) :</p>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Critere</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">CDI</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">CDD classique</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Extra (CDDU)</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Saisonnier</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Apprenti 18-20</th>
                  <th className="px-3 py-3 text-left font-bold text-mono-100">Pro alternance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Duree</td><td className="px-3 py-3">Illimitee</td><td className="px-3 py-3">Max 18 mois</td><td className="px-3 py-3">1 j - 2 mois</td><td className="px-3 py-3">Saison</td><td className="px-3 py-3">1-3 ans</td><td className="px-3 py-3">6-24 mois</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Ecrit obligatoire</td><td className="px-3 py-3">Recommande</td><td className="px-3 py-3">Oui &lt;48h</td><td className="px-3 py-3">Oui &lt;48h</td><td className="px-3 py-3">Oui &lt;48h</td><td className="px-3 py-3">Oui</td><td className="px-3 py-3">Oui</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Periode d'essai</td><td className="px-3 py-3">2-4 mois</td><td className="px-3 py-3">1 j/sem (max 1 mois)</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">2 sem</td><td className="px-3 py-3">45 j</td><td className="px-3 py-3">2 mois</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Prime precarite 10%</td><td className="px-3 py-3">Non</td><td className="px-3 py-3"><strong>Oui</strong></td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Charges patronales</td><td className="px-3 py-3">~25-28%</td><td className="px-3 py-3">~30%</td><td className="px-3 py-3">~28%</td><td className="px-3 py-3">~25%</td><td className="px-3 py-3"><strong>~5%</strong></td><td className="px-3 py-3">~15%</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Cout employeur/mois</td><td className="px-3 py-3 font-mono">2 540 EUR</td><td className="px-3 py-3 font-mono">2 800 EUR</td><td className="px-3 py-3 font-mono">2 560 EUR</td><td className="px-3 py-3 font-mono">2 500 EUR</td><td className="px-3 py-3 font-mono"><strong>1 000 EUR</strong></td><td className="px-3 py-3 font-mono">2 100 EUR</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Aide Etat</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3">Non</td><td className="px-3 py-3"><strong>6 000 EUR</strong></td><td className="px-3 py-3">2 000 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-3 py-3 font-semibold">Risque requalif.</td><td className="px-3 py-3">Faible</td><td className="px-3 py-3"><strong>Eleve</strong></td><td className="px-3 py-3"><strong>Tres eleve</strong></td><td className="px-3 py-3">Moyen</td><td className="px-3 py-3">Faible</td><td className="px-3 py-3">Faible</td></tr>
                <tr className="border-t border-mono-900"><td className="px-3 py-3 font-semibold">Cas d'usage</td><td className="px-3 py-3">Poste perenne</td><td className="px-3 py-3">Remplacement, surcroit</td><td className="px-3 py-3">Banquets, evenements</td><td className="px-3 py-3">Saison</td><td className="px-3 py-3">Formation initiale</td><td className="px-3 py-3">Reconversion</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={<Calculator className="w-5 h-5" />} number="8" title="Cout employeur reel : du brut au total" id="cout-employeur">
          <p>Comprendre le cout total d'un salarie est essentiel pour piloter sa masse salariale et son <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-600 hover:underline">seuil de rentabilite restaurant</Link>. Le brut affiche sur le contrat ne represente que <strong>65-70% du cout reel</strong> pour l'employeur.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Decomposition complete : cuisinier HCR niveau 2 echelon 1, 39h</h3>
          <div className="bg-mono-975 rounded-xl p-5 my-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Salaire base 39h (169h x 11,88 EUR) : 2 008,00 EUR</div>
            <div>Heures sup. structurelles 10% deja incluses</div>
            <div>Avantage repas 2 x 4,22 x 22 j : 185,68 EUR</div>
            <div>BRUT TOTAL : 2 193,68 EUR</div>
            <div className="pt-2">--- Charges patronales ---</div>
            <div>Securite sociale maladie (7%) : 153,56 EUR</div>
            <div>Vieillesse plafonnee (8,55%) : 187,56 EUR</div>
            <div>Vieillesse deplafonnee (2,02%) : 44,31 EUR</div>
            <div>Agirc-Arrco T1 (4,72%) + CEG (1,29%) : 131,82 EUR</div>
            <div>Allocations familiales (3,45%) : 75,68 EUR</div>
            <div>AT/MP (~2,10%) : 46,07 EUR</div>
            <div>Chomage Unedic (4,05%) : 88,84 EUR</div>
            <div>FNAL + CSA + Formation (~1,6%) : 35,10 EUR</div>
            <div>Prevoyance HCR (0,38%) : 8,34 EUR</div>
            <div>Mutuelle obligatoire part employeur : 27,00 EUR</div>
            <div>Total charges brutes : 798,28 EUR</div>
            <div className="pt-2">--- Reduction Fillon ---</div>
            <div>Reduction generale (au SMIC) : -540,30 EUR</div>
            <div>Charges nettes : +257,98 EUR</div>
            <div className="pt-2">+ Medecine du travail (SPST) : +7,00 EUR</div>
            <div className="pt-2 font-bold border-t border-mono-900 pt-3">COUT EMPLOYEUR TOTAL : 2 458,66 EUR</div>
            <div className="font-bold">COUT ANNUEL (12,5 mois CP) : 30 733 EUR</div>
          </div>

          <p>Le <strong>ratio cout total / brut = 1,12</strong> au niveau du SMIC HCR, qui grimpe a <strong>1,42-1,45</strong> pour des salaires &gt; 2,5 SMIC (perte des allegements). C'est pourquoi recruter des profils proches du SMIC est mecaniquement plus rentable en restauration.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Coefficients par tranche de salaire</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Salaire brut/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Coefficient cout</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cout total estime</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Profil typique</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">1 801 EUR (SMIC 35h)</td><td className="px-4 py-3 font-mono">1,12</td><td className="px-4 py-3 font-mono">2 017 EUR</td><td className="px-4 py-3">Commis, plongeur</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">2 008 EUR (SMIC 39h)</td><td className="px-4 py-3 font-mono">1,22</td><td className="px-4 py-3 font-mono">2 460 EUR</td><td className="px-4 py-3">Cuisinier debutant</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">2 500 EUR</td><td className="px-4 py-3 font-mono">1,32</td><td className="px-4 py-3 font-mono">3 300 EUR</td><td className="px-4 py-3">Chef de partie</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">3 000 EUR</td><td className="px-4 py-3 font-mono">1,38</td><td className="px-4 py-3 font-mono">4 140 EUR</td><td className="px-4 py-3">Sous-chef</td></tr>
                <tr className="border-t border-mono-900"><td className="px-4 py-3 font-mono">4 000 EUR</td><td className="px-4 py-3 font-mono">1,43</td><td className="px-4 py-3 font-mono">5 720 EUR</td><td className="px-4 py-3">Second de cuisine</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3 font-mono">5 500 EUR</td><td className="px-4 py-3 font-mono">1,45</td><td className="px-4 py-3 font-mono">7 975 EUR</td><td className="px-4 py-3">Chef executif</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={<AlertTriangle className="w-5 h-5" />} number="9" title="Risques URSSAF et prud'homaux" id="risques">
          <p>Le secteur HCR est dans le top 3 des secteurs les plus controles par l'URSSAF et l'inspection du travail. Voici les <strong>7 risques majeurs</strong> a connaitre et les sanctions associees en 2026.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">1. Travail dissimule (article L8221-1)</h3>
          <p>Le travail dissimule recouvre l'absence de DPAE, de fiche de paie, de declaration URSSAF. Sanctions :</p>
          <ul>
            <li>Penal : 3 ans de prison + 45 000 EUR d'amende (personne physique), 225 000 EUR (personne morale)</li>
            <li>Redressement URSSAF sur 5 ans (vs 3 ans en regime normal)</li>
            <li>Annulation de toutes les reductions de cotisations sur 5 ans</li>
            <li>Inscription au fichier des fraudeurs (perte des aides publiques pendant 5 ans)</li>
            <li>Indemnite forfaitaire au salarie : 6 mois de salaire (L8223-1)</li>
          </ul>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">2. Faux statut auto-entrepreneur</h3>
          <p>Un cuisinier ou serveur en micro-entreprise qui travaille uniquement pour un seul restaurant, avec horaires imposes et materiel fourni, est considere comme un <strong>salarie deguise</strong>. Requalification automatique en CDI sur 3 ans + redressement URSSAF + indemnites licenciement abusif.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">3. Defaut de visite medicale</h3>
          <p>Sanction : 1 500 EUR par salarie non vu en visite d'information et de prevention (VIP) dans les 3 mois suivant l'embauche. Frequent en restauration ou les nouveaux arrivants ne sont pas systematiquement envoyes au Service de Prevention et Sante au Travail (SPST).</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">4. Heures supplementaires non payees</h3>
          <p>L'oubli de majoration des heures sup HCR (10/20/50%) constitue du <strong>travail dissimule partiel</strong>. Prud'hommes : rappel de salaires sur 3 ans + 50% indemnite forfaitaire + dommages-interets. Cout median : 8 500 EUR par salarie.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">5. Repas non integres au brut</h3>
          <p>L'avantage en nature repas (4,22 EUR/repas en 2026) doit etre integre au brut soumis a cotisations. Oubli = redressement URSSAF + majoration 25%. Calcul : 2 repas/jour x 22 jours x 4,22 EUR = 185,68 EUR a integrer mensuellement.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">6. CDD/extras requalifies</h3>
          <p>Cas le plus frequent en restauration. Voir section 3 et 4. Cout moyen : <strong>15 000 a 25 000 EUR par salarie requalifie</strong>.</p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">7. Periode d'essai mal redigee</h3>
          <p>Periode non prevue au contrat, renouvellement non accepte par ecrit, duree excessive : la rupture en cours d'essai est requalifiee en licenciement sans cause reelle. Bareme Macron : 1-3 mois de salaire selon anciennete.</p>

          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 my-6">
            <p className="text-sm font-semibold text-amber-700 mb-1">Cout median d'un controle URSSAF reussi en restauration (2025)</p>
            <p className="text-sm text-amber-600">23 400 EUR de redressement + 5 200 EUR de majorations. <strong>78% des controles aboutissent a un redressement</strong> dans le secteur HCR (source URSSAF Caisse Nationale, rapport activite 2024).</p>
          </div>
        </Section>

        <Section icon={<Briefcase className="w-5 h-5" />} number="10" title="Cas pratique : restaurant 8 salaries" id="cas-pratique">
          <p>Brasserie parisienne ouverte 6j/7, CA HT 720 000 EUR, equipe composee de :</p>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Poste</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Contrat</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Brut/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cout total/mois</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Cout annuel</th>
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
          <p className="text-xs text-mono-500 mt-2">* Net d'aide unique 6 000 EUR/an versee par l'Etat</p>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 my-6">
            <p className="font-bold text-mono-100 mb-3">Analyse</p>
            <ul className="space-y-2 text-[#374151]">
              <li>Cout personnel total : <strong>259 140 EUR/an</strong></li>
              <li>Ratio cout personnel / CA HT : <strong>36%</strong> (objectif HCR 30-35% pour une brasserie)</li>
              <li>Coefficient moyen brut → total : <strong>1,32</strong></li>
              <li>Economie grace a l'apprenti : <strong>~24 500 EUR/an</strong> vs CDI equivalent</li>
              <li>Economie grace aux extras vs CDI temps partiel : <strong>~6 000 EUR/an</strong></li>
            </ul>
            <p className="mt-3 text-sm">Le ratio 36% est legerement au-dessus de la cible. Action prioritaire : ajuster le planning par <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-600 hover:underline">tranches de creux et pics</Link>, augmenter la part d'apprentis (passer de 1 a 2 alternants ferait baisser le ratio a 33%).</p>
          </div>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et references officielles</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>Convention Collective Nationale HCR (IDCC 1979), Legifrance — texte etendu en vigueur 2026</li>
            <li>Code du travail, articles L1221-1 a L1245-2 (CDI/CDD), L1242-2 (contrats d'usage), L1244-2 (saisonnier)</li>
            <li>URSSAF Caisse Nationale, baremes 2026 reduction generale des cotisations patronales</li>
            <li>Ministere du Travail, baremes apprentissage 2026 et aide unique</li>
            <li>Bareme Macron (article L1235-3 Code du travail), indemnites prud'homales</li>
            <li>OPCO Mobilites, financement formation HCR 2026</li>
            <li>HCR Prevoyance, regime de mutuelle obligatoire branche restauration</li>
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
              <p className="text-sm text-mono-400">Taux URSSAF 2026, reduction Fillon, fiche de paie cuisinier, exonerations apprentis.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Reduire le cout personnel</p>
              <p className="text-sm text-mono-400">5 leviers pour economiser 10-20% sur votre masse salariale sans licencier.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Formation du personnel</p>
              <p className="text-sm text-mono-400">OPCO, CPF, ROI formation, plan 2026 et formations prioritaires en restauration.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul de marge restaurant</p>
              <p className="text-sm text-mono-400">Methode complete : food cost, coefficient multiplicateur, marge brute et nette.</p>
            </Link>
            <Link to="/blog/prime-cost" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Prime cost restaurant</p>
              <p className="text-sm text-mono-400">Indicateur cle food cost + cout personnel. Objectifs par type d'etablissement.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Seuil de rentabilite</p>
              <p className="text-sm text-mono-400">CA minimum a realiser pour couvrir charges fixes incluant masse salariale.</p>
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
      <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Maitrisez vos couts RH avec RestauMargin</h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">Module RH : cout employeur reel par poste, plannings optimises, alertes heures supplementaires, simulation embauche CDI/CDD/extra/apprenti.</p>
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
    <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
        <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
          <ChefHat className="w-6 h-6 text-teal-600" />
          RestauMargin
        </Link>
        <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
      </div>
    </footer>
  );
}
