import { Link } from 'react-router-dom';
import {
  ChefHat,
  Users,
  LayoutGrid,
  TrendingDown,
  HeartPulse,
  MessageSquare,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Brigade de cuisine : organisation, postes et gestion du stress"
   Mot-clé principal : brigade cuisine restaurant
   ~2 500 mots — light/dark mode, W&B, Tailwind
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Faut-il recréer la brigade Escoffier complète dans un petit restaurant ?',
    answer:
      "Non. La pyramide Escoffier reste une référence culturelle et un vocabulaire commun du métier, mais son application intégrale (dix stations spécialisées) ne concerne que les établissements de très forte capacité ou gastronomiques à prix élevé. Un bistrot de 30 couverts fonctionne avec une brigade compressée de 2 à 3 personnes polyvalentes, en gardant le principe de hiérarchie claire, pas le nombre de postes.",
  },
  {
    question: 'Combien de personnes faut-il en cuisine pour 50 couverts par service ?',
    answer:
      "Il n'existe pas de ratio universel : la complexité de la carte compte autant que le nombre de couverts. À titre de repère, un restaurant de cette taille fonctionne généralement avec 4 à 6 personnes en cuisine si la carte reste raisonnable (moins de 15 plats), davantage si la carte est large ou si une part importante des plats est préparée à la commande plutôt qu'en amont.",
  },
  {
    question: 'Le rôle de sous-chef a-t-il disparu des brigades modernes ?',
    answer:
      'Il a surtout fusionné avec celui de chef de partie senior dans les établissements de taille moyenne : cette personne prend les fonctions de second sans que le poste soit formellement distinct sur la fiche de paie. Le rôle de sous-chef à part entière reste présent dans les brigades de plus de 6-7 personnes, où la charge de coordination justifie un poste dédié.',
  },
  {
    question: 'Le DUERP doit-il vraiment couvrir le stress, ou seulement les risques physiques (coupures, brûlures) ?',
    answer:
      "Le DUERP doit couvrir l'ensemble des risques professionnels, ce qui inclut depuis plusieurs années les risques psychosociaux (charge mentale, épuisement, tensions d'équipe), pas seulement les risques physiques traditionnellement associés à la cuisine. Un document qui ne traite que les risques physiques est incomplet au regard de l'obligation de sécurité de l'employeur.",
  },
  {
    question: 'Comment savoir si ma brigade est en sous-effectif chronique plutôt qu\'en simple coup de feu ponctuel ?',
    answer:
      "Un coup de feu ponctuel se résout en fin de service et ne laisse pas de trace durable. Le sous-effectif chronique se repère à des signaux répétés : heures supplémentaires systématiques sur plusieurs semaines, erreurs d'envoi en hausse, arrêts maladie de courte durée qui se multiplient, ou brigade qui refuse des réservations un jour normalement calme faute de personnel disponible. Trois de ces signaux réunis sur un mois justifient une révision immédiate du dimensionnement plutôt qu'un simple ajustement de planning.",
  },
];

const tocItems = [
  { id: 'pyramide-escoffier', label: 'La brigade classique : la pyramide Escoffier' },
  { id: 'brigade-moderne', label: 'La brigade moderne : ce qui a vraiment changé' },
  { id: 'organiser-postes', label: "Organiser les postes selon la taille de l'établissement" },
  { id: 'cout-reel', label: "Le coût réel d'une brigade mal organisée" },
  { id: 'stress-burnout', label: 'Stress et burnout en cuisine : chiffres et obligation légale' },
  { id: 'communication', label: 'Communication chef-équipe : les rituels qui font la différence' },
  { id: 'turnover', label: 'Casser la spirale du turnover' },
];

