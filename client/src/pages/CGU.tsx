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
        <p className="text-slate-400 mb-10">Derniere mise a jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Preambule</h2>
            <p className="text-slate-300">
              Les presentes Conditions Generales d'Utilisation (ci-apres « les CGU ») ont pour objet de definir les modalites et conditions d'acces et d'utilisation de la plateforme RestauMargin, editee par RestauMargin SAS (ci-apres « la Societe »), societe par actions simplifiee de droit francais dont le siege social est situe a Marseille, France. La plateforme est accessible a l'adresse https://restaumargin.com (ci-apres « la Plateforme » ou « le Site »). Les presentes CGU constituent un contrat juridiquement contraignant entre la Societe et toute personne physique ou morale accedant a la Plateforme et utilisant les services proposes (ci-apres « l'Utilisateur »).
            </p>
            <p className="text-slate-300">
              L'acces a la Plateforme et l'utilisation des services proposes par la Societe sont conditionnes a l'acceptation prealable, pleine et entiere des presentes CGU par l'Utilisateur. L'Utilisateur reconnait avoir lu, compris et accepte sans reserve l'integralite des presentes CGU, qui prevalent sur tout autre document. La Societe se reserve le droit de modifier les presentes CGU a tout moment, les modifications entrant en vigueur des leur publication sur la Plateforme. L'Utilisateur sera informe de toute modification substantielle par courrier electronique et/ou par notification sur la Plateforme. La poursuite de l'utilisation de la Plateforme apres notification des modifications vaut acceptation des nouvelles CGU.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Definitions</h2>
            <p className="text-slate-300">
              Pour l'interpretation et l'application des presentes Conditions Generales d'Utilisation, les termes definis ci-dessous auront la signification suivante, qu'ils soient employes au singulier ou au pluriel, avec ou sans majuscule initiale :
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.1 « La Societe »</span> designe RestauMargin SAS, societe par actions simplifiee de droit francais, editrice et exploitante de la Plateforme, dont le siege social est situe a Marseille, France.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.2 « La Plateforme »</span> designe le site internet accessible a l'adresse https://restaumargin.com, ainsi que l'ensemble de ses sous-domaines, pages, fonctionnalites, applications mobiles associees et services en ligne proposes par la Societe. La Plateforme constitue un outil de gestion de marge en mode SaaS (Software as a Service) destine aux professionnels de la restauration, de l'hotellerie et des metiers de bouche, permettant notamment le calcul des couts, le suivi des marges, la gestion des ingredients, des recettes, des fournisseurs, de l'inventaire, des commandes, de la comptabilite, ainsi que l'acces a des outils d'intelligence artificielle, de menu engineering, de mercuriale des prix, de scan de factures et de conformite HACCP.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.3 « L'Utilisateur »</span> designe toute personne physique ou morale qui accede a la Plateforme, navigue sur le Site, cree un compte, souscrit a un abonnement ou utilise les services proposes par la Societe, que ce soit a titre gratuit ou payant, a titre professionnel ou personnel. Le terme « Utilisateur » englobe tant les visiteurs non inscrits que les utilisateurs disposant d'un compte personnel actif sur la Plateforme.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.4 « Le Compte »</span> designe l'espace personnel cree par l'Utilisateur sur la Plateforme, protege par des identifiants de connexion (adresse electronique et mot de passe), donnant acces aux services et fonctionnalites de la Plateforme. Le Compte contient les informations personnelles et professionnelles de l'Utilisateur, ses parametres de configuration, ainsi que l'ensemble des donnees qu'il saisit dans le cadre de l'utilisation des services.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.5 « Les Services »</span> designe l'ensemble des services et fonctionnalites proposes par la Societe via la Plateforme, incluant sans s'y limiter la gestion des ingredients, les fiches techniques, les menus, les inventaires, les commandes, la comptabilite, les outils d'intelligence artificielle, le menu engineering, la mercuriale des prix, le scanner de factures, le suivi HACCP, la tracabilite, ainsi que tout autre service qui pourrait etre propose ulterieurement par la Societe.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.6 « Les Donnees de l'Utilisateur »</span> designe l'ensemble des informations, donnees, contenus, fichiers et documents saisis, importes, telecharges ou generes par l'Utilisateur dans le cadre de l'utilisation de la Plateforme et des Services, incluant sans s'y limiter les ingredients, les recettes, les fiches techniques, les menus, les inventaires, les commandes, les donnees comptables, les donnees de pesees, les factures scannees et les donnees relatives aux fournisseurs.
            </p>
          </section>

          {/* Article 2 - Objet */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Objet</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.1</span> Les presentes CGU ont pour objet de definir les conditions d'acces et d'utilisation de la Plateforme et des Services proposes par la Societe. Elles regissent les droits et obligations respectifs de la Societe et de l'Utilisateur dans le cadre de l'utilisation de la Plateforme. Les presentes CGU sont completees par les Conditions Generales de Vente (CGV), les Mentions legales et la Politique de confidentialite, qui forment ensemble le cadre contractuel global regissant la relation entre la Societe et l'Utilisateur.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.2</span> RestauMargin est une plateforme SaaS (Software as a Service) de gestion de marge concue pour les professionnels de la restauration, de l'hotellerie et des metiers de bouche. La Plateforme propose un ensemble complet d'outils permettant aux professionnels de la restauration d'optimiser la gestion de leurs couts, de leurs marges, de leurs ingredients, de leurs recettes, de leurs menus, de leurs inventaires, de leurs commandes et de leur comptabilite. La Plateforme integre egalement des outils d'intelligence artificielle pour l'optimisation des couts, des menus et des approvisionnements, ainsi que des fonctionnalites avancees de menu engineering, de mercuriale des prix, de scan de factures par OCR, de conformite HACCP et de tracabilite.
            </p>
          </section>

          {/* Article 3 - Inscription et compte */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Inscription et gestion du Compte</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.1</span> L'acces a l'ensemble des fonctionnalites de la Plateforme necessite la creation prealable d'un Compte utilisateur. L'Utilisateur doit fournir des informations exactes, completes et a jour lors de son inscription, incluant notamment son nom, son prenom, son adresse electronique, un mot de passe securise, le nom de son etablissement et toute autre information requise par le formulaire d'inscription. L'Utilisateur s'engage a mettre a jour ses informations sans delai en cas de modification.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.2</span> L'Utilisateur est seul responsable de la confidentialite et de la securite de ses identifiants de connexion (adresse electronique et mot de passe). Il s'engage a ne pas communiquer ses identifiants a des tiers et a prendre toutes les mesures necessaires pour empecher toute utilisation non autorisee de son Compte. Toute activite realisee a partir du Compte de l'Utilisateur, qu'elle soit ou non effectuee par l'Utilisateur lui-meme, est presumee avoir ete effectuee sous sa responsabilite. En cas de perte, de vol ou de compromission de ses identifiants, l'Utilisateur doit en informer immediatement la Societe par courrier electronique a l'adresse contact@restaumargin.fr et proceder au changement de son mot de passe sans delai.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.3</span> La Societe se reserve le droit de verifier l'identite et la qualite de l'Utilisateur, de refuser toute inscription qui ne respecterait pas les conditions prevues aux presentes CGU, ou de suspendre ou supprimer tout Compte qui aurait ete cree sur la base d'informations fausses, incompletes ou trompeuses. La creation de comptes multiples par un meme Utilisateur sans autorisation prealable de la Societe est interdite.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.4</span> Lors de la creation de son Compte, l'Utilisateur choisit un mot de passe conforme aux exigences de securite definies par la Societe. Le mot de passe doit comporter un nombre minimal de caracteres et combiner differents types de caracteres (lettres majuscules et minuscules, chiffres, caracteres speciaux) afin de garantir un niveau de securite adequat. La Societe met en oeuvre des mesures de hachage securise des mots de passe et ne stocke jamais les mots de passe en clair.
            </p>
          </section>

          {/* Article 4 - Services */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Description des Services</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.1</span> La Plateforme propose les fonctionnalites suivantes, sous reserve de l'abonnement souscrit par l'Utilisateur :
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li>Calcul de marge en temps reel sur les recettes et fiches techniques, permettant au professionnel de la restauration de connaitre avec precision le cout de revient, la marge brute et le ratio de food cost de chacune de ses preparations</li>
              <li>Gestion complete des ingredients, avec suivi des prix fournisseurs, des unites de mesure, des rendements, des allergenes et des informations nutritionnelles</li>
              <li>Creation et gestion des fiches techniques (recettes) avec calcul automatique des couts, des portions et des valeurs nutritionnelles</li>
              <li>Gestion des fournisseurs et mercuriale des prix avec historique de l'evolution des cours des matieres premieres</li>
              <li>Gestion des inventaires et suivi des stocks en temps reel, avec alertes de seuils de reapprovisionnement</li>
              <li>Gestion des commandes fournisseurs avec generation automatique de bons de commande</li>
              <li>Outils de comptabilite et de reporting financier adaptes aux besoins de la restauration</li>
              <li>Assistant d'intelligence artificielle pour l'optimisation des couts, des menus et des approvisionnements</li>
              <li>Scan de factures par technologie OCR (reconnaissance optique de caracteres) permettant l'importation automatique des donnees de facturation</li>
              <li>Menu Engineering et analyse de rentabilite des plats et des menus selon la methode BCG (Boston Consulting Group)</li>
              <li>Conformite HACCP et outils de tracabilite alimentaire pour le respect des normes d'hygiene et de securite alimentaire</li>
              <li>Commande vocale et dictee en langage naturel pour la saisie rapide de donnees</li>
            </ul>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.2</span> La Societe se reserve le droit de modifier, d'ajouter ou de supprimer des fonctionnalites de la Plateforme a tout moment, dans le cadre de l'amelioration continue des Services. Les modifications substantielles seront notifiees aux Utilisateurs par courrier electronique ou par notification sur la Plateforme. La Societe s'efforce de maintenir les Services disponibles en permanence, mais ne garantit pas une disponibilite ininterrompue de la Plateforme, notamment en raison des operations de maintenance, de mise a jour ou de cas de force majeure.
            </p>
          </section>

          {/* Article 5 - Obligations de l'Utilisateur */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Obligations de l'Utilisateur</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.1</span> L'Utilisateur s'engage a utiliser la Plateforme et les Services de maniere conforme a leur destination, dans le respect des presentes CGU, de la legislation francaise et europeenne applicable, ainsi que des droits des tiers. L'Utilisateur s'engage notamment a :
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li>Utiliser la Plateforme exclusivement dans le cadre de son activite professionnelle de restauration, d'hotellerie ou de metiers de bouche, et conformement a la destination des Services</li>
              <li>Fournir des informations exactes, completes et a jour lors de son inscription et tout au long de l'utilisation des Services, et mettre a jour ces informations sans delai en cas de changement</li>
              <li>Maintenir la stricte confidentialite de ses identifiants de connexion et ne pas les communiquer a des tiers non autorises</li>
              <li>Ne pas tenter d'acceder de maniere non autorisee aux systemes, reseaux, serveurs ou bases de donnees de la Societe ou de ses prestataires</li>
              <li>Ne pas effectuer de scraping, d'extraction automatisee, de data mining, de reverse engineering, de decompilation ou de desassemblage de tout ou partie de la Plateforme ou des Services</li>
              <li>Ne pas diffuser via la Plateforme de contenu illicite, diffamatoire, injurieux, obscene, pornographique, violent, discriminatoire, ou contraire a l'ordre public et aux bonnes moeurs</li>
              <li>Ne pas utiliser la Plateforme a des fins frauduleuses, illegales ou susceptibles de porter atteinte aux droits et interets de la Societe ou des tiers</li>
              <li>Respecter les droits de propriete intellectuelle de la Societe et des tiers</li>
              <li>Ne pas introduire de virus, logiciels malveillants, chevaux de Troie ou tout autre programme informatique de nature a porter atteinte au fonctionnement de la Plateforme ou des systemes informatiques de la Societe</li>
              <li>Ne pas surcharger intentionnellement les infrastructures de la Plateforme par des requetes massives ou automatisees (attaques par deni de service ou DDoS)</li>
            </ul>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.2</span> En cas de manquement de l'Utilisateur a l'une quelconque des obligations prevues au present article, la Societe se reserve le droit de suspendre ou de supprimer le Compte de l'Utilisateur, de restreindre l'acces aux Services, de plein droit et sans preavis, sans que cette suspension ou suppression ne puisse donner lieu a une quelconque indemnisation au profit de l'Utilisateur. La Societe se reserve egalement le droit d'engager toute action judiciaire qu'elle jugera necessaire pour la defense de ses droits et interets, et de reclamer la reparation integrale de tout prejudice subi.
            </p>
          </section>

          {/* Article 6 - Propriete intellectuelle */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Propriete intellectuelle</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.1</span> La Societe detient l'ensemble des droits de propriete intellectuelle relatifs a la Plateforme, incluant sans s'y limiter le code source, le code objet, l'architecture logicielle, les algorithmes, les interfaces, le design, la charte graphique, les textes, les logos, les marques, les denominations, les bases de donnees, les fonctionnalites et tout autre element protegeable par le droit de la propriete intellectuelle francais et international. Ces elements sont proteges par le Code de la propriete intellectuelle, le droit d'auteur, le droit des marques, le droit des dessins et modeles, le droit des brevets et le droit sui generis des bases de donnees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.2</span> L'Utilisateur conserve la pleine et entiere propriete de ses Donnees, c'est-a-dire de l'ensemble des donnees, informations et contenus qu'il saisit, importe, telecharge ou genere sur la Plateforme dans le cadre de l'utilisation des Services (ingredients, recettes, fiches techniques, menus, inventaires, commandes, donnees comptables, donnees de pesees, factures, informations relatives aux fournisseurs, etc.). La Societe ne revendique aucun droit de propriete intellectuelle sur les Donnees de l'Utilisateur et s'engage a ne pas utiliser ces donnees a des fins autres que la fourniture des Services, sauf autorisation expresse de l'Utilisateur ou obligation legale.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.3</span> Toute reproduction, representation, modification, publication, distribution, retransmission, adaptation, traduction, decompilation, desassemblage, reverse engineering ou exploitation de tout ou partie des elements de la Plateforme, par quelque moyen, procede ou support que ce soit, est strictement interdite sans l'autorisation ecrite prealable et expresse de la Societe. Toute exploitation non autorisee de la Plateforme ou de ses elements constitue une contrefacon au sens des articles L.335-2 et suivants du Code de la propriete intellectuelle, sanctionnee par les dispositions penales applicables.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.4</span> L'Utilisateur concede a la Societe une licence non exclusive, mondiale, gratuite et pour la duree de son inscription, l'autorisant a heberger, stocker, reproduire, adapter et afficher les Donnees de l'Utilisateur dans la seule mesure necessaire a la fourniture des Services. Cette licence prend fin automatiquement a la date de suppression du Compte de l'Utilisateur, sous reserve des obligations legales de conservation des donnees applicables.
            </p>
          </section>

          {/* Article 7 - Donnees personnelles */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Donnees personnelles et vie privee</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.1</span> La Societe collecte et traite des donnees personnelles dans le cadre de l'utilisation de la Plateforme et des Services, conformement au Reglement (UE) 2016/679 du 27 avril 2016 (Reglement General sur la Protection des Donnees ou « RGPD »), a la loi n° 78-17 du 6 janvier 1978 modifiee relative a l'informatique, aux fichiers et aux libertes, et a toute autre reglementation applicable en matiere de protection des donnees a caractere personnel.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.2</span> Les categories de donnees personnelles collectees, les finalites du traitement, les bases legales, les destinataires des donnees, les durees de conservation, les droits des personnes concernees et les modalites d'exercice de ces droits sont detailles dans la{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialite
              </a>{' '}
              de la Societe, accessible a tout moment sur le Site et constituant une partie integrante des presentes CGU.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.3</span> L'Utilisateur dispose d'un droit d'acces, de rectification, d'effacement, de limitation du traitement, de portabilite des donnees et d'opposition au traitement de ses donnees personnelles, qu'il peut exercer en contactant la Societe a l'adresse contact@restaumargin.fr. L'Utilisateur dispose egalement du droit de definir des directives relatives au sort de ses donnees personnelles apres son deces, conformement a l'article 85 de la loi n° 78-17 du 6 janvier 1978 modifiee.
            </p>
          </section>

          {/* Article 8 - Responsabilite */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Limitation de responsabilite</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.1</span> La Societe s'efforce d'assurer la disponibilite, la fiabilite et le bon fonctionnement de la Plateforme et des Services. Toutefois, les Services sont fournis « en l'etat » et « selon disponibilite », sans garantie expresse ou implicite d'aucune sorte, incluant sans s'y limiter les garanties implicites de commercialisation, d'adequation a un usage particulier et de non-contrefacon. La Societe ne garantit pas que la Plateforme sera exempte d'erreurs, de bugs ou de dysfonctionnements, ni que les defauts seront corriges dans un delai determine.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.2</span> La Societe ne saurait etre tenue responsable des dommages directs ou indirects resultant de l'utilisation ou de l'impossibilite d'utilisation de la Plateforme et des Services, notamment en cas de perte de donnees, d'interruption de service, de dysfonctionnement technique, d'intrusion informatique, de virus, de modification non autorisee du contenu ou de toute autre cause echappant au controle raisonnable de la Societe. La Societe ne saurait davantage etre tenue responsable des decisions commerciales, financieres, comptables ou de gestion prises par l'Utilisateur sur la base des informations et analyses fournies par la Plateforme.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.3</span> L'Utilisateur est seul responsable de l'exactitude, de l'exhaustivite et de la pertinence des donnees qu'il saisit sur la Plateforme. La Societe ne saurait etre tenue responsable des erreurs, inexactitudes ou lacunes dans les donnees saisies par l'Utilisateur, ni des consequences qui pourraient en decouler. Il appartient a l'Utilisateur de verifier systematiquement les resultats et analyses produits par la Plateforme avant de prendre toute decision sur la base de ces informations.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.4</span> En tout etat de cause, la responsabilite totale et cumulee de la Societe au titre des presentes CGU, toutes causes confondues, ne pourra exceder le montant total des sommes effectivement versees par l'Utilisateur a la Societe au cours des douze (12) derniers mois precedant l'evenement donnant lieu a responsabilite. Cette limitation de responsabilite s'applique dans toute la mesure permise par la loi applicable.
            </p>
          </section>

          {/* Article 9 - Resiliation */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Resiliation et suppression de Compte</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.1</span> L'Utilisateur peut a tout moment demander la suppression de son Compte depuis les parametres de son profil sur la Plateforme ou en adressant un courrier electronique a l'adresse contact@restaumargin.fr. La suppression du Compte entraine la cessation de l'acces aux Services et la programmation de la suppression definitive de l'ensemble des Donnees de l'Utilisateur des serveurs de la Societe dans un delai de trente (30) jours a compter de la date effective de suppression du Compte, sous reserve du respect des obligations legales de conservation applicables (obligations comptables, fiscales, legales ou reglementaires).
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.2</span> Prealablement a la suppression de son Compte, l'Utilisateur est invite a exporter l'ensemble de ses Donnees en utilisant les outils d'export mis a sa disposition sur la Plateforme. La Societe ne saurait etre tenue responsable de la perte de donnees resultant de la suppression du Compte par l'Utilisateur sans exportation prealable de ses Donnees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.3</span> La Societe se reserve le droit de suspendre ou de supprimer un Compte de plein droit, sans preavis et sans indemnite, en cas de : (a) violation par l'Utilisateur de l'une quelconque des obligations prevues aux presentes CGU ; (b) utilisation abusive, frauduleuse ou malveillante de la Plateforme ou des Services ; (c) non-paiement de l'abonnement apres mise en demeure restee sans effet pendant quinze (15) jours ; (d) inactivite du Compte pendant une periode de vingt-quatre (24) mois consecutifs ; (e) comportement de nature a porter atteinte a la securite, a l'integrite ou au fonctionnement de la Plateforme, ou aux droits et interets de la Societe ou des autres Utilisateurs. L'Utilisateur sera informe de la suspension ou de la suppression de son Compte par courrier electronique, sauf en cas d'urgence justifiant une action immediate.
            </p>
          </section>

          {/* Article 10 - Modification des CGU */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Modification des CGU</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.1</span> La Societe se reserve le droit de modifier, de completer ou de mettre a jour les presentes CGU a tout moment, sans preavis, afin de les adapter aux evolutions de la Plateforme, des Services, de la reglementation applicable ou des pratiques du marche. Les modifications entrent en vigueur des leur publication sur la Plateforme, a la date indiquee en tete du document.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.2</span> En cas de modification substantielle des presentes CGU, la Societe en informera les Utilisateurs par courrier electronique a l'adresse associee a leur Compte et/ou par une notification affichee sur la Plateforme, au moins quinze (15) jours avant l'entree en vigueur des nouvelles CGU. La poursuite de l'utilisation de la Plateforme et des Services apres l'entree en vigueur des modifications vaut acceptation pleine et entiere des nouvelles CGU par l'Utilisateur. En cas de desaccord avec les nouvelles CGU, l'Utilisateur peut supprimer son Compte dans les conditions prevues a l'article 9 des presentes CGU.
            </p>
          </section>

          {/* Article 11 - Force majeure */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Force majeure</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">11.1</span> La Societe ne saurait etre tenue responsable de l'inexecution ou du retard dans l'execution de ses obligations au titre des presentes CGU, lorsque cette inexecution ou ce retard resulte d'un cas de force majeure au sens de l'article 1218 du Code civil, c'est-a-dire d'un evenement echappant au controle de la Societe, qui ne pouvait etre raisonnablement prevu lors de la conclusion du contrat et dont les effets ne peuvent etre evites par des mesures appropriees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">11.2</span> Sont expressement consideres comme des cas de force majeure, sans que cette enumeration soit limitative : les catastrophes naturelles, les epidemies et pandemies, les actes de terrorisme, les conflits armes, les greves generales, les pannes generalisees de reseaux de telecommunications ou d'electricite, les cyberattaques d'ampleur exceptionnelle, les incendies, les inondations, les decisions gouvernementales ou reglementaires imposant des restrictions d'activite, et tout autre evenement presentant les caractéristiques de la force majeure telle que definie par la jurisprudence francaise.
            </p>
          </section>

          {/* Article 12 - Droit applicable */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 12 — Droit applicable et juridiction competente</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">12.1</span> Les presentes CGU sont regies, interpretees et appliquees conformement au droit francais, a l'exclusion de toute autre legislation et de toute convention internationale. La langue de reference des presentes CGU est la langue francaise. En cas de traduction dans une ou plusieurs autres langues, seule la version francaise fait foi en cas de divergence d'interpretation.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">12.2</span> En cas de litige relatif a l'interpretation, la validite, l'execution ou l'inexecution des presentes CGU, les parties s'engagent a rechercher une solution amiable prealablement a toute action judiciaire, dans un delai de trente (30) jours a compter de la notification du differend par l'une des parties a l'autre. L'Utilisateur consommateur ou non-professionnel est informe qu'il peut recourir a une procedure de mediation de la consommation conformement aux articles L.611-1 et suivants du Code de la consommation. La plateforme europeenne de resolution des litiges en ligne est accessible a l'adresse : https://ec.europa.eu/consumers/odr.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">12.3</span> A defaut de resolution amiable dans le delai prevu, tout litige sera soumis a la competence exclusive des tribunaux competents de Marseille, France, et ce meme en cas de pluralite de defendeurs, d'appel en garantie, de demande incidente ou reconventionnelle, ou de procedure d'urgence ou conservatoire. Cette clause d'attribution de competence s'applique sous reserve des dispositions d'ordre public applicables au profit des consommateurs.
            </p>
          </section>

          {/* Article 13 - Dispositions generales */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 13 — Dispositions generales</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.1 Integralite.</span> Les presentes CGU, ensemble avec les Conditions Generales de Vente, les Mentions legales et la Politique de confidentialite, constituent l'integralite de l'accord entre la Societe et l'Utilisateur concernant l'utilisation de la Plateforme et des Services, et remplacent tout accord, declaration ou engagement anterieur relatif au meme objet.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.2 Divisibilite.</span> Si l'une quelconque des clauses des presentes CGU est declaree nulle, invalide ou inapplicable par une juridiction competente, cette nullite, invalidite ou inapplicabilite n'affectera pas la validite des autres clauses, qui demeureront en plein effet. La clause concernee sera remplacee par une clause valide et applicable se rapprochant le plus possible de l'intention originelle des parties.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.3 Renonciation.</span> Le fait pour la Societe de ne pas exercer ou de tarder a exercer un droit ou une prerogative decoulant des presentes CGU ne constitue pas une renonciation a ce droit ou a cette prerogative, et n'empeche aucunement l'exercice ulterieur de ce droit ou de cette prerogative.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.4 Cession.</span> L'Utilisateur ne peut ceder ou transferer ses droits et obligations au titre des presentes CGU a un tiers sans le consentement prealable et ecrit de la Societe. La Societe peut librement ceder ou transferer ses droits et obligations au titre des presentes CGU dans le cadre d'une restructuration, d'une fusion, d'une acquisition, d'une cession d'actifs ou par l'effet de la loi.
            </p>
          </section>

          {/* Article 14 - Contact */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 14 — Contact</h2>
            <p className="text-slate-300">
              Pour toute question, demande d'information, reclamation ou signalement relatif aux presentes Conditions Generales d'Utilisation, a la Plateforme ou aux Services, l'Utilisateur peut contacter la Societe aux coordonnees suivantes :
            </p>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Raison sociale :</span> RestauMargin SAS</p>
              <p><span className="text-slate-400">Siege social :</span> Marseille, France</p>
              <p><span className="text-slate-400">Email :</span>{' '}
                <a href="mailto:contact@restaumargin.fr" className="text-teal-400 hover:text-teal-300 underline">
                  contact@restaumargin.fr
                </a>
              </p>
            </div>
            <p className="text-slate-300">
              La Societe s'engage a accuser reception de toute demande dans un delai de quarante-huit (48) heures ouvrables et a y apporter une reponse dans un delai raisonnable, n'excedant pas trente (30) jours ouvrables a compter de la reception de la demande complete.
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
