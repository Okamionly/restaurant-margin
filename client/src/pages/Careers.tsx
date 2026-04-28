import { Link } from 'react-router-dom';
import {
  ChefHat, Mail, MapPin, Target, Zap, Users, Clock,
  ArrowRight, CheckCircle2, Code2, HeartHandshake, Globe,
  Laptop, Coffee, TrendingUp, MessageSquare, Star,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   /carrieres — Employer brand, JDs, hiring philosophy
   ═══════════════════════════════════════════════════════════════ */

const VALUES = [
  {
    icon: Target,
    title: 'Impacte mesurable',
    body: 'On construit des outils que des restaurateurs utilisent chaque jour pour sauver leur marge. Chaque ligne de code change quelque chose de concret dans leur vie.',
  },
  {
    icon: Zap,
    title: 'Async-first, autonomie maximale',
    body: "Pas de réunions inutiles. Tu travailles quand tu es productif. Les décisions sont écrites, les retours sont directs, le contexte est toujours disponible.",
  },
  {
    icon: HeartHandshake,
    title: 'Transparence totale',
    body: "Salaires, cap table, chiffres MRR — tout est partagé avec l'équipe. Si tu rejoins RestauMargin, tu mérites de savoir exactement où on en est.",
  },
  {
    icon: TrendingUp,
    title: 'Croissance over confort',
    body: 'On est en train de construire quelque chose d\'ambitieux avec peu de moyens. Ça demande de l\'adaptation, de la curiosité, et l\'envie d\'apprendre vite.',
  },
];

const BENEFITS = [
  { label: 'Remote 100%', detail: 'Travaille depuis où tu veux en France' },
  { label: '150 € cas pratique', detail: 'Chaque test technique est rémunéré' },
  { label: 'Budget équipement', detail: '500 € à l\'arrivée pour ton setup' },
  { label: 'Réponse sous 3 jours', detail: 'On respecte ton temps' },
  { label: 'BSPCE possible', detail: 'Pour les profils CDI dès 6 mois + PMF' },
  { label: 'Formations libres', detail: 'Conférences, livres, cours — défrayés' },
];

const OPEN_ROLES = [
  {
    id: 'cs-freelance',
    title: 'Customer Success · Onboarding',
    type: 'Freelance · 2j/semaine',
    location: 'Remote France',
    salary: '400–500 €/j',
    equity: 'Option 0,25 % BSPCE après 6 mois + PMF',
    when: 'Dès 10 clients payants (~300–500 € MRR)',
    mission:
      "Tu seras le premier humain que nos clients rencontrent après leur inscription. Ta mission : les amener à leur premier \"aha moment\" (leur première marge calculée, leur première fiche technique sauvegardée) avant qu'ils ne se perdent.",
    responsibilities: [
      'Onboarding en visio 45 min avec chaque nouveau client (guidage produit, questions métier)',
      'Rédaction de guides help-center en français clair, pas corporatif',
      'Détection proactive des clients à risque de churn (inactivité > 7 jours)',
      'Remontée hebdomadaire des frictions produit au fondateur',
      'Réponse aux tickets support dans les 24h ouvrées',
    ],
    requirements: [
      'Expérience en restauration OU en onboarding SaaS (ex-Koust, Zelty, Malou — un plus)',
      "Français natif, écrit impeccable, à l'aise en visio",
      'Empathie réelle pour les restaurateurs (pas juste un script)',
      'Autonomie : tu organises tes 2 jours/semaine toi-même',
    ],
    niceToHave: [
      'Connaissance food cost / marges resto',
      'Expérience rédaction aide en ligne',
      'Notion ou Loom pour créer des ressources rapidement',
    ],
    process: [
      'Screen 30 min (Youssef, fondateur)',
      'Cas pratique async rémunéré 150 € — onboarder un restaurateur fictif par écrit',
      'Entretien culture-fit + questions ouvertes 45 min',
    ],
  },
  {
    id: 'dev-senior',
    title: 'Développeur·se Senior Full-Stack',
    type: 'Freelance ou CDI · Temps plein',
    location: 'Remote France',
    salary: 'Freelance : 550–700 €/j · CDI : 55–70 k€ brut',
    equity: '0,5–2 % BSPCE · vesting 4 ans, cliff 1 an',
    when: 'À 3 k€ MRR ou quand le monolithe bloque les features',
    mission:
      'RestauMargin a un monolithe api/index.ts de 5 900 lignes qui tient debout mais limite la vélocité. Tu seras le premier dev externe : tu découperas ce monolithe, libéreras le fondateur du bug-fixing, et co-construiras le produit sur le long terme. Potentiel co-founder CTO avec equity.',
    responsibilities: [
      'Refactoring progressif api/index.ts en modules (auth, recipes, suppliers, billing…)',
      'Maintien de la vélocité feature pendant le refactor (zero downtime)',
      'Rédaction de 3 ADRs (Architecture Decision Records) pour les choix clés',
      'Pair-programming hebdomadaire 2h avec Youssef sur les features stratégiques',
      'Mise en place de tests sur les routes critiques (billing, auth, marges)',
    ],
    requirements: [
      'TypeScript strict — tu ne mets pas `any` sans te justifier',
      'React 18 + Vite, Node.js + Express, Prisma + PostgreSQL',
      'Tu as déjà découpé un monolithe ou migré une codebase legacy',
      'Tu communiques par écrit, tu poses des questions avant de coder',
      'Disponible en async (réponse dans la journée ouvrable)',
    ],
    niceToHave: [
      'Expérience SaaS B2B (billing Stripe, multi-tenant)',
      'Connaissance Supabase ou Vercel',
      'Intérêt pour le secteur HoReCa / restauration',
      'Envie de co-founder à terme (pas obligatoire)',
    ],
    process: [
      'Screen 30 min (contexte technique, ambitions)',
      'Cas pratique async rémunéré 150 € — refactorer un extrait de 200 lignes du monolithe',
      'Pair-programming 1h en live (vraie codebase)',
      'Culture-fit 30 min avec fondateur + advisor',
    ],
  },
];

function JobCard({ role }: { role: typeof OPEN_ROLES[0] }) {
  return (
    <div className="border border-mono-900 dark:border-mono-200 rounded-2xl p-8 bg-white dark:bg-mono-50/50 hover:border-teal-500 dark:hover:border-teal-600 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 mb-3">
            {role.type}
          </span>
          <h3 className="text-xl font-bold text-mono-100 dark:text-white">{role.title}</h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-mono-500 dark:text-mono-700">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{role.location}</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{role.salary}</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{role.equity}</span>
          </div>
        </div>
        <a
          href={`mailto:youssef@restaumargin.com?subject=Candidature ${role.title}&body=Bonjour Youssef,%0D%0A%0D%0AJe suis intéressé(e) par le poste ${role.title}.%0D%0A%0D%0AVoici un court résumé de mon parcours :`}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Postuler <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* When */}
      <div className="flex items-center gap-2 text-sm text-mono-500 dark:text-mono-700 mb-6 pb-6 border-b border-mono-900 dark:border-mono-200">
        <Clock className="w-4 h-4 shrink-0" />
        <span><strong className="text-mono-100 dark:text-white">Timing :</strong> {role.when}</span>
      </div>

      {/* Mission */}
      <p className="text-mono-500 dark:text-mono-700 leading-relaxed mb-6">{role.mission}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div>
          <h4 className="text-sm font-semibold text-mono-100 dark:text-white uppercase tracking-wide mb-3">Ce que tu feras</h4>
          <ul className="space-y-2">
            {role.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-mono-500 dark:text-mono-700">
                <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-sm font-semibold text-mono-100 dark:text-white uppercase tracking-wide mb-3">Ce qu'on cherche</h4>
          <ul className="space-y-2">
            {role.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-mono-500 dark:text-mono-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>

          {role.niceToHave.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-mono-100 dark:text-white uppercase tracking-wide mt-4 mb-3">Un plus</h4>
              <ul className="space-y-2">
                {role.niceToHave.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-mono-500 dark:text-mono-700">
                    <span className="w-4 h-4 flex items-center justify-center text-mono-500 mt-0.5 shrink-0">·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Process */}
      <div className="mt-6 pt-6 border-t border-mono-900 dark:border-mono-200">
        <h4 className="text-sm font-semibold text-mono-100 dark:text-white uppercase tracking-wide mb-3">Processus · {role.process.length} étapes</h4>
        <div className="flex flex-wrap gap-2">
          {role.process.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-mono-975 dark:bg-mono-200 text-mono-500 dark:text-mono-700">
              <span className="font-bold text-teal-600 dark:text-teal-400">{i + 1}.</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Careers() {
  return (
    <div className="min-h-screen bg-white dark:bg-black" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Rejoindre RestauMargin — Postes ouverts"
        description="RestauMargin recrute : Customer Success freelance et Dev Senior. Remote 100 %, cas pratique rémunéré, transparence totale sur les salaires et l'equity."
        path="/carrieres"
      />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mono-900 dark:border-mono-200 text-sm text-mono-500 dark:text-mono-700 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Recrutement actif · 2 postes ouverts
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-mono-100 dark:text-white leading-tight mb-6">
          Construire le back-office<br />
          de la restauration française
        </h1>

        <p className="text-lg text-mono-500 dark:text-mono-700 leading-relaxed max-w-2xl mx-auto mb-10">
          RestauMargin aide les restaurateurs à maîtriser leur food cost et leurs marges.
          On est en early-stage, le produit est en production, et on cherche les premières personnes
          qui veulent co-construire quelque chose de solide — pas juste exécuter.
        </p>

        <a
          href="#postes-ouverts"
          className="inline-flex items-center gap-2 px-8 py-4 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl font-semibold hover:opacity-80 transition-opacity"
        >
          Voir les postes <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* Founder story */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-mono-975 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
              <ChefHat className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="font-semibold text-mono-100 dark:text-white">Youssef, fondateur</p>
              <p className="text-sm text-mono-500 dark:text-mono-700">Montpellier · Solo-founder</p>
            </div>
          </div>
          <blockquote className="text-mono-500 dark:text-mono-700 leading-relaxed">
            "J'ai construit RestauMargin parce que j'ai vu des restaurateurs fermer non pas parce que leur cuisine était mauvaise,
            mais parce qu'ils ne savaient pas lire leurs marges. Le produit est en prod, on a des clients, et maintenant
            j'ai besoin de renfort humain — pas de l'exécution, de la co-construction. Si tu partages cette conviction,
            on devrait se parler."
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-mono-100 dark:text-white mb-8 text-center">Comment on travaille</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v, i) => (
            <div key={i} className="p-6 border border-mono-900 dark:border-mono-200 rounded-2xl bg-white dark:bg-mono-50/50">
              <v.icon className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-3" />
              <h3 className="font-semibold text-mono-100 dark:text-white mb-2">{v.title}</h3>
              <p className="text-sm text-mono-500 dark:text-mono-700 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-mono-100 dark:text-white mb-8 text-center">Ce qu'on offre (concret)</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex items-start gap-3 p-4 border border-mono-900 dark:border-mono-200 rounded-xl bg-white dark:bg-mono-50/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-mono-100 dark:text-white">{b.label}</p>
                <p className="text-xs text-mono-500 dark:text-mono-700 mt-0.5">{b.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-mono-500 dark:text-mono-700 mt-4">
          On est early-stage (seed). Les packages complets (mutuelle Alan, Swile, tickets-resto) arrivent au premier CDI.
          La transparence, c'est maintenant.
        </p>
      </section>

      {/* Open roles */}
      <section id="postes-ouverts" className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-mono-100 dark:text-white">Postes ouverts</h2>
          <span className="text-sm text-mono-500 dark:text-mono-700">Réponse sous 3 jours ouvrés</span>
        </div>
        <div className="space-y-6">
          {OPEN_ROLES.map((role) => (
            <JobCard key={role.id} role={role} />
          ))}
        </div>
      </section>

      {/* No open role? */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <div className="border border-dashed border-mono-900 dark:border-mono-200 rounded-2xl p-10">
          <Mail className="w-8 h-8 text-mono-500 dark:text-mono-700 mx-auto mb-4" />
          <h3 className="font-bold text-mono-100 dark:text-white mb-2">Pas le bon poste ?</h3>
          <p className="text-sm text-mono-500 dark:text-mono-700 mb-6 leading-relaxed">
            Si tu as une idée de comment tu pourrais contribuer à RestauMargin, envoie un email direct.
            On répond à tout le monde, même pour dire non.
          </p>
          <a
            href="mailto:youssef@restaumargin.com?subject=Candidature spontanée"
            className="inline-flex items-center gap-2 px-6 py-3 border border-mono-900 dark:border-mono-200 rounded-xl text-sm font-semibold text-mono-100 dark:text-white hover:bg-mono-975 dark:hover:bg-mono-200 transition-colors"
          >
            <Mail className="w-4 h-4" />
            youssef@restaumargin.com
          </a>
        </div>

        {/* EEO */}
        <p className="text-xs text-mono-500 dark:text-mono-700 mt-8 leading-relaxed">
          RestauMargin est un employeur qui pratique l'égalité des chances. Nous évaluons tous les candidats
          sur leurs compétences et motivations, indépendamment de l'origine, du genre, de l'âge, du handicap
          ou de l'orientation sexuelle. Les données de candidature sont conservées 2 ans maximum (RGPD).
        </p>
      </section>

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-mono-500 dark:text-mono-700 hover:text-mono-100 dark:hover:text-white transition-colors">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
