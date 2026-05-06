import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Truck, Euro, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogLivraisonRentabilite() {
  const faqSchema = buildFAQSchema([
    { question: "Quelle est la commission moyenne d'Uber Eats en 2026 ?", answer: "28 a 30 % en mode marketplace classique. Reduit a 13-15 % en mode Self-Delivery (vous livrez vous-meme). Tarifs negociables au-dela de 6 mois d'anciennete." },
    { question: "Peut-on appliquer un prix livraison different du prix salle ?", answer: "Oui, legalement et contractuellement. Les CGV plateformes l'autorisent depuis 2022. C'est meme recommande : majorez de 8 a 15 % pour absorber la commission." },
    { question: "Combien coute un site web de commande directe ?", answer: "Entre 30 et 100 EUR par mois (Wix Restaurants 35 EUR, Zelty 60 EUR, custom 200-500 EUR). ROI rapide si vous captez 100 commandes/mois en direct." },
    { question: "La TVA livraison est-elle la meme que sur place ?", answer: "Non. Plats a emporter ou livres = TVA 10 % (ou 5,5 % pour produits non transformes). Place = TVA 10 % aussi pour la nourriture mais 20 % pour l'alcool." },
    { question: "Quels emballages choisir pour la livraison ?", answer: "Privilegier carton kraft (compostable), eviter le plastique, prevoir des compartiments separes (frites/burger), tester en livraison reelle avant de commander en gros." }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Livraison restaurant rentabilite", url: "https://www.restaumargin.fr/blog/livraison-restaurant-rentabilite" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Livraison restaurant : comment la rentabiliser sans s'epuiser (guide 2026)" description="Uber Eats, Deliveroo, JustEat : commissions, marge reelle livraison, plateformes vs propre service. Cas chiffres." path="/blog/livraison-restaurant-rentabilite" type="article" schema={[faqSchema, breadcrumbSchema]} />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero category="Strategie" readTime="12 min" date="Mai 2026" title="Livraison restaurant : comment la rentabiliser sans s'epuiser" accentWord="rentabiliser" subtitle="Commissions plateformes, marge reelle, propre canal vs Uber Eats : la lecture comptable rigoureuse pour choisir." />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="12 min" variant="header" />

        <div className="prose-content my-10">
          <p>La livraison a ete presentee comme la planche de salut des restaurateurs pendant le Covid. Cinq ans plus tard, beaucoup dechantent : commissions de 30 %, plats abimes, notes 1 etoile, equipes saturees. Pour autant, des etablissements continuent a en faire un canal rentable. La difference ? Une <strong>lecture comptable rigoureuse</strong> plutot qu'une posture emotionnelle.</p>
        </div>

        <Section icon={<Euro />} number="1" title="Le poids reel des commissions plateformes">
          <p>En France au printemps 2026, les commissions standard appliquees aux restaurants sont :</p>
          <ul>
            <li><strong>Uber Eats</strong> : 28 % a 30 % + 2 EUR livraison facturee client</li>
            <li><strong>Deliveroo</strong> : 27 % a 32 % + Plus pour visibilite</li>
            <li><strong>JustEat</strong> : 14 % a 30 % selon zone (plus negociable en province)</li>
            <li><strong>Stuart (B2B)</strong> : 5 a 9 EUR par course (vous gerez la commande, eux livrent)</li>
          </ul>
          <p><strong>Vrai cout</strong> sur un panier de 30 EUR HT chez Uber Eats a 30 % de commission : vous facturez 30 EUR au client, plateforme prend 9 EUR, TVA ~3 EUR a reverser, vous touchez <strong>reellement 18 EUR</strong> avant matieres et main-d'oeuvre.</p>
        </Section>

        <Section icon={<Calculator />} number="2" title="Calculer votre marge livraison reelle">
          <p>Exemple pizzeria parisienne, ticket moyen livraison 27 EUR HT, food cost 32 %, commission Uber Eats 28 % :</p>
        </Section>
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-blue-50"><th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Poste</th><th className="text-left px-4 py-3 font-bold text-mono-100 border-b border-mono-900">Montant</th></tr></thead>
            <tbody>
              <Row a="Prix vente HT" b="27,00 EUR" c="bg-white" />
              <Row a="Commission plateforme (28 %)" b="−7,56 EUR" c="bg-blue-50" />
              <Row a="Food cost (32 %)" b="−8,64 EUR" c="bg-white" />
              <Row a="Main d'oeuvre cuisine (8 min × 18 EUR/h)" b="−2,40 EUR" c="bg-blue-50" />
              <Row a="Emballage" b="−1,30 EUR" c="bg-white" />
              <Row a="Commission CB" b="−0,40 EUR" c="bg-blue-50" />
              <Row a="Marge restante" b="6,70 EUR (24,8 %)" c="bg-emerald-50 font-bold" />
            </tbody>
          </table>
        </div>

        <Section icon={<AlertTriangle />} number="3" title="Les couts caches que personne ne compte">
          <ul>
            <li><strong>Erreurs de commande</strong> : article manquant, allergene oublie. Compense + remboursement = 5-10 EUR perdus.</li>
            <li><strong>Notes 1 etoile</strong> : impactent le ranking algo, donc la visibilite.</li>
            <li><strong>Saturation salle</strong> : un coursier qui attend 8 min au comptoir = un client salle qui patiente.</li>
            <li><strong>Materiel dedie</strong> : tablette plateforme, imprimante ticket, support sac chauffant.</li>
            <li><strong>Photos pro</strong> : 300-800 EUR pour shooter votre carte (+3-5 % de commandes en moyenne).</li>
          </ul>
        </Section>

        <Section icon={<TrendingUp />} number="4" title="Strategie 1 : optimiser sur les plateformes">
          <ul>
            <li><strong>Renegocier la commission</strong> au-dela de 6 mois (gain 1-3 points)</li>
            <li><strong>Carte livraison ≠ carte salle</strong> : majorer 8-15 %</li>
            <li><strong>Sortir les plats inadaptes</strong> (tartare, poisson grille). Privilegier burgers, bowls, plats en sauce</li>
            <li><strong>Photos pro + descriptions optimisees</strong> (+15 a 30 % conversion)</li>
            <li><strong>Combos panier moyen</strong> : duo plat + boisson + dessert pour passer de 18 a 28 EUR</li>
          </ul>
        </Section>

        <Section icon={<Target />} number="5" title="Strategie 2 : pousser sa propre livraison">
          <ul>
            <li><strong>Site web</strong> avec commande directe (Wix, Square, Shopify Food, Zelty). 30-100 EUR/mois.</li>
            <li><strong>Stuart, Coursier.fr, Ola</strong> pour la course (sans commission, vous payez 5-9 EUR).</li>
            <li><strong>Communication agressive</strong> : flyer dans chaque sac plateforme, QR code reçu, panneau salle.</li>
            <li><strong>Programme fidelite direct</strong> (10eme offerte, anniversaire, etc.).</li>
          </ul>
          <p>Cible realiste : capter 30-40 % du volume livraison en direct sur 6-12 mois.</p>
        </Section>

        <Section icon={<Truck />} number="6" title="Strategie 3 : modele hybride et ghost kitchen">
          <ul>
            <li><strong>Marque fantome</strong> sur les plateformes pour tester un concept livraison sans devaloriser votre marque salle.</li>
            <li><strong>Ghost kitchen</strong> : louer une cuisine sans salle (Taster, Karavel, Refektory) 1 500-3 000 EUR/mois.</li>
            <li><strong>Cuisine partagee</strong> : economie 30-50 % sur le loyer.</li>
          </ul>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" readTime="12 min" variant="footer" />

        <CTABlock />

        <FAQSection items={[
          { q: "Quelle est la commission moyenne d'Uber Eats en 2026 ?", a: "28 a 30 % en marketplace classique. 13-15 % en Self-Delivery. Negociables apres 6 mois." },
          { q: "Peut-on appliquer un prix livraison different du prix salle ?", a: "Oui. Les CGV plateformes l'autorisent depuis 2022. Recommande : +8 a 15 %." },
          { q: "Combien coute un site web de commande directe ?", a: "30-100 EUR/mois. ROI rapide si 100+ commandes directes/mois." },
          { q: "La TVA livraison est-elle la meme que sur place ?", a: "Plats a emporter / livres = 10 % (ou 5,5 %). Place = 10 % nourriture, 20 % alcool." },
          { q: "Quels emballages choisir ?", a: "Carton kraft compostable, compartiments separes, tester en livraison reelle." }
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
        <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
        <h2 className="text-2xl font-bold text-mono-100">{number}. {title}</h2>
      </div>
      <div className="prose-content">{children}</div>
    </section>
  );
}

function Row({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <tr className={c}>
      <td className="px-4 py-3 border-b border-mono-900 text-mono-400">{a}</td>
      <td className="px-4 py-3 border-b border-mono-900 font-medium text-mono-100">{b}</td>
    </tr>
  );
}

function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
            <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
              {item.q}
              <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
            </summary>
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
      <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Pilotez votre marge livraison avec RestauMargin</h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">Marge reelle plat par plat, plateforme par plateforme. Detectez les plats qui vous coutent de l'argent.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-blue-50 transition-colors">Essayer gratuitement<ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
        <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
          <ChefHat className="w-6 h-6 text-teal-600" />
          RestauMargin
        </Link>
        <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
      </div>
    </footer>
  );
}
