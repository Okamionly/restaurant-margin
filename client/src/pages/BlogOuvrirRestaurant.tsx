import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Lightbulb, MapPin, FileText, Building2, Banknote, Scale, FileCheck, Wrench, Users, Megaphone, AlertTriangle, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogOuvrirRestaurant() {
  const faqSchema = buildFAQSchema([
    {
      question: "Combien de temps faut-il pour ouvrir un restaurant ?",
      answer: "Comptez 8 à 14 mois entre la décision et la première fourchette servie. Recherche de local 3-6 mois, démarches administratives 2-4 mois, travaux 2-4 mois."
    },
    {
      question: "Faut-il un diplôme de cuisine pour ouvrir un restaurant ?",
      answer: "Non. Aucun diplôme n'est obligatoire en France. Seul le permis d'exploitation (formation 20h) est requis pour servir de l'alcool. Mais ne pas avoir d'expérience est statistiquement le premier facteur de fermeture précoce."
    },
    {
      question: "Vaut-il mieux acheter un fonds existant ou ouvrir from scratch ?",
      answer: "Reprendre un fonds existant coûte plus cher mais évite les travaux lourds, génère un CA dès le jour 1, et facilite l'obtention d'un prêt. Pour un premier projet, la reprise est souvent plus sûre."
    },
    {
      question: "Quel chiffre d'affaires viser la première année ?",
      answer: "Un bistrot de 50 couverts en ville moyenne table sur 350 000 à 500 000€ HT la première année, avec montée en puissance progressive : 60% au T1, 80% au T2, 100% à partir du T4."
    },
    {
      question: "Quand sait-on que le restaurant est viable ?",
      answer: "Si à la fin du mois 6 vous tournez à plus de 70% du CA prévisionnel et que votre prime cost est sous 65%, le projet est viable. Sinon, plan de redressement immédiat."
    }
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Comment ouvrir un restaurant", url: "https://www.restaumargin.fr/blog/comment-ouvrir-restaurant-guide-complet" }
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Comment ouvrir un restaurant en 2026 : guide complet étape par étape"
        description="Les 10 étapes pour ouvrir votre restaurant : business plan, financement, licences, recrutement. Guide complet pour créer un restaurant rentable."
        path="/blog/comment-ouvrir-restaurant-guide-complet"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment ouvrir un restaurant en 2026 : guide complet étape par étape",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/comment-ouvrir-restaurant-guide-complet"
          })
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <BlogArticleHero
        category="Création"
        readTime="15 min"
        date="Avril 2026"
        title="Comment ouvrir un restaurant en 2026 : guide complet étape par étape"
        accentWord="ouvrir un restaurant"
        subtitle="60% des restaurants ferment dans les 3 premières années. Voici les 10 étapes, le budget réaliste et les pièges à éviter pour faire partie des 40% qui réussissent."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Saviez-vous que 60% des restaurants ferment dans les 3 premières années en France ? Pourtant, chaque mois, près de 1 200 nouveaux établissements ouvrent leurs portes. La différence entre ceux qui survivent et ceux qui disparaissent ne tient pas à la qualité de la cuisine, mais à la rigueur de la préparation. Ouvrir un restaurant en 2026 demande entre <strong>80 000€ et 250 000€ d'investissement</strong>, une connaissance fine de la réglementation, et surtout une obsession pour les chiffres dès le premier jour.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#concept" className="hover:text-teal-600 transition-colors">1. Définir votre concept</a></li>
            <li><a href="#etude" className="hover:text-teal-600 transition-colors">2. Réaliser une étude de marché</a></li>
            <li><a href="#business-plan" className="hover:text-teal-600 transition-colors">3. Construire votre business plan</a></li>
            <li><a href="#local" className="hover:text-teal-600 transition-colors">4. Choisir le local idéal</a></li>
            <li><a href="#financement" className="hover:text-teal-600 transition-colors">5. Trouver le financement</a></li>
            <li><a href="#statut" className="hover:text-teal-600 transition-colors">6. Choisir le statut juridique</a></li>
            <li><a href="#licences" className="hover:text-teal-600 transition-colors">7. Obtenir licences et permis</a></li>
            <li><a href="#cuisine" className="hover:text-teal-600 transition-colors">8. Équiper la cuisine</a></li>
            <li><a href="#equipe" className="hover:text-teal-600 transition-colors">9. Recruter votre équipe</a></li>
            <li><a href="#lancement" className="hover:text-teal-600 transition-colors">10. Lancer et communiquer</a></li>
            <li><a href="#erreurs" className="hover:text-teal-600 transition-colors">Les 7 erreurs à éviter</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="concept" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Définir votre concept</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Tout commence par une promesse claire. Un concept de restaurant tient en une phrase courte qu'un client peut répéter à un ami : <em>"un bistrot de quartier qui sert les meilleurs burgers maison à moins de 18€"</em>.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Les 6 questions à se poser :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Cuisine : française, méditerranéenne, asiatique, fusion ?</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Cible : étudiants, employés, familles, touristes ?</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Gamme de prix : 12€, 25€, 45€, 80€+ ?</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Service : à table, comptoir, click & collect ?</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Capacité : 30, 60, 100, 150 couverts ?</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Horaires : déjeuner, soir, continu, brunch ?</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Mieux vaut être le meilleur ramen de votre arrondissement qu'un restaurant moyen qui propose ramen, pasta, salades, burgers et tarama. La spécialisation crée la notoriété.
          </p>
        </section>

        {/* Section 2 */}
        <section id="etude" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Réaliser une étude de marché</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Une étude sérieuse coûte entre 0€ (en autonomie) et 5 000€ (cabinet). Elle doit répondre à 4 questions concrètes : zone de chalandise, concurrence directe, concurrence indirecte, et flux de passants.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Le test sur le terrain :</strong> passez 5 jours différents à compter les passants devant votre futur local entre 11h45 et 14h, puis entre 19h et 22h. Cette donnée brute vaut plus que mille études théoriques.
          </p>
        </section>

        {/* Section 3 */}
        <section id="business-plan" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Construire votre business plan</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le business plan est votre boussole et votre meilleur argument pour décrocher un financement. Comptez 30 à 60 pages, avec une partie financière sur 3 ans.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Le ratio à présenter dès la page 2 : Prime cost prévisionnel
          </div>
          <p className="text-[#374151] leading-relaxed">
            Les banques regardent immédiatement ce chiffre. Sous 60% : excellent. 60-65% : bon. 65-70% : tendu. Au-delà : refus probable.
          </p>
        </section>

        {/* Section 4 */}
        <section id="local" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Choisir le local idéal</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le local représente entre 40% et 60% du succès d'un restaurant. Un mauvais emplacement avec une cuisine excellente peut couler le projet.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Loyer max ≤ 8 à 10% du CA prévisionnel
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un loyer de 4 500€ HT/mois suppose un CA mensuel de 50 000€ minimum, soit un CA annuel de 600 000€. Si vos prévisions ne tiennent pas ce niveau, fuyez.
          </p>
          <p className="text-[#374151] leading-relaxed"><strong>À négocier dans le bail 3-6-9 :</strong> franchise de loyer (3 à 6 mois), plafonnement de l'indexation ILC, droit au bail vs pas-de-porte, travaux à charge bailleur ou preneur, clause d'activités large.</p>
        </section>

        {/* Section 5 */}
        <section id="financement" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Trouver le financement</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            La structure type : 25-35% d'apport personnel, 40-50% de prêt bancaire, 5-10% de prêt d'honneur, 5-15% de crowdfunding, 3-8% d'aides régionales.
          </p>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-red-700">La règle des 30%</p>
            <p className="text-sm text-red-600">Aucune banque ne vous prêtera sans 30% d'apport personnel minimum. Pour un projet à 150 000€, comptez 45 000€ d'apport.</p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Les aides 2026 :</strong> ACRE (5 000-8 000€ d'économies), Prêt BPI Création (jusqu'à 50 000€), NACRE (8 000€ à taux zéro), ARCE (60% du reliquat France Travail). Les aides régionales représentent 3 000 à 15 000€ supplémentaires.
          </p>
        </section>

        {/* Section 6 */}
        <section id="statut" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Choisir le statut juridique</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Trois statuts dominent en restauration : <strong>EURL</strong> (solo, premier projet, charges optimisées), <strong>SARL</strong> (familial, gérance partagée), <strong>SAS/SASU</strong> (associés, levée de fonds).
          </p>
          <p className="text-[#374151] leading-relaxed">
            Comptez 800 à 2 500€ pour la rédaction des statuts (avocat ou expert-comptable), 150-250€ de publication légale, et 1 à 2 semaines pour obtenir le Kbis.
          </p>
        </section>

        {/* Section 7 */}
        <section id="licences" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">7. Obtenir licences et permis</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            C'est l'étape la plus chronophage : 2 à 4 mois pour l'ensemble. <strong>Le permis d'exploitation</strong> est obligatoire avant l'ouverture (formation 20h, 250-400€).
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /> Licence restaurant complète (IV) pour servir tous alcools avec repas</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /> Déclaration ERP en mairie (commission de sécurité)</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /> Déclaration sanitaire DDPP (CERFA n°13984)</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /> Plan de Maîtrise Sanitaire (PMS) HACCP obligatoire</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" /> Formation HACCP 14h pour au moins une personne</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section id="cuisine" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">8. Équiper la cuisine</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Budget total pour 60 couverts : 30 000€ à 120 000€. La répartition typique : piano 6-15K€, four mixte 4-12K€, chambre froide 5-15K€, plonge + lave-vaisselle 4-8K€, mobilier salle 5-25K€.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Neuf vs occasion :</strong> les sites pros (Restomarché, Bazardesresto) permettent d'économiser 30 à 50% avec garantie. Évitez Le Bon Coin pour la cuisson : risque de panne dans les 3 mois.
          </p>
        </section>

        {/* Section 9 */}
        <section id="equipe" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">9. Recruter votre équipe</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pénurie réelle : 250 000 postes vacants en France en 2026. Pour un bistrot 50 couverts, comptez chef (3 200-4 200€), commis (2 100-2 800€), plongeur (1 800-2 100€), chef de rang (2 200-2 800€), serveur (1 800-2 100€) — soit ~16 800€/mois chargé.
          </p>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-amber-700">Coût caché d'un mauvais recrutement</p>
            <p className="text-sm text-amber-700">Un employé qui démissionne dans le mois coûte 2 500 à 4 000€. Mieux vaut prendre le temps que de remplacer 3 fois en 6 mois.</p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="lancement" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">10. Lancer et communiquer</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>Les 4 phases :</strong> soft opening (2 semaines avant), friends & family (semaine -1), pré-lancement digital (Instagram + Google Business), lancement officiel avec presse locale.
          </p>
          <p className="text-[#374151] leading-relaxed">
            <strong>Calendrier 90 jours :</strong> J+1 à J+30 viser 60% de remplissage, J+30 à J+60 viser 80%, J+60 à J+90 atteindre le rythme de croisière et faire la première analyse comptable sérieuse.
          </p>
        </section>

        {/* Erreurs */}
        <section id="erreurs" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">Les 7 erreurs à éviter</h2>
          </div>
          <ol className="space-y-3 text-[#374151] list-decimal pl-5">
            <li><strong>Sous-estimer le BFR.</strong> Sans 3 mois de trésorerie d'avance, le moindre ralentissement tue le projet.</li>
            <li><strong>Ne pas mesurer son food cost.</strong> Marge brute à 55% au lieu de 70%, plomb dans l'aile dès le mois 6.</li>
            <li><strong>Surcharger la carte.</strong> Les meilleurs restaurants 2026 fonctionnent avec 12 à 18 plats.</li>
            <li><strong>Négliger les outils digitaux.</strong> Un restaurant sans Google Business à jour perd 30% de clientèle.</li>
            <li><strong>Confondre passion et compétence gestionnaire.</strong> Si vous détestez les chiffres, prenez un associé.</li>
            <li><strong>Ouvrir avec un endettement excessif.</strong> Plus le remboursement est élevé, plus le seuil de rentabilité monte.</li>
            <li><strong>Ne pas piloter ses marges au quotidien.</strong> Sans tableau de bord hebdomadaire, on découvre les pertes 3 mois trop tard.</li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Combien de temps faut-il pour ouvrir un restaurant ?",
                a: "Comptez 8 à 14 mois entre la décision et la première fourchette servie. Recherche de local 3-6 mois, démarches administratives 2-4 mois, travaux 2-4 mois."
              },
              {
                q: "Faut-il un diplôme de cuisine pour ouvrir un restaurant ?",
                a: "Non. Aucun diplôme n'est obligatoire en France. Seul le permis d'exploitation (formation 20h) est requis pour servir de l'alcool. Mais ne pas avoir d'expérience est statistiquement le premier facteur de fermeture précoce."
              },
              {
                q: "Vaut-il mieux acheter un fonds existant ou ouvrir from scratch ?",
                a: "Reprendre un fonds existant coûte plus cher mais évite les travaux lourds, génère un CA dès le jour 1, et facilite l'obtention d'un prêt. Pour un premier projet, la reprise est souvent plus sûre."
              },
              {
                q: "Quel chiffre d'affaires viser la première année ?",
                a: "Un bistrot de 50 couverts en ville moyenne table sur 350 000 à 500 000€ HT la première année, avec montée en puissance progressive : 60% au T1, 80% au T2, 100% à partir du T4."
              },
              {
                q: "Quand sait-on que le restaurant est viable ?",
                a: "Si à la fin du mois 6 vous tournez à plus de 70% du CA prévisionnel et que votre prime cost est sous 65%, le projet est viable. Sinon, plan de redressement immédiat."
              }
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-[#525252] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Lancez votre restaurant avec les bons outils</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin suit votre food cost, votre masse salariale et votre rentabilité en temps réel, dès le premier service. La différence entre un restaurant qui survit et un restaurant qui prospère.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/prime-cost-restaurant" className="text-sm text-teal-600 hover:underline">Maîtriser le prime cost →</Link>
        </div>
      </main>
    </div>
  );
}
