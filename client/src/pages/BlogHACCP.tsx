import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Lightbulb, AlertTriangle, Users, Thermometer, ShieldCheck, ClipboardList, CheckCircle, Download, FileText, ListChecks } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Guide HACCP pour les restaurants : tout ce qu'il faut savoir"
   Mot-cle principal : HACCP restaurant
   ~1 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

export default function BlogHACCP() {
  useEffect(() => {
    document.title = 'Guide HACCP pour les restaurants : tout ce qu\'il faut savoir en 2026 | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Guide HACCP restaurant complet : les 7 principes, tableau des temperatures, checklist telechargeable et FAQ. Mettez votre etablissement en conformite.'
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
      <header className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Securite alimentaire 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
            Guide HACCP pour les restaurants :<br className="hidden sm:block" />
            tout ce qu'il faut savoir
          </h1>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed">
            Le HACCP (Hazard Analysis Critical Control Points) est obligatoire pour tous les
            restaurants en France. Decouvrez les 7 principes, les temperatures a respecter et
            une checklist pratique pour votre etablissement.
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

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-[#404040]">
            {[
              { href: '#definition', label: 'Qu\'est-ce que le HACCP et pourquoi c\'est obligatoire ?' },
              { href: '#temperatures', label: 'Tableau des temperatures de reference en restauration' },
              { href: '#principes', label: 'Les 7 principes HACCP expliques simplement' },
              { href: '#checklist', label: 'Checklist HACCP quotidienne pour votre restaurant' },
              { href: '#sanctions', label: 'Sanctions et controles : ce que vous risquez' },
              { href: '#digitaliser', label: 'Digitaliser votre HACCP avec RestauMargin' },
              { href: '#faq', label: 'Questions frequentes' },
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

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<ShieldCheck className="w-6 h-6" />} number="1">
            Qu'est-ce que le HACCP et pourquoi c'est obligatoire ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le HACCP (Hazard Analysis Critical Control Points, ou Analyse des Dangers et Points
              Critiques pour leur Maitrise) est une methode systematique de prevention des risques
              sanitaires dans la chaine alimentaire. Developpe par la NASA dans les annees 1960 pour
              garantir la securite alimentaire des astronautes, il est devenu le standard mondial
              en matiere d'hygiene alimentaire.
            </p>
            <p>
              En France, le HACCP est obligatoire pour tous les etablissements de restauration
              depuis le "Paquet Hygiene" europeen de 2006 (reglements CE 852/2004 et 853/2004).
              Cela concerne les restaurants traditionnels, les fast-foods, les traiteurs, les
              boulangeries, les cantines et meme les food trucks. Aucun etablissement servant de
              la nourriture n'est exempte.
            </p>
            <p>
              Contrairement a une idee recue, le HACCP n'est pas un simple document a remplir et
              ranger dans un classeur. C'est un systeme vivant de surveillance continue qui doit etre
              applique au quotidien par toute l'equipe. Il couvre l'ensemble de la chaine : reception
              des marchandises, stockage, preparation, cuisson, refroidissement, maintien en
              temperature et service.
            </p>

            <Callout type="info">
              <strong>Important :</strong> Depuis 2012, au moins une personne dans chaque etablissement
              de restauration doit avoir suivi une formation en hygiene alimentaire de 14 heures
              (formation HACCP). Cette obligation est verifiee lors des controles de la DDPP
              (Direction Departementale de la Protection des Populations).
            </Callout>

            <p>
              Le HACCP repose sur un principe fondamental : mieux vaut prevenir que guerir. Plutot
              que de verifier la qualite du produit fini (ce qui est trop tard si un probleme est
              survenu), on identifie les dangers potentiels a chaque etape de la production et on
              met en place des mesures de controle pour les eliminer ou les reduire a un niveau
              acceptable.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Temperatures ═════════════ */}
        <section id="temperatures" className="mb-16">
          <SectionHeading icon={<Thermometer className="w-6 h-6" />} number="2">
            Tableau des temperatures de reference en restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              La maitrise des temperatures est le pilier du HACCP en restauration. Les bacteries
              pathogenes (Salmonella, Listeria, E. coli, Staphylococcus aureus) se multiplient
              rapidement entre 4 degC et 63 degC — c'est la fameuse "zone de danger". Votre objectif :
              minimiser le temps passe dans cette zone.
            </p>
          </div>

          {/* Tableau des temperatures */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-4 py-3 font-bold text-[#111111] border-b border-[#E5E7EB]">Equipement / Etape</th>
                  <th className="text-left px-4 py-3 font-bold text-[#111111] border-b border-[#E5E7EB]">Temperature reglementaire</th>
                  <th className="text-left px-4 py-3 font-bold text-[#111111] border-b border-[#E5E7EB]">Tolerance</th>
                  <th className="text-left px-4 py-3 font-bold text-[#111111] border-b border-[#E5E7EB]">Frequence de controle</th>
                </tr>
              </thead>
              <tbody>
                <TempRow equip="Refrigerateur" temp="0 degC a +3 degC" tolerance="+/- 1 degC" freq="2x par jour" color="bg-blue-50" />
                <TempRow equip="Congelateur" temp="-18 degC ou moins" tolerance="+/- 2 degC" freq="1x par jour" color="bg-white" />
                <TempRow equip="Chambre froide positive" temp="+2 degC a +4 degC" tolerance="+/- 1 degC" freq="2x par jour" color="bg-blue-50" />
                <TempRow equip="Cuisson viandes" temp="+63 degC a coeur minimum" tolerance="Aucune" freq="A chaque cuisson" color="bg-white" />
                <TempRow equip="Cuisson volaille" temp="+74 degC a coeur minimum" tolerance="Aucune" freq="A chaque cuisson" color="bg-blue-50" />
                <TempRow equip="Maintien au chaud" temp="+63 degC minimum" tolerance="+/- 2 degC" freq="Toutes les 30 min" color="bg-white" />
                <TempRow equip="Refroidissement rapide" temp="De +63 degC a +10 degC en 2h" tolerance="2h maximum" freq="A chaque refroidissement" color="bg-blue-50" />
                <TempRow equip="Remise en temperature" temp="De +10 degC a +63 degC en 1h" tolerance="1h maximum" freq="A chaque rechauffage" color="bg-white" />
                <TempRow equip="Livraison produits frais" temp="0 degC a +4 degC" tolerance="+/- 2 degC" freq="A chaque reception" color="bg-blue-50" />
                <TempRow equip="Livraison surgeles" temp="-18 degC ou moins" tolerance="+/- 3 degC" freq="A chaque reception" color="bg-white" />
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <Callout type="warning">
              <strong>Zone de danger :</strong> Entre +4 degC et +63 degC, les bacteries doublent leur
              population toutes les 20 minutes. Un aliment laisse 4 heures dans cette zone peut
              contenir des millions de bacteries pathogenes. C'est pourquoi le refroidissement rapide
              (de +63 degC a +10 degC en moins de 2 heures) est une etape critique du HACCP.
            </Callout>

            <p>
              Equipez-vous d'un thermometre a sonde digital (entre 20 et 50 EUR) et d'un thermometre
              enregistreur pour chaque chambre froide. Notez les releves dans un cahier dedie ou,
              mieux encore, utilisez une solution digitale qui enregistre automatiquement les
              temperatures et vous alerte en cas de depassement.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : 7 principes ═════════════ */}
        <section id="principes" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Les 7 principes HACCP expliques simplement
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le HACCP repose sur 7 principes fondamentaux definis par le Codex Alimentarius de
              l'OMS et la FAO. Voici chaque principe explique avec des exemples concrets adaptes
              a un restaurant.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <PrincipeCard
              number={1}
              title="Analyser les dangers"
              desc="Identifiez tous les dangers biologiques (bacteries, virus, parasites), chimiques (produits de nettoyage, allergenes) et physiques (morceaux de verre, corps etrangers) a chaque etape de votre production. Par exemple : a la reception, le danger est un produit livre a temperature trop elevee. En preparation, c'est la contamination croisee entre viande crue et legumes."
              example="Listez chaque etape de fabrication d'un plat et identifiez les dangers potentiels a chaque etape."
            />
            <PrincipeCard
              number={2}
              title="Determiner les points critiques de controle (CCP)"
              desc="Un CCP est une etape ou un controle est essentiel pour prevenir un danger. Ce n'est pas chaque etape de la production, mais uniquement celles ou un controle est indispensable. Par exemple, la temperature de cuisson d'une viande est un CCP : si elle n'est pas atteinte, le danger bacterien n'est pas elimine."
              example="CCP typiques : reception (temperature), cuisson (temperature a coeur), refroidissement (duree/temperature)."
            />
            <PrincipeCard
              number={3}
              title="Fixer les limites critiques"
              desc="Pour chaque CCP, definissez une valeur limite mesurable qui separe l'acceptable de l'inacceptable. Ces limites doivent etre basees sur la reglementation ou la science. Par exemple : la temperature a coeur d'un poulet roti doit atteindre 74 degC minimum."
              example="Frigo : max +3 degC. Cuisson poulet : min +74 degC. Refroidissement : de +63 degC a +10 degC en 2h max."
            />
            <PrincipeCard
              number={4}
              title="Mettre en place un systeme de surveillance"
              desc="Definissez comment, quand et par qui chaque CCP est surveille. La surveillance peut etre continue (sonde de temperature dans une chambre froide) ou ponctuelle (prise de temperature a la sonde a chaque cuisson). L'important est que ce soit systematique et documente."
              example="Relevez la temperature des frigos a l'ouverture et a la fermeture. Mesurez la temperature a coeur de chaque viande."
            />
            <PrincipeCard
              number={5}
              title="Definir les actions correctives"
              desc="Que faire quand une limite critique est depassee ? Definissez a l'avance les actions a mener. Par exemple : si le frigo depasse +5 degC, verifiez si la porte est bien fermee, controlez le thermostat, et si les produits ont ete au-dessus de +4 degC pendant plus de 2 heures, jetez-les."
              example="Frigo en panne : transferer immediatement les produits vers un autre frigo et jeter les produits compromis."
            />
            <PrincipeCard
              number={6}
              title="Verifier l'efficacite du systeme"
              desc="Verifiez regulierement que votre plan HACCP fonctionne. Cela passe par des audits internes, la calibration des thermometres, la revue des registres de surveillance et eventuellement des analyses microbiologiques de vos preparations."
              example="Audit interne mensuel, calibration des thermometres tous les 6 mois, verification des registres chaque semaine."
            />
            <PrincipeCard
              number={7}
              title="Constituer des dossiers et registres"
              desc="Tout doit etre documente et conserve. Les registres prouvent votre bonne foi et votre rigueur en cas de controle. Conservez les registres de temperature, les bons de livraison, les fiches de nettoyage, les fiches de formation et tout document relatif a la securite alimentaire pendant 5 ans minimum."
              example="Classeur ou logiciel avec : releves temperatures, fiches de reception, plans de nettoyage, attestations de formation."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Checklist ═════════════ */}
        <section id="checklist" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="4">
            Checklist HACCP quotidienne pour votre restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une checklist pratique a suivre chaque jour pour assurer la conformite HACCP
              de votre restaurant. Imprimez-la et affichez-la en cuisine.
            </p>
          </div>

          <div className="mt-6 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-[#111111] mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Checklist quotidienne
            </h3>

            <div className="space-y-6">
              <ChecklistSection
                title="Ouverture (avant le service)"
                items={[
                  'Relever et noter les temperatures de toutes les chambres froides et congelateurs',
                  'Verifier les DLC des produits en stock (retirer les produits perimes)',
                  'Controler la proprete des plans de travail, des equipements et des ustensiles',
                  'Verifier le stock de produits de nettoyage et de desinfection',
                  'S\'assurer que le personnel porte des vetements de travail propres',
                  'Verifier le bon fonctionnement des thermometres a sonde',
                ]}
              />
              <ChecklistSection
                title="Reception des marchandises"
                items={[
                  'Verifier la temperature des produits a la livraison (frais, surgeles)',
                  'Controler l\'integrite des emballages (pas de dechirage, pas de gonflement)',
                  'Verifier les DLC et DLUO sur les etiquettes',
                  'Refuser tout produit non conforme et le noter sur le bon de livraison',
                  'Ranger immediatement les produits en chambre froide (dans les 15 min)',
                  'Appliquer le FIFO (placer les nouveaux produits derriere les anciens)',
                ]}
              />
              <ChecklistSection
                title="Pendant le service"
                items={[
                  'Prendre la temperature a coeur des viandes et volailles cuites',
                  'Verifier la temperature du maintien au chaud (min +63 degC)',
                  'Separer les produits crus et cuits (plans de travail, ustensiles)',
                  'Se laver les mains regulierement (toutes les 30 min et a chaque changement de tache)',
                  'Utiliser des planches de decoupe de couleurs differentes (viande rouge, volaille, poisson, legumes)',
                ]}
              />
              <ChecklistSection
                title="Fermeture (apres le service)"
                items={[
                  'Relever et noter les temperatures des chambres froides',
                  'Refroidir rapidement les preparations chaudes (cellule de refroidissement)',
                  'Nettoyer et desinfecter tous les plans de travail et equipements',
                  'Vider les poubelles et nettoyer les conteneurs',
                  'Verifier que les portes des chambres froides sont bien fermees',
                  'Remplir le registre de nettoyage',
                ]}
              />
            </div>

            {/* Placeholder telechargement */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#111111] mb-0.5">Telecharger la checklist HACCP (PDF)</h4>
                <p className="text-sm text-[#525252]">
                  Version imprimable avec cases a cocher, prete a afficher en cuisine.
                </p>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                onClick={() => alert('La checklist PDF sera bientot disponible au telechargement. Inscrivez-vous a RestauMargin pour recevoir la version numerique.')}
              >
                Telecharger
              </button>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Sanctions ═════════════ */}
        <section id="sanctions" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="5">
            Sanctions et controles : ce que vous risquez
          </SectionHeading>

          <div className="prose-content">
            <p>
              Les controles sanitaires sont effectues par la DDPP (Direction Departementale de la
              Protection des Populations), anciennement DSV (Direction des Services Veterinaires).
              Ils peuvent etre programmes ou inoipines, et interviennent en moyenne tous les 2 a
              3 ans pour un restaurant classique. En cas de plainte d'un client ou d'intoxication
              alimentaire, le controle est immediat.
            </p>
            <p>
              Lors d'un controle, l'inspecteur verifie : l'existence d'un plan de maitrise sanitaire
              (PMS) incluant le plan HACCP, les registres de temperature, les procedures de nettoyage
              et de desinfection, la formation du personnel, la tracabilite des produits, la
              conformite des locaux et equipements.
            </p>

            <Callout type="warning">
              <strong>Sanctions possibles :</strong> Un avertissement pour les manquements mineurs.
              Une mise en demeure avec delai de mise en conformite pour les infractions moyennes.
              Une fermeture administrative temporaire ou definitive pour les infractions graves.
              Des sanctions penales pouvant aller jusqu'a 2 ans d'emprisonnement et 150 000 EUR
              d'amende en cas de mise en danger de la sante publique.
            </Callout>

            <p>
              Depuis 2017, les resultats des controles sanitaires sont publies sur le site
              Alim'confiance du Ministere de l'Agriculture. Les resultats vont de "Tres satisfaisant"
              a "A corriger de maniere urgente", et sont accessibles par tous les consommateurs.
              Un mauvais resultat peut avoir un impact considerable sur votre reputation en ligne.
            </p>
            <p>
              La meilleure strategie ? Ne pas attendre le controle. Mettez en place des audits
              internes mensuels en utilisant la meme grille que les inspecteurs de la DDPP.
              Corrigez les ecarts avant qu'ils ne soient detectes. Un restaurant bien prepare
              n'a rien a craindre d'un controle.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Digitaliser ═════════════ */}
        <section id="digitaliser" className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              Digitalisez votre HACCP avec RestauMargin
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Fini les classeurs papier et les oublis. RestauMargin digitalise votre plan HACCP :
              releves de temperatures automatiques, alertes en temps reel, checklists interactives,
              registres numeriques conformes et tracabilite complete.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 mb-8 text-left max-w-2xl mx-auto">
              <DigitalFeature icon={<Thermometer className="w-5 h-5" />} text="Releves automatiques des temperatures" />
              <DigitalFeature icon={<AlertTriangle className="w-5 h-5" />} text="Alertes instantanees en cas de depassement" />
              <DigitalFeature icon={<FileText className="w-5 h-5" />} text="Registres numeriques conformes DDPP" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors"
              >
                Essayer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Decouvrir nos outils
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Articles lies ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Articles complementaires</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/blog/gaspillage" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le gaspillage alimentaire</h3>
              <p className="text-sm text-[#737373]">5 astuces concretes et un calculateur de pertes pour votre restaurant.</p>
            </Link>
            <Link to="/blog/fiches-techniques" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Fiche technique de cuisine : le guide</h3>
              <p className="text-sm text-[#737373]">Creez des fiches techniques precises pour maitriser food cost et qualite.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Calculer la marge de votre restaurant</h3>
              <p className="text-sm text-[#737373]">Formules, benchmarks par type de restaurant et erreurs courantes.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            <FAQItem
              q="Le HACCP est-il obligatoire pour tous les restaurants ?"
              a="Oui, depuis les reglements europeens CE 852/2004 et 853/2004 (le 'Paquet Hygiene'), tous les etablissements de restauration en France sont tenus de mettre en place des procedures basees sur les principes HACCP. Cela inclut les restaurants, fast-foods, traiteurs, boulangeries, cantines et food trucks."
            />
            <FAQItem
              q="Qui doit suivre la formation HACCP ?"
              a="Au minimum une personne par etablissement doit avoir suivi la formation en hygiene alimentaire de 14 heures. Cette formation est dispensee par des organismes agrees et coute entre 200 et 400 EUR. Elle est valable a vie, mais une mise a jour tous les 5 ans est recommandee."
            />
            <FAQItem
              q="A quelle frequence relever les temperatures ?"
              a="Les chambres froides et congelateurs doivent etre controles au minimum 2 fois par jour (ouverture et fermeture). La temperature a coeur des viandes doit etre verifiee a chaque cuisson. Le maintien au chaud doit etre surveille toutes les 30 minutes. Idealement, utilisez des enregistreurs automatiques."
            />
            <FAQItem
              q="Combien de temps conserver les registres HACCP ?"
              a="Les registres de temperature, fiches de reception, plans de nettoyage et autres documents HACCP doivent etre conserves pendant 5 ans minimum. C'est une obligation reglementaire verifiee lors des controles de la DDPP. Le format numerique est accepte a condition qu'il soit securise et non modifiable."
            />
            <FAQItem
              q="Que faire si un frigo tombe en panne ?"
              a="Transferez immediatement les produits dans un autre refrigerateur. Si les produits ont depasse +4 degC pendant plus de 2 heures, ils doivent etre jetes (sauf les produits stables comme les boissons). Notez l'incident dans votre registre, prenez la temperature des produits et documentez les actions correctives."
            />
            <FAQItem
              q="Peut-on digitaliser les registres HACCP ?"
              a="Oui, les registres numeriques sont parfaitement acceptes par la DDPP, a condition qu'ils soient fiables, securises et non modifiables a posteriori. Les solutions digitales comme RestauMargin offrent en plus l'avantage des alertes automatiques, des rappels de controle et de la generation automatique de rapports en cas de controle."
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
            headline: 'Guide HACCP pour les restaurants : tout ce qu\'il faut savoir en 2026',
            description: 'Guide HACCP restaurant complet : les 7 principes, tableau des temperatures, checklist telechargeable et FAQ.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-10',
            dateModified: '2026-04-10',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/haccp' },
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
                name: 'Le HACCP est-il obligatoire pour tous les restaurants ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Oui, depuis les reglements europeens CE 852/2004 et 853/2004, tous les etablissements de restauration en France sont tenus de mettre en place des procedures HACCP.',
                },
              },
              {
                '@type': 'Question',
                name: 'Qui doit suivre la formation HACCP ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Au minimum une personne par etablissement doit avoir suivi la formation en hygiene alimentaire de 14 heures. Elle coute entre 200 et 400 EUR.',
                },
              },
              {
                '@type': 'Question',
                name: 'A quelle frequence relever les temperatures ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Les chambres froides au minimum 2 fois par jour. La temperature a coeur des viandes a chaque cuisson. Le maintien au chaud toutes les 30 minutes.',
                },
              },
              {
                '@type': 'Question',
                name: 'Combien de temps conserver les registres HACCP ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Les registres HACCP doivent etre conserves pendant 5 ans minimum. Le format numerique est accepte a condition qu\'il soit securise et non modifiable.',
                },
              },
              {
                '@type': 'Question',
                name: 'Que faire si un frigo tombe en panne ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Transferez immediatement les produits. Si les produits ont depasse +4 degC pendant plus de 2 heures, ils doivent etre jetes. Documentez l\'incident.',
                },
              },
              {
                '@type': 'Question',
                name: 'Peut-on digitaliser les registres HACCP ?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Oui, les registres numeriques sont acceptes par la DDPP, a condition qu\'ils soient fiables, securises et non modifiables a posteriori.',
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

function TempRow({ equip, temp, tolerance, freq, color }: { equip: string; temp: string; tolerance: string; freq: string; color: string }) {
  return (
    <tr className={color}>
      <td className="px-4 py-3 border-b border-[#E5E7EB] font-medium text-[#111111]">{equip}</td>
      <td className="px-4 py-3 border-b border-[#E5E7EB] text-[#525252]">{temp}</td>
      <td className="px-4 py-3 border-b border-[#E5E7EB] text-[#525252]">{tolerance}</td>
      <td className="px-4 py-3 border-b border-[#E5E7EB] text-[#525252]">{freq}</td>
    </tr>
  );
}

function PrincipeCard({ number, title, desc, example }: { number: number; title: string; desc: string; example: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
          {number}
        </div>
        <div>
          <h3 className="font-bold text-[#111111] mb-2">{title}</h3>
          <p className="text-sm text-[#525252] leading-relaxed mb-3">{desc}</p>
          <div className="bg-blue-50 rounded-lg px-4 py-2.5 text-xs text-blue-800 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{example}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-[#111111] mb-3 flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-blue-600" />
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#404040]">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DigitalFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/90">
      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span>{text}</span>
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
