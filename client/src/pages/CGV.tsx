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
        <p className="text-slate-400 mb-10">Derniere mise a jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Preambule</h2>
            <p className="text-slate-300">
              Les presentes Conditions Generales de Vente (ci-apres « les CGV ») constituent le socle unique de la relation commerciale entre les parties. Elles ont pour objet de definir les conditions juridiques et financieres dans lesquelles RestauMargin SAS (ci-apres « la Societe » ou « le Prestataire »), societe par actions simplifiee de droit francais dont le siege social est situe a Marseille, France, fournit ses services et produits a tout client professionnel ou non-professionnel (ci-apres « le Client »). Les CGV s'appliquent a toutes les ventes de services et de produits conclues par la Societe et sont accessibles a tout moment sur le site https://restaumargin.com. La Societe se reserve le droit de modifier les CGV a tout moment. Les CGV applicables sont celles en vigueur a la date de la commande ou de la souscription du Client.
            </p>
            <p className="text-slate-300">
              Toute souscription a un abonnement, tout achat de produit ou de service aupres de la Societe implique l'acceptation sans reserve par le Client des presentes CGV. Le Client reconnait avoir pris connaissance des CGV prealablement a sa commande et les avoir acceptees expressement en cochant la case prevue a cet effet lors du processus de commande en ligne. En cas de contradiction entre les presentes CGV et tout autre document emanant du Client, les CGV prevalront sauf derogation expresse et ecrite acceptee par la Societe.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Definitions</h2>
            <p className="text-slate-300">
              Pour l'interpretation et l'application des presentes Conditions Generales de Vente, les termes definis ci-dessous auront la signification suivante, qu'ils soient employes au singulier ou au pluriel :
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.1 « Abonnement »</span> designe le contrat de souscription a duree indeterminee conclu entre la Societe et le Client, donnant acces aux Services de la Plateforme selon les modalites et tarifs en vigueur. L'Abonnement est souscrit pour une duree indeterminee avec facturation mensuelle, sauf stipulation contraire dans une offre commerciale specifique. L'Abonnement donne acces a l'ensemble des fonctionnalites de la Plateforme selon le plan souscrit par le Client.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.2 « Client »</span> designe toute personne physique ou morale, agissant a titre professionnel ou non, qui souscrit a un Abonnement ou procede a l'achat d'un Produit ou d'un Service aupres de la Societe. Le Client garantit qu'il dispose de la capacite juridique necessaire pour contracter et s'engager au titre des presentes CGV. Si le Client est une personne morale, la personne physique qui procede a la souscription ou a l'achat declare et garantit qu'elle dispose des pouvoirs necessaires pour engager ladite personne morale.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.3 « Plateforme »</span> designe la plateforme logicielle en mode SaaS (Software as a Service) editee et exploitee par la Societe, accessible via internet a l'adresse https://restaumargin.com, incluant l'ensemble des fonctionnalites, outils, modules, interfaces et services associes, qui permet aux professionnels de la restauration de gerer leurs marges, leurs couts, leurs ingredients, leurs recettes, leurs menus, leurs inventaires, leurs commandes, leur comptabilite et d'acceder aux outils d'intelligence artificielle, de menu engineering, de mercuriale des prix et de scan de factures.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.4 « Kit Hardware »</span> designe l'ensemble materiel comprenant une tablette preconfigured et une balance connectee, destine a la pesee et au controle des portions en cuisine, commercialise par la Societe en complement de l'Abonnement a la Plateforme. Le Kit Hardware est livre preconfigure avec l'application RestauMargin installee et les parametres de connexion configures pour le compte du Client.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">1.5 « Services »</span> designe l'ensemble des prestations de services fournies par la Societe au Client dans le cadre de l'Abonnement, incluant l'acces a la Plateforme, le support technique, la maintenance, les mises a jour, les nouvelles fonctionnalites, ainsi que tout service complementaire qui pourrait etre propose par la Societe.
            </p>
          </section>

          {/* Article 2 - Objet */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Objet</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.1</span> Les presentes CGV ont pour objet de definir les droits et obligations respectifs des parties dans le cadre de la vente des Services et des Produits proposes par la Societe au Client, qu'il s'agisse de la souscription a un Abonnement a la Plateforme, de l'achat d'un Kit Hardware, ou de tout autre produit ou service commercialise par la Societe. Les presentes CGV regissent l'ensemble des etapes necessaires a la passation de la commande, depuis la souscription jusqu'a la facturation, la livraison et le service apres-vente.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">2.2</span> La Societe propose les services et produits suivants :
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
              <li>
                <span className="font-medium text-white">Abonnement SaaS</span> : acces a la plateforme de gestion de marge pour la restauration, incluant la gestion des ingredients, les fiches techniques, les menus, les inventaires, les commandes, la comptabilite, les outils d'intelligence artificielle, le menu engineering, la mercuriale des prix, le scanner de factures, le suivi HACCP et la tracabilite, ainsi que l'ensemble des fonctionnalites disponibles sur la Plateforme.
              </li>
              <li>
                <span className="font-medium text-white">Kit Hardware</span> : un ensemble materiel comprenant une tablette preconfigured et une balance connectee, destine a la pesee et au controle des portions en cuisine, livre preconfigure avec l'application RestauMargin.
              </li>
              <li>
                <span className="font-medium text-white">Services complementaires</span> : tout service additionnel qui pourrait etre propose par la Societe, incluant sans s'y limiter les services de formation, d'accompagnement a la mise en place, de personnalisation, de developpement sur mesure, ou de conseil en gestion de restauration.
              </li>
            </ul>
          </section>

          {/* Article 3 - Prix */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Prix et modalites de paiement</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.1</span> Les prix des Services et des Produits sont indiques en euros hors taxes (HT) sur le Site. La taxe sur la valeur ajoutee (TVA) applicable sera ajoutee au montant hors taxes selon le taux en vigueur au jour de la facturation. Les prix applicables sont ceux affiches sur le Site au moment de la validation de la commande par le Client. La Societe se reserve le droit de modifier ses prix a tout moment, etant entendu que les modifications de prix ne s'appliqueront pas aux commandes deja validees et aux Abonnements en cours, sauf notification contraire dans les conditions prevues au present article.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Abonnement SaaS</p>
                <p className="text-2xl font-bold text-white">29 EUR <span className="text-sm font-normal text-slate-400">/ mois HT</span></p>
                <p className="text-sm text-slate-400 mt-2">Facturation mensuelle, prelevement automatique par carte bancaire via prestataire de paiement securise.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Kit Hardware</p>
                <p className="text-2xl font-bold text-white">1 200 EUR <span className="text-sm font-normal text-slate-400">HT</span></p>
                <p className="text-sm text-slate-400 mt-2">Paiement unique a la commande. Livraison sous 5 a 10 jours ouvrables en France metropolitaine.</p>
              </div>
            </div>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.2</span> Le paiement des Services et des Produits s'effectue par carte bancaire via un prestataire de paiement securise et certifie PCI-DSS (Payment Card Industry Data Security Standard). La Societe ne stocke en aucun cas les donnees de carte bancaire du Client. Le paiement de l'Abonnement s'effectue par prelevement automatique mensuel sur la carte bancaire enregistree par le Client lors de sa souscription. Le paiement du Kit Hardware s'effectue en une seule fois lors de la validation de la commande. En cas de rejet de paiement, la Societe se reserve le droit de suspendre l'acces aux Services jusqu'a regularisation complete du paiement.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.3</span> En cas de modification des prix de l'Abonnement, la Societe en informera le Client par courrier electronique au moins trente (30) jours avant la date d'entree en vigueur des nouveaux tarifs. Le Client disposera d'un delai de trente (30) jours a compter de la reception de la notification pour accepter les nouveaux tarifs ou resilier son Abonnement. A defaut de resiliation dans ce delai, les nouveaux tarifs seront reputes acceptes par le Client et s'appliqueront a compter de la prochaine echeance de facturation.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">3.4</span> Toute somme non payee a sa date d'exigibilite portera de plein droit et sans mise en demeure prealable des interets de retard au taux prevu a l'article L.441-10 du Code de commerce, soit le taux d'interet applique par la Banque Centrale Europeenne (BCE) a son operation de refinancement la plus recente majoree de dix (10) points de pourcentage. En outre, conformement aux dispositions de l'article D.441-5 du Code de commerce, tout retard de paiement entrainera l'exigibilite d'une indemnite forfaitaire pour frais de recouvrement d'un montant de quarante (40) euros, sans prejudice du droit de la Societe de demander une indemnisation complementaire si les frais de recouvrement reellement engages depassent ce montant.
            </p>
          </section>

          {/* Article 4 - Duree et resiliation */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Duree et resiliation de l'Abonnement</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.1</span> L'Abonnement est souscrit pour une duree indeterminee, avec facturation mensuelle a compter de la date de souscription. L'Abonnement se renouvelle automatiquement chaque mois, sauf resiliation par l'une ou l'autre des parties dans les conditions prevues au present article. La premiere facturation intervient au jour de la souscription et les facturations suivantes interviennent a la meme date chaque mois.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.2</span> Le Client peut resilier son Abonnement a tout moment, sans avoir a justifier de motif, directement depuis son espace personnel sur la Plateforme ou en adressant un courrier electronique a l'adresse contact@restaumargin.fr. La resiliation prend effet a la fin de la periode de facturation mensuelle en cours, c'est-a-dire a la date d'echeance du dernier mois facture. Le Client conserve l'acces aux Services jusqu'a la date effective de resiliation. Aucun remboursement au prorata ne sera effectue pour la periode d'abonnement restant a courir apres la demande de resiliation.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.3</span> La Societe se reserve le droit de suspendre ou de resilier l'Abonnement du Client de plein droit, sans preavis et sans indemnite, dans les cas suivants : (a) non-paiement d'une echeance a sa date d'exigibilite et non-regularisation dans un delai de quinze (15) jours a compter de l'envoi d'une mise en demeure par courrier electronique ; (b) violation par le Client de l'une quelconque des obligations prevues aux presentes CGV, aux Conditions Generales d'Utilisation ou a la Politique de confidentialite ; (c) utilisation frauduleuse ou abusive des Services ; (d) comportement de nature a porter atteinte aux interets de la Societe, a la securite ou a l'integrite de la Plateforme, ou aux droits et interets des autres utilisateurs.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">4.4</span> En cas de resiliation de l'Abonnement, quelle qu'en soit la cause, le Client disposera d'un delai de trente (30) jours a compter de la date effective de resiliation pour exporter ses donnees depuis la Plateforme au moyen des outils d'export mis a sa disposition. Passe ce delai, les donnees du Client seront supprimees de maniere definitive des serveurs de la Societe, sous reserve du respect des obligations legales de conservation applicables, et notamment des obligations comptables et fiscales.
            </p>
          </section>

          {/* Article 5 - Droit de retractation */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Droit de retractation</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.1</span> Conformement aux dispositions des articles L.221-18 et suivants du Code de la consommation, le Client consommateur ou non-professionnel dispose d'un delai de quatorze (14) jours francs a compter de la reception du Kit Hardware pour exercer son droit de retractation, sans avoir a justifier de motifs ni a payer de penalites, a l'exception, le cas echeant, des frais de retour. Pour exercer ce droit, le Client doit notifier sa decision de se retracter du contrat au moyen d'une declaration denude d'ambiguite, adressee par courrier electronique a l'adresse contact@restaumargin.fr ou par courrier postal a l'adresse du siege social de la Societe.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.2</span> Le Client devra retourner le Kit Hardware dans son emballage d'origine, accompagne de tous les accessoires, notices et documents joints, dans un etat neuf et non utilise, dans un delai de quatorze (14) jours a compter de la notification de sa decision de se retracter. Les frais de retour du Kit Hardware sont a la charge du Client. Le Kit Hardware doit etre retourne dans un etat permettant sa remise en vente, c'est-a-dire exempt de toute deterioration qui ne serait pas due a une manipulation necessaire pour etablir la nature, les caracteristiques et le bon fonctionnement du materiel. En cas de depreciation du materiel resultant de manipulations autres que celles necessaires pour etablir la nature, les caracteristiques et le bon fonctionnement du materiel, la Societe se reserve le droit de deduire du remboursement le montant correspondant a la depreciation constatee.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.3</span> En cas d'exercice du droit de retractation dans les conditions et delais prevus au present article, la Societe remboursera au Client la totalite des sommes versees pour l'achat du Kit Hardware, a l'exclusion des frais de retour, dans un delai de quatorze (14) jours a compter de la date a laquelle la Societe est informee de la decision du Client de se retracter. Toutefois, la Societe pourra differer le remboursement jusqu'a la reception effective du Kit Hardware retourne ou jusqu'a ce que le Client ait fourni une preuve de l'expedition du materiel, la date retenue etant celle du premier de ces faits. Le remboursement sera effectue en utilisant le meme moyen de paiement que celui utilise par le Client pour la transaction initiale, sauf accord express du Client pour un autre moyen de remboursement.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">5.4</span> Concernant l'Abonnement SaaS, conformement a l'article L.221-28 du Code de la consommation, le droit de retractation ne peut etre exerce pour les contrats de fourniture d'un contenu numerique non fourni sur un support materiel dont l'execution a commence apres accord prealable express du consommateur et renoncement express a son droit de retractation. Lors de la souscription a l'Abonnement, le Client accepte expressement que l'execution du Service commence immediatement et reconnait renoncer a son droit de retractation a compter de l'acces effectif a la Plateforme.
            </p>
          </section>

          {/* Article 6 - Livraison */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Livraison du Kit Hardware</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.1</span> Le Kit Hardware est livre a l'adresse de livraison indiquee par le Client lors de la passation de sa commande. Le delai de livraison indicatif est de cinq (5) a dix (10) jours ouvrables a compter de la confirmation de la commande et de la validation du paiement. Les delais de livraison sont communiques a titre indicatif et ne constituent pas un engagement ferme de la Societe. En cas de depassement du delai de livraison de plus de trente (30) jours, le Client pourra annuler sa commande par courrier electronique et obtenir le remboursement integral des sommes versees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.2</span> Le transfert de propriete du Kit Hardware s'effectue au moment de la livraison effective du materiel au Client ou a son mandataire. Le transfert des risques (perte, vol, deterioration) s'effectue au moment de la remise du Kit Hardware au transporteur. En cas de constat de dommages ou de manquants lors de la reception du Kit Hardware, le Client doit formuler des reserves aupres du transporteur sur le bon de livraison et en informer la Societe par courrier electronique dans un delai de quarante-huit (48) heures suivant la livraison.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">6.3</span> Les frais de livraison sont inclus dans le prix du Kit Hardware pour les livraisons en France metropolitaine. Pour les livraisons hors France metropolitaine, les frais de livraison supplementaires seront communiques au Client avant la validation definitive de la commande. Les eventuels droits de douane, taxes d'importation et autres frais lies a l'importation du Kit Hardware dans le pays de destination sont a la charge exclusive du Client.
            </p>
          </section>

          {/* Article 7 - Garantie */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Garanties du Kit Hardware</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.1</span> Le Kit Hardware beneficie de la garantie legale de conformite prevue par les articles L.217-4 et suivants du Code de la consommation, pour une duree de deux (2) ans a compter de la date de livraison du materiel. En vertu de cette garantie, le Client peut demander la reparation ou le remplacement du materiel non conforme, sans frais. Si la reparation et le remplacement sont impossibles, le Client peut obtenir une reduction du prix ou la resolution du contrat dans les conditions prevues par la loi.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.2</span> Le Kit Hardware beneficie egalement de la garantie legale des vices caches prevue par les articles 1641 et suivants du Code civil. En vertu de cette garantie, le Client peut, dans un delai de deux (2) ans a compter de la decouverte du vice, choisir entre la resolution de la vente ou une reduction du prix de vente, conformement a l'article 1644 du Code civil.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">7.3</span> Les garanties legales ne couvrent pas les dommages resultant d'une utilisation non conforme a la destination du materiel, d'une mauvaise utilisation, d'une negligence, d'une chute, d'un choc, d'un contact avec des liquides (sauf si le materiel est certifie etanche), de l'usure normale, d'une surtension electrique, d'une intervention ou d'une modification non autorisee par la Societe, ou de toute cause exterieure au materiel. Pour faire jouer les garanties, le Client doit contacter la Societe par courrier electronique a l'adresse contact@restaumargin.fr en decrivant le defaut constate et en fournissant la preuve d'achat.
            </p>
          </section>

          {/* Article 8 - Responsabilites */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Responsabilites</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.1 Obligations du Prestataire.</span> La Societe s'engage, dans le cadre d'une obligation de moyens, a fournir au Client un acces continu et securise a la Plateforme, a assurer la maintenance corrective et evolutive de la Plateforme, a proceder aux sauvegardes regulieres des donnees du Client, a notifier le Client de toute maintenance programmee susceptible d'entrainer une interruption du Service, a corriger les bugs et dysfonctionnements dans un delai raisonnable, et a fournir un support technique au Client dans les conditions definies dans la documentation d'aide disponible sur la Plateforme. La Societe s'engage a mettre en oeuvre les mesures techniques et organisationnelles appropriees pour assurer la securite et la confidentialite des donnees du Client.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.2 Obligations du Client.</span> Le Client s'engage a : (a) utiliser les Services conformement a leur destination et aux presentes CGV ; (b) maintenir la confidentialite de ses identifiants de connexion et en assumer l'entiere responsabilite ; (c) ne pas tenter de contourner, desactiver ou compromettre les mesures de securite de la Plateforme ; (d) s'acquitter des paiements dans les delais prevus ; (e) fournir des informations exactes et a jour lors de son inscription et de l'utilisation des Services ; (f) ne pas utiliser les Services a des fins illicites, frauduleuses ou contraires aux presentes CGV.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.3 Limitation de responsabilite.</span> La responsabilite de la Societe est limitee aux dommages directs et previsibles causes par un manquement avere de la Societe a ses obligations contractuelles. En aucun cas la Societe ne pourra etre tenue responsable des dommages indirects, imprevisibles, accessoires ou consequents, incluant sans s'y limiter la perte de chiffre d'affaires, la perte de benefices, la perte de clientele, la perte d'exploitation, la perte de donnees, le manque a gagner, l'atteinte a la reputation, ou tout autre prejudice commercial ou financier, quand bien meme la Societe aurait ete informee de la possibilite de tels dommages. En tout etat de cause, la responsabilite totale et cumulee de la Societe au titre des presentes CGV, toutes causes confondues, ne pourra exceder le montant total des sommes effectivement versees par le Client a la Societe au cours des douze (12) derniers mois precedant l'evenement donnant lieu a responsabilite.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">8.4</span> L'utilisateur est seul responsable de l'exactitude des donnees qu'il saisit sur la Plateforme et des decisions commerciales, financieres, comptables ou de gestion qu'il prend sur la base des informations et des analyses fournies par la Plateforme. La Societe ne saurait en aucun cas etre tenue responsable des consequences de decisions prises par le Client sur la base des informations fournies par les Services.
            </p>
          </section>

          {/* Article 9 - Propriete intellectuelle */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Propriete intellectuelle</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.1</span> La Societe est et reste titulaire de l'ensemble des droits de propriete intellectuelle sur la Plateforme, son code source, son code objet, son architecture, ses algorithmes, ses interfaces, ses bases de donnees, sa charte graphique, son design, ses contenus, ses fonctionnalites, ses marques, ses logos et tout autre element protegeable par le droit de la propriete intellectuelle. Aucune disposition des presentes CGV ne saurait etre interpretee comme conferant au Client un quelconque droit de propriete intellectuelle sur les elements precites.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.2</span> L'Abonnement confere au Client un droit d'utilisation personnel, non exclusif, non cessible, non transferable et revocable de la Plateforme et des Services, pour la duree de l'Abonnement et dans les limites des presentes CGV et des Conditions Generales d'Utilisation. Ce droit d'utilisation est strictement limite a l'usage professionnel du Client dans le cadre de son activite de restauration.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">9.3</span> Le Client conserve la pleine et entiere propriete de toutes les donnees qu'il saisit sur la Plateforme dans le cadre de l'utilisation des Services, incluant sans s'y limiter les ingredients, les recettes, les fiches techniques, les menus, les inventaires, les commandes, les donnees comptables, les donnees de pesees et toute autre information metier. La Societe ne revendique aucun droit de propriete intellectuelle sur les donnees du Client et s'engage a ne pas utiliser les donnees du Client a des fins autres que la fourniture des Services, sauf autorisation expresse du Client.
            </p>
          </section>

          {/* Article 10 - Donnees personnelles */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Protection des donnees personnelles</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.1</span> Les traitements de donnees personnelles effectues dans le cadre de l'execution des presentes CGV sont realises conformement au Reglement (UE) 2016/679 du 27 avril 2016 (RGPD), a la loi n° 78-17 du 6 janvier 1978 modifiee relative a l'informatique, aux fichiers et aux libertes, et a toute autre reglementation applicable en matiere de protection des donnees a caractere personnel. Pour plus de details sur la collecte, le traitement et la protection des donnees personnelles, le Client est invite a consulter la{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialite
              </a> accessible sur le Site.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">10.2</span> Dans le cadre de la fourniture des Services, la Societe agit en qualite de sous-traitant au sens de l'article 28 du RGPD pour le traitement des donnees metier saisies par le Client sur la Plateforme. A ce titre, la Societe s'engage a traiter les donnees du Client uniquement sur instruction documentee du Client, a assurer la confidentialite des donnees traitees, a mettre en oeuvre les mesures techniques et organisationnelles appropriees pour garantir un niveau de securite adapte au risque, et a assister le Client dans le respect de ses propres obligations au titre du RGPD.
            </p>
          </section>

          {/* Article 11 - Force majeure */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Force majeure</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">11.1</span> Aucune des parties ne pourra etre tenue responsable de l'inexecution ou du retard dans l'execution de l'une quelconque de ses obligations prevues aux presentes CGV, lorsque cette inexecution ou ce retard est cause par un cas de force majeure au sens de l'article 1218 du Code civil, c'est-a-dire un evenement echappant au controle de la partie qui le subit, qui ne pouvait etre raisonnablement prevu lors de la conclusion du contrat et dont les effets ne peuvent etre evites par des mesures appropriees.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">11.2</span> Sont consideres comme des cas de force majeure, sans que cette liste soit limitative : les catastrophes naturelles (tremblements de terre, inondations, tempetes, ouragans), les epidemies et pandemies, les actes de terrorisme, les guerres, les insurrections, les emeutes, les greves generales, les pannes generalises de reseaux de telecommunications ou d'electricite, les cyberattaques d'ampleur exceptionnelle, les decisions gouvernementales ou administratives imposant des restrictions d'activite, ou tout autre evenement presentant les caracteristiques de la force majeure au sens de la jurisprudence francaise.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">11.3</span> La partie invoquant un cas de force majeure doit en informer l'autre partie dans les meilleurs delais par tout moyen ecrit. Les obligations des parties seront suspendues pendant toute la duree de l'evenement de force majeure. Si l'evenement de force majeure se prolonge au-dela d'une duree de quatre-vingt-dix (90) jours consecutifs, chacune des parties pourra resilier le contrat de plein droit, sans indemnite, par notification ecrite a l'autre partie.
            </p>
          </section>

          {/* Article 12 - Droit applicable et litiges */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 12 — Droit applicable et litiges</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">12.1</span> Les presentes CGV sont regies, interpretees et appliquees conformement au droit francais, a l'exclusion de toute autre legislation et de toute convention internationale, et notamment de la Convention des Nations Unies sur les contrats de vente internationale de marchandises (Convention de Vienne du 11 avril 1980).
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">12.2</span> En cas de litige relatif a l'interpretation, la validite, l'execution ou l'inexecution des presentes CGV, les parties s'engagent a rechercher prealablement une solution amiable dans un delai de trente (30) jours a compter de la notification du differend par l'une des parties a l'autre par courrier electronique ou courrier recommande avec accuse de reception. En cas d'echec de la tentative de resolution amiable, le Client consommateur ou non-professionnel est informe qu'il peut recourir a un mediateur de la consommation dans les conditions prevues aux articles L.611-1 et suivants du Code de la consommation.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">12.3</span> A defaut de resolution amiable ou de mediation dans les delais prevus, tout litige sera soumis a la competence exclusive des tribunaux competents de Marseille, France, et ce meme en cas de pluralite de defendeurs, d'appel en garantie, de demande incidente ou reconventionnelle, ou de procedure d'urgence ou conservatoire, en refere ou par requete. Cette clause d'attribution de competence s'applique sous reserve des dispositions d'ordre public applicables au profit des consommateurs au sens du Code de la consommation.
            </p>
          </section>

          {/* Article 13 - Dispositions generales */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 13 — Dispositions generales</h2>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.1 Integralite.</span> Les presentes CGV, ensemble avec les Conditions Generales d'Utilisation, la Politique de confidentialite et toute condition particuliere acceptee par le Client, constituent l'integralite de l'accord entre les parties et remplacent tout accord, declaration, garantie ou engagement anterieur, oral ou ecrit, relatif a son objet.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.2 Divisibilite.</span> Si l'une des clauses des presentes CGV venait a etre declaree nulle, invalide ou inapplicable par une juridiction competente, cette nullite, invalidite ou inapplicabilite n'affecterait pas la validite et l'applicabilite des autres clauses, qui conserveront leur plein effet.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.3 Tolerance.</span> Le fait pour l'une des parties de ne pas se prevaloir d'un manquement par l'autre partie a l'une quelconque des obligations visees dans les presentes CGV ne saurait etre interprete comme une renonciation a l'obligation en cause ni comme une renonciation a se prevaloir ulterieurement de ce manquement ou de tout autre manquement.
            </p>
            <p className="text-slate-300">
              <span className="font-medium text-white">13.4 Cession.</span> Le Client ne pourra ceder tout ou partie de ses droits et obligations au titre des presentes CGV a un tiers, sans l'accord prealable et ecrit de la Societe. La Societe pourra librement ceder ou transferer tout ou partie de ses droits et obligations au titre des presentes CGV a toute societe de son groupe ou a tout tiers repreneur dans le cadre d'une operation de restructuration, de fusion, d'acquisition ou de cession d'actifs.
            </p>
          </section>

          {/* Article 14 - Contact */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 14 — Contact</h2>
            <p className="text-slate-300">
              Pour toute question, reclamation ou demande relative aux presentes Conditions Generales de Vente, aux Services, aux Produits ou a tout autre aspect de la relation commerciale, le Client peut contacter la Societe aux coordonnees suivantes :
            </p>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-slate-400">Raison sociale :</span> RestauMargin SAS</p>
              <p><span className="text-slate-400">Siege social :</span> Marseille, France</p>
              <p><span className="text-slate-400">Email :</span> <span className="text-teal-400">contact@restaumargin.fr</span></p>
            </div>
            <p className="text-slate-300">
              La Societe s'engage a accuser reception de toute reclamation dans un delai de quarante-huit (48) heures ouvrables et a y apporter une reponse dans un delai maximum de trente (30) jours ouvrables a compter de la reception de la reclamation complete. Toute reclamation relative a un defaut de conformite du Kit Hardware doit etre formulee dans les delais prevus par la garantie legale de conformite visee a l'article 7 des presentes CGV.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions legales</a>
          <a href="/cgu" className="hover:text-teal-400 transition-colors">Conditions generales d'utilisation</a>
          <a href="/politique-confidentialite" className="hover:text-teal-400 transition-colors">Politique de confidentialite</a>
        </div>
      </div>
    </div>
  );
}
