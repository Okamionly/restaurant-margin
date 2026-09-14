import { Link } from 'react-router-dom';
import { ChefHat, Users, ShieldCheck, Calculator, Scale, CreditCard, FileText, Briefcase, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Pourboires en restauration : legislation, fiscalite et repartition 2026"
   Mots-cles cibles : pourboires restaurant, fiscalite pourboires, exoneration
   pourboires 2026, repartition pourboires restaurant, pourboire carte bancaire restaurant
   ~2 600 mots — EAT, FAQ x5, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Le pourboire est-il obligatoire pour le client en France ?",
    answer: "Non. En France, le service est theoriquement compris dans le prix affiche a la carte, contrairement a des pays comme les Etats-Unis. Le pourboire reste un geste volontaire du client, que ce soit en especes ou via l'option proposee sur le terminal de paiement. Un restaurant ne peut pas legalement imposer un pourcentage de service non modifiable en le faisant passer pour un pourboire."
  },
  {
    question: "Un restaurateur peut-il garder une partie des pourboires pour l'entreprise ?",
    answer: "Non. Le pourboire appartient au salarie qui l'a reçu, qu'il soit verse en especes ou par carte bancaire. L'employeur n'a aucun droit de retention et doit etre en mesure de justifier, notamment via un registre, que les sommes encaissees par carte ont bien ete integralement reversees au personnel concerne."
  },
  {
    question: "Jusqu'a quand l'exoneration fiscale et sociale des pourboires s'applique-t-elle ?",
    answer: "La loi de finances pour 2026 a proroge le dispositif jusqu'au 31 decembre 2028. C'est la reconduction la plus longue depuis la creation de la mesure par la loi du 16 aout 2022, initialement pensee comme temporaire."
  },
  {
    question: "Un salarie paye au-dessus de 1,6 SMIC peut-il quand meme recevoir des pourboires ?",
    answer: "Oui, rien n'interdit qu'il en reçoive, mais ils ne beneficient plus de l'exoneration d'impot sur le revenu et de cotisations sociales au-dela de ce seuil. Ils sont alors traites comme un complement de remuneration classique, soumis aux charges habituelles."
  },
  {
    question: "Faut-il declarer les pourboires meme s'ils sont exoneres ?",
    answer: "Oui. Un pourboire exonere doit malgre tout apparaitre, identifie comme tel, sur le bulletin de paie et dans la DSN avec le code d'exoneration approprie. C'est cette mention qui permet de justifier l'exoneration en cas de controle URSSAF — l'absence totale de trace est un risque en soi, independamment du montant reellement verse."
  }
];

const breadcrumbItems = [
  { name: "Accueil", url: "https://www.restaumargin.fr/" },
  { name: "Blog", url: "https://www.restaumargin.fr/blog" },
  { name: "Pourboires en restauration", url: "https://www.restaumargin.fr/blog/pourboires-restaurant-legislation-fiscalite" }
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pourboires en restauration : legislation, fiscalite et repartition en 2026',
  description: "A qui appartiennent les pourboires au restaurant, comment les repartir sans perdre l'exoneration, et jusqu'a quand l'exoneration fiscale et sociale s'applique. Guide complet avec cas chiffre.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La redaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' }
  },
  datePublished: '2026-09-14',
  dateModified: '2026-09-14',
  wordCount: 2600,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/pourboires-restaurant-legislation-fiscalite' }
};

