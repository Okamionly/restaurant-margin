import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, RefreshCw, AlertTriangle, CheckCircle, ArrowRight, TrendingDown } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogFifoLifo() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="FIFO vs LIFO en restauration : quelle méthode de stocks choisir ? (2026)"
        description="FIFO ou LIFO pour gérer vos stocks en cuisine ? Définitions, comparatif, mise en place pratique et impact sur le food cost. Guide complet pour restaurateurs."
        path="/blog/fifo-lifo-stocks-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "FIFO vs LIFO en restauration : quelle méthode de gestion des stocks choisir ?",
            "description": "FIFO ou LIFO pour gérer vos stocks en cuisine ? Définitions, comparatif, mise en place pratique et impact sur le food cost.",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": { "@type": "Organization", "name": "La rédaction RestauMargin", "url": "https://www.restaumargin.fr/a-propos" },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/images/blog/fifo-lifo-stocks-restaurant.jpg",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/fifo-lifo-stocks-restaurant",
            "keywords": "FIFO restauration, LIFO restaurant, gestion stocks cuisine, rotation stocks restaurant, HACCP stocks, food cost gestion stocks",
            "about": [
              { "@type": "Thing", "name": "Gestion des stocks en restauration" },
              { "@type": "Thing", "name": "Méthode FIFO" },
              { "@type": "Thing", "name": "Rotation des denrées alimentaires" }
            ],
            "FAQPage": {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Le FIFO est-il obligatoire en restauration ?", "acceptedAnswer": { "@type": "Answer", "text": "Pas explicitement au sens légal, mais c'est la seule pratique conforme aux exigences HACCP. En cas de contrôle sanitaire, l'absence de rotation est un point de non-conformité." } },
                { "@type": "Question", "name": "Comment gérer le FIFO avec un congélateur ?", "acceptedAnswer": { "@type": "Answer", "text": "Même principe : étiquetez tout avec la date de congélation, placez les produits les plus anciens en façade. DLC congélateur : 1 à 3 mois selon les produits." } }
              ]
            }
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
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="9 min"
        date="Avril 2026"
        title="FIFO vs LIFO : quelle méthode de gestion des stocks pour votre restaurant ?"
        accentWord="FIFO"
        subtitle="Dans votre cuisine, chaque jour, quelqu'un décide quel produit utiliser en premier. Sans système, on attrape ce qui est à portée de main — et on perd entre 3 et 5 % des achats en produits périmés."
      />

      <main className="max-w-[720px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Dans votre cuisine, chaque jour, quelqu'un décide quel produit utiliser en premier. Sans système, on attrape ce qui est à portée de main — et on perd entre <strong>3 et 5 % des achats</strong> en produits périmés. Les méthodes FIFO et LIFO apportent une réponse structurée. Voici laquelle choisir, et comment l'appliquer concrètement.
        </p>

        {/* Sommaire */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#fifo" className="hover:text-teal-600 transition-colors">1. FIFO : définition et principe</a></li>
            <li><a href="#lifo" className="hover:text-teal-600 transition-colors">2. LIFO : définition et cas d'usage</a></li>
            <li><a href="#comparaison" className="hover:text-teal-600 transition-colors">3. Tableau comparatif FIFO vs LIFO</a></li>
            <li><a href="#mise-en-place" className="hover:text-teal-600 transition-colors">4. Comment mettre en place le FIFO en cuisine</a></li>
            <li><a href="#impact" className="hover:text-teal-600 transition-colors">5. Impact sur le food cost et la comptabilité</a></li>
          </ol>
        </nav>

        {/* Section 1 — FIFO */}
        <section id="fifo" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. FIFO : premier entré, premier sorti</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>FIFO</strong> = <em>First In, First Out</em>. Le produit reçu en premier est utilisé en premier. C'est la méthode de référence en restauration professionnelle, recommandée par les normes HACCP et la réglementation sanitaire française.
          </p>
          <div className="border-l-4 border-teal-400 bg-teal-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-teal-700 mb-1">Exemple concret</p>
            <p className="text-sm text-teal-600">Vous recevez lundi 10 kg de saumon, jeudi 10 kg supplémentaires. Le vendredi, vous cuisinez les filets du lundi — pas ceux du jeudi. Les plus anciens passent toujours en premier.</p>
          </div>
          <p className="text-[#374151] leading-relaxed mb-3"><strong>Pourquoi c'est crucial :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            {[
              'Poissons : DLC 2–5 jours, viandes : DLC 3–7 jours — un oubli = perte sèche',
              'La traçabilité HACCP repose sur la rotation chronologique des denrées',
              'Un restaurant sans FIFO perd en moyenne 3 à 5 % de ses achats en pertes périmées',
            ].map(i => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
          <div className="bg-[#F5F5F5] rounded-xl p-4 text-sm text-[#374151]">
            <strong>Chiffre clé :</strong> Sur 8 000 € d'achats mensuels, 3 % de pertes = <strong>240 € jetés chaque mois</strong>, soit 2 880 € par an.
          </div>
        </section>

        {/* Section 2 — LIFO */}
        <section id="lifo" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. LIFO : dernier entré, premier sorti</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            <strong>LIFO</strong> = <em>Last In, First Out</em>. Le produit reçu en dernier est utilisé en premier. En restauration alimentaire, cette méthode est contre-intuitive et <strong>rarement pertinente</strong> pour les denrées périssables.
          </p>
          <div className="border-l-4 border-orange-400 bg-orange-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-orange-700 mb-1">Cas d'usage limités</p>
            <ul className="text-sm text-orange-600 space-y-1">
              <li>• Produits secs en silo ou vrac (farine, sucre) où le dessus est toujours accessible en premier</li>
              <li>• Comptabilité d'inventaire dans certains pays (non autorisé en France depuis 2005)</li>
            </ul>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              <strong>Important :</strong> Le Plan Comptable Général français n'autorise pas la méthode LIFO pour valoriser les stocks depuis 2005. Les seules méthodes légales sont le <strong>FIFO</strong> et le <strong>CMUP</strong>.
            </p>
          </div>
        </section>

        {/* Section 3 — Tableau comparatif */}
        <section id="comparaison" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Comparatif FIFO vs LIFO</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#111111]">
                  <th className="text-left px-4 py-3 font-semibold">Critère</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">FIFO</th>
                  <th className="text-center px-4 py-3 font-semibold text-orange-600">LIFO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  ['Adapté aux denrées périssables', '✅ Oui', '❌ Non'],
                  ['Conforme HACCP', '✅ Oui', '❌ Non'],
                  ['Réduit le gaspillage alimentaire', '✅ Oui', '❌ Augmente les pertes'],
                  ['Valorisation comptable légale (FR)', '✅ Autorisé', '❌ Interdit depuis 2005'],
                  ['Adapté aux produits secs en vrac', '⚠️ À adapter', '⚠️ Possible'],
                  ['Complexité de mise en place', '🟢 Faible', '🟢 Faible'],
                  ['Recommandé pour les restaurants FR', '✅ Oui', '❌ Non'],
                ].map(([crit, fifo, lifo]) => (
                  <tr key={crit} className="bg-white hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 text-[#374151]">{crit}</td>
                    <td className="px-4 py-3 text-center">{fifo}</td>
                    <td className="px-4 py-3 text-center">{lifo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#737373] mt-3">
            <strong>Verdict :</strong> En restauration professionnelle française, le FIFO est la seule méthode pertinente. La vraie question n'est pas "FIFO ou LIFO ?" mais <strong>"comment appliquer le FIFO efficacement ?"</strong>
          </p>
        </section>

        {/* Section 4 — Mise en place */}
        <section id="mise-en-place" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Mettre en place le FIFO en 5 étapes</h2>
          </div>

          {/* Image placeholder */}
          <div className="w-full bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-2xl h-44 flex items-center justify-center mb-6 border border-emerald-100 overflow-hidden relative">
            <img
              src="/images/blog/organisation-chambre-froide-fifo.jpg"
              alt="Organisation d'une chambre froide avec méthode FIFO : produits anciens devant, nouveaux derrière"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              loading="lazy"
            />
            <p className="relative z-10 text-emerald-800 text-sm font-medium bg-white/80 px-3 py-1 rounded-lg">Organisation chambre froide — méthode FIFO</p>
          </div>

          <div className="space-y-5">
            {[
              {
                num: '01',
                title: 'Étiqueter systématiquement',
                text: 'Chaque produit entrant reçoit une étiquette : date de réception, DLC maison, produit, grammage. Un rouleau Day Dot (pastilles colorées par jour) coûte moins de 20 € et élimine les erreurs. Rouge = à utiliser en priorité absolue.',
              },
              {
                num: '02',
                title: 'Organiser les frigos physiquement',
                text: 'Règle d\'or : nouveaux produits derrière ou en dessous, anciens devant ou au-dessus. À chaque livraison, videz l\'étagère, remettez les anciens devant, placez les nouveaux derrière. Jamais de nouveaux cartons posés devant les anciens.',
              },
              {
                num: '03',
                title: 'Former l\'équipe une fois, afficher les règles',
                text: '15 minutes de formation en début de saison + une affiche plastifiée dans chaque chambre froide. Message visuel : flèche de rotation, couleurs Day Dot, règle "vieux devant / nouveau derrière".',
              },
              {
                num: '04',
                title: 'Contrôle quotidien à l\'ouverture (5 min)',
                text: 'Le chef de partie vérifie les DLC chaque matin. Tout produit à DLC J-1 ou dépassée est identifié pour utilisation prioritaire. Cette vérification s\'intègre naturellement à la checklist HACCP quotidienne.',
              },
              {
                num: '05',
                title: 'Ajuster les commandes à la rotation réelle',
                text: 'Le FIFO révèle souvent un problème de sur-commande. Si vous trouvez régulièrement des produits en limite de DLC, commandez moins. Cercle vertueux : FIFO → moins de gaspillage → commandes ajustées → food cost amélioré.',
              },
            ].map(({ num, title, text }) => (
              <div key={num} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#111111] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{num}</div>
                <div>
                  <p className="font-semibold text-[#111111] mb-1">{title}</p>
                  <p className="text-sm text-[#525252] leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Impact */}
        <section id="impact" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. Impact sur le food cost et la comptabilité</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Un FIFO bien appliqué réduit le gaspillage de <strong>2 à 4 points de food cost</strong> dans les restaurants qui ne le pratiquaient pas. Sur un restaurant à 35 % de food cost et 25 000 € de CA mensuel, passer à 32 % représente <strong>750 € de marges récupérées par mois</strong> — soit 9 000 € par an.
          </p>

          {/* Tableau impact chiffré */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="text-left px-4 py-3 font-semibold text-[#111111]">CA mensuel</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#111111]">Food cost avant</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#111111]">Food cost après</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">Gain mensuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  ['15 000 €', '38 %', '35 %', '450 €'],
                  ['25 000 €', '36 %', '32 %', '1 000 €'],
                  ['40 000 €', '35 %', '31 %', '1 600 €'],
                  ['60 000 €', '37 %', '33 %', '2 400 €'],
                ].map(([ca, avant, apres, gain]) => (
                  <tr key={ca} className="bg-white hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 text-[#374151] font-medium">{ca}</td>
                    <td className="px-4 py-3 text-center text-red-500">{avant}</td>
                    <td className="px-4 py-3 text-center text-teal-600">{apres}</td>
                    <td className="px-4 py-3 text-center font-bold text-teal-700">{gain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#737373]">Estimations basées sur une réduction de 2 à 4 % du food cost après mise en place du FIFO structuré.</p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Le FIFO est-il obligatoire en restauration ?', a: 'Pas explicitement au sens légal, mais c\'est la seule pratique conforme aux exigences HACCP. En cas de contrôle sanitaire, l\'absence de système de rotation est un point de non-conformité.' },
              { q: 'Comment gérer le FIFO avec un congélateur ?', a: 'Même principe : étiquetez tout avec la date de congélation, placez les produits les plus anciens en façade. DLC au congélateur : 1 à 3 mois selon les produits. Un produit non étiqueté est automatiquement à risque.' },
              { q: 'FIFO ou CMUP pour la comptabilité ?', a: 'Les deux sont légaux en France. Le CMUP est souvent plus simple à gérer manuellement. Le FIFO est plus précis mais demande un suivi lot par lot. Votre expert-comptable vous conseillera selon votre volume de références.' },
              { q: 'Mon équipe oublie le FIFO. Comment créer l\'habitude ?', a: 'L\'organisation physique prime sur la volonté. Si les nouveaux produits sont physiquement derrière les anciens, le bon réflexe est forcé. Combinez avec un contrôle matinal de 5 min intégré à la checklist HACCP.' },
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-sm text-[#525252] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Suivez vos stocks et votre food cost en temps réel</h2>
          <p className="text-teal-100 mb-6 text-sm max-w-[480px] mx-auto leading-relaxed">
            RestauMargin vous aide à suivre vos entrées et sorties de stocks, calculer votre food cost réel par plat et identifier les pertes avant qu'elles impactent votre résultat.
          </p>
          <a href="https://www.restaumargin.fr/pricing" className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/reduire-cout-personnel-restaurant" className="text-sm text-teal-600 hover:underline">Réduire le coût personnel →</Link>
        </div>
      </main>
    </div>
  );
}
