import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PolitiqueConfidentialite() {
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

        <h1 className="text-3xl font-bold mb-2">Politique de Confidentialite</h1>
        <p className="text-slate-400 mb-10">Derniere mise a jour : 27 mars 2026</p>

        <div className="space-y-10">
          {/* Introduction */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">1. Introduction</h2>
            <p className="text-slate-300">
              RestauMargin, edite par Youssef Guessous, s'engage a proteger la vie privee des
              utilisateurs de sa plateforme. La presente politique de confidentialite decrit les donnees
              personnelles que nous collectons, les finalites de leur traitement, leur duree de
              conservation et les droits dont vous disposez conformement au Reglement General sur la
              Protection des Donnees (RGPD — Reglement UE 2016/679).
            </p>
          </section>

          {/* Responsable du traitement */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">2. Responsable du traitement</h2>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Nom :</span> Youssef Guessous</p>
              <p><span className="text-slate-400">Entreprise :</span> RestauMargin</p>
              <p><span className="text-slate-400">Email de contact :</span> contact@restaumargin.fr</p>
            </div>
          </section>

          {/* Donnees collectees */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">3. Donnees collectees</h2>
            <p className="text-slate-300">Nous collectons les categories de donnees suivantes :</p>

            <div className="space-y-4 mt-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-medium text-white mb-2">Donnees d'identification</h3>
                <p className="text-slate-300 text-sm">
                  Nom, prenom, adresse email, numero de telephone, nom du restaurant, type de cuisine.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-medium text-white mb-2">Donnees de connexion</h3>
                <p className="text-slate-300 text-sm">
                  Adresse IP, type de navigateur, systeme d'exploitation, pages consultees, date et
                  heure de connexion.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-medium text-white mb-2">Donnees metier</h3>
                <p className="text-slate-300 text-sm">
                  Ingredients, recettes, fiches techniques, menus, inventaires, commandes, donnees
                  comptables, historique de pesees — toutes les donnees saisies par l'utilisateur dans
                  le cadre de l'utilisation du service.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-medium text-white mb-2">Donnees de paiement</h3>
                <p className="text-slate-300 text-sm">
                  Les donnees de carte bancaire sont collectees et traitees exclusivement par notre
                  prestataire de paiement Stripe. RestauMargin ne stocke jamais les numeros de carte
                  bancaire.
                </p>
              </div>
            </div>
          </section>

          {/* Finalites */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">4. Finalites du traitement</h2>
            <p className="text-slate-300">Vos donnees sont traitees pour les finalites suivantes :</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li>Creation et gestion de votre compte utilisateur</li>
              <li>Fourniture et amelioration du service RestauMargin</li>
              <li>Gestion de la facturation et des paiements</li>
              <li>Communication relative au service (notifications, mises a jour, support)</li>
              <li>Analyse d'usage et amelioration de la plateforme</li>
              <li>Respect des obligations legales et reglementaires</li>
            </ul>
            <p className="text-slate-300 mt-3">
              <span className="font-medium text-white">Base legale :</span> execution du contrat
              (article 6.1.b du RGPD), consentement (article 6.1.a) pour les cookies analytiques, et
              interet legitime (article 6.1.f) pour l'amelioration du service.
            </p>
          </section>

          {/* Duree de conservation */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">5. Duree de conservation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Type de donnees</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Duree</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">Donnees de compte</td>
                    <td className="py-3 px-4">Duree de l'abonnement + 3 ans apres suppression</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">Donnees metier</td>
                    <td className="py-3 px-4">Duree de l'abonnement + 1 an</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">Donnees de facturation</td>
                    <td className="py-3 px-4">10 ans (obligation legale comptable)</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">Logs de connexion</td>
                    <td className="py-3 px-4">1 an</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Cookies</td>
                    <td className="py-3 px-4">13 mois maximum</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Droits des utilisateurs */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">6. Vos droits</h2>
            <p className="text-slate-300">
              Conformement au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li><span className="font-medium text-white">Droit d'acces :</span> obtenir la confirmation que vos donnees sont traitees et en recevoir une copie</li>
              <li><span className="font-medium text-white">Droit de rectification :</span> corriger vos donnees inexactes ou incompletes</li>
              <li><span className="font-medium text-white">Droit a l'effacement :</span> demander la suppression de vos donnees</li>
              <li><span className="font-medium text-white">Droit a la limitation :</span> demander la restriction du traitement de vos donnees</li>
              <li><span className="font-medium text-white">Droit a la portabilite :</span> recevoir vos donnees dans un format structure et lisible par machine</li>
              <li><span className="font-medium text-white">Droit d'opposition :</span> vous opposer au traitement de vos donnees pour motifs legitimes</li>
              <li><span className="font-medium text-white">Droit de retirer votre consentement :</span> a tout moment pour les traitements bases sur le consentement</li>
            </ul>
            <p className="text-slate-300 mt-3">
              Pour exercer ces droits, contactez-nous a :{' '}
              <span className="text-teal-400">contact@restaumargin.fr</span>
            </p>
            <p className="text-slate-300">
              Vous disposez egalement du droit de deposer une reclamation aupres de la CNIL
              (Commission Nationale de l'Informatique et des Libertes) — www.cnil.fr.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">7. Cookies</h2>
            <p className="text-slate-300">
              Notre site utilise des cookies pour assurer son bon fonctionnement et ameliorer votre
              experience.
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-medium text-white mb-1">Cookies essentiels</h3>
                <p className="text-slate-300 text-sm">
                  Necessaires au fonctionnement du site (authentification, preferences). Ne peuvent
                  pas etre desactives.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="font-medium text-white mb-1">Cookies analytiques</h3>
                <p className="text-slate-300 text-sm">
                  Permettent de mesurer l'audience et d'analyser l'utilisation du site pour
                  l'ameliorer. Soumis a votre consentement.
                </p>
              </div>
            </div>
            <p className="text-slate-300 mt-3">
              Vous pouvez modifier vos preferences a tout moment via le bandeau de cookies ou les
              parametres de votre navigateur.
            </p>
          </section>

          {/* Sous-traitants */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">8. Sous-traitants et transferts de donnees</h2>
            <p className="text-slate-300">
              Nous faisons appel aux sous-traitants suivants pour le fonctionnement de notre service :
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Sous-traitant</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Finalite</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Localisation</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium text-white">Supabase</td>
                    <td className="py-3 px-4">Base de donnees, authentification, stockage</td>
                    <td className="py-3 px-4">UE (AWS Frankfurt)</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium text-white">Vercel</td>
                    <td className="py-3 px-4">Hebergement du frontend et des API</td>
                    <td className="py-3 px-4">USA (clauses contractuelles types)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Stripe</td>
                    <td className="py-3 px-4">Traitement des paiements</td>
                    <td className="py-3 px-4">USA (certifie Privacy Shield, clauses contractuelles types)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-300 mt-3">
              Les transferts de donnees vers les Etats-Unis sont encadres par des clauses contractuelles
              types (CCT) approuvees par la Commission europeenne, conformement a l'article 46 du RGPD.
            </p>
          </section>

          {/* Securite */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">9. Securite des donnees</h2>
            <p className="text-slate-300">
              Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour
              proteger vos donnees personnelles contre tout acces non autorise, perte, alteration ou
              divulgation :
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1 ml-2">
              <li>Chiffrement des donnees en transit (HTTPS/TLS)</li>
              <li>Chiffrement des donnees au repos</li>
              <li>Controle des acces par authentification</li>
              <li>Sauvegardes regulieres</li>
              <li>Mots de passe hashes avec algorithmes securises</li>
            </ul>
          </section>

          {/* Modifications */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">10. Modification de la politique</h2>
            <p className="text-slate-300">
              Nous nous reservons le droit de modifier cette politique de confidentialite a tout moment.
              En cas de modification substantielle, nous vous en informerons par email ou par notification
              dans l'application. La date de derniere mise a jour est indiquee en haut de cette page.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">11. Contact</h2>
            <p className="text-slate-300">
              Pour toute question concernant cette politique de confidentialite ou vos donnees
              personnelles, contactez-nous a :{' '}
              <span className="text-teal-400">contact@restaumargin.fr</span>
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions legales</a>
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions generales de vente</a>
        </div>
      </div>
    </div>
  );
}