export default function BlogPourboiresRestaurant() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Pourboires en restauration : legislation, fiscalite et repartition 2026"
        description="Pourboires au restaurant en 2026 : a qui ils appartiennent, comment les repartir sans perdre l'exoneration, et jusqu'a quand l'exoneration fiscale et sociale s'applique. Guide complet avec cas chiffre."
        path="/blog/pourboires-restaurant-legislation-fiscalite"
        type="article"
        schema={[faqSchema, breadcrumbSchema, articleSchema]}
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
        category="Juridique"
        readTime="11 min"
        date="Septembre 2026"
        title="Pourboires en restauration : legislation, fiscalite et repartition en 2026"
        accentWord="Pourboires"
        subtitle="A qui appartiennent les pourboires, comment les repartir sans perdre l'exoneration, et jusqu'a quand l'exoneration fiscale et sociale s'applique. Guide complet avec cas chiffre."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-09-14" readTime="11 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Un serveur encaisse <strong>340 EUR</strong> de pourboires en carte bancaire sur la semaine. Le gerant les reverse-t-il en integralite ? Peut-il en garder une part pour la cuisine ? Doivent-ils apparaitre sur le bulletin de paie ? Trois questions, et la majorite des restaurateurs n'ont qu'une reponse approximative — au risque de perdre une exoneration sociale et fiscale qui peut representer plusieurs centaines d'euros par mois et par salarie. Depuis la loi du 16 aout 2022, le regime du pourboire a change de nature : ce n'est plus un simple geste de generosite informel, c'est un dispositif encadre, avec des regles de repartition strictes et une fenetre d'exoneration qui vient d'etre prolongee jusqu'en 2028.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#appartiennent" className="hover:text-teal-600 transition-colors">1. A qui appartiennent les pourboires ?</a></li>
            <li><a href="#exoneration" className="hover:text-teal-600 transition-colors">2. Exoneration fiscale et sociale : ce qui change en 2026</a></li>
            <li><a href="#plafond" className="hover:text-teal-600 transition-colors">3. Le plafond de 1,6 SMIC expliqué avec les chiffres 2026</a></li>
            <li><a href="#repartition" className="hover:text-teal-600 transition-colors">4. Comment repartir les pourboires sans perdre l'exoneration</a></li>
            <li><a href="#carte-bancaire" className="hover:text-teal-600 transition-colors">5. Pourboire par carte bancaire : mise en place</a></li>
            <li><a href="#declarer" className="hover:text-teal-600 transition-colors">6. Declarer les pourboires : bulletin de paie et DSN</a></li>
            <li><a href="#cas-chiffre" className="hover:text-teal-600 transition-colors">7. Cas chiffre : un restaurant de 25 couverts/service</a></li>
            <li><a href="#erreurs" className="hover:text-teal-600 transition-colors">8. Erreurs frequentes qui font perdre l'exoneration</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="appartiennent" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. A qui appartiennent les pourboires ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le principe pose par le droit du travail est net : <strong>le pourboire appartient au salarie qui l'a reçu</strong>, et non a l'employeur. Qu'il soit glisse en especes sur la table ou ajoute sur le terminal de paiement, l'employeur n'a aucun droit de retention sur cette somme — il ne peut ni la conserver pour l'entreprise, ni la faire disparaitre dans la tresorerie generale.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">Concretement, deux circuits coexistent :</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Le pourboire en especes</strong>, remis directement de la main a la main. Aucune obligation legale de tracabilite ne pese sur ce flux, mais un etablissement prudent tient malgre tout un registre interne pour anticiper un controle URSSAF.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Le pourboire par carte bancaire</strong>, encaisse par l'etablissement au meme titre que l'addition, puis reverse au personnel. Ce circuit est <strong>obligatoirement tracable</strong> : l'employeur doit pouvoir justifier, montant par montant, que la somme perçue au titre du pourboire a bien ete reversee aux salaries concernes.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un point souvent mal compris : seuls les salaries <strong>en contact direct avec la clientele</strong> ont vocation a percevoir le pourboire au sens strict du regime d'exoneration — en pratique le personnel de salle (serveurs, chefs de rang, barmen, voituriers), pas systematiquement la cuisine.
          </p>
        </section>

        {/* Section 2 */}
        <section id="exoneration" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Exoneration fiscale et sociale : ce qui change en 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La loi du 16 aout 2022 relative aux mesures d'urgence pour la protection du pouvoir d'achat a instaure une exoneration temporaire d'impot sur le revenu et de cotisations sociales sur les pourboires volontaires des clients. Reconduite chaque annee depuis, la loi de finances pour 2026 vient de la proroger une nouvelle fois, cette fois jusqu'au <strong>31 decembre 2028</strong> — la reconduction la plus longue depuis la creation du dispositif.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">Concretement, quand un pourboire respecte les conditions d'exoneration, il echappe :</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>a l'<strong>impot sur le revenu</strong> pour le salarie qui le perçoit ;</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>aux <strong>cotisations sociales salariales et patronales</strong> habituellement dues sur un element de remuneration.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour l'employeur, l'interet est direct : un pourboire correctement exonere ne pese pas sur la masse salariale chargee — un levier complementaire aux strategies classiques de <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-600 hover:underline">reduction du cout du personnel</Link> — contrairement a une prime classique qui, elle, supporte l'integralite des charges patronales. Pour le salarie, c'est un gain net immediat : un pourboire de 100 EUR exonere rapporte 100 EUR nets, quand une prime brute equivalente serait amputee d'environ 22% de cotisations salariales avant meme l'impot.
          </p>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-amber-700 mb-1">Ce que l'exoneration ne couvre pas</p>
            <p className="text-sm text-amber-700">Un pourcentage de service impose et facture automatiquement au client (ce n'est plus un pourboire volontaire mais un element de prix), ou un pourboire redistribue en dehors des regles de repartition prevues par le dispositif.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="plafond" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">3. Le plafond de 1,6 SMIC expliqué avec les chiffres 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            L'exoneration n'est pas ouverte a tous les salaries sans condition de revenu : elle est reservee a ceux dont la <strong>remuneration est inferieure a 1,6 fois le SMIC</strong>. Le SMIC ayant ete revalorise deux fois en 2026, voici les reperes a retenir :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-mono-900 rounded-xl">
              <thead className="bg-mono-1000">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Date</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">SMIC brut mensuel</th>
                  <th className="px-4 py-3 text-left font-bold text-mono-100">Plafond 1,6 SMIC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-900"><td className="px-4 py-3">1er janvier 2026</td><td className="px-4 py-3 font-mono">1 823,03 EUR</td><td className="px-4 py-3 font-mono">environ 2 916,85 EUR</td></tr>
                <tr className="border-t border-mono-900 bg-mono-1000/40"><td className="px-4 py-3">1er juin 2026</td><td className="px-4 py-3 font-mono">1 867,02 EUR</td><td className="px-4 py-3 font-mono">environ 2 987,23 EUR</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un serveur paye 2 200 EUR brut par mois reste largement sous le plafond toute l'annee et beneficie de l'exoneration complete. Un chef de rang experimente paye 3 100 EUR brut, en revanche, depasse le plafond depuis le 1er juin 2026 : ses pourboires perçus apres cette date ne sont plus exoneres.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Point de vigilance</strong> : ce plafond s'apprecie salarie par salarie, mois par mois. Un etablissement qui verse une prime exceptionnelle ou des heures supplementaires massives un mois donne peut faire basculer temporairement un salarie au-dessus du seuil — et donc rendre ses pourboires de ce mois-la imposables, meme si le reste de l'annee il en etait exonere. Pour eviter l'erreur, voir aussi le detail des <Link to="/blog/charges-sociales-restauration" className="text-teal-600 hover:underline">charges sociales en restauration</Link>.
          </p>
        </section>

        {/* Section 4 */}
        <section id="repartition" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Comment repartir les pourboires sans perdre l'exoneration</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            C'est le point qui piege le plus de restaurateurs : <strong>la repartition des pourboires n'est pas libre si l'on veut conserver l'exoneration</strong>. Des que l'etablissement elargit la repartition au-dela du personnel en contact client — typiquement en partageant systematiquement avec la cuisine — il sort du cadre protege et s'expose a un redressement URSSAF.
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Le pourboire individuel</strong> — chaque serveur garde ce qu'il a personnellement reçu. Simple, mais generateur de tensions si la repartition des tables est inegale.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Le tronc collectif entre personnel de salle</strong> — pourboires CB et especes mis en commun puis repartis selon une cle definie a l'avance. Le modele le plus repandu, et il reste <strong>compatible avec l'exoneration</strong> tant que la repartition se limite au personnel en contact clientele.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Le partage salle-cuisine</strong> — legalement possible, mais cela <strong>fait sortir la totalite de la somme redistribuee du regime d'exoneration</strong>. Pour associer la cuisine, mieux vaut une prime specifique distincte du pourboire.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Regle pratique : des que la cle de repartition sort du perimetre "contact client direct", il faut soit accepter la perte d'exoneration sur les sommes concernees, soit formaliser un autre mecanisme de partage pour la cuisine, sans le confondre avec le pourboire proprement dit.
          </p>
        </section>

        {/* Section 5 */}
        <section id="carte-bancaire" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">5. Pourboire par carte bancaire : mise en place</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le pourboire CB s'est banalise depuis que les terminaux de paiement proposent une option dediee. Selon une etude CSA de 2021, <strong>35% des Français declarent ne pas laisser de pourboire faute d'avoir du liquide sur eux</strong> — activer l'option CB revient donc a recuperer une part significative de pourboires qui auraient sinon ete perdus.
          </p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Verifier aupres du prestataire de paiement</strong> que l'option pourboire isole ces montants du chiffre d'affaires encaisse — un pourboire mal categorise peut se retrouver comptabilise a tort comme du CA soumis a TVA.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Definir la cle de repartition avant l'activation</strong>, pas apres.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Informer explicitement le personnel</strong> que l'integralite du pourboire CB doit transiter par un registre tracable avant reversement.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Ne jamais presenter le pourboire CB comme incluant le service</strong> : en France, le service est theoriquement compris dans le prix affiche.</span></li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="declarer" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Declarer les pourboires : bulletin de paie et DSN</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Meme exoneres, les pourboires ne sont pas absents de la paie : ils doivent apparaitre, identifies comme tels, sur le bulletin de salaire et etre reportes dans la declaration sociale nominative (DSN) avec le bon code d'exoneration. Un pourboire "invisible" qui n'apparaitrait nulle part serait au contraire un signal d'alerte, susceptible d'etre requalifie en travail dissimule partiel.
          </p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>Le montant du pourboire exonere est indique separement du salaire de base, sans charges appliquees dessus.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>Des qu'un salarie franchit le plafond de 1,6 SMIC sur un mois donne, la part de pourboire de ce mois bascule en assiette de cotisations classique.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>En cas de tronc collectif, la repartition individuelle doit etre documentee avant integration en paie : l'URSSAF peut demander la cle de calcul utilisee, pas seulement le montant final verse.</span></li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="cas-chiffre" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">7. Cas chiffre : un restaurant de 25 couverts/service</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un bistrot parisien realise en moyenne 25 couverts par service, deux services par jour, 6 jours sur sept, ticket moyen 32 EUR. Chiffre d'affaires hebdomadaire : environ 9 600 EUR. Avec un taux de pourboire moyen de 3% de l'addition, la masse de pourboires hebdomadaire s'eleve a environ <strong>288 EUR</strong>.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Pourboires hebdo (tronc collectif, 3 serveurs) : 288 EUR</div>
            <div>Par serveur / semaine : ~96 EUR</div>
            <div>Par serveur / mois (net integral, exonere) : 384 EUR</div>
            <div>Equivalent prime brute pour meme reste-a-vivre : ~490 EUR</div>
            <div>Sur l'annee, par serveur : plus de 4 600 EUR nets</div>
            <div className="pt-2 font-bold border-t border-mono-900">Charges patronales evitees (3 serveurs, annee) : ~6 000 EUR</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Pour l'employeur, une requalification en element de salaire classique aurait genere environ 165 EUR de cotisations patronales supplementaires par mois et par salarie — pres de 6 000 EUR de charges en plus sur l'annee si l'exoneration n'etait pas respectee.
          </p>
        </section>

        {/* Section 8 */}
        <section id="erreurs" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">8. Erreurs frequentes qui font perdre l'exoneration</h2>
          </div>
          <ul className="space-y-3 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Retenir une part du pourboire CB pour l'etablissement.</strong> Meme un prelevement presente comme "frais de gestion du terminal" est en principe injustifiable.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Etendre systematiquement le partage a la cuisine</strong> sans distinguer ce partage du regime d'exoneration.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Ne tenir aucun registre</strong> des pourboires CB perçus et reverses — en cas de controle, l'absence de tracabilite est interpretee en defaveur de l'employeur.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Oublier de suivre le plafond de 1,6 SMIC mois par mois</strong>, notamment lors des mois a forte activite.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Confondre pourboire volontaire et service obligatoire facture</strong> : un pourcentage de service ajoute automatiquement, sans que le client puisse le refuser, n'est pas un pourboire au sens du dispositif.</span></li>
          </ul>
        </section>

        <BlogAuthor publishedDate="2026-09-14" readTime="11 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et references</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>LegiFiscal — prorogation de l'exoneration des pourboires jusqu'en 2028 (loi de finances 2026)</li>
            <li>Urssaf.fr — regime social des pourboires exoneres</li>
            <li>info.gouv.fr — revalorisations du SMIC janvier et juin 2026</li>
            <li>Socic — plafond de 1,6 SMIC applicable a l'exoneration des pourboires</li>
            <li>Etude CSA 2021 sur les habitudes de paiement des pourboires en France</li>
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Suivez vos marges et vos couts de personnel en un coup d'oeil</h2>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed max-w-xl mx-auto">
            Sans jongler entre tableurs et bulletins de paie : essayez RestauMargin gratuitement et pilotez votre rentabilite en temps reel.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Internal links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/charges-sociales-restauration" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Charges sociales en restauration</p>
              <p className="text-sm text-mono-400">Taux 2026, reduction Fillon, fiche de paie detaillee.</p>
            </Link>
            <Link to="/blog/contrat-travail-restauration-guide" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Contrat de travail en restauration</p>
              <p className="text-sm text-mono-400">CDI, CDD, extras HCR, apprentissage : couts et risques.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Reduire le cout personnel</p>
              <p className="text-sm text-mono-400">5 leviers pour economiser 10-20% sur votre masse salariale.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul de marge restaurant</p>
              <p className="text-sm text-mono-400">Methode complete : food cost, coefficient, marge brute/nette.</p>
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
