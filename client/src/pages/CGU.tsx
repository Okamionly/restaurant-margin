import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

export default function CGU() {
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

        <h1 className="text-3xl font-bold mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-mono-500 mb-10">Dernière mise à jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Préambule</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Les présentes Conditions Générales d'Utilisation (ci-après « les CGU ») ont pour objet de définir les modalités et conditions d'accès et d'utilisation de la plateforme RestauMargin, éditée par RestauMargin SAS (ci-après « la Société »), société par actions simplifiée de droit français dont le siège social est situé à Marseille, France. La plateforme est accessible à l'adresse https://restaumargin.com (ci-après « la Plateforme » ou « le Site »). Les présentes CGU constituent un contrat juridiquement contraignant entre la Société et toute personne physique ou morale accédant à la Plateforme et utilisant les services proposés (ci-après « l'Utilisateur »).
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              L'accès à la Plateforme et l'utilisation des services proposés par la Société sont conditionnés à l'acceptation préalable, pleine et entière des présentes CGU par l'Utilisateur. L'Utilisateur reconnaît avoir lu, compris et accepté sans réserve l'intégralité des présentes CGU, qui prévalent sur tout autre document. La Société se réserve le droit de modifier les présentes CGU à tout moment, les modifications entrant en vigueur dès leur publication sur la Plateforme. L'Utilisateur sera informé de toute modification substantielle par courrier électronique et/ou par notification sur la Plateforme. La poursuite de l'utilisation de la Plateforme après notification des modifications vaut acceptation des nouvelles CGU.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Définitions</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour l'interprétation et l'application des présentes Conditions Générales d'Utilisation, les termes définis ci-dessous auront la signification suivante, qu'ils soient employés au singulier ou au pluriel, avec ou sans majuscule initiale :
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.1 « La Société »</span> désigne RestauMargin SAS, société par actions simplifiée de droit français, éditrice et exploitante de la Plateforme, dont le siège social est situé à Marseille, France.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.2 « La Plateforme »</span> désigne le site internet accessible à l'adresse https://restaumargin.com, ainsi que l'ensemble de ses sous-domaines, pages, fonctionnalités, applications mobiles associées et services en ligne proposés par la Société. La Plateforme constitue un outil de gestion de marge en mode SaaS (Software as a Service) destiné aux professionnels de la restauration, de l'hôtellerie et des métiers de bouche, permettant notamment le calcul des coûts, le suivi des marges, la gestion des ingrédients, des recettes, des fournisseurs, de l'inventaire, des commandes, de la comptabilité, ainsi que l'accès à des outils d'intelligence artificielle, de menu engineering, de mercuriale des prix, de scan de factures et de conformité HACCP.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.3 « L'Utilisateur »</span> désigne toute personne physique ou morale qui accède à la Plateforme, navigue sur le Site, crée un compte, souscrit à un abonnement ou utilise les services proposés par la Société, que ce soit à titre gratuit ou payant, à titre professionnel ou personnel. Le terme « Utilisateur » englobe tant les visiteurs non inscrits que les utilisateurs disposant d'un compte personnel actif sur la Plateforme.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.4 « Le Compte »</span> désigne l'espace personnel créé par l'Utilisateur sur la Plateforme, protégé par des identifiants de connexion (adresse électronique et mot de passe), donnant accès aux services et fonctionnalités de la Plateforme. Le Compte contient les informations personnelles et professionnelles de l'Utilisateur, ses paramètres de configuration, ainsi que l'ensemble des données qu'il saisit dans le cadre de l'utilisation des services.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.5 « Les Services »</span> désigne l'ensemble des services et fonctionnalités proposés par la Société via la Plateforme, incluant sans s'y limiter la gestion des ingrédients, les fiches techniques, les menus, les inventaires, les commandes, la comptabilité, les outils d'intelligence artificielle, le menu engineering, la mercuriale des prix, le scanner de factures, le suivi HACCP, la traçabilité, ainsi que tout autre service qui pourrait être proposé ultérieurement par la Société.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.6 « Les Données de l'Utilisateur »</span> désigne l'ensemble des informations, données, contenus, fichiers et documents saisis, importés, téléchargés ou générés par l'Utilisateur dans le cadre de l'utilisation de la Plateforme et des Services, incluant sans s'y limiter les ingrédients, les recettes, les fiches techniques, les menus, les inventaires, les commandes, les données comptables, les données de pesées, les factures scannées et les données relatives aux fournisseurs.
            </p>
          </section>

          {/* Article 2 - Objet */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Objet</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.1</span> Les présentes CGU ont pour objet de définir les conditions d'accès et d'utilisation de la Plateforme et des Services proposés par la Société. Elles régissent les droits et obligations respectifs de la Société et de l'Utilisateur dans le cadre de l'utilisation de la Plateforme. Les présentes CGU sont complétées par les Conditions Générales de Vente (CGV), les Mentions légales et la Politique de confidentialité, qui forment ensemble le cadre contractuel global régissant la relation entre la Société et l'Utilisateur.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.2</span> RestauMargin est une plateforme SaaS (Software as a Service) de gestion de marge conçue pour les professionnels de la restauration, de l'hôtellerie et des métiers de bouche. La Plateforme propose un ensemble complet d'outils permettant aux professionnels de la restauration d'optimiser la gestion de leurs coûts, de leurs marges, de leurs ingrédients, de leurs recettes, de leurs menus, de leurs inventaires, de leurs commandes et de leur comptabilité. La Plateforme intègre également des outils d'intelligence artificielle pour l'optimisation des coûts, des menus et des approvisionnements, ainsi que des fonctionnalités avancées de menu engineering, de mercuriale des prix, de scan de factures par OCR, de conformité HACCP et de traçabilité.
            </p>
          </section>

          {/* Article 3 - Inscription et compte */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Inscription et gestion du Compte</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.1</span> L'accès à l'ensemble des fonctionnalités de la Plateforme nécessite la création préalable d'un Compte utilisateur. L'Utilisateur doit fournir des informations exactes, complètes et à jour lors de son inscription, incluant notamment son nom, son prénom, son adresse électronique, un mot de passe sécurisé, le nom de son établissement et toute autre information requise par le formulaire d'inscription. L'Utilisateur s'engage à mettre à jour ses informations sans délai en cas de modification.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.2</span> L'Utilisateur est seul responsable de la confidentialité et de la sécurité de ses identifiants de connexion (adresse électronique et mot de passe). Il s'engage à ne pas communiquer ses identifiants à des tiers et à prendre toutes les mesures nécessaires pour empêcher toute utilisation non autorisée de son Compte. Toute activité réalisée à partir du Compte de l'Utilisateur, qu'elle soit ou non effectuée par l'Utilisateur lui-même, est présumée avoir été effectuée sous sa responsabilité. En cas de perte, de vol ou de compromission de ses identifiants, l'Utilisateur doit en informer immédiatement la Société par courrier électronique à l'adresse contact@restaumargin.fr et procéder au changement de son mot de passe sans délai.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.3</span> La Société se réserve le droit de vérifier l'identité et la qualité de l'Utilisateur, de refuser toute inscription qui ne respecterait pas les conditions prévues aux présentes CGU, ou de suspendre ou supprimer tout Compte qui aurait été créé sur la base d'informations fausses, incomplètes ou trompeuses. La création de comptes multiples par un même Utilisateur sans autorisation préalable de la Société est interdite.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.4</span> Lors de la création de son Compte, l'Utilisateur choisit un mot de passe conforme aux exigences de sécurité définies par la Société. Le mot de passe doit comporter un nombre minimal de caractères et combiner différents types de caractères (lettres majuscules et minuscules, chiffres, caractères spéciaux) afin de garantir un niveau de sécurité adéquat. La Société met en oeuvre des mesures de hachage sécurisé des mots de passe et ne stocke jamais les mots de passe en clair.
            </p>
          </section>

          {/* Article 4 - Services */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Description des Services</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.1</span> La Plateforme propose les fonctionnalités suivantes, sous réserve de l'abonnement souscrit par l'Utilisateur :
            </p>
            <ul className="list-disc list-inside text-mono-350 dark:text-mono-800 space-y-2 ml-2">
              <li>Calcul de marge en temps réel sur les recettes et fiches techniques, permettant au professionnel de la restauration de connaître avec précision le coût de revient, la marge brute et le ratio de food cost de chacune de ses préparations</li>
              <li>Gestion complète des ingrédients, avec suivi des prix fournisseurs, des unités de mesure, des rendements, des allergènes et des informations nutritionnelles</li>
              <li>Création et gestion des fiches techniques (recettes) avec calcul automatique des coûts, des portions et des valeurs nutritionnelles</li>
              <li>Gestion des fournisseurs et mercuriale des prix avec historique de l'évolution des cours des matières premières</li>
              <li>Gestion des inventaires et suivi des stocks en temps réel, avec alertes de seuils de réapprovisionnement</li>
              <li>Gestion des commandes fournisseurs avec génération automatique de bons de commande</li>
              <li>Outils de comptabilité et de reporting financier adaptés aux besoins de la restauration</li>
              <li>Assistant d'intelligence artificielle pour l'optimisation des coûts, des menus et des approvisionnements</li>
              <li>Scan de factures par technologie OCR (reconnaissance optique de caractères) permettant l'importation automatique des données de facturation</li>
              <li>Menu Engineering et analyse de rentabilité des plats et des menus selon la méthode BCG (Boston Consulting Group)</li>
              <li>Conformité HACCP et outils de traçabilité alimentaire pour le respect des normes d'hygiène et de sécurité alimentaire</li>
              <li>Commande vocale et dictée en langage naturel pour la saisie rapide de données</li>
            </ul>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.2</span> La Société se réserve le droit de modifier, d'ajouter ou de supprimer des fonctionnalités de la Plateforme à tout moment, dans le cadre de l'amélioration continue des Services. Les modifications substantielles seront notifiées aux Utilisateurs par courrier électronique ou par notification sur la Plateforme. La Société s'efforce de maintenir les Services disponibles en permanence, mais ne garantit pas une disponibilité ininterrompue de la Plateforme, notamment en raison des opérations de maintenance, de mise à jour ou de cas de force majeure.
            </p>
          </section>

          {/* Article 5 - Obligations de l'Utilisateur */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Obligations de l'Utilisateur</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.1</span> L'Utilisateur s'engage à utiliser la Plateforme et les Services de manière conforme à leur destination, dans le respect des présentes CGU, de la législation française et européenne applicable, ainsi que des droits des tiers. L'Utilisateur s'engage notamment à :
            </p>
            <ul className="list-disc list-inside text-mono-350 dark:text-mono-800 space-y-2 ml-2">
              <li>Utiliser la Plateforme exclusivement dans le cadre de son activité professionnelle de restauration, d'hôtellerie ou de métiers de bouche, et conformément à la destination des Services</li>
              <li>Fournir des informations exactes, complètes et à jour lors de son inscription et tout au long de l'utilisation des Services, et mettre à jour ces informations sans délai en cas de changement</li>
              <li>Maintenir la stricte confidentialité de ses identifiants de connexion et ne pas les communiquer à des tiers non autorisés</li>
              <li>Ne pas tenter d'accéder de manière non autorisée aux systèmes, réseaux, serveurs ou bases de données de la Société ou de ses prestataires</li>
              <li>Ne pas effectuer de scraping, d'extraction automatisée, de data mining, de reverse engineering, de décompilation ou de désassemblage de tout ou partie de la Plateforme ou des Services</li>
              <li>Ne pas diffuser via la Plateforme de contenu illicite, diffamatoire, injurieux, obscène, pornographique, violent, discriminatoire, ou contraire à l'ordre public et aux bonnes moeurs</li>
              <li>Ne pas utiliser la Plateforme à des fins frauduleuses, illégales ou susceptibles de porter atteinte aux droits et intérêts de la Société ou des tiers</li>
              <li>Respecter les droits de propriété intellectuelle de la Société et des tiers</li>
              <li>Ne pas introduire de virus, logiciels malveillants, chevaux de Troie ou tout autre programme informatique de nature à porter atteinte au fonctionnement de la Plateforme ou des systèmes informatiques de la Société</li>
              <li>Ne pas surcharger intentionnellement les infrastructures de la Plateforme par des requêtes massives ou automatisées (attaques par déni de service ou DDoS)</li>
            </ul>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.2</span> En cas de manquement de l'Utilisateur à l'une quelconque des obligations prévues au présent article, la Société se réserve le droit de suspendre ou de supprimer le Compte de l'Utilisateur, de restreindre l'accès aux Services, de plein droit et sans préavis, sans que cette suspension ou suppression ne puisse donner lieu à une quelconque indemnisation au profit de l'Utilisateur. La Société se réserve également le droit d'engager toute action judiciaire qu'elle jugera nécessaire pour la défense de ses droits et intérêts, et de réclamer la réparation intégrale de tout préjudice subi.
            </p>
          </section>

          {/* Article 6 - Propriete intellectuelle */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Propriété intellectuelle</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.1</span> La Société détient l'ensemble des droits de propriété intellectuelle relatifs à la Plateforme, incluant sans s'y limiter le code source, le code objet, l'architecture logicielle, les algorithmes, les interfaces, le design, la charte graphique, les textes, les logos, les marques, les dénominations, les bases de données, les fonctionnalités et tout autre élément protégeable par le droit de la propriété intellectuelle français et international. Ces éléments sont protégés par le Code de la propriété intellectuelle, le droit d'auteur, le droit des marques, le droit des dessins et modèles, le droit des brevets et le droit sui generis des bases de données.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.2</span> L'Utilisateur conserve la pleine et entière propriété de ses Données, c'est-à-dire de l'ensemble des données, informations et contenus qu'il saisit, importe, télécharge ou génère sur la Plateforme dans le cadre de l'utilisation des Services (ingrédients, recettes, fiches techniques, menus, inventaires, commandes, données comptables, données de pesées, factures, informations relatives aux fournisseurs, etc.). La Société ne revendique aucun droit de propriété intellectuelle sur les Données de l'Utilisateur et s'engage à ne pas utiliser ces données à des fins autres que la fourniture des Services, sauf autorisation expresse de l'Utilisateur ou obligation légale.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.3</span> Toute reproduction, représentation, modification, publication, distribution, retransmission, adaptation, traduction, décompilation, désassemblage, reverse engineering ou exploitation de tout ou partie des éléments de la Plateforme, par quelque moyen, procédé ou support que ce soit, est strictement interdite sans l'autorisation écrite préalable et expresse de la Société. Toute exploitation non autorisée de la Plateforme ou de ses éléments constitue une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle, sanctionnée par les dispositions pénales applicables.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.4</span> L'Utilisateur concède à la Société une licence non exclusive, mondiale, gratuite et pour la durée de son inscription, l'autorisant à héberger, stocker, reproduire, adapter et afficher les Données de l'Utilisateur dans la seule mesure nécessaire à la fourniture des Services. Cette licence prend fin automatiquement à la date de suppression du Compte de l'Utilisateur, sous réserve des obligations légales de conservation des données applicables.
            </p>
          </section>

          {/* Article 7 - Donnees personnelles */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Données personnelles et vie privée</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.1</span> La Société collecte et traite des données personnelles dans le cadre de l'utilisation de la Plateforme et des Services, conformément au Règlement (UE) 2016/679 du 27 avril 2016 (Règlement Général sur la Protection des Données ou « RGPD »), à la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés, et à toute autre réglementation applicable en matière de protection des données à caractère personnel.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.2</span> Les catégories de données personnelles collectées, les finalités du traitement, les bases légales, les destinataires des données, les durées de conservation, les droits des personnes concernées et les modalités d'exercice de ces droits sont détaillés dans la{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialité
              </a>{' '}
              de la Société, accessible à tout moment sur le Site et constituant une partie intégrante des présentes CGU.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.3</span> L'Utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité des données et d'opposition au traitement de ses données personnelles, qu'il peut exercer en contactant la Société à l'adresse contact@restaumargin.fr. L'Utilisateur dispose également du droit de définir des directives relatives au sort de ses données personnelles après son décès, conformément à l'article 85 de la loi n° 78-17 du 6 janvier 1978 modifiée.
            </p>
          </section>

          {/* Article 8 - Responsabilite */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Limitation de responsabilité</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.1</span> La Société s'efforce d'assurer la disponibilité, la fiabilité et le bon fonctionnement de la Plateforme et des Services. Toutefois, les Services sont fournis « en l'état » et « selon disponibilité », sans garantie expresse ou implicite d'aucune sorte, incluant sans s'y limiter les garanties implicites de commercialisation, d'adéquation à un usage particulier et de non-contrefaçon. La Société ne garantit pas que la Plateforme sera exempte d'erreurs, de bugs ou de dysfonctionnements, ni que les défauts seront corrigés dans un délai déterminé.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.2</span> La Société ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utilisation de la Plateforme et des Services, notamment en cas de perte de données, d'interruption de service, de dysfonctionnement technique, d'intrusion informatique, de virus, de modification non autorisée du contenu ou de toute autre cause échappant au contrôle raisonnable de la Société. La Société ne saurait davantage être tenue responsable des décisions commerciales, financières, comptables ou de gestion prises par l'Utilisateur sur la base des informations et analyses fournies par la Plateforme.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.3</span> L'Utilisateur est seul responsable de l'exactitude, de l'exhaustivité et de la pertinence des données qu'il saisit sur la Plateforme. La Société ne saurait être tenue responsable des erreurs, inexactitudes ou lacunes dans les données saisies par l'Utilisateur, ni des conséquences qui pourraient en découler. Il appartient à l'Utilisateur de vérifier systématiquement les résultats et analyses produits par la Plateforme avant de prendre toute décision sur la base de ces informations.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.4</span> En tout état de cause, la responsabilité totale et cumulée de la Société au titre des présentes CGU, toutes causes confondues, ne pourra excéder le montant total des sommes effectivement versées par l'Utilisateur à la Société au cours des douze (12) derniers mois précédant l'événement donnant lieu à responsabilité. Cette limitation de responsabilité s'applique dans toute la mesure permise par la loi applicable.
            </p>
          </section>

          {/* Article 9 - Resiliation */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Résiliation et suppression de Compte</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.1</span> L'Utilisateur peut à tout moment demander la suppression de son Compte depuis les paramètres de son profil sur la Plateforme ou en adressant un courrier électronique à l'adresse contact@restaumargin.fr. La suppression du Compte entraîne la cessation de l'accès aux Services et la programmation de la suppression définitive de l'ensemble des Données de l'Utilisateur des serveurs de la Société dans un délai de trente (30) jours à compter de la date effective de suppression du Compte, sous réserve du respect des obligations légales de conservation applicables (obligations comptables, fiscales, légales ou réglementaires).
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.2</span> Préalablement à la suppression de son Compte, l'Utilisateur est invité à exporter l'ensemble de ses Données en utilisant les outils d'export mis à sa disposition sur la Plateforme. La Société ne saurait être tenue responsable de la perte de données résultant de la suppression du Compte par l'Utilisateur sans exportation préalable de ses Données.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.3</span> La Société se réserve le droit de suspendre ou de supprimer un Compte de plein droit, sans préavis et sans indemnité, en cas de : (a) violation par l'Utilisateur de l'une quelconque des obligations prévues aux présentes CGU ; (b) utilisation abusive, frauduleuse ou malveillante de la Plateforme ou des Services ; (c) non-paiement de l'abonnement après mise en demeure restée sans effet pendant quinze (15) jours ; (d) inactivité du Compte pendant une période de vingt-quatre (24) mois consécutifs ; (e) comportement de nature à porter atteinte à la sécurité, à l'intégrité ou au fonctionnement de la Plateforme, ou aux droits et intérêts de la Société ou des autres Utilisateurs. L'Utilisateur sera informé de la suspension ou de la suppression de son Compte par courrier électronique, sauf en cas d'urgence justifiant une action immédiate.
            </p>
          </section>

          {/* Article 10 - Modification des CGU */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Modification des CGU</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.1</span> La Société se réserve le droit de modifier, de compléter ou de mettre à jour les présentes CGU à tout moment, sans préavis, afin de les adapter aux évolutions de la Plateforme, des Services, de la réglementation applicable ou des pratiques du marché. Les modifications entrent en vigueur dès leur publication sur la Plateforme, à la date indiquée en tête du document.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.2</span> En cas de modification substantielle des présentes CGU, la Société en informera les Utilisateurs par courrier électronique à l'adresse associée à leur Compte et/ou par une notification affichée sur la Plateforme, au moins quinze (15) jours avant l'entrée en vigueur des nouvelles CGU. La poursuite de l'utilisation de la Plateforme et des Services après l'entrée en vigueur des modifications vaut acceptation pleine et entière des nouvelles CGU par l'Utilisateur. En cas de désaccord avec les nouvelles CGU, l'Utilisateur peut supprimer son Compte dans les conditions prévues à l'article 9 des présentes CGU.
            </p>
          </section>

          {/* Article 11 - Force majeure */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Force majeure</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">11.1</span> La Société ne saurait être tenue responsable de l'inexécution ou du retard dans l'exécution de ses obligations au titre des présentes CGU, lorsque cette inexécution ou ce retard résulte d'un cas de force majeure au sens de l'article 1218 du Code civil, c'est-à-dire d'un événement échappant au contrôle de la Société, qui ne pouvait être raisonnablement prévu lors de la conclusion du contrat et dont les effets ne peuvent être évités par des mesures appropriées.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">11.2</span> Sont expressément considérés comme des cas de force majeure, sans que cette énumération soit limitative : les catastrophes naturelles, les épidémies et pandémies, les actes de terrorisme, les conflits armés, les grèves générales, les pannes généralisées de réseaux de télécommunications ou d'électricité, les cyberattaques d'ampleur exceptionnelle, les incendies, les inondations, les décisions gouvernementales ou réglementaires imposant des restrictions d'activité, et tout autre événement présentant les caractéristiques de la force majeure telle que définie par la jurisprudence française.
            </p>
          </section>

          {/* Article 12 - Droit applicable */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 12 — Droit applicable et juridiction compétente</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.1</span> Les présentes CGU sont régies, interprétées et appliquées conformément au droit français, à l'exclusion de toute autre législation et de toute convention internationale. La langue de référence des présentes CGU est la langue française. En cas de traduction dans une ou plusieurs autres langues, seule la version française fait foi en cas de divergence d'interprétation.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.2</span> En cas de litige relatif à l'interprétation, la validité, l'exécution ou l'inexécution des présentes CGU, les parties s'engagent à rechercher une solution amiable préalablement à toute action judiciaire, dans un délai de trente (30) jours à compter de la notification du différend par l'une des parties à l'autre. L'Utilisateur consommateur ou non-professionnel est informé qu'il peut recourir à une procédure de médiation de la consommation conformément aux articles L.611-1 et suivants du Code de la consommation. La plateforme européenne de résolution des litiges en ligne est accessible à l'adresse : https://ec.europa.eu/consumers/odr.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.3</span> À défaut de résolution amiable dans le délai prévu, tout litige sera soumis à la compétence exclusive des tribunaux compétents de Marseille, France, et ce même en cas de pluralité de défendeurs, d'appel en garantie, de demande incidente ou reconventionnelle, ou de procédure d'urgence ou conservatoire. Cette clause d'attribution de compétence s'applique sous réserve des dispositions d'ordre public applicables au profit des consommateurs.
            </p>
          </section>

          {/* Article 13 - Dispositions generales */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 13 — Dispositions générales</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.1 Intégralité.</span> Les présentes CGU, ensemble avec les Conditions Générales de Vente, les Mentions légales et la Politique de confidentialité, constituent l'intégralité de l'accord entre la Société et l'Utilisateur concernant l'utilisation de la Plateforme et des Services, et remplacent tout accord, déclaration ou engagement antérieur relatif au même objet.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.2 Divisibilité.</span> Si l'une quelconque des clauses des présentes CGU est déclarée nulle, invalide ou inapplicable par une juridiction compétente, cette nullité, invalidité ou inapplicabilité n'affectera pas la validité des autres clauses, qui demeureront en plein effet. La clause concernée sera remplacée par une clause valide et applicable se rapprochant le plus possible de l'intention originelle des parties.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.3 Renonciation.</span> Le fait pour la Société de ne pas exercer ou de tarder à exercer un droit ou une prérogative découlant des présentes CGU ne constitue pas une renonciation à ce droit ou à cette prérogative, et n'empêche aucunement l'exercice ultérieur de ce droit ou de cette prérogative.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.4 Cession.</span> L'Utilisateur ne peut céder ou transférer ses droits et obligations au titre des présentes CGU à un tiers sans le consentement préalable et écrit de la Société. La Société peut librement céder ou transférer ses droits et obligations au titre des présentes CGU dans le cadre d'une restructuration, d'une fusion, d'une acquisition, d'une cession d'actifs ou par l'effet de la loi.
            </p>
          </section>

          {/* Article 14 - Contact */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 14 — Contact</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour toute question, demande d'information, réclamation ou signalement relatif aux présentes Conditions Générales d'Utilisation, à la Plateforme ou aux Services, l'Utilisateur peut contacter la Société aux coordonnées suivantes :
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Raison sociale :</span> RestauMargin SAS</p>
              <p><span className="text-mono-500">Siège social :</span> Marseille, France</p>
              <p><span className="text-mono-500">Email :</span>{' '}
                <a href="mailto:contact@restaumargin.fr" className="text-teal-400 hover:text-teal-300 underline">
                  contact@restaumargin.fr
                </a>
              </p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              La Société s'engage à accuser réception de toute demande dans un délai de quarante-huit (48) heures ouvrables et à y apporter une réponse dans un délai raisonnable, n'excédant pas trente (30) jours ouvrables à compter de la réception de la demande complète.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-mono-900 dark:border-mono-200 flex flex-wrap gap-6 text-sm text-mono-500">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions légales</a>
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions générales de vente</a>
          <a href="/politique-confidentialite" className="hover:text-teal-400 transition-colors">Politique de confidentialité</a>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
