import React from 'react';
import SEOHead from '../components/SEOHead';

export default function BlogNoShowRestaurant() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'No-show au restaurant : comment réduire les réservations non honorées',
    description: 'Comment calculer le coût réel d\'un no-show, mettre en place SMS de rappel, empreinte bancaire et politique d\'annulation efficace.',
    author: { '@type': 'Organization', name: 'RestauMargin' },
    publisher: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
    datePublished: '2026-09-04',
    dateModified: '2026-09-04',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/no-show-restaurant-solutions' },
  };

  return (
    <>
      <SEOHead
        title="No-show au restaurant : solutions pour réduire les réservations non honorées (2026)"
        description="Calculez le vrai coût d'un no-show, activez les SMS de rappel, l'empreinte bancaire et rédigez une politique d'annulation béton. Guide complet 2026."
        path="/blog/no-show-restaurant-solutions"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white dark:bg-black">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          {/* Breadcrumb */}
          <nav className="text-sm text-[#737373] dark:text-[#A3A3A3] mb-8">
            <a href="/" className="hover:text-teal-600 transition-colors">Accueil</a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-teal-600 transition-colors">Blog</a>
            <span className="mx-2">/</span>
            <span>No-show au restaurant</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-medium rounded-full mb-4">
              Gestion · Réservations
            </div>
            <h1 className="font-satoshi text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white leading-tight mb-4">
              No-show au restaurant : comment réduire les réservations non honorées (et chiffrer ce que ça coûte vraiment)
            </h1>
            <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">
              Mis à jour le 4 septembre 2026 · 8 min de lecture
            </p>
          </header>

          {/* Intro */}
          <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <p className="text-[#111111] dark:text-white leading-relaxed">
              Un vendredi soir de juin, votre salle est pleine sur papier. À 20 h, trois tables sur dix restent vides. Aucun appel, aucun message. Le chef a préparé les couverts, le commis a mis les nappes, vous avez refusé deux clients en surbooking « par prudence ». Ce soir, votre restaurant perd de l'argent sur des couverts qui n'ont jamais existé. Ce guide vous donne les chiffres, les outils et les décisions concrètes pour réduire votre taux de no-show de 50 % à 80 % en trois mois.
            </p>
          </div>

          {/* Table des matières */}
          <nav className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 mb-10">
            <h2 className="font-satoshi text-base font-semibold text-[#111111] dark:text-white mb-4">Sommaire</h2>
            <ol className="space-y-2 text-[#737373] dark:text-[#A3A3A3] text-sm">
              {[
                ['1', 'Combien coûte vraiment un no-show ?', '#cout'],
                ['2', 'Pourquoi les clients ne préviennent pas', '#pourquoi'],
                ['3', 'SMS de confirmation et rappel : le levier le moins cher', '#sms'],
                ['4', 'Empreinte bancaire et acompte : quelle option choisir ?', '#empreinte'],
                ['5', 'Politique d\'annulation : le texte type', '#politique'],
              ].map(([num, label, href]) => (
                <li key={num}>
                  <a href={href} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    <span className="text-teal-600 dark:text-teal-400 font-medium mr-2">{num}.</span>{label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="cout" className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold text-[#111111] dark:text-white mb-4">
              1. Combien vous coûte vraiment un no-show ?
            </h2>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-4">
              La plupart des restaurateurs estiment leurs pertes sur le chiffre d'affaires manquant. C'est une erreur : le vrai coût d'un couvert vide est la <strong className="text-[#111111] dark:text-white">marge brute que vous n'encaissez pas, moins le coût matière déjà engagé</strong>.
            </p>

            {/* Tableau */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <th className="text-left px-4 py-3 text-[#111111] dark:text-white font-semibold rounded-tl-lg">Élément</th>
                    <th className="text-left px-4 py-3 text-[#111111] dark:text-white font-semibold rounded-tr-lg">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Ticket moyen (TTC)', '38 €'],
                    ['Taux de no-show moyen secteur', '12 %'],
                    ['Couverts réservés un soir de plein', '40'],
                    ['Couverts no-show', '5'],
                    ['CA manquant', '190 €'],
                    ['Food cost déjà engagé (30 %)', '57 €'],
                    ['Marge brute perdue', '~ 110 à 140 €'],
                  ].map(([label, val], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0A0A0A]' : 'bg-[#F5F5F5]/50 dark:bg-[#111111]'}>
                      <td className="px-4 py-2 text-[#111111] dark:text-[#D4D4D4] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">{label}</td>
                      <td className="px-4 py-2 text-[#111111] dark:text-[#D4D4D4] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed">
              Sur un service de 40 couverts à 12 % de no-show, la perte réelle dépasse 120 € de marge nette. Multipliée sur une semaine avec trois services surchargés, la perte annuelle peut atteindre <strong className="text-[#111111] dark:text-white">15 000 € pour un restaurant de 50 couverts</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section id="pourquoi" className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold text-[#111111] dark:text-white mb-4">
              2. Pourquoi les clients ne préviennent pas
            </h2>
            <div className="space-y-4">
              {[
                { pct: '45 %', title: 'L\'oubli pur', desc: 'Le client a réservé 10 jours avant. Sans rappel, un autre plan a pris le dessus. Un SMS de rappel 24 h avant réduit le no-show de 30 à 50 % à lui seul.' },
                { pct: '25 %', title: 'La friction perçue à l\'annulation', desc: 'Appeler un restaurant semble « gênant ». Rendre l\'annulation aussi simple que la réservation — un lien dans le SMS — supprime ce frein.' },
                { pct: '20 %', title: 'La réservation multiple', desc: 'Le client a réservé dans deux restaurants pour le même soir. L\'empreinte bancaire devient ici une barrière d\'engagement nécessaire.' },
                { pct: '10 %', title: 'Un imprévu réel', desc: 'Maladie, transport raté. Ces clients n\'appellent pas souvent par honte. Une politique d\'annulation humaine réduit ce phénomène.' },
              ].map(({ pct, title, desc }) => (
                <div key={title} className="flex gap-4 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center">
                    <span className="text-teal-700 dark:text-teal-400 text-sm font-bold">{pct}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] dark:text-white text-sm mb-1">{title}</p>
                    <p className="text-[#737373] dark:text-[#A3A3A3] text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section id="sms" className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold text-[#111111] dark:text-white mb-4">
              3. SMS de confirmation et rappel : le levier le moins cher
            </h2>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed mb-6">
              Un SMS de rappel 24 à 48 h avant la réservation réduit le taux de no-show de <strong className="text-[#111111] dark:text-white">30 % à 50 %</strong> selon les données des plateformes de réservation (TheFork, Zenchef, Resengo).
            </p>
            <div className="space-y-4 mb-6">
              <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">MESSAGE J-1 (48 h avant)</p>
                <p className="text-[#111111] dark:text-[#D4D4D4] text-sm italic">
                  « Bonjour [Prénom], votre table pour [X] personnes vous attend demain [Jour] à [Heure] chez [Restaurant]. Pour annuler : [lien] ou appelez le [téléphone]. Merci ! »
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">MESSAGE J-0 (matin du jour J)</p>
                <p className="text-[#111111] dark:text-[#D4D4D4] text-sm italic">
                  « Rappel : votre réservation ce soir à [Heure] chez [Restaurant]. Annulation jusqu'à [Heure] au [téléphone]. À ce soir ! »
                </p>
              </div>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="text-teal-800 dark:text-teal-300 text-sm">
                <strong>ROI instantané :</strong> un SMS coûte 0,04 à 0,08 €. Pour 20 réservations/soir, le coût total est de 1,60 €. Si un seul no-show est évité, vous récupérez 50 à 120 € de marge. Le ROI dépasse 3 000 %.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="empreinte" className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold text-[#111111] dark:text-white mb-4">
              4. Empreinte bancaire et acompte : quelle option choisir ?
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <th className="text-left px-4 py-3 text-[#111111] dark:text-white font-semibold rounded-tl-lg">Situation</th>
                    <th className="text-left px-4 py-3 text-[#111111] dark:text-white font-semibold rounded-tr-lg">Recommandation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Tables 2-3 personnes, restaurant de quartier', 'SMS seuls suffisent'],
                    ['Tables 4+ personnes', 'Empreinte bancaire'],
                    ['Soirées spéciales / événements', 'Acompte obligatoire'],
                    ['Menus dégustation > 60 €/couvert', 'Acompte 30-50 %'],
                    ['Groupes > 8 personnes', 'Acompte 25-50 % avec CGV signées'],
                  ].map(([situation, reco], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0A0A0A]' : 'bg-[#F5F5F5]/50 dark:bg-[#111111]'}>
                      <td className="px-4 py-2 text-[#111111] dark:text-[#D4D4D4] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">{situation}</td>
                      <td className="px-4 py-2 text-teal-700 dark:text-teal-400 font-medium border-b border-[#E5E7EB] dark:border-[#1A1A1A]">{reco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] text-sm leading-relaxed">
              En France, l'empreinte et l'acompte sont légaux dès lors que le client est informé <em>avant</em> de confirmer sa réservation (Code de la consommation, principe de consentement éclairé). Plafonnez le montant retenu à la marge brute perdue, pas au ticket complet.
            </p>
          </section>

          {/* Section 5 */}
          <section id="politique" className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold text-[#111111] dark:text-white mb-4">
              5. Politique d'annulation : le texte type
            </h2>
            <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-5 mb-6">
              <p className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] mb-3">MODÈLE À ADAPTER</p>
              <p className="text-[#111111] dark:text-[#D4D4D4] text-sm leading-relaxed">
                <strong>Annulation libre</strong> jusqu'à 48 h avant via le lien SMS ou par téléphone.<br />
                <strong>Annulation tardive</strong> (moins de 24 h) : indemnité de [montant] € par couvert.<br />
                <strong>No-show</strong> (absence sans prévenir) : empreinte / acompte conservé.<br />
                <em>En cas d'imprévu exceptionnel, contactez-nous — nous étudions la situation avec bienveillance.</em>
              </p>
            </div>
            <p className="text-[#111111] dark:text-[#D4D4D4] leading-relaxed">
              Les restaurants avec le taux de no-show le plus bas ne sont pas ceux qui pénalisent le plus fort. Ce sont ceux qui communiquent le plus tôt et le plus clairement — un message de confirmation personnalisé dans les minutes suivant la réservation crée un lien émotionnel que l'anonymat d'une plateforme ne crée pas.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-satoshi text-2xl font-bold text-[#111111] dark:text-white mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Le no-show peut-il être contesté par le client auprès de sa banque ?',
                  a: 'Oui, dans de rares cas. Conservez les captures d\'écran de la réservation acceptée, du SMS envoyé et de l\'absence de réponse dans le délai imparti. Stripe et la plupart des PSP européens tranchent en faveur du marchand sur ces preuves.',
                },
                {
                  q: 'Dois-je appliquer la même politique pour les groupes et les tables de 2 ?',
                  a: 'Non. Proportionnez la contrainte au risque : une table de deux ne justifie pas d\'empreinte, un groupe de 12 en revanche représente un risque financier réel qui impose l\'acompte.',
                },
                {
                  q: 'Quel taux de no-show est « normal » ?',
                  a: 'Le taux moyen dans la restauration française est de 8 à 15 % les vendredi/samedi soir. En dessous de 5 %, le problème est maîtrisé. Au-delà de 15 %, la stratégie de confirmation manque à votre organisation.',
                },
                {
                  q: 'Les plateformes de réservation réduisent-elles le no-show ?',
                  a: 'TheFork et Zenchef incluent empreinte bancaire et rappels automatisés. Le taux de no-show sur TheFork (avec confirmation + rappel activés) est inférieur de 35 % aux réservations téléphoniques sans rappel.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-[#111111] dark:text-white font-medium text-sm list-none">
                    {q}
                    <span className="ml-3 text-teal-600 dark:text-teal-400 text-lg group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-[#737373] dark:text-[#A3A3A3] text-sm leading-relaxed border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-4">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#111111] dark:bg-white rounded-2xl p-8 text-center">
            <h3 className="font-satoshi text-xl font-bold text-white dark:text-[#111111] mb-3">
              Calculez la marge perdue sur vos no-shows
            </h3>
            <p className="text-[#A3A3A3] dark:text-[#737373] text-sm mb-6">
              RestauMargin vous donne en temps réel votre food cost par plat, votre marge brute par service et vos indicateurs de gestion — pour ne plus perdre de marge ni sur les couverts vides, ni sur les plats que vous servez.
            </p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Essayer RestauMargin gratuitement →
            </a>
          </div>

          {/* Maillage interne */}
          <div className="mt-10 pt-8 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <p className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Articles liés</p>
            <ul className="space-y-2 text-sm">
              {[
                ['/blog/augmenter-ticket-moyen-restaurant', 'Augmenter le ticket moyen au restaurant'],
                ['/blog/kpi-restaurateur', 'Les 10 KPI essentiels du restaurateur'],
                ['/blog/seuil-rentabilite-restaurant', 'Calculer le seuil de rentabilité de son restaurant'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-teal-600 dark:text-teal-400 hover:underline">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}
