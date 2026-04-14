import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Trash2, Calculator, ArrowRight, BookOpen, Lightbulb, AlertTriangle, Users, Leaf, TrendingDown, BarChart3, ShoppingBasket, Scale, Recycle, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment reduire le gaspillage alimentaire en restaurant"
   Mot-cle principal : gaspillage alimentaire restaurant
   ~1 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

export default function BlogGaspillage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Reduire le gaspillage alimentaire en restaurant" description="Solutions concretes pour reduire le gaspillage alimentaire dans votre restaurant : FIFO, portionnement, valorisation des dechets, suivi des pertes." path="/blog/gaspillage-alimentaire" type="article" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer mon food cost
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero / H1 ── */}
      <header className="bg-gradient-to-b from-emerald-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5" />
            Guide anti-gaspillage 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
            Comment reduire le gaspillage <br className="hidden sm:block" />
            alimentaire en restaurant
          </h1>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed">
            En France, un restaurant jette en moyenne 14 % de ses achats alimentaires.
            Cela represente entre 5 000 et 20 000 EUR par an de pertes directes sur vos marges.
            Decouvrez 5 methodes concretes pour reduire ce gaspillage de 30 % et plus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-[#737373]">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Par l'equipe RestauMargin</span>
            <span>|</span>
            <span>Mis a jour : avril 2026</span>
            <span>|</span>
            <span>10 min de lecture</span>
          </div>
        </div>
      </header>

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-[#404040]">
            {[
              { href: '#chiffres', label: 'Le gaspillage alimentaire en restauration : les chiffres cles' },
              { href: '#causes', label: 'Les principales causes du gaspillage en cuisine' },
              { href: '#astuce-1', label: 'Astuce 1 : Le systeme FIFO et la gestion des DLC' },
              { href: '#astuce-2', label: 'Astuce 2 : Les fiches techniques calibrees' },
              { href: '#astuce-3', label: 'Astuce 3 : La pesee et le suivi des dechets' },
              { href: '#astuce-4', label: 'Astuce 4 : L\'ajustement des commandes par prevision' },
              { href: '#astuce-5', label: 'Astuce 5 : La valorisation des surplus' },
              { href: '#calculateur', label: 'Calculez votre gaspillage annuel' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'RestauMargin vous aide a reduire votre gaspillage' },
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
            Le gaspillage alimentaire en restauration : les chiffres cles
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le gaspillage alimentaire en restaurant est un fleau economique, ecologique et ethique.
              Selon l'ADEME, la restauration commerciale et collective genere chaque annee environ
              900 000 tonnes de dechets alimentaires en France. Cela represente 14 % des achats
              alimentaires qui finissent a la poubelle au lieu d'etre servis aux clients.
            </p>
            <p>
              Pour un restaurant realisant 500 000 EUR de chiffre d'affaires annuel avec un food cost
              de 30 %, cela signifie 150 000 EUR d'achats alimentaires. Si 14 % sont gaspilles, ce sont
              21 000 EUR de pertes seches chaque annee — l'equivalent de deux mois de loyer pour un
              restaurant moyen a Paris.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-8">
            <StatCard value="14 %" label="des achats alimentaires gaspilles en moyenne" color="red" />
            <StatCard value="21 000 EUR" label="de pertes annuelles pour un restaurant moyen" color="amber" />
            <StatCard value="30 %" label="de reduction possible avec les bonnes pratiques" color="emerald" />
          </div>

          <div className="prose-content mt-8">
            <p>
              Le gaspillage alimentaire en restauration intervient a plusieurs niveaux : lors de la
              reception des marchandises (produits abimes ou non conformes), en stockage (mauvaise
              rotation, rupture de la chaine du froid), en preparation (epluchures excessives, erreurs
              de decoupe, surproduction), au service (portions surdimensionnees, retours d'assiettes)
              et apres le service (restes non reutilises, surplus non valorises).
            </p>
            <p>
              La loi AGEC (Anti-Gaspillage pour une Economie Circulaire), renforcee en 2025, impose
              desormais aux restaurants de plus de 150 couverts par jour de realiser un diagnostic
              de gaspillage alimentaire et de mettre en place un plan d'action. Les sanctions peuvent
              aller jusqu'a 3 750 EUR d'amende pour les contrevenants.
            </p>

            <Callout type="info">
              <strong>Chiffre cle :</strong> Selon une etude de The World Resources Institute, reduire
              le gaspillage alimentaire de seulement 1 EUR genere en moyenne 14 EUR de retour sur
              investissement pour un restaurant. C'est l'un des meilleurs ROI que vous puissiez
              obtenir en restauration.
            </Callout>

            <p>
              La bonne nouvelle, c'est que les marges de progression sont enormes. Les restaurants
              les plus performants parviennent a limiter leur taux de gaspillage a 3-5 % de leurs
              achats, soit quatre fois moins que la moyenne du secteur. Ce n'est pas une question
              de budget ou de taille d'etablissement — c'est une question de methode.
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
              Avant de parler solutions, il faut comprendre d'ou vient le gaspillage alimentaire dans
              votre restaurant. Voici les cinq causes les plus courantes, classees par ordre d'impact
              financier.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <CauseCard
              number={1}
              title="La surproduction en mise en place"
              desc="C'est la cause numero un. Par securite ou par habitude, les cuisiniers preparent trop de sauces, garnitures et accompagnements. En fin de service, ces surplus sont souvent jetes. Un restaurant moyen surpoduit de 15 a 25 % par rapport a ses besoins reels."
            />
            <CauseCard
              number={2}
              title="La mauvaise rotation des stocks (pas de FIFO)"
              desc="Sans un systeme rigoureux de rotation (Premier Entre, Premier Sorti), les produits au fond du frigo depassent leur DLC. Les nouveaux arrivages sont places devant les anciens, condamnant les stocks existants."
            />
            <CauseCard
              number={3}
              title="Les portions non standardisees"
              desc="Sans fiches techniques precises et sans pesee systematique, chaque cuisinier sert des quantites differentes. La moyenne des portions depasse souvent de 10 a 20 % la portion prevue, engendrant des couts matieres supplementaires et des retours d'assiettes."
            />
            <CauseCard
              number={4}
              title="Les commandes non optimisees"
              desc="Commander 'au feeling' sans analyser les previsions de frequentation conduit a des stocks excessifs sur certains produits et des ruptures sur d'autres. Le resultat : des denrees perissables qui finissent a la poubelle."
            />
            <CauseCard
              number={5}
              title="L'absence de valorisation des surplus"
              desc="Les epluchures de legumes, les parures de viande, les fruits trop murs — autant de 'dechets' qui pourraient etre transformes en bouillons, garnitures, desserts ou confits. Sans une culture culinaire anti-gaspi, ces ressources sont perdues."
            />
          </div>
        </section>

        {/* ═════════════ ASTUCE 1 : FIFO ═════════════ */}
        <section id="astuce-1" className="mb-16">
          <SectionHeading icon={<ShoppingBasket className="w-6 h-6" />} number="3">
            Astuce 1 : Le systeme FIFO et la gestion des DLC
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le FIFO (First In, First Out — Premier Entre, Premier Sorti) est la regle d'or de
              la gestion des stocks en restauration. Le principe est simple : les produits recus en
              premier doivent etre utilises en premier. Pourtant, seulement 40 % des restaurants
              l'appliquent systematiquement.
            </p>
            <p>
              Pour mettre en place un FIFO efficace, commencez par etiqueter chaque produit a la reception
              avec la date de reception et la DLC (Date Limite de Consommation). Organisez vos etageres
              de maniere a ce que les produits les plus anciens soient toujours devant. Instaurez une
              verification quotidienne des DLC en debut de service — 5 minutes qui peuvent vous
              economiser des centaines d'euros par semaine.
            </p>

            <Callout type="warning">
              <strong>Attention :</strong> Ne confondez pas DLC et DDM (Date de Durabilite Minimale).
              La DLC est imperative (produits frais, viandes, produits laitiers) — au-dela, le produit
              doit etre jete. La DDM ("a consommer de preference avant") est indicative : un produit
              peut encore etre utilise apres cette date si son aspect, odeur et gout sont corrects.
            </Callout>

            <p>
              <strong>Exemple concret :</strong> Le restaurant Le Petit Jardin a Lyon a reduit ses
              pertes liees aux DLC depassees de 68 % en trois mois simplement en instaurant un
              code couleur sur les etiquettes : vert (plus de 3 jours), orange (1 a 3 jours),
              rouge (dernier jour). Les produits "orange" et "rouge" sont prioritaires en mise en place.
            </p>
            <p>
              Le gain moyen constate par les restaurants qui mettent en place un FIFO rigoureux est
              de 3 000 a 6 000 EUR par an de pertes evitees, pour un investissement quasi nul
              (etiquettes et un peu de discipline).
            </p>
          </div>
        </section>

        {/* ═════════════ ASTUCE 2 : Fiches techniques ═════════════ */}
        <section id="astuce-2" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Astuce 2 : Les fiches techniques calibrees
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fiche technique de cuisine, c'est la recette detaillee d'un plat avec les quantites
              precises de chaque ingredient pour une portion. C'est l'outil fondamental pour maitriser
              vos couts et reduire le gaspillage alimentaire en restaurant.
            </p>
            <p>
              Sans fiche technique, chaque cuisinier prepare le plat "a sa facon" avec des quantites
              variables. Le resultat : des portions irregulieres, un food cost imprevisible et du
              gaspillage systematique. Une etude de Cornell University montre que les restaurants
              sans fiches techniques gaspillent en moyenne 22 % de plus que ceux qui les utilisent.
            </p>
            <p>
              Votre fiche technique doit inclure : la liste exacte des ingredients avec les grammages
              par portion, le rendement apres cuisson (un filet de boeuf perd 25 % de son poids a
              la cuisson), le cout matiere par portion, le prix de vente recommande et les instructions
              de dressage avec photo.
            </p>

            <Callout type="info">
              <strong>Astuce :</strong> Pesez vos portions pendant une semaine et comparez avec vos
              fiches techniques. Vous serez surpris de l'ecart. La plupart des restaurants decouvrent
              un ecart moyen de 15 % entre la portion theorique et la portion reelle — soit 15 %
              de food cost en plus.
            </Callout>

            <p>
              <strong>Lien utile :</strong> Consultez notre{' '}
              <Link to="/blog/fiches-techniques" className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                guide complet sur les fiches techniques de cuisine
              </Link>{' '}
              pour apprendre a creer et maintenir vos fiches techniques efficacement.
            </p>
          </div>
        </section>

        {/* ═════════════ ASTUCE 3 : Pesee des dechets ═════════════ */}
        <section id="astuce-3" className="mb-16">
          <SectionHeading icon={<Trash2 className="w-6 h-6" />} number="5">
            Astuce 3 : La pesee et le suivi des dechets
          </SectionHeading>

          <div className="prose-content">
            <p>
              Ce qui ne se mesure pas ne s'ameliore pas. La pesee des dechets alimentaires est l'une
              des methodes les plus efficaces pour reduire le gaspillage, car elle rend le probleme
              visible et mesurable. C'est aussi une obligation reglementaire pour les restaurants
              produisant plus de 5 tonnes de biodechets par an (seuil abaisse en 2024).
            </p>
            <p>
              Le protocole est simple : placez une balance et un cahier (ou une tablette) a cote de
              chaque poubelle de cuisine. Chaque fois qu'un cuisinier jette un aliment, il note le
              type de produit, la quantite et la raison (DLC depassee, erreur de preparation,
              retour d'assiette, surplus de production). En fin de semaine, analysez les donnees.
            </p>
            <p>
              Les restaurants qui pratiquent la pesee des dechets constatent une reduction moyenne de
              20 % du gaspillage des le premier mois — simplement parce que l'equipe prend conscience
              des quantites jetees. C'est l'effet "miroir" : quand on sait qu'on est observe (ou
              qu'on s'observe soi-meme), on fait naturellement plus attention.
            </p>
            <p>
              Concretement, categorisez vos dechets en quatre familles : preparations non servies
              (surproduction), produits perimes (rotation insuffisante), epluchures et parures
              (rendement), retours d'assiettes (portions trop grandes ou plats peu apprecies).
              Chaque categorie appelle une action correctrice differente.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> La chaine de restaurants Nando's a reduit son gaspillage
              alimentaire de 32 % en un an grace a un programme de pesee quotidienne des dechets combine
              avec des objectifs d'amelioration par equipe. Le jeu de competition entre equipes a
              renforce l'engagement de tout le personnel.
            </Callout>
          </div>
        </section>

        {/* ═════════════ ASTUCE 4 : Previsions ═════════════ */}
        <section id="astuce-4" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="6">
            Astuce 4 : L'ajustement des commandes par prevision
          </SectionHeading>

          <div className="prose-content">
            <p>
              Commander la bonne quantite au bon moment, c'est le Saint-Graal de la gestion des
              stocks en restauration. Trop de stock = gaspillage. Pas assez = ruptures et clients
              decus. La cle, c'est la prevision.
            </p>
            <p>
              Analysez votre historique de ventes par jour de la semaine, par semaine du mois et par
              saison. Un restaurant moyen sert 30 % de couverts en plus le vendredi et le samedi
              que le mardi. Les plats a base de salade se vendent 40 % de plus en ete. En janvier,
              apres les fetes, la frequentation baisse de 15 a 20 %.
            </p>
            <p>
              Utilisez ces donnees pour ajuster vos commandes. Un bon reflexe : commandez pour 2 a
              3 jours maximum sur les produits frais (viandes, poissons, legumes fragiles), et
              verifiez vos stocks chaque matin avant de passer commande. Evitez les commandes
              automatiques "fixes" qui ne tiennent pas compte de la realite du moment.
            </p>
            <p>
              Integrez aussi les evenements exterieurs : matches de football, jours feries, meteo
              (une terrasse pleine en ete, vide sous la pluie), travaux dans la rue, greves de
              transports. Chaque facteur impacte votre frequentation et donc vos besoins en
              matieres premieres.
            </p>
            <p>
              <strong>Exemple :</strong> Le Bistrot du Marche a Bordeaux a reduit ses achats
              excessifs de 18 % en installant un simple tableur de suivi des ventes par jour et par
              plat. En 6 mois, le gain cumule a depasse 8 000 EUR. RestauMargin automatise cette
              analyse avec ses outils de prevision intelligente.
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
              Avant d'etre un dechet, chaque aliment est une ressource potentielle. La cuisine
              anti-gaspi, c'est l'art de transformer ce qui aurait ete jete en un produit vendable
              ou au moins utilisable. Cette approche est au coeur de la gastronomie durable et de
              plus en plus valorisee par les clients.
            </p>
            <p>
              Les epluchures de legumes deviennent des bouillons, des chips ou des poudres aromatiques.
              Les parures de viande se transforment en terrines, rillettes ou fonds de sauce. Le pain
              rassis devient du pain perdu, de la chapelure ou un gaspacho. Les fruits trop murs
              font des compotes, des coulis ou des smoothies.
            </p>

            <div className="mt-6 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-[#111111] mb-4 flex items-center gap-2">
                <Recycle className="w-5 h-5 text-emerald-600" />
                Idees de valorisation par type de dechet
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ValorizationCard item="Epluchures de legumes" idea="Bouillon, chips deshydratees, pesto de fanes" />
                <ValorizationCard item="Parures de viande" idea="Fond brun, terrine, rillettes" />
                <ValorizationCard item="Pain rassis" idea="Pain perdu, chapelure, crotons" />
                <ValorizationCard item="Fruits trop murs" idea="Compote, coulis, glace, confiture" />
                <ValorizationCard item="Herbes fanees" idea="Huile aromatisee, beurre compose" />
                <ValorizationCard item="Surplus de production" idea="Plat du jour, doggy bag, partenariat Too Good To Go" />
              </div>
            </div>

            <p>
              Au-dela de la cuisine, pensez aux partenariats avec des applications anti-gaspi comme
              Too Good To Go ou Phenix. Ces plateformes vous permettent de vendre vos surplus a
              prix reduit en fin de service. C'est du chiffre d'affaires supplementaire sur des
              produits qui auraient ete jetes — une victoire economique et ecologique.
            </p>
            <p>
              Les doggy bags (emballages pour emporter les restes) sont desormais une obligation
              legale en France. Proposez-les systematiquement a vos clients : cela reduit le
              gaspillage cote salle et renforce votre image responsable. Investissez dans des
              emballages eco-responsables alignes avec votre positionnement.
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
              Utilisez ce calculateur simple pour estimer le cout du gaspillage alimentaire dans
              votre restaurant. Entrez votre chiffre d'affaires annuel et votre food cost, et
              decouvrez combien vous pourriez economiser en reduisant vos pertes.
            </p>
          </div>

          <GaspillageCalculator />
        </section>

        {/* ═════════════ Articles lies ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Articles complementaires</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/fiches-techniques" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Fiche technique de cuisine : le guide complet</h3>
              <p className="text-sm text-[#737373]">Creez des fiches techniques precises pour maitriser vos portions et couts.</p>
            </Link>
            <Link to="/blog/haccp" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Guide HACCP pour les restaurants</h3>
              <p className="text-sm text-[#737373]">Temperatures, principes et checklist pour respecter l'hygiene alimentaire.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">5 methodes pour reduire votre food cost</h3>
              <p className="text-sm text-[#737373]">Fiches techniques, negociation fournisseurs, menu engineering et plus.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            <FAQItem
              q="Quel est le taux de gaspillage moyen dans un restaurant ?"
              a="En France, un restaurant gaspille en moyenne 14 % de ses achats alimentaires, soit entre 5 000 et 20 000 EUR par an selon le chiffre d'affaires. Les restaurants les plus performants parviennent a descendre a 3-5 % grace a des methodes rigoureuses de gestion des stocks et de production."
            />
            <FAQItem
              q="Comment mesurer le gaspillage alimentaire dans mon restaurant ?"
              a="La methode la plus simple est la pesee quotidienne des dechets alimentaires, categorises en quatre types : surproduction (plats prepares non vendus), produits perimes (DLC depassee), epluchures et parures (rendement), retours d'assiettes (restes clients). Pesez pendant une semaine pour avoir un diagnostic precis."
            />
            <FAQItem
              q="Quelles sont les obligations legales sur le gaspillage alimentaire ?"
              a="La loi AGEC impose aux restaurants de plus de 150 couverts/jour un diagnostic de gaspillage et un plan d'action. Depuis 2024, tous les restaurants doivent trier leurs biodechets. Les doggy bags doivent etre proposes aux clients. Les sanctions peuvent atteindre 3 750 EUR d'amende."
            />
            <FAQItem
              q="Combien peut-on economiser en reduisant le gaspillage ?"
              a="En appliquant rigoureusement les 5 methodes decrites dans cet article (FIFO, fiches techniques, pesee des dechets, prevision des commandes, valorisation des surplus), un restaurant moyen peut reduire son gaspillage de 30 %, soit une economie de 6 000 a 12 000 EUR par an."
            />
            <FAQItem
              q="Too Good To Go est-il rentable pour un restaurant ?"
              a="Oui, dans la majorite des cas. Vous vendez vos surplus a un prix reduit (generalement 3 a 5 EUR le panier) au lieu de les jeter. L'application prend une commission de 1,09 EUR par panier. C'est du chiffre d'affaires supplementaire sur des produits qui auraient ete perdus. En plus, cela vous apporte de la visibilite."
            />
            <FAQItem
              q="Comment impliquer mon equipe dans la lutte contre le gaspillage ?"
              a="Commencez par rendre le probleme visible : affichez les chiffres de pesee en cuisine. Fixez des objectifs collectifs (par exemple, reduire les dechets de 10 % en un mois). Organisez des challenges entre equipes. Formez vos cuisiniers aux techniques de valorisation. Et surtout, valorisez les progres — un compliment motive autant qu'une prime."
            />
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              RestauMargin vous aide a reduire votre gaspillage de 30 %
            </h2>
            <p className="text-emerald-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Suivi des stocks en temps reel, alertes DLC, fiches techniques calibrees, previsions
              de ventes et analyse des dechets — tout est automatise pour que vous vous concentriez
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
      <footer className="bg-[#FAFAFA] border-t border-[#E5E7EB] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-[#737373]">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-[#111111] font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#A3A3A3]">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-[#A3A3A3]">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.
          </p>
        </div>
      </footer>

      {/* ── JSON-LD Article Schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Comment reduire le gaspillage alimentaire en restaurant : 5 astuces concretes',
            description: 'Reduisez le gaspillage alimentaire de votre restaurant de 30 %. 5 methodes concretes, calculateur de pertes et FAQ complete pour les restaurateurs.',
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
                  text: 'La methode la plus simple est la pesee quotidienne des dechets alimentaires, categorises en quatre types : surproduction, produits perimes, epluchures/parures, retours d\'assiettes.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quelles sont les obligations legales sur le gaspillage alimentaire ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'La loi AGEC impose aux restaurants de plus de 150 couverts/jour un diagnostic de gaspillage et un plan d\'action. Les sanctions peuvent atteindre 3 750 EUR d\'amende.',
                },
              },
              {
                '@type': 'Question',
                name: 'Combien peut-on economiser en reduisant le gaspillage ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Un restaurant moyen peut reduire son gaspillage de 30 %, soit une economie de 6 000 a 12 000 EUR par an.',
                },
              },
              {
                '@type': 'Question',
                name: 'Too Good To Go est-il rentable pour un restaurant ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Oui, vous vendez vos surplus a prix reduit au lieu de les jeter. L\'application prend une commission de 1,09 EUR par panier. C\'est du chiffre d\'affaires supplementaire.',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment impliquer mon equipe dans la lutte contre le gaspillage ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Rendez le probleme visible avec les chiffres de pesee, fixez des objectifs collectifs, organisez des challenges entre equipes et formez aux techniques de valorisation.',
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
    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
      <h3 className="font-bold text-[#111111] mb-6 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-teal-600" />
        Calculez votre gaspillage annuel
      </h3>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#404040] mb-1.5">
            Chiffre d'affaires annuel (EUR)
          </label>
          <input
            type="number"
            value={ca}
            onChange={(e) => setCa(e.target.value)}
            placeholder="500000"
            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-[#111111] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#404040] mb-1.5">
            Food cost (%)
          </label>
          <input
            type="number"
            value={foodCost}
            onChange={(e) => setFoodCost(e.target.value)}
            placeholder="30"
            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-[#111111] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#404040] mb-1.5">
            Taux de gaspillage (%)
          </label>
          <input
            type="number"
            value={tauxGaspillage}
            onChange={(e) => setTauxGaspillage(e.target.value)}
            placeholder="14"
            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-[#111111] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {caNum > 0 && fcNum > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard
            label="Achats alimentaires annuels"
            value={`${achats.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR`}
            color="text-[#111111]"
          />
          <ResultCard
            label="Pertes liees au gaspillage"
            value={`${pertes.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR`}
            color="text-red-600"
          />
          <ResultCard
            label="Economie potentielle (-30 %)"
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
      <h2 className="text-2xl font-bold text-[#111111]">{children}</h2>
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
      <div className="text-sm text-[#525252]">{label}</div>
    </div>
  );
}

function CauseCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[#111111] mb-1.5">{title}</h3>
        <p className="text-sm text-[#525252] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ValorizationCard({ item, idea }: { item: string; idea: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-emerald-100">
      <div className="font-semibold text-sm text-[#111111] mb-0.5">{item}</div>
      <div className="text-xs text-[#525252]">{idea}</div>
    </div>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center">
      <div className="text-xs text-[#737373] mb-1">{label}</div>
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
    <details className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-[#111111] cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-[#A3A3A3] group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-[#525252] leading-relaxed">{a}</p>
    </details>
  );
}
