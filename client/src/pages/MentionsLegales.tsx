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
        <p className="text-slate-400 mb-10">Derniere mise a jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Preambule</h2>
            <p className="text-slate-300">
              Conformement aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'economie numerique (dite « LCEN »), il est porte a la connaissance des utilisateurs et visiteurs du site internet accessible a l'adresse https://restaumargin.com (ci-apres denomme « le Site ») les presentes mentions legales. La connexion et la navigation sur le Site par l'utilisateur impliquent l'acceptation integrale et sans reserve des presentes mentions legales. Ces dernieres sont accessibles sur le Site a la rubrique « Mentions legales » et peuvent etre consultees a tout moment. Le Site est exploite dans le respect de la legislation francaise. L'utilisation de ce Site est regie par les presentes conditions d'utilisation. En utilisant le Site, vous reconnaissez avoir pris connaissance de ces conditions et les avoir acceptees. Celles-ci pourront etre modifiees ou completees a tout moment, sans preavis, aussi les utilisateurs du Site sont-ils invites a les consulter de maniere reguliere.
            </p>
            <p className="text-slate-300">
              Les presentes mentions legales ont pour objet de definir les modalites de mise a disposition du Site et les conditions d'utilisation du Site par tout utilisateur. Elles constituent le contrat entre le Site et l'utilisateur. L'acces au Site par l'utilisateur signifie son acceptation des presentes mentions legales. En cas de non-acceptation des mentions legales stipulees dans le present document, l'utilisateur se doit de renoncer a l'acces des services proposes par le Site. RestauMargin SAS se reserve le droit de modifier unilateralement et a tout moment le contenu des presentes mentions legales, sans notification prealable aux utilisateurs. Les mentions legales modifiees entrent en vigueur des leur publication sur le Site.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Definitions</h2>
            <p className="text-slate-300">
              Pour l'application des presentes mentions legales, les termes ci-dessous auront la signification suivante :
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.1 « La Societe »</span> designe RestauMargin SAS, societe par actions simplifiee de droit francais, dont le siege social est situe a Marseille, France, immatriculee au Registre du Commerce et des Societes de Marseille. La Societe est l'editeur du Site et le responsable de la collecte et du traitement des donnees personnelles effectues dans le cadre de l'utilisation du Site et des services associes.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.2 « Le Site »</span> designe le site internet accessible a l'adresse https://restaumargin.com ainsi que l'ensemble de ses sous-domaines, pages, fonctionnalites, applications mobiles associees et services en ligne proposes par la Societe. Le Site inclut l'ensemble des contenus, outils, fonctionnalites et services mis a disposition des utilisateurs, qu'ils soient accessibles gratuitement ou dans le cadre d'un abonnement payant.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.3 « L'Utilisateur »</span> designe toute personne physique ou morale qui accede au Site, navigue sur le Site, utilise les services proposes par le Site, que ce soit a titre gratuit ou payant, a titre professionnel ou personnel. Le terme « Utilisateur » englobe tant les visiteurs non inscrits que les utilisateurs ayant cree un compte personnel sur le Site.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.4 « Les Services »</span> designe l'ensemble des services et fonctionnalites proposes par la Societe via le Site, incluant sans s'y limiter la plateforme SaaS de gestion de marge pour la restauration, les outils de calcul de couts, de suivi des marges, de gestion des ingredients, des recettes, des fournisseurs, de l'inventaire, les outils d'intelligence artificielle, les outils de menu engineering, la mercuriale des prix, le scanner de factures, ainsi que tout autre service qui pourrait etre propose ulterieurement par la Societe.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.5 « Le Contenu »</span> designe l'ensemble des elements presents sur le Site, incluant sans s'y limiter les textes, images, photographies, illustrations, graphiques, logos, marques, denominations sociales, noms de domaine, logiciels, bases de donnees, design, architecture, code source, code objet, algorithmes, interfaces, fonctionnalites, sons, videos, animations, et plus generalement toute information de quelque nature que ce soit et sous quelque forme que ce soit, accessible sur le Site ou par le biais du Site.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.6 « Les Donnees Personnelles »</span> designent toute information se rapportant a une personne physique identifiee ou identifiable, directement ou indirectement, au sens du Reglement (UE) 2016/679 du Parlement europeen et du Conseil du 27 avril 2016 relatif a la protection des personnes physiques a l'egard du traitement des donnees a caractere personnel et a la libre circulation de ces donnees (ci-apres « le RGPD »).
            </p>
          </section>

          {/* Article 2 - Editeur du site */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Editeur du Site</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.1</span> Le Site est edite par RestauMargin SAS (ci-apres « la Societe »), societe par actions simplifiee au capital social variable, immatriculee au Registre du Commerce et des Societes de Marseille, dont le siege social est etabli a Marseille, France.
            </p>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Denomination sociale :</span> RestauMargin SAS</p>
              <p><span className="text-slate-400">Forme juridique :</span> Societe par actions simplifiee (SAS)</p>
              <p><span className="text-slate-400">Siege social :</span> Marseille, France</p>
              <p><span className="text-slate-400">Email :</span> contact@restaumargin.fr</p>
              <p><span className="text-slate-400">Site web :</span> https://restaumargin.com</p>
            </div>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.2</span> La Societe est soumise a la legislation francaise en vigueur, notamment a la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'economie numerique, au Code de commerce, au Code civil et au Code de la consommation. La Societe exerce son activite principale dans le domaine de l'edition de logiciels applicatifs et de la fourniture de services en mode SaaS (Software as a Service) destines aux professionnels de la restauration, de l'hotellerie et des metiers de bouche en general.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.3</span> La Societe peut etre contactee par courrier electronique a l'adresse contact@restaumargin.fr pour toute question, reclamation, demande d'information ou exercice de droits relatifs aux presentes mentions legales, aux conditions generales d'utilisation, aux conditions generales de vente, a la politique de confidentialite ou a tout autre aspect de l'utilisation du Site et des Services. La Societe s'engage a repondre dans un delai raisonnable a toute demande formulee par les utilisateurs par ce biais.
            </p>
          </section>

          {/* Article 3 - Directeur de la publication */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Directeur de la publication</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.1</span> Le directeur de la publication du Site est le representant legal de la Societe, en sa qualite de President de RestauMargin SAS. Conformement aux dispositions de l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'economie numerique, le directeur de la publication est la personne qui determine les contenus et les services mis en ligne sur le Site, et qui assume la responsabilite editoriale de l'ensemble des contenus publies sur le Site.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.2</span> Le directeur de la publication peut etre contacte a l'adresse electronique suivante : contact@restaumargin.fr. Toute notification, mise en demeure ou correspondance officielle relative au contenu editorial du Site doit etre adressee au directeur de la publication a l'adresse du siege social de la Societe ou par voie electronique a l'adresse precitee.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.3</span> Le directeur de la publication veille a ce que les contenus publies sur le Site respectent les dispositions legales et reglementaires applicables, et notamment les dispositions relatives a la propriete intellectuelle, au droit a l'image, au respect de la vie privee, a l'ordre public et aux bonnes moeurs. En cas de signalement de contenu illicite, le directeur de la publication s'engage a prendre les mesures necessaires dans les meilleurs delais pour retirer ou rendre inaccessible le contenu en question, conformement aux dispositions de la LCEN.
            </p>
          </section>

          {/* Article 4 - Hebergement */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Hebergement</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.1</span> Le Site est heberge par un hebergeur professionnel base dans l'Union europeenne, dans le respect des dispositions du Reglement General sur la Protection des Donnees (RGPD) et des legislations nationales applicables en matiere de protection des donnees a caractere personnel. L'hebergeur met en oeuvre les mesures techniques et organisationnelles appropriees pour assurer la securite, la disponibilite et l'integrite des donnees hebergees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.2</span> L'hebergeur assure le stockage des donnees du Site sur des serveurs situes dans l'Union europeenne, garantissant ainsi le respect des exigences europeennes en matiere de localisation et de transfert de donnees a caractere personnel. Les infrastructures d'hebergement sont protegees par des mesures de securite physiques et logiques conformes aux standards de l'industrie, incluant sans s'y limiter le chiffrement des donnees en transit et au repos, les systemes de detection et de prevention des intrusions, les pare-feux applicatifs, les sauvegardes regulieres et les plans de reprise d'activite.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.3</span> La Societe a conclu avec son hebergeur un contrat de sous-traitance au sens de l'article 28 du RGPD, incluant des clauses relatives aux obligations de l'hebergeur en matiere de protection des donnees personnelles, aux mesures techniques et organisationnelles de securite, aux conditions de recours a d'eventuels sous-traitants ulterieurs, aux modalites d'assistance de la Societe pour repondre aux demandes d'exercice de droits des personnes concernees, ainsi qu'aux conditions de restitution et de suppression des donnees a l'issue du contrat.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.4</span> En cas de transfert de donnees vers un pays situe en dehors de l'Union europeenne ou de l'Espace economique europeen, la Societe et son hebergeur s'assurent que des garanties appropriees sont mises en place conformement aux articles 44 a 49 du RGPD, telles que des clauses contractuelles types adoptees par la Commission europeenne, ou toute autre garantie reconnue par la reglementation applicable en matiere de protection des donnees personnelles.
            </p>
          </section>

          {/* Article 5 - CNIL et donnees personnelles */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Protection des donnees personnelles et CNIL</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.1</span> Conformement aux dispositions du Reglement (UE) 2016/679 du 27 avril 2016 (Reglement General sur la Protection des Donnees ou « RGPD »), de la loi n° 78-17 du 6 janvier 1978 modifiee relative a l'informatique, aux fichiers et aux libertes (dite « Loi Informatique et Libertes »), et de toute autre reglementation applicable en matiere de protection des donnees a caractere personnel, la Societe s'engage a respecter les droits fondamentaux des personnes dont elle traite les donnees personnelles.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.2</span> Les traitements de donnees a caractere personnel mis en oeuvre par la Societe dans le cadre de l'exploitation du Site et de la fourniture des Services font l'objet des formalites requises aupres de la Commission Nationale de l'Informatique et des Libertes (CNIL). Declaration en cours d'enregistrement aupres de la CNIL. La Societe tient un registre des activites de traitement conformement a l'article 30 du RGPD, lequel recense l'ensemble des traitements de donnees personnelles effectues sous sa responsabilite, les categories de donnees traitees, les finalites des traitements, les destinataires des donnees, les durees de conservation applicables et les mesures de securite mises en oeuvre.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.3</span> L'utilisateur dispose d'un ensemble de droits sur ses donnees personnelles, conformement aux articles 15 a 22 du RGPD. Ces droits incluent le droit d'acces, le droit de rectification, le droit a l'effacement (droit a l'oubli), le droit a la limitation du traitement, le droit a la portabilite des donnees, le droit d'opposition, ainsi que le droit de ne pas faire l'objet d'une decision individuelle automatisee, y compris le profilage. L'utilisateur peut exercer ces droits en adressant un courrier electronique a l'adresse contact@restaumargin.fr, accompagne d'une copie d'un justificatif d'identite. La Societe s'engage a repondre a toute demande dans un delai maximum de trente (30) jours a compter de la reception de la demande complete.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.4</span> En cas de difficulte en lien avec la gestion de ses donnees personnelles, l'utilisateur peut introduire une reclamation aupres de la CNIL (Commission Nationale de l'Informatique et des Libertes), autorite de controle francaise competente en matiere de protection des donnees personnelles, dont le siege est situe au 3, place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, ou via son site internet www.cnil.fr.
            </p>
            <p className="text-slate-300">
              Pour plus d'informations sur la collecte, le traitement, la conservation et la protection de vos donnees personnelles, veuillez consulter notre{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialite
              </a>, qui fait partie integrante des presentes mentions legales.
            </p>
          </section>

          {/* Article 6 - Cookies */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Cookies et technologies de tracage</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.1</span> Le Site utilise des cookies et des technologies de tracage similaires (tels que les pixels invisibles, les balises web, les identifiants de session, le stockage local et les empreintes numeriques) pour assurer le bon fonctionnement du Site, ameliorer l'experience utilisateur, personnaliser les contenus et les services proposes, mesurer l'audience du Site et analyser les comportements de navigation des utilisateurs. L'utilisation de ces technologies est soumise aux dispositions de l'article 82 de la loi n° 78-17 du 6 janvier 1978 modifiee et aux lignes directrices et recommandations de la CNIL en matiere de cookies et autres traceurs.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.2</span> Les cookies essentiels (ou cookies strictement necessaires) sont ceux qui sont indispensables au fonctionnement du Site et a la fourniture des Services demandes par l'utilisateur. Ils permettent notamment la gestion de l'authentification, la conservation des preferences de session, la securisation de la navigation et le bon fonctionnement des fonctionnalites de base du Site. Ces cookies ne necessitent pas le consentement prealable de l'utilisateur conformement a l'article 82 de la Loi Informatique et Libertes.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.3</span> Les cookies analytiques et de mesure d'audience permettent de recueillir des informations sur l'utilisation du Site par les visiteurs, telles que le nombre de visiteurs, les pages consultees, la duree des visites, le taux de rebond et les sources de trafic. Ces informations sont utilisees de maniere agregee et anonymisee pour ameliorer les performances et le contenu du Site. Le depot de ces cookies est soumis au consentement prealable de l'utilisateur, recueilli via le bandeau de cookies affiche lors de la premiere visite sur le Site.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.4</span> L'utilisateur peut a tout moment modifier ses preferences en matiere de cookies, accepter ou refuser tout ou partie des cookies non essentiels, via les parametres de son navigateur internet ou via le mecanisme de gestion des preferences de cookies mis a disposition sur le Site. La suppression ou le refus des cookies essentiels peut entrainer des perturbations dans le fonctionnement du Site et limiter l'acces a certaines fonctionnalites. La duree de validite des cookies deposes sur le terminal de l'utilisateur n'excede pas treize (13) mois conformement aux recommandations de la CNIL.
            </p>
            <p className="text-slate-300">
              Pour plus d'informations sur la gestion des cookies et des technologies de tracage, veuillez consulter notre{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialite
              </a>.
            </p>
          </section>

          {/* Article 7 - Propriete intellectuelle */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Propriete intellectuelle</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.1</span> L'ensemble des elements composant le Site et les Services, incluant sans s'y limiter les textes, images, photographies, illustrations, graphiques, logos, marques, denominations sociales, noms de domaine, logiciels, programmes informatiques, codes sources, codes objets, algorithmes, bases de donnees, charte graphique, design, architecture, interfaces, fonctionnalites, sons, videos, animations, et plus generalement tout element protegeable par le droit de la propriete intellectuelle, sont la propriete exclusive de RestauMargin SAS ou de ses concedants de licence, et sont proteges par les lois francaises et internationales relatives a la propriete intellectuelle, et notamment par le Code de la propriete intellectuelle, le droit d'auteur, le droit des marques, le droit des dessins et modeles, le droit des brevets et le droit sui generis des bases de donnees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.2</span> Toute reproduction, representation, modification, publication, distribution, retransmission, adaptation, traduction, decompilation, desassemblage, reverse engineering, extraction, ou exploitation de tout ou partie des elements du Site ou des Services, par quelque moyen, procede ou support que ce soit (notamment par telechargement, copie, capture d'ecran, scraping, extraction automatisee de donnees, creation de liens hypertextes profonds, framing ou toute autre methode), est strictement interdite sans l'autorisation ecrite prealable et expresse de RestauMargin SAS. Toute exploitation non autorisee du Site, des Services ou de l'un quelconque des elements qu'ils contiennent est constitutive de contrefacon au sens des articles L.335-2 et suivants du Code de la propriete intellectuelle et est passible de sanctions penales et civiles.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.3</span> Les marques, logos, signes distinctifs et denominations figurant sur le Site sont la propriete exclusive de RestauMargin SAS ou de ses partenaires. Toute utilisation, reproduction ou representation, integrale ou partielle, de ces marques, logos ou signes distinctifs, faite sans le consentement prealable et ecrit de leur titulaire, est prohibee au sens de l'article L.713-2 du Code de la propriete intellectuelle et constitue un acte de contrefacon de marque engage ant la responsabilite civile et penale de son auteur.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.4</span> La Societe concede a l'utilisateur inscrit un droit d'utilisation personnel, non exclusif, non cessible, non transferable et revocable du Site et des Services, pour la seule duree de son inscription et dans les limites des presentes mentions legales, des conditions generales d'utilisation et des conditions generales de vente. Ce droit d'utilisation ne confere aucun droit de propriete intellectuelle a l'utilisateur sur les elements du Site ou des Services. L'utilisateur conserve neanmoins la pleine propriete des donnees qu'il saisit sur le Site dans le cadre de l'utilisation des Services (ingredients, recettes, fiches techniques, menus, inventaires, commandes, donnees comptables, etc.).
            </p>
          </section>

          {/* Article 8 - Limitation de responsabilite */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Limitation de responsabilite</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.1</span> La Societe s'efforce de fournir sur le Site des informations aussi precises, completes et a jour que possible. Toutefois, la Societe ne saurait garantir l'exactitude, l'exhaustivite, la pertinence ou l'actualite des informations mises a disposition sur le Site. Les informations presentes sur le Site sont fournies a titre indicatif et general et ne sauraient constituer un conseil juridique, fiscal, comptable, financier ou professionnel. En consequence, l'utilisation des informations et contenus disponibles sur le Site se fait sous la pleine et entiere responsabilite de l'utilisateur, a ses propres risques et perils, et il lui appartient de verifier aupres de professionnels qualifies l'ensemble des informations et donnees necessaires a ses prises de decision.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.2</span> La Societe ne pourra en aucun cas etre tenue responsable de tout dommage de quelque nature que ce soit, direct ou indirect, materiel ou immateriel, previsible ou imprevisible, resultant de l'acces au Site, de l'utilisation ou de l'impossibilite d'utilisation du Site ou des Services, de la fiabilite des informations presentes sur le Site, ou de tout evenement en relation avec le Site et/ou les Services. Cette exclusion de responsabilite s'applique notamment, sans s'y limiter, aux cas de perte de donnees, de perte de chiffre d'affaires, de perte de clientele, de perte d'exploitation, de manque a gagner, d'atteinte a la reputation, de prejudice commercial, ou de tout autre dommage consequent ou accessoire.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.3</span> La Societe ne pourra etre tenue responsable en cas de force majeure ou d'evenements imprevisibles et insurmontables au sens de l'article 1218 du Code civil, incluant sans s'y limiter les catastrophes naturelles, les pandemies, les epidemies, les actes de terrorisme, les guerres, les insurrections, les emeutes, les greves, les pannes de reseau, les pannes electriques, les defaillances de fournisseurs de services tiers, les cyberattaques, les actes de piraterie informatique, les virus informatiques, les interruptions de services de telecommunications, les decisions gouvernementales ou administratives, ou tout autre evenement echappant au controle raisonnable de la Societe.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.4</span> La Societe met en oeuvre tous les moyens raisonnables a sa disposition pour assurer un acces continu et de qualite au Site. Neanmoins, le Site pouvant etre interrompu a tout moment pour des raisons de maintenance, de mise a jour, de correction de bugs, d'amelioration des fonctionnalites, ou pour toute autre raison technique, la Societe ne saurait etre tenue a une obligation de resultat quant a la disponibilite permanente du Site et des Services. La Societe s'efforcera de notifier les utilisateurs en cas de maintenance programmee susceptible d'entrainer une interruption significative du service.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.5</span> Le Site peut contenir des liens hypertextes vers d'autres sites internet exploites par des tiers. Ces liens sont fournis a titre informatif uniquement. La Societe n'exerce aucun controle sur le contenu de ces sites tiers et n'assume aucune responsabilite quant a leur contenu, leurs pratiques en matiere de protection des donnees personnelles, ou tout autre aspect de leur fonctionnement. L'insertion de ces liens ne signifie en aucun cas une approbation, une validation ou un partenariat avec les sites en question. L'utilisateur accede a ces sites tiers sous sa propre responsabilite.
            </p>
          </section>

          {/* Article 9 - Acces au site */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Conditions d'acces au Site</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.1</span> L'acces au Site est ouvert a tout utilisateur disposant d'un acces a internet. Les frais relatifs a l'acces au Site (materiel informatique, logiciels, connexion internet, etc.) sont a la charge exclusive de l'utilisateur. La Societe ne saurait etre tenue responsable de tout dysfonctionnement, incompatibilite ou difficulte d'acces lie a l'equipement informatique ou a la connexion internet de l'utilisateur.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.2</span> La Societe se reserve le droit de refuser l'acces au Site, unilateralement et sans notification prealable, a tout utilisateur ne respectant pas les presentes mentions legales, les conditions generales d'utilisation ou les conditions generales de vente. La Societe se reserve egalement le droit de suspendre ou de supprimer l'acces au Site ou a certaines de ses fonctionnalites, temporairement ou definitivement, pour des raisons de maintenance, de mise a jour, de securite, ou pour toute autre raison jugee necessaire par la Societe, sans que cette interruption ne puisse donner lieu a une quelconque indemnisation au profit de l'utilisateur.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.3</span> L'utilisateur s'engage a utiliser le Site de maniere conforme a sa destination, dans le respect des presentes mentions legales, des conditions generales d'utilisation, de la legislation francaise et europeenne applicable, ainsi que des droits des tiers. L'utilisateur s'interdit notamment de proceder a toute activite susceptible de porter atteinte au bon fonctionnement du Site, a sa securite, a son integrite, ou aux droits et interets de la Societe et des autres utilisateurs.
            </p>
          </section>

          {/* Article 10 - Droit applicable */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Droit applicable et juridiction competente</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.1</span> Les presentes mentions legales sont regies, interpretees et appliquees conformement au droit francais, a l'exclusion de toute autre legislation. La langue de reference des presentes mentions legales est la langue francaise. En cas de traduction des presentes mentions legales dans une ou plusieurs autres langues, seule la version francaise fait foi en cas de divergence d'interpretation.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.2</span> En cas de litige relatif a l'interpretation, la validite, l'execution ou l'inexecution des presentes mentions legales, et apres tentative prealable de resolution amiable dans un delai de trente (30) jours a compter de la notification du differend par l'une des parties a l'autre par courrier recommande avec accuse de reception ou par courrier electronique avec accuse de reception, les tribunaux competents de Marseille seront seuls competents pour connaitre du litige, et ce meme en cas de pluralite de defendeurs, d'appel en garantie, ou de procedure d'urgence ou conservatoire, en refere ou par requete.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.3</span> L'utilisateur est informe qu'il peut, prealablement a toute action judiciaire, avoir recours a une procedure de mediation de la consommation conformement aux articles L.611-1 et suivants du Code de la consommation, ou a tout autre mode alternatif de resolution des differends. La plateforme europeenne de resolution des litiges en ligne de la Commission europeenne est accessible a l'adresse suivante : https://ec.europa.eu/consumers/odr. La Societe se reserve neanmoins le droit de saisir directement les juridictions competentes si elle l'estime necessaire pour la defense de ses droits et interets.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.4</span> Si l'une des clauses des presentes mentions legales venait a etre declaree nulle, invalide ou inapplicable par une juridiction competente, cette nullite, invalidite ou inapplicabilite n'affecterait pas la validite et l'applicabilite des autres clauses, qui conserveront leur plein effet. La clause declaree nulle, invalide ou inapplicable sera remplacee par une clause valide, licite et applicable aussi proche que possible de l'intention originelle des parties.
            </p>
          </section>

          {/* Article 11 - Contact */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Contact</h2>
            <p className="text-slate-300">
              Pour toute question, demande d'information, reclamation, signalement de contenu illicite, ou exercice de vos droits relatifs aux presentes mentions legales, a la protection de vos donnees personnelles ou a tout autre aspect de l'utilisation du Site et des Services, vous pouvez contacter la Societe aux coordonnees suivantes :
            </p>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Raison sociale :</span> RestauMargin SAS</p>
              <p><span className="text-slate-400">Siege social :</span> Marseille, France</p>
              <p><span className="text-slate-400">Email :</span> <span className="text-teal-400">contact@restaumargin.fr</span></p>
              <p><span className="text-slate-400">Site web :</span> https://restaumargin.com</p>
            </div>
            <p className="text-slate-300">
              La Societe s'engage a accuser reception de votre demande dans un delai de quarante-huit (48) heures ouvrables et a y apporter une reponse circonstanciee dans un delai maximum de trente (30) jours a compter de la reception de la demande complete. Conformement aux dispositions de la loi n° 2004-575 du 21 juin 2004, la Societe met a disposition des utilisateurs un dispositif permettant de signaler tout contenu illicite ou portant atteinte aux droits des tiers. Les signalements peuvent etre adresses par courrier electronique a l'adresse contact@restaumargin.fr.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions generales de vente</a>
          <a href="/cgu" className="hover:text-teal-400 transition-colors">Conditions generales d'utilisation</a>
          <a href="/politique-confidentialite" className="hover:text-teal-400 transition-colors">Politique de confidentialite</a>
        </div>
      </div>
    </div>
  );
}