export default function BlogBrigadeCuisine() {
  const pageTitle = 'Brigade de cuisine : organisation, postes et gestion du stress';
  const pageDescription =
    "La pyramide Escoffier adaptée à un vrai restaurant en 2026 : dimensionnement par taille d'établissement, coût chiffré d'un turnover à 50 %, obligation légale du DUERP face au burnout, et rituels de communication chef-équipe.";
  const slug = 'brigade-cuisine-organisation-postes';
  const canonicalUrl = `https://www.restaumargin.fr/blog/${slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    author: { '@type': 'Organization', name: 'RestauMargin' },
    publisher: {
      '@type': 'Organization',
      name: 'RestauMargin',
      logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/logo.png' },
    },
    datePublished: '2026-09-04',
    dateModified: '2026-09-07',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <>
      <SEOHead
        title={`${pageTitle} | RestauMargin`}
        description={pageDescription}
        path={`/blog/${slug}`}
        schema={[
          articleSchema,
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Brigade de cuisine', url: canonicalUrl },
          ]),
        ]}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <BlogArticleHero
          category="Organisation"
          title="Brigade de cuisine : organisation, postes et gestion du stress"
          subtitle="La pyramide Escoffier adaptée à un vrai restaurant, pas à un palace"
          readTime="10 min"
          date="7 septembre 2026"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <BlogAuthor publishedDate="2026-09-07" readTime="10 min" variant="header" />

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white leading-relaxed mb-6">
            Le secteur de l'hôtellerie-restauration affiche un turnover qui dépasse{' '}
            <strong>50 %</strong>, contre 15 % en moyenne dans le secteur privé. Une brigade qui
            tourne mal ne se voit pas seulement dans le service qui déborde un vendredi soir : elle
            se traduit en euros, sur la ligne « charges de personnel » du compte de résultat, et en
            arrêts maladie qui s'accumulent. Ce guide reprend la structure historique de la brigade
            Escoffier, explique comment l'adapter à la taille réelle d'un établissement en 2026,
            chiffre le coût d'une mauvaise organisation et donne des rituels concrets de
            communication chef-équipe pour limiter l'épuisement professionnel — le vrai levier
            derrière la fidélisation.
          </p>

          {/* Table des matières */}
          <nav className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <h2 className="font-semibold text-[#111111] dark:text-white mb-3">Sommaire</h2>
            <ol className="space-y-2">
              {tocItems.map((item, i) => (
                <li key={item.id} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </span>
                  <a href={`#${item.id}`} className="text-teal-600 hover:text-teal-500 text-sm transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="pyramide-escoffier" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                1. La brigade classique : la pyramide Escoffier
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              La brigade de cuisine telle qu'on l'enseigne encore dans les écoles hôtelières vient
              d'Auguste Escoffier, qui a formalisé au début du XX<sup>e</sup> siècle une organisation
              militaire calquée sur les cuisines de palace : chaque poste ne fait qu'une seule chose,
              mais la fait parfaitement, sans jamais empiéter sur le poste voisin.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Poste</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Rôle</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Niveau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {[
                    ['Chef de cuisine', 'Pilote la carte, les achats, le management, la marge globale', 'Direction'],
                    ['Sous-chef', 'Second du chef, coordonne la brigade en son absence', 'Encadrement'],
                    ['Chef de partie', "Responsable d'une station (sauces, poissons, viandes, garde-manger, entremets, pâtisserie)", 'Autonomie'],
                    ['Commis', "Exécute sous la responsabilité d'un chef de partie, prépare la mise en place", 'Exécution encadrée'],
                    ['Plongeur / aide de cuisine', 'Nettoyage, rangement, soutien logistique', 'Support'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td className="p-3 font-semibold text-[#111111] dark:text-white">{row[0]}</td>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">{row[1]}</td>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Dans sa version intégrale, la brigade compte jusqu'à dix stations spécialisées
              (saucier, poissonnier, rôtisseur, grillardin, entremétier, garde-manger, pâtissier,
              tournant qui remplace au pied levé, etc.). Cette architecture reste la référence
              culturelle du métier — c'est elle qu'on cite en école — mais elle correspond à une
              réalité de grand hôtel ou de restaurant gastronomique à forte capacité, pas à la
              majorité des établissements indépendants français.
            </p>
          </section>

          {/* Section 2 */}
          <section id="brigade-moderne" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                2. La brigade moderne : ce qui a vraiment changé
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              La quasi-totalité des restaurants indépendants, bistrots et brasseries fonctionnent
              aujourd'hui avec une <strong className="text-[#111111] dark:text-white">brigade compressée</strong> : trois à
              six personnes en cuisine, chacune polyvalente sur plusieurs postes plutôt que
              spécialisée sur un seul. Trois évolutions expliquent ce changement par rapport au
              modèle Escoffier :
            </p>
            <ul className="space-y-2 text-sm text-[#737373] dark:text-[#A3A3A3] mb-4">
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold shrink-0">•</span>
                <span><strong className="text-[#111111] dark:text-white">La polyvalence a remplacé la spécialisation.</strong> Un cuisinier moderne alterne dans le même service entre le froid, le chaud et parfois le dessert — l'établissement n'a simplement pas la masse critique pour dédier une personne à une seule station.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold shrink-0">•</span>
                <span><strong className="text-[#111111] dark:text-white">Le rôle de sous-chef a souvent disparu</strong>, absorbé par un chef de partie senior qui fait aussi office de second.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold shrink-0">•</span>
                <span><strong className="text-[#111111] dark:text-white">La ligne de production a remplacé la logique par station</strong> : on organise désormais le poste de travail autour du flux du plat (froid → chaud → dressage → envoi) plutôt qu'autour d'une compétence figée.</span>
              </li>
            </ul>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Ce n'est pas un abandon de la rigueur Escoffier, mais son adaptation à une réalité
              économique : une brigade de dix personnes sur dix stations coûte en charges de
              personnel ce qu'un établissement de 40 couverts ne peut tout simplement pas absorber
              sur sa marge.
            </p>
          </section>

          {/* Section 3 */}
          <section id="organiser-postes" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                3. Organiser les postes selon la taille de l'établissement
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              La question n'est jamais « combien de postes Escoffier dois-je recréer », mais
              « combien de personnes ma capacité de couverts et mon panier moyen peuvent-elles
              réellement financer ».
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Taille de l'établissement</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Effectif cuisine</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Organisation typique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {[
                    ['Petit bistrot (< 30 couverts/service)', '2 à 3 personnes', '1 chef polyvalent + 1-2 commis, pas de spécialisation par station'],
                    ['Restaurant moyen (30-80 couverts/service)', '4 à 6 personnes', '1 chef + 1 second + 2-3 chefs de partie polyvalents + 1 commis/plongeur'],
                    ['Brasserie / forte capacité (80+ couverts/service)', '7 à 12 personnes', 'Chef + sous-chef + chefs de partie par grande famille (froid, chaud, pâtisserie) + commis dédiés'],
                    ['Restaurant gastronomique étoilé', '8 à 15+', 'Brigade proche du modèle Escoffier complet, ratio cuisinier/couvert assumé par le positionnement prix'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td className="p-3 font-semibold text-[#111111] dark:text-white">{row[0]}</td>
                      <td className="p-3 text-teal-700 dark:text-teal-400 font-medium">{row[1]}</td>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Le repère à retenir pour piloter sa marge : dans la restauration traditionnelle, les
              charges de personnel représentent généralement entre 28 et 35 % du chiffre d'affaires.
              Un poste ajouté « au cas où » sans que le volume de couverts le justifie fait
              immédiatement dériver ce ratio et grignote une marge déjà comprimée par le food cost —
              le même arbitrage que celui détaillé dans notre guide sur{' '}
              <Link to="/blog/kpi-restaurateur" className="text-teal-600 hover:text-teal-500 underline underline-offset-2">
                les 10 KPI essentiels du restaurateur
              </Link>.
            </p>
          </section>

          {/* Section 4 */}
          <section id="cout-reel" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                4. Le coût réel d'une brigade mal organisée
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Une brigade mal dimensionnée ou mal organisée ne se traduit pas seulement par du
              stress en service : elle a un coût chiffrable, qui commence par le turnover.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Turnover hôtellerie-restauration', value: '> 50 %' },
                { label: 'Turnover moyen secteur privé', value: '~15 %' },
                { label: 'Salariés restant en poste + d\'1 an', value: '2/3' },
                { label: 'Coût de remplacement / an (brigade de 10)', value: '15-25 k€' },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-teal-600">{s.value}</p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Selon l'INSEE, seuls deux tiers des salariés du secteur hôtellerie-restauration
              conservent leur poste plus d'un an, et le taux de turnover y dépasse{' '}
              <strong className="text-[#111111] dark:text-white">50 %</strong> — un écart qui fait de la restauration
              l'un des secteurs les plus instables de l'économie française. Pour une brigade de dix
              personnes soumise à ce taux, le coût de remplacement (recrutement, formation, perte de
              productivité) est estimé entre <strong className="text-[#111111] dark:text-white">15 000 et 25 000 €
              par an</strong> — un montant qui n'apparaît nulle part explicitement au bilan, mais qui
              grève directement la rentabilité.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Poste (grille HCR, IDCC 1979)</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Salaire brut mensuel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {[
                    ['Commis débutant', '~1 870 €'],
                    ['Cuisinier confirmé', '~2 200 €'],
                    ['Chef de partie', '~2 650 €'],
                    ['Chef de partie (étoilé / luxe)', '3 000 à 3 500 €'],
                    ["Chef exécutif", "jusqu'à 4 500 €"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td className="p-3 font-semibold text-[#111111] dark:text-white">{row[0]}</td>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                <strong>Cas chiffré — brigade de 5 personnes.</strong> À 50 % de turnover annuel, 2 à
                3 postes se libèrent dans l'année. Pour le seul poste de commis (1 870 € brut/mois) :
                trois semaines de vacance avant l'embauche d'un remplaçant, puis un mois de montée
                en compétence où le nouveau commis produit environ 30 % moins vite qu'un titulaire
                installé. Rien que sur ce poste, le delta se chiffre en plusieurs milliers d'euros
                une fois les heures supplémentaires de la brigade restante intégrées.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="stress-burnout" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                5. Stress et burnout en cuisine : les chiffres et l'obligation légale
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Le turnover et le stress s'alimentent mutuellement : une brigade en sous-effectif
              chronique use plus vite les personnes en poste, ce qui accélère les départs, ce qui
              recrée le sous-effectif.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Indicateur</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Donnée 2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {[
                    ['Salariés français en détresse psychologique (record depuis 2020)', '50 %'],
                    ['Salariés à risque de burnout', '32 %'],
                    ['Salariés à risque sévère de burnout', '11 %'],
                    ['Personnel en burnout / pré-burnout en restauration', '15 à 20 %'],
                    ['Même indicateur avant la crise sanitaire', '5 à 10 %'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">{row[0]}</td>
                      <td className="p-3 font-bold text-teal-600">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Ce que la loi impose déjà.</strong> Le Document Unique d'Évaluation des
                Risques Professionnels (DUERP) est obligatoire dès le premier salarié (article
                R4121-1 du Code du travail). Il doit recenser les situations dangereuses — glissades,
                coupures, brûlures, troubles musculosquelettiques — mais aussi les risques
                psychosociaux (charge mentale, épuisement, conflits d'équipe). Il doit être conservé
                40 ans et mis à jour au moins une fois par an.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="communication" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                6. Communication chef-équipe : les rituels qui font la différence
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Au-delà de l'obligation réglementaire, ce sont des rituels simples et réguliers — pas
              une politique RH complexe — qui font la différence entre une brigade qui tient et une
              brigade qui s'épuise.
            </p>
            <ul className="space-y-3">
              {[
                { title: "Le briefing d'avant-service (10 min max)", detail: 'Réservations du jour, ruptures de stock, plats à pousser en priorité — une brigade qui découvre une rupture en plein coup de feu perd un temps de réaction qui se traduit en stress collectif.' },
                { title: "Le debrief d'après-service (5 min)", detail: 'Ce qui a coincé, ce qui a bien fonctionné — dit à froid, pas relancé le lendemain sous forme de reproche isolé.' },
                { title: 'Une seule voix qui donne les priorités pendant le coup de feu', detail: "Le chef ou le second annonce l'ordre des envois ; les chefs de partie exécutent sans réinterpréter chacun de leur côté." },
                { title: 'Un espace de parole individuel mensuel', detail: "10 minutes en dehors du service, pour un commis qui n'oserait pas remonter une difficulté en pleine équipe." },
                { title: 'La rotation planifiée des postes les plus pénibles', detail: "Plonge, froid en été, chaud en été — plutôt que leur attribution permanente à la même personne." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    •
                  </div>
                  <div>
                    <span className="font-semibold text-[#111111] dark:text-white">{item.title} : </span>
                    <span className="text-[#737373] dark:text-[#A3A3A3] text-sm">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 7 */}
          <section id="turnover" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                7. Casser la spirale du turnover
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Trois leviers concrets permettent de sortir du cercle sous-effectif → stress → départ
              → sous-effectif, sans attendre une réforme du secteur :
            </p>
            <ol className="space-y-2 text-sm text-[#737373] dark:text-[#A3A3A3]">
              <li>
                <strong className="text-[#111111] dark:text-white">1. Recruter en continu, pas en urgence.</strong>{' '}
                Un recrutement lancé après un départ commence toujours avec un mois de retard.
                Maintenir un vivier de candidats identifiés réduit le délai de remplacement.
              </li>
              <li>
                <strong className="text-[#111111] dark:text-white">2. Suivre le coût du turnover comme un indicateur de gestion.</strong>{' '}
                Le chiffrer poste par poste permet de justifier un budget de fidélisation dont le
                retour sur investissement dépasse largement son coût — voir{' '}
                <Link to="/blog/kpi-restaurateur" className="text-teal-600 hover:text-teal-500 underline underline-offset-2">
                  les 10 KPI essentiels du restaurateur
                </Link>.
              </li>
              <li>
                <strong className="text-[#111111] dark:text-white">3. Dimensionner la brigade sur le volume réel de couverts, pas sur une habitude héritée.</strong>{' '}
                Le bon dimensionnement se révise chaque trimestre, pas une fois par an.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                  <h3 className="font-semibold text-[#111111] dark:text-white mb-2">{item.question}</h3>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white dark:text-[#111111] mb-3">
              Ce qui protège vraiment votre marge
            </h2>
            <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 max-w-md mx-auto">
              RestauMargin calcule votre food cost réel et suit vos charges de personnel en
              parallèle, pour vérifier que chaque décision d'effectif reste compatible avec la marge
              que vous vous êtes fixée.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <BlogAuthor publishedDate="2026-09-07" readTime="10 min" variant="footer" />

          {/* Maillage interne */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <p className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Articles liés</p>
            <ul className="space-y-2 text-sm mb-6">
              {[
                ['/blog/kpi-restaurateur', 'Les 10 KPI essentiels du restaurateur'],
                ['/blog/no-show-restaurant-solutions', 'No-show au restaurant : solutions'],
                ['/blog/avis-google-negatifs-restaurant', 'Avis Google négatifs : la méthode'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="text-teal-600 hover:text-teal-500 underline underline-offset-2">{label}</Link>
                </li>
              ))}
            </ul>
            <Link to="/blog" className="text-sm text-teal-600 hover:text-teal-500 transition-colors">
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
