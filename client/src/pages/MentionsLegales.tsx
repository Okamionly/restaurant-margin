import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MentionsLegales() {
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

        <h1 className="text-3xl font-bold mb-2">Mentions Legales</h1>
        <p className="text-slate-400 mb-10">Derniere mise a jour : 27 mars 2026</p>

        <div className="space-y-10">
          {/* Editeur */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">1. Editeur du site</h2>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Nom :</span> Youssef Guessous</p>
              <p><span className="text-slate-400">Entreprise :</span> RestauMargin</p>
              <p><span className="text-slate-400">Statut :</span> Entrepreneur individuel</p>
              <p><span className="text-slate-400">Email :</span> contact@restaumargin.fr</p>
              <p><span className="text-slate-400">Site web :</span> https://restaumargin.com</p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">2. Directeur de la publication</h2>
            <p className="text-slate-300">Youssef Guessous — contact@restaumargin.fr</p>
          </section>

          {/* Hebergeur */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">3. Hebergeur</h2>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Raison sociale :</span> Vercel Inc.</p>
              <p><span className="text-slate-400">Adresse :</span> 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              <p><span className="text-slate-400">Site web :</span> https://vercel.com</p>
            </div>
          </section>

          {/* Propriete intellectuelle */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">4. Propriete intellectuelle</h2>
            <p className="text-slate-300">
              L'ensemble du contenu de ce site (textes, images, logos, icones, logiciels, base de donnees)
              est la propriete exclusive de RestauMargin ou de ses partenaires et est protege par les lois
              francaises et internationales relatives a la propriete intellectuelle.
            </p>
            <p className="text-slate-300">
              Toute reproduction, representation, modification, publication ou adaptation de tout ou partie
              des elements du site, quel que soit le moyen ou le procede utilise, est interdite sans
              autorisation ecrite prealable de RestauMargin.
            </p>
          </section>

          {/* Donnees personnelles */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">5. Donnees personnelles</h2>
            <p className="text-slate-300">
              Les informations collectees sur ce site font l'objet d'un traitement conforme au Reglement
              General sur la Protection des Donnees (RGPD). Pour en savoir plus, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-blue-400 hover:text-blue-300 underline">
                Politique de confidentialite
              </a>.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">6. Cookies</h2>
            <p className="text-slate-300">
              Ce site utilise des cookies pour ameliorer l'experience utilisateur et mesurer l'audience.
              Vous pouvez configurer vos preferences via le bandeau de cookies affiche lors de votre
              premiere visite. Pour plus d'informations, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-blue-400 hover:text-blue-300 underline">
                Politique de confidentialite
              </a>.
            </p>
          </section>

          {/* Limitation de responsabilite */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">7. Limitation de responsabilite</h2>
            <p className="text-slate-300">
              RestauMargin s'efforce de fournir des informations aussi precises que possible. Toutefois,
              il ne pourra etre tenu responsable des omissions, inexactitudes ou carences dans la mise a
              jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces
              informations.
            </p>
          </section>

          {/* Droit applicable */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-blue-400">8. Droit applicable</h2>
            <p className="text-slate-300">
              Les presentes mentions legales sont soumises au droit francais. En cas de litige, les
              tribunaux francais seront seuls competents.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="/cgv" className="hover:text-blue-400 transition-colors">Conditions generales de vente</a>
          <a href="/politique-confidentialite" className="hover:text-blue-400 transition-colors">Politique de confidentialite</a>
        </div>
      </div>
    </div>
  );
}
