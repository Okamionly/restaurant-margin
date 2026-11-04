import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

export default function CGV() {
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

        <h1 className="text-3xl font-bold mb-2">Conditions Générales de Vente</h1>
        <p className="text-mono-500 mb-10">Dernière mise à jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Préambule</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Les présentes Conditions Générales de Vente (ci-après « les CGV ») constituent le socle unique de la relation commerciale entre les parties. Elles ont pour objet de définir les conditions juridiques et financières dans lesquelles RestauMargin SAS (ci-après « la Société » ou « le Prestataire »), société par actions simplifiée de droit français dont le siège social est situé à Marseille, France, fournit ses services et produits à tout client professionnel ou non-professionnel (ci-après « le Client »). Les CGV s'appliquent à toutes les ventes de services et de produits conclues par la Société et sont accessibles à tout moment sur le site https://restaumargin.com. La Société se réserve le droit de modifier les CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de la commande ou de la souscription du Client.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              Toute souscription à un abonnement, tout achat de produit ou de service auprès de la Société implique l'acceptation sans réserve par le Client des présentes CGV. Le Client reconnaît avoir pris connaissance des CGV préalablement à sa commande et les avoir acceptées expressément en cochant la case prévue à cet effet lors du processus de commande en ligne. En cas de contradiction entre les présentes CGV et tout autre document émanant du Client, les CGV prévalront sauf dérogation expresse et écrite acceptée par la Société.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Définitions</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour l'interprétation et l'application des présentes Conditions Générales de Vente, les termes définis ci-dessous auront la signification suivante, qu'ils soient employés au singulier ou au pluriel :
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.1 « Abonnement »</span> désigne le contrat de souscription à durée indéterminée conclu entre la Société et le Client, donnant accès aux Services de la Plateforme selon les modalités et tarifs en vigueur. L'Abonnement est souscrit pour une durée indéterminée avec facturation mensuelle, sauf stipulation contraire dans une offre commerciale spécifique. L'Abonnement donne accès à l'ensemble des fonctionnalités de la Plateforme selon le plan souscrit par le Client.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.2 « Client »</span> désigne toute personne physique ou morale, agissant à titre professionnel ou non, qui souscrit à un Abonnement ou procède à l'achat d'un Produit ou d'un Service auprès de la Société. Le Client garantit qu'il dispose de la capacité juridique nécessaire pour contracter et s'engager au titre des présentes CGV. Si le Client est une personne morale, la personne physique qui procède à la souscription ou à l'achat déclare et garantit qu'elle dispose des pouvoirs nécessaires pour engager ladite personne morale.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.3 « Plateforme »</span> désigne la plateforme logicielle en mode SaaS (Software as a Service) éditée et exploitée par la Société, accessible via internet à l'adresse https://restaumargin.com, incluant l'ensemble des fonctionnalités, outils, modules, interfaces et services associés, qui permet aux professionnels de la restauration de gérer leurs marges, leurs coûts, leurs ingrédients, leurs recettes, leurs menus, leurs inventaires, leurs commandes, leur comptabilité et d'accéder aux outils d'intelligence artificielle, de menu engineering, de mercuriale des prix et de scan de factures.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.4 « Kit Hardware »</span> désigne l'ensemble matériel comprenant une tablette preconfigured et une balance connectée, destiné à la pesée et au contrôle des portions en cuisine, commercialisé par la Société en complément de l'Abonnement à la Plateforme. Le Kit Hardware est livré préconfiguré avec l'application RestauMargin installée et les paramètres de connexion configurés pour le compte du Client.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.5 « Services »</span> désigne l'ensemble des prestations de services fournies par la Société au Client dans le cadre de l'Abonnement, incluant l'accès à la Plateforme, le support technique, la maintenance, les mises à jour, les nouvelles fonctionnalités, ainsi que tout service complémentaire qui pourrait être proposé par la Société.
            </p>
          </section>

          {/* Article 2 - Objet */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Objet</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.1</span> Les présentes CGV ont pour objet de définir les droits et obligations respectifs des parties dans le cadre de la vente des Services et des Produits proposés par la Société au Client, qu'il s'agisse de la souscription à un Abonnement à la Plateforme, de l'achat d'un Kit Hardware, ou de tout autre produit ou service commercialisé par la Société. Les présentes CGV régissent l'ensemble des étapes nécessaires à la passation de la commande, depuis la souscription jusqu'à la facturation, la livraison et le service après-vente.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.2</span> La Société propose les services et produits suivants :
            </p>
            <ul className="list-disc list-inside text-mono-350 dark:text-mono-800 space-y-2 ml-2">
              <li>
                <span className="font-medium text-mono-100 dark:text-white">Abonnement SaaS</span> : accès à la plateforme de gestion de marge pour la restauration, incluant la gestion des ingrédients, les fiches techniques, les menus, les inventaires, les commandes, la comptabilité, les outils d'intelligence artificielle, le menu engineering, la mercuriale des prix, le scanner de factures, le suivi HACCP et la traçabilité, ainsi que l'ensemble des fonctionnalités disponibles sur la Plateforme.
              </li>
              <li>
                <span className="font-medium text-mono-100 dark:text-white">Kit Hardware</span> : un ensemble matériel comprenant une tablette preconfigured et une balance connectée, destiné à la pesée et au contrôle des portions en cuisine, livré préconfiguré avec l'application RestauMargin.
              </li>
              <li>
                <span className="font-medium text-mono-100 dark:text-white">Services complémentaires</span> : tout service additionnel qui pourrait être proposé par la Société, incluant sans s'y limiter les services de formation, d'accompagnement à la mise en place, de personnalisation, de développement sur mesure, ou de conseil en gestion de restauration.
              </li>
            </ul>
          </section>

          {/* Article 3 - Prix */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Prix et modalités de paiement</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.1</span> Les prix des Services et des Produits sont indiqués en euros hors taxes (HT) sur le Site. La taxe sur la valeur ajoutée (TVA) applicable sera ajoutée au montant hors taxes selon le taux en vigueur au jour de la facturation. Les prix applicables sont ceux affichés sur le Site au moment de la validation de la commande par le Client. La Société se réserve le droit de modifier ses prix à tout moment, étant entendu que les modifications de prix ne s'appliqueront pas aux commandes déjà validées et aux Abonnements en cours, sauf notification contraire dans les conditions prévues au présent article.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <p className="text-sm text-mono-500 mb-1">Abonnement SaaS (offre unique)</p>
                <p className="text-2xl font-bold text-mono-100 dark:text-white">19 EUR <span className="text-sm font-normal text-mono-500">/ mois</span></p>
                <p className="text-sm text-mono-500 mt-2">Une seule offre, donnant accès à l'ensemble des fonctionnalités des Services, sans engagement. Facturation mensuelle, prélèvement automatique par carte bancaire via prestataire de paiement sécurisé.</p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <p className="text-sm text-mono-500 mb-1">Kit Hardware</p>
                <p className="text-2xl font-bold text-mono-100 dark:text-white">1 200 EUR <span className="text-sm font-normal text-mono-500">HT</span></p>
                <p className="text-sm text-mono-500 mt-2">Paiement unique à la commande. Livraison sous 5 à 10 jours ouvrables en France métropolitaine.</p>
              </div>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.2</span> Le paiement des Services et des Produits s'effectue par carte bancaire via un prestataire de paiement sécurisé et certifié PCI-DSS (Payment Card Industry Data Security Standard). La Société ne stocke en aucun cas les données de carte bancaire du Client. Le paiement de l'Abonnement s'effectue par prélèvement automatique mensuel sur la carte bancaire enregistrée par le Client lors de sa souscription. Le paiement du Kit Hardware s'effectue en une seule fois lors de la validation de la commande. En cas de rejet de paiement, la Société se réserve le droit de suspendre l'accès aux Services jusqu'à régularisation complète du paiement.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.3</span> En cas de modification des prix de l'Abonnement, la Société en informera le Client par courrier électronique au moins trente (30) jours avant la date d'entrée en vigueur des nouveaux tarifs. Le Client disposera d'un délai de trente (30) jours à compter de la réception de la notification pour accepter les nouveaux tarifs ou résilier son Abonnement. À défaut de résiliation dans ce délai, les nouveaux tarifs seront réputés acceptés par le Client et s'appliqueront à compter de la prochaine échéance de facturation.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.4</span> Toute somme non payée à sa date d'exigibilité portera de plein droit et sans mise en demeure préalable des intérêts de retard au taux prévu à l'article L.441-10 du Code de commerce, soit le taux d'intérêt appliqué par la Banque Centrale Européenne (BCE) à son opération de refinancement la plus récente majorée de dix (10) points de pourcentage. En outre, conformément aux dispositions de l'article D.441-5 du Code de commerce, tout retard de paiement entraînera l'exigibilité d'une indemnité forfaitaire pour frais de recouvrement d'un montant de quarante (40) euros, sans préjudice du droit de la Société de demander une indemnisation complémentaire si les frais de recouvrement réellement engagés dépassent ce montant.
            </p>
          </section>

          {/* Article 4 - Duree et resiliation */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Durée et résiliation de l'Abonnement</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.1</span> L'Abonnement est souscrit pour une durée indéterminée, avec facturation mensuelle à compter de la date de souscription. L'Abonnement se renouvelle automatiquement chaque mois, sauf résiliation par l'une ou l'autre des parties dans les conditions prévues au présent article. La première facturation intervient au jour de la souscription et les facturations suivantes interviennent à la même date chaque mois.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.2</span> Le Client peut résilier son Abonnement à tout moment, sans avoir à justifier de motif, directement depuis son espace personnel sur la Plateforme ou en adressant un courrier électronique à l'adresse contact@restaumargin.fr. La résiliation prend effet à la fin de la période de facturation mensuelle en cours, c'est-à-dire à la date d'échéance du dernier mois facturé. Le Client conserve l'accès aux Services jusqu'à la date effective de résiliation. Aucun remboursement au prorata ne sera effectué pour la période d'abonnement restant à courir après la demande de résiliation.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.3</span> La Société se réserve le droit de suspendre ou de résilier l'Abonnement du Client de plein droit, sans préavis et sans indemnité, dans les cas suivants : (a) non-paiement d'une échéance à sa date d'exigibilité et non-régularisation dans un délai de quinze (15) jours à compter de l'envoi d'une mise en demeure par courrier électronique ; (b) violation par le Client de l'une quelconque des obligations prévues aux présentes CGV, aux Conditions Générales d'Utilisation ou à la Politique de confidentialité ; (c) utilisation frauduleuse ou abusive des Services ; (d) comportement de nature à porter atteinte aux intérêts de la Société, à la sécurité ou à l'intégrité de la Plateforme, ou aux droits et intérêts des autres utilisateurs.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.4</span> En cas de résiliation de l'Abonnement, quelle qu'en soit la cause, le Client disposera d'un délai de trente (30) jours à compter de la date effective de résiliation pour exporter ses données depuis la Plateforme au moyen des outils d'export mis à sa disposition. Passé ce délai, les données du Client seront supprimées de manière définitive des serveurs de la Société, sous réserve du respect des obligations légales de conservation applicables, et notamment des obligations comptables et fiscales.
            </p>
          </section>

          {/* Article 5 - Droit de retractation */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Droit de rétractation</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.1</span> Conformément aux dispositions des articles L.221-18 et suivants du Code de la consommation, le Client consommateur ou non-professionnel dispose d'un délai de quatorze (14) jours francs à compter de la réception du Kit Hardware pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités, à l'exception, le cas échéant, des frais de retour. Pour exercer ce droit, le Client doit notifier sa décision de se rétracter du contrat au moyen d'une déclaration dénude d'ambiguïté, adressée par courrier électronique à l'adresse contact@restaumargin.fr ou par courrier postal à l'adresse du siège social de la Société.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.2</span> Le Client devra retourner le Kit Hardware dans son emballage d'origine, accompagné de tous les accessoires, notices et documents joints, dans un état neuf et non utilisé, dans un délai de quatorze (14) jours à compter de la notification de sa décision de se rétracter. Les frais de retour du Kit Hardware sont à la charge du Client. Le Kit Hardware doit être retourné dans un état permettant sa remise en vente, c'est-à-dire exempt de toute détérioration qui ne serait pas due à une manipulation nécessaire pour établir la nature, les caractéristiques et le bon fonctionnement du matériel. En cas de dépréciation du matériel résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et le bon fonctionnement du matériel, la Société se réserve le droit de déduire du remboursement le montant correspondant à la dépréciation constatée.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.3</span> En cas d'exercice du droit de rétractation dans les conditions et délais prévus au présent article, la Société remboursera au Client la totalité des sommes versées pour l'achat du Kit Hardware, à l'exclusion des frais de retour, dans un délai de quatorze (14) jours à compter de la date à laquelle la Société est informée de la décision du Client de se rétracter. Toutefois, la Société pourra différer le remboursement jusqu'à la réception effective du Kit Hardware retourné ou jusqu'à ce que le Client ait fourni une preuve de l'expédition du matériel, la date retenue étant celle du premier de ces faits. Le remboursement sera effectué en utilisant le même moyen de paiement que celui utilisé par le Client pour la transaction initiale, sauf accord express du Client pour un autre moyen de remboursement.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.4</span> Concernant l'Abonnement SaaS, conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture d'un contenu numérique non fourni sur un support matériel dont l'exécution a commencé après accord préalable express du consommateur et renoncement express à son droit de rétractation. Lors de la souscription à l'Abonnement, le Client accepte expressément que l'exécution du Service commence immédiatement et reconnaît renoncer à son droit de rétractation à compter de l'accès effectif à la Plateforme.
            </p>
          </section>

          {/* Article 6 - Livraison */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Livraison du Kit Hardware</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.1</span> Le Kit Hardware est livré à l'adresse de livraison indiquée par le Client lors de la passation de sa commande. Le délai de livraison indicatif est de cinq (5) à dix (10) jours ouvrables à compter de la confirmation de la commande et de la validation du paiement. Les délais de livraison sont communiqués à titre indicatif et ne constituent pas un engagement ferme de la Société. En cas de dépassement du délai de livraison de plus de trente (30) jours, le Client pourra annuler sa commande par courrier électronique et obtenir le remboursement intégral des sommes versées.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.2</span> Le transfert de propriété du Kit Hardware s'effectue au moment de la livraison effective du matériel au Client ou à son mandataire. Le transfert des risques (perte, vol, détérioration) s'effectue au moment de la remise du Kit Hardware au transporteur. En cas de constat de dommages ou de manquants lors de la réception du Kit Hardware, le Client doit formuler des réserves auprès du transporteur sur le bon de livraison et en informer la Société par courrier électronique dans un délai de quarante-huit (48) heures suivant la livraison.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.3</span> Les frais de livraison sont inclus dans le prix du Kit Hardware pour les livraisons en France métropolitaine. Pour les livraisons hors France métropolitaine, les frais de livraison supplémentaires seront communiqués au Client avant la validation définitive de la commande. Les éventuels droits de douane, taxes d'importation et autres frais liés à l'importation du Kit Hardware dans le pays de destination sont à la charge exclusive du Client.
            </p>
          </section>

          {/* Article 7 - Garantie */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Garanties du Kit Hardware</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.1</span> Le Kit Hardware bénéficie de la garantie légale de conformité prévue par les articles L.217-4 et suivants du Code de la consommation, pour une durée de deux (2) ans à compter de la date de livraison du matériel. En vertu de cette garantie, le Client peut demander la réparation ou le remplacement du matériel non conforme, sans frais. Si la réparation et le remplacement sont impossibles, le Client peut obtenir une réduction du prix ou la résolution du contrat dans les conditions prévues par la loi.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.2</span> Le Kit Hardware bénéficie également de la garantie légale des vices cachés prévue par les articles 1641 et suivants du Code civil. En vertu de cette garantie, le Client peut, dans un délai de deux (2) ans à compter de la découverte du vice, choisir entre la résolution de la vente ou une réduction du prix de vente, conformément à l'article 1644 du Code civil.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.3</span> Les garanties légales ne couvrent pas les dommages résultant d'une utilisation non conforme à la destination du matériel, d'une mauvaise utilisation, d'une négligence, d'une chute, d'un choc, d'un contact avec des liquides (sauf si le matériel est certifié étanche), de l'usure normale, d'une surtension électrique, d'une intervention ou d'une modification non autorisée par la Société, ou de toute cause extérieure au matériel. Pour faire jouer les garanties, le Client doit contacter la Société par courrier électronique à l'adresse contact@restaumargin.fr en décrivant le défaut constaté et en fournissant la preuve d'achat.
            </p>
          </section>

          {/* Article 8 - Responsabilites */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Responsabilités</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.1 Obligations du Prestataire.</span> La Société s'engage, dans le cadre d'une obligation de moyens, à fournir au Client un accès continu et sécurisé à la Plateforme, à assurer la maintenance corrective et évolutive de la Plateforme, à procéder aux sauvegardes régulières des données du Client, à notifier le Client de toute maintenance programmée susceptible d'entraîner une interruption du Service, à corriger les bugs et dysfonctionnements dans un délai raisonnable, et à fournir un support technique au Client dans les conditions définies dans la documentation d'aide disponible sur la Plateforme. La Société s'engage à mettre en oeuvre les mesures techniques et organisationnelles appropriées pour assurer la sécurité et la confidentialité des données du Client.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.2 Obligations du Client.</span> Le Client s'engage à : (a) utiliser les Services conformément à leur destination et aux présentes CGV ; (b) maintenir la confidentialité de ses identifiants de connexion et en assumer l'entière responsabilité ; (c) ne pas tenter de contourner, désactiver ou compromettre les mesures de sécurité de la Plateforme ; (d) s'acquitter des paiements dans les délais prévus ; (e) fournir des informations exactes et à jour lors de son inscription et de l'utilisation des Services ; (f) ne pas utiliser les Services à des fins illicites, frauduleuses ou contraires aux présentes CGV.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.3 Limitation de responsabilité.</span> La responsabilité de la Société est limitée aux dommages directs et prévisibles causés par un manquement avéré de la Société à ses obligations contractuelles. En aucun cas la Société ne pourra être tenue responsable des dommages indirects, imprévisibles, accessoires ou conséquents, incluant sans s'y limiter la perte de chiffre d'affaires, la perte de bénéfices, la perte de clientèle, la perte d'exploitation, la perte de données, le manque à gagner, l'atteinte à la réputation, ou tout autre préjudice commercial ou financier, quand bien même la Société aurait été informée de la possibilité de tels dommages. En tout état de cause, la responsabilité totale et cumulée de la Société au titre des présentes CGV, toutes causes confondues, ne pourra excéder le montant total des sommes effectivement versées par le Client à la Société au cours des douze (12) derniers mois précédant l'événement donnant lieu à responsabilité.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.4</span> L'utilisateur est seul responsable de l'exactitude des données qu'il saisit sur la Plateforme et des décisions commerciales, financières, comptables ou de gestion qu'il prend sur la base des informations et des analyses fournies par la Plateforme. La Société ne saurait en aucun cas être tenue responsable des conséquences de décisions prises par le Client sur la base des informations fournies par les Services.
            </p>
          </section>

          {/* Article 9 - Propriete intellectuelle */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Propriété intellectuelle</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.1</span> La Société est et reste titulaire de l'ensemble des droits de propriété intellectuelle sur la Plateforme, son code source, son code objet, son architecture, ses algorithmes, ses interfaces, ses bases de données, sa charte graphique, son design, ses contenus, ses fonctionnalités, ses marques, ses logos et tout autre élément protégeable par le droit de la propriété intellectuelle. Aucune disposition des présentes CGV ne saurait être interprétée comme conférant au Client un quelconque droit de propriété intellectuelle sur les éléments précités.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.2</span> L'Abonnement confère au Client un droit d'utilisation personnel, non exclusif, non cessible, non transférable et révocable de la Plateforme et des Services, pour la durée de l'Abonnement et dans les limites des présentes CGV et des Conditions Générales d'Utilisation. Ce droit d'utilisation est strictement limité à l'usage professionnel du Client dans le cadre de son activité de restauration.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.3</span> Le Client conserve la pleine et entière propriété de toutes les données qu'il saisit sur la Plateforme dans le cadre de l'utilisation des Services, incluant sans s'y limiter les ingrédients, les recettes, les fiches techniques, les menus, les inventaires, les commandes, les données comptables, les données de pesées et toute autre information métier. La Société ne revendique aucun droit de propriété intellectuelle sur les données du Client et s'engage à ne pas utiliser les données du Client à des fins autres que la fourniture des Services, sauf autorisation expresse du Client.
            </p>
          </section>

          {/* Article 10 - Donnees personnelles */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Protection des données personnelles</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.1</span> Les traitements de données personnelles effectués dans le cadre de l'exécution des présentes CGV sont réalisés conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD), à la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés, et à toute autre réglementation applicable en matière de protection des données à caractère personnel. Pour plus de détails sur la collecte, le traitement et la protection des données personnelles, le Client est invité à consulter la{' '}
              <a href="/politique-confidentialite" className="text-teal-400 hover:text-teal-300 underline">
                Politique de confidentialité
              </a> accessible sur le Site.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.2</span> Dans le cadre de la fourniture des Services, la Société agit en qualité de sous-traitant au sens de l'article 28 du RGPD pour le traitement des données métier saisies par le Client sur la Plateforme. À ce titre, la Société s'engage à traiter les données du Client uniquement sur instruction documentée du Client, à assurer la confidentialité des données traitées, à mettre en oeuvre les mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté au risque, et à assister le Client dans le respect de ses propres obligations au titre du RGPD.
            </p>
          </section>

          {/* Article 11 - Force majeure */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Force majeure</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">11.1</span> Aucune des parties ne pourra être tenue responsable de l'inexécution ou du retard dans l'exécution de l'une quelconque de ses obligations prévues aux présentes CGV, lorsque cette inexécution ou ce retard est causé par un cas de force majeure au sens de l'article 1218 du Code civil, c'est-à-dire un événement échappant au contrôle de la partie qui le subit, qui ne pouvait être raisonnablement prévu lors de la conclusion du contrat et dont les effets ne peuvent être évités par des mesures appropriées.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">11.2</span> Sont considérés comme des cas de force majeure, sans que cette liste soit limitative : les catastrophes naturelles (tremblements de terre, inondations, tempêtes, ouragans), les épidémies et pandémies, les actes de terrorisme, les guerres, les insurrections, les émeutes, les grèves générales, les pannes généralises de réseaux de télécommunications ou d'électricité, les cyberattaques d'ampleur exceptionnelle, les décisions gouvernementales ou administratives imposant des restrictions d'activité, ou tout autre événement présentant les caractéristiques de la force majeure au sens de la jurisprudence française.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">11.3</span> La partie invoquant un cas de force majeure doit en informer l'autre partie dans les meilleurs délais par tout moyen écrit. Les obligations des parties seront suspendues pendant toute la durée de l'événement de force majeure. Si l'événement de force majeure se prolonge au-delà d'une durée de quatre-vingt-dix (90) jours consécutifs, chacune des parties pourra résilier le contrat de plein droit, sans indemnité, par notification écrite à l'autre partie.
            </p>
          </section>

          {/* Article 12 - Droit applicable et litiges */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 12 — Droit applicable et litiges</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.1</span> Les présentes CGV sont régies, interprétées et appliquées conformément au droit français, à l'exclusion de toute autre législation et de toute convention internationale, et notamment de la Convention des Nations Unies sur les contrats de vente internationale de marchandises (Convention de Vienne du 11 avril 1980).
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.2</span> En cas de litige relatif à l'interprétation, la validité, l'exécution ou l'inexécution des présentes CGV, les parties s'engagent à rechercher préalablement une solution amiable dans un délai de trente (30) jours à compter de la notification du différend par l'une des parties à l'autre par courrier électronique ou courrier recommandé avec accusé de réception. En cas d'échec de la tentative de résolution amiable, le Client consommateur ou non-professionnel est informé qu'il peut recourir à un médiateur de la consommation dans les conditions prévues aux articles L.611-1 et suivants du Code de la consommation.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.3</span> À défaut de résolution amiable ou de médiation dans les délais prévus, tout litige sera soumis à la compétence exclusive des tribunaux compétents de Marseille, France, et ce même en cas de pluralité de défendeurs, d'appel en garantie, de demande incidente ou reconventionnelle, ou de procédure d'urgence ou conservatoire, en référé ou par requête. Cette clause d'attribution de compétence s'applique sous réserve des dispositions d'ordre public applicables au profit des consommateurs au sens du Code de la consommation.
            </p>
          </section>

          {/* Article 13 - Dispositions generales */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 13 — Dispositions générales</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.1 Intégralité.</span> Les présentes CGV, ensemble avec les Conditions Générales d'Utilisation, la Politique de confidentialité et toute condition particulière acceptée par le Client, constituent l'intégralité de l'accord entre les parties et remplacent tout accord, déclaration, garantie ou engagement antérieur, oral ou écrit, relatif à son objet.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.2 Divisibilité.</span> Si l'une des clauses des présentes CGV venait à être déclarée nulle, invalide ou inapplicable par une juridiction compétente, cette nullité, invalidité ou inapplicabilité n'affecterait pas la validité et l'applicabilité des autres clauses, qui conserveront leur plein effet.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.3 Tolérance.</span> Le fait pour l'une des parties de ne pas se prévaloir d'un manquement par l'autre partie à l'une quelconque des obligations visées dans les présentes CGV ne saurait être interprété comme une renonciation à l'obligation en cause ni comme une renonciation à se prévaloir ultérieurement de ce manquement ou de tout autre manquement.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.4 Cession.</span> Le Client ne pourra céder tout ou partie de ses droits et obligations au titre des présentes CGV à un tiers, sans l'accord préalable et écrit de la Société. La Société pourra librement céder ou transférer tout ou partie de ses droits et obligations au titre des présentes CGV à toute société de son groupe ou à tout tiers repreneur dans le cadre d'une opération de restructuration, de fusion, d'acquisition ou de cession d'actifs.
            </p>
          </section>

          {/* Article 14 - Contact */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 14 — Contact</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour toute question, réclamation ou demande relative aux présentes Conditions Générales de Vente, aux Services, aux Produits ou à tout autre aspect de la relation commerciale, le Client peut contacter la Société aux coordonnées suivantes :
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Raison sociale :</span> RestauMargin SAS</p>
              <p><span className="text-mono-500">Siège social :</span> Marseille, France</p>
              <p><span className="text-mono-500">Email :</span> <span className="text-teal-400">contact@restaumargin.fr</span></p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              La Société s'engage à accuser réception de toute réclamation dans un délai de quarante-huit (48) heures ouvrables et à y apporter une réponse dans un délai maximum de trente (30) jours ouvrables à compter de la réception de la réclamation complète. Toute réclamation relative à un défaut de conformité du Kit Hardware doit être formulée dans les délais prévus par la garantie légale de conformité visée à l'article 7 des présentes CGV.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-mono-900 dark:border-mono-200 flex flex-wrap gap-6 text-sm text-mono-500">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions légales</a>
          <a href="/cgu" className="hover:text-teal-400 transition-colors">Conditions générales d'utilisation</a>
          <a href="/politique-confidentialite" className="hover:text-teal-400 transition-colors">Politique de confidentialité</a>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
