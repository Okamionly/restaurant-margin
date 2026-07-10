import React from 'react';
import SEOHead from '../components/SEOHead';

export default function BlogOuvrirTerrasseRestaurant() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Terrasse de restaurant : autorisations, démarches et rentabilité 2026",
    "description": "Guide complet pour ouvrir une terrasse de restaurant en France : droit de terrasse, démarches mairie, budget équipement et calcul de rentabilité.",
    "author": { "@type": "Organization", "name": "RestauMargin" },
    "publisher": { "@type": "Organization", "name": "RestauMargin", "url": "https://www.restaumargin.fr" },
    "datePublished": "2026-07-10",
    "dateModified": "2026-07-10",
    "url": "https://www.restaumargin.fr/blog/ouvrir-terrasse-restaurant-demarches"
  };

  return (
    <>
      <SEOHead
        title="Terrasse de restaurant : autorisations, démarches et rentabilité 2026"
        description="Comment ouvrir une terrasse de restaurant en France ? Droit de terrasse, dossier mairie, équipement et calcul de rentabilité : le guide complet 2026."
        canonicalUrl="https://www.restaumargin.fr/blog/ouvrir-terrasse-restaurant-demarches"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-10 text-[#111111] dark:text-white">
        <article>
          <header className="mb-8">
            <p className="text-sm text-teal-600 font-semibold uppercase tracking-wide mb-2">Gestion & Rentabilité</p>
            <h1 className="font-satoshi text-3xl md:text-4xl font-bold leading-tight mb-4">
              Terrasse de restaurant : autorisations, démarches et rentabilité 2026
            </h1>
            <p className="text-lg text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Vous rêvez d'installer une terrasse devant votre restaurant ? Entre autorisations mairie, droit de terrasse et investissement matériel, beaucoup renoncent. Pourtant, une terrasse bien gérée peut augmenter votre chiffre d'affaires de 20 à 40 % en saison. Voici le guide complet.
            </p>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-3">Publié le 10 juillet 2026 · 7 min de lecture</p>
          </header>

          <nav className="bg-[#F5F5F5] dark:bg-[#262626] rounded-xl p-5 mb-8">
            <p className="font-semibold text-sm mb-3">Sommaire</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
              <li><a href="#droit-terrasse" className="hover:text-teal-600">Qu'est-ce qu'un droit de terrasse ?</a></li>
              <li><a href="#demarches" className="hover:text-teal-600">Les démarches administratives à suivre</a></li>
              <li><a href="#equipement" className="hover:text-teal-600">Quel équipement prévoir et pour quel budget ?</a></li>
              <li><a href="#rentabilite" className="hover:text-teal-600">Comment calculer la rentabilité de votre terrasse ?</a></li>
              <li><a href="#erreurs" className="hover:text-teal-600">Erreurs courantes et comment les éviter</a></li>
            </ol>
          </nav>

          <section id="droit-terrasse" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">1. Qu'est-ce qu'un droit de terrasse ?</h2>
            <p className="mb-4 leading-relaxed">
              Le <strong>droit de terrasse</strong> est une autorisation d'occupation temporaire du domaine public (AOT) que la mairie accorde à un restaurateur souhaitant installer tables et chaises sur le trottoir ou une place publique. Il ne faut pas confondre terrasse sur domaine public et terrasse sur domaine privé (cour intérieure, jardin), qui ne nécessite pas d'autorisation municipale.
            </p>
            <p className="mb-4 leading-relaxed">
              <strong>La redevance varie fortement selon la commune.</strong> À Paris, elle se situe entre 30 et 75 €/m²/an selon l'arrondissement. À Lyon, autour de 20 à 50 €/m²/an. Dans une ville moyenne, 5 à 15 €/m²/an.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-1">Exemple concret</p>
              <p className="text-sm leading-relaxed">
                Terrasse de 20 m² à Paris 6e (zone 1) : environ 1 400 €/an de redevance, soit 117 €/mois. Rapporté à un CA terrasse de 15 000 €/mois en été, c'est une charge de seulement 0,8 %.
              </p>
            </div>
            <p className="leading-relaxed">
              L'autorisation est <strong>temporaire et renouvelée chaque année</strong>. La mairie peut la retirer en cas de travaux ou de non-respect des conditions. Depuis la loi Elan de 2018, plusieurs communes ont simplifié les démarches pour favoriser l'économie locale.
            </p>
          </section>

          <section id="demarches" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">2. Les démarches administratives à suivre</h2>
            <ol className="list-decimal list-inside space-y-3 mb-4">
              <li className="leading-relaxed">
                <strong>Contacter le service voirie ou urbanisme de la mairie</strong> — Demandez le formulaire AOT et la liste des pièces requises. Dans les grandes villes, c'est souvent en ligne.
              </li>
              <li className="leading-relaxed">
                <strong>Préparer le dossier</strong> — Plan de situation, plan de l'installation côté, photos de la devanture, attestation assurance RC, Kbis, notice mobilier.
              </li>
              <li className="leading-relaxed">
                <strong>Obtenir les avis obligatoires</strong> — Architecte des Bâtiments de France (monument historique proche), préfecture de police à Paris, association de commerçants. Délai : 1 à 3 mois.
              </li>
              <li className="leading-relaxed">
                <strong>Signer la convention d'occupation</strong> — Superficie autorisée, horaires, équipements permis, redevance annuelle.
              </li>
            </ol>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Délai moyen</p>
              <p className="text-sm">2 à 4 mois pour un dossier complet. Déposez votre demande en janvier-février pour une ouverture dès avril-mai.</p>
            </div>
            <p className="mb-2 font-semibold">Règles à respecter :</p>
            <ul className="list-disc list-inside space-y-1 text-[#737373] dark:text-[#A3A3A3] text-sm">
              <li>Laisser un passage piéton d'au moins 1,40 m (1,60 m dans certaines villes)</li>
              <li>Respecter les gabarits de hauteur des parasols et auvents</li>
              <li>Retirer le mobilier en dehors des horaires si demandé</li>
              <li>Respecter les normes PMR (accessibilité handicapés)</li>
            </ul>
          </section>

          <section id="equipement" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">3. Quel équipement prévoir et pour quel budget ?</h2>
            <p className="mb-4 leading-relaxed">
              Voici un chiffrage réaliste pour une terrasse de 20 couverts (30-40 m²) :
            </p>
            <ul className="list-disc list-inside space-y-2 mb-5 text-sm">
              <li>Tables et chaises professionnelles : <strong>1 600 à 4 000 €</strong></li>
              <li>Parasols professionnels (4 × Ø 3 m) : <strong>1 200 à 3 200 €</strong></li>
              <li>Pare-vents ou claustra : <strong>800 à 3 200 €</strong></li>
              <li>Chauffages infrarouge (prolonge la saison de 2-3 mois) : <strong>2 000 à 6 000 €</strong></li>
              <li>Éclairage LED extérieur : <strong>500 à 2 000 €</strong></li>
            </ul>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] dark:bg-[#262626]">
                    <th className="text-left p-3 rounded-tl-lg">Niveau</th>
                    <th className="text-left p-3">Investissement</th>
                    <th className="text-left p-3 rounded-tr-lg">Saison couverte</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="p-3">Basique</td>
                    <td className="p-3">5 000 – 8 000 €</td>
                    <td className="p-3">Avril – Septembre</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="p-3">Intermédiaire</td>
                    <td className="p-3">10 000 – 15 000 €</td>
                    <td className="p-3">Mars – Octobre</td>
                  </tr>
                  <tr>
                    <td className="p-3">Premium</td>
                    <td className="p-3">20 000 – 35 000 €</td>
                    <td className="p-3">Toute l'année possible</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Privilégiez le mobilier professionnel empilable pour faciliter le rangement quotidien. Certaines assurances refusent de couvrir le mobilier laissé dehors sans preuve de fixation.
            </p>
          </section>

          <section id="rentabilite" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">4. Comment calculer la rentabilité de votre terrasse ?</h2>
            <div className="bg-[#F5F5F5] dark:bg-[#262626] rounded-xl p-5 mb-5 font-mono text-sm">
              <p className="font-semibold mb-2">Formule :</p>
              <p>Seuil de rentabilité = (Investissement/durée amortissement + Charges annuelles)</p>
              <p className="ml-20">÷ (Ticket moyen × Taux de marge brute)</p>
            </div>
            <p className="mb-3 font-semibold">Exemple concret :</p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-4">
              <li>Investissement 12 000 € amorti 5 ans = 2 400 €/an</li>
              <li>Redevance droit de terrasse = 1 200 €/an</li>
              <li>Assurance + entretien = 1 000 €/an</li>
              <li><strong>Total charges : 4 600 €/an</strong></li>
              <li>Ticket moyen 28 € × marge brute 65 % = 18,20 € de marge/couvert</li>
              <li><strong>Seuil de rentabilité : 253 couverts à l'année</strong></li>
            </ul>
            <p className="leading-relaxed mb-3">
              À raison de 20 couverts/service × 3 services/semaine × 26 semaines = <strong>1 560 couverts potentiels</strong>. La terrasse est rentabilisée après seulement 16 % du potentiel saisonnier.
            </p>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              En général, les restaurateurs observent un CA estival supérieur de 25 à 40 % les années suivant l'ouverture d'une terrasse, avec un ticket moyen terrasse supérieur de 8 à 15 % à celui de la salle.
            </p>
          </section>

          <section id="erreurs" className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-4">5. Erreurs courantes et comment les éviter</h2>
            <div className="space-y-4">
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Erreur n°1 : Ouvrir sans autorisation</p>
                <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">Amende de 750 à 7 500 €, fermeture immédiate. Ne posez jamais un meuble avant d'avoir votre AOT signée.</p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Erreur n°2 : Négliger le bruit et les plaintes riverains</p>
                <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">Les plaintes peuvent bloquer le renouvellement. Respectez les horaires (souvent 22h), formez votre équipe au niveau sonore.</p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Erreur n°3 : Sous-estimer l'assurance</p>
                <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">Votre RC pro classique peut ne pas couvrir la terrasse sur domaine public. Vérifiez explicitement avec votre courtier.</p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Erreur n°4 : Acheter du mobilier non professionnel</p>
                <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">Le mobilier grand public ne résiste pas à un usage intensif. Après un été, vous rachetez tout. Privilégiez Fermob, Grosfillex Pro, etc.</p>
              </div>
              <div className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Erreur n°5 : Ne pas adapter le service</p>
                <p className="text-sm leading-relaxed text-[#737373] dark:text-[#A3A3A3]">Prévoyez 1 serveur pour 20-25 couverts max en terrasse, et un protocole rapide pour rentrer le mobilier en cas de pluie.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-satoshi text-2xl font-bold mb-6">FAQ — Terrasse de restaurant</h2>
            <div className="space-y-5">
              <div>
                <p className="font-semibold mb-1">Peut-on installer une terrasse fermée (type véranda) sur le domaine public ?</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">Oui, mais c'est soumis à une autorisation plus contraignante, parfois assimilée à une construction permanente nécessitant un permis d'aménager. Certaines villes l'interdisent pour des raisons esthétiques.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">La redevance de terrasse est-elle déductible des impôts ?</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">Oui, c'est une charge d'exploitation déductible du résultat imposable, comme n'importe quel loyer lié à l'activité. Conservez toutes vos quittances.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Mon voisin a une terrasse plus grande que son autorisation. Que faire ?</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">Signalez-le au service voirie de la mairie ou à la préfecture de police. Ces infractions sont vérifiables sur le terrain et peuvent bloquer votre propre demande si le trottoir est trop encombré.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Peut-on installer une terrasse sur un parking privé ?</p>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">Oui, si le parking appartient à votre bailleur et que le bail commercial l'autorise. Pas besoin de droit de terrasse municipal, mais vérifiez les règles du PLU et les droits de voisinage.</p>
              </div>
            </div>
          </section>

          <section className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-2xl p-8 text-center">
            <h2 className="font-satoshi text-2xl font-bold mb-3">Calculez la rentabilité de votre terrasse</h2>
            <p className="mb-5 text-sm opacity-80">RestauMargin vous aide à modéliser votre food cost, comparer vos marges par canal (salle, terrasse, livraison) et piloter votre restaurant avec des données en temps réel.</p>
            <a
              href="https://www.restaumargin.fr/pricing"
              className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Découvrir RestauMargin →
            </a>
          </section>
        </article>
      </main>
    </>
  );
}
