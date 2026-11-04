import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

export default function PolitiqueConfidentialite() {
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

        <h1 className="text-3xl font-bold mb-2">Politique de Confidentialité</h1>
        <p className="text-mono-500 mb-10">Dernière mise à jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Préambule</h2>
            <p className="text-mono-350 dark:text-mono-800">
              La présente Politique de confidentialité (ci-après « la Politique ») a pour objet d'informer les utilisateurs du site internet https://restaumargin.com (ci-après « le Site » ou « la Plateforme ») et des services associés sur les modalités de collecte, de traitement, de stockage, de conservation et de protection de leurs données à caractère personnel par RestauMargin SAS (ci-après « la Société »), société par actions simplifiée de droit français dont le siège social est situé à Marseille, France.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              La Société s'engage à respecter la vie privée et les droits fondamentaux des personnes dont elle traite les données personnelles, conformément aux dispositions du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données (ci-après « le RGPD »), de la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés (ci-après « la Loi Informatique et Libertés »), des recommandations et lignes directrices de la Commission Nationale de l'Informatique et des Libertés (CNIL), et de toute autre réglementation nationale ou européenne applicable en matière de protection des données à caractère personnel.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              La présente Politique fait partie intégrante des Conditions Générales d'Utilisation (CGU) et des Mentions légales du Site. En accédant au Site, en créant un compte ou en utilisant les services proposés par la Société, l'utilisateur reconnaît avoir pris connaissance de la présente Politique et en accepter les termes. La Société se réserve le droit de modifier la présente Politique à tout moment afin de la mettre en conformité avec les évolutions législatives, réglementaires, jurisprudentielles ou technologiques. En cas de modification substantielle, les utilisateurs seront informés par courrier électronique et/ou par notification sur la Plateforme, et la date de dernière mise à jour indiquée en tête du présent document sera actualisée.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Définitions</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour l'interprétation et l'application de la présente Politique de confidentialité, les termes définis ci-dessous auront la signification suivante :
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.1 « Données à caractère personnel » ou « Données personnelles »</span> désigne toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement, notamment par référence à un identifiant tel qu'un nom, un numéro d'identification, des données de localisation, un identifiant en ligne, ou à un ou plusieurs éléments spécifiques propres à l'identité physique, physiologique, génétique, psychique, économique, culturelle ou sociale de cette personne physique, au sens de l'article 4 du RGPD.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.2 « Traitement »</span> désigne toute opération ou tout ensemble d'opérations effectuées ou non à l'aide de procédés automatisés et appliquées à des données à caractère personnel, telles que la collecte, l'enregistrement, l'organisation, la structuration, la conservation, l'adaptation ou la modification, l'extraction, la consultation, l'utilisation, la communication par transmission, la diffusion ou toute autre forme de mise à disposition, le rapprochement ou l'interconnexion, la limitation, l'effacement ou la destruction, au sens de l'article 4 du RGPD.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.3 « Responsable du traitement »</span> désigne la personne physique ou morale, l'autorité publique, le service ou un autre organisme qui, seul ou conjointement avec d'autres, détermine les finalités et les moyens du traitement de données à caractère personnel. Dans le cadre de la présente Politique, le responsable du traitement est RestauMargin SAS.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.4 « Sous-traitant »</span> désigne la personne physique ou morale, l'autorité publique, le service ou un autre organisme qui traite des données à caractère personnel pour le compte du responsable du traitement, conformément aux instructions de ce dernier et dans le cadre d'un contrat de sous-traitance au sens de l'article 28 du RGPD.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.5 « Personne concernée »</span> désigne toute personne physique dont les données à caractère personnel font l'objet d'un traitement par la Société dans le cadre de l'exploitation du Site et de la fourniture des Services.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.6 « Consentement »</span> désigne toute manifestation de volonté, libre, spécifique, éclairée et univoque par laquelle la personne concernée accepte, par une déclaration ou par un acte positif clair, que des données à caractère personnel la concernant fassent l'objet d'un traitement, au sens de l'article 4 du RGPD.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">1.7 « Violation de données à caractère personnel »</span> désigne une violation de la sécurité entraînant, de manière accidentelle ou illicite, la destruction, la perte, l'altération, la divulgation non autorisée de données à caractère personnel transmises, conservées ou traitées d'une autre manière, ou l'accès non autorisé à de telles données, au sens de l'article 4 du RGPD.
            </p>
          </section>

          {/* Article 2 - Responsable du traitement */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Responsable du traitement</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.1</span> Le responsable du traitement des données à caractère personnel collectées et traitées dans le cadre de l'utilisation du Site et des Services est :
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Dénomination sociale :</span> RestauMargin SAS</p>
              <p><span className="text-mono-500">Forme juridique :</span> Société par actions simplifiée (SAS)</p>
              <p><span className="text-mono-500">Siège social :</span> Marseille, France</p>
              <p><span className="text-mono-500">Email de contact :</span> contact@restaumargin.fr</p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.2</span> En sa qualité de responsable du traitement, la Société détermine les finalités et les moyens des traitements de données à caractère personnel mis en oeuvre dans le cadre de l'exploitation du Site et de la fourniture des Services. La Société s'engage à traiter les données personnelles des utilisateurs de manière licite, loyale et transparente, conformément aux principes fondamentaux du RGPD énumérés à l'article 5 du règlement, à savoir : la licite du traitement, la limitation des finalités, la minimisation des données, l'exactitude des données, la limitation de la conservation, l'intégrité et la confidentialité, et la responsabilité.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">2.3</span> Pour toute question relative à la protection de vos données personnelles, pour exercer vos droits ou pour formuler une réclamation, vous pouvez contacter la Société en écrivant à l'adresse électronique contact@restaumargin.fr. La Société s'engage à traiter votre demande dans les meilleurs délais et au plus tard dans un délai de trente (30) jours à compter de la réception de votre demande complète.
            </p>
          </section>

          {/* Article 3 - Donnees collectees */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Catégories de données collectées</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.1</span> Dans le cadre de l'exploitation du Site et de la fourniture des Services, la Société collecte et traite les catégories de données personnelles suivantes :
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-2">3.1.1 Données d'identification et de contact</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Nom de famille, prénom(s), adresse électronique (email), numéro de téléphone fixe et/ou mobile, nom de l'établissement (restaurant, hôtel, boulangerie, etc.), type de cuisine ou d'activité, adresse postale de l'établissement, fonction ou poste occupé au sein de l'établissement. Ces données sont collectées lors de la création du compte utilisateur et sont nécessaires à l'identification de l'utilisateur, à la gestion de son compte et à la communication relative aux Services.
                </p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-2">3.1.2 Données de connexion et données techniques</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Adresse IP (Internet Protocol), type et version du navigateur internet utilisé, système d'exploitation du terminal de l'utilisateur, résolution de l'écran, langue du navigateur, pages consultées sur le Site, date et heure de connexion, durée de la session, URL de provenance (referrer), identifiants de session, journaux d'accès (logs), identifiants de cookies et technologies de traçage similaires. Ces données sont collectées automatiquement lors de la navigation sur le Site et sont nécessaires au bon fonctionnement du Site, à la sécurisation des accès, à la détection et à la prévention des fraudes, et à l'amélioration de l'expérience utilisateur.
                </p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-2">3.1.3 Données métier et données professionnelles</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Ingrédients (noms, prix, unités, rendements, allergènes, informations nutritionnelles), recettes et fiches techniques (compositions, quantités, instructions, coûts de revient), menus et cartes (composition des menus, prix de vente, catégorisation des plats), inventaires (stocks, mouvements de stocks, dates de péremption, lots), commandes fournisseurs (bons de commande, quantités commandées, dates de livraison), données comptables (chiffre d'affaires, charges, marges, ratios financiers), historiques de pesées et données provenant de la balance connectée, factures fournisseurs scannées et données extraites par OCR, données relatives aux fournisseurs (noms, coordonnées, conditions commerciales, historiques de prix), données de conformité HACCP (relevés de températures, fiches de contrôle, actions correctives), et toute autre information métier saisie par l'utilisateur dans le cadre de l'utilisation des Services. Ces données sont saisies volontairement par l'utilisateur et constituent les Données de l'Utilisateur au sens des Conditions Générales d'Utilisation.
                </p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-2">3.1.4 Données de paiement et données de facturation</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Les données relatives aux moyens de paiement (numéros de carte bancaire, dates d'expiration, cryptogrammes visuels) sont collectées et traitées exclusivement par le prestataire de paiement sécurisé et certifié PCI-DSS utilisé par la Société. La Société ne stocke en aucun cas les données bancaires complètes de ses utilisateurs. Seules les quatre derniers chiffres du numéro de carte, le type de carte et la date d'expiration sont conservés par la Société à des fins d'identification du moyen de paiement dans l'interface utilisateur. Les données de facturation (montants, dates de facturation, historique des paiements, factures émises) sont conservées par la Société conformément aux obligations légales comptables et fiscales.
                </p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-2">3.1.5 Données de communication et de support</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Contenus des échanges par courrier électronique, formulaires de contact, demandes de support technique, réclamations, retours d'expérience, avis et commentaires, enquêtes de satisfaction, et toute autre communication entre l'utilisateur et la Société. Ces données sont collectées dans le cadre de la gestion de la relation client et de l'amélioration continue des Services.
                </p>
              </div>
            </div>

            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">3.2</span> La Société s'engage à ne collecter que les données personnelles strictement nécessaires aux finalités du traitement, conformément au principe de minimisation des données prévu à l'article 5.1.c du RGPD. La Société ne collecte aucune donnée personnelle sensible au sens de l'article 9 du RGPD (données révélant l'origine raciale ou ethnique, les opinions politiques, les convictions religieuses ou philosophiques, l'appartenance syndicale, les données génétiques, les données biométriques, les données concernant la santé, ou les données concernant la vie sexuelle ou l'orientation sexuelle), sauf obligation légale ou consentement explicite de la personne concernée.
            </p>
          </section>

          {/* Article 4 - Finalites du traitement */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Finalités et bases légales des traitements</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.1</span> Les données personnelles collectées par la Société sont traitées pour les finalités suivantes, chacune reposant sur une base légale spécifique conformément à l'article 6 du RGPD :
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-mono-900 dark:border-mono-300">
                    <th className="text-left py-3 px-4 text-mono-500 font-medium">Finalité</th>
                    <th className="text-left py-3 px-4 text-mono-500 font-medium">Base légale</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350 dark:text-mono-800">
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Création, gestion et administration du compte utilisateur</td>
                    <td className="py-3 px-4">Exécution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Fourniture, exploitation et amélioration des Services de la Plateforme</td>
                    <td className="py-3 px-4">Exécution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Gestion de la facturation, des paiements et du recouvrement</td>
                    <td className="py-3 px-4">Exécution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Communication relative au service (notifications, mises à jour, support technique, alertes de sécurité)</td>
                    <td className="py-3 px-4">Exécution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Analyse d'usage, statistiques d'utilisation et amélioration de la Plateforme</td>
                    <td className="py-3 px-4">Intérêt légitime (art. 6.1.f RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Mesure d'audience et analyse du trafic via cookies analytiques</td>
                    <td className="py-3 px-4">Consentement (art. 6.1.a RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Sécurisation du Site, prévention des fraudes, détection des intrusions et des anomalies</td>
                    <td className="py-3 px-4">Intérêt légitime (art. 6.1.f RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Gestion de la relation client, support technique et traitement des réclamations</td>
                    <td className="py-3 px-4">Exécution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Envoi de communications commerciales et de prospection (newsletters, offres promotionnelles)</td>
                    <td className="py-3 px-4">Consentement (art. 6.1.a RGPD)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Respect des obligations légales, comptables, fiscales et réglementaires</td>
                    <td className="py-3 px-4">Obligation légale (art. 6.1.c RGPD)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-mono-350 dark:text-mono-800 mt-3">
              <span className="font-medium text-mono-100 dark:text-white">4.2</span> Lorsque le traitement est fondé sur le consentement de la personne concernée, celle-ci dispose du droit de retirer son consentement à tout moment, sans que ce retrait n'affecte la licite du traitement fondé sur le consentement effectué avant le retrait. Le retrait du consentement peut être effectué par les moyens décrits dans la présente Politique ou en contactant la Société à l'adresse contact@restaumargin.fr.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">4.3</span> Lorsque le traitement est fondé sur l'intérêt légitime de la Société, la Société a préalablement procédé à un test de mise en balance entre ses intérêts légitimes et les droits et libertés fondamentaux des personnes concernées, et a conclu que ses intérêts légitimes ne portent pas atteinte de manière disproportionnée aux droits et libertés des personnes concernées. Les personnes concernées disposent du droit de s'opposer à tout moment au traitement de leurs données fondé sur l'intérêt légitime, pour des raisons tenant à leur situation particulière.
            </p>
          </section>

          {/* Article 5 - Duree de conservation */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Durée de conservation des données</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.1</span> Les données personnelles collectées par la Société sont conservées pour une durée n'excédant pas celle nécessaire au regard des finalités pour lesquelles elles sont traitées, conformément au principe de limitation de la conservation prévu à l'article 5.1.e du RGPD. À l'expiration de la durée de conservation applicable, les données personnelles sont supprimées de manière définitive et irréversible des systèmes de la Société, ou anonymisées de sorte qu'elles ne permettent plus d'identifier, directement ou indirectement, la personne concernée.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-mono-900 dark:border-mono-300">
                    <th className="text-left py-3 px-4 text-mono-500 font-medium">Type de données</th>
                    <th className="text-left py-3 px-4 text-mono-500 font-medium">Durée de conservation</th>
                    <th className="text-left py-3 px-4 text-mono-500 font-medium">Fondement</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350 dark:text-mono-800">
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Données de compte (identification, contact)</td>
                    <td className="py-3 px-4">Durée de l'abonnement + 3 ans après la suppression du compte</td>
                    <td className="py-3 px-4">Délai de prescription légale</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Données métier (ingrédients, recettes, menus, inventaires)</td>
                    <td className="py-3 px-4">Durée de l'abonnement + 1 an après la suppression du compte</td>
                    <td className="py-3 px-4">Exécution du contrat + délai raisonnable de restitution</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Données de facturation et de paiement</td>
                    <td className="py-3 px-4">10 ans à compter de la clôture de l'exercice comptable</td>
                    <td className="py-3 px-4">Obligations légales comptables et fiscales (art. L.123-22 Code de commerce)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Données de connexion (logs, adresses IP)</td>
                    <td className="py-3 px-4">1 an à compter de leur collecte</td>
                    <td className="py-3 px-4">Obligation légale (art. 6-II LCEN, décret n° 2011-219)</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Cookies et technologies de traçage</td>
                    <td className="py-3 px-4">13 mois maximum à compter du dépôt</td>
                    <td className="py-3 px-4">Recommandations de la CNIL</td>
                  </tr>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <td className="py-3 px-4">Données de communication et de support</td>
                    <td className="py-3 px-4">3 ans à compter de la clôture du ticket ou de l'échange</td>
                    <td className="py-3 px-4">Gestion de la relation client et délai de prescription</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Données de prospection commerciale</td>
                    <td className="py-3 px-4">3 ans à compter du dernier contact actif</td>
                    <td className="py-3 px-4">Recommandations de la CNIL</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">5.2</span> À l'expiration des durées de conservation en base active, certaines données pourront être archivées en base intermédiaire, accessible uniquement aux personnes habilitées et pour des finalités limitées (gestion des contentieux, respect des obligations légales), avant leur suppression définitive. Les durées d'archivage intermédiaire sont déterminées en fonction des délais de prescription légale applicables et des obligations réglementaires en vigueur.
            </p>
          </section>

          {/* Article 6 - Droits des utilisateurs */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Droits des personnes concernées</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.1</span> Conformément aux dispositions du RGPD et de la Loi Informatique et Libertés, toute personne dont les données à caractère personnel sont traitées par la Société dispose des droits suivants :
            </p>
            <ul className="list-disc list-inside text-mono-350 dark:text-mono-800 space-y-3 ml-2">
              <li><span className="font-medium text-mono-100 dark:text-white">Droit d'accès (article 15 du RGPD) :</span> Le droit d'obtenir de la Société la confirmation que des données à caractère personnel la concernant sont ou ne sont pas traitées et, lorsqu'elles le sont, l'accès auxdites données ainsi que les informations relatives aux finalités du traitement, aux catégories de données traitées, aux destinataires, à la durée de conservation, aux droits de la personne concernée, au droit de déposer une réclamation auprès d'une autorité de contrôle, aux sources des données et à l'existence d'une prise de décision automatisée. La personne concernée a le droit d'obtenir une copie de ses données personnelles faisant l'objet d'un traitement.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit de rectification (article 16 du RGPD) :</span> Le droit d'obtenir de la Société, dans les meilleurs délais, la rectification de données à caractère personnel inexactes la concernant. Compte tenu des finalités du traitement, la personne concernée a le droit d'obtenir que les données à caractère personnel incomplètes soient complétées, y compris en fournissant une déclaration supplémentaire.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit à l'effacement ou « droit à l'oubli » (article 17 du RGPD) :</span> Le droit d'obtenir de la Société l'effacement, dans les meilleurs délais, de données à caractère personnel la concernant, lorsque l'un des motifs prévus par le RGPD s'applique (les données ne sont plus nécessaires au regard des finalités, la personne retire son consentement, la personne exerce son droit d'opposition, les données ont fait l'objet d'un traitement illicite, etc.). Ce droit n'est pas absolu et est soumis aux exceptions prévues par le RGPD, notamment lorsque le traitement est nécessaire pour l'exercice du droit à la liberté d'expression et d'information, pour le respect d'une obligation légale, pour des motifs d'intérêt public dans le domaine de la santé publique, à des fins archivistiques dans l'intérêt public, à des fins de recherche scientifique ou historique ou à des fins statistiques, ou pour la constatation, l'exercice ou la défense de droits en justice.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit à la limitation du traitement (article 18 du RGPD) :</span> Le droit d'obtenir de la Société la limitation du traitement de ses données personnelles lorsque l'une des conditions prévues par le RGPD est remplie (la personne conteste l'exactitude des données, le traitement est illicite et la personne s'oppose à l'effacement, la Société n'a plus besoin des données mais la personne en a besoin pour la défense de ses droits en justice, la personne a exercé son droit d'opposition et la vérification est en cours).</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit à la portabilité des données (article 20 du RGPD) :</span> Le droit de recevoir les données à caractère personnel la concernant qu'elle a fournies à la Société, dans un format structuré, couramment utilisé et lisible par machine, et le droit de transmettre ces données à un autre responsable du traitement sans que la Société y fasse obstacle, lorsque le traitement est fondé sur le consentement ou l'exécution d'un contrat et est effectué à l'aide de procédés automatisés.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit d'opposition (article 21 du RGPD) :</span> Le droit de s'opposer à tout moment, pour des raisons tenant à sa situation particulière, à un traitement de données à caractère personnel la concernant fondé sur l'intérêt légitime de la Société. La Société ne traitera plus les données à caractère personnel, à moins qu'elle ne démontre qu'il existe des motifs légitimes et impérieux pour le traitement qui prévalent sur les intérêts et les droits et libertés de la personne concernée. La personne concernée a le droit de s'opposer à tout moment au traitement de ses données à des fins de prospection commerciale directe, y compris le profilage dans la mesure où il est lié à une telle prospection.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé (article 22 du RGPD) :</span> Le droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé, y compris le profilage, produisant des effets juridiques la concernant ou l'affectant de manière significative de façon similaire.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit de retirer son consentement :</span> Lorsque le traitement est fondé sur le consentement de la personne concernée, celle-ci a le droit de retirer son consentement à tout moment, sans que ce retrait n'affecte la licite du traitement effectué avant le retrait.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Droit de définir des directives relatives au sort de ses données après son décès (article 85 de la Loi Informatique et Libertés) :</span> La personne concernée a le droit de définir des directives relatives à la conservation, à l'effacement et à la communication de ses données à caractère personnel après son décès. Ces directives peuvent être générales ou particulières.</li>
            </ul>
            <p className="text-mono-350 dark:text-mono-800 mt-3">
              <span className="font-medium text-mono-100 dark:text-white">6.2</span> Pour exercer l'un quelconque de ces droits, la personne concernée peut adresser sa demande par courrier électronique à l'adresse <span className="text-teal-400">contact@restaumargin.fr</span>, accompagnée d'un justificatif d'identité en cas de doute raisonnable sur l'identité du demandeur. La Société s'engage à accuser réception de la demande et à y répondre dans un délai maximum de trente (30) jours à compter de la réception de la demande complète. Ce délai peut être prolongé de deux mois supplémentaires en raison de la complexité de la demande ou du nombre de demandes reçues, auquel cas la personne concernée sera informée de cette prolongation et de ses motifs dans le délai initial de trente jours.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">6.3</span> En cas de difficulté en lien avec la gestion de ses données personnelles, la personne concernée dispose du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL), autorité de contrôle française compétente en matière de protection des données à caractère personnel. La CNIL peut être contactée aux coordonnées suivantes : CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — www.cnil.fr.
            </p>
          </section>

          {/* Article 7 - Cookies */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Cookies et technologies de traçage</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.1</span> Le Site utilise des cookies et des technologies de traçage similaires conformément aux dispositions de l'article 82 de la Loi Informatique et Libertés et aux lignes directrices et recommandations de la CNIL en matière de cookies et autres traceurs (délibération n° 2020-091 du 17 septembre 2020). Un cookie est un petit fichier texte déposé sur le terminal de l'utilisateur (ordinateur, tablette, smartphone) par le serveur du Site ou par un serveur tiers, qui permet de stocker des informations relatives à la navigation de l'utilisateur sur le Site.
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-1">7.1.1 Cookies strictement nécessaires (cookies essentiels)</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Ces cookies sont indispensables au bon fonctionnement du Site et à la fourniture des Services demandés par l'utilisateur. Ils permettent notamment la gestion de l'authentification et de la session utilisateur, la conservation des préférences de navigation et de configuration, la sécurisation de la navigation et la prévention des fraudes, le maintien du panier d'achat et le fonctionnement des formulaires. Ces cookies ne nécessitent pas le consentement préalable de l'utilisateur conformément à l'article 82 de la Loi Informatique et Libertés, dans la mesure où ils sont strictement nécessaires à la fourniture d'un service de communication en ligne expressément demandé par l'utilisateur.
                </p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-1">7.1.2 Cookies analytiques et de mesure d'audience</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Ces cookies permettent de recueillir des informations anonymisées et agrégées sur l'utilisation du Site par les visiteurs, telles que le nombre de visiteurs uniques, les pages les plus consultées, la durée moyenne des visites, le taux de rebond, les sources de trafic (moteurs de recherche, réseaux sociaux, accès directs, liens référents), les parcours de navigation et les interactions avec les éléments du Site. Ces informations sont utilisées exclusivement pour améliorer les performances, le contenu et l'ergonomie du Site. Le dépôt de ces cookies est soumis au consentement préalable et éclairé de l'utilisateur, recueilli via le bandeau de cookies affiché lors de la première visite sur le Site.
                </p>
              </div>
              <div className="bg-mono-975 dark:bg-[#171717] rounded-xl p-4 border border-mono-900 dark:border-mono-300">
                <h3 className="font-medium text-mono-100 dark:text-white mb-1">7.1.3 Cookies fonctionnels</h3>
                <p className="text-mono-350 dark:text-mono-800 text-sm">
                  Ces cookies permettent de mémoriser les choix et préférences de l'utilisateur (tels que la langue, la région, la taille d'affichage, les paramètres de personnalisation) afin d'améliorer et de personnaliser son expérience de navigation sur le Site. Le dépôt de ces cookies peut être soumis au consentement de l'utilisateur, sauf lorsqu'ils sont strictement nécessaires à la fourniture du service demandé.
                </p>
              </div>
            </div>

            <p className="text-mono-350 dark:text-mono-800 mt-3">
              <span className="font-medium text-mono-100 dark:text-white">7.2</span> L'utilisateur peut à tout moment modifier ses préférences en matière de cookies, accepter ou refuser tout ou partie des cookies non essentiels, via le mécanisme de gestion des préférences de cookies mis à disposition sur le Site ou via les paramètres de son navigateur internet. La plupart des navigateurs permettent de configurer l'acceptation ou le refus des cookies, de supprimer les cookies existants et de recevoir une notification avant le dépôt d'un cookie. La suppression ou le refus de cookies essentiels peut entraîner des perturbations dans le fonctionnement du Site et limiter l'accès à certaines fonctionnalités.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">7.3</span> La durée de validité du consentement aux cookies est de treize (13) mois à compter de son expression. À l'issue de cette période, le consentement de l'utilisateur sera de nouveau sollicité. Les cookies déposés sur le terminal de l'utilisateur ont une durée de vie maximale de treize (13) mois conformément aux recommandations de la CNIL. Les informations collectées par les cookies sont conservées pour une durée n'excédant pas vingt-cinq (25) mois.
            </p>
          </section>

          {/* Article 8 - Sous-traitants et destinataires */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Destinataires des données et sous-traitants</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.1</span> Dans le cadre de l'exploitation du Site et de la fourniture des Services, la Société fait appel à des prestataires de services tiers (sous-traitants) pour certaines opérations de traitement. Ces sous-traitants agissent exclusivement sur instruction de la Société, dans le cadre de contrats de sous-traitance conformes à l'article 28 du RGPD, et sont soumis à des obligations strictes en matière de protection des données personnelles, de confidentialité et de sécurité.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.2</span> Les catégories de sous-traitants auxquels la Société fait appel sont les suivantes :
            </p>
            <ul className="list-disc list-inside text-mono-350 dark:text-mono-800 space-y-2 ml-2">
              <li><span className="font-medium text-mono-100 dark:text-white">Hébergeur professionnel européen :</span> hébergement des serveurs, des bases de données, des fichiers et des sauvegardes, authentification des utilisateurs, stockage des données. Les données sont hébergées sur des serveurs situés dans l'Union européenne.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Prestataire de paiement sécurisé :</span> traitement des transactions de paiement, gestion des abonnements et des prélèvements récurrents, prévention de la fraude au paiement. Ce prestataire est certifié PCI-DSS (Payment Card Industry Data Security Standard) et ne communique jamais les données bancaires complètes à la Société.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Prestataire d'envoi d'emails transactionnels :</span> envoi des emails de confirmation d'inscription, de réinitialisation de mot de passe, de notifications de service, de factures et de toute autre communication transactionnelle liée au fonctionnement du compte utilisateur.</li>
              <li><span className="font-medium text-mono-100 dark:text-white">Prestataire d'intelligence artificielle :</span> traitement des requêtes d'intelligence artificielle pour les fonctionnalités d'optimisation des coûts, des menus et des approvisionnements, de suggestions de recettes, d'analyse de données et de commande vocale.</li>
            </ul>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">8.3</span> Les données personnelles ne sont en aucun cas vendues, louées ou cédées à des tiers à des fins commerciales ou de marketing. Les données ne sont communiquées à des tiers que dans les cas suivants : (a) exécution d'un contrat de sous-traitance dans les conditions prévues au présent article ; (b) respect d'une obligation légale, réglementaire ou judiciaire ; (c) protection des droits, de la propriété ou de la sécurité de la Société, de ses utilisateurs ou du public ; (d) prévention et détection des fraudes ; (e) consentement préalable et explicite de la personne concernée.
            </p>
          </section>

          {/* Article 9 - Transferts internationaux */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Transferts internationaux de données</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.1</span> La Société s'efforce de conserver les données personnelles de ses utilisateurs au sein de l'Union européenne (UE) et de l'Espace économique européen (EEE). Toutefois, dans le cadre de la fourniture des Services et de la relation avec certains sous-traitants, des transferts de données à caractère personnel vers des pays situés en dehors de l'UE/EEE peuvent être nécessaires, notamment vers les États-Unis.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.2</span> Lorsque des données à caractère personnel sont transférées vers un pays ne bénéficiant pas d'une décision d'adéquation de la Commission européenne, la Société s'assure que des garanties appropriées sont mises en place conformément aux articles 44 à 49 du RGPD, afin d'assurer un niveau de protection des données essentiellement équivalent à celui garanti au sein de l'UE. Ces garanties peuvent inclure : (a) les clauses contractuelles types (CCT) adoptées par la Commission européenne en vertu de l'article 46.2.c du RGPD ; (b) les règles d'entreprise contraignantes (Binding Corporate Rules) approuvées par les autorités de contrôle compétentes ; (c) un cadre de protection des données reconnu par la Commission européenne (tel que le EU-U.S. Data Privacy Framework) ; (d) toute autre garantie prévue par le RGPD et reconnue par les autorités de contrôle compétentes.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">9.3</span> L'utilisateur peut obtenir des informations supplémentaires sur les garanties mises en place pour encadrer les transferts internationaux de données en contactant la Société à l'adresse contact@restaumargin.fr. La Société met à disposition des personnes concernées, sur demande, une copie des clauses contractuelles types ou des autres garanties appropriées mises en place pour encadrer ces transferts.
            </p>
          </section>

          {/* Article 10 - Securite */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Sécurité des données</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.1</span> La Société met en oeuvre des mesures techniques et organisationnelles appropriées pour protéger les données à caractère personnel contre tout accès non autorisé, toute modification, toute divulgation, toute perte accidentelle, toute destruction ou tout dommage, conformément aux exigences de l'article 32 du RGPD. Ces mesures sont proportionnées à la nature, à la portée, au contexte et aux finalités des traitements, ainsi qu'aux risques pour les droits et libertés des personnes physiques.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.2</span> Les mesures de sécurité mises en oeuvre incluent notamment, sans s'y limiter :
            </p>
            <ul className="list-disc list-inside text-mono-350 dark:text-mono-800 space-y-1 ml-2">
              <li>Chiffrement des données en transit au moyen de protocoles sécurisés (HTTPS/TLS 1.2 ou supérieur) pour toutes les communications entre le terminal de l'utilisateur et les serveurs de la Société</li>
              <li>Chiffrement des données au repos (at-rest encryption) sur les serveurs de stockage et les bases de données</li>
              <li>Contrôle des accès par authentification forte (identifiant et mot de passe conforme aux recommandations de la CNIL et de l'ANSSI)</li>
              <li>Hachage sécurisé des mots de passe avec des algorithmes robustes et salage (bcrypt, argon2 ou équivalent)</li>
              <li>Sauvegardes régulières et automatisées des données, avec tests périodiques de restauration</li>
              <li>Surveillance continue des systèmes et détection des anomalies et des tentatives d'intrusion</li>
              <li>Mise à jour régulière des composants logiciels, des correctifs de sécurité et des bibliothèques utilisées</li>
              <li>Séparation des environnements (développement, test, production) et isolation des données</li>
              <li>Politique de gestion des accès et des habilitations basée sur le principe du moindre privilège</li>
              <li>Formation et sensibilisation des personnels habilités à accéder aux données personnelles</li>
              <li>Pare-feux applicatifs et systèmes de prévention des intrusions</li>
              <li>Audits de sécurité périodiques et tests de pénétration</li>
            </ul>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">10.3</span> En cas de violation de données à caractère personnel au sens de l'article 33 du RGPD, la Société notifiera la CNIL dans un délai de soixante-douze (72) heures à compter de la prise de connaissance de la violation, sauf si la violation en question n'est pas susceptible d'engendrer un risque pour les droits et libertés des personnes physiques. Si la violation est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes physiques, la Société informera également les personnes concernées dans les meilleurs délais, conformément à l'article 34 du RGPD, en leur communiquant la nature de la violation, les conséquences probables, les mesures prises ou envisagées pour y remédier et les coordonnées du point de contact auprès duquel des informations supplémentaires peuvent être obtenues.
            </p>
          </section>

          {/* Article 11 - Mineurs */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Protection des données des mineurs</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">11.1</span> La Plateforme et les Services sont destinés à un usage professionnel par des personnes majeures (âgées de dix-huit ans ou plus). La Société ne collecte pas sciemment de données à caractère personnel auprès de mineurs de moins de seize (16) ans. Si la Société venait à prendre connaissance du fait que des données à caractère personnel de mineurs de moins de seize ans ont été collectées sans le consentement de leurs représentants légaux, elle prendra les mesures nécessaires pour supprimer ces données dans les meilleurs délais. Si vous êtes un parent ou un représentant légal et que vous estimez que votre enfant mineur a fourni des données personnelles à la Société, veuillez contacter la Société à l'adresse contact@restaumargin.fr afin que les mesures appropriées soient prises.
            </p>
          </section>

          {/* Article 12 - Liens vers des sites tiers */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 12 — Liens vers des sites tiers</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">12.1</span> Le Site peut contenir des liens hypertextes vers des sites internet exploités par des tiers. Ces liens sont fournis uniquement pour la commodité de l'utilisateur et à titre informatif. La Société n'exerce aucun contrôle sur le contenu, les pratiques en matière de protection des données personnelles, la politique de cookies ou tout autre aspect du fonctionnement de ces sites tiers. La présente Politique de confidentialité ne s'applique pas aux sites internet tiers. L'utilisateur est invité à consulter la politique de confidentialité de chaque site tiers qu'il visite. La Société décline toute responsabilité quant aux pratiques de protection des données personnelles mises en oeuvre par les exploitants de sites tiers accessibles depuis le Site.
            </p>
          </section>

          {/* Article 13 - Modification de la politique */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 13 — Modification de la Politique de confidentialité</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.1</span> La Société se réserve le droit de modifier, de compléter ou de mettre à jour la présente Politique de confidentialité à tout moment, afin de la mettre en conformité avec les évolutions législatives, réglementaires, jurisprudentielles, technologiques ou commerciales. Les modifications entrent en vigueur dès leur publication sur le Site, à la date indiquée en tête du présent document sous la mention « Dernière mise à jour ».
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">13.2</span> En cas de modification substantielle de la présente Politique, susceptible d'affecter les droits et libertés des personnes concernées, la Société en informera les utilisateurs par courrier électronique à l'adresse associée à leur compte et/ou par une notification bien visible affichée sur la Plateforme, au moins quinze (15) jours avant l'entrée en vigueur des modifications. La poursuite de l'utilisation du Site et des Services après l'entrée en vigueur des modifications vaut acceptation de la Politique de confidentialité modifiée. En cas de désaccord avec les modifications apportées, l'utilisateur peut exercer ses droits tels que décrits à l'article 6 de la présente Politique, ou supprimer son compte dans les conditions prévues par les Conditions Générales d'Utilisation.
            </p>
          </section>

          {/* Article 14 - Droit applicable */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 14 — Droit applicable et juridiction compétente</h2>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">14.1</span> La présente Politique de confidentialité est régie, interprétée et appliquée conformément au droit français et au droit de l'Union européenne, et notamment au Règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée (Loi Informatique et Libertés).
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              <span className="font-medium text-mono-100 dark:text-white">14.2</span> En cas de litige relatif à l'interprétation, la validité ou l'application de la présente Politique, et après tentative de résolution amiable, les tribunaux compétents de Marseille, France, seront seuls compétents, sous réserve des dispositions d'ordre public applicables au profit des consommateurs.
            </p>
          </section>

          {/* Article 15 - Contact */}
          <section className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 15 — Contact</h2>
            <p className="text-mono-350 dark:text-mono-800">
              Pour toute question, demande d'information, exercice de droits, réclamation ou signalement relatif à la présente Politique de confidentialité, au traitement de vos données personnelles ou à tout autre aspect de la protection de votre vie privée dans le cadre de l'utilisation du Site et des Services, vous pouvez contacter la Société aux coordonnées suivantes :
            </p>
            <div className="text-mono-350 dark:text-mono-800 space-y-1">
              <p><span className="text-mono-500">Dénomination sociale :</span> RestauMargin SAS</p>
              <p><span className="text-mono-500">Qualité :</span> Responsable du traitement des données à caractère personnel</p>
              <p><span className="text-mono-500">Siège social :</span> Marseille, France</p>
              <p><span className="text-mono-500">Email :</span> <span className="text-teal-400">contact@restaumargin.fr</span></p>
            </div>
            <p className="text-mono-350 dark:text-mono-800">
              La Société s'engage à accuser réception de toute demande dans un délai de quarante-huit (48) heures ouvrables et à y apporter une réponse circonstanciée dans un délai maximum de trente (30) jours à compter de la réception de la demande complète, conformément aux exigences du RGPD. En cas de doute raisonnable sur l'identité de la personne effectuant la demande, la Société pourra demander la communication d'un justificatif d'identité avant de donner suite à la demande.
            </p>
            <p className="text-mono-350 dark:text-mono-800">
              En cas de difficulté persistante en lien avec la gestion de vos données personnelles, vous disposez du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL), autorité de contrôle française compétente en matière de protection des données à caractère personnel : CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — Site internet : www.cnil.fr.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-mono-900 dark:border-mono-200 flex flex-wrap gap-6 text-sm text-mono-500">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions légales</a>
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions générales de vente</a>
          <a href="/cgu" className="hover:text-teal-400 transition-colors">Conditions générales d'utilisation</a>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
