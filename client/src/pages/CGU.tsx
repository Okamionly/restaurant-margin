import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CGU() {
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

        <h1 className="text-3xl font-bold mb-2">Conditions Generales d'Utilisation</h1>
        <p className="text-slate-400 mb-10">Derniere mise a jour : 28 mars 2026</p>

        <div className="space-y-10">
          {/* 1. Objet */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">1. Objet</h2>
            <p className="text-slate-300">
              Les presentes Conditions Generales d'Utilisation (ci-apres « CGU ») ont pour objet de definir
              les modalites et conditions d'utilisation de la plateforme RestauMargin, accessible a l'adresse
              https://restaumargin.com.
            </p>
            <p className="text-slate-300">
              RestauMargin est une plateforme SaaS de gestion de marge destinee aux professionnels de la
              restauration. Elle permet le calcul des couts, le suivi des marges, la gestion des ingredients,
              des recettes, des fournisseurs et de l'inventaire.
            </p>
          </section>

          {/* 2. Inscription et compte */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">2. Inscription et compte</h2>
            <p className="text-slate-300">
              L'acces aux fonctionnalites de RestauMargin necessite la creation d'un compte utilisateur.
              L'utilisateur s'engage a fournir des informations exactes et a jour lors de son inscription.
            </p>
            <p className="text-slate-300">
              L'utilisateur est seul responsable de la confidentialite de ses identifiants de connexion
              (email et mot de passe). Toute activite realisee depuis son compte est presumee avoir ete
              effectuee par lui.
            </p>
            <p className="text-slate-300">
              En cas de compromission de son compte, l'utilisateur doit en informer RestauMargin dans les
              plus brefs delais a l'adresse contact@restaumargin.com.
            </p>
          </section>

          {/* 3. Services */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">3. Services</h2>
            <p className="text-slate-300">
              RestauMargin propose les fonctionnalites suivantes, selon le plan d'abonnement souscrit :
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1 ml-2">
              <li>Calcul de marge en temps reel sur les recettes et fiches techniques</li>
              <li>Gestion des ingredients et suivi des prix fournisseurs</li>
              <li>Creation et gestion des fiches techniques (recettes)</li>
              <li>Gestion des fournisseurs et mercuriale des prix</li>
              <li>Inventaire et suivi des stocks</li>
              <li>Assistant IA pour l'optimisation des couts et des menus</li>
              <li>Scan de factures par OCR</li>
              <li>Menu Engineering et analyse de rentabilite</li>
              <li>Conformite HACCP et tracabilite</li>
            </ul>
          </section>

          {/* 4. Obligations de l'utilisateur */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">4. Obligations de l'utilisateur</h2>
            <p className="text-slate-300">L'utilisateur s'engage a :</p>
            <ul className="list-disc list-inside text-slate-300 space-y-1 ml-2">
              <li>Utiliser la plateforme de maniere conforme a sa destination et aux presentes CGU</li>
              <li>Ne pas tenter d'acceder de maniere non autorisee aux systemes de RestauMargin</li>
              <li>Ne pas effectuer de scraping, d'extraction automatisee ou de reverse engineering</li>
              <li>Ne pas diffuser de contenu illicite, diffamatoire, ou contraire a l'ordre public</li>
              <li>Ne pas utiliser la plateforme a des fins frauduleuses ou illegales</li>
              <li>Respecter les droits de propriete intellectuelle de RestauMargin et des tiers</li>
            </ul>
          </section>

          {/* 5. Propriete intellectuelle */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">5. Propriete intellectuelle</h2>
            <p className="text-slate-300">
              RestauMargin detient l'ensemble des droits de propriete intellectuelle relatifs a la plateforme,
              incluant le code source, le design, les textes, les logos et les fonctionnalites.
            </p>
            <p className="text-slate-300">
              L'utilisateur conserve la pleine propriete de ses donnees (recettes, ingredients, fournisseurs,
              inventaires) saisies sur la plateforme. RestauMargin ne revendique aucun droit sur ces contenus.
            </p>
            <p className="text-slate-300">
              Toute reproduction, representation ou utilisation non autorisee de la plateforme ou de ses
              elements constitue une contrefacon sanctionnee par la loi.
            </p>
          </section>

          {/* 6. Donnees personnelles */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">6. Donnees personnelles</h2>
            <p className="text-slate-300">
              RestauMargin collecte et traite des donnees personnelles dans le cadre de l'utilisation de la
              plateforme, conformement au Reglement General sur la Protection des Donnees (RGPD).
            </p>
            <p className="text-slate-300">
              Pour en savoir plus sur la collecte, le traitement et la protection de vos donnees personnelles,
              veuillez consulter notre{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialite
              </a>.
            </p>
          </section>

          {/* 7. Responsabilite */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">7. Responsabilite</h2>
            <p className="text-slate-300">
              RestauMargin s'efforce d'assurer la disponibilite et le bon fonctionnement de la plateforme.
              Toutefois, le service est fourni « en l'etat », sans garantie d'aucune sorte.
            </p>
            <p className="text-slate-300">
              RestauMargin ne saurait etre tenu responsable des dommages directs ou indirects resultant de
              l'utilisation ou de l'impossibilite d'utilisation de la plateforme, notamment en cas de perte
              de donnees, d'interruption de service ou de dysfonctionnement technique.
            </p>
            <p className="text-slate-300">
              L'utilisateur est seul responsable de l'exactitude des donnees qu'il saisit et des decisions
              commerciales qu'il prend sur la base des informations fournies par la plateforme.
            </p>
          </section>

          {/* 8. Resiliation */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">8. Resiliation</h2>
            <p className="text-slate-300">
              L'utilisateur peut a tout moment supprimer son compte depuis les parametres de son profil.
              La suppression entraine l'effacement definitif de toutes ses donnees apres un delai de 30 jours.
            </p>
            <p className="text-slate-300">
              RestauMargin se reserve le droit de suspendre ou de supprimer un compte en cas de violation des
              presentes CGU, d'utilisation abusive de la plateforme, ou de non-paiement de l'abonnement.
              L'utilisateur sera prealablement informe par email, sauf en cas d'urgence.
            </p>
          </section>

          {/* 9. Modification des CGU */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">9. Modification des CGU</h2>
            <p className="text-slate-300">
              RestauMargin se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs
              seront informes de toute modification substantielle par email et/ou par une notification sur
              la plateforme.
            </p>
            <p className="text-slate-300">
              La poursuite de l'utilisation de la plateforme apres notification des modifications vaut
              acceptation des nouvelles CGU. En cas de desaccord, l'utilisateur peut supprimer son compte.
            </p>
          </section>

          {/* 10. Droit applicable */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">10. Droit applicable</h2>
            <p className="text-slate-300">
              Les presentes CGU sont soumises au droit francais. En cas de litige relatif a l'interpretation
              ou a l'execution des presentes, les parties s'engagent a rechercher une solution amiable.
            </p>
            <p className="text-slate-300">
              A defaut d'accord amiable, les tribunaux francais seront seuls competents pour connaitre du litige.
            </p>
          </section>

          {/* 11. Contact */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">11. Contact</h2>
            <p className="text-slate-300">
              Pour toute question relative aux presentes CGU, vous pouvez nous contacter a l'adresse suivante :
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Email :</span>{' '}
              <a href="mailto:contact@restaumargin.com" className="text-teal-400 hover:text-teal-300 underline">
                contact@restaumargin.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions legales</a>
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions generales de vente</a>
          <a href="/politique-confidentialite" className="hover:text-teal-400 transition-colors">Politique de confidentialite</a>
        </div>
      </div>
    </div>
  );
}
