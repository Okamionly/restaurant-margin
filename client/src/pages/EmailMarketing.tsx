import { useState, useEffect, useMemo } from 'react';
import {
  Mail, Send, Calendar, Clock, Users, Eye, Search,
  Plus, X, ChevronRight, ChevronDown, BarChart3,
  Loader2, Copy, Check, Play, Pause, Trash2,
  ArrowRight, Zap, Star, TrendingUp, Filter,
  Code, RefreshCw, Target, Gift, Heart, AlertCircle,
  Megaphone, Newspaper, Cake, UserPlus,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

// ── Types ──────────────────────────────────────────────────────────────
type TabId = 'builder' | 'history' | 'widget' | 'sequences' | 'analytics';
type TemplateId = 'welcome' | 'relance' | 'promotion' | 'newsletter' | 'anniversaire';
type RecipientType = 'all' | 'segment' | 'manual';
type SegmentType = 'vip' | 'inactifs' | 'nouveaux';
type ScheduleType = 'now' | 'scheduled';
type CampaignStatus = 'sent' | 'scheduled' | 'draft' | 'failed' | 'finished';

interface Campaign {
  id: string;
  name: string;
  template: TemplateId;
  recipientType: RecipientType;
  segment?: SegmentType;
  manualEmails?: string[];
  recipientCount: number;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
}

interface SequenceStep {
  id: string;
  day: number;
  template: TemplateId;
  subject: string;
  condition?: string;
  active: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restaurant-Id': restaurantId || '1' };
}

const TEMPLATE_META: Record<TemplateId, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; description: string }> = {
  welcome:     { label: 'Bienvenue',    icon: UserPlus,  color: 'text-emerald-500', description: 'Email de bienvenue pour les nouveaux inscrits' },
  relance:     { label: 'Relance',      icon: RefreshCw, color: 'text-amber-500',   description: 'Relance pour les clients inactifs' },
  promotion:   { label: 'Promotion',    icon: Megaphone, color: 'text-red-500',     description: 'Offre promotionnelle ou remise speciale' },
  newsletter:  { label: 'Newsletter',   icon: Newspaper, color: 'text-blue-500',    description: 'Actualites et nouveautes du restaurant' },
  anniversaire:{ label: 'Anniversaire', icon: Cake,      color: 'text-pink-500',    description: 'Souhait d\'anniversaire avec offre speciale' },
};

const TEMPLATE_SUBJECTS: Record<TemplateId, string> = {
  welcome: 'Bienvenue chez {restaurant} ! 🎉',
  relance: 'Vous nous manquez ! Revenez nous voir 💫',
  promotion: '🔥 Offre exclusive : -20% cette semaine !',
  newsletter: '📰 Les nouvelles de {restaurant}',
  anniversaire: '🎂 Joyeux anniversaire ! Un cadeau vous attend',
};

