import { Link } from 'react-router-dom';
import { ChefHat, Users, ShieldCheck, Calculator, Scale, CreditCard, FileText, Briefcase, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Pourboires en restauration : legislation, fiscalite et repartition 2026"
   Mots-cles cibles : pourboires restaurant, fiscalite pourboires, exoneration
   pourboires 2026, repartition pourboires restaurant, pourboire carte bancaire restaurant
   ~2 600 mots — EAT, FAQ x5, Article, Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Le pourboire est-il obligatoire pour le client en France ?",
    answer: "Non. En France, le service est théoriquement compris dans le prix affiché à la carte, contrairement à des pays comme les États-Unis. Le pourboire reste un geste volontaire du client, que ce soit en espèces ou via l'option proposée sur le terminal de paiement. Un restaurant ne peut pas légalement imposer un pourcentage de service non modifiable en le faisant passer pour un pourboire."
  },
  {
    question: "Un restaurateur peut-il garder une partie des pourboires pour l'entreprise ?",
    answer: "Non. Le pourboire appartient au salarié qui l'a reçu, qu'il soit versé en espèces ou par carte bancaire. L'employeur n'a aucun droit de rétention et doit être en mesure de justifier, notamment via un registre, que les sommes encaissées par carte ont bien été intégralement reversées au personnel concerné."
  },
  {
    question: "Jusqu'à quand l'exonération fiscale et sociale des pourboires s'applique-t-elle ?",
    answer: "La loi de finances pour 2026 a prorogé le dispositif jusqu'au 31 décembre 2028. C'est la reconduction la plus longue depuis la création de la mesure par la loi du 16 août 2022, initialement pensée comme temporaire."
  },
  {
    question: "Un salarié payé au-dessus de 1,6 SMIC peut-il quand même recevoir des pourboires ?",
    answer: "Oui, rien n'interdit qu'il en reçoive, mais ils ne bénéficient plus de l'exonération d'impôt sur le revenu et de cotisations sociales au-delà de ce seuil. Ils sont alors traités comme un complément de rémunération classique, soumis aux charges habituelles."
  },
  {
    question: "Faut-il déclarer les pourboires même s'ils sont exonérés ?",
    answer: "Oui. Un pourboire exonéré doit malgré tout apparaître, identifié comme tel, sur le bulletin de paie et dans la DSN avec le code d'exonération approprié. C'est cette mention qui permet de justifier l'exonération en cas de contrôle URSSAF — l'absence totale de trace est un risque en soi, indépendamment du montant réellement versé."
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
  headline: 'Pourboires en restauration : législation, fiscalité et répartition en 2026',
  description: "À qui appartiennent les pourboires au restaurant, comment les répartir sans perdre l'exonération, et jusqu'à quand l'exonération fiscale et sociale s'applique. Guide complet avec cas chiffré.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
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
    <div className="min-h-screen">
      <SEOHead
        title="Pourboires en restauration : législation, fiscalité et répartition 2026"
        description="Pourboires au restaurant en 2026 : à qui ils appartiennent, comment les répartir sans perdre l'exonération, et jusqu'à quand l'exonération fiscale et sociale s'applique. Guide complet avec cas chiffré."
        path="/blog/pourboires-restaurant-legislation-fiscalite"
        type="article"
        schema={[faqSchema, breadcrumbSchema, articleSchema]}
      />

      {/* Navbar */}
      <PublicHeader />

      {/* Hero */}
      <BlogArticleHero
        category="Juridique"
        readTime="11 min"
        date="Septembre 2026"
        title="Pourboires en restauration : législation, fiscalité et répartition en 2026"
        accentWord="Pourboires"
        subtitle="À qui appartiennent les pourboires, comment les répartir sans perdre l'exonération, et jusqu'à quand l'exonération fiscale et sociale s'applique. Guide complet avec cas chiffré."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-09-14" readTime="11 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Un serveur encaisse <strong>340 EUR</strong> de pourboires en carte bancaire sur la semaine. Le gérant les reverse-t-il en intégralité ? Peut-il en garder une part pour la cuisine ? Doivent-ils apparaître sur le bulletin de paie ? Trois questions, et la majorité des restaurateurs n'ont qu'une réponse approximative — au risque de perdre une exonération sociale et fiscale qui peut représenter plusieurs centaines d'euros par mois et par salarié. Depuis la loi du 16 août 2022, le régime du pourboire a changé de nature : ce n'est plus un simple geste de générosité informel, c'est un dispositif encadré, avec des règles de répartition strictes et une fenêtre d'exonération qui vient d'être prolongée jusqu'en 2028.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#appartiennent" className="hover:text-teal-600 transition-colors">1. À qui appartiennent les pourboires ?</a></li>
            <li><a href="#exoneration" className="hover:text-teal-600 transition-colors">2. Exonération fiscale et sociale : ce qui change en 2026</a></li>
            <li><a href="#plafond" className="hover:text-teal-600 transition-colors">3. Le plafond de 1,6 SMIC expliqué avec les chiffres 2026</a></li>
            <li><a href="#repartition" className="hover:text-teal-600 transition-colors">4. Comment répartir les pourboires sans perdre l'exonération</a></li>
            <li><a href="#carte-bancaire" className="hover:text-teal-600 transition-colors">5. Pourboire par carte bancaire : mise en place</a></li>
            <li><a href="#declarer" className="hover:text-teal-600 transition-colors">6. Déclarer les pourboires : bulletin de paie et DSN</a></li>
            <li><a href="#cas-chiffre" className="hover:text-teal-600 transition-colors">7. Cas chiffré : un restaurant de 25 couverts/service</a></li>
            <li><a href="#erreurs" className="hover:text-teal-600 transition-colors">8. Erreurs fréquentes qui font perdre l'exonération</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="appartiennent" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">1. À qui appartiennent les pourboires ?</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le principe posé par le droit du travail est net : <strong>le pourboire appartient au salarié qui l'a reçu</strong>, et non à l'employeur. Qu'il soit glissé en espèces sur la table ou ajouté sur le terminal de paiement, l'employeur n'a aucun droit de rétention sur cette somme — il ne peut ni la conserver pour l'entreprise, ni la faire disparaître dans la trésorerie générale.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">Concrètement, deux circuits coexistent :</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Le pourboire en espèces</strong>, remis directement de la main à la main. Aucune obligation légale de traçabilité ne pèse sur ce flux, mais un établissement prudent tient malgré tout un registre interne pour anticiper un contrôle URSSAF.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span><strong>Le pourboire par carte bancaire</strong>, encaissé par l'établissement au même titre que l'addition, puis reversé au personnel. Ce circuit est <strong>obligatoirement traçable</strong> : l'employeur doit pouvoir justifier, montant par montant, que la somme perçue au titre du pourboire a bien été reversée aux salariés concernés.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un point souvent mal compris : seuls les salariés <strong>en contact direct avec la clientèle</strong> ont vocation à percevoir le pourboire au sens strict du régime d'exonération — en pratique le personnel de salle (serveurs, chefs de rang, barmen, voituriers), pas systématiquement la cuisine.
          </p>
        </section>

        {/* Section 2 */}
        <section id="exoneration" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">2. Exonération fiscale et sociale : ce qui change en 2026</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La loi du 16 août 2022 relative aux mesures d'urgence pour la protection du pouvoir d'achat a instauré une exonération temporaire d'impôt sur le revenu et de cotisations sociales sur les pourboires volontaires des clients. Reconduite chaque année depuis, la loi de finances pour 2026 vient de la proroger une nouvelle fois, cette fois jusqu'au <strong>31 décembre 2028</strong> — la reconduction la plus longue depuis la création du dispositif.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">Concrètement, quand un pourboire respecte les conditions d'exonération, il échappe :</p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>à l'<strong>impôt sur le revenu</strong> pour le salarié qui le perçoit ;</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>aux <strong>cotisations sociales salariales et patronales</strong> habituellement dues sur un élément de rémunération.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pour l'employeur, l'intérêt est direct : un pourboire correctement exonéré ne pèse pas sur la masse salariale chargée — un levier complémentaire aux stratégies classiques de <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-600 hover:underline">réduction du coût du personnel</Link> — contrairement à une prime classique qui, elle, supporte l'intégralité des charges patronales. Pour le salarié, c'est un gain net immédiat : un pourboire de 100 EUR exonéré rapporte 100 EUR nets, quand une prime brute équivalente serait amputée d'environ 22% de cotisations salariales avant même l'impôt.
          </p>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4 my-4">
            <p className="text-sm font-semibold text-amber-700 mb-1">Ce que l'exonération ne couvre pas</p>
            <p className="text-sm text-amber-700">Un pourcentage de service imposé et facturé automatiquement au client (ce n'est plus un pourboire volontaire mais un élément de prix), ou un pourboire redistribué en dehors des règles de répartition prévues par le dispositif.</p>
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
            L'exonération n'est pas ouverte à tous les salariés sans condition de revenu : elle est réservée à ceux dont la <strong>rémunération est inférieure à 1,6 fois le SMIC</strong>. Le SMIC ayant été revalorisé deux fois en 2026, voici les repères à retenir :
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
            Un serveur payé 2 200 EUR brut par mois reste largement sous le plafond toute l'année et bénéficie de l'exonération complète. Un chef de rang expérimenté payé 3 100 EUR brut, en revanche, dépasse le plafond depuis le 1er juin 2026 : ses pourboires perçus après cette date ne sont plus exonérés.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Point de vigilance</strong> : ce plafond s'apprécie salarié par salarié, mois par mois. Un établissement qui verse une prime exceptionnelle ou des heures supplémentaires massives un mois donné peut faire basculer temporairement un salarié au-dessus du seuil — et donc rendre ses pourboires de ce mois-là imposables, même si le reste de l'année il en était exonéré. Pour éviter l'erreur, voir aussi le détail des <Link to="/blog/charges-sociales-restauration" className="text-teal-600 hover:underline">charges sociales en restauration</Link>.
          </p>
        </section>

        {/* Section 4 */}
        <section id="repartition" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">4. Comment répartir les pourboires sans perdre l'exonération</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            C'est le point qui piège le plus de restaurateurs : <strong>la répartition des pourboires n'est pas libre si l'on veut conserver l'exonération</strong>. Dès que l'établissement élargit la répartition au-delà du personnel en contact client — typiquement en partageant systématiquement avec la cuisine — il sort du cadre protégé et s'expose à un redressement URSSAF.
          </p>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Le pourboire individuel</strong> — chaque serveur garde ce qu'il a personnellement reçu. Simple, mais générateur de tensions si la répartition des tables est inégale.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Le tronc collectif entre personnel de salle</strong> — pourboires CB et espèces mis en commun puis répartis selon une clé définie à l'avance. Le modèle le plus répandu, et il reste <strong>compatible avec l'exonération</strong> tant que la répartition se limite au personnel en contact clientèle.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /><span><strong>Le partage salle-cuisine</strong> — légalement possible, mais cela <strong>fait sortir la totalité de la somme redistribuée du régime d'exonération</strong>. Pour associer la cuisine, mieux vaut une prime spécifique distincte du pourboire.</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Règle pratique : dès que la clé de répartition sort du périmètre "contact client direct", il faut soit accepter la perte d'exonération sur les sommes concernées, soit formaliser un autre mécanisme de partage pour la cuisine, sans le confondre avec le pourboire proprement dit.
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
            Le pourboire CB s'est banalisé depuis que les terminaux de paiement proposent une option dédiée. Selon une étude CSA de 2021, <strong>35% des Français déclarent ne pas laisser de pourboire faute d'avoir du liquide sur eux</strong> — activer l'option CB revient donc à récupérer une part significative de pourboires qui auraient sinon été perdus.
          </p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Vérifier auprès du prestataire de paiement</strong> que l'option pourboire isole ces montants du chiffre d'affaires encaissé — un pourboire mal categorise peut se retrouver comptabilisé à tort comme du CA soumis à TVA.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Définir la clé de répartition avant l'activation</strong>, pas après.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Informer explicitement le personnel</strong> que l'intégralité du pourboire CB doit transiter par un registre traçable avant reversement.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" /><span><strong>Ne jamais présenter le pourboire CB comme incluant le service</strong> : en France, le service est théoriquement compris dans le prix affiché.</span></li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="declarer" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">6. Déclarer les pourboires : bulletin de paie et DSN</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Même exonérés, les pourboires ne sont pas absents de la paie : ils doivent apparaître, identifiés comme tels, sur le bulletin de salaire et être reportés dans la déclaration sociale nominative (DSN) avec le bon code d'exonération. Un pourboire "invisible" qui n'apparaîtrait nulle part serait au contraire un signal d'alerte, susceptible d'être requalifié en travail dissimulé partiel.
          </p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>Le montant du pourboire exonéré est indiqué séparément du salaire de base, sans charges appliquées dessus.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>Dès qu'un salarié franchit le plafond de 1,6 SMIC sur un mois donné, la part de pourboire de ce mois bascule en assiette de cotisations classique.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>En cas de tronc collectif, la répartition individuelle doit être documentée avant intégration en paie : l'URSSAF peut demander la clé de calcul utilisée, pas seulement le montant final versé.</span></li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="cas-chiffre" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">7. Cas chiffré : un restaurant de 25 couverts/service</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Prenons un exemple fictif : un bistrot qui réalise en moyenne 25 couverts par service, deux services par jour, 6 jours sur sept, ticket moyen 32 EUR. Chiffre d'affaires hebdomadaire : environ 9 600 EUR. Avec un taux de pourboire moyen de 3% de l'addition, la masse de pourboires hebdomadaire s'élève à environ <strong>288 EUR</strong>.
          </p>
          <div className="bg-mono-975 rounded-xl p-4 mb-4 font-mono text-sm text-mono-100 space-y-1">
            <div>Pourboires hebdo (tronc collectif, 3 serveurs) : 288 EUR</div>
            <div>Par serveur / semaine : ~96 EUR</div>
            <div>Par serveur / mois (net intégral, exonéré) : 384 EUR</div>
            <div>Équivalent prime brute pour même reste-à-vivre : ~490 EUR</div>
            <div>Sur l'année, par serveur : plus de 4 600 EUR nets</div>
            <div className="pt-2 font-bold border-t border-mono-900">Charges patronales évitées (3 serveurs, année) : ~6 000 EUR</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Pour l'employeur, une requalification en élément de salaire classique aurait généré environ 165 EUR de cotisations patronales supplémentaires par mois et par salarié — près de 6 000 EUR de charges en plus sur l'année si l'exonération n'était pas respectée.
          </p>
        </section>

        {/* Section 8 */}
        <section id="erreurs" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-mono-100">8. Erreurs fréquentes qui font perdre l'exonération</h2>
          </div>
          <ul className="space-y-3 text-[#374151]">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Retenir une part du pourboire CB pour l'établissement.</strong> Même un prélèvement présenté comme "frais de gestion du terminal" est en principe injustifiable.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Étendre systématiquement le partage à la cuisine</strong> sans distinguer ce partage du régime d'exonération.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Ne tenir aucun registre</strong> des pourboires CB perçus et reversés — en cas de contrôle, l'absence de traçabilité est interprétée en défaveur de l'employeur.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Oublier de suivre le plafond de 1,6 SMIC mois par mois</strong>, notamment lors des mois à forte activité.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" /><span><strong>Confondre pourboire volontaire et service obligatoire facturé</strong> : un pourcentage de service ajouté automatiquement, sans que le client puisse le refuser, n'est pas un pourboire au sens du dispositif.</span></li>
          </ul>
        </section>

        <BlogAuthor publishedDate="2026-09-14" readTime="11 min" variant="footer" />

        {/* Sources */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-bold text-mono-100 mb-4">Sources et références</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>LegiFiscal — prorogation de l'exonération des pourboires jusqu'en 2028 (loi de finances 2026)</li>
            <li>Urssaf.fr — régime social des pourboires exonérés</li>
            <li>info.gouv.fr — revalorisations du SMIC janvier et juin 2026</li>
            <li>Socic — plafond de 1,6 SMIC applicable à l'exonération des pourboires</li>
            <li>Étude CSA 2021 sur les habitudes de paiement des pourboires en France</li>
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Suivez vos marges et vos coûts de personnel en un coup d'oeil</h2>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed max-w-xl mx-auto">
            Sans jongler entre tableurs et bulletins de paie : essayez RestauMargin gratuitement et pilotez votre rentabilité en temps réel.
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
              <p className="text-sm text-mono-400">Taux 2026, réduction Fillon, fiche de paie détaillée.</p>
            </Link>
            <Link to="/blog/contrat-travail-restauration-guide" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Contrat de travail en restauration</p>
              <p className="text-sm text-mono-400">CDI, CDD, extras HCR, apprentissage : coûts et risques.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Réduire le coût personnel</p>
              <p className="text-sm text-mono-400">5 leviers pour économiser 10-20% sur votre masse salariale.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-5 border border-mono-900 rounded-xl hover:border-teal-600 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul de marge restaurant</p>
              <p className="text-sm text-mono-400">Méthode complète : food cost, coefficient, marge brute/nette.</p>
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
