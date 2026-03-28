import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, Tablet, Bluetooth, Wifi, ChefHat, Shield, Zap,
  CheckCircle2, ArrowRight, Star, Package, Euro, Clock,
  Smartphone, BarChart3, BookOpen, Award, Truck, Mail,
  ChevronDown, MessageSquare, HelpCircle, Phone, User, Send,
  Loader2,
} from 'lucide-react';

const FEATURES = [
  { icon: Scale, title: 'Pesée BLE précise', desc: 'Balance intégrée 5kg, précision 0.5g, Bluetooth Low Energy connectée à la tablette en temps réel.' },
  { icon: Tablet, title: 'Tablette 11" tactile', desc: 'Samsung Galaxy Tab A9+ enveloppée dans un moule silicone, glissez-la facilement.' },
  { icon: ChefHat, title: 'Fiches techniques auto', desc: 'Pesez chaque ingrédient, la fiche technique se remplit automatiquement avec les coûts.' },
  { icon: BarChart3, title: 'Marges en direct', desc: 'Visualisez votre marge en temps réel pendant la préparation. Jauge verte → rouge.' },
  { icon: Shield, title: 'IP54 cuisine', desc: 'Résistant aux éclaboussures, plateau inox 304L alimentaire, nettoyage facile.' },
  { icon: Zap, title: '8h autonomie', desc: 'Batterie Li-Po rechargeable USB-C, tient une journée complète de service.' },
];

const SPECS = [
  { label: 'Capacité balance', value: '5 kg' },
  { label: 'Précision', value: '0.5 g' },
  { label: 'Écran tablette', value: '11" Full HD' },
  { label: 'Connectivité', value: 'Bluetooth 5.0 + Wi-Fi' },
  { label: 'Plateau', value: 'Inox 304L alimentaire' },
  { label: 'Protection', value: 'IP54 éclaboussures' },
  { label: 'Autonomie', value: '~8h (USB-C)' },
  { label: 'Dimensions', value: '310 × 270 × 484 mm' },
  { label: 'Poids total', value: '~1.8 kg' },
  { label: 'OS tablette', value: 'Android 13+' },
];

const STEPS = [
  { num: '1', title: 'Glissez la tablette', desc: 'Insérez votre Samsung Tab A9+ dans le moule silicone en haut du bras.' },
  { num: '2', title: 'Allumez la station', desc: 'La balance se connecte automatiquement en Bluetooth à la tablette.' },
  { num: '3', title: 'Pesez et cuisinez', desc: 'Sélectionnez un ingrédient, posez-le sur le plateau. Le poids et le coût s\'affichent en direct.' },
];

const TESTIMONIALS = [
  { name: 'Chef Laurent M.', role: 'Restaurant Le Bistrot, Lyon', text: 'On a réduit notre coût matière de 8% en 3 mois. La pesée en direct change tout.', stars: 5 },
  { name: 'Sophie R.', role: 'Traiteur S&Co, Paris', text: 'Mes commis suivent les fiches techniques au gramme près. Fini le gaspillage.', stars: 5 },
  { name: 'Karim B.', role: 'Brasserie du Port, Marseille', text: 'Le kit est robuste, l\'inox se nettoie en 2 secondes. Parfait pour le service.', stars: 4 },
];