const TEMPLATE_BODIES: Record<TemplateId, string> = {
  welcome: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 40px 32px; text-align: center;">
    <h1 style="color: white; font-size: 28px; margin: 0;">Bienvenue ! 🎉</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Nous sommes ravis de vous compter parmi nous</p>
  </div>
  <div style="padding: 32px;">
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Bonjour,</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Merci de vous etre inscrit a notre newsletter ! Vous recevrez desormais nos meilleures offres, les nouveautes du menu et des evenements exclusifs.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="#" style="background: #0d9488; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Decouvrir notre carte</a>
    </div>
    <p style="color: #6b7280; font-size: 14px; text-align: center;">A tres bientot !</p>
  </div>
</div>`,
  relance: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 40px 32px; text-align: center;">
    <h1 style="color: white; font-size: 28px; margin: 0;">Vous nous manquez ! 💫</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Cela fait un moment...</p>
  </div>
  <div style="padding: 32px;">
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Bonjour,</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Nous avons remarque que vous n'etes pas venu nous voir recemment. Notre chef a prepare de nouvelles creations qui n'attendent que vous !</p>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="color: #92400e; font-size: 18px; font-weight: 700; margin: 0;">-15% sur votre prochaine visite</p>
      <p style="color: #b45309; font-size: 14px; margin-top: 4px;">Code : COMEBACK15</p>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="#" style="background: #f59e0b; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reserver une table</a>
    </div>
  </div>
</div>`,
  promotion: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #ef4444, #f87171); padding: 40px 32px; text-align: center;">
    <h1 style="color: white; font-size: 28px; margin: 0;">Offre Exclusive ! 🔥</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Valable cette semaine uniquement</p>
  </div>
  <div style="padding: 32px;">
    <div style="background: #fef2f2; border: 2px dashed #fca5a5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <p style="color: #dc2626; font-size: 36px; font-weight: 800; margin: 0;">-20%</p>
      <p style="color: #991b1b; font-size: 16px; margin-top: 4px;">sur l'ensemble de la carte</p>
    </div>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Profitez de cette offre exceptionnelle pour decouvrir nos nouvelles creations ou retrouver vos plats favoris !</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="#" style="background: #ef4444; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">En profiter maintenant</a>
    </div>
  </div>
</div>`,
  newsletter: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); padding: 40px 32px; text-align: center;">
    <h1 style="color: white; font-size: 28px; margin: 0;">📰 Newsletter</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Les nouvelles de votre restaurant</p>
  </div>
  <div style="padding: 32px;">
    <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Cette semaine au menu</h2>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Decouvrez les plats de la semaine, prepares avec des produits frais et de saison.</p>
    <div style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0;">
      <p style="color: #1e40af; font-size: 16px; font-weight: 600;">🍽️ Plat du jour : Risotto aux cepes</p>
      <p style="color: #6b7280; font-size: 14px;">Un classique revisité par notre chef</p>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="#" style="background: #3b82f6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Voir le menu complet</a>
    </div>
  </div>
</div>`,
  anniversaire: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: linear-gradient(135deg, #ec4899, #f472b6); padding: 40px 32px; text-align: center;">
    <h1 style="color: white; font-size: 28px; margin: 0;">Joyeux Anniversaire ! 🎂</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Un cadeau special pour vous</p>
  </div>
  <div style="padding: 32px;">
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Bonjour,</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">Toute l'equipe vous souhaite un merveilleux anniversaire ! Pour celebrer avec vous, nous vous offrons un dessert de votre choix.</p>
    <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="color: #9d174d; font-size: 20px; font-weight: 700; margin: 0;">🎁 Dessert offert</p>
      <p style="color: #be185d; font-size: 14px; margin-top: 4px;">Presentez cet email lors de votre visite</p>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="#" style="background: #ec4899; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reserver pour mon anniversaire</a>
    </div>
  </div>
</div>`,
};

// ── Mock Data ──────────────────────────────────────────────────────────
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1', name: 'Newsletter Mars 2026', template: 'newsletter', recipientType: 'all',
    recipientCount: 342, status: 'sent', sentAt: '2026-03-15T10:00:00Z',
    stats: { sent: 342, delivered: 338, opened: 187, clicked: 45, failed: 4 },
  },
  {
    id: '2', name: 'Relance inactifs Février', template: 'relance', recipientType: 'segment', segment: 'inactifs',
    recipientCount: 89, status: 'sent', sentAt: '2026-02-20T14:00:00Z',
    stats: { sent: 89, delivered: 86, opened: 34, clicked: 12, failed: 3 },
  },
  {
    id: '3', name: 'Promotion Saint-Valentin', template: 'promotion', recipientType: 'all',
    recipientCount: 342, status: 'sent', sentAt: '2026-02-12T09:00:00Z',
    stats: { sent: 342, delivered: 340, opened: 256, clicked: 89, failed: 2 },
  },
  {
    id: '4', name: 'Welcome Nouveaux Mars', template: 'welcome', recipientType: 'segment', segment: 'nouveaux',
    recipientCount: 28, status: 'sent', sentAt: '2026-03-01T08:00:00Z',
    stats: { sent: 28, delivered: 28, opened: 22, clicked: 15, failed: 0 },
  },
  {
    id: '5', name: 'Newsletter Avril 2026', template: 'newsletter', recipientType: 'all',
    recipientCount: 356, status: 'scheduled', scheduledAt: '2026-04-15T10:00:00Z',
    stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
  },
  {
    id: '6', name: 'Campagne Noel 2025', template: 'promotion', recipientType: 'all',
    recipientCount: 310, status: 'finished', sentAt: '2025-12-20T09:00:00Z',
    stats: { sent: 310, delivered: 306, opened: 248, clicked: 102, failed: 4 },
  },
  {
    id: '7', name: 'Brouillon Paques 2026', template: 'promotion', recipientType: 'all',
    recipientCount: 0, status: 'draft',
    stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
  },
];

const MOCK_SEQUENCES: SequenceStep[] = [
  { id: 's1', day: 0,  template: 'welcome',    subject: 'Bienvenue chez nous !',              condition: 'Inscription newsletter', active: true },
  { id: 's2', day: 3,  template: 'newsletter',  subject: 'Comment etait votre experience ?',   condition: undefined, active: true },
  { id: 's3', day: 7,  template: 'newsletter',  subject: 'Decouvrez notre menu de la semaine',  condition: undefined, active: true },
  { id: 's4', day: 30, template: 'relance',     subject: 'Vous nous manquez !',                condition: 'Si inactif > 30 jours', active: true },
];

// ── Component ──────────────────────────────────────────────────────────
export default function EmailMarketing() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('builder');
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [sequences, setSequences] = useState<SequenceStep[]>(MOCK_SEQUENCES);

  // Builder state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('welcome');
  const [campaignName, setCampaignName] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('all');
  const [segment, setSegment] = useState<SegmentType>('vip');
  const [manualEmails, setManualEmails] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customSubject, setCustomSubject] = useState('');

  // History
  const [searchHistory, setSearchHistory] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Widget
  const [widgetCopied, setWidgetCopied] = useState(false);
  const [restaurantName, setRestaurantName] = useState('Mon Restaurant');

  // Analytics
  const [analyticsRange, setAnalyticsRange] = useState<'30d' | '90d' | 'all'>('30d');

  // Set default subject when template changes
  useEffect(() => {
    setCustomSubject(TEMPLATE_SUBJECTS[selectedTemplate]);
  }, [selectedTemplate]);

  // Computed analytics
  const analyticsData = useMemo(() => {
    const sentCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'finished');
    const totalSent = sentCampaigns.reduce((s, c) => s + c.stats.sent, 0);
    const totalDelivered = sentCampaigns.reduce((s, c) => s + c.stats.delivered, 0);
    const totalOpened = sentCampaigns.reduce((s, c) => s + c.stats.opened, 0);
    const totalClicked = sentCampaigns.reduce((s, c) => s + c.stats.clicked, 0);
    const totalFailed = sentCampaigns.reduce((s, c) => s + c.stats.failed, 0);

    // Best template
    const templatePerf: Record<string, { opens: number; total: number }> = {};
    sentCampaigns.forEach(c => {
      if (!templatePerf[c.template]) templatePerf[c.template] = { opens: 0, total: 0 };
      templatePerf[c.template].opens += c.stats.opened;
      templatePerf[c.template].total += c.stats.sent;
    });
    let bestTemplate: TemplateId = 'welcome';
    let bestRate = 0;
    Object.entries(templatePerf).forEach(([t, d]) => {
      const rate = d.total > 0 ? d.opens / d.total : 0;
      if (rate > bestRate) { bestRate = rate; bestTemplate = t as TemplateId; }
    });

    return { totalSent, totalDelivered, totalOpened, totalClicked, totalFailed, bestTemplate, bestRate, sentCampaigns };
  }, [campaigns]);

  // ── Handlers ──────────────────────────────────────────────────────────
  async function handleSendCampaign() {
    if (!campaignName.trim()) {
      showToast('Donnez un nom a votre campagne', 'error');
      return;
    }
    if (recipientType === 'manual' && !manualEmails.trim()) {
      showToast('Ajoutez au moins un email', 'error');
      return;
    }
    if (scheduleType === 'scheduled' && !scheduledDate) {
      showToast('Selectionnez une date d\'envoi', 'error');
      return;
    }

    setSending(true);

    // Build recipient list
    const emails = recipientType === 'manual'
      ? manualEmails.split(/[,;\n]/).map(e => e.trim()).filter(Boolean)
      : [];

    const recipientCount = recipientType === 'all' ? 342
      : recipientType === 'segment' ? (segment === 'vip' ? 67 : segment === 'inactifs' ? 89 : 28)
      : emails.length;

    try {
      if (scheduleType === 'now') {
        // Actually send via Resend API
        const res = await fetch('/api/email/send', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            to: recipientType === 'manual' ? emails[0] : 'newsletter@restaumargin.fr',
            subject: customSubject,
            body: TEMPLATE_BODIES[selectedTemplate],
          }),
        });
        if (!res.ok) throw new Error('Erreur envoi');
      }

      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: campaignName,
        template: selectedTemplate,
        recipientType,
        segment: recipientType === 'segment' ? segment : undefined,
        manualEmails: emails.length > 0 ? emails : undefined,
        recipientCount,
        status: scheduleType === 'now' ? 'sent' : 'scheduled',
        sentAt: scheduleType === 'now' ? new Date().toISOString() : undefined,
        scheduledAt: scheduleType === 'scheduled' ? `${scheduledDate}T${scheduledTime}:00Z` : undefined,
        stats: scheduleType === 'now'
          ? { sent: recipientCount, delivered: Math.floor(recipientCount * 0.98), opened: 0, clicked: 0, failed: Math.floor(recipientCount * 0.02) }
          : { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      showToast(
        scheduleType === 'now'
          ? `Campagne envoyee a ${recipientCount} destinataires !`
          : `Campagne programmee pour le ${scheduledDate}`,
        'success'
      );

      // Reset
      setCampaignName('');
      setManualEmails('');
      setScheduledDate('');
    } catch {
      showToast('Erreur lors de l\'envoi. Verifiez la configuration Resend.', 'error');
    } finally {
      setSending(false);
    }
  }

  function handleDeleteCampaign(id: string) {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (selectedCampaign?.id === id) setSelectedCampaign(null);
    showToast('Campagne supprimee', 'success');
  }

  function toggleSequenceStep(id: string) {
    setSequences(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }

  function generateWidgetSnippet() {
    return `<!-- Newsletter Signup - ${restaurantName} -->
<div id="rm-newsletter" style="max-width:400px;margin:0 auto;font-family:'Helvetica Neue',Arial,sans-serif;">
  <form action="${window.location.origin}/api/newsletter/subscribe" method="POST"
    style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
    <h3 style="margin:0 0 8px;font-size:18px;color:#111;">Restez informe !</h3>
    <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">
      Recevez nos offres et nouveautes par email
    </p>
    <input type="email" name="email" required
      placeholder="votre@email.com"
      style="width:100%;padding:12px 16px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;margin-bottom:12px;box-sizing:border-box;" />
    <input type="text" name="name" placeholder="Votre prenom (optionnel)"
      style="width:100%;padding:12px 16px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;margin-bottom:12px;box-sizing:border-box;" />
    <input type="hidden" name="restaurant" value="${restaurantName}" />
    <button type="submit"
      style="width:100%;padding:12px;background:#0d9488;color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">
      S'inscrire
    </button>
    <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;text-align:center;">
      Pas de spam. Desabonnement en un clic.
    </p>
  </form>
</div>`;
  }

  function handleCopyWidget() {
    navigator.clipboard.writeText(generateWidgetSnippet());
    setWidgetCopied(true);
    showToast('Code HTML copie dans le presse-papiers !', 'success');
    setTimeout(() => setWidgetCopied(false), 3000);
  }

  // ── Tabs ──────────────────────────────────────────────────────────────
  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'builder',   label: 'Campagne',    icon: Send },
    { id: 'history',   label: 'Historique',   icon: Clock },
    { id: 'widget',    label: 'Widget',       icon: Code },
    { id: 'sequences', label: 'Sequences',    icon: Zap },
    { id: 'analytics', label: 'Analytiques',  icon: BarChart3 },
  ];

  const filteredHistory = useMemo(() => {
    if (!searchHistory) return campaigns;
    const q = searchHistory.toLowerCase();
    return campaigns.filter(c =>
      c.name.toLowerCase().includes(q) ||
      TEMPLATE_META[c.template].label.toLowerCase().includes(q)
    );
  }, [campaigns, searchHistory]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-[Satoshi]">
            Email Marketing
          </h1>
          <p className="text-[#737373] dark:text-[#A3A3A3] text-sm mt-1">
            Creez, envoyez et analysez vos campagnes email
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            <Users className="w-4 h-4" />
            <span>342 abonnes</span>
          </div>
          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle campagne
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F5F5] dark:bg-[#171717] rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════ TAB: CAMPAIGN BUILDER ═══════════════════ */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Builder */}
          <div className="space-y-5">
            {/* Campaign name */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                Nom de la campagne
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="ex: Newsletter Avril 2026"
                className="w-full px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Template selection */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-3">
                Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.entries(TEMPLATE_META) as [TemplateId, typeof TEMPLATE_META[TemplateId]][]).map(([id, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedTemplate(id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        selectedTemplate === id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-[#E5E7EB] dark:border-[#262626] hover:border-[#D1D5DB] dark:hover:border-[#404040]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${meta.color}`} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#111111] dark:text-white">{meta.label}</div>
                        <div className="text-xs text-[#737373] dark:text-[#A3A3A3] truncate">{meta.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                Objet de l'email
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Recipients */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-3">
                Destinataires
              </label>
              <div className="flex gap-2 mb-3">
                {([
                  { id: 'all' as RecipientType, label: 'Tous', count: 342 },
                  { id: 'segment' as RecipientType, label: 'Segment', count: null },
                  { id: 'manual' as RecipientType, label: 'Manuel', count: null },
                ]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRecipientType(opt.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      recipientType === opt.id
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                        : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#333]'
                    }`}
                  >
                    {opt.label}
                    {opt.count && <span className="text-xs opacity-70">({opt.count})</span>}
                  </button>
                ))}
              </div>

              {recipientType === 'segment' && (
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'vip' as SegmentType, label: 'VIP', icon: Star, count: 67, color: 'text-amber-500' },
                    { id: 'inactifs' as SegmentType, label: 'Inactifs', icon: AlertCircle, count: 89, color: 'text-red-500' },
                    { id: 'nouveaux' as SegmentType, label: 'Nouveaux', icon: UserPlus, count: 28, color: 'text-blue-500' },
                  ]).map(s => {
                    const SIcon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSegment(s.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-all ${
                          segment === s.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-[#E5E7EB] dark:border-[#262626]'
                        }`}
                      >
                        <SIcon className={`w-5 h-5 ${s.color}`} />
                        <span className="text-xs font-medium text-[#111111] dark:text-white">{s.label}</span>
                        <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">{s.count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {recipientType === 'manual' && (
                <textarea
                  value={manualEmails}
                  onChange={e => setManualEmails(e.target.value)}
                  placeholder="email1@example.com&#10;email2@example.com&#10;..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-sm"
                />
              )}
            </div>

            {/* Schedule */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-3">
                Planification
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setScheduleType('now')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scheduleType === 'now'
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                      : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Envoyer maintenant
                </button>
                <button
                  onClick={() => setScheduleType('scheduled')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scheduleType === 'scheduled'
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                      : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Programmer
                </button>
              </div>
              {scheduleType === 'scheduled' && (
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 px-4 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-28 px-4 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSendCampaign}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : scheduleType === 'now' ? (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Programmer l'envoi
                </>
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 lg:sticky lg:top-6 self-start">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-500" />
                Apercu en temps reel
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium">
                {TEMPLATE_META[selectedTemplate].label}
              </span>
            </div>

            {/* Email preview chrome */}
            <div className="border border-[#E5E7EB] dark:border-[#262626] rounded-xl overflow-hidden">
              {/* Email header */}
              <div className="bg-[#F5F5F5] dark:bg-[#171717] px-4 py-3 border-b border-[#E5E7EB] dark:border-[#262626]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#737373] dark:text-[#A3A3A3]">De:</span>
                    <span className="text-[#111111] dark:text-white">RestauMargin &lt;contact@restaumargin.fr&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#737373] dark:text-[#A3A3A3]">Objet:</span>
                    <span className="text-[#111111] dark:text-white font-medium">{customSubject}</span>
                  </div>
                </div>
              </div>
              {/* Email body */}
              <div className="p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] max-h-[500px] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: TEMPLATE_BODIES[selectedTemplate] }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ TAB: CAMPAIGN HISTORY ═══════════════════ */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchHistory}
              onChange={e => setSearchHistory(e.target.value)}
              placeholder="Rechercher une campagne..."
              className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Campaign list */}
          <div className="space-y-3">
            {filteredHistory.map(campaign => {
              const meta = TEMPLATE_META[campaign.template];
              const TIcon = meta.icon;
              const openRate = campaign.stats.sent > 0 ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100) : 0;

              return (
                <div
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(selectedCampaign?.id === campaign.id ? null : campaign)}
                  className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        campaign.status === 'sent' ? 'bg-emerald-50 dark:bg-emerald-900/20'
                        : campaign.status === 'finished' ? 'bg-[#F5F5F5] dark:bg-[#262626]'
                        : campaign.status === 'scheduled' ? 'bg-blue-50 dark:bg-blue-900/20'
                        : campaign.status === 'draft' ? 'bg-amber-50 dark:bg-amber-900/20'
                        : 'bg-[#F5F5F5] dark:bg-[#262626]'
                      }`}>
                        <TIcon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#111111] dark:text-white truncate">{campaign.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
                          <span>{meta.label}</span>
                          <span>·</span>
                          <span>{campaign.recipientCount} destinataires</span>
                          <span>·</span>
                          <span>
                            {campaign.sentAt
                              ? new Date(campaign.sentAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                              : campaign.scheduledAt
                              ? `Programme: ${new Date(campaign.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                              : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'sent' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : campaign.status === 'finished' ? 'bg-[#F5F5F5] dark:bg-[#262626] text-[#525252] dark:text-[#A3A3A3]'
                        : campaign.status === 'scheduled' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : campaign.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {campaign.status === 'sent' ? 'Envoyee' : campaign.status === 'finished' ? 'Terminee' : campaign.status === 'scheduled' ? 'Programmee' : campaign.status === 'failed' ? 'Echouee' : 'Brouillon'}
                      </span>
                      {(campaign.status === 'sent' || campaign.status === 'finished') && (
                        <span className="text-sm font-semibold text-[#111111] dark:text-white">{openRate}%</span>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteCampaign(campaign.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#737373] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform ${selectedCampaign?.id === campaign.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selectedCampaign?.id === campaign.id && (campaign.status === 'sent' || campaign.status === 'finished') && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { label: 'Envoyes', value: campaign.stats.sent, color: 'text-[#111111] dark:text-white' },
                          { label: 'Delivres', value: campaign.stats.delivered, color: 'text-blue-500' },
                          { label: 'Ouverts', value: campaign.stats.opened, color: 'text-emerald-500' },
                          { label: 'Cliques', value: campaign.stats.clicked, color: 'text-teal-500' },
                          { label: 'Echoues', value: campaign.stats.failed, color: 'text-red-500' },
                        ].map(stat => (
                          <div key={stat.label} className="text-center p-3 bg-[#F5F5F5] dark:bg-[#171717] rounded-xl">
                            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-[#737373] dark:text-[#A3A3A3]">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-[#737373] dark:text-[#A3A3A3]">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Aucune campagne trouvee</p>
                <p className="text-sm mt-1">Creez votre premiere campagne dans l'onglet "Campagne"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ TAB: NEWSLETTER WIDGET ═══════════════════ */}
      {activeTab === 'widget' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Config */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-500" />
                Configuration du widget
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                    Nom du restaurant
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={e => setRestaurantName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                    Endpoint d'inscription
                  </label>
                  <div className="px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] rounded-lg text-sm font-mono text-teal-600 dark:text-teal-400">
                    /api/newsletter/subscribe
                  </div>
                </div>
              </div>
            </div>

            {/* Code snippet */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#111111] dark:text-white">
                  Code HTML a integrer
                </h3>
                <button
                  onClick={handleCopyWidget}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  {widgetCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {widgetCopied ? 'Copie !' : 'Copier'}
                </button>
              </div>
              <pre className="bg-[#1E1E1E] text-emerald-400 rounded-xl p-4 text-xs overflow-x-auto max-h-72 overflow-y-auto font-mono leading-relaxed">
                {generateWidgetSnippet()}
              </pre>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 self-start lg:sticky lg:top-6">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-500" />
              Apercu du widget
            </h3>
            <div className="border border-[#E5E7EB] dark:border-[#262626] rounded-xl p-6 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#111' }}>Restez informe !</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6b7280' }}>
                    Recevez nos offres et nouveautes par email
                  </p>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    disabled
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', background: '#f9fafb' }}
                  />
                  <input
                    type="text"
                    placeholder="Votre prenom (optionnel)"
                    disabled
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', background: '#f9fafb' }}
                  />
                  <button
                    disabled
                    style={{ width: '100%', padding: 12, background: '#0d9488', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'default' }}
                  >
                    S'inscrire
                  </button>
                  <p style={{ margin: '8px 0 0', fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
                    Pas de spam. Desabonnement en un clic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ TAB: AUTOMATED SEQUENCES ═══════════════════ */}
      {activeTab === 'sequences' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Sequence automatique post-inscription
                </h3>
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
                  Envoi automatique d'emails apres l'inscription a la newsletter
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
            </div>

            {/* Visual flow */}
            <div className="space-y-0">
              {sequences.map((step, index) => {
                const meta = TEMPLATE_META[step.template];
                const StepIcon = meta.icon;
                return (
                  <div key={step.id}>
                    {/* Connector line */}
                    {index > 0 && (
                      <div className="flex items-center ml-5 py-1">
                        <div className="w-px h-8 bg-[#E5E7EB] dark:bg-[#262626]" />
                        <div className="ml-4 flex items-center gap-2 text-xs text-[#737373] dark:text-[#A3A3A3]">
                          <Clock className="w-3 h-3" />
                          {step.day === 0 ? 'Immediatement' : `+${step.day} jours`}
                        </div>
                      </div>
                    )}

                    {/* Step card */}
                    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      step.active
                        ? 'border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-900/10'
                        : 'border-[#E5E7EB] dark:border-[#262626] opacity-50'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        step.active
                          ? 'bg-teal-100 dark:bg-teal-900/30'
                          : 'bg-[#F5F5F5] dark:bg-[#262626]'
                      }`}>
                        <StepIcon className={`w-5 h-5 ${step.active ? meta.color : 'text-[#9CA3AF]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3] font-medium">
                            J+{step.day}
                          </span>
                          <span className="text-sm font-medium text-[#111111] dark:text-white truncate">
                            {step.subject}
                          </span>
                        </div>
                        {step.condition && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 dark:text-amber-400">
                            <Filter className="w-3 h-3" />
                            {step.condition}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          step.active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#737373]'
                        }`}>
                          {meta.label}
                        </span>
                        <button
                          onClick={() => toggleSequenceStep(step.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            step.active
                              ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 text-emerald-500 hover:text-amber-500'
                              : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[#737373] hover:text-emerald-500'
                          }`}
                          title={step.active ? 'Desactiver' : 'Activer'}
                        >
                          {step.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sequence info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Comment fonctionnent les sequences ?
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Chaque nouveau inscrit via le widget newsletter declenche automatiquement cette sequence.
                  Les emails sont envoyes aux delais configures. Vous pouvez activer/desactiver chaque etape individuellement.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ TAB: ANALYTICS ═══════════════════ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Envoyes', value: analyticsData.totalSent, icon: Send, color: 'text-[#111111] dark:text-white', bg: 'bg-[#F5F5F5] dark:bg-[#171717]' },
              { label: 'Delivres', value: analyticsData.totalDelivered, icon: Check, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Ouverts', value: analyticsData.totalOpened, icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Cliques', value: analyticsData.totalClicked, icon: Target, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
              { label: 'Echoues', value: analyticsData.totalFailed, icon: X, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map(kpi => {
              const KIcon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${kpi.bg}`}>
                    <KIcon className={`w-4.5 h-4.5 ${kpi.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">{kpi.label}</div>
                </div>
              );
            })}
          </div>

          {/* Performance rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rates */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Taux de performance</h3>
              <div className="space-y-4">
                {[
                  { label: 'Taux de delivrabilite', value: analyticsData.totalSent > 0 ? Math.round((analyticsData.totalDelivered / analyticsData.totalSent) * 100) : 0, color: 'bg-blue-500' },
                  { label: "Taux d'ouverture", value: analyticsData.totalSent > 0 ? Math.round((analyticsData.totalOpened / analyticsData.totalSent) * 100) : 0, color: 'bg-emerald-500' },
                  { label: 'Taux de clic', value: analyticsData.totalSent > 0 ? Math.round((analyticsData.totalClicked / analyticsData.totalSent) * 100) : 0, color: 'bg-teal-500' },
                  { label: "Taux d'echec", value: analyticsData.totalSent > 0 ? Math.round((analyticsData.totalFailed / analyticsData.totalSent) * 100) : 0, color: 'bg-red-500' },
                ].map(rate => (
                  <div key={rate.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#737373] dark:text-[#A3A3A3]">{rate.label}</span>
                      <span className="text-sm font-semibold text-[#111111] dark:text-white">{rate.value}%</span>
                    </div>
                    <div className="h-2 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${rate.color}`} style={{ width: `${rate.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best template + best day */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-3">Meilleur template</h3>
                {(() => {
                  const meta = TEMPLATE_META[analyticsData.bestTemplate];
                  const BestIcon = meta.icon;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <BestIcon className={`w-6 h-6 ${meta.color}`} />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[#111111] dark:text-white">{meta.label}</div>
                        <div className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                          Taux d'ouverture: <span className="font-medium text-emerald-500">{Math.round(analyticsData.bestRate * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-3">Meilleur moment d'envoi</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[#111111] dark:text-white">Mardi 10h00</div>
                    <div className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                      Meilleur taux d'ouverture observe
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-3">Par campagne</h3>
                <div className="space-y-2.5">
                  {analyticsData.sentCampaigns.slice(0, 4).map(c => {
                    const openRate = c.stats.sent > 0 ? Math.round((c.stats.opened / c.stats.sent) * 100) : 0;
                    return (
                      <div key={c.id} className="flex items-center justify-between">
                        <span className="text-sm text-[#737373] dark:text-[#A3A3A3] truncate flex-1 mr-3">{c.name}</span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="w-20 h-1.5 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${openRate}%` }} />
                          </div>
                          <span className="text-xs font-medium text-[#111111] dark:text-white w-8 text-right">{openRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
