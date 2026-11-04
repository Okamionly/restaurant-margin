import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Calendar, ShieldCheck, Thermometer, ClipboardList, AlertTriangle, CheckCircle, Download, FileText } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

export default function BlogCalendrierHaccp() {
  const faqSchema = buildFAQSchema([
    {
      question: "Le HACCP est-il obligatoire pour tous les restaurants en France ?",
      answer: "Oui. Tout établissement qui prépare et sert des denrées alimentaires est soumis au règlement (CE) 852/2004 et doit appliquer une démarche fondée sur les principes HACCP. Restaurants, brasseries, food trucks, traiteurs, snacks, boulangeries-pâtisseries vendant à consommer sur place sont concernés."
    },
    {
      question: "Combien de temps doit-on conserver les relevés HACCP ?",
      answer: "Depuis la circulaire DGAL/SDSPA/2024, la durée minimale est de 6 mois. Beaucoup d'entreprises conservent un an pour sécurité juridique. Le format peut être papier ou numérique du moment que les relevés sont accessibles immédiatement lors d'un contrôle."
    },
    {
      question: "Que se passe-t-il en cas de relevés manquants lors d'un contrôle DDPP ?",
      answer: "Le contrôleur peut émettre un avertissement, demander une mise en demeure (1 à 3 mois pour régulariser), ou en cas de manquement grave, prononcer une fermeture administrative. Les amendes vont de 450 EUR à 1 500 EUR, et plus si une intoxication alimentaire est rattachée."
    },
    {
      question: "Une seule personne formée HACCP suffit-elle dans un restaurant ?",
      answer: "Légalement, oui : la formation hygiène HACCP de 14 heures est obligatoire pour au moins une personne présente dans l'établissement (décret n 2011-731). En pratique, dès qu'on dépasse 5 cuisiniers, former un second relais est fortement recommandé."
    },
    {
      question: "Faut-il un calendrier HACCP différent en hiver et en été ?",
      answer: "Le calendrier reste identique mais certaines vigilances varient. En été : surveillance accrue de la chaîne du froid, contrôle plus fréquent des produits sensibles (oeufs, mayonnaise, ceviches). En hiver : attention aux produits maintenus au chaud trop longtemps (raclette, fondue)."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Calendrier HACCP modèle gratuit 2026", url: "https://www.restaumargin.fr/blog/calendrier-haccp-restaurant-modele-gratuit" }
  ]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Calendrier HACCP restaurant : modèle gratuit 2026 (téléchargeable)"
        description="Téléchargez votre calendrier HACCP 2026 gratuit. Toutes les fréquences de contrôle obligatoires, les températures réglementaires, les enregistrements DDPP — modèle prêt à imprimer."
        path="/blog/calendrier-haccp-restaurant-modele-gratuit"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Calendrier HACCP restaurant : modèle gratuit 2026 (téléchargeable)",
            "datePublished": "2026-05-05",
            "dateModified": "2026-05-05",
            "author": { "@type": "Organization", "name": "La rédaction RestauMargin", "url": "https://www.restaumargin.fr/a-propos" },
            "publisher": { "@type": "Organization", "name": "RestauMargin", "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" } },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR"
          })
        }}
      />

      <PublicHeader />

      <BlogArticleHero
        category="HACCP"
        readTime="13 min"
        date="Mai 2026"
        title="Calendrier HACCP restaurant : modèle gratuit 2026 (téléchargeable)"
        accentWord="Calendrier"
        subtitle="Toutes les fréquences de contrôle obligatoires, les températures réglementaires et un modèle prêt à imprimer pour transformer votre HACCP en routine d'équipe."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="header" />

        <div className="prose-content my-10">
          <p>
            Un contrôle DDPP qui débarque un mardi à 11h, c'est la hantise de tout restaurateur. Le contrôleur ne demande pas si vous <em>connaissez</em> la méthode HACCP — il demande à voir vos enregistrements. Et c'est là que beaucoup d'établissements se cassent les dents : la méthode est en place, le matériel suit, mais les relevés n'ont pas été tenus, ou pire, ont été remplis tous d'un coup la veille.
          </p>
          <p>
            Ce guide donne un outil qui résout ce problème durablement : un <strong>calendrier HACCP</strong> structure, qui transforme une obligation réglementaire en routine d'équipe — quotidienne, hebdomadaire, mensuelle, annuelle. Vous trouverez à la fin un <strong>modèle gratuit 2026 prêt à imprimer</strong>, valide pour la restauration commerciale française.
          </p>
        </div>

        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#pourquoi', label: 'Pourquoi un calendrier HACCP, et pas juste un classeur' },
              { href: '#reglementation', label: 'Ce que dit la réglementation 2026' },
              { href: '#quotidien', label: 'Les contrôles quotidiens' },
              { href: '#hebdo', label: 'Les contrôles hebdomadaires' },
              { href: '#mensuel', label: 'Les contrôles mensuels' },
              { href: '#annuel', label: 'Trimestriels et annuels' },
              { href: '#temperatures', label: 'Les températures réglementaires clés' },
              { href: '#tenir', label: 'Comment tenir le calendrier sans s\'épuiser' },
              { href: '#modele', label: 'Le modèle gratuit 2026' },
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

        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="1">
            Pourquoi un calendrier HACCP, et pas juste un classeur ?
          </SectionHeading>
          <div className="prose-content">
            <p>La plupart des restaurants ont un classeur HACCP. Le problème, c'est qu'un classeur <strong>statique</strong> ne dit pas quoi faire <em>aujourd'hui</em>. Il liste les bonnes pratiques, mais ne pilote pas l'exécution.</p>
            <p>Un <strong>calendrier HACCP</strong>, lui, est dynamique. Il répond à une seule question : <em>quelles tâches d'hygiène dois-je accomplir et faire enregistrer aujourd'hui, cette semaine, ce mois ?</em></p>
            <p>Trois bénéfices immédiats :</p>
            <ul>
              <li><strong>Conformité visible</strong> : le contrôleur DDPP voit instantanément la régularité des relevés.</li>
              <li><strong>Responsabilisation</strong> : chaque tâche a un référent (chef, second, plongeur, gérant).</li>
              <li><strong>Prévention</strong> : les écarts sont détectés tôt, pas à la TIAC déclarée.</li>
            </ul>
            <p>Selon une enquête publiée par Neo-Restauration en 2025, <strong>61 % des établissements contrôlés</strong> présentent au moins un écart documentaire. Le calendrier HACCP, bien tenu, supprime ce risque.</p>
          </div>
        </section>

        <section id="reglementation" className="mb-16">
          <SectionHeading icon={<ShieldCheck className="w-6 h-6" />} number="2">
            Ce que dit la réglementation 2026
          </SectionHeading>
          <div className="prose-content">
            <p>Le cadre réglementaire français découle de quatre textes principaux, tous toujours en vigueur en 2026 :</p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Texte</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Champ couvert</th>
                </tr>
              </thead>
              <tbody>
                <RegRow text="Règlement (CE) 178/2002" champ="Principes généraux du droit alimentaire (traçabilité)" color="bg-white" />
                <RegRow text="Règlement (CE) 852/2004" champ="Hygiène des denrées alimentaires (le pilier HACCP)" color="bg-blue-50" />
                <RegRow text="Règlement (CE) 853/2004" champ="Règles spécifiques aux denrées d'origine animale" color="bg-white" />
                <RegRow text="Arrêté du 21 décembre 2009" champ="Températures CHR en France" color="bg-blue-50" />
              </tbody>
            </table>
          </div>
          <div className="prose-content mt-6">
            <Callout type="info">
              <strong>Ce qui a changé pour 2026</strong> : la circulaire DGAL/SDSPA/2024 a renforcé les attentes sur la traçabilité des températures de transport (denrées livrées) et sur la conservation 6 mois minimum des relevés (au lieu de 3 mois auparavant).
            </Callout>
          </div>
        </section>

        <section id="quotidien" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="3">
            Les contrôles quotidiens
          </SectionHeading>
          <div className="prose-content">
            <p>À effectuer chaque jour d'ouverture, regroupés par moment de la journée. Tous doivent être tracés sur fiche papier ou application.</p>
            <h3>Avant le service</h3>
            <ul>
              <li>Température chambre froide positive (0 à +4 degC)</li>
              <li>Température chambre froide négative (≤ −18 degC)</li>
              <li>Température vitrine froide (≤ +4 degC)</li>
              <li>Réception marchandises : thermomètre + bon de livraison conforme</li>
              <li>Inspection visuelle livraisons</li>
              <li>État du nettoyage de la veille</li>
            </ul>
            <h3>Pendant le service</h3>
            <ul>
              <li>Cuisson à coeur : ≥ +63 degC / 30 min ou +70 degC instantané</li>
              <li>Maintien au chaud : ≥ +63 degC</li>
              <li>Refroidissement rapide : +63 degC vers +10 degC en moins de 2h</li>
              <li>Lavage des mains à chaque changement de poste</li>
            </ul>
            <h3>Après le service</h3>
            <ul>
              <li>Nettoyage et désinfection plans de travail (produit EN 1276)</li>
              <li>Vidage et nettoyage poubelles</li>
              <li>Étiquetage DLC secondaire des restes</li>
              <li>Relevé final températures froid</li>
            </ul>
            <Callout type="warning">
              <strong>Règle d'or</strong> : un contrôle non enregistré = un contrôle non effectué, du point de vue d'un inspecteur. Aucune complaisance possible.
            </Callout>
          </div>
        </section>

        <section id="hebdo" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="4">
            Les contrôles hebdomadaires
          </SectionHeading>
          <div className="prose-content">
            <p>Une fois par semaine, prévoir un créneau dédié (souvent le lundi matin avant ouverture).</p>
            <ul>
              <li><strong>Nettoyage approfondi</strong> des chambres froides (sortie produits, lavage murs/sols, désinfection)</li>
              <li><strong>Détartrage et nettoyage des fours</strong></li>
              <li><strong>Vérification des joints</strong> chambres froides et fours</li>
              <li><strong>Test du lave-vaisselle</strong> : rinçage ≥ +82 degC</li>
              <li><strong>Inspection des stocks secs</strong> : rotation FIFO, DLC, présence nuisibles</li>
              <li><strong>Relecture des relevés</strong> : chef ou gérant, anomalies = action corrective documentée</li>
            </ul>
          </div>
        </section>

        <section id="mensuel" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="5">
            Les contrôles mensuels
          </SectionHeading>
          <div className="prose-content">
            <ul>
              <li>Vérification désinsectisation/dératisation (passage prestataire + rapport)</li>
              <li>Test de salubrité plans de travail (bandelettes ATP ou prélèvement laboratoire)</li>
              <li>Audit interne plan de nettoyage</li>
              <li>Inventaire produits d'entretien (niveaux + fiches FDS)</li>
              <li>Bilan formation : un micro-rappel HACCP de 15 min à toute l'équipe</li>
              <li>Sauvegarde numérique des relevés (photo classeur)</li>
            </ul>
            <p>Le micro-rappel mensuel est sous-estimé : c'est lui qui maintient la culture HACCP vivante.</p>
          </div>
        </section>

        <section id="annuel" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="6">
            Les contrôles trimestriels et annuels
          </SectionHeading>
          <div className="prose-content">
            <h3>Trimestriel</h3>
            <ul>
              <li>Étalonnage des sondes thermiques</li>
              <li>Audit fournisseurs (agréments sanitaires)</li>
              <li>Mise à jour de l'analyse des dangers si la carte a changé</li>
            </ul>
            <h3>Annuel</h3>
            <ul>
              <li>Refonte ou révision du Plan de Maîtrise Sanitaire (PMS)</li>
              <li>Renouvellement formation HACCP réglementaire (14h obligatoire pour 1 personne)</li>
              <li>Visite vétérinaire ou audit externe (recommandé)</li>
              <li>Archivage des relevés des 6 derniers mois</li>
            </ul>
          </div>
        </section>

        <section id="temperatures" className="mb-16">
          <SectionHeading icon={<Thermometer className="w-6 h-6" />} number="7">
            Les températures réglementaires à connaître par coeur
          </SectionHeading>
          <div className="prose-content">
            <p>Toute l'équipe en cuisine doit avoir ces seuils en tête. Ce sont les chiffres préférés des contrôleurs DDPP.</p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Étape</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Température</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Source</th>
                </tr>
              </thead>
              <tbody>
                <TempRow etape="Conservation viande/poisson frais" temp="≤ +4 degC" source="Arrêté 21/12/2009" color="bg-white" />
                <TempRow etape="Conservation surgelés" temp="≤ −18 degC" source="Règlement (CE) 853/2004" color="bg-blue-50" />
                <TempRow etape="Cuisson à coeur viande/poisson" temp="≥ +63 degC / 30 min ou ≥ +70 degC instantané" source="Pratique HACCP" color="bg-white" />
                <TempRow etape="Maintien au chaud" temp="≥ +63 degC" source="Arrêté 21/12/2009" color="bg-blue-50" />
                <TempRow etape="Refroidissement rapide" temp="+63 degC → +10 degC en < 2h" source="Arrêté 21/12/2009" color="bg-white" />
                <TempRow etape="Réchauffage" temp="+63 degC à coeur en < 1h" source="Pratique HACCP" color="bg-blue-50" />
                <TempRow etape="Eau chaude lave-mains" temp="≥ +35 degC" source="Code du travail" color="bg-white" />
                <TempRow etape="Rinçage lave-vaisselle" temp="≥ +82 degC" source="Norme EN 1276" color="bg-blue-50" />
              </tbody>
            </table>
          </div>
        </section>

        <section id="tenir" className="mb-16">
          <SectionHeading icon={<CheckCircle className="w-6 h-6" />} number="8">
            Comment tenir le calendrier sans s'épuiser
          </SectionHeading>
          <div className="prose-content">
            <p>Cinq leviers concrets pour éviter la corvée du dimanche soir :</p>
            <ol>
              <li><strong>Désigner un référent par poste</strong> : réception, cuisson, froid, plonge — pas un seul responsable global.</li>
              <li><strong>Imprimer les fiches par jour</strong> et les coller en place (près chambre froide ou four).</li>
              <li><strong>Plastifier le memo des températures</strong> en évidence en cuisine.</li>
              <li><strong>Numériser quotidiennement</strong> : photo du classeur dans un dossier date sur le smartphone du gérant.</li>
              <li><strong>Utiliser un outil numérique</strong> : RestauMargin intègre un module HACCP avec alertes automatiques et archivage 6 mois.</li>
            </ol>
            <Callout type="info">
              Si une tâche prend plus de 30 secondes à enregistrer, elle ne sera pas enregistrée. La simplification est la meilleure garantie de conformité.
            </Callout>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="footer" />

        <section id="modele" className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-white">
            <Download className="w-12 h-12 mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Le modèle gratuit 2026</h2>
            <p className="text-blue-100 max-w-2xl mb-6 leading-relaxed">
              Téléchargez le modèle complet : 12 fiches mensuelles 2026, grilles quotidienne / hebdomadaire / mensuelle, memo températures plastifiable, plan d'actions correctives.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8 text-sm text-white/90">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Format PDF imprimable</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Version Excel et Google Sheets</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Conformité circulaire DGAL 2024</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Memo températures plastifiable</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors">
                Télécharger le modèle gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/blog/haccp-restaurant" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Lire le guide HACCP complet
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Articles complémentaires</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/haccp-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Guide HACCP complet</h3>
              <p className="text-sm text-mono-500">Les 7 principes, températures, checklist quotidienne.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Formation du personnel</h3>
              <p className="text-sm text-mono-500">OPCO, CPF, formations prioritaires HACCP, ROI concret.</p>
            </Link>
            <Link to="/blog/inventaire-restaurant-guide" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Inventaire restaurant</h3>
              <p className="text-sm text-mono-500">Méthode, fréquence, modèle Excel et bonnes pratiques.</p>
            </Link>
          </div>
        </section>

        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            <FAQItem q="Le HACCP est-il obligatoire pour tous les restaurants en France ?" a="Oui. Tout établissement qui prépare et sert des denrées alimentaires est soumis au règlement (CE) 852/2004. Restaurants, brasseries, food trucks, traiteurs, snacks, boulangeries-pâtisseries vendant à consommer sur place sont concernés." />
            <FAQItem q="Combien de temps doit-on conserver les relevés HACCP ?" a="Depuis la circulaire DGAL/SDSPA/2024, la durée minimale est de 6 mois. Beaucoup conservent un an pour sécurité juridique. Format papier ou numérique accepté." />
            <FAQItem q="Que se passe-t-il en cas de relevés manquants lors d'un contrôle DDPP ?" a="Avertissement, mise en demeure 1-3 mois pour régulariser, ou en cas de manquement grave fermeture administrative. Amendes de 450 EUR à 1 500 EUR, plus si TIAC rattachée." />
            <FAQItem q="Une seule personne formée HACCP suffit-elle ?" a="Légalement oui (décret 2011-731), mais dès qu'on dépasse 5 cuisiniers, former un second relais est fortement recommandé." />
            <FAQItem q="Faut-il un calendrier différent en hiver et en été ?" a="Le calendrier reste identique mais en été : surveillance accrue chaîne du froid. En hiver : produits maintenus au chaud (raclette, fondue) — risque si température baisse sous 63 degC." />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
      <h2 className="text-2xl font-bold text-mono-100">{children}</h2>
    </div>
  );
}

function RegRow({ text, champ, color }: { text: string; champ: string; color: string }) {
  return (
    <tr className={color}>
      <td className="px-4 py-3 border-b border-mono-900 font-medium text-mono-100">{text}</td>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{champ}</td>
    </tr>
  );
}

function TempRow({ etape, temp, source, color }: { etape: string; temp: string; source: string; color: string }) {
  return (
    <tr className={color}>
      <td className="px-4 py-3 border-b border-mono-900 font-medium text-mono-100">{etape}</td>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{temp}</td>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{source}</td>
    </tr>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? FileText : AlertTriangle;
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
