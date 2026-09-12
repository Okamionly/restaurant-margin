import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, TrendingUp, DollarSign, ArrowRight, Star } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const faqItems = [
  {
    question: 'Un logiciel de réservation peut-il réduire les no-shows à zéro ?',
    answer:
      "Non, mais il peut les réduire de 30 à 50 %. Les rappels automatisés à 48 h et 24 h avant la visite sont le levier le plus efficace. L'empreinte bancaire permet d'aller plus loin, mais dissuade aussi certains clients de réserver.",
  },
  {
    question: 'Faut-il absolument être sur TheFork pour remplir son restaurant ?',
    answer:
      "Non. TheFork génère de la visibilité mais au prix d'une commission élevée (2-3 € par couvert). Un restaurant avec un bon référencement local et un widget sur son site peut attirer autant de réservations directes, sans payer de commission.",
  },
  {
    question: "Le RGPD s'applique-t-il aux données de réservation ?",
    answer:
      'Oui. Noms, emails et préférences alimentaires sont des données personnelles. Votre logiciel doit respecter le RGPD : base légale de traitement, durée de conservation définie, droit de suppression. Privilégiez un hébergement en Europe.',
  },
  {
    question: 'Mon restaurant est petit (20 couverts). Est-ce utile ?',
    answer:
      "Très utile. Un petit établissement bénéficie autant des rappels automatiques et de la prise de réservation 24/7. Google Reserve (gratuit) peut suffire dans un premier temps. La solution payante devient rentable dès 10 à 15 réservations par semaine.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Logiciel de réservation restaurant : comparatif 2026',
  description:
    'Comparatif complet des logiciels de réservation pour restaurants en 2026 : TheFork, Zenchef, Sevenrooms, Google Reserve. Critères de choix, coûts réels et ROI.',
  author: { '@type': 'Organization', name: 'RestauMargin' },
  publisher: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
  datePublished: '2026-09-12',
  dateModified: '2026-09-12',
  mainEntityOfPage: 'https://www.restaumargin.fr/blog/logiciel-reservation-restaurant',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

const solutions = [
  {
    name: 'TheFork',
    model: 'Commission 2-3 €/couvert',
    strengths: ['Forte visibilité plateforme', 'Programme Yums fidélité', 'Interface intuitive'],
    weaknesses: ['Commission élevée à volume', 'Dépendance algorithme', 'Contrat avec engagement'],
    target: 'Restaurants cherchant visibilité',
    icon: Star,
  },
  {
    name: 'Zenchef',
    model: '89-199 €/mois',
    strengths: ['Pas de commission', 'Widget personnalisable', 'CRM intégré'],
    weaknesses: ['Moins de visibilité marketing', 'Coût entrée plus élevé'],
    target: 'Restaurants établis, clientèle directe',
    icon: CheckCircle,
  },
  {
    name: 'Sevenrooms',
    model: '200-500 €/mois',
    strengths: ['Yield management avancé', 'Segmentation client poussée', 'Multi-établissements'],
    weaknesses: ['Interface complexe', 'Prix élevé', 'Overkill pour indépendants'],
    target: 'Gastronomique, hôtels, groupes',
    icon: TrendingUp,
  },
  {
    name: 'Google Reserve',
    model: 'Gratuit',
    strengths: ['Intégration Google My Business', 'Visibilité maximale', 'Zéro commission'],
    weaknesses: ['Fonctions basiques', 'Pas de CRM', 'Partenaire agréé requis'],
    target: 'Petits restaurants, budget limité',
    icon: Calendar,
  },
];

export default function BlogLogicielReservation() {
  return (
    <>
      <SEOHead
        title="Logiciel de réservation restaurant : comparatif 2026 | RestauMargin"
        description="Comparatif complet des logiciels de réservation pour restaurants en 2026 : TheFork, Zenchef, Sevenrooms, Google Reserve. Critères de choix, coûts réels et ROI."
        path="/blog/logiciel-reservation-restaurant"
        schema={[articleSchema, faqSchema]}
      />

      <div className="min-h-screen bg-white dark:bg-black text-[#111111] dark:text-white">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-black border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium mb-4">
              <Calendar className="w-4 h-4" />
              <span>Gestion &amp; Technologie</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Logiciel de réservation restaurant : comparatif 2026
            </h1>
            <p className="text-lg text-[#737373] dark:text-[#A3A3A3] mb-6">
              Les restaurants français perdent 8 à 12 % de leur CA à cause des no-shows. Le bon logiciel de réservation peut récupérer la moitié de ce manque — voici lequel choisir en 2026.
            </p>
            <div className="flex items-center gap-3 text-sm text-[#737373] dark:text-[#A3A3A3]">
              <span>Mis à jour le 12 septembre 2026</span>
              <span>·</span>
              <span>8 min de lecture</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">

          {/* Table des matières */}
          <nav className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-3">
              Table des matières
            </h2>
            <ol className="space-y-1.5 text-sm">
              {[
                'Pourquoi un logiciel de réservation est devenu indispensable',
                'Les 6 critères clés pour bien choisir',
                'Comparatif des principales solutions 2026',
                'Coûts réels et retour sur investissement',
                'Comment migrer sans perturber votre service',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">{i + 1}.</span>
                  <span className="text-[#111111] dark:text-white">{item}</span>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              1. Pourquoi un logiciel de réservation est devenu indispensable
            </h2>
            <div className="space-y-4 text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              <p>
                Le carnet papier atteint ses limites dès 40 couverts par service : erreurs de double-réservation, pages illisibles, impossibilité de consulter les disponibilités depuis un smartphone.
              </p>
              <p>
                <strong className="text-[#111111] dark:text-white">67 % des clients de moins de 45 ans préfèrent réserver en ligne</strong> plutôt que par téléphone. Un restaurant sans formulaire en ligne perd des réservations chaque nuit, pendant qu&apos;il dort.
              </p>
              <p>
                Les logiciels qui envoient des rappels SMS/email 24 à 48 h avant la visite réduisent les no-shows de <strong className="text-[#111111] dark:text-white">30 à 50 %</strong>. Sur 500 k€ de CA, cela représente 15 000 à 30 000 € récupérés chaque année.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              2. Les 6 critères clés pour bien choisir
            </h2>
            <div className="grid gap-4">
              {[
                {
                  num: '01',
                  title: 'Intégration à votre caisse',
                  desc: 'Le logiciel doit se connecter à votre caisse enregistreuse (Lightspeed, Zelty, Tiller…) pour que les réservations remontent dans vos reportings CA.',
                },
                {
                  num: '02',
                  title: 'Commission vs abonnement fixe',
                  desc: '800 couverts/mois × 2,50 € de commission = 24 000 €/an. Un abonnement fixe à 150 €/mois coûte 1 800 €/an. La différence est énorme à fort volume.',
                },
                {
                  num: '03',
                  title: 'Widget intégrable sur votre site',
                  desc: "Réservez directement depuis votre site : vous évitez la commission et conservez la relation client. Vérifiez qu'il est rapide (< 2 s) et responsive mobile.",
                },
                {
                  num: '04',
                  title: 'Plan de salle graphique',
                  desc: 'Visualisation des tables en temps réel, gestion des grandes tablées, optimisation du placement. Indispensable à partir de 60 couverts.',
                },
                {
                  num: '05',
                  title: "Rappels et listes d'attente automatiques",
                  desc: 'SMS automatique, notification en cas d\'annulation, gestion de la liste d\'attente en temps réel : ces fonctions font la différence entre un outil basique et un vrai yield management.',
                },
                {
                  num: '06',
                  title: 'Support et formation en français',
                  desc: 'Un logiciel mal maîtrisé est pire que l\'absence de logiciel. Vérifiez la disponibilité du support et la qualité de la documentation francophone.',
                },
              ].map((c) => (
                <div
                  key={c.num}
                  className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 flex gap-4"
                >
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400 shrink-0">{c.num}</span>
                  <div>
                    <h3 className="font-semibold text-[#111111] dark:text-white mb-1">{c.title}</h3>
                    <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              3. Comparatif des principales solutions 2026
            </h2>
            <div className="space-y-4">
              {solutions.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.name}
                    className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/30 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-[#111111] dark:text-white">{s.name}</h3>
                          <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">{s.model}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Points forts</p>
                        <ul className="space-y-1">
                          {s.strengths.map((str, i) => (
                            <li key={i} className="text-sm text-[#737373] dark:text-[#A3A3A3] flex gap-1.5">
                              <span className="text-emerald-500 mt-0.5">✓</span>{str}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">Points faibles</p>
                        <ul className="space-y-1">
                          {s.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-[#737373] dark:text-[#A3A3A3] flex gap-1.5">
                              <span className="text-red-400 mt-0.5">✗</span>{w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <strong className="text-[#111111] dark:text-white">Pour qui :</strong> {s.target}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4 — ROI */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              4. Coûts réels et retour sur investissement
            </h2>
            <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-[#111111] dark:text-white">Ce que vous coûtent vos dysfonctionnements actuels</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="text-left py-2 text-[#737373] dark:text-[#A3A3A3] font-medium">Problème</th>
                      <th className="text-right py-2 text-[#737373] dark:text-[#A3A3A3] font-medium">Impact estimé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                    {[
                      ['10 % de no-shows (50 couverts/service)', '~125 €/service'],
                      ['Gestion téléphonique (1 h/jour)', '~600 €/mois'],
                      ['Double-réservations et erreurs', '100-200 €/mois'],
                      ['Total mensuel perdu', '850-1 100 €/mois'],
                    ].map(([prob, impact], i) => (
                      <tr key={i} className={i === 3 ? 'font-semibold text-[#111111] dark:text-white' : ''}>
                        <td className="py-2.5 pr-4">{prob}</td>
                        <td className="py-2.5 text-right text-teal-600 dark:text-teal-400">{impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Un abonnement à 99 €/mois qui divise ces pertes par deux génère un ROI positif dès le premier mois. La différence entre commission TheFork et abonnement fixe Zenchef peut représenter{' '}
              <strong className="text-[#111111] dark:text-white">20 000 € par an</strong> pour un restaurant à fort volume.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              5. Comment migrer sans perturber votre service
            </h2>
            <div className="space-y-4">
              {[
                { step: 'J-30', title: 'Export de vos données actuelles', desc: 'Exportez toutes vos réservations futures depuis votre système actuel. Saisissez les réservations papier dans le nouveau système une semaine avant le go-live.' },
                { step: 'J-15', title: 'Configuration et tests', desc: "Paramétrez plan de salle, créneaux, messages automatiques. Simulez réservation, confirmation, annulation et liste d'attente. Impliquez votre équipe." },
                { step: 'J-7', title: 'Communication client', desc: "Redirigez l'ancienne URL de réservation. Mettez à jour Google My Business, site, réseaux sociaux et auto-réponses d'email." },
                { step: 'Jour J', title: 'Go-live progressif', desc: 'Lancez un jour calme (lundi/mardi). Gardez le téléphone actif la première semaine. Surveillez les confirmations envoyées.' },
                { step: 'J+30', title: 'Optimisation continue', desc: 'Analysez taux de remplissage par créneau, taux d\'annulation, délai réservation-visite. Ajustez vos créneaux et délais de rappel.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
                    {i < 4 && <div className="w-0.5 h-full bg-[#E5E7EB] dark:bg-[#1A1A1A] mt-2" />}
                  </div>
                  <div className="pb-4">
                    <h3 className="font-semibold text-[#111111] dark:text-white mb-1">{s.title}</h3>
                    <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                  <h3 className="font-semibold text-[#111111] dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white dark:text-[#111111] mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Pilotez aussi vos marges, pas seulement vos réservations
            </h2>
            <p className="text-[#A3A3A3] dark:text-[#737373] mb-6 max-w-md mx-auto">
              RestauMargin connecte votre taux de remplissage à votre food cost et vos marges en temps réel. Un tableau de bord, toutes vos décisions.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Essayer gratuitement 14 jours
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Retour blog */}
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <Link
              to="/blog"
              className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
