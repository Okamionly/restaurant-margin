import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CGV() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="text-3xl font-bold mb-2">Conditions Generales de Vente</h1>
        <p className="text-slate-400 mb-10">Derniere mise a jour : 27 mars 2026</p>

        <div className="space-y-10">
          {/* Article 1 - Objet */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 1 — Objet</h2>
            <p className="text-slate-300">
              Les presentes Conditions Generales de Vente (CGV) regissent les relations contractuelles
              entre RestauMargin, edite par Youssef Guessous (ci-apres "le Prestataire"), et tout
              professionnel de la restauration souscrivant aux services proposes (ci-apres "le Client").
            </p>
            <p className="text-slate-300">
              Toute souscription a un abonnement ou achat implique l'acceptation pleine et entiere des
              presentes CGV.
            </p>
          </section>

          {/* Article 2 - Services */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 2 — Services proposes</h2>
            <p className="text-slate-300">RestauMargin propose :</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li>
                <span className="font-medium text-white">Abonnement SaaS</span> : acces a la plateforme
                de gestion de marge pour la restauration, incluant gestion des ingredients, fiches
                techniques, menus, inventaires, commandes, comptabilite et outils d'intelligence (menu
                engineering, mercuriale, scanner de factures).
              </li>
              <li>
                <span className="font-medium text-white">Kit Hardware</span> : un ensemble comprenant
                une tablette Samsung Galaxy Tab A9+ preconfiguree et une balance Bluetooth connectee,
                destine a la pesee et au controle des portions en cuisine.
              </li>
            </ul>
          </section>

          {/* Article 3 - Prix */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 3 — Prix et modalites de paiement</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Abonnement SaaS</p>
                <p className="text-2xl font-bold text-white">29 EUR <span className="text-sm font-normal text-slate-400">/ mois HT</span></p>
                <p className="text-sm text-slate-400 mt-2">Facturation mensuelle, prelevement automatique par carte bancaire via Stripe.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Kit Hardware</p>
                <p className="text-2xl font-bold text-white">1 200 EUR <span className="text-sm font-normal text-slate-400">HT</span></p>
                <p className="text-sm text-slate-400 mt-2">Paiement unique a la commande. Livraison sous 5 a 10 jours ouvrables.</p>
              </div>
            </div>
            <p className="text-slate-300">
              Les prix sont indiques en euros hors taxes (HT). La TVA applicable sera ajoutee au montant
              HT selon le taux en vigueur.
            </p>
          </section>

          {/* Article 4 - Abonnement */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 4 — Duree et resiliation de l'abonnement</h2>
            <p className="text-slate-300">
              L'abonnement est souscrit pour une duree indeterminee, avec facturation mensuelle.
            </p>
            <p className="text-slate-300">
              Le Client peut resilier son abonnement a tout moment depuis son espace personnel. La
              resiliation prend effet a la fin de la periode de facturation en cours. Aucun remboursement
              au prorata ne sera effectue pour le mois en cours.
            </p>
            <p className="text-slate-300">
              Le Prestataire se reserve le droit de suspendre ou resilier l'abonnement en cas de
              non-paiement, d'utilisation frauduleuse ou de non-respect des presentes CGV.
            </p>
          </section>

          {/* Article 5 - Retractation */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 5 — Droit de retractation</h2>
            <p className="text-slate-300">
              Conformement aux articles L.221-18 et suivants du Code de la consommation, le Client
              dispose d'un delai de <span className="font-semibold text-white">14 jours</span> a compter
              de la reception du kit hardware pour exercer son droit de retractation, sans avoir a
              justifier de motif ni a payer de penalites.
            </p>
            <p className="text-slate-300">
              Pour exercer ce droit, le Client doit notifier sa decision par email a{' '}
              <span className="text-blue-400">mr.guessousyoussef@gmail.com</span> ou par courrier.
              Le materiel devra etre retourne dans son emballage d'origine, en parfait etat, dans un
              delai de 14 jours suivant la notification.
            </p>
            <p className="text-slate-300">
              Le remboursement sera effectue dans un delai de 14 jours a compter de la reception du
              materiel retourne.
            </p>
            <p className="text-slate-300">
              Concernant l'abonnement SaaS, le droit de retractation ne s'applique pas une fois que le
              service a ete pleinement execute avant la fin du delai de retractation avec l'accord
              prealable du Client (article L.221-28 du Code de la consommation).
            </p>
          </section>

          {/* Article 6 - Garantie hardware */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 6 — Garantie du kit hardware</h2>
            <p className="text-slate-300">
              Le kit hardware beneficie d'une <span className="font-semibold text-white">garantie legale
              de conformite de 2 ans</span> a compter de la date de livraison, conformement aux articles
              L.217-4 et suivants du Code de la consommation.
            </p>
            <p className="text-slate-300">
              En cas de defaut de conformite constate pendant la periode de garantie, le Client peut
              demander la reparation ou le remplacement du materiel defectueux, sans frais.
            </p>
            <p className="text-slate-300">
              La garantie ne couvre pas les dommages resultant d'une mauvaise utilisation, d'une chute,
              d'un contact avec des liquides ou de toute intervention non autorisee.
            </p>
          </section>

          {/* Article 7 - Responsabilites */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 7 — Responsabilites</h2>
            <h3 className="text-lg font-medium text-white">Obligations du Prestataire</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1 ml-2">
              <li>Fournir un acces continu et securise a la plateforme (obligation de moyens)</li>
              <li>Assurer la sauvegarde reguliere des donnees</li>
              <li>Notifier le Client en cas de maintenance planifiee</li>
              <li>Corriger les bugs et dysfonctionnements dans un delai raisonnable</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">Obligations du Client</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1 ml-2">
              <li>Utiliser le service conformement a sa destination</li>
              <li>Maintenir la confidentialite de ses identifiants de connexion</li>
              <li>Ne pas tenter de contourner les mesures de securite</li>
              <li>S'acquitter des paiements dans les delais prevus</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">Limitation de responsabilite</h3>
            <p className="text-slate-300">
              La responsabilite du Prestataire est limitee aux dommages directs et previsibles. En aucun
              cas le Prestataire ne pourra etre tenu responsable des dommages indirects (perte de chiffre
              d'affaires, perte de donnees, etc.). La responsabilite totale du Prestataire ne pourra
              exceder le montant des sommes versees par le Client au cours des 12 derniers mois.
            </p>
          </section>

          {/* Article 8 - Propriete intellectuelle */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 8 — Propriete intellectuelle</h2>
            <p className="text-slate-300">
              Le Prestataire reste titulaire de l'ensemble des droits de propriete intellectuelle sur la
              plateforme RestauMargin, son code source, son architecture, ses algorithmes, sa charte
              graphique, ses bases de donnees et ses contenus.
            </p>
            <p className="text-slate-300">
              L'abonnement confere au Client un droit d'utilisation personnel, non exclusif, non
              cessible et non transferable de la plateforme, pour la duree de l'abonnement.
            </p>
            <p className="text-slate-300">
              Le Client conserve la propriete de toutes les donnees qu'il saisit sur la plateforme
              (ingredients, recettes, menus, inventaires, etc.).
            </p>
          </section>

          {/* Article 9 - Donnees personnelles */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 9 — Protection des donnees personnelles</h2>
            <p className="text-slate-300">
              Le traitement des donnees personnelles est effectue conformement au RGPD. Pour plus de
              details, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-blue-400 hover:text-blue-300 underline">
                Politique de confidentialite
              </a>.
            </p>
          </section>

          {/* Article 10 - Force majeure */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 10 — Force majeure</h2>
            <p className="text-slate-300">
              Aucune des parties ne pourra etre tenue responsable de l'inexecution de ses obligations en
              cas de force majeure telle que definie par l'article 1218 du Code civil (catastrophes
              naturelles, pandemies, pannes de reseau, cyberattaques, etc.).
            </p>
          </section>

          {/* Article 11 - Droit applicable */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 11 — Droit applicable et litiges</h2>
            <p className="text-slate-300">
              Les presentes CGV sont soumises au droit francais. En cas de litige, les parties
              s'engagent a rechercher une solution amiable prealablement a toute action judiciaire.
            </p>
            <p className="text-slate-300">
              A defaut d'accord amiable dans un delai de 30 jours, le litige sera soumis aux tribunaux
              competents du ressort du siege social du Prestataire.
            </p>
          </section>

          {/* Article 12 - Contact */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">Article 12 — Contact</h2>
            <p className="text-slate-300">
              Pour toute question relative aux presentes CGV, vous pouvez nous contacter a :{' '}
              <span className="text-blue-400">mr.guessousyoussef@gmail.com</span>
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="/mentions-legales" className="hover:text-blue-400 transition-colors">Mentions legales</a>
          <a href="/politique-confidentialite" className="hover:text-blue-400 transition-colors">Politique de confidentialite</a>
        </div>
      </div>
    </div>
  );
}
