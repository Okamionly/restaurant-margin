import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MessageSquare,
  LayoutGrid,
  Calculator,
  ShieldAlert,
  Users,
  ArrowRight,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Avis Google negatifs au restaurant : la methode qui limite les degats"
   Mot-clé principal : avis google negatifs restaurant
   ~2 500 mots — light/dark mode, W&B, Tailwind
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Faut-il répondre à un avis 5 étoiles, ou seulement aux avis négatifs ?",
    answer:
      "Répondre systématiquement, positif ou négatif. Les enseignes qui répondent à tous leurs avis observent une progression de note plus rapide que celles qui ne réagissent qu'aux plaintes — et cela montre aux prospects un établissement engagé, pas seulement en gestion de crise.",
  },
  {
    question: "Peut-on payer pour faire remonter des avis positifs et masquer un avis négatif ?",
    answer:
      "Non, ni au sens technique (Google trie par pertinence et récence, pas par paiement) ni au sens légal (acheter des avis est une pratique commerciale trompeuse sanctionnable). La seule stratégie durable est d'augmenter le volume d'avis authentiques dans le temps.",
  },
  {
    question: "Un avis négatif sur TripAdvisor a-t-il le même poids qu'un avis Google ?",
    answer:
      "Google reste dominant en volume de consultation avant une réservation, mais TripAdvisor et les plateformes de réservation pèsent fortement pour une clientèle touristique. La méthode de réponse (délai, ton, 5 étapes) s'applique de façon identique sur toutes les plateformes.",
  },
  {
    question: "Combien de temps un avis négatif reste-t-il visible avant de perdre son impact ?",
    answer:
      "Un avis reste affiché indéfiniment, mais son poids relatif diminue avec le volume de commentaires plus récents qui s'accumulent au-dessus de lui. C'est l'argument principal en faveur d'une collecte régulière plutôt que d'une suppression à tout prix.",
  },
  {
    question: "Doit-on répondre à un avis clairement rédigé par un concurrent ?",
    answer:
      "Signalez-le à Google avec le motif « conflit d'intérêt », mais répondez aussi publiquement, de façon factuelle et sans accusation nommée — une réponse calme suffit à neutraliser l'effet auprès des lecteurs, même avant l'issue du signalement.",
  },
];

const tocItems = [
  { id: "cout-etoile", label: "Ce que coûte vraiment une étoile perdue" },
  { id: "regle-or", label: "La règle d'or : ne jamais répondre à chaud" },
  { id: "methode", label: "La méthode de réponse en 5 étapes" },
  { id: "grille", label: "Grille de réponse par catégorie d'avis" },
  { id: "chiffrer-geste", label: "Chiffrer le geste commercial" },
  { id: "faux-avis", label: "Faux avis : le recours légal" },
  { id: "matelas", label: "Construire un matelas d'avis positifs" },
];

