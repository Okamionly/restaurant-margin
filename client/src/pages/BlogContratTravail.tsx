import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, FileText, Users, Clock, GraduationCap, Calendar, Calculator } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

export default function BlogContratTravail() {
  const faqSchema = buildFAQSchema([
    { question: "Peut-on embaucher en CDD pour ouvrir un nouveau restaurant ?", answer: "Non. L'ouverture est une activite durable : les postes doivent etre en CDI. Sauf surcroit temporaire ponctuel dument motive." },
    { question: "Combien d'heures supplementaires peut-on faire en HCR ?", answer: "Contingent annuel : 360 heures supplementaires en HCR (vs 220h regime general). Au-dela = repos compensateur obligatoire." },
    { question: "Faut-il un contrat ecrit pour un extra d'un seul service ?", answer: "Oui, pour tout CDD (meme 4h), un contrat ecrit signe dans les 48h est obligatoire. A defaut, requalification possible en CDI." },
    { question: "Le pourboire entre-t-il dans le salaire ?", answer: "En HCR, les pourboires ne peuvent pas se substituer au salaire minimum conventionnel. Ils s'ajoutent. Si TPE pourboires, repartir et declarer." },
    { question: "Peut-on imposer 2 jours de repos non consecutifs ?", answer: "Non. La CCN HCR impose 1,5 jour minimum consecutif par semaine." }
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Contrat de travail restauration", url: "https://www.restaumargin.fr/blog/contrat-travail-restauration-guide" }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026" description="Tous les contrats de travail en restauration : CDI, CDD, extras, apprentissage, saisonnier. Cout employeur reel, mentions obligatoires, CCN HCR, risques." path="/blog/contrat-travail-restauration-guide" type="article" schema={[faqSchema, breadcrumbSchema]} />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg"><ChefHat className="w-7 h-7 text-teal-600" /><span>RestauMargin</span></Link>
          <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
        </div>
      </nav>

      <BlogArticleHero category="RH" readTime="13 min" date="Mai 2026" title="Contrat de travail en restauration : CDI, CDD, extras, apprentissage" accentWord="contrat" subtitle="Le secteur HCR est l'un des plus controles en France pour le droit du travail. Ce guide donne le mode d'emploi 2026 avec couts et risques." />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="header" />

        <div className="prose-content my-10">
          <p>URSSAF, inspection du travail, prud'hommes pleuvent des qu'un contrat est mal redige. Ce guide dresse l'etat des lieux 2026 des contrats utilisables, avec cout employeur, risques juridiques, et cas d'usage concrets.</p>
        </div>

        <Section icon={<FileText />} number="1" title="La convention collective HCR : socle obligatoire">
          <p>Tout contrat dans la restauration commerciale est regi par la <strong>CCN HCR (IDCC 1979)</strong>. Points cles :</p>
          <ul>
            <li>Grille de salaires : 5 niveaux × 3 echelons</li>
            <li>Indemnite nourriture : 4,15 EUR par repas du en 2026 (8,30 EUR/jour standard)</li>
            <li>Heures supplementaires : 10 % (36-39h), 20 % (40-43h), 50 % (au-dela)</li>
            <li>Travail de nuit (22h-7h) : majoration 30 %</li>
            <li>Repos hebdo : 2 jours/semaine dont 1,5 consecutif</li>
            <li>Preavis CDI : 1 mois employe, 2 mois cadre</li>
          </ul>
        </Section>

        <Section icon={<Users />} number="2" title="Le CDI : reference pour les postes perennes">
          <p>Le CDI est la <strong>forme normale</strong> du contrat de travail. Mentions obligatoires : identite, date embauche, lieu, CCN HCR, poste/qualification, salaire brut, duree travail (39h standard HCR), periode d'essai, modalites rupture.</p>
          <p>Periode d'essai : employes 2 mois renouvelable (4 mois max), agents de maitrise 6 mois, cadres 8 mois.</p>
        </Section>

        <Section icon={<Clock />} number="3" title="Le CDD : a utiliser avec precaution">
          <p>Le CDD ne peut etre utilise qu'en cas precis (remplacement, accroissement temporaire, saisonnier, travaux temporaires). Risque majeur : un CDD requalifie en CDI coute ~4-6 mois de salaire.</p>
          <p>Indemnite de precarite : <strong>10 % du salaire brut</strong> total. Sauf : CDD saisonnier, contrat d'usage, refus CDI propose.</p>
        </Section>

        <Section icon={<Calendar />} number="4" title="Le contrat d'extra (CDD d'usage)">
          <p>Specifique HCR : embauche par jour ou par service, sans prime de precarite, pour emplois temporaires d'usage constant (banquets, evenements, surcroit dimanche).</p>
          <p>Conditions : mission courte (1 jour a 2 mois max), pas d'usage continu sur le meme poste, liste limitative HCR. Tarif libre ≥ SMIC HCR (pratique courante : 11-14 EUR/h brut + repas + ICP 10 %).</p>
          <p><strong>Risque</strong> : URSSAF requalifie en CDI si meme extra plus de 30 jours/an sans justification d'usage.</p>
        </Section>

        <Section icon={<GraduationCap />} number="5" title="L'apprentissage : levier sous-utilise">
          <p>Le contrat d'apprentissage est <strong>financierement tres avantageux</strong> en restauration.</p>
          <ul>
            <li>Aide unique : 6 000 EUR (apprenti &lt; 30 ans) sur la 1ere annee</li>
            <li>Exonerations URSSAF largement reduites pour TPE-PME</li>
            <li>OPCO Mobilites prend en charge la formation CFA</li>
          </ul>
          <p><strong>Cout reel d'un apprenti CAP 18 ans en cuisine</strong> : ~30 EUR/mois la 1ere annee. C'est l'embauche la plus rentable de la restauration française.</p>
        </Section>

        <Section icon={<Calendar />} number="6" title="Le contrat saisonnier">
          <p>Pour un restaurant ouvert seulement en saison (plages, montagne, festivals). Pas de prime de precarite. Clause de reconduction : 3 saisons consecutives = droit prioritaire de reconduction (loi Travail 2017).</p>
        </Section>

        <Section icon={<Calculator />} number="7" title="Cout employeur : combien coute vraiment un salarie ?">
          <p>Salarie HCR niveau 2 echelon 1, 39h, 1 850 EUR brut/mois :</p>
          <ul>
            <li>Salaire brut : 1 850 EUR</li>
            <li>Cotisations patronales (~42 %) : 777 EUR</li>
            <li>Indemnite nourriture : 220 EUR</li>
            <li>Mutuelle obligatoire (50 %) + medecine du travail : 37 EUR</li>
            <li><strong>Cout total mensuel : ~2 884 EUR</strong></li>
            <li><strong>Cout annuel : ~34 600 EUR</strong> (12,5 mois pour CP)</li>
          </ul>
          <p>Le ratio cout total / brut = ~1,55 en HCR (vs 1,42 dans le tertiaire moyen).</p>
        </Section>

        <BlogAuthor publishedDate="2026-05-05" readTime="13 min" variant="footer" />
        <CTABlock />
        <FAQSection items={[
          { q: "Peut-on embaucher en CDD pour ouvrir un nouveau restaurant ?", a: "Non. L'ouverture est une activite durable : CDI obligatoire. Sauf surcroit temporaire ponctuel motive." },
          { q: "Combien d'heures supplementaires peut-on faire en HCR ?", a: "Contingent annuel 360h (vs 220h regime general). Au-dela = repos compensateur obligatoire." },
          { q: "Faut-il un contrat ecrit pour un extra d'un seul service ?", a: "Oui. Tout CDD (meme 4h) requiert un contrat ecrit signe sous 48h. A defaut : requalification en CDI." },
          { q: "Le pourboire entre-t-il dans le salaire ?", a: "Non en HCR. Les pourboires s'ajoutent au salaire minimum conventionnel. Si TPE pourboires, repartir et declarer." },
          { q: "Peut-on imposer 2 jours de repos non consecutifs ?", a: "Non. La CCN HCR impose 1,5 jour consecutif minimum par semaine." }
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
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Maitrisez vos couts RH avec RestauMargin</h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">Module RH : cout employeur reel par poste, plannings, alertes heures supplementaires.</p>
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
