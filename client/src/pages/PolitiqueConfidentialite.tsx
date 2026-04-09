import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PolitiqueConfidentialite() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#111111] dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="text-3xl font-bold mb-2">Politique de Confidentialite</h1>
        <p className="text-[#737373] mb-10">Derniere mise a jour : 7 avril 2026</p>

        <div className="space-y-10">
          {/* Preambule */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Preambule</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              La presente Politique de confidentialite (ci-apres « la Politique ») a pour objet d'informer les utilisateurs du site internet https://restaumargin.com (ci-apres « le Site » ou « la Plateforme ») et des services associes sur les modalites de collecte, de traitement, de stockage, de conservation et de protection de leurs donnees a caractere personnel par RestauMargin SAS (ci-apres « la Societe »), societe par actions simplifiee de droit francais dont le siege social est situe a Marseille, France.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              La Societe s'engage a respecter la vie privee et les droits fondamentaux des personnes dont elle traite les donnees personnelles, conformement aux dispositions du Reglement (UE) 2016/679 du Parlement europeen et du Conseil du 27 avril 2016 relatif a la protection des personnes physiques a l'egard du traitement des donnees a caractere personnel et a la libre circulation de ces donnees (ci-apres « le RGPD »), de la loi n° 78-17 du 6 janvier 1978 modifiee relative a l'informatique, aux fichiers et aux libertes (ci-apres « la Loi Informatique et Libertes »), des recommandations et lignes directrices de la Commission Nationale de l'Informatique et des Libertes (CNIL), et de toute autre reglementation nationale ou europeenne applicable en matiere de protection des donnees a caractere personnel.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              La presente Politique fait partie integrante des Conditions Generales d'Utilisation (CGU) et des Mentions legales du Site. En accedant au Site, en creant un compte ou en utilisant les services proposes par la Societe, l'utilisateur reconnait avoir pris connaissance de la presente Politique et en accepter les termes. La Societe se reserve le droit de modifier la presente Politique a tout moment afin de la mettre en conformite avec les evolutions legislatives, reglementaires, jurisprudentielles ou technologiques. En cas de modification substantielle, les utilisateurs seront informes par courrier electronique et/ou par notification sur la Plateforme, et la date de derniere mise a jour indiquee en tete du present document sera actualisee.
            </p>
          </section>

          {/* Article 1 - Definitions */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 1 — Definitions</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              Pour l'interpretation et l'application de la presente Politique de confidentialite, les termes definis ci-dessous auront la signification suivante :
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.1 « Donnees a caractere personnel » ou « Donnees personnelles »</span> designe toute information se rapportant a une personne physique identifiee ou identifiable, directement ou indirectement, notamment par reference a un identifiant tel qu'un nom, un numero d'identification, des donnees de localisation, un identifiant en ligne, ou a un ou plusieurs elements specifiques propres a l'identite physique, physiologique, genetique, psychique, economique, culturelle ou sociale de cette personne physique, au sens de l'article 4 du RGPD.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.2 « Traitement »</span> designe toute operation ou tout ensemble d'operations effectuees ou non a l'aide de procedes automatises et appliquees a des donnees a caractere personnel, telles que la collecte, l'enregistrement, l'organisation, la structuration, la conservation, l'adaptation ou la modification, l'extraction, la consultation, l'utilisation, la communication par transmission, la diffusion ou toute autre forme de mise a disposition, le rapprochement ou l'interconnexion, la limitation, l'effacement ou la destruction, au sens de l'article 4 du RGPD.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.3 « Responsable du traitement »</span> designe la personne physique ou morale, l'autorite publique, le service ou un autre organisme qui, seul ou conjointement avec d'autres, determine les finalites et les moyens du traitement de donnees a caractere personnel. Dans le cadre de la presente Politique, le responsable du traitement est RestauMargin SAS.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.4 « Sous-traitant »</span> designe la personne physique ou morale, l'autorite publique, le service ou un autre organisme qui traite des donnees a caractere personnel pour le compte du responsable du traitement, conformement aux instructions de ce dernier et dans le cadre d'un contrat de sous-traitance au sens de l'article 28 du RGPD.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.5 « Personne concernee »</span> designe toute personne physique dont les donnees a caractere personnel font l'objet d'un traitement par la Societe dans le cadre de l'exploitation du Site et de la fourniture des Services.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.6 « Consentement »</span> designe toute manifestation de volonte, libre, specifique, eclairee et univoque par laquelle la personne concernee accepte, par une declaration ou par un acte positif clair, que des donnees a caractere personnel la concernant fassent l'objet d'un traitement, au sens de l'article 4 du RGPD.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">1.7 « Violation de donnees a caractere personnel »</span> designe une violation de la securite entrainant, de maniere accidentelle ou illicite, la destruction, la perte, l'alteration, la divulgation non autorisee de donnees a caractere personnel transmises, conservees ou traitees d'une autre maniere, ou l'acces non autorise a de telles donnees, au sens de l'article 4 du RGPD.
            </p>
          </section>

          {/* Article 2 - Responsable du traitement */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 2 — Responsable du traitement</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">2.1</span> Le responsable du traitement des donnees a caractere personnel collectees et traitees dans le cadre de l'utilisation du Site et des Services est :
            </p>
            <div className="text-[#404040] dark:text-[#D4D4D4] space-y-1">
              <p><span className="text-[#737373]">Denomination sociale :</span> RestauMargin SAS</p>
              <p><span className="text-[#737373]">Forme juridique :</span> Societe par actions simplifiee (SAS)</p>
              <p><span className="text-[#737373]">Siege social :</span> Marseille, France</p>
              <p><span className="text-[#737373]">Email de contact :</span> contact@restaumargin.fr</p>
            </div>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">2.2</span> En sa qualite de responsable du traitement, la Societe determine les finalites et les moyens des traitements de donnees a caractere personnel mis en oeuvre dans le cadre de l'exploitation du Site et de la fourniture des Services. La Societe s'engage a traiter les donnees personnelles des utilisateurs de maniere licite, loyale et transparente, conformement aux principes fondamentaux du RGPD enumeres a l'article 5 du reglement, a savoir : la licite du traitement, la limitation des finalites, la minimisation des donnees, l'exactitude des donnees, la limitation de la conservation, l'integrite et la confidentialite, et la responsabilite.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">2.3</span> Pour toute question relative a la protection de vos donnees personnelles, pour exercer vos droits ou pour formuler une reclamation, vous pouvez contacter la Societe en ecrivant a l'adresse electronique contact@restaumargin.fr. La Societe s'engage a traiter votre demande dans les meilleurs delais et au plus tard dans un delai de trente (30) jours a compter de la reception de votre demande complete.
            </p>
          </section>

          {/* Article 3 - Donnees collectees */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 3 — Categories de donnees collectees</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">3.1</span> Dans le cadre de l'exploitation du Site et de la fourniture des Services, la Societe collecte et traite les categories de donnees personnelles suivantes :
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-2">3.1.1 Donnees d'identification et de contact</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Nom de famille, prenom(s), adresse electronique (email), numero de telephone fixe et/ou mobile, nom de l'etablissement (restaurant, hotel, boulangerie, etc.), type de cuisine ou d'activite, adresse postale de l'etablissement, fonction ou poste occupe au sein de l'etablissement. Ces donnees sont collectees lors de la creation du compte utilisateur et sont necessaires a l'identification de l'utilisateur, a la gestion de son compte et a la communication relative aux Services.
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-2">3.1.2 Donnees de connexion et donnees techniques</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Adresse IP (Internet Protocol), type et version du navigateur internet utilise, systeme d'exploitation du terminal de l'utilisateur, resolution de l'ecran, langue du navigateur, pages consultees sur le Site, date et heure de connexion, duree de la session, URL de provenance (referrer), identifiants de session, journaux d'acces (logs), identifiants de cookies et technologies de tracage similaires. Ces donnees sont collectees automatiquement lors de la navigation sur le Site et sont necessaires au bon fonctionnement du Site, a la securisation des acces, a la detection et a la prevention des fraudes, et a l'amelioration de l'experience utilisateur.
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-2">3.1.3 Donnees metier et donnees professionnelles</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Ingredients (noms, prix, unites, rendements, allergenes, informations nutritionnelles), recettes et fiches techniques (compositions, quantites, instructions, couts de revient), menus et cartes (composition des menus, prix de vente, categorisation des plats), inventaires (stocks, mouvements de stocks, dates de peremption, lots), commandes fournisseurs (bons de commande, quantites commandees, dates de livraison), donnees comptables (chiffre d'affaires, charges, marges, ratios financiers), historiques de pesees et donnees provenant de la balance connectee, factures fournisseurs scannees et donnees extraites par OCR, donnees relatives aux fournisseurs (noms, coordonnees, conditions commerciales, historiques de prix), donnees de conformite HACCP (releves de temperatures, fiches de controle, actions correctives), et toute autre information metier saisie par l'utilisateur dans le cadre de l'utilisation des Services. Ces donnees sont saisies volontairement par l'utilisateur et constituent les Donnees de l'Utilisateur au sens des Conditions Generales d'Utilisation.
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-2">3.1.4 Donnees de paiement et donnees de facturation</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Les donnees relatives aux moyens de paiement (numeros de carte bancaire, dates d'expiration, cryptogrammes visuels) sont collectees et traitees exclusivement par le prestataire de paiement securise et certifie PCI-DSS utilise par la Societe. La Societe ne stocke en aucun cas les donnees bancaires completes de ses utilisateurs. Seules les quatre derniers chiffres du numero de carte, le type de carte et la date d'expiration sont conserves par la Societe a des fins d'identification du moyen de paiement dans l'interface utilisateur. Les donnees de facturation (montants, dates de facturation, historique des paiements, factures emises) sont conservees par la Societe conformement aux obligations legales comptables et fiscales.
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-2">3.1.5 Donnees de communication et de support</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Contenus des echanges par courrier electronique, formulaires de contact, demandes de support technique, reclamations, retours d'experience, avis et commentaires, enquetes de satisfaction, et toute autre communication entre l'utilisateur et la Societe. Ces donnees sont collectees dans le cadre de la gestion de la relation client et de l'amelioration continue des Services.
                </p>
              </div>
            </div>

            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">3.2</span> La Societe s'engage a ne collecter que les donnees personnelles strictement necessaires aux finalites du traitement, conformement au principe de minimisation des donnees prevu a l'article 5.1.c du RGPD. La Societe ne collecte aucune donnee personnelle sensible au sens de l'article 9 du RGPD (donnees revelant l'origine raciale ou ethnique, les opinions politiques, les convictions religieuses ou philosophiques, l'appartenance syndicale, les donnees genetiques, les donnees biometriques, les donnees concernant la sante, ou les donnees concernant la vie sexuelle ou l'orientation sexuelle), sauf obligation legale ou consentement explicite de la personne concernee.
            </p>
          </section>

          {/* Article 4 - Finalites du traitement */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 4 — Finalites et bases legales des traitements</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">4.1</span> Les donnees personnelles collectees par la Societe sont traitees pour les finalites suivantes, chacune reposant sur une base legale specifique conformement a l'article 6 du RGPD :
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#262626]">
                    <th className="text-left py-3 px-4 text-[#737373] font-medium">Finalite</th>
                    <th className="text-left py-3 px-4 text-[#737373] font-medium">Base legale</th>
                  </tr>
                </thead>
                <tbody className="text-[#404040] dark:text-[#D4D4D4]">
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Creation, gestion et administration du compte utilisateur</td>
                    <td className="py-3 px-4">Execution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Fourniture, exploitation et amelioration des Services de la Plateforme</td>
                    <td className="py-3 px-4">Execution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Gestion de la facturation, des paiements et du recouvrement</td>
                    <td className="py-3 px-4">Execution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Communication relative au service (notifications, mises a jour, support technique, alertes de securite)</td>
                    <td className="py-3 px-4">Execution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Analyse d'usage, statistiques d'utilisation et amelioration de la Plateforme</td>
                    <td className="py-3 px-4">Interet legitime (art. 6.1.f RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Mesure d'audience et analyse du trafic via cookies analytiques</td>
                    <td className="py-3 px-4">Consentement (art. 6.1.a RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Securisation du Site, prevention des fraudes, detection des intrusions et des anomalies</td>
                    <td className="py-3 px-4">Interet legitime (art. 6.1.f RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Gestion de la relation client, support technique et traitement des reclamations</td>
                    <td className="py-3 px-4">Execution du contrat (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Envoi de communications commerciales et de prospection (newsletters, offres promotionnelles)</td>
                    <td className="py-3 px-4">Consentement (art. 6.1.a RGPD)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Respect des obligations legales, comptables, fiscales et reglementaires</td>
                    <td className="py-3 px-4">Obligation legale (art. 6.1.c RGPD)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[#404040] dark:text-[#D4D4D4] mt-3">
              <span className="font-medium text-[#111111] dark:text-white">4.2</span> Lorsque le traitement est fonde sur le consentement de la personne concernee, celle-ci dispose du droit de retirer son consentement a tout moment, sans que ce retrait n'affecte la licite du traitement fonde sur le consentement effectue avant le retrait. Le retrait du consentement peut etre effectue par les moyens decrits dans la presente Politique ou en contactant la Societe a l'adresse contact@restaumargin.fr.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">4.3</span> Lorsque le traitement est fonde sur l'interet legitime de la Societe, la Societe a prealablement procede a un test de mise en balance entre ses interets legitimes et les droits et libertes fondamentaux des personnes concernees, et a conclu que ses interets legitimes ne portent pas atteinte de maniere disproportionnee aux droits et libertes des personnes concernees. Les personnes concernees disposent du droit de s'opposer a tout moment au traitement de leurs donnees fonde sur l'interet legitime, pour des raisons tenant a leur situation particuliere.
            </p>
          </section>

          {/* Article 5 - Duree de conservation */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 5 — Duree de conservation des donnees</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">5.1</span> Les donnees personnelles collectees par la Societe sont conservees pour une duree n'excedant pas celle necessaire au regard des finalites pour lesquelles elles sont traitees, conformement au principe de limitation de la conservation prevu a l'article 5.1.e du RGPD. A l'expiration de la duree de conservation applicable, les donnees personnelles sont supprimees de maniere definitive et irreversible des systemes de la Societe, ou anonymisees de sorte qu'elles ne permettent plus d'identifier, directement ou indirectement, la personne concernee.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#262626]">
                    <th className="text-left py-3 px-4 text-[#737373] font-medium">Type de donnees</th>
                    <th className="text-left py-3 px-4 text-[#737373] font-medium">Duree de conservation</th>
                    <th className="text-left py-3 px-4 text-[#737373] font-medium">Fondement</th>
                  </tr>
                </thead>
                <tbody className="text-[#404040] dark:text-[#D4D4D4]">
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Donnees de compte (identification, contact)</td>
                    <td className="py-3 px-4">Duree de l'abonnement + 3 ans apres la suppression du compte</td>
                    <td className="py-3 px-4">Delai de prescription legale</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Donnees metier (ingredients, recettes, menus, inventaires)</td>
                    <td className="py-3 px-4">Duree de l'abonnement + 1 an apres la suppression du compte</td>
                    <td className="py-3 px-4">Execution du contrat + delai raisonnable de restitution</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Donnees de facturation et de paiement</td>
                    <td className="py-3 px-4">10 ans a compter de la cloture de l'exercice comptable</td>
                    <td className="py-3 px-4">Obligations legales comptables et fiscales (art. L.123-22 Code de commerce)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Donnees de connexion (logs, adresses IP)</td>
                    <td className="py-3 px-4">1 an a compter de leur collecte</td>
                    <td className="py-3 px-4">Obligation legale (art. 6-II LCEN, decret n° 2011-219)</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Cookies et technologies de tracage</td>
                    <td className="py-3 px-4">13 mois maximum a compter du depot</td>
                    <td className="py-3 px-4">Recommandations de la CNIL</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <td className="py-3 px-4">Donnees de communication et de support</td>
                    <td className="py-3 px-4">3 ans a compter de la cloture du ticket ou de l'echange</td>
                    <td className="py-3 px-4">Gestion de la relation client et delai de prescription</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Donnees de prospection commerciale</td>
                    <td className="py-3 px-4">3 ans a compter du dernier contact actif</td>
                    <td className="py-3 px-4">Recommandations de la CNIL</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">5.2</span> A l'expiration des durees de conservation en base active, certaines donnees pourront etre archivees en base intermediaire, accessible uniquement aux personnes habilitees et pour des finalites limitees (gestion des contentieux, respect des obligations legales), avant leur suppression definitive. Les durees d'archivage intermediaire sont determinees en fonction des delais de prescription legale applicables et des obligations reglementaires en vigueur.
            </p>
          </section>

          {/* Article 6 - Droits des utilisateurs */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 6 — Droits des personnes concernees</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">6.1</span> Conformement aux dispositions du RGPD et de la Loi Informatique et Libertes, toute personne dont les donnees a caractere personnel sont traitees par la Societe dispose des droits suivants :
            </p>
            <ul className="list-disc list-inside text-[#404040] dark:text-[#D4D4D4] space-y-3 ml-2">
              <li><span className="font-medium text-[#111111] dark:text-white">Droit d'acces (article 15 du RGPD) :</span> Le droit d'obtenir de la Societe la confirmation que des donnees a caractere personnel la concernant sont ou ne sont pas traitees et, lorsqu'elles le sont, l'acces auxdites donnees ainsi que les informations relatives aux finalites du traitement, aux categories de donnees traitees, aux destinataires, a la duree de conservation, aux droits de la personne concernee, au droit de deposer une reclamation aupres d'une autorite de controle, aux sources des donnees et a l'existence d'une prise de decision automatisee. La personne concernee a le droit d'obtenir une copie de ses donnees personnelles faisant l'objet d'un traitement.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit de rectification (article 16 du RGPD) :</span> Le droit d'obtenir de la Societe, dans les meilleurs delais, la rectification de donnees a caractere personnel inexactes la concernant. Compte tenu des finalites du traitement, la personne concernee a le droit d'obtenir que les donnees a caractere personnel incompletes soient completees, y compris en fournissant une declaration supplementaire.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit a l'effacement ou « droit a l'oubli » (article 17 du RGPD) :</span> Le droit d'obtenir de la Societe l'effacement, dans les meilleurs delais, de donnees a caractere personnel la concernant, lorsque l'un des motifs prevus par le RGPD s'applique (les donnees ne sont plus necessaires au regard des finalites, la personne retire son consentement, la personne exerce son droit d'opposition, les donnees ont fait l'objet d'un traitement illicite, etc.). Ce droit n'est pas absolu et est soumis aux exceptions prevues par le RGPD, notamment lorsque le traitement est necessaire pour l'exercice du droit a la liberte d'expression et d'information, pour le respect d'une obligation legale, pour des motifs d'interet public dans le domaine de la sante publique, a des fins archivistiques dans l'interet public, a des fins de recherche scientifique ou historique ou a des fins statistiques, ou pour la constatation, l'exercice ou la defense de droits en justice.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit a la limitation du traitement (article 18 du RGPD) :</span> Le droit d'obtenir de la Societe la limitation du traitement de ses donnees personnelles lorsque l'une des conditions prevues par le RGPD est remplie (la personne conteste l'exactitude des donnees, le traitement est illicite et la personne s'oppose a l'effacement, la Societe n'a plus besoin des donnees mais la personne en a besoin pour la defense de ses droits en justice, la personne a exerce son droit d'opposition et la verification est en cours).</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit a la portabilite des donnees (article 20 du RGPD) :</span> Le droit de recevoir les donnees a caractere personnel la concernant qu'elle a fournies a la Societe, dans un format structure, couramment utilise et lisible par machine, et le droit de transmettre ces donnees a un autre responsable du traitement sans que la Societe y fasse obstacle, lorsque le traitement est fonde sur le consentement ou l'execution d'un contrat et est effectue a l'aide de procedes automatises.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit d'opposition (article 21 du RGPD) :</span> Le droit de s'opposer a tout moment, pour des raisons tenant a sa situation particuliere, a un traitement de donnees a caractere personnel la concernant fonde sur l'interet legitime de la Societe. La Societe ne traitera plus les donnees a caractere personnel, a moins qu'elle ne demontre qu'il existe des motifs legitimes et imperieux pour le traitement qui prevalent sur les interets et les droits et libertes de la personne concernee. La personne concernee a le droit de s'opposer a tout moment au traitement de ses donnees a des fins de prospection commerciale directe, y compris le profilage dans la mesure ou il est lie a une telle prospection.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit de ne pas faire l'objet d'une decision fondee exclusivement sur un traitement automatise (article 22 du RGPD) :</span> Le droit de ne pas faire l'objet d'une decision fondee exclusivement sur un traitement automatise, y compris le profilage, produisant des effets juridiques la concernant ou l'affectant de maniere significative de facon similaire.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit de retirer son consentement :</span> Lorsque le traitement est fonde sur le consentement de la personne concernee, celle-ci a le droit de retirer son consentement a tout moment, sans que ce retrait n'affecte la licite du traitement effectue avant le retrait.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Droit de definir des directives relatives au sort de ses donnees apres son deces (article 85 de la Loi Informatique et Libertes) :</span> La personne concernee a le droit de definir des directives relatives a la conservation, a l'effacement et a la communication de ses donnees a caractere personnel apres son deces. Ces directives peuvent etre generales ou particulieres.</li>
            </ul>
            <p className="text-[#404040] dark:text-[#D4D4D4] mt-3">
              <span className="font-medium text-[#111111] dark:text-white">6.2</span> Pour exercer l'un quelconque de ces droits, la personne concernee peut adresser sa demande par courrier electronique a l'adresse <span className="text-teal-400">contact@restaumargin.fr</span>, accompagnee d'un justificatif d'identite en cas de doute raisonnable sur l'identite du demandeur. La Societe s'engage a accuser reception de la demande et a y repondre dans un delai maximum de trente (30) jours a compter de la reception de la demande complete. Ce delai peut etre prolonge de deux mois supplementaires en raison de la complexite de la demande ou du nombre de demandes recues, auquel cas la personne concernee sera informee de cette prolongation et de ses motifs dans le delai initial de trente jours.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">6.3</span> En cas de difficulte en lien avec la gestion de ses donnees personnelles, la personne concernee dispose du droit d'introduire une reclamation aupres de la Commission Nationale de l'Informatique et des Libertes (CNIL), autorite de controle francaise competente en matiere de protection des donnees a caractere personnel. La CNIL peut etre contactee aux coordonnees suivantes : CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — www.cnil.fr.
            </p>
          </section>

          {/* Article 7 - Cookies */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 7 — Cookies et technologies de tracage</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">7.1</span> Le Site utilise des cookies et des technologies de tracage similaires conformement aux dispositions de l'article 82 de la Loi Informatique et Libertes et aux lignes directrices et recommandations de la CNIL en matiere de cookies et autres traceurs (deliberation n° 2020-091 du 17 septembre 2020). Un cookie est un petit fichier texte depose sur le terminal de l'utilisateur (ordinateur, tablette, smartphone) par le serveur du Site ou par un serveur tiers, qui permet de stocker des informations relatives a la navigation de l'utilisateur sur le Site.
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-1">7.1.1 Cookies strictement necessaires (cookies essentiels)</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Ces cookies sont indispensables au bon fonctionnement du Site et a la fourniture des Services demandes par l'utilisateur. Ils permettent notamment la gestion de l'authentification et de la session utilisateur, la conservation des preferences de navigation et de configuration, la securisation de la navigation et la prevention des fraudes, le maintien du panier d'achat et le fonctionnement des formulaires. Ces cookies ne necessitent pas le consentement prealable de l'utilisateur conformement a l'article 82 de la Loi Informatique et Libertes, dans la mesure ou ils sont strictement necessaires a la fourniture d'un service de communication en ligne expressement demande par l'utilisateur.
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-1">7.1.2 Cookies analytiques et de mesure d'audience</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Ces cookies permettent de recueillir des informations anonymisees et agregees sur l'utilisation du Site par les visiteurs, telles que le nombre de visiteurs uniques, les pages les plus consultees, la duree moyenne des visites, le taux de rebond, les sources de trafic (moteurs de recherche, reseaux sociaux, acces directs, liens referents), les parcours de navigation et les interactions avec les elements du Site. Ces informations sont utilisees exclusivement pour ameliorer les performances, le contenu et l'ergonomie du Site. Le depot de ces cookies est soumis au consentement prealable et eclaire de l'utilisateur, recueilli via le bandeau de cookies affiche lors de la premiere visite sur le Site.
                </p>
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="font-medium text-[#111111] dark:text-white mb-1">7.1.3 Cookies fonctionnels</h3>
                <p className="text-[#404040] dark:text-[#D4D4D4] text-sm">
                  Ces cookies permettent de memoriser les choix et preferences de l'utilisateur (tels que la langue, la region, la taille d'affichage, les parametres de personnalisation) afin d'ameliorer et de personnaliser son experience de navigation sur le Site. Le depot de ces cookies peut etre soumis au consentement de l'utilisateur, sauf lorsqu'ils sont strictement necessaires a la fourniture du service demande.
                </p>
              </div>
            </div>

            <p className="text-[#404040] dark:text-[#D4D4D4] mt-3">
              <span className="font-medium text-[#111111] dark:text-white">7.2</span> L'utilisateur peut a tout moment modifier ses preferences en matiere de cookies, accepter ou refuser tout ou partie des cookies non essentiels, via le mecanisme de gestion des preferences de cookies mis a disposition sur le Site ou via les parametres de son navigateur internet. La plupart des navigateurs permettent de configurer l'acceptation ou le refus des cookies, de supprimer les cookies existants et de recevoir une notification avant le depot d'un cookie. La suppression ou le refus de cookies essentiels peut entrainer des perturbations dans le fonctionnement du Site et limiter l'acces a certaines fonctionnalites.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">7.3</span> La duree de validite du consentement aux cookies est de treize (13) mois a compter de son expression. A l'issue de cette periode, le consentement de l'utilisateur sera de nouveau sollicite. Les cookies deposes sur le terminal de l'utilisateur ont une duree de vie maximale de treize (13) mois conformement aux recommandations de la CNIL. Les informations collectees par les cookies sont conservees pour une duree n'excedant pas vingt-cinq (25) mois.
            </p>
          </section>

          {/* Article 8 - Sous-traitants et destinataires */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 8 — Destinataires des donnees et sous-traitants</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">8.1</span> Dans le cadre de l'exploitation du Site et de la fourniture des Services, la Societe fait appel a des prestataires de services tiers (sous-traitants) pour certaines operations de traitement. Ces sous-traitants agissent exclusivement sur instruction de la Societe, dans le cadre de contrats de sous-traitance conformes a l'article 28 du RGPD, et sont soumis a des obligations strictes en matiere de protection des donnees personnelles, de confidentialite et de securite.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">8.2</span> Les categories de sous-traitants auxquels la Societe fait appel sont les suivantes :
            </p>
            <ul className="list-disc list-inside text-[#404040] dark:text-[#D4D4D4] space-y-2 ml-2">
              <li><span className="font-medium text-[#111111] dark:text-white">Hebergeur professionnel europeen :</span> hebergement des serveurs, des bases de donnees, des fichiers et des sauvegardes, authentification des utilisateurs, stockage des donnees. Les donnees sont hebergees sur des serveurs situes dans l'Union europeenne.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Prestataire de paiement securise :</span> traitement des transactions de paiement, gestion des abonnements et des prelevements recurrents, prevention de la fraude au paiement. Ce prestataire est certifie PCI-DSS (Payment Card Industry Data Security Standard) et ne communique jamais les donnees bancaires completes a la Societe.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Prestataire d'envoi d'emails transactionnels :</span> envoi des emails de confirmation d'inscription, de reinitialisation de mot de passe, de notifications de service, de factures et de toute autre communication transactionnelle liee au fonctionnement du compte utilisateur.</li>
              <li><span className="font-medium text-[#111111] dark:text-white">Prestataire d'intelligence artificielle :</span> traitement des requetes d'intelligence artificielle pour les fonctionnalites d'optimisation des couts, des menus et des approvisionnements, de suggestions de recettes, d'analyse de donnees et de commande vocale.</li>
            </ul>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">8.3</span> Les donnees personnelles ne sont en aucun cas vendues, louees ou cedees a des tiers a des fins commerciales ou de marketing. Les donnees ne sont communiquees a des tiers que dans les cas suivants : (a) execution d'un contrat de sous-traitance dans les conditions prevues au present article ; (b) respect d'une obligation legale, reglementaire ou judiciaire ; (c) protection des droits, de la propriete ou de la securite de la Societe, de ses utilisateurs ou du public ; (d) prevention et detection des fraudes ; (e) consentement prealable et explicite de la personne concernee.
            </p>
          </section>

          {/* Article 9 - Transferts internationaux */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 9 — Transferts internationaux de donnees</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">9.1</span> La Societe s'efforce de conserver les donnees personnelles de ses utilisateurs au sein de l'Union europeenne (UE) et de l'Espace economique europeen (EEE). Toutefois, dans le cadre de la fourniture des Services et de la relation avec certains sous-traitants, des transferts de donnees a caractere personnel vers des pays situes en dehors de l'UE/EEE peuvent etre necessaires, notamment vers les Etats-Unis.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">9.2</span> Lorsque des donnees a caractere personnel sont transferees vers un pays ne beneficiant pas d'une decision d'adequation de la Commission europeenne, la Societe s'assure que des garanties appropriees sont mises en place conformement aux articles 44 a 49 du RGPD, afin d'assurer un niveau de protection des donnees essentiellement equivalent a celui garanti au sein de l'UE. Ces garanties peuvent inclure : (a) les clauses contractuelles types (CCT) adoptees par la Commission europeenne en vertu de l'article 46.2.c du RGPD ; (b) les regles d'entreprise contraignantes (Binding Corporate Rules) approuvees par les autorites de controle competentes ; (c) un cadre de protection des donnees reconnu par la Commission europeenne (tel que le EU-U.S. Data Privacy Framework) ; (d) toute autre garantie prevue par le RGPD et reconnue par les autorites de controle competentes.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">9.3</span> L'utilisateur peut obtenir des informations supplementaires sur les garanties mises en place pour encadrer les transferts internationaux de donnees en contactant la Societe a l'adresse contact@restaumargin.fr. La Societe met a disposition des personnes concernees, sur demande, une copie des clauses contractuelles types ou des autres garanties appropriees mises en place pour encadrer ces transferts.
            </p>
          </section>

          {/* Article 10 - Securite */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 10 — Securite des donnees</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">10.1</span> La Societe met en oeuvre des mesures techniques et organisationnelles appropriees pour proteger les donnees a caractere personnel contre tout acces non autorise, toute modification, toute divulgation, toute perte accidentelle, toute destruction ou tout dommage, conformement aux exigences de l'article 32 du RGPD. Ces mesures sont proportionnees a la nature, a la portee, au contexte et aux finalites des traitements, ainsi qu'aux risques pour les droits et libertes des personnes physiques.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">10.2</span> Les mesures de securite mises en oeuvre incluent notamment, sans s'y limiter :
            </p>
            <ul className="list-disc list-inside text-[#404040] dark:text-[#D4D4D4] space-y-1 ml-2">
              <li>Chiffrement des donnees en transit au moyen de protocoles securises (HTTPS/TLS 1.2 ou superieur) pour toutes les communications entre le terminal de l'utilisateur et les serveurs de la Societe</li>
              <li>Chiffrement des donnees au repos (at-rest encryption) sur les serveurs de stockage et les bases de donnees</li>
              <li>Controle des acces par authentification forte (identifiant et mot de passe conforme aux recommandations de la CNIL et de l'ANSSI)</li>
              <li>Hachage securise des mots de passe avec des algorithmes robustes et salage (bcrypt, argon2 ou equivalent)</li>
              <li>Sauvegardes regulieres et automatisees des donnees, avec tests periodiques de restauration</li>
              <li>Surveillance continue des systemes et detection des anomalies et des tentatives d'intrusion</li>
              <li>Mise a jour reguliere des composants logiciels, des correctifs de securite et des bibliotheques utilisees</li>
              <li>Separation des environnements (developpement, test, production) et isolation des donnees</li>
              <li>Politique de gestion des acces et des habilitations basee sur le principe du moindre privilege</li>
              <li>Formation et sensibilisation des personnels habilites a acceder aux donnees personnelles</li>
              <li>Pare-feux applicatifs et systemes de prevention des intrusions</li>
              <li>Audits de securite periodiques et tests de penetration</li>
            </ul>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">10.3</span> En cas de violation de donnees a caractere personnel au sens de l'article 33 du RGPD, la Societe notifiera la CNIL dans un delai de soixante-douze (72) heures a compter de la prise de connaissance de la violation, sauf si la violation en question n'est pas susceptible d'engendrer un risque pour les droits et libertes des personnes physiques. Si la violation est susceptible d'engendrer un risque eleve pour les droits et libertes des personnes physiques, la Societe informera egalement les personnes concernees dans les meilleurs delais, conformement a l'article 34 du RGPD, en leur communiquant la nature de la violation, les consequences probables, les mesures prises ou envisagees pour y remedier et les coordonnees du point de contact aupres duquel des informations supplementaires peuvent etre obtenues.
            </p>
          </section>

          {/* Article 11 - Mineurs */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 11 — Protection des donnees des mineurs</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">11.1</span> La Plateforme et les Services sont destines a un usage professionnel par des personnes majeures (agees de dix-huit ans ou plus). La Societe ne collecte pas sciemment de donnees a caractere personnel aupres de mineurs de moins de seize (16) ans. Si la Societe venait a prendre connaissance du fait que des donnees a caractere personnel de mineurs de moins de seize ans ont ete collectees sans le consentement de leurs representants legaux, elle prendra les mesures necessaires pour supprimer ces donnees dans les meilleurs delais. Si vous etes un parent ou un representant legal et que vous estimez que votre enfant mineur a fourni des donnees personnelles a la Societe, veuillez contacter la Societe a l'adresse contact@restaumargin.fr afin que les mesures appropriees soient prises.
            </p>
          </section>

          {/* Article 12 - Liens vers des sites tiers */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 12 — Liens vers des sites tiers</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">12.1</span> Le Site peut contenir des liens hypertextes vers des sites internet exploites par des tiers. Ces liens sont fournis uniquement pour la commodite de l'utilisateur et a titre informatif. La Societe n'exerce aucun controle sur le contenu, les pratiques en matiere de protection des donnees personnelles, la politique de cookies ou tout autre aspect du fonctionnement de ces sites tiers. La presente Politique de confidentialite ne s'applique pas aux sites internet tiers. L'utilisateur est invite a consulter la politique de confidentialite de chaque site tiers qu'il visite. La Societe decline toute responsabilite quant aux pratiques de protection des donnees personnelles mises en oeuvre par les exploitants de sites tiers accessibles depuis le Site.
            </p>
          </section>

          {/* Article 13 - Modification de la politique */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 13 — Modification de la Politique de confidentialite</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">13.1</span> La Societe se reserve le droit de modifier, de completer ou de mettre a jour la presente Politique de confidentialite a tout moment, afin de la mettre en conformite avec les evolutions legislatives, reglementaires, jurisprudentielles, technologiques ou commerciales. Les modifications entrent en vigueur des leur publication sur le Site, a la date indiquee en tete du present document sous la mention « Derniere mise a jour ».
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">13.2</span> En cas de modification substantielle de la presente Politique, susceptible d'affecter les droits et libertes des personnes concernees, la Societe en informera les utilisateurs par courrier electronique a l'adresse associee a leur compte et/ou par une notification bien visible affichee sur la Plateforme, au moins quinze (15) jours avant l'entree en vigueur des modifications. La poursuite de l'utilisation du Site et des Services apres l'entree en vigueur des modifications vaut acceptation de la Politique de confidentialite modifiee. En cas de desaccord avec les modifications apportees, l'utilisateur peut exercer ses droits tels que decrits a l'article 6 de la presente Politique, ou supprimer son compte dans les conditions prevues par les Conditions Generales d'Utilisation.
            </p>
          </section>

          {/* Article 14 - Droit applicable */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 14 — Droit applicable et juridiction competente</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">14.1</span> La presente Politique de confidentialite est regie, interpretee et appliquee conformement au droit francais et au droit de l'Union europeenne, et notamment au Reglement (UE) 2016/679 (RGPD) et a la loi n° 78-17 du 6 janvier 1978 modifiee (Loi Informatique et Libertes).
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              <span className="font-medium text-[#111111] dark:text-white">14.2</span> En cas de litige relatif a l'interpretation, la validite ou l'application de la presente Politique, et apres tentative de resolution amiable, les tribunaux competents de Marseille, France, seront seuls competents, sous reserve des dispositions d'ordre public applicables au profit des consommateurs.
            </p>
          </section>

          {/* Article 15 - Contact */}
          <section className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-teal-400">Article 15 — Contact</h2>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              Pour toute question, demande d'information, exercice de droits, reclamation ou signalement relatif a la presente Politique de confidentialite, au traitement de vos donnees personnelles ou a tout autre aspect de la protection de votre vie privee dans le cadre de l'utilisation du Site et des Services, vous pouvez contacter la Societe aux coordonnees suivantes :
            </p>
            <div className="text-[#404040] dark:text-[#D4D4D4] space-y-1">
              <p><span className="text-[#737373]">Denomination sociale :</span> RestauMargin SAS</p>
              <p><span className="text-[#737373]">Qualite :</span> Responsable du traitement des donnees a caractere personnel</p>
              <p><span className="text-[#737373]">Siege social :</span> Marseille, France</p>
              <p><span className="text-[#737373]">Email :</span> <span className="text-teal-400">contact@restaumargin.fr</span></p>
            </div>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              La Societe s'engage a accuser reception de toute demande dans un delai de quarante-huit (48) heures ouvrables et a y apporter une reponse circonstanciee dans un delai maximum de trente (30) jours a compter de la reception de la demande complete, conformement aux exigences du RGPD. En cas de doute raisonnable sur l'identite de la personne effectuant la demande, la Societe pourra demander la communication d'un justificatif d'identite avant de donner suite a la demande.
            </p>
            <p className="text-[#404040] dark:text-[#D4D4D4]">
              En cas de difficulte persistante en lien avec la gestion de vos donnees personnelles, vous disposez du droit d'introduire une reclamation aupres de la Commission Nationale de l'Informatique et des Libertes (CNIL), autorite de controle francaise competente en matiere de protection des donnees a caractere personnel : CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — Site internet : www.cnil.fr.
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-wrap gap-6 text-sm text-[#737373]">
          <a href="/mentions-legales" className="hover:text-teal-400 transition-colors">Mentions legales</a>
          <a href="/cgv" className="hover:text-teal-400 transition-colors">Conditions generales de vente</a>
          <a href="/cgu" className="hover:text-teal-400 transition-colors">Conditions generales d'utilisation</a>
        </div>
      </div>
    </div>
  );
}
