import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, BarChart3, TrendingUp, Clock, Star, Target, Users, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogKpiGuide() {
  const faqSchema = buildFAQSchema([
    {
      question: "Combien de KPI suivre quand je débute ?",
      answer: "Commencez par 4 : food cost, ticket moyen, taux d'occupation, note Google. Une fois maîtrisés (3-6 mois), ajoutez prime cost et RevPASH."
    },
    {
      question: "À quelle fréquence calculer le food cost ?",
      answer: "Hebdomadairement avec un inventaire flash sur les 10 produits stratégiques (80 % de la valeur), et mensuellement avec un inventaire complet."
    },
    {
      question: "Mon food cost est à 38 %, est-ce grave ?",
      answer: "Oui, sauf en gastronomie. Auditez 4 axes : prix d'achat, pertes (FIFO mal appliqué ?), portionnement (grammages réels vs fiches techniques), et pricing."
    },
    {
      question: "Quel logiciel pour automatiser le suivi ?",
      answer: "Pour un restaurant indépendant, RestauMargin suffit largement et coûte moins de 50 €/mois. Pour les groupes multi-sites : Innovorder, Tiller Insights ou Lightspeed Analytics."
    },
    {
      question: "Comment impliquer mon équipe dans le suivi des KPI ?",
      answer: "Affichez 2-3 KPI clés en cuisine (food cost de la semaine, ticket moyen) et instaurez une prime trimestrielle indexée sur leur amélioration. La transparence motive davantage que le contrôle."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'KPI restaurateur', url: 'https://www.restaumargin.fr/blog/kpi-restaurateur' },
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Les 10 KPI essentiels pour piloter son restaurant en 2026"
        description="Food cost, prime cost, RevPASH, ticket moyen… Les indicateurs clés de performance indispensables pour gérer un restaurant rentable."
        path="/blog/kpi-restaurateur"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Les 10 KPI essentiels pour piloter son restaurant en 2026",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/kpi-restaurateur"
          })
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <BlogArticleHero
        category="Marges"
        readTime="13 min"
        date="Avril 2026"
        title="Les 10 KPI essentiels pour piloter son restaurant en 2026"
        accentWord="KPI"
        subtitle="En 2026, marge nette moyenne sous les 5 % et inflation matières +6 %/an : piloter &quot;au feeling&quot; est devenu un luxe."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          <strong>60 % des restaurants qui ferment dans les trois premières années ne suivent aucun indicateur autre que leur CA quotidien.</strong> Voici les 10 KPI réellement actionnables, leurs formules exactes, les benchmarks 2026, et la manière concrète de bâtir votre tableau de bord hebdomadaire.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#food-cost" className="hover:text-teal-600 transition-colors">1. Food Cost %</a></li>
            <li><a href="#prime-cost" className="hover:text-teal-600 transition-colors">2. Prime Cost</a></li>
            <li><a href="#occupation" className="hover:text-teal-600 transition-colors">3. Taux d'occupation des tables</a></li>
            <li><a href="#ticket" className="hover:text-teal-600 transition-colors">4. Ticket moyen et CA par couvert</a></li>
            <li><a href="#revpash" className="hover:text-teal-600 transition-colors">5. RevPASH et point mort</a></li>
            <li><a href="#tableau-bord" className="hover:text-teal-600 transition-colors">6. Construire son tableau de bord</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="food-cost" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Food Cost %</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            LE KPI fondateur. Il mesure la part de votre CA absorbée par l'achat des ingrédients.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Food Cost % = (Coût matières / CA HT) × 100
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Benchmarks 2026 :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Bistronomie / gastronomie : 28-32 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Restaurant traditionnel : 30-35 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Pizzeria / italien : 25-30 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Burger / fast casual : 28-33 %</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un restaurant qui fait 30 000 € de CA avec 10 500 € de coût matières affiche un food cost de 35 %. En réduisant à 32 %, il économise <strong>900 €/mois</strong>, soit 10 800 € de marge nette annuelle.
          </p>
        </section>

        {/* Section 2 */}
        <section id="prime-cost" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Prime Cost</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            L'indicateur ultime de rentabilité opérationnelle. La règle : <strong>prime cost ≤ 60 %</strong>, sinon le restaurant est en danger.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Prime Cost = Food Cost + Coût personnel (charges incluses)
          </div>
          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-red-700">Seuils 2026 (post-revalorisation SMIC)</p>
            <p className="text-sm text-red-600">Excellent ≤ 60 % · Bon 60-65 % · Inquiétant 65-70 % · Critique &gt; 70 %</p>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Une fois le prime cost déduit, il vous reste 30-35 % du CA pour couvrir loyer, énergie, marketing et marge nette. Si le prime cost dépasse 70 %, mathématiquement vous perdez de l'argent.
          </p>
        </section>

        {/* Section 3 */}
        <section id="occupation" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Taux d'occupation des tables</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Mesuré par service et par jour, ce KPI révèle votre capacité commerciale réelle.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Taux d'occupation = (Couverts / Capacité max) × 100
          </div>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Midi semaine : 70-90 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Soir semaine : 60-80 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Vendredi/samedi soir : 90-100 % (avec 2 services)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Dimanche midi : 80-100 %</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Un taux &lt; 50 % le vendredi soir = signal d'alarme commercial. À l'inverse, &gt; 95 % systématique = vous perdez des clients faute de place : envisagez un deuxième service.
          </p>
        </section>

        {/* Section 4 */}
        <section id="ticket" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Ticket moyen et CA par couvert</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>ticket moyen</strong> reflète la stratégie de menu et l'upsell. Le <strong>CA par couvert</strong> intègre les groupes (par personne, pas par ticket).
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Ticket moyen = CA HT / Nombre de tickets</div>
            <div>CA/couvert = CA total HT / Nombre de personnes</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Benchmarks 2026 (TTC) :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Pizzeria de quartier : 18-25 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Brasserie : 25-35 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Bistronomie : 35-55 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Gastronomique : 80-150 €</li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Former l'équipe à l'upsell (entrée + dessert + verre de vin) peut faire gagner 3-5 € par couvert, soit potentiellement <strong>+15 % de CA</strong> sans coût additionnel.
          </p>
        </section>

        {/* Section 5 */}
        <section id="revpash" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. RevPASH et point mort</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>RevPASH</strong> (Revenue Per Available Seat Hour) mesure la rentabilité par siège et par heure d'ouverture.
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            RevPASH = CA HT / (Nombre de places × Heures)
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Exemple : 50 places, 6h d'ouverture, 1 800 € de CA → RevPASH = <strong>6 €/siège/heure</strong>. Cibles : 5-10 € traditionnel, 8-15 € bistronomie, 20-40 € gastronomique.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le <strong>point mort</strong> est le CA minimum pour ne pas perdre d'argent :
          </p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111]">
            Point mort = Charges fixes / Taux MCV
          </div>
          <p className="text-[#374151] leading-relaxed">
            Charges fixes 18 000 €, taux MCV 45 % → point mort 40 000 €/mois. Un compteur "CA réalisé / Point mort" affiché en cuisine motive l'équipe.
          </p>
        </section>

        {/* Section 6 */}
        <section id="tableau-bord" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Construire son tableau de bord</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Quotidien (5 min, fin de service) :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> CA du jour vs objectif</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Nombre de couverts</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Ticket moyen + avis reçus</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Hebdomadaire (30 min, lundi) :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Food cost (inventaire flash 5 produits)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Prime cost · Taux d'occupation · RevPASH</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Mensuel (2h, début de mois) :</strong></p>
          <ul className="space-y-2 text-[#374151]">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Tous les KPI · Point mort vs CA · Marge brute par catégorie</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Rotation des stocks · NPS et avis Google</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Combien de KPI suivre quand je débute ?",
                a: "Commencez par 4 : food cost, ticket moyen, taux d'occupation, note Google. Une fois maîtrisés (3-6 mois), ajoutez prime cost et RevPASH."
              },
              {
                q: "À quelle fréquence calculer le food cost ?",
                a: "Hebdomadairement avec un inventaire flash sur les 10 produits stratégiques (80 % de la valeur), et mensuellement avec un inventaire complet."
              },
              {
                q: "Mon food cost est à 38 %, est-ce grave ?",
                a: "Oui, sauf en gastronomie. Auditez 4 axes : prix d'achat, pertes (FIFO mal appliqué ?), portionnement (grammages réels vs fiches techniques), et pricing."
              },
              {
                q: "Quel logiciel pour automatiser le suivi ?",
                a: "Pour un restaurant indépendant, RestauMargin suffit largement et coûte moins de 50 €/mois. Pour les groupes multi-sites : Innovorder, Tiller Insights ou Lightspeed Analytics."
              },
              {
                q: "Comment impliquer mon équipe dans le suivi des KPI ?",
                a: "Affichez 2-3 KPI clés en cuisine (food cost de la semaine, ticket moyen) et instaurez une prime trimestrielle indexée sur leur amélioration. La transparence motive davantage que le contrôle."
              }
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-[#525252] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Pilotez vos KPI automatiquement</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin calcule food cost, prime cost, marge brute par plat et alertes en temps réel à partir de vos données de caisse et stocks. Plus de saisie manuelle.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
      </main>
    </div>
  );
}
