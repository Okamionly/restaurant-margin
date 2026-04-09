import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment calculer la marge de votre restaurant en 2026"
   Mot-clé principal : calcul marge restaurant
   ~2 500 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

export default function BlogCalcMarge() {
  useEffect(() => {
    document.title = 'Comment calculer la marge de votre restaurant en 2026 | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Guide complet du calcul de marge restaurant : marge brute, marge nette, food cost. Formules, exemples chiffrés et tableau par type de restaurant.'
      );
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

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
              Calculer ma marge
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
      <header className="bg-gradient-to-b from-teal-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Guide complet 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
            Comment calculer la marge <br className="hidden sm:block" />
            de votre restaurant en 2026
          </h1>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed">
            Le calcul de marge restaurant est la clef de voute de votre rentabilite.
            Decouvrez les formules, les benchmarks par type d'etablissement et les erreurs
            qui plombent vos benefices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-[#737373]">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Par l'equipe RestauMargin</span>
            <span>|</span>
            <span>Mis a jour : avril 2026</span>
            <span>|</span>
            <span>12 min de lecture</span>
          </div>
        </div>
      </header>

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-[#404040]">
            {[
              { href: '#pourquoi', label: 'Pourquoi la marge est critique pour votre restaurant' },
              { href: '#trois-marges', label: 'Les 3 types de marges a connaitre' },
              { href: '#formules', label: 'Formules de calcul avec exemples chiffres' },
              { href: '#food-cost-tableau', label: 'Tableau du food cost par type de restaurant' },
              { href: '#erreurs', label: 'Les 5 erreurs courantes qui detruisent votre marge' },
              { href: '#automatiser', label: 'Comment RestauMargin automatise le calcul' },
              { href: '#cta', label: 'Calculez votre marge gratuitement' },
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

        {/* ═════════════ SECTION 1 : Introduction ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi la marge est critique pour votre restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Dans la restauration, la difference entre un etablissement rentable et un etablissement
              qui ferme ses portes se joue souvent a quelques points de marge. Selon les chiffres de
              l'INSEE, pres de 30 % des restaurants ferment dans les trois premieres annees. La cause
              numero un ? Une mauvaise maitrise des couts et, par extension, du calcul de marge restaurant.
            </p>
            <p>
              Votre marge, c'est ce qui reste une fois que vous avez paye vos matieres premieres,
              votre personnel, votre loyer et toutes vos charges. C'est votre oxygene financier.
              Sans un suivi rigoureux, vous naviguez a l'aveugle — et les mauvaises surprises
              arrivent toujours au pire moment : hausse du prix du beurre, augmentation du SMIC,
              inflation sur l'energie.
            </p>
            <p>
              En 2026, la pression est plus forte que jamais. L'inflation alimentaire a cumule
              plus de 20 % sur trois ans. Les salaires minimums ont ete revalorises plusieurs fois.
              Les couts energetiques restent volatils. Dans ce contexte, maitriser le calcul de marge
              de votre restaurant n'est plus un luxe : c'est une question de survie.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Un restaurant qui ameliore son food cost de seulement
              2 points (par exemple de 32 % a 30 %) sur un chiffre d'affaires de 500 000 EUR gagne
              10 000 EUR de benefice net supplementaire par an.
            </Callout>

            <p>
              Ce guide vous donne toutes les formules, les benchmarks et les outils pour reprendre
              le controle de vos marges. Que vous dirigiez un bistrot, une brasserie ou un restaurant
              gastronomique, les principes sont les memes — seuls les ratios cibles different.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Les 3 types de marges ═════════════ */}
        <section id="trois-marges" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
            Les 3 types de marges a connaitre
          </SectionHeading>

          <div className="prose-content">
            <p>
              Quand on parle de "marge" en restauration, on melange souvent trois notions differentes.
              Chacune repond a une question precise et vous donne une vision complementaire de votre
              rentabilite. Voici les trois indicateurs que tout restaurateur doit maitriser.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <MargeCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Marge brute"
              color="emerald"
              desc="C'est la difference entre votre chiffre d'affaires et le cout des matieres premieres. Elle mesure votre capacite a transformer des ingredients en valeur. C'est le premier indicateur a surveiller au quotidien."
              formula="CA - Cout matieres"
              target="65 % a 75 %"
            />
            <MargeCard
              icon={<Percent className="w-6 h-6" />}
              title="Cout matiere (Food Cost)"
              color="amber"
              desc="Le ratio entre le cout de vos ingredients et votre prix de vente. C'est l'indicateur le plus utilise dans la profession. Un food cost maitrise signifie des achats optimises et des fiches techniques respectees."
              formula="Cout ingredients / Prix de vente x 100"
              target="25 % a 35 %"
            />
            <MargeCard
              icon={<Target className="w-6 h-6" />}
              title="Marge nette"
              color="blue"
              desc="Ce qui reste reellement dans votre poche apres toutes les charges : matieres, personnel, loyer, energie, assurances, impots. C'est la mesure ultime de votre rentabilite globale."
              formula="CA - Toutes charges"
              target="5 % a 15 %"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              La marge brute et le food cost sont les deux faces d'une meme piece : si votre food cost
              est de 30 %, votre marge brute est automatiquement de 70 %. La marge nette, elle, integre
              tout le reste — c'est pourquoi elle est nettement plus basse.
            </p>
            <p>
              Attention a ne pas confondre ces trois indicateurs. Un restaurant peut avoir un excellent
              food cost (28 %) mais une marge nette catastrophique (2 %) si ses charges de personnel
              ou son loyer sont demesures. Le calcul de marge restaurant doit donc toujours etre
              multi-dimensionnel.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Formules de calcul ═════════════ */}
        <section id="formules" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Formules de calcul avec exemples chiffres
          </SectionHeading>

          <div className="prose-content">
            <p>
              Passons a la pratique. Voici les formules essentielles pour maitriser le calcul de marge
              de votre restaurant, illustrees avec un exemple concret.
            </p>
          </div>

          {/* Exemple concret */}
          <div className="mt-8 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-[#111111] mb-4 text-lg">Exemple : Entrecote grillee</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#404040] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full" />
                Prix de vente HT : <strong className="text-[#111111]">24,00 EUR</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                Cout matieres premieres : <strong className="text-[#111111]">7,20 EUR</strong>
              </div>
            </div>

            <div className="space-y-6">
              <FormulaBlock
                label="Food Cost (%)"
                formula="(Cout matieres / Prix de vente) x 100"
                calcul="(7,20 / 24,00) x 100"
                resultat="30 %"
                verdict="Objectif atteint"
                color="emerald"
              />
              <FormulaBlock
                label="Marge brute (EUR)"
                formula="Prix de vente - Cout matieres"
                calcul="24,00 - 7,20"
                resultat="16,80 EUR"
                verdict="Bonne marge unitaire"
                color="emerald"
              />
              <FormulaBlock
                label="Marge brute (%)"
                formula="(Marge brute / Prix de vente) x 100"
                calcul="(16,80 / 24,00) x 100"
                resultat="70 %"
                verdict="Excellent ratio"
                color="emerald"
              />
              <FormulaBlock
                label="Coefficient multiplicateur"
                formula="Prix de vente / Cout matieres"
                calcul="24,00 / 7,20"
                resultat="3,33"
                verdict="Standard restauration"
                color="amber"
              />
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-[#111111] mb-3">
              La methode du coefficient multiplicateur
            </h3>
            <p>
              Le coefficient multiplicateur est un raccourci tres utilise en restauration.
              Il permet de fixer rapidement un prix de vente a partir du cout matiere.
              Le principe est simple : vous multipliez le cout de vos ingredients par un coefficient
              (generalement entre 3 et 4) pour obtenir votre prix de vente HT.
            </p>
            <p>
              <strong>Formule :</strong> Prix de vente HT = Cout matieres x Coefficient multiplicateur
            </p>
            <p>
              Un coefficient de 3,0 correspond a un food cost de 33 %. Un coefficient de 4,0 correspond
              a un food cost de 25 %. Plus le coefficient est eleve, plus votre marge est confortable —
              mais attention a ne pas deconnecter vos prix du marche et des attentes clients.
            </p>

            <h3 className="text-xl font-bold text-[#111111] mb-3 mt-8">
              Le calcul de marge sur l'ensemble du menu
            </h3>
            <p>
              Calculer la marge plat par plat ne suffit pas. Vous devez aussi connaitre votre marge
              globale, c'est-a-dire la marge ponderee par le volume de ventes de chaque plat.
              Un plat a 80 % de marge qui se vend 2 fois par semaine pese moins qu'un plat a
              65 % de marge vendu 50 fois.
            </p>
            <p>
              C'est la qu'intervient le menu engineering : l'analyse croisee de la popularite
              et de la rentabilite de chaque plat. Cette discipline vous aide a identifier vos
              "stars" (populaires et rentables), vos "chevaux de labour" (populaires mais peu
              rentables), vos "enigmes" (rentables mais peu vendues) et vos "poids morts"
              (ni rentables ni populaires).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Tableau food cost ═════════════ */}
        <section id="food-cost-tableau" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Tableau du food cost par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tous les restaurants n'ont pas les memes contraintes. Un bistrot de quartier,
              une brasserie traditionnelle et un restaurant gastronomique n'operent pas avec les
              memes ratios. Voici les benchmarks de reference pour le calcul de marge restaurant
              en France en 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#404040]">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Food Cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge nette</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                {[
                  { type: 'Restauration rapide / Fast-food', fc: '25 - 30 %', mb: '70 - 75 %', coef: '3,3 - 4,0', mn: '8 - 15 %' },
                  { type: 'Bistrot / Brasserie', fc: '28 - 33 %', mb: '67 - 72 %', coef: '3,0 - 3,6', mn: '5 - 12 %' },
                  { type: 'Restaurant traditionnel', fc: '30 - 35 %', mb: '65 - 70 %', coef: '2,9 - 3,3', mn: '5 - 10 %' },
                  { type: 'Pizzeria / Creperie', fc: '22 - 28 %', mb: '72 - 78 %', coef: '3,6 - 4,5', mn: '10 - 18 %' },
                  { type: 'Restaurant gastronomique', fc: '30 - 40 %', mb: '60 - 70 %', coef: '2,5 - 3,3', mn: '3 - 10 %' },
                  { type: 'Dark kitchen / Livraison', fc: '28 - 35 %', mb: '65 - 72 %', coef: '2,9 - 3,6', mn: '5 - 12 %' },
                  { type: 'Traiteur / Banquet', fc: '30 - 38 %', mb: '62 - 70 %', coef: '2,6 - 3,3', mn: '8 - 15 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                    <td className="py-3 px-4 font-medium text-[#111111]">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.mb}</td>
                    <td className="py-3 px-4 text-center">{row.coef}</td>
                    <td className="py-3 px-4 text-center">{row.mn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Quelques observations cles sur ce tableau :
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#404040] mt-4">
              <li>
                <strong>Les pizzerias et creperies</strong> ont le meilleur food cost car les
                ingredients de base (farine, oeufs, tomates) sont tres peu couteux. Leur marge
                brute est donc naturellement plus elevee.
              </li>
              <li>
                <strong>Le gastronomique</strong> a un food cost plus eleve car il utilise des
                produits premium (foie gras, truffe, poissons nobles), mais compense par des
                prix de vente beaucoup plus hauts. Sa marge nette reste toutefois fragile a cause
                de charges de personnel elevees (ratio personnel souvent superieur a 40 %).
              </li>
              <li>
                <strong>Les dark kitchens</strong> economisent sur le loyer et le service en salle,
                mais cedent 25 a 35 % de commission aux plateformes de livraison, ce qui comprime
                la marge nette.
              </li>
              <li>
                <strong>Le traiteur</strong> beneficie d'economies d'echelle sur les grosses
                commandes, mais doit absorber des couts logistiques (transport, materiel, personnel
                extra).
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Erreurs courantes ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="5">
            Les 5 erreurs courantes qui detruisent votre marge
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Ne pas peser les ingredients"
              desc="C'est l'erreur la plus repandue et la plus couteuse. Sans pesee systematique, vos portions varient d'un service a l'autre. Un cuisinier genereux peut facilement ajouter 20 % de matiere premiere en trop sur chaque assiette. Sur un mois, cela represente des milliers d'euros de marge envolee. La solution : des fiches techniques avec des grammages precis et une balance dans chaque poste de travail."
            />
            <ErreurCard
              number={2}
              title="Ignorer les pertes et le gaspillage"
              desc="Epluchures, parures, invendus, casse, vol — ces pertes invisibles peuvent representer 5 a 10 % de vos achats. Si vous n'integrez pas ces pertes dans votre calcul de marge restaurant, vous sous-estimez systematiquement votre food cost reel. Chaque ingredient a un rendement (un kilo de carottes brutes ne donne que 800 g de carottes epluchees). Integrer ces rendements dans vos fiches techniques est indispensable."
            />
            <ErreurCard
              number={3}
              title="Ne pas mettre a jour les prix fournisseurs"
              desc="Les prix des matieres premieres changent chaque semaine, parfois chaque jour pour les produits frais. Si votre fiche technique indique un prix de beurre a 4 EUR/kg alors qu'il est passe a 6 EUR/kg, votre calcul de marge est faux de 50 % sur cet ingredient. Idealement, votre outil de gestion doit etre connecte a vos factures fournisseurs pour mettre a jour les prix en temps reel."
            />
            <ErreurCard
              number={4}
              title="Confondre marge brute et marge nette"
              desc="Un food cost de 28 % ne signifie pas que vous gagnez 72 centimes sur chaque euro. Il vous reste encore a payer le personnel (30 a 45 % du CA), le loyer (8 a 12 %), l'energie (3 a 6 %), les assurances, les taxes et les frais divers. Beaucoup de restaurateurs fixent leurs prix uniquement sur le food cost et decouvrent trop tard que leur marge nette est quasi nulle."
            />
            <ErreurCard
              number={5}
              title="Ne pas analyser la rentabilite plat par plat"
              desc="Tous vos plats ne se valent pas. Certains ont une marge de 80 %, d'autres de 50 %. Si vous ne faites pas le menu engineering (analyse croisee popularite / rentabilite), vous risquez de promouvoir vos plats les moins rentables. Une carte bien construite met en avant les plats a forte marge et accompagne strategiquement les plats d'appel a faible marge."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces cinq erreurs combinees peuvent representer
            une perte de 8 a 15 points de marge brute. Sur un restaurant qui fait 600 000 EUR
            de CA annuel, c'est entre 48 000 EUR et 90 000 EUR de benefice potentiel qui disparait.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : RestauMargin automatise ═════════════ */}
        <section id="automatiser" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="6">
            Comment RestauMargin automatise le calcul de marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              Faire tous ces calculs a la main, sur un tableur Excel, c'est possible — mais
              extremement chronophage et source d'erreurs. C'est exactement pour cela que
              RestauMargin a ete concu : automatiser le calcul de marge restaurant de bout en bout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              {
                icon: <Calculator className="w-5 h-5" />,
                title: 'Fiches techniques automatiques',
                desc: 'Creez vos recettes avec les grammages exacts. Le food cost se calcule automatiquement a partir des prix fournisseurs en temps reel.'
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: 'Suivi de marge en temps reel',
                desc: 'Visualisez votre marge brute, votre food cost et votre marge nette au jour le jour, par plat, par categorie ou sur l\'ensemble du menu.'
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: 'Menu Engineering integre',
                desc: 'Identifiez vos stars, chevaux de labour, enigmes et poids morts. Optimisez votre carte pour maximiser la marge globale.'
              },
              {
                icon: <AlertTriangle className="w-5 h-5" />,
                title: 'Alertes de deviation',
                desc: 'Recevez une alerte quand un prix fournisseur augmente et impacte votre marge au-dela du seuil que vous avez defini.'
              },
              {
                icon: <DollarSign className="w-5 h-5" />,
                title: 'Scan de factures (OCR)',
                desc: 'Photographiez vos factures fournisseurs : les prix sont extraits automatiquement et vos fiches techniques sont mises a jour.'
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: 'Simulateur de prix',
                desc: 'Testez l\'impact d\'un changement de prix ou de fournisseur sur votre marge avant de prendre la decision.'
              },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-[#111111] mb-1.5">{feat.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              L'objectif de RestauMargin est de vous faire passer du calcul manuel (tableur,
              calculette, estimations approximatives) a un systeme automatise, precis et en temps
              reel. Vous gagnez du temps, vous gagnez en precision, et surtout vous gagnez
              en marge.
            </p>
            <p>
              Plus de 500 restaurants en France utilisent deja RestauMargin pour piloter leur
              rentabilite. Le gain moyen constate est de 3 a 5 points de marge brute dans les
              6 premiers mois d'utilisation, grace a une meilleure maitrise des portions,
              des achats et de la construction du menu.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Calculez votre marge gratuitement
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Utilisez notre calculateur de food cost en ligne. Ajoutez vos ingredients,
              vos quantites et votre prix de vente : vous obtenez instantanement votre
              marge brute, votre food cost et votre coefficient multiplicateur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Calculer mon food cost
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Creer un compte gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">5 methodes pour reduire votre food cost de 15 %</h3>
              <p className="text-sm text-[#737373]">Fiches techniques, negociation, gaspillage, menu engineering et mercuriale.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur : le guide complet</h3>
              <p className="text-sm text-[#737373]">Tableaux par categorie, erreurs courantes et cas pratique d'un menu a 35 EUR.</p>
            </Link>
            <Link to="/blog/ia-restauration" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">L'IA en restauration : gadget ou revolution ?</h3>
              <p className="text-sm text-[#737373]">Ce que l'IA peut vraiment faire pour votre restaurant (et ses limites).</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ FAQ Schema ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            <FAQItem
              q="Quel est le food cost ideal pour un restaurant ?"
              a="Le food cost ideal depend de votre type de restaurant. En regle generale, il se situe entre 25 % et 35 %. Une pizzeria peut viser 22-25 %, tandis qu'un restaurant gastronomique acceptera 35-40 %. L'essentiel est que votre food cost soit coherent avec votre structure de charges globale."
            />
            <FAQItem
              q="Comment calculer la marge brute d'un plat ?"
              a="Soustrayez le cout total des ingredients du prix de vente HT du plat. Par exemple, si un plat se vend 18 EUR et que les ingredients coutent 5,40 EUR, la marge brute est de 12,60 EUR, soit 70 %. La formule : Marge brute (%) = (Prix de vente - Cout matieres) / Prix de vente x 100."
            />
            <FAQItem
              q="Quelle est la difference entre marge brute et marge nette ?"
              a="La marge brute ne deduit que le cout des matieres premieres. La marge nette deduit toutes les charges : personnel, loyer, energie, assurances, taxes, etc. En restauration, la marge brute tourne autour de 65-75 % tandis que la marge nette se situe generalement entre 5 et 15 %."
            />
            <FAQItem
              q="A quelle frequence faut-il recalculer ses marges ?"
              a="Idealement chaque semaine pour le food cost global, et a chaque changement de prix fournisseur pour les fiches techniques individuelles. Les variations de prix des matieres premieres peuvent etre rapides, surtout sur les produits frais. Un outil comme RestauMargin automatise ce suivi en continu."
            />
            <FAQItem
              q="Comment calculer le coefficient multiplicateur en restauration ?"
              a="Le coefficient multiplicateur se calcule en divisant le prix de vente HT par le cout des matieres premieres. Inversement, vous pouvez l'obtenir via la formule : Coefficient = 1 / Food cost cible. Par exemple, pour un food cost cible de 30 %, le coefficient est de 3,33. Multipliez votre cout matiere par ce coefficient pour obtenir votre prix de vente HT."
            />
            <FAQItem
              q="Quel est le ratio personnel ideal en restauration ?"
              a="Le ratio personnel (masse salariale / chiffre d'affaires) se situe idealement entre 30 % et 40 % en restauration traditionnelle. En ajoutant le food cost (25-35 %), ces deux postes representent le prime cost, qui ne devrait pas depasser 65-70 % du CA pour garantir une marge nette viable."
            />
            <FAQItem
              q="Faut-il calculer sa marge en HT ou en TTC ?"
              a="Toujours en HT (hors taxes). La TVA collectee ne vous appartient pas, elle est reversee a l'Etat. Calculer votre food cost sur un prix TTC donnerait un ratio artificiellement bas et fausserait votre analyse. En France, la TVA en restauration sur place est de 10 %, a emporter de 5,5 % ou 10 % selon les produits."
            />
            <FAQItem
              q="Comment ameliorer sa marge sans augmenter les prix ?"
              a="Plusieurs leviers existent : optimiser les portions avec des fiches techniques precises, negocier avec vos fournisseurs, reduire le gaspillage (FIFO, pesee des dechets), utiliser le menu engineering pour promouvoir vos plats a forte marge, substituer certains ingredients par des alternatives moins couteuses sans sacrifier la qualite. RestauMargin vous aide a identifier ces opportunites automatiquement."
            />
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
            headline: 'Comment calculer la marge de votre restaurant en 2026',
            description: 'Guide complet du calcul de marge restaurant : marge brute, marge nette, food cost. Formules, exemples chiffres et tableau par type de restaurant.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-01',
            dateModified: '2026-04-05',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
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
                name: 'Quel est le food cost ideal pour un restaurant ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Le food cost ideal depend de votre type de restaurant. En regle generale, il se situe entre 25 % et 35 %. Une pizzeria peut viser 22-25 %, un restaurant gastronomique acceptera 35-40 %.',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment calculer la marge brute d\'un plat ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Soustrayez le cout total des ingredients du prix de vente HT du plat. Formule : Marge brute (%) = (Prix de vente - Cout matieres) / Prix de vente x 100.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quelle est la difference entre marge brute et marge nette ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'La marge brute ne deduit que le cout des matieres premieres. La marge nette deduit toutes les charges : personnel, loyer, energie, assurances, taxes. La marge brute tourne autour de 65-75 % tandis que la marge nette se situe entre 5 et 15 %.',
                },
              },
              {
                '@type': 'Question',
                name: 'A quelle frequence faut-il recalculer ses marges ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Idealement chaque semaine pour le food cost global, et a chaque changement de prix fournisseur pour les fiches techniques.',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment calculer le coefficient multiplicateur en restauration ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Le coefficient multiplicateur se calcule avec la formule : Coefficient = 1 / Food cost cible. Pour un food cost de 30 %, le coefficient est de 3,33. Multipliez le cout matiere par ce coefficient pour obtenir le prix de vente HT.',
                },
              },
              {
                '@type': 'Question',
                name: 'Quel est le ratio personnel ideal en restauration ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Le ratio personnel (masse salariale / CA) se situe entre 30 % et 40 %. En ajoutant le food cost (25-35 %), le prime cost ne devrait pas depasser 65-70 % du CA.',
                },
              },
              {
                '@type': 'Question',
                name: 'Faut-il calculer sa marge en HT ou en TTC ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Toujours en HT. La TVA collectee est reversee a l\'Etat. Calculer en TTC donnerait un ratio fausse. En France, la TVA restauration sur place est de 10 %.',
                },
              },
              {
                '@type': 'Question',
                name: 'Comment ameliorer sa marge sans augmenter les prix ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Optimiser les portions avec des fiches techniques, negocier fournisseurs, reduire le gaspillage, utiliser le menu engineering pour promouvoir les plats a forte marge, substituer certains ingredients.',
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

function MargeCard({ icon, title, color, desc, formula, target }: {
  icon: React.ReactNode; title: string; color: string; desc: string; formula: string; target: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-[#F5F5F5]`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-[#525252] leading-relaxed mb-4">{desc}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#737373] font-medium">Formule :</span>
          <code className="bg-white/70 px-2 py-0.5 rounded text-[#404040]">{formula}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#737373] font-medium">Objectif :</span>
          <span className={`${c.badge} px-2 py-0.5 rounded font-semibold`}>{target}</span>
        </div>
      </div>
    </div>
  );
}

function FormulaBlock({ label, formula, calcul, resultat, verdict, color }: {
  label: string; formula: string; calcul: string; resultat: string; verdict: string; color: string;
}) {
  const verdictColor = color === 'emerald' ? 'text-emerald-600' : 'text-amber-600';
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5">
      <h4 className="font-semibold text-[#111111] mb-2">{label}</h4>
      <div className="text-sm text-[#737373] mb-1">
        <span className="font-medium">Formule :</span> {formula}
      </div>
      <div className="text-sm text-[#737373] mb-2">
        <span className="font-medium">Calcul :</span> {calcul}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-extrabold text-[#111111]">{resultat}</span>
        <span className={`text-sm font-semibold ${verdictColor} flex items-center gap-1`}>
          <CheckCircle className="w-4 h-4" />
          {verdict}
        </span>
      </div>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[#111111] mb-1.5">{title}</h3>
        <p className="text-sm text-[#525252] leading-relaxed">{desc}</p>
      </div>
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