const PRICING = [
  {
    name: 'Kit Complet',
    price: '1 200',
    period: 'HT',
    desc: 'Station + Tablette Samsung + Abonnement 1 an',
    features: ['Support-balance intégré', 'Samsung Galaxy Tab A9+ 128GB', 'Moule silicone tablette', 'App RestauMargin Pro (1 an)', 'Support technique prioritaire', 'Mises à jour incluses'],
    highlight: true,
  },
  {
    name: 'Station Seule',
    price: '450',
    period: 'HT',
    desc: 'Pour ceux qui ont déjà une tablette compatible',
    features: ['Support-balance intégré', 'Moule silicone tablette', 'Plateau inox 304L', 'Câble USB-C', 'Guide de démarrage'],
    highlight: false,
  },
  {
    name: 'Abonnement SaaS',
    price: '29',
    period: '/mois HT',
    desc: 'Application RestauMargin complète',
    features: ['Fiches techniques illimitées', 'Calcul de marges auto', 'Mercuriale fournisseurs', 'Menu Engineering BCG', 'Multi-restaurant', 'Export comptable'],
    highlight: false,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'La livraison est gratuite en France métropolitaine sous 5 à 7 jours ouvrés. Pour les DOM-TOM et l\'international, comptez 10 à 15 jours (frais de port en supplément).',
  },
  {
    q: 'Quelle est la garantie du kit ?',
    a: 'Le kit bénéficie d\'une garantie constructeur de 2 ans couvrant tout défaut de fabrication. La balance et le support sont garantis pièces et main-d\'oeuvre. La tablette Samsung suit sa propre garantie constructeur.',
  },
  {
    q: 'La station est-elle compatible avec d\'autres tablettes ?',
    a: 'Le moule silicone est conçu pour la Samsung Galaxy Tab A9+ (11"). Nous travaillons sur des adaptateurs pour iPad et autres tablettes Android. Contactez-nous pour vérifier la compatibilité de votre modèle.',
  },
  {
    q: 'Comment se passe l\'installation ?',
    a: 'Aucune installation technique requise. Déballez, glissez la tablette dans le moule, allumez la station et elle se connecte automatiquement en Bluetooth. Première pesée en moins de 5 minutes.',
  },
  {
    q: 'Que se passe-t-il si la balance tombe en panne ?',
    a: 'Notre SAV est disponible du lundi au vendredi de 9h à 18h par email et téléphone. En cas de panne sous garantie, nous envoyons une station de remplacement sous 48h avant même de recevoir la vôtre.',
  },
  {
    q: 'Puis-je utiliser la station sans abonnement logiciel ?',
    a: 'La station fonctionne comme balance autonome sans abonnement. Cependant, l\'abonnement RestauMargin Pro débloque les fiches techniques automatiques, le calcul de marges en temps réel et toutes les fonctionnalités logicielles.',
  },
  {
    q: 'Comment nettoyer la station en cuisine ?',
    a: 'Le plateau inox 304L se nettoie d\'un coup d\'éponge. La station est certifiée IP54 (résistante aux éclaboussures). Le moule silicone est amovible et lavable. Évitez le jet d\'eau direct.',
  },
  {
    q: 'Est-ce que je peux commander plusieurs kits ?',
    a: 'Oui, nous proposons des tarifs dégressifs à partir de 3 kits. Utilisez le formulaire de commande ci-dessus ou contactez-nous directement pour un devis personnalisé multi-postes.',
  },
];