export default function BlogAvisGoogleNegatifs() {
  const pageTitle = "Avis Google négatifs au restaurant : la méthode qui limite les dégâts";
  const pageDescription =
    "Combien coûte un avis négatif, comment y répondre sans se braquer, quand demander sa suppression à Google, et comment construire un matelas d'avis positifs.";
  const slug = "avis-google-negatifs-restaurant";
  const canonicalUrl = `https://www.restaumargin.fr/blog/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    author: { "@type": "Organization", name: "RestauMargin" },
    publisher: {
      "@type": "Organization",
      name: "RestauMargin",
      logo: { "@type": "ImageObject", url: "https://www.restaumargin.fr/logo.png" },
    },
    datePublished: "2026-08-21",
    dateModified: "2026-08-31",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
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
            { name: "Accueil", url: "https://www.restaumargin.fr/" },
            { name: "Blog", url: "https://www.restaumargin.fr/blog" },
            { name: "Avis Google négatifs", url: canonicalUrl },
          ]),
        ]}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <BlogArticleHero
          category="Marketing"
          title="Avis Google négatifs au restaurant"
          subtitle="La méthode qui limite les dégâts (et évite de payer deux fois)"
          readTime="11 min"
          date="31 août 2026"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <BlogAuthor publishedDate="2026-08-31" readTime="11 min" variant="header" />

          {/* Intro */}
          <p className="text-lg text-[#111111] dark:text-white leading-relaxed mb-6">
            Une étoile en moins sur votre fiche Google peut faire fondre jusqu'à{" "}
            <strong>22 % de votre chiffre d'affaires</strong>. Et pourtant, la plupart des
            restaurateurs découvrent un avis à une étoile de la même façon — en plein service, sur
            leur téléphone, avec l'envie immédiate de répondre sous le coup de la colère. C'est
            précisément le réflexe qui aggrave la situation.
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
          <section id="cout-etoile" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                1. Ce que coûte vraiment une étoile perdue
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Selon les travaux du chercheur Michael Luca (Harvard Business School), un gain
              d'une étoile sur la note publique d'un restaurant se traduit par une hausse de{" "}
              <strong className="text-[#111111] dark:text-white">5 à 9 % du chiffre d'affaires</strong>. Le raisonnement
              fonctionne dans les deux sens — plusieurs analyses plus récentes évaluent la perte
              réelle entre <strong className="text-[#111111] dark:text-white">9 et 22 %</strong> selon la densité concurrentielle
              locale.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Consultent les avis avant de choisir", value: "83 %" },
                { label: "Évitent les établissements sous 4 étoiles", value: "91 %" },
                { label: "Zone de note idéale", value: "4,2 – 4,6" },
                { label: "Hausse de revenus au-delà de 82 avis", value: "+54 %" },
                { label: "Préfèrent une enseigne qui répond", value: "58 %" },
                { label: "Hausse de note en 6 mois si réponse systématique", value: "+40 %" },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-teal-600">{s.value}</p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              La barre des 4 étoiles est un seuil psychologique : en dessous, neuf clients sur dix
              passent leur chemin. Le volume d'avis compte presque autant que la note — un
              établissement à 4,3 étoiles avec 200 avis rassure davantage qu'un 4,8 avec 12 avis,
              jugé trop récent pour être fiable.
            </p>
          </section>

          {/* Section 2 */}
          <section id="regle-or" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                2. La règle d'or : ne jamais répondre à chaud
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Le réflexe le plus naturel — répondre dans les dix minutes — est statistiquement le
              plus mauvais. Une réponse rédigée sous le coup de l'émotion vire presque toujours au
              registre défensif, et ce texte reste affiché en public, indéfiniment.
            </p>
            <ul className="space-y-2 text-sm text-[#737373] dark:text-[#A3A3A3]">
              <li className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">•</span> Ne jamais répondre dans l'heure qui suit la lecture — laissez retomber l'émotion.</li>
              <li className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">•</span> Répondre dans une fenêtre de 24 à 48 heures.</li>
              <li className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">•</span> Faire relire par une deuxième personne si le ton vous semble encore vif.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="methode" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                3. La méthode de réponse en 5 étapes
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                { step: "1. Remercier, sans ironie", detail: "« Merci d'avoir pris le temps de nous faire ce retour » pose un ton posé dès la première ligne." },
                { step: "2. Reformuler le problème avec précision", detail: "Montrez que vous avez lu, pas survolé le commentaire." },
                { step: "3. Assumer sans se justifier à l'excès", detail: "Une phrase de responsabilité suffit ; évitez les explications à rallonge." },
                { step: "4. Basculer la conversation hors ligne", detail: "« Contactez-nous directement » évite d'étaler une négociation publiquement." },
                { step: "5. Signer avec un nom, pas « La Direction »", detail: "Une signature nominative humanise la réponse." },
              ].map((item) => (
                <li key={item.step} className="flex gap-3 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {item.step.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-[#111111] dark:text-white">{item.step.slice(3)} : </span>
                    <span className="text-[#737373] dark:text-[#A3A3A3] text-sm">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Point de vigilance juridique : ne révélez jamais d'informations personnelles sur le
                client dans votre réponse publique. Une réponse qui expose ces données peut
                constituer, en soi, un manquement RGPD.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="grille" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                4. Grille de réponse par catégorie d'avis
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Catégorie</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Angle à privilégier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Attente trop longue</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Montrer que vous agissez sur l'organisation ; invitation à revenir</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Prix jugé élevé</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Justification factuelle (sourcing, qualité) plutôt qu'un geste financier</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Propreté / hygiène</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Réaction rapide et concrète — la catégorie la plus sensible, jamais nier</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Plat raté / erreur</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Reconnaissance immédiate, sans minimiser</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#111111] dark:text-white">Ambiance / service froid</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Prendre le ressenti au sérieux même s'il est subjectif</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section id="chiffrer-geste" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                5. Chiffrer le geste commercial avant de l'offrir
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Le geste est souvent le bon choix commercial. Le problème n'est pas de l'offrir,
              c'est de l'offrir <strong className="text-[#111111] dark:text-white">sans connaître son coût matière réel</strong>.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#0A0A0A] text-left">
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-l-lg">Geste commercial</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white">Prix TTC</th>
                    <th className="p-3 font-semibold text-[#111111] dark:text-white rounded-r-lg">Coût matière réel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Dessert offert (food cost 22 %)</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">8,50 €</td>
                    <td className="p-3 font-bold text-teal-600">≈ 1,90 €</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Remise 10 % sur addition à 45 €</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">4,50 €</td>
                    <td className="p-3 font-bold text-teal-600">Variable</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">Bouteille offerte (food cost 25 %)</td>
                    <td className="p-3 text-[#737373] dark:text-[#A3A3A3]">28,00 €</td>
                    <td className="p-3 font-bold text-teal-600">≈ 7,00 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Le vrai risque n'est pas le geste isolé, c'est sa{" "}
              <strong className="text-[#111111] dark:text-white">répétition non pilotée</strong>. Fixez un budget mensuel de
              gestes commerciaux (0,3 à 0,5 % du CA du mois), suivi comme une ligne à part — voir{" "}
              <Link to="/blog/augmenter-ticket-moyen-restaurant" className="text-teal-600 hover:text-teal-500 underline underline-offset-2">
                augmenter le ticket moyen sans faire fuir les clients
              </Link>.
            </p>
          </section>

          {/* Section 6 */}
          <section id="faux-avis" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                6. Faux avis et avis de concurrents : le recours légal
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              Vous ne pouvez pas supprimer un avis vous-même : seul un signalement à Google, suivi
              d'un examen, peut aboutir à un retrait. Google reconnaît{" "}
              <strong className="text-[#111111] dark:text-white">cinq motifs valides</strong> :
            </p>
            <ol className="space-y-2 text-sm text-[#737373] dark:text-[#A3A3A3] mb-4">
              <li>1. Contenu hors-sujet — publicité, spam, avis sans rapport avec une expérience réelle</li>
              <li>2. Conflit d'intérêt avéré — concurrent, ex-employé, proche d'un concurrent</li>
              <li>3. Contenu inapproprié — propos haineux, violents, discriminatoires</li>
              <li>4. Usurpation d'identité</li>
              <li>5. Atteinte à la vie privée (RGPD)</li>
            </ol>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="text-sm text-teal-800 dark:text-teal-300">
                Taux de succès mesuré : environ <strong>un signalement sur quatre</strong> effectivement
                retiré. Répondez publiquement avant de signaler — cette réponse reste visible
                pendant l'examen et protège votre image.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="matelas" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
                7. Construire un matelas d'avis positifs
              </h2>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed mb-4">
              La meilleure défense contre un avis négatif isolé n'est pas de le combattre, c'est de
              le <strong className="text-[#111111] dark:text-white">diluer statistiquement</strong>. Un établissement avec 15
              avis subit un impact fort à chaque commentaire à une étoile ; un établissement avec
              300 avis absorbe le même commentaire sans que sa moyenne bouge.
            </p>
            <ul className="space-y-2 text-sm text-[#737373] dark:text-[#A3A3A3] mb-4">
              <li className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">•</span> <strong className="text-[#111111] dark:text-white">Le bon moment :</strong> en fin de repas, jamais après une réclamation en cours de service</li>
              <li className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">•</span> <strong className="text-[#111111] dark:text-white">Le bon canal :</strong> un QR code sur l'addition convertit mieux qu'un lien envoyé par SMS différé</li>
              <li className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">•</span> <strong className="text-[#111111] dark:text-white">La bonne fréquence :</strong> 8 à 12 nouveaux avis par mois rendent chaque avis négatif marginal en moins d'un an</li>
            </ul>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Un point d'éthique à respecter strictement : ne jamais offrir de contrepartie en
              échange d'un avis positif — pratique contraire aux conditions Google et sanctionnable.
              Voir aussi{" "}
              <Link to="/blog/strategie-digitale-restaurant" className="text-teal-600 hover:text-teal-500 underline underline-offset-2">
                stratégie digitale pour restaurant
              </Link>{" "}
              et{" "}
              <Link to="/blog/kpi-restaurateur" className="text-teal-600 hover:text-teal-500 underline underline-offset-2">
                les 10 KPI essentiels du restaurateur
              </Link>.
            </p>
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
              RestauMargin calcule le coût matière exact de chaque plat, dessert et boisson de
              votre carte — de quoi chiffrer en quelques secondes ce que coûte un geste commercial.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <BlogAuthor publishedDate="2026-08-31" readTime="11 min" variant="footer" />

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <Link to="/blog" className="text-sm text-teal-600 hover:text-teal-500 transition-colors">
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
