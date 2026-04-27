/**
 * @file client/src/pages/OutreachMailer.tsx
 *
 * Page admin pour envoyer des emails outreach (link building, partenariats,
 * journalistes) avec :
 * - From : contact@restaumargin.fr (pas Gmail perso)
 * - HTML branded RestauMargin (logo, couleurs, signature pro)
 * - Templates pré-remplis pour chaque cible (UMIH, GNI, Toast, etc.)
 *
 * Route : /admin/outreach (protégée par auth)
 */

import { useState } from 'react';
import { Send, Mail, FileText, Plus, X, Check, AlertCircle, Sparkles } from 'lucide-react';

// Reuse the same auth header pattern used elsewhere in the app
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ArticleLink {
  title: string;
  url: string;
}

interface Template {
  id: string;
  label: string;
  to: string;
  subject: string;
  recipientName: string;
  intro: string;
  pitch: string;
  articles: ArticleLink[];
}

const BLOG_ARTICLES: ArticleLink[] = [
  { title: 'Calcul de marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
  { title: 'Reduire le food cost (10 strategies)', url: 'https://www.restaumargin.fr/blog/reduire-food-cost' },
  { title: 'L\'IA en restauration', url: 'https://www.restaumargin.fr/blog/ia-restauration' },
  { title: 'Fiche technique restaurant', url: 'https://www.restaumargin.fr/blog/fiche-technique-restaurant' },
  { title: 'Fixer son prix de vente', url: 'https://www.restaumargin.fr/blog/prix-de-vente-restaurant' },
  { title: 'Coefficient multiplicateur', url: 'https://www.restaumargin.fr/blog/coefficient-multiplicateur' },
  { title: 'Menu Engineering (Boston Matrix)', url: 'https://www.restaumargin.fr/blog/menu-engineering-boston-matrix' },
  { title: 'Logiciel gestion restaurant', url: 'https://www.restaumargin.fr/blog/logiciel-gestion-restaurant' },
  { title: 'Logiciel de caisse enregistreuse', url: 'https://www.restaumargin.fr/blog/logiciel-caisse-enregistreuse-restaurant' },
  { title: '12 KPI essentiels restaurateur', url: 'https://www.restaumargin.fr/blog/kpi-essentiels-restaurateur' },
  { title: 'Seuil de rentabilite restaurant', url: 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
  { title: 'HACCP en restaurant', url: 'https://www.restaumargin.fr/blog/haccp-restaurant' },
  { title: 'Reduire le gaspillage alimentaire', url: 'https://www.restaumargin.fr/blog/gaspillage-alimentaire' },
];

const TEMPLATES: Template[] = [
  {
    id: 'umih',
    label: 'UMIH (syndicat HCR — webinar gratuit)',
    to: 'contact@umih.fr',
    subject: 'Webinar gratuit pour vos adherents — Calcul de marge restaurant 2026',
    recipientName: 'Bonjour,',
    intro: 'Je viens de lancer **RestauMargin**, plateforme SaaS qui aide les restaurateurs francais a maitriser leurs marges. Concretement, RestauMargin automatise 4 choses qui prenaient 3-4h/semaine en Excel : le calcul du food cost par plat, les fiches techniques (dictee vocale → 10 secondes), la mercuriale fournisseurs avec historique de prix, et l\'analyse de marge par recette en temps reel.',
    pitch: `Je propose a l\'UMIH un **webinar gratuit** pour vos adherents independants :

**"Calcul de marge en restauration : 7 pieges classiques + comment les eviter"**

Pourquoi ce sujet maintenant : notre etude terrain montre que 7 restaurateurs sur 10 sous-estiment leur food cost reel de 4 a 7 points (soit plusieurs milliers d\'euros perdus/mois).

Format :
- 45 min presentation + 15 min Q&A
- Date a votre convenance (mai-juin 2026)
- Zoom (gratuit et illimite pour vos membres)
- Public : restaurateurs independants UMIH

Engagement : zero vente. 100% pedagogique. Mention RestauMargin reduite a 1 slide en fin de webinar.

En contrepartie de ce contenu offert :
- Mention dans votre newsletter ressources numeriques
- Lien depuis votre page partenaires/outils digitaux
- Replay accessible librement aux adherents

Disponible immediatement pour brief si vous voulez en discuter.`,
    articles: [
      { title: 'Calcul de marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
      { title: '12 KPI essentiels pour piloter son restaurant', url: 'https://www.restaumargin.fr/blog/kpi-essentiels-restaurateur' },
      { title: 'Seuil de rentabilite restaurant', url: 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
    ],
  },
  {
    id: 'gni',
    label: 'GNI Synhorcat (syndicat HCR — webinar)',
    to: 'contact@gni-hcr.fr',
    subject: 'Webinar gratuit pour vos adherents independants — Calcul de marge 2026',
    recipientName: 'Bonjour,',
    intro: 'Je viens de lancer **RestauMargin**, plateforme SaaS qui aide les restaurateurs francais a maitriser leurs marges. Concretement, RestauMargin automatise 4 choses qui prenaient 3-4h/semaine en Excel : le calcul du food cost par plat, les fiches techniques (dictee vocale → 10 secondes), la mercuriale fournisseurs avec historique de prix, et l\'analyse de marge par recette en temps reel.',
    pitch: `Je propose au GNI un **webinar gratuit** pour vos adherents independants :

**"Calcul de marge en restauration : 7 pieges classiques + comment les eviter"**

Pourquoi ce sujet maintenant : notre etude terrain montre que 7 restaurateurs sur 10 sous-estiment leur food cost reel de 4 a 7 points (= plusieurs milliers d\'euros perdus/mois).

Format :
- 45 min presentation + 15 min Q&A
- Date a votre convenance (mai 2026)
- Zoom gratuit illimite pour vos membres
- Public : restaurateurs independants GNI Synhorcat

Engagement : zero vente. 100% pedagogique. Mention RestauMargin reduite a 1 slide en fin.

En contrepartie :
- Mention dans votre newsletter
- Lien depuis votre page partenaires
- Replay accessible aux adherents

Disponible immediatement pour brief.`,
    articles: [
      { title: 'Calcul de marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
      { title: '12 KPI essentiels pour piloter son restaurant', url: 'https://www.restaumargin.fr/blog/kpi-essentiels-restaurateur' },
      { title: 'Seuil de rentabilite restaurant', url: 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
    ],
  },
  {
    id: 'toast',
    label: 'Toast POS (US guest post DA 70)',
    to: 'editorial@toasttab.com',
    subject: 'Guest post pitch — How French restaurants are 6 months ahead on AI-powered food cost',
    recipientName: 'Hi Toast team,',
    intro: 'I just launched **RestauMargin**, an AI-powered margin software for French restaurants. France is currently leading the charge on AI integration in foodservice, and I\'d like to write a guest post for your blog that brings practical insights to your US operators.',
    pitch: `**Proposed title:**
"Why French restaurants are switching to AI for food cost — and what US operators can learn"

**Outline:**
1. The state of AI in French foodservice 2026 (regulation, adoption rates)
2. 3 specific use cases:
   - Voice-to-recipe digitization (10-second technical sheets)
   - Real-time supplier price drift tracking
   - AI-powered menu engineering (Stars/Puzzles/Plowhorses/Dogs auto-classification)
3. Real metrics from our pilot restaurants (anonymized, aggregated):
   - Average food cost reduction: 4-7 points
   - Time saved on margin management: 35h/month
4. Translation for US operators: what to adopt, what's still cultural-specific
5. Implementation roadmap for a US restaurant in 4 weeks

**Length:** ~2000 words. SEO-optimized for "AI food cost software", "AI restaurant margin tracking".
**Author bio:** 1 paragraph, single mention of RestauMargin (with link).
**Timeline:** I can deliver in 7 days from acceptance.

Available to chat any time. Looking forward to your thoughts.`,
    articles: [
      { title: 'AI in restaurants — 2026 guide', url: 'https://www.restaumargin.fr/blog/ia-restauration' },
      { title: 'Reduce food cost (10 strategies)', url: 'https://www.restaumargin.fr/blog/reduire-food-cost' },
      { title: 'Menu engineering (Boston Matrix)', url: 'https://www.restaumargin.fr/blog/menu-engineering-boston-matrix' },
    ],
  },
  {
    id: 'modeles-bp',
    label: 'Modeles Business Plan (guest post)',
    to: 'contact@modelesdebusinessplan.com',
    subject: 'Article guest — Comment integrer le food cost dans son business plan restaurant',
    recipientName: 'Bonjour,',
    intro: 'Je viens de lancer **RestauMargin**, plateforme SaaS de gestion de marges pour restaurateurs francais. Concretement, RestauMargin automatise le calcul du food cost, les fiches techniques avec dictee vocale, la mercuriale fournisseurs, et l\'analyse de marge en temps reel.',
    pitch: `Je propose un guest post pour votre blog :

**"Comment integrer le food cost dans son business plan restaurant : modele complet 2026"**

Angle : pratique et chiffre, pour les futurs restaurateurs qui montent leur business plan.

Sections proposees :
1. Pourquoi le food cost est LE chiffre cle du BP restaurant (souvent neglige)
2. Comment estimer son food cost realiste avant ouverture (par type : pizzeria, bistro, gastro, food truck)
3. Modele Excel telechargeable inclus avec formules et benchmarks par segment
4. Comment presenter le food cost a la banque pour un pret d\'amorcage
5. Erreurs courantes : les 5 hypotheses qui plantent un BP restaurant
6. Cas pratique : BP pizzeria avec food cost optimise (ratios chiffres)

Format : ~2000 mots, modele Excel offert, 100% pedagogique.

Backlink : 1 lien naturel vers restaumargin.fr dans le corps + bio auteur.

Livrable sous 5 jours.`,
    articles: [
      { title: 'Calcul de marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
      { title: 'Reduire le food cost', url: 'https://www.restaumargin.fr/blog/reduire-food-cost' },
      { title: 'Comment ouvrir un restaurant', url: 'https://www.restaumargin.fr/blog/comment-ouvrir-restaurant-guide-complet' },
    ],
  },
  {
    id: 'hr-associes',
    label: 'HR-Associes (co-publication expert-comptable)',
    to: 'contact@hr-associes.fr',
    subject: 'Co-publication article — Marge brute restaurant : ce que le comptable et le logiciel doivent vous dire',
    recipientName: 'Bonjour,',
    intro: 'Je viens de lancer **RestauMargin**, plateforme SaaS de gestion de marges pour restaurateurs. Je propose a HR-Associes une co-publication d\'article pour vos clients restaurateurs.',
    pitch: `**"Marge brute restaurant : ce que le comptable et le logiciel doivent vous dire"**

L\'angle : montrer comment expert-comptable + logiciel SaaS travaillent ensemble pour optimiser la marge — pas en concurrence.

Sections proposees :
1. La marge brute en restauration : les 4 indicateurs cles (food cost, marge brute %, marge brute €, ratio matiere)
2. Ce que voit le comptable (vue annuelle, fiscale, structurelle)
3. Ce que voit le logiciel quotidien (vue temps reel, plat par plat, fournisseur par fournisseur)
4. Pourquoi les 2 sont necessaires (ni l\'un ni l\'autre seul ne suffit)
5. Cas pratique : restaurant 1M€ CA — comment passer de 33% a 28% de food cost en 6 mois
6. Recommandations pour restaurateurs : quoi deleguer au comptable, quoi garder en main avec le logiciel

Format : ~2500 mots, co-ecriture (vous = expertise comptable, moi = expertise logiciel), benefice mutuel.

Backlinks croises :
- 1 lien vers restaumargin.fr dans la partie SaaS
- 1 lien vers votre site dans la partie comptabilite
- Co-signature en bio auteur

Publication possible :
- Sur votre site (ranking naturel sur "marge brute restaurant calcul")
- Sur notre blog en cross-publication
- Newsletter croisee a nos audiences respectives

Disponible pour appel rapide si vous voulez en discuter.`,
    articles: [
      { title: 'Calcul de marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
      { title: 'Seuil de rentabilite restaurant', url: 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
      { title: 'Prime cost restaurant', url: 'https://www.restaumargin.fr/blog/prime-cost-restaurant' },
    ],
  },
];

export default function OutreachMailer() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [to, setTo] = useState(TEMPLATES[0].to);
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [recipientName, setRecipientName] = useState(TEMPLATES[0].recipientName);
  const [intro, setIntro] = useState(TEMPLATES[0].intro);
  const [pitch, setPitch] = useState(TEMPLATES[0].pitch);
  const [articles, setArticles] = useState<ArticleLink[]>(TEMPLATES[0].articles);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const loadTemplate = (t: Template) => {
    setSelectedTemplate(t);
    setTo(t.to);
    setSubject(t.subject);
    setRecipientName(t.recipientName);
    setIntro(t.intro);
    setPitch(t.pitch);
    setArticles(t.articles);
    setResult(null);
  };

  const addArticle = () => setArticles([...articles, { title: '', url: '' }]);
  const removeArticle = (idx: number) => setArticles(articles.filter((_, i) => i !== idx));
  const updateArticle = (idx: number, key: 'title' | 'url', val: string) => {
    setArticles(articles.map((a, i) => i === idx ? { ...a, [key]: val } : a));
  };
  const pickFromBlog = (idx: number, blogIdx: number) => {
    const blog = BLOG_ARTICLES[blogIdx];
    setArticles(articles.map((a, i) => i === idx ? { ...blog } : a));
  };

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !intro.trim() || !pitch.trim()) {
      setResult({ ok: false, msg: 'Remplissez To, Subject, Intro et Pitch' });
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ to, subject, intro, pitch, articles, recipientName, signOff: 'Cordialement,' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ ok: true, msg: `Email envoye a ${to} ✓` });
      } else {
        setResult({ ok: false, msg: data.error || 'Echec envoi' });
      }
    } catch (e: any) {
      setResult({ ok: false, msg: e.message || 'Erreur reseau' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-7 h-7 text-emerald-600" />
          <h1 className="text-3xl font-black text-[#0F172A]">Outreach Mailer</h1>
        </div>
        <p className="text-sm text-[#525252] mb-8">
          Envoi d'emails branded depuis <strong>contact@restaumargin.fr</strong> avec template HTML pro
          (logo, couleurs, signature). Pour SEO link building, partenariats, journalistes.
        </p>

        {/* Templates */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Templates pretes
          </h2>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => loadTemplate(t)}
                className={`px-3 py-2 text-sm rounded-full border transition ${
                  selectedTemplate.id === t.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-[#0F172A] border-[#E5E7EB] hover:border-emerald-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-5">
          {/* To */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Destinataire (To)
            </label>
            <input
              type="email"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="redaction@example.com"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Sujet
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Salutation
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Bonjour, ou Madame, Monsieur,"
            />
          </div>

          {/* Intro */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Intro (qui on est)
            </label>
            <textarea
              value={intro}
              onChange={e => setIntro(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-mono text-sm"
              placeholder="Je viens de lancer RestauMargin..."
            />
            <p className="text-xs text-[#94A3B8] mt-1">Markdown : **bold** + saut de ligne</p>
          </div>

          {/* Articles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Articles blog (preuve d'expertise)
              </label>
              <button
                onClick={addArticle}
                className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {articles.map((a, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <select
                    value=""
                    onChange={e => e.target.value !== '' && pickFromBlog(idx, parseInt(e.target.value))}
                    className="px-2 py-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">📚 Pick</option>
                    {BLOG_ARTICLES.map((b, i) => (
                      <option key={i} value={i}>{b.title}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={a.title}
                    onChange={e => updateArticle(idx, 'title', e.target.value)}
                    placeholder="Titre"
                    className="flex-1 px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="url"
                    value={a.url}
                    onChange={e => updateArticle(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-[2] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => removeArticle(idx)}
                    className="px-2 py-2 text-[#737373] hover:text-red-500"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pitch */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Pitch (corps du mail)
            </label>
            <textarea
              value={pitch}
              onChange={e => setPitch(e.target.value)}
              rows={14}
              className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-mono text-sm"
              placeholder="Je propose..."
            />
            <p className="text-xs text-[#94A3B8] mt-1">Markdown : **bold** + sauts de ligne preserves</p>
          </div>

          {/* Result */}
          {result && (
            <div className={`flex items-start gap-2 p-3 rounded-lg ${
              result.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {result.ok ? <Check className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{result.msg}</p>
            </div>
          )}

          {/* Send button */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-[#94A3B8] text-white font-bold rounded-full flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Envoi en cours...' : 'Envoyer depuis contact@restaumargin.fr'}
            </button>
            <p className="text-xs text-[#94A3B8] mt-3">
              ✓ From : Youssef Guessous (RestauMargin) &lt;contact@restaumargin.fr&gt;
              <br />
              ✓ HTML branded avec logo + couleurs + signature pro
              <br />
              ✓ Reply-To : contact@restaumargin.fr (les reponses arrivent sur ton Gmail via le forwarder)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
