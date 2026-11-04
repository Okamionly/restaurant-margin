import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-mono-100 dark:text-white">
      <PublicHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-mono-500 hover:text-mono-100 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="text-3xl font-bold mb-2">Mentions Légales</h1>
        <p className="text-mono-500 mb-10">Dernière mise à jour : 30 août 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Préambule</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (dite « LCEN »), il est porté à la connaissance des utilisateurs et visiteurs du site internet accessible à l'adresse https://restaumargin.com (ci-après dénommé « le Site ») les présentes mentions légales. La connexion et la navigation sur le Site par l'utilisateur impliquent l'acceptation intégrale et sans réserve des présentes mentions légales. Ces dernières sont accessibles sur le Site à la rubrique « Mentions légales » et peuvent être consultées à tout moment. Le Site est exploité dans le respect de la législation française. L'utilisation de ce Site est régie par les présentes conditions d'utilisation. En utilisant le Site, vous reconnaissez avoir pris connaissance de ces conditions et les avoir acceptées. Celles-ci pourront être modifiées ou complétées à tout moment, sans préavis, aussi les utilisateurs du Site sont-ils invités à les consulter de manière régulière.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              Les présentes mentions légales ont pour objet de définir les modalités de mise à disposition du Site et les conditions d'utilisation du Site par tout utilisateur. Elles constituent le contrat entre le Site et l'utilisateur. L'accès au Site par l'utilisateur signifie son acceptation des présentes mentions légales. En cas de non-acceptation des mentions légales stipulées dans le présent document, l'utilisateur se doit de renoncer à l'accès des services proposés par le Site. L'Éditeur se réserve le droit de modifier unilatéralement et à tout moment le contenu des présentes mentions légales, sans notification préalable aux utilisateurs. Les mentions légales modifiées entrent en vigueur dès leur publication sur le Site.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Définitions</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour l'application des présentes mentions légales, les termes ci-dessous auront la signification suivante :
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.1 « L'Éditeur »</span> désigne la personne physique exerçant en qualité d'entrepreneur individuel qui exploite le service RestauMargin, immatriculée au répertoire SIRENE sous le numéro SIREN [À COMPLÉTER] et dont l'adresse professionnelle est indiquée à l'article 2 des présentes. RestauMargin n'est pas une société : le service est exploité par un entrepreneur individuel, sans personnalité morale distincte. L'Éditeur est l'éditeur du Site et le responsable de la collecte et du traitement des données personnelles effectués dans le cadre de l'utilisation du Site et des services associés.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.2 « Le Site »</span> désigne le site internet accessible à l'adresse https://restaumargin.com ainsi que l'ensemble de ses sous-domaines, pages, fonctionnalités, applications mobiles associées et services en ligne proposés par l'Éditeur. Le Site inclut l'ensemble des contenus, outils, fonctionnalités et services mis à disposition des utilisateurs, qu'ils soient accessibles gratuitement ou dans le cadre d'un abonnement payant.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.3 « L'Utilisateur »</span> désigne toute personne physique ou morale qui accède au Site, navigue sur le Site, utilise les services proposés par le Site, que ce soit à titre gratuit ou payant, à titre professionnel ou personnel. Le terme « Utilisateur » englobe tant les visiteurs non inscrits que les utilisateurs ayant créé un compte personnel sur le Site.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.4 « Les Services »</span> désigne l'ensemble des services et fonctionnalités proposés par l'Éditeur via le Site, incluant sans s'y limiter la plateforme SaaS de gestion de marge pour la restauration, les outils de calcul de coûts, de suivi des marges, de gestion des ingrédients, des recettes, des fournisseurs, de l'inventaire, les outils d'intelligence artificielle, les outils de menu engineering, la mercuriale des prix, le scanner de factures, ainsi que tout autre service qui pourrait être proposé ultérieurement par l'Éditeur.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.5 « Le Contenu »</span> désigne l'ensemble des éléments présents sur le Site, incluant sans s'y limiter les textes, images, photographies, illustrations, graphiques, logos, marques, dénominations sociales, noms de domaine, logiciels, bases de données, design, architecture, code source, code objet, algorithmes, interfaces, fonctionnalités, sons, vidéos, animations, et plus généralement toute information de quelque nature que ce soit et sous quelque forme que ce soit, accessible sur le Site ou par le biais du Site.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.6 « Les Données Personnelles »</span> désignent toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement, au sens du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données (ci-après « le RGPD »).
            </p>
          </section>

          {/* Article 2 - Editeur du site */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Éditeur du Site</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.1</span> Le Site est édité par une personne physique exerçant en qualité d'entrepreneur individuel (ci-après « l'Éditeur »), immatriculée au répertoire SIRENE tenu par l'INSEE. Le Site n'est édité par aucune société : il n'existe ni dénomination sociale, ni capital social, ni immatriculation au Registre du Commerce et des Sociétés au titre de l'exploitation du Site.
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Nom et prénom de l'éditeur :</span> [À COMPLÉTER]</p>
              <p><span className="text-mono-500">Statut juridique :</span> Entrepreneur individuel (régime de l'entreprise individuelle)</p>
              <p><span className="text-mono-500">Adresse professionnelle :</span> [À COMPLÉTER]</p>
              <p><span className="text-mono-500">Numéro SIREN :</span> [À COMPLÉTER]</p>
              <p><span className="text-mono-500">Email :</span> contact@restaumargin.fr</p>
              <p><span className="text-mono-500">Site web :</span> https://restaumargin.com</p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.2</span> L'Éditeur est soumis à la législation française en vigueur, notamment à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, au Code de commerce, au Code civil et au Code de la consommation. L'Éditeur exerce son activité principale dans le domaine de l'édition de logiciels applicatifs et de la fourniture de services en mode SaaS (Software as a Service) destinés aux professionnels de la restauration, de l'hôtellerie et des métiers de bouche en général.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.3</span> L'Éditeur peut être contacté par courrier électronique à l'adresse contact@restaumargin.fr pour toute question, réclamation, demande d'information ou exercice de droits relatifs aux présentes mentions légales, aux conditions générales d'utilisation, aux conditions générales de vente, à la politique de confidentialité ou à tout autre aspect de l'utilisation du Site et des Services. L'Éditeur s'engage à répondre dans un délai raisonnable à toute demande formulée par les utilisateurs par ce biais.
            </p>
          </section>

          {/* Article 3 - Directeur de la publication */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Directeur de la publication</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.1</span> Le directeur de la publication du Site est l'Éditeur lui-même, en sa qualité d'entrepreneur individuel exploitant le service RestauMargin : <span className="font-medium text-mono-100 dark:text-white">[À COMPLÉTER]</span>. Conformément aux dispositions de l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, le directeur de la publication est la personne qui détermine les contenus et les services mis en ligne sur le Site, et qui assume la responsabilité éditoriale de l'ensemble des contenus publiés sur le Site.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.2</span> Le directeur de la publication peut être contacté à l'adresse électronique suivante : contact@restaumargin.fr. Toute notification, mise en demeure ou correspondance officielle relative au contenu éditorial du Site doit être adressée au directeur de la publication à l'adresse professionnelle de l'Éditeur mentionnée à l'article 2 ou par voie électronique à l'adresse précitée.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.3</span> Le directeur de la publication veille à ce que les contenus publiés sur le Site respectent les dispositions légales et réglementaires applicables, et notamment les dispositions relatives à la propriété intellectuelle, au droit à l'image, au respect de la vie privée, à l'ordre public et aux bonnes moeurs. En cas de signalement de contenu illicite, le directeur de la publication s'engage à prendre les mesures nécessaires dans les meilleurs délais pour retirer ou rendre inaccessible le contenu en question, conformément aux dispositions de la LCEN.
            </p>
          </section>

          {/* Article 4 - Hebergement */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Hébergement</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.1</span> Conformément à l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, l'hébergeur du Site est identifié comme suit :
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="text-mono-500">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><span className="text-mono-500">Site web :</span> https://vercel.com</p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.2</span> Vercel Inc. est une société de droit américain. L'hébergement du Site n'est donc pas assuré par un prestataire établi dans l'Union européenne, et les serveurs mobilisés peuvent être situés en dehors du territoire de l'Union européenne. L'Éditeur porte cette information à la connaissance des utilisateurs afin qu'ils disposent d'une information exacte sur la localisation de l'hébergement du Site.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.3</span> L'Éditeur est lié à son hébergeur par les conditions contractuelles de ce dernier, lesquelles incluent un accord de traitement des données au sens de l'article 28 du RGPD. Cet accord porte notamment sur les obligations de l'hébergeur en matière de protection des données personnelles, sur les mesures techniques et organisationnelles de sécurité, sur les conditions de recours à d'éventuels sous-traitants ultérieurs, sur les modalités d'assistance de l'Éditeur pour répondre aux demandes d'exercice de droits des personnes concernées, ainsi que sur les conditions de restitution et de suppression des données à l'issue du contrat.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.4</span> Les transferts de données à caractère personnel vers les États-Unis résultant de cet hébergement sont encadrés par les garanties appropriées prévues aux articles 44 à 49 du RGPD, et notamment par les clauses contractuelles types adoptées par la Commission européenne. L'utilisateur est informé que ces transferts impliquent un traitement de ses données en dehors de l'Union européenne. Pour le détail des traitements, des sous-traitants et des durées de conservation, l'utilisateur est invité à consulter la Politique de confidentialité.
            </p>
          </section>

          {/* Article 5 - CNIL et donnees personnelles */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Protection des données personnelles et CNIL</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.1</span> Conformément aux dispositions du Règlement (UE) 2016/679 du 27 avril 2016 (Règlement Général sur la Protection des Données ou « RGPD »), de la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés (dite « Loi Informatique et Libertés »), et de toute autre réglementation applicable en matière de protection des données à caractère personnel, l'Éditeur s'engage à respecter les droits fondamentaux des personnes dont il traite les données personnelles.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.2</span> Les traitements de données à caractère personnel mis en oeuvre par l'Éditeur dans le cadre de l'exploitation du Site et de la fourniture des Services ne font pas l'objet d'une déclaration préalable auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) : depuis l'entrée en application du RGPD le 25 mai 2018, les formalités déclaratives préalables ont été supprimées et remplacées par une logique de responsabilisation du responsable de traitement. À ce titre, l'Éditeur tient un registre des activités de traitement conformément à l'article 30 du RGPD, lequel recense l'ensemble des traitements de données personnelles effectués sous sa responsabilité, les catégories de données traitées, les finalités des traitements, les destinataires des données, les durées de conservation applicables et les mesures de sécurité mises en oeuvre.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.3</span> L'utilisateur dispose d'un ensemble de droits sur ses données personnelles, conformément aux articles 15 à 22 du RGPD. Ces droits incluent le droit d'accès, le droit de rectification, le droit à l'effacement (droit à l'oubli), le droit à la limitation du traitement, le droit à la portabilité des données, le droit d'opposition, ainsi que le droit de ne pas faire l'objet d'une décision individuelle automatisée, y compris le profilage. L'utilisateur peut exercer ces droits en adressant un courrier électronique à l'adresse contact@restaumargin.fr, accompagné d'une copie d'un justificatif d'identité. L'Éditeur s'engage à répondre à toute demande dans un délai maximum de trente (30) jours à compter de la réception de la demande complète.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.4</span> En cas de difficulté en lien avec la gestion de ses données personnelles, l'utilisateur peut introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés), autorité de contrôle française compétente en matière de protection des données personnelles, dont le siège est situé au 3, place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, ou via son site internet www.cnil.fr.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              Pour plus d'informations sur la collecte, le traitement, la conservation et la protection de vos données personnelles, veuillez consulter notre{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialité
              </a>, qui fait partie intégrante des présentes mentions légales.
            </p>
          </section>

          {/* Article 6 - Cookies */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Cookies et technologies de traçage</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.1</span> Le Site utilise des cookies et des technologies de traçage similaires (tels que les pixels invisibles, les balises web, les identifiants de session, le stockage local et les empreintes numériques) pour assurer le bon fonctionnement du Site, améliorer l'expérience utilisateur, personnaliser les contenus et les services proposés, mesurer l'audience du Site et analyser les comportements de navigation des utilisateurs. L'utilisation de ces technologies est soumise aux dispositions de l'article 82 de la loi n° 78-17 du 6 janvier 1978 modifiée et aux lignes directrices et recommandations de la CNIL en matière de cookies et autres traceurs.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.2</span> Les cookies essentiels (ou cookies strictement nécessaires) sont ceux qui sont indispensables au fonctionnement du Site et à la fourniture des Services demandés par l'utilisateur. Ils permettent notamment la gestion de l'authentification, la conservation des préférences de session, la sécurisation de la navigation et le bon fonctionnement des fonctionnalités de base du Site. Ces cookies ne nécessitent pas le consentement préalable de l'utilisateur conformément à l'article 82 de la Loi Informatique et Libertés.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.3</span> Les cookies analytiques et de mesure d'audience permettent de recueillir des informations sur l'utilisation du Site par les visiteurs, telles que le nombre de visiteurs, les pages consultées, la durée des visites, le taux de rebond et les sources de trafic. Ces informations sont utilisées de manière agrégée et anonymisée pour améliorer les performances et le contenu du Site. Le dépôt de ces cookies est soumis au consentement préalable de l'utilisateur, recueilli via le bandeau de cookies affiché lors de la première visite sur le Site.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.4</span> L'utilisateur peut à tout moment modifier ses préférences en matière de cookies, accepter ou refuser tout ou partie des cookies non essentiels, via les paramètres de son navigateur internet ou via le mécanisme de gestion des préférences de cookies mis à disposition sur le Site. La suppression ou le refus des cookies essentiels peut entraîner des perturbations dans le fonctionnement du Site et limiter l'accès à certaines fonctionnalités. La durée de validité des cookies déposés sur le terminal de l'utilisateur n'excède pas treize (13) mois conformément aux recommandations de la CNIL.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              Pour plus d'informations sur la gestion des cookies et des technologies de traçage, veuillez consulter notre{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialité
              </a>.
            </p>
          </section>

          {/* Article 7 - Propriete intellectuelle */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Propriété intellectuelle</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.1</span> L'ensemble des éléments composant le Site et les Services, incluant sans s'y limiter les textes, images, photographies, illustrations, graphiques, logos, marques, dénominations sociales, noms de domaine, logiciels, programmes informatiques, codes sources, codes objets, algorithmes, bases de données, charte graphique, design, architecture, interfaces, fonctionnalités, sons, vidéos, animations, et plus généralement tout élément protégeable par le droit de la propriété intellectuelle, sont la propriété exclusive de l'Éditeur ou de ses concédants de licence, et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle, et notamment par le Code de la propriété intellectuelle, le droit d'auteur, le droit des marques, le droit des dessins et modèles, le droit des brevets et le droit sui generis des bases de données.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.2</span> Toute reproduction, représentation, modification, publication, distribution, retransmission, adaptation, traduction, décompilation, désassemblage, reverse engineering, extraction, ou exploitation de tout ou partie des éléments du Site ou des Services, par quelque moyen, procédé ou support que ce soit (notamment par téléchargement, copie, capture d'écran, scraping, extraction automatisée de données, création de liens hypertextes profonds, framing ou toute autre méthode), est strictement interdite sans l'autorisation écrite préalable et expresse de l'Éditeur. Toute exploitation non autorisée du Site, des Services ou de l'un quelconque des éléments qu'ils contiennent est constitutive de contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle et est passible de sanctions pénales et civiles.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.3</span> Les marques, logos, signes distinctifs et dénominations figurant sur le Site sont la propriété exclusive de l'Éditeur ou de ses partenaires. Toute utilisation, reproduction ou représentation, intégrale ou partielle, de ces marques, logos ou signes distinctifs, faite sans le consentement préalable et écrit de leur titulaire, est prohibée au sens de l'article L.713-2 du Code de la propriété intellectuelle et constitue un acte de contrefaçon de marque engage ant la responsabilité civile et pénale de son auteur.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.4</span> L'Éditeur concède à l'utilisateur inscrit un droit d'utilisation personnel, non exclusif, non cessible, non transférable et révocable du Site et des Services, pour la seule durée de son inscription et dans les limites des présentes mentions légales, des conditions générales d'utilisation et des conditions générales de vente. Ce droit d'utilisation ne confère aucun droit de propriété intellectuelle à l'utilisateur sur les éléments du Site ou des Services. L'utilisateur conserve néanmoins la pleine propriété des données qu'il saisit sur le Site dans le cadre de l'utilisation des Services (ingrédients, recettes, fiches techniques, menus, inventaires, commandes, données comptables, etc.).
            </p>
          </section>

          {/* Article 8 - Limitation de responsabilite */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Limitation de responsabilité</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.1</span> L'Éditeur s'efforce de fournir sur le Site des informations aussi précises, complètes et à jour que possible. Toutefois, l'Éditeur ne saurait garantir l'exactitude, l'exhaustivité, la pertinence ou l'actualité des informations mises à disposition sur le Site. Les informations présentes sur le Site sont fournies à titre indicatif et général et ne sauraient constituer un conseil juridique, fiscal, comptable, financier ou professionnel. En conséquence, l'utilisation des informations et contenus disponibles sur le Site se fait sous la pleine et entière responsabilité de l'utilisateur, à ses propres risques et périls, et il lui appartient de vérifier auprès de professionnels qualifiés l'ensemble des informations et données nécessaires à ses prises de décision.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.2</span> L'Éditeur ne pourra en aucun cas être tenu responsable de tout dommage de quelque nature que ce soit, direct ou indirect, matériel ou immatériel, prévisible ou imprévisible, résultant de l'accès au Site, de l'utilisation ou de l'impossibilité d'utilisation du Site ou des Services, de la fiabilité des informations présentes sur le Site, ou de tout événement en relation avec le Site et/ou les Services. Cette exclusion de responsabilité s'applique notamment, sans s'y limiter, aux cas de perte de données, de perte de chiffre d'affaires, de perte de clientèle, de perte d'exploitation, de manque à gagner, d'atteinte à la réputation, de préjudice commercial, ou de tout autre dommage conséquent ou accessoire.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.3</span> L'Éditeur ne pourra être tenu responsable en cas de force majeure ou d'événements imprévisibles et insurmontables au sens de l'article 1218 du Code civil, incluant sans s'y limiter les catastrophes naturelles, les pandémies, les épidémies, les actes de terrorisme, les guerres, les insurrections, les émeutes, les grèves, les pannes de réseau, les pannes électriques, les défaillances de fournisseurs de services tiers, les cyberattaques, les actes de piraterie informatique, les virus informatiques, les interruptions de services de télécommunications, les décisions gouvernementales ou administratives, ou tout autre événement échappant au contrôle raisonnable de l'Éditeur.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.4</span> L'Éditeur met en oeuvre tous les moyens raisonnables à sa disposition pour assurer un accès continu et de qualité au Site. Néanmoins, le Site pouvant être interrompu à tout moment pour des raisons de maintenance, de mise à jour, de correction de bugs, d'amélioration des fonctionnalités, ou pour toute autre raison technique, l'Éditeur ne saurait être tenu à une obligation de résultat quant à la disponibilité permanente du Site et des Services. L'Éditeur s'efforcera de notifier les utilisateurs en cas de maintenance programmée susceptible d'entraîner une interruption significative du service.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.5</span> Le Site peut contenir des liens hypertextes vers d'autres sites internet exploités par des tiers. Ces liens sont fournis à titre informatif uniquement. L'Éditeur n'exerce aucun contrôle sur le contenu de ces sites tiers et n'assume aucune responsabilité quant à leur contenu, leurs pratiques en matière de protection des données personnelles, ou tout autre aspect de leur fonctionnement. L'insertion de ces liens ne signifie en aucun cas une approbation, une validation ou un partenariat avec les sites en question. L'utilisateur accède à ces sites tiers sous sa propre responsabilité.
            </p>
          </section>

          {/* Article 9 - Acces au site */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Conditions d'accès au Site</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.1</span> L'accès au Site est ouvert à tout utilisateur disposant d'un accès à internet. Les frais relatifs à l'accès au Site (matériel informatique, logiciels, connexion internet, etc.) sont à la charge exclusive de l'utilisateur. L'Éditeur ne saurait être tenu responsable de tout dysfonctionnement, incompatibilité ou difficulté d'accès lié à l'équipement informatique ou à la connexion internet de l'utilisateur.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.2</span> L'Éditeur se réserve le droit de refuser l'accès au Site, unilatéralement et sans notification préalable, à tout utilisateur ne respectant pas les présentes mentions légales, les conditions générales d'utilisation ou les conditions générales de vente. L'Éditeur se réserve également le droit de suspendre ou de supprimer l'accès au Site ou à certaines de ses fonctionnalités, temporairement ou définitivement, pour des raisons de maintenance, de mise à jour, de sécurité, ou pour toute autre raison jugée nécessaire par l'Éditeur, sans que cette interruption ne puisse donner lieu à une quelconque indemnisation au profit de l'utilisateur.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.3</span> L'utilisateur s'engage à utiliser le Site de manière conforme à sa destination, dans le respect des présentes mentions légales, des conditions générales d'utilisation, de la législation française et européenne applicable, ainsi que des droits des tiers. L'utilisateur s'interdit notamment de procéder à toute activité susceptible de porter atteinte au bon fonctionnement du Site, à sa sécurité, à son intégrité, ou aux droits et intérêts de l'Éditeur et des autres utilisateurs.
            </p>
          </section>

          {/* Article 10 - Droit applicable */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Droit applicable et juridiction compétente</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.1</span> Les présentes mentions légales sont régies, interprétées et appliquées conformément au droit français, à l'exclusion de toute autre législation. La langue de référence des présentes mentions légales est la langue française. En cas de traduction des présentes mentions légales dans une ou plusieurs autres langues, seule la version française fait foi en cas de divergence d'interprétation.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.2</span> En cas de litige relatif à l'interprétation, la validité, l'exécution ou l'inexécution des présentes mentions légales, et après tentative préalable de résolution amiable dans un délai de trente (30) jours à compter de la notification du différend par l'une des parties à l'autre par courrier recommandé avec accusé de réception ou par courrier électronique avec accusé de réception, la juridiction compétente sera déterminée conformément aux règles du droit commun français, et notamment aux articles 42 et suivants du Code de procédure civile. Lorsque l'utilisateur a la qualité de consommateur, il conserve la faculté de saisir, à son choix, la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la survenance du fait dommageable, conformément à l'article R.631-3 du Code de la consommation.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.3</span> L'utilisateur est informé qu'il peut, préalablement à toute action judiciaire, avoir recours à une procédure de médiation de la consommation conformément aux articles L.611-1 et suivants du Code de la consommation, ou à tout autre mode alternatif de résolution des différends. La plateforme européenne de résolution des litiges en ligne de la Commission européenne est accessible à l'adresse suivante : https://ec.europa.eu/consumers/odr. L'Éditeur se réserve néanmoins le droit de saisir directement les juridictions compétentes s'il l'estime nécessaire pour la défense de ses droits et intérêts.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.4</span> Si l'une des clauses des présentes mentions légales venait à être déclarée nulle, invalide ou inapplicable par une juridiction compétente, cette nullité, invalidité ou inapplicabilité n'affecterait pas la validité et l'applicabilité des autres clauses, qui conserveront leur plein effet. La clause déclarée nulle, invalide ou inapplicable sera remplacée par une clause valide, licite et applicable aussi proche que possible de l'intention originelle des parties.
            </p>
          </section>

          {/* Article 11 - Contact */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Contact</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour toute question, demande d'information, réclamation, signalement de contenu illicite, ou exercice de vos droits relatifs aux présentes mentions légales, à la protection de vos données personnelles ou à tout autre aspect de l'utilisation du Site et des Services, vous pouvez contacter l'Éditeur aux coordonnées suivantes :
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Éditeur :</span> [À COMPLÉTER] — entrepreneur individuel</p>
              <p><span className="text-mono-500">Adresse professionnelle :</span> [À COMPLÉTER]</p>
              <p><span className="text-mono-500">Numéro SIREN :</span> [À COMPLÉTER]</p>
              <p><span className="text-mono-500">Email :</span> <span className="text-teal-400">contact@restaumargin.fr</span></p>
              <p><span className="text-mono-500">Site web :</span> https://restaumargin.com</p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              L'Éditeur s'engage à accuser réception de votre demande dans un délai de quarante-huit (48) heures ouvrables et à y apporter une réponse circonstanciée dans un délai maximum de trente (30) jours à compter de la réception de la demande complète. Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004, l'Éditeur met à disposition des utilisateurs un dispositif permettant de signaler tout contenu illicite ou portant atteinte aux droits des tiers. Les signalements peuvent être adressés par courrier électronique à l'adresse contact@restaumargin.fr.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-mono-900 dark:border-mono-200 flex flex-wrap gap-6 text-sm text-mono-500">
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions générales de vente</a>
          <a href="/cgu" className="hover:text-teal-400 transition-colors">Conditions générales d'utilisation</a>
          <a href="/politique-confidentialite" className="hover:text-teal-400 transition-colors">Politique de confidentialité</a>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
