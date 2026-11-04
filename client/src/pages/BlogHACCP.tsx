import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Lightbulb, AlertTriangle, Users, Thermometer, ShieldCheck, ClipboardList, CheckCircle, Download, FileText, ListChecks } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Guide HACCP pour les restaurants : tout ce qu'il faut savoir"
   Mot-cle principal : HACCP restaurant
   ~1 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

export default function BlogHACCP() {
  return (
    <div className="min-h-screen">
      <SEOHead title="HACCP restaurant : guide complet des normes d'hygiène 2026" description="Tout savoir sur la méthode HACCP en restaurant : 7 principes, plan de maîtrise sanitaire, températures, traçabilité, contrôles officiels." path="/blog/haccp-restaurant" type="article" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "HACCP en restaurant : guide complet des normes d'hygiène",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.restaumargin.fr/icon-512.png"
              }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR"
          })
        }}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="HACCP"
        readTime="14 min"
        date="Avril 2026"
        title="Guide HACCP pour les restaurants : tout ce qu'il faut savoir"
        accentWord="HACCP"
        subtitle="Le HACCP (Hazard Analysis Critical Control Points) est obligatoire pour tous les restaurants en France. Découvrez les 7 principes, les températures à respecter et une checklist pratique pour votre établissement."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" readTime="14 min" variant="header" />

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: 'Qu\'est-ce que le HACCP et pourquoi c\'est obligatoire ?' },
              { href: '#temperatures', label: 'Tableau des températures de référence en restauration' },
              { href: '#principes', label: 'Les 7 principes HACCP expliqués simplement' },
              { href: '#checklist', label: 'Checklist HACCP quotidienne pour votre restaurant' },
              { href: '#sanctions', label: 'Sanctions et contrôles : ce que vous risquez' },
              { href: '#digitaliser', label: 'Digitaliser votre HACCP avec RestauMargin' },
              { href: '#faq', label: 'Questions fréquentes' },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-teal-600 transition-colors flex items-start gap-2">
                  <span className="text-teal-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<ShieldCheck className="w-6 h-6" />} number="1">
            Qu'est-ce que le HACCP et pourquoi c'est obligatoire ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le HACCP (Hazard Analysis Critical Control Points, ou Analyse des Dangers et Points
              Critiques pour leur Maîtrise) est une méthode systématique de prévention des risques
              sanitaires dans la chaîne alimentaire. Développé par la NASA dans les années 1960 pour
              garantir la sécurité alimentaire des astronautes, il est devenu le standard mondial
              en matière d'hygiène alimentaire.
            </p>
            <p>
              En France, le HACCP est obligatoire pour tous les établissements de restauration
              depuis le "Paquet Hygiène" européen de 2006 (règlements CE 852/2004 et 853/2004).
              Cela concerne les restaurants traditionnels, les fast-foods, les traiteurs, les
              boulangeries, les cantines et même les food trucks. Aucun établissement servant de
              la nourriture n'est exempte.
            </p>
            <p>
              Contrairement à une idée reçue, le HACCP n'est pas un simple document à remplir et
              ranger dans un classeur. C'est un système vivant de surveillance continue qui doit être
              appliqué au quotidien par toute l'équipe. Il couvre l'ensemble de la chaîne : réception
              des marchandises, stockage, préparation, cuisson, refroidissement, maintien en
              température et service.
            </p>

            <Callout type="info">
              <strong>Important :</strong> Depuis 2012, au moins une personne dans chaque établissement
              de restauration doit avoir suivi une formation en hygiène alimentaire de 14 heures
              (formation HACCP). Cette obligation est vérifiée lors des contrôles de la DDPP
              (Direction Départementale de la Protection des Populations).
            </Callout>

            <p>
              Le HACCP repose sur un principe fondamental : mieux vaut prévenir que guérir. Plutôt
              que de vérifier la qualité du produit fini (ce qui est trop tard si un problème est
              survenu), on identifie les dangers potentiels à chaque étape de la production et on
              met en place des mesures de contrôle pour les éliminer ou les réduire à un niveau
              acceptable.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Temperatures ═════════════ */}
        <section id="temperatures" className="mb-16">
          <SectionHeading icon={<Thermometer className="w-6 h-6" />} number="2">
            Tableau des températures de référence en restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              La maîtrise des températures est le pilier du HACCP en restauration. Les bactéries
              pathogènes (Salmonella, Listeria, E. coli, Staphylococcus aureus) se multiplient
              rapidement entre 4 degC et 63 degC — c'est la fameuse "zone de danger". Votre objectif :
              minimiser le temps passé dans cette zone.
            </p>
          </div>

          {/* Tableau des temperatures */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Équipement / Étape</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Température réglementaire</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Tolérance</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Fréquence de contrôle</th>
                </tr>
              </thead>
              <tbody>
                <TempRow equip="Réfrigérateur" temp="0 degC à +3 degC" tolerance="+/- 1 degC" freq="2x par jour" color="bg-blue-50" />
                <TempRow equip="Congélateur" temp="-18 degC ou moins" tolerance="+/- 2 degC" freq="1x par jour" color="bg-white" />
                <TempRow equip="Chambre froide positive" temp="+2 degC à +4 degC" tolerance="+/- 1 degC" freq="2x par jour" color="bg-blue-50" />
                <TempRow equip="Cuisson viandes" temp="+63 degC à coeur minimum" tolerance="Aucune" freq="À chaque cuisson" color="bg-white" />
                <TempRow equip="Cuisson volaille" temp="+74 degC à coeur minimum" tolerance="Aucune" freq="À chaque cuisson" color="bg-blue-50" />
                <TempRow equip="Maintien au chaud" temp="+63 degC minimum" tolerance="+/- 2 degC" freq="Toutes les 30 min" color="bg-white" />
                <TempRow equip="Refroidissement rapide" temp="De +63 degC à +10 degC en 2h" tolerance="2h maximum" freq="À chaque refroidissement" color="bg-blue-50" />
                <TempRow equip="Remise en température" temp="De +10 degC à +63 degC en 1h" tolerance="1h maximum" freq="À chaque réchauffage" color="bg-white" />
                <TempRow equip="Livraison produits frais" temp="0 degC à +4 degC" tolerance="+/- 2 degC" freq="À chaque réception" color="bg-blue-50" />
                <TempRow equip="Livraison surgelés" temp="-18 degC ou moins" tolerance="+/- 3 degC" freq="À chaque réception" color="bg-white" />
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <Callout type="warning">
              <strong>Zone de danger :</strong> Entre +4 degC et +63 degC, les bactéries doublent leur
              population toutes les 20 minutes. Un aliment laissé 4 heures dans cette zone peut
              contenir des millions de bactéries pathogènes. C'est pourquoi le refroidissement rapide
              (de +63 degC à +10 degC en moins de 2 heures) est une étape critique du HACCP.
            </Callout>

            <p>
              Équipez-vous d'un thermomètre à sonde digital (entre 20 et 50 EUR) et d'un thermomètre
              enregistreur pour chaque chambre froide. Notez les relevés dans un cahier dédié ou,
              mieux encore, utilisez une solution digitale qui enregistre automatiquement les
              températures et vous alerte en cas de dépassement.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : 7 principes ═════════════ */}
        <section id="principes" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Les 7 principes HACCP expliqués simplement
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le HACCP repose sur 7 principes fondamentaux définis par le Codex Alimentarius de
              l'OMS et la FAO. Voici chaque principe expliqué avec des exemples concrets adaptés
              à un restaurant.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <PrincipeCard
              number={1}
              title="Analyser les dangers"
              desc="Identifiez tous les dangers biologiques (bactéries, virus, parasites), chimiques (produits de nettoyage, allergènes) et physiques (morceaux de verre, corps étrangers) à chaque étape de votre production. Par exemple : à la réception, le danger est un produit livré à température trop élevée. En préparation, c'est la contamination croisée entre viande crue et légumes."
              example="Listez chaque étape de fabrication d'un plat et identifiez les dangers potentiels à chaque étape."
            />
            <PrincipeCard
              number={2}
              title="Déterminer les points critiques de contrôle (CCP)"
              desc="Un CCP est une étape où un contrôle est essentiel pour prévenir un danger. Ce n'est pas chaque étape de la production, mais uniquement celles où un contrôle est indispensable. Par exemple, la température de cuisson d'une viande est un CCP : si elle n'est pas atteinte, le danger bactérien n'est pas éliminé."
              example="CCP typiques : réception (température), cuisson (température à coeur), refroidissement (durée/température)."
            />
            <PrincipeCard
              number={3}
              title="Fixer les limites critiques"
              desc="Pour chaque CCP, définissez une valeur limite mesurable qui sépare l'acceptable de l'inacceptable. Ces limites doivent être basées sur la réglementation ou la science. Par exemple : la température à coeur d'un poulet rôti doit atteindre 74 degC minimum."
              example="Frigo : max +3 degC. Cuisson poulet : min +74 degC. Refroidissement : de +63 degC à +10 degC en 2h max."
            />
            <PrincipeCard
              number={4}
              title="Mettre en place un système de surveillance"
              desc="Définissez comment, quand et par qui chaque CCP est surveillé. La surveillance peut être continue (sonde de température dans une chambre froide) ou ponctuelle (prise de température à la sonde à chaque cuisson). L'important est que ce soit systématique et documenté."
              example="Relevez la température des frigos à l'ouverture et à la fermeture. Mesurez la température à coeur de chaque viande."
            />
            <PrincipeCard
              number={5}
              title="Définir les actions correctives"
              desc="Que faire quand une limite critique est dépassée ? Définissez à l'avance les actions à mener. Par exemple : si le frigo dépasse +5 degC, vérifiez si la porte est bien fermée, contrôlez le thermostat, et si les produits ont été au-dessus de +4 degC pendant plus de 2 heures, jetez-les."
              example="Frigo en panne : transférer immédiatement les produits vers un autre frigo et jeter les produits compromis."
            />
            <PrincipeCard
              number={6}
              title="Vérifier l'efficacité du système"
              desc="Vérifiez régulièrement que votre plan HACCP fonctionne. Cela passe par des audits internes, la calibration des thermomètres, la revue des registres de surveillance et éventuellement des analyses microbiologiques de vos préparations."
              example="Audit interne mensuel, calibration des thermomètres tous les 6 mois, vérification des registres chaque semaine."
            />
            <PrincipeCard
              number={7}
              title="Constituer des dossiers et registres"
              desc="Tout doit être documenté et conservé. Les registres prouvent votre bonne foi et votre rigueur en cas de contrôle. Conservez les registres de température, les bons de livraison, les fiches de nettoyage, les fiches de formation et tout document relatif à la sécurité alimentaire pendant 5 ans minimum."
              example="Classeur ou logiciel avec : relevés températures, fiches de réception, plans de nettoyage, attestations de formation."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Checklist ═════════════ */}
        <section id="checklist" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="4">
            Checklist HACCP quotidienne pour votre restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une checklist pratique à suivre chaque jour pour assurer la conformité HACCP
              de votre restaurant. Imprimez-la et affichez-la en cuisine.
            </p>
          </div>

          <div className="mt-6 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Checklist quotidienne
            </h3>

            <div className="space-y-6">
              <ChecklistSection
                title="Ouverture (avant le service)"
                items={[
                  'Relever et noter les températures de toutes les chambres froides et congélateurs',
                  'Vérifier les DLC des produits en stock (retirer les produits périmés)',
                  'Contrôler la propreté des plans de travail, des équipements et des ustensiles',
                  'Vérifier le stock de produits de nettoyage et de désinfection',
                  'S\'assurer que le personnel porte des vêtements de travail propres',
                  'Vérifier le bon fonctionnement des thermomètres à sonde',
                ]}
              />
              <ChecklistSection
                title="Réception des marchandises"
                items={[
                  'Vérifier la température des produits à la livraison (frais, surgelés)',
                  'Contrôler l\'intégrité des emballages (pas de dechirage, pas de gonflement)',
                  'Vérifier les DLC et DLUO sur les étiquettes',
                  'Refuser tout produit non conforme et le noter sur le bon de livraison',
                  'Ranger immédiatement les produits en chambre froide (dans les 15 min)',
                  'Appliquer le FIFO (placer les nouveaux produits derrière les anciens)',
                ]}
              />
              <ChecklistSection
                title="Pendant le service"
                items={[
                  'Prendre la température à coeur des viandes et volailles cuites',
                  'Vérifier la température du maintien au chaud (min +63 degC)',
                  'Séparer les produits crus et cuits (plans de travail, ustensiles)',
                  'Se laver les mains régulièrement (toutes les 30 min et à chaque changement de tâche)',
                  'Utiliser des planches de découpe de couleurs différentes (viande rouge, volaille, poisson, légumes)',
                ]}
              />
              <ChecklistSection
                title="Fermeture (après le service)"
                items={[
                  'Relever et noter les températures des chambres froides',
                  'Refroidir rapidement les préparations chaudes (cellule de refroidissement)',
                  'Nettoyer et désinfecter tous les plans de travail et équipements',
                  'Vider les poubelles et nettoyer les conteneurs',
                  'Vérifier que les portes des chambres froides sont bien fermées',
                  'Remplir le registre de nettoyage',
                ]}
              />
            </div>

            {/* Placeholder telechargement */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-mono-100 mb-0.5">Télécharger la checklist HACCP (PDF)</h4>
                <p className="text-sm text-mono-400">
                  Version imprimable avec cases à cocher, prête à afficher en cuisine.
                </p>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                onClick={() => alert('La checklist PDF sera bientôt disponible au téléchargement. Inscrivez-vous à RestauMargin pour recevoir la version numérique.')}
              >
                Télécharger
              </button>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Sanctions ═════════════ */}
        <section id="sanctions" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="5">
            Sanctions et contrôles : ce que vous risquez
          </SectionHeading>

          <div className="prose-content">
            <p>
              Les contrôles sanitaires sont effectués par la DDPP (Direction Départementale de la
              Protection des Populations), anciennement DSV (Direction des Services Vétérinaires).
              Ils peuvent être programmés ou inoipines, et interviennent en moyenne tous les 2 à
              3 ans pour un restaurant classique. En cas de plainte d'un client ou d'intoxication
              alimentaire, le contrôle est immédiat.
            </p>
            <p>
              Lors d'un contrôle, l'inspecteur vérifie : l'existence d'un plan de maîtrise sanitaire
              (PMS) incluant le plan HACCP, les registres de température, les procédures de nettoyage
              et de désinfection, la formation du personnel, la traçabilité des produits, la
              conformité des locaux et équipements.
            </p>

            <Callout type="warning">
              <strong>Sanctions possibles :</strong> Un avertissement pour les manquements mineurs.
              Une mise en demeure avec délai de mise en conformité pour les infractions moyennes.
              Une fermeture administrative temporaire ou définitive pour les infractions graves.
              Des sanctions pénales pouvant aller jusqu'à 2 ans d'emprisonnement et 150 000 EUR
              d'amende en cas de mise en danger de la santé publique.
            </Callout>

            <p>
              Depuis 2017, les résultats des contrôles sanitaires sont publiés sur le site
              Alim'confiance du Ministère de l'Agriculture. Les résultats vont de "Très satisfaisant"
              à "À corriger de manière urgente", et sont accessibles par tous les consommateurs.
              Un mauvais résultat peut avoir un impact considérable sur votre réputation en ligne.
            </p>
            <p>
              La meilleure stratégie ? Ne pas attendre le contrôle. Mettez en place des audits
              internes mensuels en utilisant la même grille que les inspecteurs de la DDPP.
              Corrigez les écarts avant qu'ils ne soient détectés. Un restaurant bien préparé
              n'a rien à craindre d'un contrôle.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" readTime="14 min" variant="footer" />

        {/* ═════════════ SECTION 6 : Digitaliser ═════════════ */}
        <section id="digitaliser" className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              Digitalisez votre HACCP avec RestauMargin
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Fini les classeurs papier et les oublis. RestauMargin digitalise votre plan HACCP :
              relevés de températures automatiques, alertes en temps réel, checklists interactives,
              registres numériques conformes et traçabilité complète.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 mb-8 text-left max-w-2xl mx-auto">
              <DigitalFeature icon={<Thermometer className="w-5 h-5" />} text="Relevés automatiques des températures" />
              <DigitalFeature icon={<AlertTriangle className="w-5 h-5" />} text="Alertes instantanées en cas de dépassement" />
              <DigitalFeature icon={<FileText className="w-5 h-5" />} text="Registres numériques conformes DDPP" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors"
              >
                Essayer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Découvrir nos outils
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles lies ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Articles complémentaires</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/gaspillage-alimentaire" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le gaspillage alimentaire</h3>
              <p className="text-sm text-mono-500">5 astuces concrètes et un calculateur de pertes pour votre restaurant.</p>
            </Link>
            <Link to="/blog/fiche-technique-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fiche technique de cuisine : le guide</h3>
              <p className="text-sm text-mono-500">Créez des fiches techniques précises pour maîtriser food cost et qualité.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculer la marge de votre restaurant</h3>
              <p className="text-sm text-mono-500">Formules, benchmarks par type de restaurant et erreurs courantes.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            <FAQItem
              q="Le HACCP est-il obligatoire pour tous les restaurants ?"
              a="Oui, depuis les règlements européens CE 852/2004 et 853/2004 (le 'Paquet Hygiène'), tous les établissements de restauration en France sont tenus de mettre en place des procédures basées sur les principes HACCP. Cela inclut les restaurants, fast-foods, traiteurs, boulangeries, cantines et food trucks."
            />
            <FAQItem
              q="Qui doit suivre la formation HACCP ?"
              a="Au minimum une personne par établissement doit avoir suivi la formation en hygiène alimentaire de 14 heures. Cette formation est dispensée par des organismes agréés et coûte entre 200 et 400 EUR. Elle est valable à vie, mais une mise à jour tous les 5 ans est recommandée."
            />
            <FAQItem
              q="À quelle fréquence relever les températures ?"
              a="Les chambres froides et congélateurs doivent être contrôlés au minimum 2 fois par jour (ouverture et fermeture). La température à coeur des viandes doit être vérifiée à chaque cuisson. Le maintien au chaud doit être surveillé toutes les 30 minutes. Idéalement, utilisez des enregistreurs automatiques."
            />
            <FAQItem
              q="Combien de temps conserver les registres HACCP ?"
              a="Les registres de température, fiches de réception, plans de nettoyage et autres documents HACCP doivent être conservés pendant 5 ans minimum. C'est une obligation réglementaire vérifiée lors des contrôles de la DDPP. Le format numérique est accepté à condition qu'il soit sécurisé et non modifiable."
            />
            <FAQItem
              q="Que faire si un frigo tombe en panne ?"
              a="Transférez immédiatement les produits dans un autre réfrigérateur. Si les produits ont dépassé +4 degC pendant plus de 2 heures, ils doivent être jetés (sauf les produits stables comme les boissons). Notez l'incident dans votre registre, prenez la température des produits et documentez les actions correctives."
            />
            <FAQItem
              q="Peut-on digitaliser les registres HACCP ?"
              a="Oui, les registres numériques sont parfaitement acceptés par la DDPP, à condition qu'ils soient fiables, sécurisés et non modifiables à posteriori. Les solutions digitales comme RestauMargin offrent en plus l'avantage des alertes automatiques, des rappels de contrôle et de la génération automatique de rapports en cas de contrôle."
            />
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <PublicFooter />

      {/* ── JSON-LD Article Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Guide HACCP pour les restaurants : tout ce qu\'il faut savoir en 2026',
            description: 'Guide HACCP restaurant complet : les 7 principes, tableau des températures, checklist téléchargeable et FAQ.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-10',
            dateModified: '2026-04-10',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/haccp' },
          }),
        }}
      />
      {/* ── JSON-LD FAQ Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Le HACCP est-il obligatoire pour tous les restaurants ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Oui, depuis les règlements européens CE 852/2004 et 853/2004, tous les établissements de restauration en France sont tenus de mettre en place des procédures HACCP.',
                },
              },
              {
                '@type': 'Question',
                name: 'Qui doit suivre la formation HACCP ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Au minimum une personne par établissement doit avoir suivi la formation en hygiène alimentaire de 14 heures. Elle coûte entre 200 et 400 EUR.',
                },
              },
              {
                '@type': 'Question',
                name: 'À quelle fréquence relever les températures ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Les chambres froides au minimum 2 fois par jour. La température à coeur des viandes à chaque cuisson. Le maintien au chaud toutes les 30 minutes.',
                },
              },
              {
                '@type': 'Question',
                name: 'Combien de temps conserver les registres HACCP ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Les registres HACCP doivent être conservés pendant 5 ans minimum. Le format numérique est accepté à condition qu\'il soit sécurisé et non modifiable.',
                },
              },
              {
                '@type': 'Question',
                name: 'Que faire si un frigo tombe en panne ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Transférez immédiatement les produits. Si les produits ont dépassé +4 degC pendant plus de 2 heures, ils doivent être jetés. Documentez l\'incident.',
                },
              },
              {
                '@type': 'Question',
                name: 'Peut-on digitaliser les registres HACCP ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Oui, les registres numériques sont acceptés par la DDPP, à condition qu\'ils soient fiables, sécurisés et non modifiables à posteriori.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">{children}</h2>
    </div>
  );
}

function TempRow({ equip, temp, tolerance, freq, color }: { equip: string; temp: string; tolerance: string; freq: string; color: string }) {
  return (
    <tr className={color}>
      <td className="px-4 py-3 border-b border-mono-900 font-medium text-mono-100">{equip}</td>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{temp}</td>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{tolerance}</td>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{freq}</td>
    </tr>
  );
}

function PrincipeCard({ number, title, desc, example }: { number: number; title: string; desc: string; example: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
          {number}
        </div>
        <div>
          <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
          <p className="text-sm text-mono-400 leading-relaxed mb-3">{desc}</p>
          <div className="bg-blue-50 rounded-lg px-4 py-2.5 text-xs text-blue-800 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{example}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-mono-100 mb-3 flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-blue-600" />
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-mono-350">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DigitalFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/90">
      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 my-6 flex gap-3 text-sm leading-relaxed`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-mono-1000 border border-mono-900 rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
