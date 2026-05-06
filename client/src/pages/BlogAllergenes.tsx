import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, ShieldAlert, ListChecks, Eye, Users, Utensils, Coffee, AlertTriangle } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogAllergenes() {
  const faqSchema = buildFAQSchema([
    { question: "Doit-on mentionner les traces possibles d'allergenes ?", answer: "Pas obligatoirement (pas dans le reglement INCO), mais fortement recommande si vos plats peuvent en contenir par contamination croisee. Phrase type : Prepare dans une cuisine utilisant gluten, lait, oeufs, fruits a coque." },
    { question: "Si un client demande un plat allergique, suis-je oblige de le preparer ?", answer: "Non, vous pouvez refuser. Mieux vaut refuser que mal preparer. Reponse pro : Je ne peux malheureusement pas garantir l'absence totale de cet allergene dans notre cuisine, je prefere vous proposer un autre plat." },
    { question: "Le QR code menu remplit-il l'obligation INCO ?", answer: "Oui, a condition qu'il soit immediatement consultable (sans connexion 4G defaillante, sans inscription). Beaucoup de DGCCRF preferent encore le classeur papier." },
    { question: "Le sarrasin et la chataigne sont-ils dans la liste ?", answer: "Non. Ce ne sont pas des allergenes obligatoires INCO. Mais le sarrasin est en surveillance dans certains pays. A mentionner volontairement si vous l'utilisez." },
    { question: "Que faire en cas de reaction d'un client en plein service ?", answer: "1. Appeler le 15 (SAMU) immediatement. 2. Demander si le client a un stylo d'adrenaline (Anapen, EpiPen). 3. Allonger le client jambes surelevees. 4. Noter ce qu'il a mange. 5. Conserver le plat consomme pour analyse." }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Allergenes restaurant obligations legales", url: "https://www.restaumargin.fr/blog/allergenes-restaurant-obligations-legales" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Allergenes en restauration : obligations legales et affichage 2026" description="Les 14 allergenes obligatoires INCO, modele d'affichage, sanctions DDPP, allergie severe vs intolerance, et bonnes pratiques en cuisine pour rester conforme." path="/blog/allergenes-restaurant-obligations-legales" type="article" schema={[faqSchema, breadcrumbSchema]} />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg"><ChefHat className="w-7 h-7 text-teal-600" /><span>RestauMargin</span></Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero category="Reglementation" readTime="13 min" date="Mai 2026" title="Allergenes en restauration : obligations legales 2026" accentWord="Allergenes" subtitle="Les 14 allergenes obligatoires, modele d'affichage, sanctions DDPP, bonnes pratiques en cuisine. Le reflexe metier non negociable." />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="header" />

        <div className="prose-content my-10">
          <p>Une cliente arrive en cuisine en pleine crise anaphylactique. Personne dans l'equipe ne sait precisement ce qu'il y a dans la sauce du plat servi. C'est le pire scenario imaginable pour un restaurateur — et il est plus frequent qu'on ne le croit. Connaitre la reglementation allergenes n'est pas une option. C'est un reflexe metier.</p>
        </div>

        <Section icon={<ShieldAlert />} number="1" title="Le cadre legal : reglement INCO">
          <p>Depuis le 13 decembre 2014, le reglement europeen <strong>INCO (1169/2011)</strong> impose la mention obligatoire des <strong>14 allergenes majeurs</strong>. En France, le decret 2015-447 precise les modalites d'affichage. En 2026, la DGCCRF mene 2 vagues de controle ciblees par an, avec amendes systematiques en cas d'absence d'information.</p>
        </Section>

        <Section icon={<ListChecks />} number="2" title="Les 14 allergenes obligatoires">
          <ol>
            <li>Cereales contenant du gluten (ble, seigle, orge, avoine)</li>
            <li>Crustaces</li>
            <li>Oeufs</li>
            <li>Poissons</li>
            <li>Arachides (cacahuetes)</li>
            <li>Soja</li>
            <li>Lait (et lactose)</li>
            <li>Fruits a coque (amandes, noisettes, noix, cajou, pistaches)</li>
            <li>Celeri</li>
            <li>Moutarde</li>
            <li>Graines de sesame</li>
            <li>Anhydride sulfureux et sulfites (&gt; 10 mg/kg ou /L)</li>
            <li>Lupin</li>
            <li>Mollusques</li>
          </ol>
          <p><strong>Important</strong> : la liste est figee. Pas d'autres allergenes obligatoires (sarrasin et kiwi ne sont PAS dans la liste).</p>
        </Section>

        <Section icon={<Eye />} number="3" title="Comment afficher l'information allergenes">
          <p><strong>Option 1</strong> : affichage permanent par plat (Ex : "Magret de canard, sauce moutarde-miel, gratin dauphinois — Contient : gluten, lait, moutarde, sulfites").</p>
          <p><strong>Option 2</strong> : information sur demande. Phrase type : "L'information sur les allergenes presents dans nos plats est tenue a votre disposition sur simple demande. Demandez-nous le classeur allergenes." Le classeur doit lister chaque plat × les 14 allergenes.</p>
          <p>Format obligatoire : caracteres lisibles (taille minimum 1,2 mm), en français, couleur contrastee.</p>
        </Section>

        <Section icon={<AlertTriangle />} number="4" title="Allergie severe vs intolerance">
          <p><strong>Allergie severe</strong> : reaction immunitaire violente parfois fatale (oedeme, choc anaphylactique). Quantite minime suffit. Eviction stricte. 5-7 % des Français.</p>
          <p><strong>Intolerance</strong> (lactose, gluten) : reaction digestive. Pas de risque vital immediat. Tolerance de petites quantites. 15-30 % de la population pour le lactose.</p>
          <p><strong>Pour le restaurateur</strong> : traitez toute mention d'allergene comme une allergie severe (principe de precaution).</p>
        </Section>

        <Section icon={<Utensils />} number="5" title="Bonnes pratiques en cuisine">
          <ul>
            <li>Etiqueter clairement les contenants (farines, sauces, marinades)</li>
            <li>Separer le rangement des allergenes courants</li>
            <li>Listing complet ingredients de chaque preparation</li>
            <li>Planches de decoupe dediees pour client allergique</li>
            <li>Ustensiles propres non utilises sur autres plats</li>
            <li>Friteuses a part si beignets de crevettes ≠ frites</li>
            <li>Lavage des mains entre 2 preparations</li>
            <li>Demander la liste complete des ingredients de tout produit transforme achete</li>
          </ul>
        </Section>

        <Section icon={<Users />} number="6" title="Le role de l'equipe en salle">
          <p>Tous les serveurs doivent connaitre les 14 allergenes par coeur. Procedure : "Si un client mentionne une allergie, je previens immediatement le chef avant de prendre la commande."</p>
          <p>Phrase a integrer : <em>"Avez-vous des allergies ou intolerances dont nous devrions etre informes ?"</em></p>
          <p>Outils : tablette ou classeur consultable en 30 secondes, code couleur sur tickets cuisine ("ALL CRT"), plat marque d'un sticker.</p>
        </Section>

        <Section icon={<Coffee />} number="7" title="Sanctions en cas de non-conformite">
          <p>Amendes administratives DGCCRF : jusqu'a 1 500 EUR (TPE) ou 3 000 EUR en recidive (decret 2015-447). Information erronee ayant entraine prejudice = tromperie (art. L. 441-1 Code conso) : jusqu'a 2 ans de prison + 300 000 EUR d'amende.</p>
          <p>Si reaction anaphylactique grave : mise en danger d'autrui, ou homicide involontaire si deces. Cas judiciaire recent : restaurant condamne a 80 000 EUR de dommages + 6 mois sursis pour avoir servi un plat aux cacahuetes a un client qui avait pourtant prevenu.</p>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="footer" />
        <CTABlock />
        <FAQSection items={[
          { q: "Doit-on mentionner les traces possibles d'allergenes ?", a: "Pas obligatoire (hors INCO), mais recommande. Phrase type : Prepare dans une cuisine utilisant gluten, lait, oeufs, fruits a coque." },
          { q: "Si un client demande un plat allergique, suis-je oblige de le preparer ?", a: "Non, vous pouvez refuser. Mieux vaut refuser que mal preparer." },
          { q: "Le QR code menu remplit-il l'obligation INCO ?", a: "Oui s'il est immediatement consultable. Beaucoup de DGCCRF preferent encore le classeur papier." },
          { q: "Le sarrasin et la chataigne sont-ils dans la liste ?", a: "Non. Pas dans la liste INCO. A mentionner volontairement si utilise." },
          { q: "Que faire en cas de reaction d'un client en plein service ?", a: "1. SAMU 15. 2. Stylo adrenaline si dispo. 3. Allonger jambes surelevees. 4. Noter ce qu'il a mange. 5. Conserver le plat." }
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
      <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Allergenes traces automatiquement avec RestauMargin</h2>
        <p className="text-rose-50 max-w-xl mx-auto mb-8 leading-relaxed">Module fiches techniques : declaration automatique des 14 allergenes par plat, exportable en classeur PDF pret pour la DGCCRF.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-bold rounded-full hover:bg-rose-50 transition-colors">Essayer gratuitement<ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
        <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4"><ChefHat className="w-6 h-6 text-teal-600" />RestauMargin</Link>
        <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
      </div>
    </footer>
  );
}
