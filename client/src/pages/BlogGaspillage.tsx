import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Trash2, Calculator, ArrowRight, BookOpen, Lightbulb, AlertTriangle, Users, Leaf, TrendingDown, BarChart3, ShoppingBasket, Scale, Recycle, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment reduire le gaspillage alimentaire en restaurant"
   Mot-cle principal : gaspillage alimentaire restaurant
   ~1 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

export default function BlogGaspillage() {
  return (
    <div className="min-h-screen">
      <SEOHead title="Réduire le gaspillage alimentaire restaurant : 10 méthodes" description="Solutions concrètes pour réduire le gaspillage alimentaire dans votre restaurant : FIFO, portionnement, valorisation des déchets, suivi des pertes." path="/blog/gaspillage-alimentaire" type="article" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Réduire le gaspillage alimentaire en restaurant",
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
      <PublicHeader />

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Gaspillage"
        readTime="9 min"
        date="Avril 2026"
        title="Comment réduire le gaspillage alimentaire en restaurant"
        accentWord="gaspillage"
        subtitle="En France, un restaurant jette en moyenne 14 % de ses achats alimentaires. Cela représente entre 5 000 et 20 000 EUR par an de pertes directes sur vos marges. Découvrez 5 méthodes concrètes pour réduire ce gaspillage de 30 % et plus."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-14" readTime="9 min" variant="header" />

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#chiffres', label: 'Le gaspillage alimentaire en restauration : les chiffres clés' },
              { href: '#causes', label: 'Les principales causes du gaspillage en cuisine' },
              { href: '#astuce-1', label: 'Astuce 1 : Le système FIFO et la gestion des DLC' },
              { href: '#astuce-2', label: 'Astuce 2 : Les fiches techniques calibrées' },
              { href: '#astuce-3', label: 'Astuce 3 : La pesée et le suivi des déchets' },
              { href: '#astuce-4', label: 'Astuce 4 : L\'ajustement des commandes par prévision' },
              { href: '#astuce-5', label: 'Astuce 5 : La valorisation des surplus' },
              { href: '#calculateur', label: 'Calculez votre gaspillage annuel' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'RestauMargin vous aide à réduire votre gaspillage' },
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

        {/* ═════════════ SECTION 1 : Chiffres cles ═════════════ */}
        <section id="chiffres" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="1">
            Le gaspillage alimentaire en restauration : les chiffres clés
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le gaspillage alimentaire en restaurant est un fléau économique, écologique et éthique.
              Selon l'ADEME, la restauration commerciale et collective génère chaque année environ
              900 000 tonnes de déchets alimentaires en France. Cela représente 14 % des achats
              alimentaires qui finissent à la poubelle au lieu d'être servis aux clients.
            </p>
            <p>
              Pour un restaurant réalisant 500 000 EUR de chiffre d'affaires annuel avec un food cost
              de 30 %, cela signifie 150 000 EUR d'achats alimentaires. Si 14 % sont gaspillés, ce sont
              21 000 EUR de pertes sèches chaque année — l'équivalent de deux mois de loyer pour un
              restaurant moyen à Paris.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-8">
            <StatCard value="14 %" label="des achats alimentaires gaspillés en moyenne" color="red" />
            <StatCard value="21 000 EUR" label="de pertes annuelles pour un restaurant moyen" color="amber" />
            <StatCard value="30 %" label="de réduction possible avec les bonnes pratiques" color="emerald" />
          </div>

          <div className="prose-content mt-8">
            <p>
              Le gaspillage alimentaire en restauration intervient à plusieurs niveaux : lors de la
              réception des marchandises (produits abîmés ou non conformes), en stockage (mauvaise
              rotation, rupture de la chaîne du froid), en préparation (épluchures excessives, erreurs
              de découpe, surproduction), au service (portions surdimensionnées, retours d'assiettes)
              et après le service (restes non réutilisés, surplus non valorisés).
            </p>
            <p>
              La loi AGEC (Anti-Gaspillage pour une Économie Circulaire), renforcée en 2025, impose
              désormais aux restaurants de plus de 150 couverts par jour de réaliser un diagnostic
              de gaspillage alimentaire et de mettre en place un plan d'action. Les sanctions peuvent
              aller jusqu'à 3 750 EUR d'amende pour les contrevenants.
            </p>

            <Callout type="info">
              <strong>Chiffre clé :</strong> Selon une étude de The World Resources Institute, réduire
              le gaspillage alimentaire de seulement 1 EUR génère en moyenne 14 EUR de retour sur
              investissement pour un restaurant. C'est l'un des meilleurs ROI que vous puissiez
              obtenir en restauration.
            </Callout>

            <p>
              La bonne nouvelle, c'est que les marges de progression sont énormes. Les restaurants
              les plus performants parviennent à limiter leur taux de gaspillage à 3-5 % de leurs
              achats, soit quatre fois moins que la moyenne du secteur. Ce n'est pas une question
              de budget ou de taille d'établissement — c'est une question de méthode.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Causes ═════════════ */}
        <section id="causes" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="2">
            Les principales causes du gaspillage en cuisine
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de parler solutions, il faut comprendre d'où vient le gaspillage alimentaire dans
              votre restaurant. Voici les cinq causes les plus courantes, classées par ordre d'impact
              financier.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <CauseCard
              number={1}
              title="La surproduction en mise en place"
              desc="C'est la cause numéro un. Par sécurité ou par habitude, les cuisiniers préparent trop de sauces, garnitures et accompagnements. En fin de service, ces surplus sont souvent jetés. Un restaurant moyen surpoduit de 15 à 25 % par rapport à ses besoins réels."
            />
            <CauseCard
              number={2}
              title="La mauvaise rotation des stocks (pas de FIFO)"
              desc="Sans un système rigoureux de rotation (Premier Entre, Premier Sorti), les produits au fond du frigo dépassent leur DLC. Les nouveaux arrivages sont placés devant les anciens, condamnant les stocks existants."
            />
            <CauseCard
              number={3}
              title="Les portions non standardisées"
              desc="Sans fiches techniques précises et sans pesée systématique, chaque cuisinier sert des quantités différentes. La moyenne des portions dépasse souvent de 10 à 20 % la portion prévue, engendrant des coûts matières supplémentaires et des retours d'assiettes."
            />
            <CauseCard
              number={4}
              title="Les commandes non optimisées"
              desc="Commander 'au feeling' sans analyser les prévisions de fréquentation conduit à des stocks excessifs sur certains produits et des ruptures sur d'autres. Le résultat : des denrées périssables qui finissent à la poubelle."
            />
            <CauseCard
              number={5}
              title="L'absence de valorisation des surplus"
              desc="Les épluchures de légumes, les parures de viande, les fruits trop mûrs — autant de 'déchets' qui pourraient être transformés en bouillons, garnitures, desserts ou confits. Sans une culture culinaire anti-gaspi, ces ressources sont perdues."
            />
          </div>
        </section>

        {/* ═════════════ ASTUCE 1 : FIFO ═════════════ */}
        <section id="astuce-1" className="mb-16">
          <SectionHeading icon={<ShoppingBasket className="w-6 h-6" />} number="3">
            Astuce 1 : Le système FIFO et la gestion des DLC
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le FIFO (First In, First Out — Premier Entre, Premier Sorti) est la règle d'or de
              la gestion des stocks en restauration. Le principe est simple : les produits reçus en
              premier doivent être utilisés en premier. Pourtant, seulement 40 % des restaurants
              l'appliquent systématiquement.
            </p>
            <p>
              Pour mettre en place un FIFO efficace, commencez par étiqueter chaque produit à la réception
              avec la date de réception et la DLC (Date Limite de Consommation). Organisez vos étagères
              de manière à ce que les produits les plus anciens soient toujours devant. Instaurez une
              vérification quotidienne des DLC en début de service — 5 minutes qui peuvent vous
              économiser des centaines d'euros par semaine.
            </p>

            <Callout type="warning">
              <strong>Attention :</strong> Ne confondez pas DLC et DDM (Date de Durabilité Minimale).
              La DLC est impérative (produits frais, viandes, produits laitiers) — au-delà, le produit
              doit être jeté. La DDM ("à consommer de préférence avant") est indicative : un produit
              peut encore être utilisé après cette date si son aspect, odeur et goût sont corrects.
            </Callout>

            <p>
              <strong>Exemple concret :</strong> Le restaurant Le Petit Jardin à Lyon a réduit ses
              pertes liées aux DLC dépassées de 68 % en trois mois simplement en instaurant un
              code couleur sur les étiquettes : vert (plus de 3 jours), orange (1 à 3 jours),
              rouge (dernier jour). Les produits "orange" et "rouge" sont prioritaires en mise en place.
            </p>
            <p>
              Le gain moyen constaté par les restaurants qui mettent en place un FIFO rigoureux est
              de 3 000 à 6 000 EUR par an de pertes évitées, pour un investissement quasi nul
              (étiquettes et un peu de discipline).
            </p>
          </div>
        </section>

        {/* ═════════════ ASTUCE 2 : Fiches techniques ═════════════ */}
        <section id="astuce-2" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Astuce 2 : Les fiches techniques calibrées
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fiche technique de cuisine, c'est la recette détaillée d'un plat avec les quantités
              précises de chaque ingrédient pour une portion. C'est l'outil fondamental pour maîtriser
              vos coûts et réduire le gaspillage alimentaire en restaurant.
            </p>
            <p>
              Sans fiche technique, chaque cuisinier prépare le plat "à sa façon" avec des quantités
              variables. Le résultat : des portions irrégulières, un food cost imprévisible et du
              gaspillage systématique. Une étude de Cornell University montre que les restaurants
              sans fiches techniques gaspillent en moyenne 22 % de plus que ceux qui les utilisent.
            </p>
            <p>
              Votre fiche technique doit inclure : la liste exacte des ingrédients avec les grammages
              par portion, le rendement après cuisson (un filet de boeuf perd 25 % de son poids à
              la cuisson), le coût matière par portion, le prix de vente recommandé et les instructions
              de dressage avec photo.
            </p>

            <Callout type="info">
              <strong>Astuce :</strong> Pesez vos portions pendant une semaine et comparez avec vos
              fiches techniques. Vous serez surpris de l'écart. La plupart des restaurants découvrent
              un écart moyen de 15 % entre la portion théorique et la portion réelle — soit 15 %
              de food cost en plus.
            </Callout>

            <p>
              <strong>Lien utile :</strong> Consultez notre{' '}
              <Link to="/blog/fiche-technique-restaurant" className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                guide complet sur les fiches techniques de cuisine
              </Link>{' '}
              pour apprendre à créer et maintenir vos fiches techniques efficacement.
            </p>
          </div>
        </section>

        {/* ═════════════ ASTUCE 3 : Pesee des dechets ═════════════ */}
        <section id="astuce-3" className="mb-16">
          <SectionHeading icon={<Trash2 className="w-6 h-6" />} number="5">
            Astuce 3 : La pesée et le suivi des déchets
          </SectionHeading>

          <div className="prose-content">
            <p>
              Ce qui ne se mesure pas ne s'améliore pas. La pesée des déchets alimentaires est l'une
              des méthodes les plus efficaces pour réduire le gaspillage, car elle rend le problème
              visible et mesurable. C'est aussi une obligation réglementaire pour les restaurants
              produisant plus de 5 tonnes de biodéchets par an (seuil abaissé en 2024).
            </p>
            <p>
              Le protocole est simple : placez une balance et un cahier (ou une tablette) à côté de
              chaque poubelle de cuisine. Chaque fois qu'un cuisinier jette un aliment, il note le
              type de produit, la quantité et la raison (DLC dépassée, erreur de préparation,
              retour d'assiette, surplus de production). En fin de semaine, analysez les données.
            </p>
            <p>
              Les restaurants qui pratiquent la pesée des déchets constatent une réduction moyenne de
              20 % du gaspillage dès le premier mois — simplement parce que l'équipe prend conscience
              des quantités jetées. C'est l'effet "miroir" : quand on sait qu'on est observé (ou
              qu'on s'observe soi-même), on fait naturellement plus attention.
            </p>
            <p>
              Concrètement, catégorisez vos déchets en quatre familles : préparations non servies
              (surproduction), produits périmés (rotation insuffisante), épluchures et parures
              (rendement), retours d'assiettes (portions trop grandes ou plats peu appréciés).
              Chaque catégorie appelle une action correctrice différente.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> La chaîne de restaurants Nando's a réduit son gaspillage
              alimentaire de 32 % en un an grâce à un programme de pesée quotidienne des déchets combiné
              avec des objectifs d'amélioration par équipe. Le jeu de compétition entre équipes a
              renforcé l'engagement de tout le personnel.
            </Callout>
          </div>
        </section>

        {/* ═════════════ ASTUCE 4 : Previsions ═════════════ */}
        <section id="astuce-4" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="6">
            Astuce 4 : L'ajustement des commandes par prévision
          </SectionHeading>

          <div className="prose-content">
            <p>
              Commander la bonne quantité au bon moment, c'est le Saint-Graal de la gestion des
              stocks en restauration. Trop de stock = gaspillage. Pas assez = ruptures et clients
              déçus. La clé, c'est la prévision.
            </p>
            <p>
              Analysez votre historique de ventes par jour de la semaine, par semaine du mois et par
              saison. Un restaurant moyen sert 30 % de couverts en plus le vendredi et le samedi
              que le mardi. Les plats à base de salade se vendent 40 % de plus en été. En janvier,
              après les fêtes, la fréquentation baisse de 15 à 20 %.
            </p>
            <p>
              Utilisez ces données pour ajuster vos commandes. Un bon réflexe : commandez pour 2 à
              3 jours maximum sur les produits frais (viandes, poissons, légumes fragiles), et
              vérifiez vos stocks chaque matin avant de passer commande. Évitez les commandes
              automatiques "fixes" qui ne tiennent pas compte de la réalité du moment.
            </p>
            <p>
              Intégrez aussi les événements extérieurs : matches de football, jours fériés, météo
              (une terrasse pleine en été, vide sous la pluie), travaux dans la rue, grèves de
              transports. Chaque facteur impacte votre fréquentation et donc vos besoins en
              matières premières.
            </p>
            <p>
              <strong>Exemple :</strong> Le Bistrot du Marché à Bordeaux a réduit ses achats
              excessifs de 18 % en installant un simple tableur de suivi des ventes par jour et par
              plat. En 6 mois, le gain cumulé a dépassé 8 000 EUR. RestauMargin automatise cette
              analyse avec ses outils de prévision intelligente.
            </p>
          </div>
        </section>

        {/* ═════════════ ASTUCE 5 : Valorisation ═════════════ */}
        <section id="astuce-5" className="mb-16">
          <SectionHeading icon={<Recycle className="w-6 h-6" />} number="7">
            Astuce 5 : La valorisation des surplus et sous-produits
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant d'être un déchet, chaque aliment est une ressource potentielle. La cuisine
              anti-gaspi, c'est l'art de transformer ce qui aurait été jeté en un produit vendable
              ou au moins utilisable. Cette approche est au coeur de la gastronomie durable et de
              plus en plus valorisée par les clients.
            </p>
            <p>
              Les épluchures de légumes deviennent des bouillons, des chips ou des poudres aromatiques.
              Les parures de viande se transforment en terrines, rillettes ou fonds de sauce. Le pain
              rassis devient du pain perdu, de la chapelure ou un gaspacho. Les fruits trop mûrs
              font des compotes, des coulis ou des smoothies.
            </p>

            <div className="mt-6 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-4 flex items-center gap-2">
                <Recycle className="w-5 h-5 text-emerald-600" />
                Idées de valorisation par type de déchet
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ValorizationCard item="Épluchures de légumes" idea="Bouillon, chips déshydratées, pesto de fanes" />
                <ValorizationCard item="Parures de viande" idea="Fond brun, terrine, rillettes" />
                <ValorizationCard item="Pain rassis" idea="Pain perdu, chapelure, crotons" />
                <ValorizationCard item="Fruits trop mûrs" idea="Compote, coulis, glace, confiture" />
                <ValorizationCard item="Herbes fanées" idea="Huile aromatisée, beurre composé" />
                <ValorizationCard item="Surplus de production" idea="Plat du jour, doggy bag, partenariat Too Good To Go" />
              </div>
            </div>

            <p>
              Au-delà de la cuisine, pensez aux partenariats avec des applications anti-gaspi comme
              Too Good To Go ou Phenix. Ces plateformes vous permettent de vendre vos surplus à
              prix réduit en fin de service. C'est du chiffre d'affaires supplémentaire sur des
              produits qui auraient été jetés — une victoire économique et écologique.
            </p>
            <p>
              Les doggy bags (emballages pour emporter les restes) sont désormais une obligation
              légale en France. Proposez-les systématiquement à vos clients : cela réduit le
              gaspillage côté salle et renforce votre image responsable. Investissez dans des
              emballages eco-responsables alignés avec votre positionnement.
            </p>
          </div>
        </section>

        {/* ═════════════ CALCULATEUR ═════════════ */}
        <section id="calculateur" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="8">
            Calculez votre gaspillage annuel
          </SectionHeading>

          <div className="prose-content mb-6">
            <p>
              Utilisez ce calculateur simple pour estimer le coût du gaspillage alimentaire dans
              votre restaurant. Entrez votre chiffre d'affaires annuel et votre food cost, et
              découvrez combien vous pourriez économiser en réduisant vos pertes.
            </p>
          </div>

          <GaspillageCalculator />
        </section>

        {/* ═════════════ Articles lies ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Articles complémentaires</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/fiche-technique-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fiche technique de cuisine : le guide complet</h3>
              <p className="text-sm text-mono-500">Créez des fiches techniques précises pour maîtriser vos portions et coûts.</p>
            </Link>
            <Link to="/blog/haccp-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Guide HACCP pour les restaurants</h3>
              <p className="text-sm text-mono-500">Températures, principes et checklist pour respecter l'hygiène alimentaire.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">5 méthodes pour réduire votre food cost</h3>
              <p className="text-sm text-mono-500">Fiches techniques, négociation fournisseurs, menu engineering et plus.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            <FAQItem
              q="Quel est le taux de gaspillage moyen dans un restaurant ?"
              a="En France, un restaurant gaspille en moyenne 14 % de ses achats alimentaires, soit entre 5 000 et 20 000 EUR par an selon le chiffre d'affaires. Les restaurants les plus performants parviennent à descendre à 3-5 % grâce à des méthodes rigoureuses de gestion des stocks et de production."
            />
            <FAQItem
              q="Comment mesurer le gaspillage alimentaire dans mon restaurant ?"
              a="La méthode la plus simple est la pesée quotidienne des déchets alimentaires, categorises en quatre types : surproduction (plats préparés non vendus), produits périmés (DLC dépassée), épluchures et parures (rendement), retours d'assiettes (restes clients). Pesez pendant une semaine pour avoir un diagnostic précis."
            />
            <FAQItem
              q="Quelles sont les obligations légales sur le gaspillage alimentaire ?"
              a="La loi AGEC impose aux restaurants de plus de 150 couverts/jour un diagnostic de gaspillage et un plan d'action. Depuis 2024, tous les restaurants doivent trier leurs biodéchets. Les doggy bags doivent être proposés aux clients. Les sanctions peuvent atteindre 3 750 EUR d'amende."
            />
            <FAQItem
              q="Combien peut-on économiser en réduisant le gaspillage ?"
              a="En appliquant rigoureusement les 5 méthodes décrites dans cet article (FIFO, fiches techniques, pesée des déchets, prévision des commandes, valorisation des surplus), un restaurant moyen peut réduire son gaspillage de 30 %, soit une économie de 6 000 à 12 000 EUR par an."
            />
            <FAQItem
              q="Too Good To Go est-il rentable pour un restaurant ?"
              a="Oui, dans la majorité des cas. Vous vendez vos surplus à un prix réduit (généralement 3 à 5 EUR le panier) au lieu de les jeter. L'application prend une commission de 1,09 EUR par panier. C'est du chiffre d'affaires supplémentaire sur des produits qui auraient été perdus. En plus, cela vous apporte de la visibilité."
            />
            <FAQItem
              q="Comment impliquer mon équipe dans la lutte contre le gaspillage ?"
              a="Commencez par rendre le problème visible : affichez les chiffres de pesée en cuisine. Fixez des objectifs collectifs (par exemple, réduire les déchets de 10 % en un mois). Organisez des challenges entre équipes. Formez vos cuisiniers aux techniques de valorisation. Et surtout, valorisez les progrès — un compliment motive autant qu'une prime."
            />
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" readTime="9 min" variant="footer" />

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              RestauMargin vous aide à réduire votre gaspillage de 30 %
            </h2>
            <p className="text-emerald-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Suivi des stocks en temps réel, alertes DLC, fiches techniques calibrées, prévisions
              de ventes et analyse des déchets — tout est automatisé pour que vous vous concentriez
              sur la cuisine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-full hover:bg-emerald-50 transition-colors"
              >
                Essayer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Calculer mon food cost
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <PublicFooter />

      {/* ── JSON-LD Article Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Comment réduire le gaspillage alimentaire en restaurant : 5 astuces concrètes',
            description: 'Réduisez le gaspillage alimentaire de votre restaurant de 30 %. 5 méthodes concrètes, calculateur de pertes et FAQ complète pour les restaurateurs.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-10',
            dateModified: '2026-04-10',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/gaspillage' },
          }),
        }}
      />
      {/* ── JSON-LD FAQ Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Quel est le taux de gaspillage moyen dans un restaurant ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'En France, un restaurant gaspille en moyenne 14 % de ses achats alimentaires, soit entre 5 000 et 20 000 EUR par an selon le chiffre d\'affaires.',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment mesurer le gaspillage alimentaire dans mon restaurant ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'La méthode la plus simple est la pesée quotidienne des déchets alimentaires, categorises en quatre types : surproduction, produits périmés, épluchures/parures, retours d\'assiettes.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quelles sont les obligations légales sur le gaspillage alimentaire ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'La loi AGEC impose aux restaurants de plus de 150 couverts/jour un diagnostic de gaspillage et un plan d\'action. Les sanctions peuvent atteindre 3 750 EUR d\'amende.',
                },
              },
              {
                '@type': 'Question',
                name: 'Combien peut-on économiser en réduisant le gaspillage ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Un restaurant moyen peut réduire son gaspillage de 30 %, soit une économie de 6 000 à 12 000 EUR par an.',
                },
              },
              {
                '@type': 'Question',
                name: 'Too Good To Go est-il rentable pour un restaurant ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Oui, vous vendez vos surplus à prix réduit au lieu de les jeter. L\'application prend une commission de 1,09 EUR par panier. C\'est du chiffre d\'affaires supplémentaire.',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment impliquer mon équipe dans la lutte contre le gaspillage ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Rendez le problème visible avec les chiffres de pesée, fixez des objectifs collectifs, organisez des challenges entre équipes et formez aux techniques de valorisation.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}

/* ═══════════════ Calculateur de gaspillage ═══════════════ */

function GaspillageCalculator() {
  const [ca, setCa] = useState('');
  const [foodCost, setFoodCost] = useState('');
  const [tauxGaspillage, setTauxGaspillage] = useState('14');

  const caNum = parseFloat(ca) || 0;
  const fcNum = parseFloat(foodCost) || 0;
  const tgNum = parseFloat(tauxGaspillage) || 0;

  const achats = caNum * (fcNum / 100);
  const pertes = achats * (tgNum / 100);
  const economie30 = pertes * 0.3;

  return (
    <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
      <h3 className="font-bold text-mono-100 mb-6 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-teal-600" />
        Calculez votre gaspillage annuel
      </h3>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div>
          <label className="block text-sm font-medium text-mono-350 mb-1.5">
            Chiffre d'affaires annuel (EUR)
          </label>
          <input
            type="number"
            value={ca}
            onChange={(e) => setCa(e.target.value)}
            placeholder="500000"
            className="w-full px-4 py-2.5 bg-white border border-mono-900 rounded-lg text-mono-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mono-350 mb-1.5">
            Food cost (%)
          </label>
          <input
            type="number"
            value={foodCost}
            onChange={(e) => setFoodCost(e.target.value)}
            placeholder="30"
            className="w-full px-4 py-2.5 bg-white border border-mono-900 rounded-lg text-mono-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mono-350 mb-1.5">
            Taux de gaspillage (%)
          </label>
          <input
            type="number"
            value={tauxGaspillage}
            onChange={(e) => setTauxGaspillage(e.target.value)}
            placeholder="14"
            className="w-full px-4 py-2.5 bg-white border border-mono-900 rounded-lg text-mono-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {caNum > 0 && fcNum > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard
            label="Achats alimentaires annuels"
            value={`${achats.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR`}
            color="text-mono-100"
          />
          <ResultCard
            label="Pertes liées au gaspillage"
            value={`${pertes.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR`}
            color="text-red-600"
          />
          <ResultCard
            label="Économie potentielle (-30 %)"
            value={`${economie30.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR`}
            color="text-emerald-600"
          />
        </div>
      )}
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
      <h2 className="text-2xl font-bold text-mono-100">{children}</h2>
    </div>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-50 border-red-100',
    amber: 'bg-amber-50 border-amber-100',
    emerald: 'bg-emerald-50 border-emerald-100',
  };
  const textColors: Record<string, string> = {
    red: 'text-red-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
  };
  return (
    <div className={`${colors[color]} border rounded-2xl p-5 text-center`}>
      <div className={`text-2xl font-extrabold ${textColors[color]} mb-1`}>{value}</div>
      <div className="text-sm text-mono-400">{label}</div>
    </div>
  );
}

function CauseCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ValorizationCard({ item, idea }: { item: string; idea: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-emerald-100">
      <div className="font-semibold text-sm text-mono-100 mb-0.5">{item}</div>
      <div className="text-xs text-mono-400">{idea}</div>
    </div>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-4 text-center">
      <div className="text-xs text-mono-500 mb-1">{label}</div>
      <div className={`text-xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
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
