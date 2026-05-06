import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Truck, Wallet, FileText, Shield, MapPin, Utensils, TrendingUp } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogFoodTruck() {
  const faqSchema = buildFAQSchema([
    { question: "Faut-il un permis special pour conduire un food truck ?", answer: "Permis B suffit jusqu'a 3,5 t. Au-dela, permis C requis. La majorite des food trucks recents (Boxer, Sprinter amenages) restent sous 3,5 t." },
    { question: "Peut-on lancer un food truck en micro-entreprise ?", answer: "Oui, jusqu'a 188 700 EUR de CA HT en 2026. Parfait pour tester, mais limitant si vous voulez investir lourdement (pas de TVA recuperable)." },
    { question: "Combien gagne un food truckeur en France ?", answer: "Tres variable. Zone bureaux Paris bien implante : 30 000-50 000 EUR/an net. Festivals saisonniers uniquement : 15 000-25 000 EUR. Marques connues multi-trucks : 70 000+ EUR." },
    { question: "Combien de temps pour rentabiliser l'investissement ?", answer: "12 a 24 mois en moyenne pour un demarrage a 70-90 k EUR. Plus rapide si l'emplacement est exceptionnel, plus long si vous changez frequemment d'endroit." },
    { question: "Faut-il etre deux dans le truck ?", answer: "Au-dela de 60 commandes/jour : oui. Solo viable pour 30-50 commandes/jour ou en festival ponctuel." }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Ouvrir un food truck France 2026", url: "https://www.restaumargin.fr/blog/ouvrir-food-truck-france-guide" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Ouvrir un food truck en France : guide complet 2026" description="Tout pour lancer votre food truck en France en 2026 : reglementation, couts, emplacements, statuts juridiques, plan de rentabilite chiffre." path="/blog/ouvrir-food-truck-france-guide" type="article" schema={[faqSchema, breadcrumbSchema]} />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg"><ChefHat className="w-7 h-7 text-teal-600" /><span>RestauMargin</span></Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero category="Creation" readTime="14 min" date="Mai 2026" title="Ouvrir un food truck en France : guide complet 2026" accentWord="food truck" subtitle="Le food truck rentable n'est pas un camion en mouvement — c'est un mini-restaurant industriel avec contraintes reglementaires lourdes." />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="14 min" variant="header" />

        <div className="prose-content my-10">
          <p>Le food truck a longtemps ete romantise : la liberte, la creativite, l'absence de loyer. La realite est plus nuancee. Ce guide demonte les mythes et donne le mode d'emploi 2026.</p>
        </div>

        <Section icon={<Wallet />} number="1" title="Combien ca coute vraiment ?">
          <ul>
            <li>Camion d'occasion : 15 000-30 000 EUR</li>
            <li>Amenagement interieur : 20 000-60 000 EUR</li>
            <li>Equipement chaud (plancha, friteuse, four) : 5 000-15 000 EUR</li>
            <li>Habillage exterieur : 1 500-5 000 EUR</li>
            <li>Caisse + admin : 800-2 500 EUR</li>
            <li>Stock initial + tresorerie 3 mois : 9 500-24 000 EUR</li>
            <li>Frais creation + assurances : 2 000-5 000 EUR</li>
          </ul>
          <p><strong>Total realiste : 70 000-90 000 EUR pour demarrer correctement.</strong></p>
        </Section>

        <Section icon={<Truck />} number="2" title="Choisir le bon vehicule">
          <ul>
            <li><strong>Camion classique</strong> (Type H, J9, Sprinter) : charme + visibilite, mais Crit'Air contraignant en ville</li>
            <li><strong>Remorque tractable</strong> : economique, mobilite limitee</li>
            <li><strong>Jumper / Boxer amenages</strong> : compromis 2026, Crit'Air 2 si recent → ZFE OK</li>
          </ul>
          <p>En 2026, les ZFE filtrent durement les vehicules anciens. Verifiez la classe Crit'Air avant d'acheter.</p>
        </Section>

        <Section icon={<FileText />} number="3" title="Statut juridique et demarches">
          <ul>
            <li><strong>Micro-entreprise</strong> : charges allegees, plafond 188 700 EUR HT, pas de TVA recuperable</li>
            <li><strong>EURL / SASU</strong> : TVA recuperable, responsabilite limitee — choix realiste si investissement &gt; 60 000 EUR</li>
            <li><strong>SAS / SARL</strong> : plusieurs associes, image pro, charges plus lourdes</li>
          </ul>
          <p>Demarches obligatoires : carte commerçant ambulant, permis exploitation alcool si vente, formation HACCP 14h, immatriculation RCS, assurance RC pro, declaration DDPP.</p>
        </Section>

        <Section icon={<Shield />} number="4" title="Reglementation hygiene et securite">
          <p>Memes obligations HACCP qu'un restaurant traditionnel : PMS a jour, releves temperature quotidiens, lave-mains eau chaude (≥35 degC), cuves eau propre + eau usee, conservation releves 6 mois minimum.</p>
          <p>Specificites vehicule : sortie d'air et hotte certifiee, extincteur 6kg poudre + couverture anti-feu, bouteille gaz fixee NF M88-705, controle technique pro tous les 1-2 ans.</p>
        </Section>

        <Section icon={<MapPin />} number="5" title="Trouver des emplacements rentables">
          <p>L'emplacement = 70 % du succes. Cinq typologies rentables :</p>
          <ol>
            <li><strong>Marches alimentaires</strong> : abonnement mairie 15-50 EUR/jour, public stable</li>
            <li><strong>Zones de bureaux</strong> (La Defense, Part-Dieu, Euralille) : volume tres haut sur 2h</li>
            <li><strong>Festivals et evenements</strong> : 200-800 EUR/jour, 500-1500 commandes</li>
            <li><strong>Stationnement permanent prive</strong> : 800-3 000 EUR/mois, flux quotidien</li>
            <li><strong>Tournee digitale</strong> : Instagram + emplacements annonces 24h a l'avance</li>
          </ol>
          <p>Demarches voie publique : AOT mairie 50-300 EUR/mois.</p>
        </Section>

        <Section icon={<Utensils />} number="6" title="Construire un menu food truck efficace">
          <ul>
            <li>Maximum 6 a 10 plats</li>
            <li>Plat signature unique</li>
            <li>Preparation possible 80 % avant le rush</li>
            <li>Ticket moyen cible : 12-15 EUR marche, 8-12 EUR bureaux, 14-18 EUR festival</li>
            <li>Food cost ≤ 30 %</li>
          </ul>
        </Section>

        <Section icon={<TrendingUp />} number="7" title="Plan de rentabilite chiffre">
          <p>Hypothese food truck zone bureaux Paris : 220 jours/an, 80 commandes/jour, ticket moyen 13 EUR = <strong>CA annuel HT 228 800 EUR</strong>.</p>
          <p>Charges totales : 76,5 % du CA = 175 032 EUR. <strong>EBE : 53 768 EUR</strong> (23,5 %). Apres amortissement camion : <strong>30 000-40 000 EUR/an net pour le gerant</strong>.</p>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" readTime="14 min" variant="footer" />
        <CTABlock />
        <FAQSection items={[
          { q: "Faut-il un permis special pour conduire un food truck ?", a: "Permis B jusqu'a 3,5 t. Permis C au-dela. La majorite des amenagements recents restent sous 3,5 t." },
          { q: "Peut-on lancer en micro-entreprise ?", a: "Oui jusqu'a 188 700 EUR HT. Limitant si gros investissement (pas de TVA recuperable)." },
          { q: "Combien gagne un food truckeur ?", a: "30-50 k EUR/an net en zone bureaux Paris bien implante. 15-25 k EUR si saisonnier uniquement." },
          { q: "Combien de temps pour rentabiliser ?", a: "12-24 mois en moyenne." },
          { q: "Faut-il etre deux dans le truck ?", a: "Au-dela de 60 commandes/jour : oui. Solo viable a 30-50 commandes ou festival." }
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
      <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Pilotez votre food truck avec RestauMargin</h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">Calculateur de marge specifique food truck : food cost mobile, AOT, emballage. Essai gratuit 14 jours.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-blue-50 transition-colors">Essayer gratuitement<ArrowRight className="w-4 h-4" /></Link>
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
