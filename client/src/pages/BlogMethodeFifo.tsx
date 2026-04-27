import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, Tag, ClipboardList, AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogMethodeFifo() {
  const faqSchema = buildFAQSchema([
    {
      question: "FIFO ou FEFO, lequel utiliser concrètement ?",
      answer: "En cuisine professionnelle, on parle de FIFO mais on applique du FEFO dans les faits. Concentrez-vous sur la DLC : c'est elle qui prime sur la date d'arrivée."
    },
    {
      question: "Mes employés ne respectent pas le FIFO, comment faire ?",
      answer: "Trois leviers : formation initiale documentée (procédure écrite affichée en cuisine), responsabilisation (un référent FIFO par service), et incentives (prime trimestrielle indexée sur le taux de pertes)."
    },
    {
      question: "Combien coûte la mise en place d'un système FIFO ?",
      answer: "Très peu. Étiqueteuse 50 €, rouleaux d'étiquettes 30 €/an, formation 2h. Total : moins de 100 € pour 25 000 € de gain annuel potentiel."
    },
    {
      question: "Le FIFO s'applique-t-il aussi aux boissons ?",
      answer: "Oui. Les vins, les softs, et surtout les bières en pression (les fûts ont une DLC). N'oubliez pas non plus les produits d'épicerie ouverts (huiles, vinaigres)."
    },
    {
      question: "Comment mesurer l'efficacité de mon FIFO ?",
      answer: "Suivez deux indicateurs : taux de pertes mensuel (objectif < 2 %) et écart entre food cost théorique (ventes × fiches techniques) et food cost réel (inventaire). Un écart > 2 points signale un problème."
    }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Méthode FIFO', url: 'https://www.restaumargin.fr/blog/methode-fifo-gestion-stocks-restaurant' },
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Méthode FIFO en restauration : guide pratique pour réduire les pertes"
        description="Appliquez la méthode FIFO dans votre cuisine : étiquetage, organisation des stocks, impact sur le food cost et réduction du gaspillage."
        path="/blog/methode-fifo-gestion-stocks-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Méthode FIFO en restauration : guide pratique pour réduire les pertes",
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
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/methode-fifo-gestion-stocks-restaurant"
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
        category="Stocks"
        readTime="10 min"
        date="Avril 2026"
        title="Méthode FIFO en restauration : guide pratique"
        accentWord="FIFO"
        subtitle="Un restaurant moyen jette 6-10 % de ses achats alimentaires chaque mois. Le FIFO est la solution la plus simple jamais inventée pour résoudre ce problème."
      />

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          <strong>Un restaurant moyen jette entre 6 et 10 % de ses achats alimentaires chaque mois.</strong> Sur un food cost mensuel de 12 000 €, ce sont 720 à 1 200 € qui partent à la poubelle, soit jusqu'à 14 400 € de marge nette annuelle perdue. Dans 80 % des cas, ces pertes sont dues à une mauvaise rotation des stocks.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#fifo-fefo" className="hover:text-teal-600 transition-colors">1. FIFO vs FEFO : la différence cruciale</a></li>
            <li><a href="#obligatoire" className="hover:text-teal-600 transition-colors">2. Pourquoi le FIFO est obligatoire</a></li>
            <li><a href="#piliers" className="hover:text-teal-600 transition-colors">3. Les 4 piliers de la mise en pratique</a></li>
            <li><a href="#chiffre" className="hover:text-teal-600 transition-colors">4. Exemple chiffré : 8 % vs 2 % de pertes</a></li>
            <li><a href="#checklist" className="hover:text-teal-600 transition-colors">5. Checklist FIFO quotidienne</a></li>
            <li><a href="#erreurs" className="hover:text-teal-600 transition-colors">6. Les 7 erreurs classiques</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="fifo-fefo" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. FIFO vs FEFO : la différence cruciale</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>FIFO — First In, First Out</strong> : on consomme d'abord les produits entrés en premier. Logique chronologique.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>FEFO — First Expired, First Out</strong> : on consomme d'abord les produits dont la DLC (Date Limite de Consommation) est la plus proche. Logique sanitaire.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>En restauration, on applique principalement le FEFO</strong>, mais le terme FIFO est utilisé par habitude car les deux méthodes coïncident dans 90 % des cas. On parle donc souvent de FIFO en cuisine pour désigner le FEFO opérationnel.
          </p>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-emerald-700">Cas où FIFO et FEFO divergent</p>
            <p className="text-sm text-emerald-600">Yaourts en promo livrés en deuxième mais avec une DLC plus courte. On applique le FEFO en sortant le lot à DLC courte en priorité.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="obligatoire" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Pourquoi le FIFO est obligatoire</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Raison sanitaire (HACCP) :</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le règlement européen CE 178/2002 et le <strong>Paquet Hygiène</strong> imposent traçabilité et fraîcheur des produits. Le FIFO est la méthode opérationnelle reconnue.
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Avertissement et mise en demeure</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Amende administrative jusqu'à 1 500 €</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Fermeture administrative en cas de risque sanitaire</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Raison économique :</strong></p>
          <p className="text-[#374151] leading-relaxed">
            Sans FIFO, le saumon livré le mercredi (DLC dimanche) est rangé devant le saumon du lundi (DLC vendredi). Vendredi soir, on utilise le mercredi. Lundi suivant : saumon du lundi précédent périmé. À la poubelle. Multiplié par 80 références fraîches = <strong>5 à 10 % de pertes mensuelles</strong>.
          </p>
        </section>

        {/* Section 3 */}
        <section id="piliers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Les 4 piliers de la mise en pratique</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Pilier 1 — Étiquetage systématique</strong></p>
          <p className="text-[#374151] leading-relaxed mb-4">
            Chaque produit reçoit une étiquette avec : date de réception, DLC/DDM, nom (si reconditionné), initiales du receveur. Outils : étiqueteuse Brother PT-D210 (~50 €) ou Dymo + rouleaux solubles au lavage.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Pilier 2 — Organisation des espaces</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Frigos : étagère par catégorie, anciens devant, nouveaux derrière</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Étagères sèches : zones A/B/C, DLC courte en Zone A accessible</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Congélateurs : date au feutre indélébile, max 3 mois viande hachée</li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Pilier 3 — Procédure de réception (15-25 min) :</strong></p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>1. Contrôle quantitatif (BL)</div>
            <div>2. Contrôle qualitatif (visuel, T°)</div>
            <div>3. Vérification DLC (refus si &lt; 3 jours)</div>
            <div>4. Étiquetage</div>
            <div>5. Rangement FIFO</div>
            <div>6. Saisie logiciel</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            <strong>Pilier 4 — Inventaire flash hebdomadaire</strong> : 5 min sur les 10 produits stratégiques (80 % du food cost), identification des produits à passer en priorité, briefing chef pour adapter le menu.
          </p>
        </section>

        {/* Section 4 */}
        <section id="chiffre" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Exemple chiffré : 8 % vs 2 % de pertes</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Restaurant à <strong>30 000 € de CA mensuel</strong>, food cost cible 32 %.
          </p>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Scénario A — Sans FIFO (8 % de pertes) :</strong></p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Achats matières : 11 200 €</div>
            <div>Pertes (8 %) : 896 €</div>
            <div>Food cost réel : 34,3 %</div>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Scénario B — Avec FIFO rigoureux (2 % de pertes) :</strong></p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Achats matières : 9 800 € (commande optimisée)</div>
            <div>Pertes (2 %) : 196 €</div>
            <div>Food cost réel : 32,0 %</div>
          </div>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-emerald-700">Gain net annuel</p>
            <p className="text-sm text-emerald-600">Économie achats : 16 800 €/an + Réduction pertes : 8 400 €/an = <strong>25 200 €/an</strong>. Soit un mois et demi de CA en marge nette additionnelle.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="checklist" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Checklist FIFO quotidienne</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <span><strong>Vérifier DLC critiques (&lt; 48h)</strong> — Matin avant service, chef ou second, 5 min</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <span><strong>Étiqueter toute nouvelle livraison</strong> — À réception, 15-25 min</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <span><strong>Briefing équipe sur produits prioritaires</strong> — Avant service, chef, 3 min</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <span><strong>Inventaire flash 10 produits</strong> — Hebdo dimanche soir, manager, 30 min</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <span><strong>Inventaire complet</strong> — Mensuel, équipe, 2-3h</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <span><strong>Mise à jour logiciel stock</strong> — Quotidien, 10 min</span>
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="erreurs" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Les 7 erreurs classiques</h2>
          </div>
          <ul className="space-y-3 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Ne pas étiqueter les bocaux/contenants reconditionnés</strong> — On ne sait plus depuis quand la sauce est ouverte.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Ranger les nouveaux produits devant</strong> — Réflexe naturel mais opposé au FIFO.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Laisser des produits à plusieurs endroits</strong> — Risque de doublon.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Ignorer la DLC secondaire (après ouverture)</strong> — Crème fraîche : 3 jours après ouverture.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Inventaire en début de mois seulement</strong> — Trop tard, pertes déjà actées.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Ne pas former les nouveaux employés</strong> — Une seule personne sabote tout le système.</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span><strong>Sur-stocker pour "ne pas être en rupture"</strong> — Mieux vaut 2 commandes/semaine que 8 % de pertes.</span></li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "FIFO ou FEFO, lequel utiliser concrètement ?",
                a: "En cuisine professionnelle, on parle de FIFO mais on applique du FEFO dans les faits. Concentrez-vous sur la DLC : c'est elle qui prime sur la date d'arrivée."
              },
              {
                q: "Mes employés ne respectent pas le FIFO, comment faire ?",
                a: "Trois leviers : formation initiale documentée (procédure écrite affichée en cuisine), responsabilisation (un référent FIFO par service), et incentives (prime trimestrielle indexée sur le taux de pertes)."
              },
              {
                q: "Combien coûte la mise en place d'un système FIFO ?",
                a: "Très peu. Étiqueteuse 50 €, rouleaux d'étiquettes 30 €/an, formation 2h. Total : moins de 100 € pour 25 000 € de gain annuel potentiel."
              },
              {
                q: "Le FIFO s'applique-t-il aussi aux boissons ?",
                a: "Oui. Les vins, les softs, et surtout les bières en pression (les fûts ont une DLC). N'oubliez pas non plus les produits d'épicerie ouverts (huiles, vinaigres)."
              },
              {
                q: "Comment mesurer l'efficacité de mon FIFO ?",
                a: "Suivez deux indicateurs : taux de pertes mensuel (objectif < 2 %) et écart entre food cost théorique (ventes × fiches techniques) et food cost réel (inventaire). Un écart > 2 points signale un problème."
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
          <h2 className="text-2xl font-bold mb-3">Réduisez vos pertes et gagnez 3 points de marge</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin automatise votre FIFO : alertes DLC, suggestions de plats du jour, food cost en temps réel et suivi des pertes par catégorie.
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
