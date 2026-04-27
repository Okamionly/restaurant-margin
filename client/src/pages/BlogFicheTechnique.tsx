import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Users, FileText, ClipboardList, CheckCircle, Lightbulb, AlertTriangle, TrendingDown, BarChart3 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Fiche technique restaurant : le guide complet"
   Mot-cle principal : fiche technique restaurant
   ~2 600 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

export default function BlogFicheTechnique() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Fiche technique restaurant : le guide complet 2026"
        description="Creez des fiches techniques restaurant parfaites : recette, couts, grammages, photos. Modele gratuit + conseils pour maitriser votre food cost."
        path="/blog/fiche-technique-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Fiche technique restaurant : le guide complet",
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer mon food cost
            </Link>
            <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Fiches techniques"
        readTime="11 min"
        date="Avril 2026"
        title="Fiche technique restaurant : le guide complet 2026"
        accentWord="fiche technique"
        subtitle="La fiche technique est le document le plus sous-estime de la cuisine professionnelle. Bien construite, elle elimine les derives de couts, garantit la constance de vos plats et devient le fondement de votre rentabilite."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" readTime="11 min" variant="header" />

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-[#404040]">
            {[
              { href: '#definition', label: "Qu'est-ce qu'une fiche technique de cuisine ?" },
              { href: '#elements', label: 'Les elements essentiels d\'une fiche technique' },
              { href: '#cout', label: 'Comment calculer precisement le cout de revient' },
              { href: '#exemple', label: 'Modele de fiche technique gratuit' },
              { href: '#bonnes-pratiques', label: 'Bonnes pratiques pour des fiches reellement utilisees' },
              { href: '#erreurs', label: 'Les 5 erreurs a eviter absolument' },
              { href: '#digital', label: 'Fiches techniques digitales avec RestauMargin' },
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

        {/* ── Intro ── */}
        <div className="prose-content mb-14">
          <p>
            Imaginez deux cuisiniers qui preparent le meme plat. L'un utilise 180 g de filet de
            boeuf, l'autre 220 g. L'ecart semble anodin — 40 grammes seulement. Multipliez par
            30 couverts par soir, 25 jours par mois : vous perdez <strong>3 kg de filet chaque mois</strong>,
            soit plus de 100 € envolés sur un seul plat.
          </p>
          <p>
            La fiche technique restaurant est l'outil qui elimine ces derives silencieuses. C'est
            votre document de reference : il standardise chaque recette, fixe les grammages, calcule
            le cout matiere et garantit que votre plat a exactement le meme gout et le meme cout,
            que vous soyez en cuisine ou non.
          </p>
        </div>

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="1">
            Qu'est-ce qu'une fiche technique de cuisine ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fiche technique (ou fiche recette) est un document structure qui decrit avec
              precision les ingredients necessaires a la confection d'un plat (et leurs quantites exactes),
              la procedure de preparation etape par etape, le temps de preparation et de cuisson,
              le nombre de portions produites, le cout de revient et le prix de vente conseille.
            </p>
            <p>
              En restauration professionnelle, la fiche technique est bien plus qu'une simple
              recette — c'est un <strong>outil de gestion financiere</strong> et un
              <strong> garant de la constance qualitative</strong>.
            </p>
          </div>

          {/* 4 benefices */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              {
                icon: <TrendingDown className="w-5 h-5 text-teal-600" />,
                title: 'Maitrise financiere',
                desc: 'Sans fiche technique, votre food cost fluctue a chaque service. Avec elle, vous savez exactement ce que vous coute chaque plat.',
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
                title: 'Constance qualitative',
                desc: 'Un client qui revient doit retrouver exactement le meme plat. La fiche technique est votre assurance qualite.',
              },
              {
                icon: <Users className="w-5 h-5 text-teal-600" />,
                title: 'Formation du personnel',
                desc: 'Un nouveau commis peut reproduire un plat fidelement grace a la fiche technique, meme sans la presence du chef.',
              },
              {
                icon: <ClipboardList className="w-5 h-5 text-teal-600" />,
                title: 'Gestion des stocks',
                desc: 'En croisant fiches techniques et couverts servis, vous prevoyez vos commandes avec precision et reduisez les pertes.',
              },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  {b.icon}
                  <span className="font-bold text-[#111111]">{b.title}</span>
                </div>
                <p className="text-sm text-[#525252] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Elements ═════════════ */}
        <section id="elements" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="2">
            Les elements essentiels d'une fiche technique
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fiche technique professionnelle comprend plusieurs sections incontournables.
              Voici ce qu'elle doit absolument contenir.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <ElementCard
              number={1}
              title="L'en-tete d'identification"
              items={[
                "Nom du plat (avec eventuellement le numero de carte)",
                "Categorie (entree, plat, dessert, amuse-bouche...)",
                "Nombre de portions pour lesquelles la fiche est calculee",
                "Date de creation et version (car les recettes evoluent)",
                "Auteur / Chef responsable",
              ]}
            />
            <ElementCard
              number={2}
              title="La liste des ingredients avec grammages"
              items={[
                "Quantite brute : ce que vous achetez",
                "Coefficient de perte : ratio net/brut (ex : carotte epeluche = 0,82)",
                "Quantite nette : ce qui se retrouve dans l'assiette",
                "Prix unitaire par kg/L (mis a jour trimestriellement)",
                "Cout total par ingredient pour le calcul du food cost",
              ]}
            />
            <ElementCard
              number={3}
              title="La procedure de preparation"
              items={[
                "Mise en place : marinades, reductions, preparations prealables",
                "Deroulement de la recette dans l'ordre chronologique",
                "Points critiques : temperatures de cuisson, durees, textures attendues",
                "Dressage : description et photo de reference du rendu final",
              ]}
            />
            <ElementCard
              number={4}
              title="Les informations de production"
              items={[
                "Temps de preparation (mise en place), cuisson, dressage",
                "Materiel necessaire (fours specifiques, ustensiles, bains-marie)",
                "Consignes de conservation et duree de vie de la preparation",
                "Allergenes presents (obligation reglementaire INCO)",
              ]}
            />
          </div>

          <div className="mt-8">
            <Callout type="info">
              <strong>Coefficients de perte courants :</strong> Carotte entiere epeluche (~18% de perte),
              filet de boeuf pare (~10%), poisson entier en filets (~45-55%), herbes fraiches effeuillees (~40%).
              Ne vous fiez pas aux chiffres generiques — mesurez dans votre cuisine.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Calcul coût ═════════════ */}
        <section id="cout" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Comment calculer precisement le cout de revient
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la partie la plus importante de la fiche technique. Voici la methode
              etape par etape, avec les pieges a eviter.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mt-6">
            {[
              {
                step: '1',
                title: 'Relevez vos prix d\'achat reels',
                desc: 'Consultez vos dernieres factures fournisseurs. Les prix varient selon les saisons et les fournisseurs — prevoyez une revision trimestrielle. Ne jamais utiliser des prix "de tete".',
              },
              {
                step: '2',
                title: 'Mesurez les pertes reelles',
                desc: 'Pesez vos produits avant et apres preparation. Ne vous fiez pas aux coefficients generiques — mesurez dans votre cuisine, avec votre personnel, sur vos produits specifiques.',
              },
              {
                step: '3',
                title: 'Additionnez tous les couts, meme les petits',
                desc: 'Sel, poivre, huile, fonds de cuisine, garnitures... Comptez-les en ajoutant un forfait de 3 a 5% du cout total. Ces "matieres seches" s\'accumulent sur l\'ensemble de votre carte.',
              },
              {
                step: '4',
                title: 'Integrez les pertes a la cuisson',
                desc: 'Un filet de volaille de 200 g (cru) peut perdre 20 a 25% de son poids a la cuisson. Votre portion servie sera de 150 a 160 g — mais vous avez paye 200 g. Cette perte doit figurer dans la fiche.',
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <div className="w-9 h-9 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-bold text-[#111111] mb-1">{s.title}</p>
                  <p className="text-sm text-[#525252] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formule */}
          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-[#111111] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Formule du food cost
            </h3>
            <div className="bg-white rounded-xl p-4 text-center font-mono text-base sm:text-lg font-semibold text-teal-700 border border-teal-100 mb-4">
              Food cost (%) = (Coût matiere par portion / Prix de vente HT) × 100
            </div>
            <div className="text-sm text-[#525252] space-y-1">
              <p><strong>Exemple :</strong> Coût matiere = 4,63 € / Portion vendue = 28 € → Food cost = <strong>16,5%</strong></p>
              <p>En restauration traditionnelle, visez un food cost entre <strong>28% et 35%</strong>.</p>
              <p>En dessous de 25%, vos portions sont peut-etre trop reduites et nuisent a la satisfaction client.</p>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Modele ═════════════ */}
        <section id="exemple" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="4">
            Modele de fiche technique gratuit
          </SectionHeading>

          <div className="prose-content mb-6">
            <p>
              Voici la structure d'une fiche technique que vous pouvez reproduire ou adapter
              a votre etablissement. Elle couvre tous les elements essentiels en restant
              lisible sur une page A4.
            </p>
          </div>

          <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E7EB]">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#737373] font-medium">Fiche Technique</p>
                <p className="font-bold text-[#111111]">[NOM DU PLAT]</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Categorie', value: 'Plat / Entree / Dessert' },
                { label: 'Nb. de portions', value: 'X portions' },
                { label: 'Tps. preparation', value: 'XX min' },
                { label: 'Tps. de cuisson', value: 'XX min' },
                { label: 'Cout / portion', value: 'X,XX €' },
                { label: 'Food cost', value: 'XX%' },
              ].map((f, i) => (
                <div key={i} className="bg-[#FAFAFA] rounded-xl p-3 text-sm">
                  <p className="text-[#737373] text-xs mb-1">{f.label}</p>
                  <p className="font-semibold text-[#111111]">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Ingredients table */}
            <p className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">Ingredients</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5]">
                    {['Ingredient', 'Qte brute', 'Coeff. perte', 'Qte nette', 'Prix/kg', 'Cout'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-[#111111] border-b border-[#E5E7EB]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Filet de boeuf', '220 g', '0,90', '198 g', '32 €/kg', '7,04 €'],
                    ['Echalotes', '60 g', '0,85', '51 g', '4 €/kg', '0,24 €'],
                    ['Beurre', '30 g', '1,00', '30 g', '8 €/kg', '0,24 €'],
                    ['...', '...', '...', '...', '...', '...'],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-[#404040] border-b border-[#F0F0F0]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-teal-50">
                    <td colSpan={5} className="px-3 py-2 font-bold text-right text-[#111111]">TOTAL</td>
                    <td className="px-3 py-2 font-bold text-teal-700">X,XX €</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Other sections */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">Procedure</p>
                <div className="space-y-1 text-sm text-[#525252]">
                  {['1. Mise en place...', '2. Cuisson...', '3. Dressage...'].map((s, i) => (
                    <p key={i} className="bg-[#FAFAFA] rounded-lg px-3 py-2">{s}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">Allergenes &amp; Conservation</p>
                <div className="space-y-1 text-sm text-[#525252]">
                  <p className="bg-[#FAFAFA] rounded-lg px-3 py-2">Allergenes : gluten, lait, oeuf...</p>
                  <p className="bg-[#FAFAFA] rounded-lg px-3 py-2">Conservation : 48h sous vide a +3°C</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Bonnes pratiques ═════════════ */}
        <section id="bonnes-pratiques" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="5">
            Bonnes pratiques pour des fiches reellement utilisees
          </SectionHeading>

          <div className="prose-content">
            <p>
              Creer des fiches techniques est une chose. S'assurer qu'elles sont effectivement
              utilisees en est une autre. Voici comment passer de la theorie a la pratique.
            </p>
          </div>

          <div className="space-y-3 mt-6">
            {[
              {
                title: 'Simplifiez le format',
                desc: 'Une fiche technique de 15 pages que personne ne lit est inutile. Visez une page recto-verso maximum. Priorisez grammages, couts et photo.',
              },
              {
                title: 'Plastifiez et affichez en cuisine',
                desc: 'Imprimez, plastifiez, et accrochez aux postes concernes. La fiche doit etre sous la main du cuisinier, pas dans le bureau du chef.',
              },
              {
                title: 'Formez votre equipe',
                desc: 'Lors de l\'integration d\'un nouveau membre, prenez 30 minutes pour expliquer pourquoi les fiches existent et comment les utiliser.',
              },
              {
                title: 'Mettez-les a jour regulierement',
                desc: 'Prix : tous les trimestres. Recettes : a chaque evolution du plat. Photos : a chaque changement de dressage. Une fiche obsolete est trompeuse.',
              },
              {
                title: 'Liez fiches techniques et commandes',
                desc: 'En croisant le nombre de couverts prevus avec les quantites par portion, vous passez des commandes precises et reduisez les pertes de stock.',
              },
            ].map((bp, i) => (
              <div key={i} className="flex gap-3 bg-white border border-[#E5E7EB] rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#111111] mb-0.5">{bp.title}</p>
                  <p className="text-sm text-[#525252] leading-relaxed">{bp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="6">
            Les 5 erreurs a eviter absolument
          </SectionHeading>

          <div className="space-y-4 mt-2">
            {[
              {
                n: '01',
                title: 'Ne pas mesurer les pertes reelles',
                desc: 'Utiliser des coefficients theoriques sans les verifier dans votre contexte est risque. Les pertes varient selon la qualite des produits, les competences de vos equipes, le materiel utilise.',
              },
              {
                n: '02',
                title: 'Oublier les petites quantites',
                desc: 'Huile d\'olive, fleur de sel, herbes fraiches, micro-pousses... Individuellement negligeables, cumulés ils representent plusieurs points de food cost. Chiffrez-les.',
              },
              {
                n: '03',
                title: 'Calculer sur des prix anciens',
                desc: 'Un cout matiere calcule avec les prix d\'il y a 18 mois n\'a aucune valeur decisionnelle. La revision des prix est un travail regulier, non optionnel.',
              },
              {
                n: '04',
                title: 'Creer des fiches que personne ne lit',
                desc: 'La plus belle fiche technique du monde ne sert a rien si elle est rangee dans un tiroir. L\'implementation operationnelle est aussi importante que la creation.',
              },
              {
                n: '05',
                title: 'Ne pas inclure les pertes a la cuisson',
                desc: 'Une perte de 20% a la cuisson sur un produit a 30 €/kg, c\'est 6 € perdus par kilo. Sur 10 kg/semaine, c\'est 60 € non comptabilises chaque semaine.',
              },
            ].map((err) => (
              <div key={err.n} className="flex gap-4 bg-red-50 border border-red-100 rounded-2xl p-5">
                <span className="text-2xl font-extrabold text-red-200 min-w-[40px]">{err.n}</span>
                <div>
                  <p className="font-bold text-[#111111] mb-1">{err.title}</p>
                  <p className="text-sm text-[#525252] leading-relaxed">{err.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Digital ═════════════ */}
        <section id="digital" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Fiches techniques digitales avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              La fiche technique papier a ses limites : elle devient vite obsolete, difficile a
              dupliquer en cas de changement de prix, et ne se met pas a jour automatiquement
              quand votre fournisseur modifie ses tarifs.
            </p>
            <p>
              Quand les prix de votre beurre augmentent de 15%, RestauMargin recalcule
              instantanement le food cost de <em>tous les plats</em> qui l'utilisent — et vous
              alerte sur ceux dont la marge est devenue insuffisante.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: <FileText className="w-5 h-5 text-teal-600" />, label: 'Creation et stockage des fiches en quelques minutes' },
              { icon: <TrendingDown className="w-5 h-5 text-teal-600" />, label: 'Mise a jour des prix en masse lors des changements tarifaires' },
              { icon: <Calculator className="w-5 h-5 text-teal-600" />, label: 'Calcul automatique du food cost pour chaque plat' },
              { icon: <ClipboardList className="w-5 h-5 text-teal-600" />, label: 'Generation des listes de courses basees sur vos fiches' },
              { icon: <BarChart3 className="w-5 h-5 text-teal-600" />, label: 'Analyse de rentabilite de chaque plat et de votre carte' },
              { icon: <AlertTriangle className="w-5 h-5 text-teal-600" />, label: 'Alertes automatiques en cas de derive du food cost' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl p-4 text-sm">
                {f.icon}
                <span className="text-[#111111] font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" readTime="11 min" variant="footer" />

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white mb-16">
          <ChefHat className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Digitalisez vos fiches techniques
          </h2>
          <p className="text-teal-100 max-w-xl mx-auto mb-8 text-base leading-relaxed">
            Crees, mises a jour automatiquement et analysees en temps reel. Vos fiches techniques
            deviennent un veritable tableau de bord de votre rentabilite.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors text-base"
          >
            Essayer gratuitement 7 jours
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-teal-200 text-sm mt-4">Sans carte bancaire · Configuration en 5 minutes</p>
        </section>

        {/* ── Articles lies ── */}
        <section>
          <h2 className="text-xl font-bold text-[#111111] mb-6">Articles qui pourraient vous interesser</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: '/blog/coefficient-multiplicateur', label: 'Le coefficient multiplicateur', tag: 'Pricing' },
              { to: '/blog/reduire-food-cost', label: 'Reduire son food cost', tag: 'Rentabilite' },
              { to: '/blog/haccp-restaurant', label: 'Guide HACCP 2026', tag: 'Reglementation' },
            ].map((a, i) => (
              <Link
                key={i}
                to={a.to}
                className="group bg-white border border-[#E5E7EB] hover:border-teal-300 rounded-2xl p-5 transition-colors"
              >
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{a.tag}</span>
                <p className="font-semibold text-[#111111] mt-1 group-hover:text-teal-600 transition-colors text-sm">
                  {a.label}
                  <ArrowRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ── JSON-LD Article ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Fiche technique restaurant : le guide complet 2026',
            description: 'Tout savoir sur la fiche technique en restauration : elements essentiels, calcul du food cost, modele gratuit et bonnes pratiques pour la faire utiliser par vos equipes.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-16',
            dateModified: '2026-04-16',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/fiche-technique-restaurant' },
          }),
        }}
      />
      {/* ── JSON-LD FAQ ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'A quoi sert une fiche technique en restauration ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'La fiche technique sert a standardiser les recettes, fixer les grammages, calculer le cout matiere et garantir la constance qualitative des plats, independamment du cuisinier qui les prepare.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quelle est la difference entre quantite brute et quantite nette ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'La quantite brute est ce que vous achetez. La quantite nette est ce qui se retrouve dans l\'assiette apres epluchage, parage et cuisson. La difference est le coefficient de perte.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quel food cost viser pour un restaurant traditionnel ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'En restauration traditionnelle, le food cost ideal se situe entre 28% et 35% du prix de vente HT. En dessous de 25%, les portions sont souvent trop reduites et nuisent a la satisfaction client.',
                },
              },
              {
                '@type': 'Question',
                name: 'A quelle frequence mettre a jour les prix dans ses fiches techniques ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Les prix doivent etre mis a jour tous les trimestres minimum, ou apres chaque changement tarifaire significatif d\'un fournisseur. Des prix obsoletes donnent un food cost errone.',
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
      <h2 className="text-2xl font-bold text-[#111111]">{children}</h2>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  return (
    <div className={`border rounded-xl p-4 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

function ElementCard({ number, title, items }: { number: number; title: string; items: string[] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 bg-teal-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{number}</span>
        <h3 className="font-bold text-[#111111]">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#525252]">
            <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