export default function StationLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ restaurants: 0, margin: 0, ingredients: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', quantity: 1, message: '' });
  const [orderStatus, setOrderStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [orderError, setOrderError] = useState('');

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('sending');
    setOrderError('');
    try {
      const res = await fetch('/api/station-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setOrderStatus('success');
      setOrderForm({ name: '', email: '', phone: '', quantity: 1, message: '' });
    } catch (err: any) {
      setOrderStatus('error');
      setOrderError(err.message || 'Une erreur est survenue');
    }
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const targets = { restaurants: 150, margin: 8, ingredients: 50000 };
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        restaurants: Math.floor(targets.restaurants * ease),
        margin: Math.round(targets.margin * ease * 10) / 10,
        ingredients: Math.floor(targets.ingredients * ease),
      });
      if (progress >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">RestauMargin <span className="text-emerald-400">Station</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
            <a href="#how" className="hover:text-white transition">Comment ça marche</a>
            <a href="#specs" className="hover:text-white transition">Specs</a>
            <a href="#pricing" className="hover:text-white transition">Tarifs</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition">Connexion</Link>
            <a href="#pricing" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-semibold transition">
              Commander
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ BANDEAU LIVRAISON ═══ */}
      <div className="fixed top-16 w-full z-40 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Truck className="w-4 h-4" />
          <span>Livraison gratuite en France métropolitaine</span>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                Nouveau — Kit Balance + Tablette
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Pesez. Calculez.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Maîtrisez vos marges.
                </span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 max-w-lg">
                La première station de pesée connectée conçue pour la restauration.
                Balance intégrée + tablette + logiciel de gestion des marges en un seul kit.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="#pricing" className="group px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition flex items-center gap-2">
                  Commander le Kit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#how" className="px-6 py-3 border border-slate-700 hover:border-slate-500 rounded-xl font-medium transition text-slate-300">
                  Voir la démo
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{animatedStats.restaurants}+</div>
                  <div className="text-xs text-slate-500">Restaurants équipés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">-{animatedStats.margin}%</div>
                  <div className="text-xs text-slate-500">Coût matière moyen</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{(animatedStats.ingredients / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-slate-500">Pesées par mois</div>
                </div>
              </div>
            </div>

            {/* Right — Product Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                <img
                  src="/images/restaumargin-station.png"
                  alt="RestauMargin Station — Kit Balance + Tablette"
                  className="w-full h-auto rounded-2xl"
                  loading="eager"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">Balance 5kg</span>
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">BLE 5.0</span>
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">Inox 304L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce qu'il faut pour maîtriser vos coûts</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Un kit complet conçu par des restaurateurs, pour des restaurateurs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                  <f.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">3 étapes, c'est tout.</h2>
            <p className="text-slate-400">De l'ouverture du carton à la première pesée en moins de 5 minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT DETAIL ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Conçu pour la
                <span className="text-emerald-400"> cuisine pro</span>
              </h2>
              <p className="text-slate-400 mb-8">
                Le support EST la balance. Plateau inox alimentaire encastré, bras solidaire,
                moule silicone pour glisser la tablette. Un seul produit, zéro câble.
              </p>

              <div className="space-y-4">
                {[
                  'Support-balance monobloc (pas de pièce séparée)',
                  'Plateau inox 304L affleurant, accès libre 360°',
                  'Bras solidaire avec moule silicone pour la tablette',
                  'LCD vert en façade pour lecture rapide du poids',
                  'Bluetooth 5.0 : pesée en direct sur la tablette',
                  'USB-C rechargeable, ~8h d\'autonomie',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 mb-4 overflow-hidden">
                <img
                  src="/images/restaumargin-station.png"
                  alt="Vue détaillée RestauMargin Station"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <Package className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-400">3 pièces</div>
                  <div className="text-sm font-semibold">Monobloc</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <Scale className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-400">Capacité</div>
                  <div className="text-sm font-semibold">5 kg</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <Bluetooth className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-400">Connexion</div>
                  <div className="text-sm font-semibold">BLE 5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPECS ═══ */}
      <section id="specs" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Caractéristiques techniques</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {SPECS.map((s, i) => (
              <div key={i} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                <div className="text-sm font-semibold text-emerald-400">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ils l'utilisent au quotidien</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className={`w-4 h-4 ${si < t.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-300 mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tarifs transparents</h2>
            <p className="text-slate-400">Rentabilisé dès le premier mois grâce aux économies sur vos coûts matière.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((p, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${p.highlight
                ? 'bg-gradient-to-b from-emerald-500/10 to-slate-900 border-emerald-500/30 ring-1 ring-emerald-500/20'
                : 'bg-slate-900/50 border-slate-800'
              }`}>
                {p.highlight && (
                  <div className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> RECOMMANDÉ
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{p.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-slate-400">€ {p.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition ${p.highlight
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}>
                  {p.highlight ? 'Commander maintenant' : 'En savoir plus'}
                </button>
              </div>
            ))}
          </div>

          {/* ═══ FORMULAIRE DE COMMANDE ═══ */}
          <div id="order" className="mt-16 max-w-2xl mx-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Commander votre kit</h3>
                <p className="text-sm text-slate-400">Remplissez le formulaire, nous vous recontactons sous 24h pour finaliser votre commande.</p>
              </div>

              {orderStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Demande envoyée !</h4>
                  <p className="text-slate-400 text-sm">Nous vous recontactons sous 24h pour finaliser votre commande.</p>
                  <button
                    onClick={() => setOrderStatus('idle')}
                    className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition"
                  >
                    Nouvelle commande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Nom complet *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={orderForm.name}
                          onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                          placeholder="Jean Dupont"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={orderForm.email}
                          onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                          placeholder="jean@restaurant.fr"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          value={orderForm.phone}
                          onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                          placeholder="06 12 34 56 78"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Nombre de kits *</label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="number"
                          required
                          min={1}
                          max={50}
                          value={orderForm.quantity}
                          onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Message (optionnel)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <textarea
                        value={orderForm.message}
                        onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                        placeholder="Précisions sur votre commande, besoin spécifique..."
                        rows={3}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                      />
                    </div>
                  </div>

                  {orderStatus === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                      {orderError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={orderStatus === 'sending'}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    {orderStatus === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer ma demande de commande
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-600 text-center">
                    En soumettant ce formulaire, vous acceptez d'être recontacté par notre équipe commerciale.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Prêt à maîtriser vos marges ?</h2>
            <p className="text-slate-400 mb-8">
              Commandez votre kit RestauMargin Station et commencez à économiser dès la première semaine.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#pricing" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition flex items-center gap-2">
                <Package className="w-5 h-5" />
                Commander le Kit — 1 200€ HT
              </a>
              <a href="mailto:mr.guessousyoussef@gmail.com" className="px-8 py-3 border border-slate-700 hover:border-slate-500 rounded-xl font-medium transition flex items-center gap-2 text-slate-300">
                <Mail className="w-5 h-5" />
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-slate-400">Tout ce que vous devez savoir sur le kit RestauMargin Station.</p>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/30 transition"
                >
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60' : 'max-h-0'}`}>
                  <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">RestauMargin Station</span>
          </div>
          <div className="text-xs text-slate-500">
            © 2026 RestauMargin — Solution de gestion de marge pour la restauration
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="mailto:mr.guessousyoussef@gmail.com" className="hover:text-white transition">Contact</a>
            <Link to="/landing" className="hover:text-white transition">App RestauMargin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
