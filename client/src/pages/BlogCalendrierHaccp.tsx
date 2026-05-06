import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Calendar, ShieldCheck, Thermometer, ClipboardList, AlertTriangle, CheckCircle, Download, FileText } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogCalendrierHaccp() {
  const faqSchema = buildFAQSchema([
    {
      question: "Le HACCP est-il obligatoire pour tous les restaurants en France ?",
      answer: "Oui. Tout etablissement qui prepare et sert des denrees alimentaires est soumis au reglement (CE) 852/2004 et doit appliquer une demarche fondee sur les principes HACCP. Restaurants, brasseries, food trucks, traiteurs, snacks, boulangeries-patisseries vendant a consommer sur place sont concernes."
    },
    {
      question: "Combien de temps doit-on conserver les releves HACCP ?",
      answer: "Depuis la circulaire DGAL/SDSPA/2024, la duree minimale est de 6 mois. Beaucoup d'entreprises conservent un an pour securite juridique. Le format peut etre papier ou numerique du moment que les releves sont accessibles immediatement lors d'un controle."
    },
    {
      question: "Que se passe-t-il en cas de releves manquants lors d'un controle DDPP ?",
      answer: "Le controleur peut emettre un avertissement, demander une mise en demeure (1 a 3 mois pour regulariser), ou en cas de manquement grave, prononcer une fermeture administrative. Les amendes vont de 450 EUR a 1 500 EUR, et plus si une intoxication alimentaire est rattachee."
    },
    {
      question: "Une seule personne formee HACCP suffit-elle dans un restaurant ?",
      answer: "Legalement, oui : la formation hygiene HACCP de 14 heures est obligatoire pour au moins une personne presente dans l'etablissement (decret n 2011-731). En pratique, des qu'on depasse 5 cuisiniers, former un second relais est fortement recommande."
    },
    {
      question: "Faut-il un calendrier HACCP different en hiver et en ete ?",
      answer: "Le calendrier reste identique mais certaines vigilances varient. En ete : surveillance accrue de la chaine du froid, controle plus frequent des produits sensibles (oeufs, mayonnaise, ceviches). En hiver : attention aux produits maintenus au chaud trop longtemps (raclette, fondue)."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Calendrier HACCP modele gratuit 2026", url: "https://www.restaumargin.fr/blog/calendrier-haccp-restaurant-modele-gratuit" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Calendrier HACCP restaurant : modele gratuit 2026 (telechargeable)"
        description="Telechargez votre calendrier HACCP 2026 gratuit. Toutes les frequences de controle obligatoires, les temperatures reglementaires, les enregistrements DDPP — modele pret a imprimer."
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
            "headline": "Calendrier HACCP restaurant : modele gratuit 2026 (telechargeable)",
            "datePublished": "2026-05-05",
            "dateModified": "2026-05-05",
            "author": { "@type": "Organization", "name": "La redaction RestauMargin", "url": "https://www.restaumargin.fr/a-propos" },
            "publisher": { "@type": "Organization", "name": "RestauMargin", "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" } },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR"
          })
        }}
      />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/outils/calculateur-food-cost" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors">
              <Calculator className="w-4 h-4" />
              Calculer mon food cost
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
          </div>
        </div>
      </nav>

      <BlogArticleHero
        category="HACCP"
        readTime="13 min"
        date="Mai 2026"
        title="Calendrier HACCP restaurant : modele gratuit 2026 (telechargeable)"
        accentWord="Calendrier"
        subtitle="Toutes les frequences de controle obligatoires, les temperatures reglementaires et un modele pret a imprimer pour transformer votre HACCP en routine d'equipe."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="header" />

        <div className="prose-content my-10">
          <p>
            Un controle DDPP qui debarque un mardi a 11h, c'est la hantise de tout restaurateur. Le controleur ne demande pas si vous <em>connaissez</em> la methode HACCP — il demande a voir vos enregistrements. Et c'est la que beaucoup d'etablissements se cassent les dents : la methode est en place, le materiel suit, mais les releves n'ont pas ete tenus, ou pire, ont ete remplis tous d'un coup la veille.
          </p>
          <p>
            Ce guide donne le seul outil qui resout ce probleme durablement : un <strong>calendrier HACCP</strong> structure, qui transforme une obligation reglementaire en routine d'equipe — quotidienne, hebdomadaire, mensuelle, annuelle. Vous trouverez a la fin un <strong>modele gratuit 2026 pret a imprimer</strong>, valide pour la restauration commerciale francaise.
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
              { href: '#reglementation', label: 'Ce que dit la reglementation 2026' },
              { href: '#quotidien', label: 'Les controles quotidiens' },
              { href: '#hebdo', label: 'Les controles hebdomadaires' },
              { href: '#mensuel', label: 'Les controles mensuels' },
              { href: '#annuel', label: 'Trimestriels et annuels' },
              { href: '#temperatures', label: 'Les temperatures reglementaires cles' },
              { href: '#tenir', label: 'Comment tenir le calendrier sans s\'epuiser' },
              { href: '#modele', label: 'Le modele gratuit 2026' },
              { href: '#faq', label: 'Questions frequentes' },
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
            <p>La plupart des restaurants ont un classeur HACCP. Le probleme, c'est qu'un classeur <strong>statique</strong> ne dit pas quoi faire <em>aujourd'hui</em>. Il liste les bonnes pratiques, mais ne pilote pas l'execution.</p>
            <p>Un <strong>calendrier HACCP</strong>, lui, est dynamique. Il repond a une seule question : <em>quelles taches d'hygiene dois-je accomplir et faire enregistrer aujourd'hui, cette semaine, ce mois ?</em></p>
            <p>Trois benefices immediats :</p>
            <ul>
              <li><strong>Conformite visible</strong> : le controleur DDPP voit instantanement la regularite des releves.</li>
              <li><strong>Responsabilisation</strong> : chaque tache a un referent (chef, second, plongeur, gerant).</li>
              <li><strong>Prevention</strong> : les ecarts sont detectes tot, pas a la TIAC declaree.</li>
            </ul>
            <p>Selon une enquete publiee par Neo-Restauration en 2025, <strong>61 % des etablissements controles</strong> presentent au moins un ecart documentaire. Le calendrier HACCP, bien tenu, supprime ce risque.</p>
          </div>
        </section>

        <section id="reglementation" className="mb-16">
          <SectionHeading icon={<ShieldCheck className="w-6 h-6" />} number="2">
            Ce que dit la reglementation 2026
          </SectionHeading>
          <div className="prose-content">
            <p>Le cadre reglementaire francais decoule de quatre textes principaux, tous toujours en vigueur en 2026 :</p>
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
                <RegRow text="Reglement (CE) 178/2002" champ="Principes generaux du droit alimentaire (tracabilite)" color="bg-white" />
                <RegRow text="Reglement (CE) 852/2004" champ="Hygiene des denrees alimentaires (le pilier HACCP)" color="bg-blue-50" />
                <RegRow text="Reglement (CE) 853/2004" champ="Regles specifiques aux denrees d'origine animale" color="bg-white" />
                <RegRow text="Arrete du 21 decembre 2009" champ="Temperatures CHR en France" color="bg-blue-50" />
              </tbody>
            </table>
          </div>
          <div className="prose-content mt-6">
            <Callout type="info">
              <strong>Ce qui a change pour 2026</strong> : la circulaire DGAL/SDSPA/2024 a renforce les attentes sur la tracabilite des temperatures de transport (denrees livrees) et sur la conservation 6 mois minimum des releves (au lieu de 3 mois auparavant).
            </Callout>
          </div>
        </section>

        <section id="quotidien" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="3">
            Les controles quotidiens
          </SectionHeading>
          <div className="prose-content">
            <p>A effectuer chaque jour d'ouverture, regroupes par moment de la journee. Tous doivent etre traces sur fiche papier ou application.</p>
            <h3>Avant le service</h3>
            <ul>
              <li>Temperature chambre froide positive (0 a +4 degC)</li>
              <li>Temperature chambre froide negative (≤ −18 degC)</li>
              <li>Temperature vitrine froide (≤ +4 degC)</li>
              <li>Reception marchandises : thermometre + bon de livraison conforme</li>
              <li>Inspection visuelle livraisons</li>
              <li>Etat du nettoyage de la veille</li>
            </ul>
            <h3>Pendant le service</h3>
            <ul>
              <li>Cuisson a coeur : ≥ +63 degC / 30 min ou +70 degC instantane</li>
              <li>Maintien au chaud : ≥ +63 degC</li>
              <li>Refroidissement rapide : +63 degC vers +10 degC en moins de 2h</li>
              <li>Lavage des mains a chaque changement de poste</li>
            </ul>
            <h3>Apres le service</h3>
            <ul>
              <li>Nettoyage et desinfection plans de travail (produit EN 1276)</li>
              <li>Vidage et nettoyage poubelles</li>
              <li>Etiquetage DLC secondaire des restes</li>
              <li>Releve final temperatures froid</li>
            </ul>
            <Callout type="warning">
              <strong>Regle d'or</strong> : un controle non enregistre = un controle non effectue, du point de vue d'un inspecteur. Aucune complaisance possible.
            </Callout>
          </div>
        </section>

        <section id="hebdo" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="4">
            Les controles hebdomadaires
          </SectionHeading>
          <div className="prose-content">
            <p>Une fois par semaine, prevoir un creneau dedie (souvent le lundi matin avant ouverture).</p>
            <ul>
              <li><strong>Nettoyage approfondi</strong> des chambres froides (sortie produits, lavage murs/sols, desinfection)</li>
              <li><strong>Detartrage et nettoyage des fours</strong></li>
              <li><strong>Verification des joints</strong> chambres froides et fours</li>
              <li><strong>Test du lave-vaisselle</strong> : rincage ≥ +82 degC</li>
              <li><strong>Inspection des stocks secs</strong> : rotation FIFO, DLC, presence nuisibles</li>
              <li><strong>Relecture des releves</strong> : chef ou gerant, anomalies = action corrective documentee</li>
            </ul>
          </div>
        </section>

        <section id="mensuel" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="5">
            Les controles mensuels
          </SectionHeading>
          <div className="prose-content">
            <ul>
              <li>Verification desinsectisation/deratisation (passage prestataire + rapport)</li>
              <li>Test de salubrite plans de travail (bandelettes ATP ou prelevement laboratoire)</li>
              <li>Audit interne plan de nettoyage</li>
              <li>Inventaire produits d'entretien (niveaux + fiches FDS)</li>
              <li>Bilan formation : un micro-rappel HACCP de 15 min a toute l'equipe</li>
              <li>Sauvegarde numerique des releves (photo classeur)</li>
            </ul>
            <p>Le micro-rappel mensuel est sous-estime : c'est lui qui maintient la culture HACCP vivante.</p>
          </div>
        </section>

        <section id="annuel" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="6">
            Les controles trimestriels et annuels
          </SectionHeading>
          <div className="prose-content">
            <h3>Trimestriel</h3>
            <ul>
              <li>Etalonnage des sondes thermiques</li>
              <li>Audit fournisseurs (agrements sanitaires)</li>
              <li>Mise a jour de l'analyse des dangers si la carte a change</li>
            </ul>
            <h3>Annuel</h3>
            <ul>
              <li>Refonte ou revision du Plan de Maitrise Sanitaire (PMS)</li>
              <li>Renouvellement formation HACCP reglementaire (14h obligatoire pour 1 personne)</li>
              <li>Visite veterinaire ou audit externe (recommande)</li>
              <li>Archivage des releves des 6 derniers mois</li>
            </ul>
          </div>
        </section>

        <section id="temperatures" className="mb-16">
          <SectionHeading icon={<Thermometer className="w-6 h-6" />} number="7">
            Les temperatures reglementaires a connaitre par coeur
          </SectionHeading>
          <div className="prose-content">
            <p>Toute l'equipe en cuisine doit avoir ces seuils en tete. Ce sont les chiffres preferes des controleurs DDPP.</p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Etape</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Temperature</th>
                  <th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Source</th>
                </tr>
              </thead>
              <tbody>
                <TempRow etape="Conservation viande/poisson frais" temp="≤ +4 degC" source="Arrete 21/12/2009" color="bg-white" />
                <TempRow etape="Conservation surgeles" temp="≤ −18 degC" source="Reglement (CE) 853/2004" color="bg-blue-50" />
                <TempRow etape="Cuisson a coeur viande/poisson" temp="≥ +63 degC / 30 min ou ≥ +70 degC instantane" source="Pratique HACCP" color="bg-white" />
                <TempRow etape="Maintien au chaud" temp="≥ +63 degC" source="Arrete 21/12/2009" color="bg-blue-50" />
                <TempRow etape="Refroidissement rapide" temp="+63 degC → +10 degC en < 2h" source="Arrete 21/12/2009" color="bg-white" />
                <TempRow etape="Rechauffage" temp="+63 degC a coeur en < 1h" source="Pratique HACCP" color="bg-blue-50" />
                <TempRow etape="Eau chaude lave-mains" temp="≥ +35 degC" source="Code du travail" color="bg-white" />
                <TempRow etape="Rincage lave-vaisselle" temp="≥ +82 degC" source="Norme EN 1276" color="bg-blue-50" />
              </tbody>
            </table>
          </div>
        </section>

        <section id="tenir" className="mb-16">
          <SectionHeading icon={<CheckCircle className="w-6 h-6" />} number="8">
            Comment tenir le calendrier sans s'epuiser
          </SectionHeading>
          <div className="prose-content">
            <p>Cinq leviers concrets pour eviter la corvee du dimanche soir :</p>
            <ol>
              <li><strong>Designer un referent par poste</strong> : reception, cuisson, froid, plonge — pas un seul responsable global.</li>
              <li><strong>Imprimer les fiches par jour</strong> et les coller en place (pres chambre froide ou four).</li>
              <li><strong>Plastifier le memo des temperatures</strong> en evidence en cuisine.</li>
              <li><strong>Numeriser quotidiennement</strong> : photo du classeur dans un dossier date sur le smartphone du gerant.</li>
              <li><strong>Utiliser un outil numerique</strong> : RestauMargin integre un module HACCP avec alertes automatiques et archivage 6 mois.</li>
            </ol>
            <Callout type="info">
              Si une tache prend plus de 30 secondes a enregistrer, elle ne sera pas enregistree. La simplification est la meilleure garantie de conformite.
            </Callout>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="footer" />

        <section id="modele" className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-white">
            <Download className="w-12 h-12 mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Le modele gratuit 2026</h2>
            <p className="text-blue-100 max-w-2xl mb-6 leading-relaxed">
              Telechargez le modele complet : 12 fiches mensuelles 2026, grilles quotidienne / hebdomadaire / mensuelle, memo temperatures plastifiable, plan d'actions correctives.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8 text-sm text-white/90">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Format PDF imprimable</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Version Excel et Google Sheets</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Conformite circulaire DGAL 2024</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Memo temperatures plastifiable</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors">
                Telecharger le modele gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/blog/haccp-restaurant" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Lire le guide HACCP complet
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Articles complementaires</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/haccp-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Guide HACCP complet</h3>
              <p className="text-sm text-mono-500">Les 7 principes, temperatures, checklist quotidienne.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Formation du personnel</h3>
              <p className="text-sm text-mono-500">OPCO, CPF, formations prioritaires HACCP, ROI concret.</p>
            </Link>
            <Link to="/blog/inventaire-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Inventaire restaurant</h3>
              <p className="text-sm text-mono-500">Methode, frequence, modele Excel et bonnes pratiques.</p>
            </Link>
          </div>
        </section>

        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            <FAQItem q="Le HACCP est-il obligatoire pour tous les restaurants en France ?" a="Oui. Tout etablissement qui prepare et sert des denrees alimentaires est soumis au reglement (CE) 852/2004. Restaurants, brasseries, food trucks, traiteurs, snacks, boulangeries-patisseries vendant a consommer sur place sont concernes." />
            <FAQItem q="Combien de temps doit-on conserver les releves HACCP ?" a="Depuis la circulaire DGAL/SDSPA/2024, la duree minimale est de 6 mois. Beaucoup conservent un an pour securite juridique. Format papier ou numerique accepte." />
            <FAQItem q="Que se passe-t-il en cas de releves manquants lors d'un controle DDPP ?" a="Avertissement, mise en demeure 1-3 mois pour regulariser, ou en cas de manquement grave fermeture administrative. Amendes de 450 EUR a 1 500 EUR, plus si TIAC rattachee." />
            <FAQItem q="Une seule personne formee HACCP suffit-elle ?" a="Legalement oui (decret 2011-731), mais des qu'on depasse 5 cuisiniers, former un second relais est fortement recommande." />
            <FAQItem q="Faut-il un calendrier different en hiver et en ete ?" a="Le calendrier reste identique mais en ete : surveillance accrue chaine du froid. En hiver : produits maintenus au chaud (raclette, fondue) — risque si temperature baisse sous 63 degC." />
          </div>
        </section>
      </main>

      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
        </div>
      </footer>
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
