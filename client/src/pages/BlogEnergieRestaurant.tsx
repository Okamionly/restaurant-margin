import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Zap, Lightbulb, Snowflake, Wind, Power, Flame, Droplets, FileText, Award, Users, Gift } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogEnergieRestaurant() {
  const faqSchema = buildFAQSchema([
    { question: "Combien d'economie cumulee en appliquant les 10 actions ?", answer: "Realiste : 25-40 % de reduction de la facture totale d'energie sur 12 mois. Pour un restaurant qui paye 25 000 EUR/an : 6 250 a 10 000 EUR/an d'economie." },
    { question: "Le passage a l'induction est-il rentable ?", answer: "Si votre materiel gaz a plus de 10 ans : oui, ROI 3-5 ans. Si recent : non, attendez la fin de vie." },
    { question: "Faut-il un audit energetique professionnel ?", answer: "Pour un restaurant avec plus de 20 000 EUR de facture energie/an : oui, payant (1 500-3 000 EUR) mais ROI tres rapide." },
    { question: "Le tarif Heures Creuses est-il interessant pour un restaurant ?", answer: "Rarement. Un restaurant consomme l'essentiel a midi et le soir = heures pleines. Sauf gros lave-vaisselle de nuit ou fabrication matinale." },
    { question: "Peut-on installer du solaire sur la toiture d'un restaurant ?", answer: "Oui si proprietaire et toiture > 50 m2. Investissement 8 000-25 000 EUR, autoconsommation possible avec revente du surplus. ROI 7-12 ans." }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Reduire facture energie restaurant", url: "https://www.restaumargin.fr/blog/reduire-facture-energie-restaurant" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Reduire sa facture d'energie en restauration : 10 actions concretes 2026" description="Audit energetique cuisine, equipements A+++, negociation contrats gaz/electricite : 10 actions concretes pour reduire votre facture energie de 20 a 40 %." path="/blog/reduire-facture-energie-restaurant" type="article" schema={[faqSchema, breadcrumbSchema]} />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg"><ChefHat className="w-7 h-7 text-teal-600" /><span>RestauMargin</span></Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero category="Economies" readTime="11 min" date="Mai 2026" title="Reduire sa facture d'energie : 10 actions concretes" accentWord="energie" subtitle="Avec la hausse des prix 2022-2025, l'energie represente 6-9 % du CA en restauration. 20 a 40 % d'economies sont accessibles sans investir de fortune." />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="11 min" variant="header" />

        <div className="prose-content my-10">
          <p>Decomposition typique d'un restaurant 80 couverts a Paris : cuisson 35 %, froid 25 %, hotte 15 %, eclairage 10 %, eau chaude 8 %, climatisation 5 %, divers 2 %. Avant d'agir, mesurez votre ratio kWh/couvert servi (cible : 8-12 kWh/couvert pour un resto traditionnel).</p>
        </div>

        <Section icon={<Lightbulb />} number="1" title="Remplacer l'eclairage par du LED">
          <p>Investissement 200-800 EUR, economie 60-80 % sur l'eclairage, ROI 6-12 mois. Halogenes 50W → LED 5W = 90 % d'economie. Privilegier LED dimmables, 2 700-3 000K en salle, 4 000K en cuisine. Marques Philips/Osram avec garantie 5 ans.</p>
        </Section>

        <Section icon={<Snowflake />} number="2" title="Optimiser la chambre froide">
          <ul>
            <li>Verifier les joints (test feuille de papier — 30 % de perte si abime)</li>
            <li>Degivrage manuel trimestriel (40 % de surconsommation si 5 mm de givre)</li>
            <li>Thermostat a +3 degC (pas 0) — chaque degre gagne = 5-7 % economie</li>
            <li>Ne pas surcharger : 10 cm autour des produits</li>
            <li>Rideaux a lanieres (15-20 % economie sur chambres ouvertes frequemment)</li>
          </ul>
        </Section>

        <Section icon={<Wind />} number="3" title="Regler la hotte d'extraction">
          <p>Une hotte tourne souvent a 100 % toute la journee. Variateur de vitesse 3 reglages, capteur d'air, couper 30 min apres fin du service, nettoyer filtres a graisses tous les 15 jours (un filtre encrasse = +25 % conso moteur). Economie : 8-15 % sur le poste extraction.</p>
        </Section>

        <Section icon={<Power />} number="4" title="Eteindre tout entre les services">
          <p>Sur restaurant ferme l'apres-midi : eteindre plaques, fours, salamandres, lave-vaisselle, eclairage salle, caisse, audio, climatisation. Multiprises avec interrupteur + checklist fermeture = 5-10 % de la facture.</p>
        </Section>

        <Section icon={<Flame />} number="5" title="Entretenir vos equipements de cuisson">
          <ul>
            <li>Detartrage friteuses (graisses encrassees = +20-30 % conso)</li>
            <li>Detartrage four a vapeur</li>
            <li>Brûleurs gaz : flamme bleue stable (jaune = combustion incomplete)</li>
            <li>Plaques induction : pied de plaque adapte au diametre des casseroles</li>
          </ul>
          <p>Entretien annuel pro 200-500 EUR = economie 5-10 %.</p>
        </Section>

        <Section icon={<Droplets />} number="6" title="Audit ballon d'eau chaude">
          <ul>
            <li>Regler le ballon a 60 degC (pas 80)</li>
            <li>Isoler les tuyaux (manchons mousse 50-100 EUR)</li>
            <li>Mitigeurs economiques sur lave-mains</li>
            <li>Recuperateur de chaleur sur plonge industrielle (1 500-3 000 EUR, ROI 18-36 mois, recupere jusqu'a 30 % de l'energie)</li>
          </ul>
        </Section>

        <Section icon={<FileText />} number="7" title="Renegocier les contrats gaz et electricite">
          <p>Recuperer 3 dernieres factures, contacter 3 fournisseurs alternatifs (Plüm, ekWateur, Mint, Ohm, Engie Pro). Economies typiques 2026 : 8-15 % sur l'electricite, 5-12 % sur le gaz. Privilegier prix fixe sur 1 an. Comparer le prix HT/kWh.</p>
        </Section>

        <Section icon={<Award />} number="8" title="Passer en eclairage et materiel A+++">
          <ul>
            <li>Lave-vaisselle pro A+++ : 30 % moins gourmand qu'un modele 10 ans</li>
            <li>Frigo classe A : −40 % vs classe E</li>
            <li>Friteuse electrique recente : −20 % vs ancien modele</li>
          </ul>
          <p>Investissement 3 000-15 000 EUR, ROI 3-7 ans + qualite service amelioree.</p>
        </Section>

        <Section icon={<Users />} number="9" title="Sensibiliser et former l'equipe">
          <p>L'humain represente 30-50 % du gaspillage energetique. Affiche ecogestes en cuisine, bonus collectif si objectif kWh/couvert atteint, referent energie tournant, briefing trimestriel. Economie 5-10 % sans investissement materiel.</p>
        </Section>

        <Section icon={<Gift />} number="10" title="Aides et CEE">
          <p>Les CEE financent une grande partie des travaux : isolation, hotte, chambre froide neuve (30-70 % pris en charge). Aide MaPrimeRenov pour batiment commercial. Passer par installateur RGE (Reconnu Garant de l'Environnement). Sites : <em>france-renov.gouv.fr</em>, <em>economie.gouv.fr/cee</em>.</p>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" readTime="11 min" variant="footer" />
        <CTABlock />
        <FAQSection items={[
          { q: "Combien d'economie cumulee en appliquant les 10 actions ?", a: "25-40 % de reduction sur 12 mois. Pour 25 000 EUR/an : 6 250-10 000 EUR economises." },
          { q: "Le passage a l'induction est-il rentable ?", a: "Oui si gaz > 10 ans (ROI 3-5 ans). Non si recent (attendre fin de vie)." },
          { q: "Faut-il un audit energetique professionnel ?", a: "Oui si > 20 000 EUR de facture/an (1 500-3 000 EUR, ROI tres rapide)." },
          { q: "Heures Creuses interessant pour un restaurant ?", a: "Rarement. Restaurant consomme midi/soir = heures pleines. Sauf gros lave-vaisselle de nuit." },
          { q: "Peut-on installer du solaire ?", a: "Oui si proprietaire et toit > 50 m2. 8 000-25 000 EUR, ROI 7-12 ans." }
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
        <h2 className="text-2xl font-bold text-mono-100">Action {number} — {title}</h2>
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
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 sm:p-12 text-white text-center">
        <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Suivez vos charges energie avec RestauMargin</h2>
        <p className="text-amber-50 max-w-xl mx-auto mb-8 leading-relaxed">Module suivi des charges : tracker vos consommations mois par mois et fixer des objectifs realistes.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-full hover:bg-amber-50 transition-colors">Essayer gratuitement<ArrowRight className="w-4 h-4" /></Link>
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
