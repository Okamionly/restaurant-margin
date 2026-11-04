import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, ShieldAlert, ListChecks, Eye, Users, Utensils, Coffee, AlertTriangle, Truck, FileText } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogAllergenes() {
  const faqSchema = buildFAQSchema([
    { question: "Doit-on mentionner les traces possibles d'allergènes ?", answer: "Pas obligatoirement (pas dans le règlement INCO), mais fortement recommandé si vos plats peuvent en contenir par contamination croisée. Phrase type : Préparé dans une cuisine utilisant gluten, lait, oeufs, fruits à coque." },
    { question: "Si un client demande un plat allergique, suis-je obligé de le préparer ?", answer: "Non, vous pouvez refuser. Mieux vaut refuser que mal préparer. Réponse pro : Je ne peux malheureusement pas garantir l'absence totale de cet allergène dans notre cuisine, je préfère vous proposer un autre plat." },
    { question: "Le QR code menu remplit-il l'obligation INCO ?", answer: "Oui, à condition qu'il soit immédiatement consultable (sans connexion 4G défaillante, sans inscription). Beaucoup de DGCCRF préfèrent encore le classeur papier." },
    { question: "Le sarrasin et la châtaigne sont-ils dans la liste ?", answer: "Non. Ce ne sont pas des allergènes obligatoires INCO. Mais le sarrasin est en surveillance dans certains pays. À mentionner volontairement si vous l'utilisez." },
    { question: "Que faire en cas de réaction d'un client en plein service ?", answer: "1. Appeler le 15 (SAMU) immédiatement. 2. Demander si le client a un stylo d'adrénaline (Anapen, EpiPen). 3. Allonger le client jambes surélevées. 4. Noter ce qu'il a mangé. 5. Conserver le plat consommé pour analyse." },
    { question: "Un menu peut-il être garanti 100% sans allergène ?", answer: "Non. Vous pouvez garantir l'absence d'UN allergène précis dans UN plat donné avec des précautions strictes, mais un menu global zéro risque n'existe pas légalement ni en pratique — le principe de précaution s'applique toujours." },
    { question: "Les allergènes doivent-ils être affichés sur Uber Eats ou Deliveroo ?", answer: "Oui, l'obligation INCO s'applique aussi à la vente à distance. Les plateformes imposent généralement de renseigner les 14 allergènes à la création de chaque fiche produit." },
    { question: "Faut-il former un extra ou un saisonnier dès son premier service ?", answer: "Oui. L'obligation de moyens s'applique dès le premier service, même pour un contrat de quelques heures. Un briefing de 5 minutes sur les 14 allergènes et la procédure d'alerte suffit à couvrir l'essentiel." },
    { question: "Le menu enfant échappe-t-il à l'obligation d'affichage ?", answer: "Non, aucune exception d'âge n'existe dans le règlement INCO. Le menu enfant doit afficher ses allergènes comme n'importe quelle autre carte." },
    { question: "Que risque-t-on si on rassure à tort un client allergique ?", answer: "Une sanction bien plus lourde qu'un simple défaut d'affichage : une fausse information donnée sciemment pour rassurer un client constitue une tromperie aggravée car elle met en jeu sa santé, avec des conséquences pénales nettement plus sévères que l'omission." }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Allergènes restaurant obligations légales", url: "https://www.restaumargin.fr/blog/allergenes-restaurant-obligations-legales" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Allergènes en restauration : obligations légales et affichage 2026" description="Les 14 allergènes obligatoires INCO, modèle d'affichage, sanctions DDPP, allergie sévère vs intolérance, et bonnes pratiques en cuisine pour rester conforme." path="/blog/allergenes-restaurant-obligations-legales" type="article" schema={[faqSchema, breadcrumbSchema]} />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg"><ChefHat className="w-7 h-7 text-teal-600" /><span>RestauMargin</span></Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero category="Réglementation" readTime="17 min" date="Mai 2026" title="Allergènes en restauration : obligations légales 2026" accentWord="Allergènes" subtitle="Les 14 allergènes obligatoires, modèle d'affichage, sanctions DDPP, bonnes pratiques en cuisine. Le réflexe métier non négociable." />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" updatedDate="2026-09-08" readTime="17 min" variant="header" />

        <div className="prose-content my-10">
          <p>Une cliente arrive en cuisine en pleine crise anaphylactique. Personne dans l'équipe ne sait précisément ce qu'il y a dans la sauce du plat servi. C'est le pire scénario imaginable pour un restaurateur — et il est plus fréquent qu'on ne le croit. Connaître la réglementation allergènes n'est pas une option. C'est un réflexe métier.</p>
        </div>

        <Section icon={<ShieldAlert />} number="1" title="Le cadre légal : règlement INCO">
          <p>Depuis le 13 décembre 2014, le règlement européen <strong>INCO (1169/2011)</strong> impose la mention obligatoire des <strong>14 allergènes majeurs</strong>. En France, le décret 2015-447 précise les modalités d'affichage. En 2026, la DGCCRF mène 2 vagues de contrôle ciblées par an, avec amendes systématiques en cas d'absence d'information.</p>
        </Section>

        <Section icon={<ListChecks />} number="2" title="Les 14 allergènes obligatoires">
          <ol>
            <li>Céréales contenant du gluten (blé, seigle, orge, avoine)</li>
            <li>Crustacés</li>
            <li>Oeufs</li>
            <li>Poissons</li>
            <li>Arachides (cacahuètes)</li>
            <li>Soja</li>
            <li>Lait (et lactose)</li>
            <li>Fruits à coque (amandes, noisettes, noix, cajou, pistaches)</li>
            <li>Céleri</li>
            <li>Moutarde</li>
            <li>Graines de sésame</li>
            <li>Anhydride sulfureux et sulfites (&gt; 10 mg/kg ou /L)</li>
            <li>Lupin</li>
            <li>Mollusques</li>
          </ol>
          <p><strong>Important</strong> : la liste est figée. Pas d'autres allergènes obligatoires (sarrasin et kiwi ne sont PAS dans la liste).</p>
        </Section>

        <Section icon={<Eye />} number="3" title="Comment afficher l'information allergènes">
          <p><strong>Option 1</strong> : affichage permanent par plat (Ex : "Magret de canard, sauce moutarde-miel, gratin dauphinois — Contient : gluten, lait, moutarde, sulfites").</p>
          <p><strong>Option 2</strong> : information sur demande. Phrase type : "L'information sur les allergènes présents dans nos plats est tenue à votre disposition sur simple demande. Demandez-nous le classeur allergènes." Le classeur doit lister chaque plat × les 14 allergènes.</p>
          <p>Format obligatoire : caractères lisibles (taille minimum 1,2 mm), en français, couleur contrastée.</p>
        </Section>

        <Section icon={<AlertTriangle />} number="4" title="Allergie sévère vs intolérance">
          <p><strong>Allergie sévère</strong> : réaction immunitaire violente parfois fatale (oedème, choc anaphylactique). Quantité minime suffit. Éviction stricte. 5-7 % des Français.</p>
          <p><strong>Intolérance</strong> (lactose, gluten) : réaction digestive. Pas de risque vital immédiat. Tolérance de petites quantités. 15-30 % de la population pour le lactose.</p>
          <p><strong>Pour le restaurateur</strong> : traitez toute mention d'allergène comme une allergie sévère (principe de précaution).</p>
        </Section>

        <Section icon={<Utensils />} number="5" title="Bonnes pratiques en cuisine">
          <ul>
            <li>Étiqueter clairement les contenants (farines, sauces, marinades)</li>
            <li>Séparer le rangement des allergènes courants</li>
            <li>Listing complet ingrédients de chaque préparation</li>
            <li>Planches de découpe dédiées pour client allergique</li>
            <li>Ustensiles propres non utilisés sur autres plats</li>
            <li>Friteuses à part si beignets de crevettes ≠ frites</li>
            <li>Lavage des mains entre 2 préparations</li>
            <li>Demander la liste complète des ingrédients de tout produit transformé acheté</li>
          </ul>
        </Section>

        <Section icon={<Users />} number="6" title="Le rôle de l'équipe en salle">
          <p>Tous les serveurs doivent connaître les 14 allergènes par coeur. Procédure : "Si un client mentionne une allergie, je préviens immédiatement le chef avant de prendre la commande."</p>
          <p>Phrase à intégrer : <em>"Avez-vous des allergies ou intolérances dont nous devrions être informés ?"</em></p>
          <p>Outils : tablette ou classeur consultable en 30 secondes, code couleur sur tickets cuisine ("ALL CRT"), plat marqué d'un sticker.</p>
        </Section>

        <Section icon={<Coffee />} number="7" title="Sanctions en cas de non-conformité">
          <p>Amendes administratives DGCCRF : jusqu'à 1 500 EUR (TPE) ou 3 000 EUR en récidive (décret 2015-447). Information erronée ayant entraîné préjudice = tromperie (art. L. 441-1 Code conso) : jusqu'à 2 ans de prison + 300 000 EUR d'amende.</p>
          <p>Si réaction anaphylactique grave : mise en danger d'autrui, ou homicide involontaire si décès. Cas judiciaire récent : restaurant condamné à 80 000 EUR de dommages + 6 mois sursis pour avoir servi un plat aux cacahuètes à un client qui avait pourtant prévenu.</p>
        </Section>

        <Section icon={<Truck />} number="8" title="Allergènes en livraison et dark kitchen">
          <p>La vente à distance ne dispense pas de l'obligation INCO. Sur Uber Eats, Deliveroo ou Just Eat, chaque plat doit afficher ses allergènes dans la fiche produit — la plupart des plateformes imposent d'ailleurs de cocher les 14 allergènes à la création de la carte, sous peine de blocage de la fiche.</p>
          <p>Pour une dark kitchen ou un service en cuisine fermée sans contact client, le risque de contamination croisée est identique à celui d'une salle classique, mais le filet de rattrapage disparaît : personne ne peut confirmer une info oralement au dernier moment. Trois réflexes réduisent le risque : scellage systématique des contenants avant remise au livreur, étiquette allergènes collée sur l'emballage (pas seulement dans l'appli), et procédure stricte de double-vérification entre le poste qui prépare et celui qui emballe.</p>
          <p>En cas de commande signalée comme allergène-sensible via l'appli, le meilleur réflexe reste souvent le même qu'en salle : proposer une alternative sûre plutôt que de tenter une adaptation risquée en pleine rush.</p>
        </Section>

        <Section icon={<FileText />} number="9" title="Construire son classeur allergènes en 5 étapes">
          <p>Le classeur allergènes (ou fichier numérique équivalent) est l'outil le plus consulté lors d'un contrôle DGCCRF. Voici la méthode pour le construire sans y passer une semaine :</p>
          <ol>
            <li>Lister tous les plats et boissons de la carte, y compris les suggestions du jour et les à-côtés (sauces, pain, garnitures)</li>
            <li>Décomposer chaque recette ingrédient par ingrédient — pas seulement les produits bruts, mais aussi les produits transformés achetés (sauce soja, fond de veau industriel, moutarde en tube)</li>
            <li>Croiser chaque ingrédient avec la liste des 14 allergènes INCO et cocher les cases concernées</li>
            <li>Faire relire le tableau par un second membre de l'équipe : les oublis viennent presque toujours d'un ingrédient "caché" (sulfites dans un vin de cuisson, moutarde dans une vinaigrette du commerce)</li>
            <li>Mettre à jour le classeur à chaque changement de recette ou de fournisseur — un fournisseur qui change la composition d'un produit transformé peut faire apparaître un allergène du jour au lendemain sans prévenir</li>
          </ol>
          <p>Un logiciel de fiches techniques qui calcule les allergènes automatiquement à partir des ingrédients évite l'essentiel du travail manuel et surtout le risque d'oubli lors d'une mise à jour de recette.</p>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" updatedDate="2026-09-08" readTime="17 min" variant="footer" />
        <CTABlock />

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Articles complémentaires</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/haccp-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Guide HACCP complet</h3>
              <p className="text-sm text-mono-500">Les 7 principes, températures, checklist quotidienne.</p>
            </Link>
            <Link to="/blog/calendrier-haccp-restaurant-modele-gratuit" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calendrier HACCP</h3>
              <p className="text-sm text-mono-500">Modèle gratuit, grilles quotidienne / hebdomadaire / mensuelle.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Formation du personnel</h3>
              <p className="text-sm text-mono-500">OPCO, CPF, formations prioritaires HACCP, ROI concret.</p>
            </Link>
            <Link to="/blog/fiche-technique-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fiche technique restaurant</h3>
              <p className="text-sm text-mono-500">Grammages, coûts matières, allergènes, process de fabrication.</p>
            </Link>
            <Link to="/blog/contrat-travail-restauration-guide" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Contrat de travail en restauration</h3>
              <p className="text-sm text-mono-500">CDD, extra, obligations employeur, guide complet.</p>
            </Link>
          </div>
        </section>

        <FAQSection items={[
          { q: "Doit-on mentionner les traces possibles d'allergènes ?", a: "Pas obligatoire (hors INCO), mais recommandé. Phrase type : Préparé dans une cuisine utilisant gluten, lait, oeufs, fruits à coque." },
          { q: "Si un client demande un plat allergique, suis-je obligé de le préparer ?", a: "Non, vous pouvez refuser. Mieux vaut refuser que mal préparer." },
          { q: "Le QR code menu remplit-il l'obligation INCO ?", a: "Oui s'il est immédiatement consultable. Beaucoup de DGCCRF préfèrent encore le classeur papier." },
          { q: "Le sarrasin et la châtaigne sont-ils dans la liste ?", a: "Non. Pas dans la liste INCO. À mentionner volontairement si utilisé." },
          { q: "Que faire en cas de réaction d'un client en plein service ?", a: "1. SAMU 15. 2. Stylo adrénaline si dispo. 3. Allonger jambes surélevées. 4. Noter ce qu'il a mangé. 5. Conserver le plat." },
          { q: "Un menu peut-il être garanti 100% sans allergène ?", a: "Non. Vous pouvez garantir l'absence d'UN allergène précis dans UN plat donné, mais un menu global zéro risque n'existe pas légalement — le principe de précaution s'applique toujours." },
          { q: "Les allergènes doivent-ils être affichés sur Uber Eats ou Deliveroo ?", a: "Oui, l'obligation INCO s'applique aussi à la vente à distance. Les plateformes imposent généralement de renseigner les 14 allergènes à la création de la fiche produit." },
          { q: "Faut-il former un extra ou un saisonnier dès son premier service ?", a: "Oui. L'obligation de moyens s'applique dès le premier service. Un briefing de 5 minutes sur les 14 allergènes suffit à couvrir l'essentiel." },
          { q: "Le menu enfant échappe-t-il à l'obligation d'affichage ?", a: "Non, aucune exception d'âge n'existe dans le règlement INCO." },
          { q: "Que risque-t-on si on rassure à tort un client allergique ?", a: "Une sanction plus lourde qu'un simple défaut d'affichage : une fausse information donnée sciemment constitue une tromperie aggravée car elle met en jeu la santé du client." }
        ]} />
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ icon, number, title, children }: { icon: React.ReactNode; number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
        <h2 className="text-2xl font-bold text-mono-100">{number}. {title}</h2>
      </div>
      <div className="prose-content">{children}</div>
    </section>
  );
}

function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
            <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">{item.q}<ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTABlock() {
  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl p-8 sm:p-12 text-white text-center">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Allergènes traces automatiquement avec RestauMargin</h2>
        <p className="text-rose-50 max-w-xl mx-auto mb-8 leading-relaxed">Module fiches techniques : déclaration automatique des 14 allergènes par plat, exportable en classeur PDF prêt pour la DGCCRF.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-bold rounded-full hover:bg-rose-50 transition-colors">Essayer gratuitement<ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
        <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4"><ChefHat className="w-6 h-6 text-teal-600" />RestauMargin</Link>
        <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
