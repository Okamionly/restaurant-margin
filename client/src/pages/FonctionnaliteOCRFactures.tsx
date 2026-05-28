import { Link } from 'react-router-dom';
import {
  Camera,
  ScanLine,
  FileText,
  Zap,
  CheckCircle,
  Receipt,
  ArrowRight,
  Check,
  Sparkles,
  ChefHat,
  ShieldCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  Bell,
  PackageCheck,
  FileSearch,
  Image as ImageIcon,
  FileDigit,
  Lock,
  Truck,
  ListChecks,
  RefreshCw,
  Lightbulb,
  Gauge,
  PenLine,
  GitCompareArrows,
  ShoppingCart,
  Database,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Fonctionnalité 07 — OCR factures fournisseurs
   Mots-clés : OCR facture restaurant, scanner facture fournisseur,
   logiciel saisie facture auto
   Page descriptive riche (1500-2000 mots) + schémas SEO
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

const faqItems = [
  {
    question: 'Quels formats de factures puis-je scanner : photo ou PDF ?',
    answer:
      "Les deux. Vous pouvez prendre la facture en photo directement depuis votre smartphone ou votre tablette en cuisine, ou importer un fichier PDF reçu par e-mail (bon de livraison Metro, facture Transgourmet, bordereau d'un primeur). L'OCR traite indifféremment une photo JPEG, un PNG ou un PDF, qu'il soit tapé à l'ordinateur ou scanné. Vous pouvez même charger plusieurs pages d'un coup pour une facture longue.",
  },
  {
    question: 'Quelle est la précision de l\'OCR sur une facture fournisseur ?',
    answer:
      "Sur une facture imprimée nette (la grande majorité des factures fournisseurs en restauration), l'OCR atteint une précision supérieure à 98 % sur les libellés produits, les quantités et les prix. Le système est entraîné sur des milliers de bordereaux français : il reconnaît les abréviations (kg, L, U, cs pour caisse), les codes article et les formats de prix avec virgule. Sur une photo prise dans de mauvaises conditions, la précision baisse, mais l'étape de vérification rapide vous laisse corriger les rares lignes incertaines en un clic avant l'injection.",
  },
  {
    question: 'Est-ce que ça lit les factures manuscrites ou les tickets de marché ?',
    answer:
      "L'OCR donne ses meilleurs résultats sur les factures imprimées. Une facture entièrement manuscrite (ardoise du primeur, ticket griffonné au marché) reste plus difficile : le système tente de l'extraire mais signale les lignes douteuses pour que vous les confirmiez. En pratique, l'écriture régulière passe bien ; les pattes de mouche demandent une relecture. C'est justement pour ça que l'étape de vérification existe : vous gardez toujours le dernier mot avant que les prix entrent dans la mercuriale.",
  },
  {
    question: 'Comment ça se passe avec plusieurs fournisseurs différents ?',
    answer:
      "Chaque facture est rattachée automatiquement au bon fournisseur. L'OCR détecte le nom et le SIRET en en-tête, puis le système retrouve la fiche fournisseur correspondante dans votre mercuriale (ou la crée si c'est un nouveau). Que vous scanniez Metro le lundi, votre boucher le mardi et un grossiste en boissons le mercredi, chaque prix est classé dans la bonne colonne. Vous comparez ensuite les tarifs d'un même produit entre fournisseurs sans rien ressaisir.",
  },
  {
    question: 'Est-ce que la facture est rapprochée de ma commande ?',
    answer:
      "Oui, c'est l'un des grands intérêts. Si vous avez passé la commande dans RestauMargin (module Commandes fournisseurs), la facture scannée est rapprochée ligne à ligne avec ce qui était commandé. Le système met en évidence les écarts : produit facturé plus cher que le prix négocié, quantité livrée inférieure à la commande, article facturé mais jamais commandé. Vous repérez en quelques secondes les erreurs de facturation qui, cumulées sur l'année, représentent souvent plusieurs milliers d'euros.",
  },
  {
    question: 'Mes factures et données fournisseurs restent-elles privées ?',
    answer:
      "Absolument. Vos factures, vos prix et vos conditions fournisseurs sont des données confidentielles : elles sont hébergées en Europe (Frankfurt/Paris), chiffrées en transit (TLS 1.3) et au repos, conformes RGPD. Elles ne sont jamais partagées avec d'autres restaurants ni revendues. Vous restez propriétaire de vos données et pouvez les exporter ou les supprimer à tout moment. L'image de la facture sert à l'extraction puis reste archivée dans votre espace comme justificatif comptable.",
  },
];

const extracted = [
  { icon: <FileText className="w-5 h-5" />, label: 'Nom du produit', desc: 'Le libellé exact tel qu\'il figure sur le bordereau, normalisé pour matcher votre mercuriale.' },
  { icon: <ListChecks className="w-5 h-5" />, label: 'Quantité', desc: 'Le nombre d\'unités, le poids ou le volume (kg, L, pièces, caisses), avec l\'unité associée.' },
  { icon: <FileDigit className="w-5 h-5" />, label: 'Prix unitaire', desc: 'Le prix HT par unité, base du calcul de food cost de vos fiches techniques.' },
  { icon: <Receipt className="w-5 h-5" />, label: 'Total par ligne', desc: 'Le montant de la ligne, utilisé pour recouper et détecter les erreurs de calcul.' },
  { icon: <Truck className="w-5 h-5" />, label: 'Fournisseur', desc: 'Le nom et le SIRET en en-tête, pour rattacher automatiquement au bon fournisseur.' },
  { icon: <Clock className="w-5 h-5" />, label: 'Date de facture', desc: 'La date du document, pour horodater l\'évolution des prix dans l\'historique mercuriale.' },
];

export default function FonctionnaliteOCRFactures() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: TEXT }}>
      <SEOHead
        title="OCR factures fournisseurs restaurant | Scan auto en 4s | RestauMargin"
        description="Photographiez votre facture fournisseur, l'OCR injecte les prix dans la mercuriale en 4 secondes. Zéro saisie manuelle, zéro erreur, mercuriale toujours à jour."
        path="/fonctionnalites/ocr-factures"
        type="article"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'OCR factures : photo, c\'est saisi',
            description:
              "L'OCR de factures fournisseurs de RestauMargin : prenez la facture en photo, l'intelligence artificielle lit les lignes et injecte les prix dans la mercuriale en 4 secondes. Zéro saisie manuelle, zéro erreur.",
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            inLanguage: 'fr-FR',
            author: { '@type': 'Organization', name: 'RestauMargin' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.restaumargin.fr/og-image.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/fonctionnalites/ocr-factures',
            },
            about: 'OCR facture restaurant, scanner facture fournisseur, logiciel saisie facture auto',
          },
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Fonctionnalités', url: 'https://www.restaumargin.fr/fonctionnalites' },
            { name: 'OCR factures', url: 'https://www.restaumargin.fr/fonctionnalites/ocr-factures' },
          ]),
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 font-extrabold text-lg tracking-tight" style={{ color: TEXT }}>
            <ChefHat className="w-7 h-7" style={{ color: ACCENT }} />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/fonctionnalites/mercuriale-alertes-prix"
              className="hidden sm:inline-flex text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: TEXT_MUTED }}
            >
              Mercuriale
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-2xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="border-b py-3 px-4" style={{ backgroundColor: '#FAFAFA', borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto text-xs flex items-center gap-2 flex-wrap" style={{ color: TEXT_MUTED }}>
          <Link to="/" className="hover:opacity-70 transition-opacity">Accueil</Link>
          <span>/</span>
          <Link to="/fonctionnalites" className="hover:opacity-70 transition-opacity">Fonctionnalités</Link>
          <span>/</span>
          <span className="font-semibold" style={{ color: TEXT }}>OCR factures</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="pt-16 pb-14 px-4" style={{ background: `linear-gradient(to bottom, ${ACCENT_BG}, #FFFFFF 70%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: ACCENT_DARK, backgroundColor: '#FFFFFF', border: `1px solid ${ACCENT}33` }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité 07
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6" style={{ color: TEXT }}>
            OCR factures : photo, c'est saisi
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: TEXT_MUTED }}>
            Prenez votre facture fournisseur en photo. L'OCR lit chaque ligne — produit, quantité, prix — et
            <strong style={{ color: TEXT }}> injecte les tarifs dans votre mercuriale en 4 secondes.</strong> Plus jamais une ligne à ressaisir à la main.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-2xl transition-opacity hover:opacity-90 text-lg shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 10px 25px -5px ${ACCENT}55` }}
            >
              Scanner ma première facture
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-2xl transition-colors hover:bg-black/5 text-lg"
              style={{ color: TEXT, border: `2px solid ${TEXT}` }}
            >
              Voir la démo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: TEXT_MUTED }}>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> Photo ou PDF</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> 4 secondes par facture</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" style={{ color: ACCENT }} /> Zéro saisie manuelle</span>
          </div>
        </div>
      </header>

      {/* ── Le problème ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              La saisie de factures, ce trou noir du temps
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
              Chaque semaine, les factures s'empilent : le primeur, le boucher, le grossiste en sec, le caviste,
              la marée du jeudi. Et chaque facture, c'est le même rituel : ouvrir le tableur, retrouver la ligne du
              produit, retaper le nouveau prix, vérifier l'unité, recommencer. Ligne après ligne, fournisseur après
              fournisseur.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Des heures perdues chaque semaine',
                desc: 'Ressaisir 30 lignes par facture, sur 8 à 12 factures par semaine, c\'est facilement 2 à 4 heures qui partent dans la saisie au lieu de la cuisine ou du service.',
              },
              {
                icon: <AlertTriangle className="w-6 h-6" />,
                title: 'Des erreurs qui coûtent cher',
                desc: 'Une virgule mal placée, une unité confondue (le prix au kilo saisi comme prix à la pièce) et tout votre food cost est faussé. Vous prenez des décisions de prix sur des chiffres erronés.',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Une mercuriale jamais à jour',
                desc: 'Comme la saisie est pénible, on la repousse. Résultat : les prix de référence datent de trois semaines, vos marges affichées sont fausses, et les hausses fournisseurs passent inaperçues.',
              },
              {
                icon: <Receipt className="w-6 h-6" />,
                title: 'Des écarts jamais contrôlés',
                desc: 'Personne n\'a le temps de comparer la facture à la commande. Les surfacturations, les quantités manquantes et les prix qui dérivent doucement s\'accumulent sans alerte.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 flex gap-4" style={{ backgroundColor: '#FFF7F5', border: '1px solid #FECDCA' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEE4E2', color: '#B42318' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1.5" style={{ color: TEXT }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-base mt-10 max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
            La vérité, c'est qu'aucun chef n'a ouvert un restaurant pour passer ses soirées à recopier des bordereaux
            dans un tableur. L'OCR de factures supprime ce travail. <strong style={{ color: TEXT }}>Vous photographiez, le logiciel saisit.</strong>
          </p>
        </div>
      </section>

      {/* ── Comment ça marche (4 étapes) ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Comment ça marche : 4 étapes, 4 secondes
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              De la photo du bordereau du primeur jusqu'aux prix injectés dans la mercuriale, sans jamais toucher un clavier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                icon: <Camera className="w-7 h-7" />,
                title: 'Prenez la facture en photo',
                desc: 'À la réception de la livraison, sortez votre tablette ou votre téléphone et photographiez le bordereau. Vous pouvez aussi importer un PDF reçu par e-mail. Une page ou dix, peu importe.',
              },
              {
                step: '2',
                icon: <ScanLine className="w-7 h-7" />,
                title: 'L\'IA lit chaque ligne',
                desc: 'L\'OCR analyse le document et extrait automatiquement les lignes : produit, quantité, unité, prix unitaire, total. Il reconnaît le fournisseur et la date en en-tête.',
              },
              {
                step: '3',
                icon: <CheckCircle className="w-7 h-7" />,
                title: 'Vérification rapide',
                desc: 'Le résultat s\'affiche sous forme de tableau lisible. Les lignes sûres sont validées d\'office, les rares lignes douteuses sont surlignées pour un contrôle d\'un coup d\'œil.',
              },
              {
                step: '4',
                icon: <Zap className="w-7 h-7" />,
                title: 'Injection dans la mercuriale',
                desc: 'Vous confirmez : les prix sont injectés dans votre mercuriale en 4 secondes. Vos fiches techniques se recalculent, l\'historique des prix se met à jour, les alertes se déclenchent.',
              },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 relative" style={{ border: `1px solid ${BORDER}` }}>
                <div
                  className="absolute -top-3 -left-3 w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md"
                  style={{ backgroundColor: ACCENT_DARK }}
                >
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: TEXT }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-6 flex items-start gap-4 max-w-3xl mx-auto" style={{ backgroundColor: ACCENT_BG, border: `1px solid ${ACCENT}33` }}>
            <Gauge className="w-6 h-6 shrink-0 mt-0.5" style={{ color: ACCENT_DARK }} />
            <p className="text-sm leading-relaxed" style={{ color: ACCENT_DARK }}>
              <strong>Concrètement :</strong> vous recevez la livraison du primeur, vous prenez la facture en photo
              pendant que vous rangez les cagettes, et le temps de finir, vos 22 lignes de fruits et légumes sont déjà
              dans la mercuriale avec les bons prix du jour. La saisie ne vous interrompt plus jamais.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ce qui est extrait ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Ce que l'OCR extrait de chaque facture
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Six données structurées par ligne, prêtes à alimenter votre mercuriale et à être rapprochées de vos commandes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {extracted.map((item, i) => (
              <div key={i} className="rounded-2xl p-6 transition-shadow hover:shadow-md" style={{ border: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: TEXT }}>{item.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8" style={{ backgroundColor: '#FAFAFA', border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-3 mb-4">
              <GitCompareArrows className="w-7 h-7" style={{ color: ACCENT }} />
              <h3 className="text-xl font-extrabold tracking-tight" style={{ color: TEXT }}>
                Réconciliation automatique avec vos commandes
              </h3>
            </div>
            <p className="text-base leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
              Quand la commande a été passée dans RestauMargin, la facture scannée est rapprochée ligne à ligne avec
              ce que vous aviez commandé. Le système confronte automatiquement chaque produit facturé au prix négocié
              et à la quantité attendue. Vous voyez immédiatement où ça coince :
            </p>
            <ul className="space-y-3">
              {[
                'Prix facturé supérieur au prix négocié sur votre mercuriale — la hausse est signalée avant que vous payiez.',
                'Quantité livrée inférieure à la commande — vous ne payez pas pour ce que vous n\'avez pas reçu.',
                'Article facturé mais jamais commandé — l\'erreur de facturation saute aux yeux.',
                'Référence ou conditionnement modifié par le fournisseur — repéré pour mise à jour de la fiche.',
              ].map((line, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: TEXT }}>
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Bénéfices chiffrés ── */}
      <section className="py-16 px-4" style={{ backgroundColor: TEXT }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Les bénéfices, en chiffres
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
              Ce que l'OCR de factures change concrètement dans votre gestion quotidienne.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { big: '4 s', label: 'par facture', sub: 'contre 15 min de saisie manuelle ligne à ligne. Un gain de plus de 99 % sur le temps de traitement.', icon: <Zap className="w-6 h-6" /> },
              { big: '0', label: 'erreur de saisie', sub: 'plus de virgule mal placée ni d\'unité confondue. Les chiffres viennent directement de la facture.', icon: <ShieldCheck className="w-6 h-6" /> },
              { big: '100 %', label: 'mercuriale à jour', sub: 'chaque livraison met à jour vos prix de référence. Vos marges affichées sont enfin fiables.', icon: <RefreshCw className="w-6 h-6" /> },
              { big: '↯', label: 'écarts détectés', sub: 'chaque écart entre commande et facture est signalé. Vous récupérez les surfacturations.', icon: <Bell className="w-6 h-6" /> },
            ].map((b, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: '#1E293B' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: ACCENT, color: '#FFFFFF' }}>
                  {b.icon}
                </div>
                <div className="text-4xl font-extrabold tracking-tight mb-1 text-white">{b.big}</div>
                <div className="text-sm font-semibold mb-3" style={{ color: ACCENT }}>{b.label}</div>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{b.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-base mt-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#CBD5E1' }}>
            Sur une semaine à 10 factures, vous passez d'environ <strong className="text-white">2 h 30 de saisie</strong> à
            moins d'<strong className="text-white">une minute</strong>. Sur l'année, c'est plus de 120 heures
            récupérées — et une mercuriale qui ne ment plus jamais sur vos marges.
          </p>
        </div>
      </section>

      {/* ── Cas d'usage ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Trois moments où l'OCR vous sauve
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              L'OCR de factures s'intègre dans les routines réelles d'un restaurant, du quai de réception à la clôture du mois.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: <PackageCheck className="w-7 h-7" />,
                title: 'À la réception de la livraison',
                desc: 'Le camion arrive, vous contrôlez les cagettes et les colis. Au lieu de garder le bordereau « pour plus tard » (et de l\'oublier), vous le prenez en photo dans la foulée. Les prix entrent dans la mercuriale en temps réel, et la réconciliation avec votre commande vous dit immédiatement si tout ce qui est facturé a bien été livré.',
              },
              {
                icon: <FileSearch className="w-7 h-7" />,
                title: 'Au contrôle des factures',
                desc: 'En fin de semaine ou avant de régler vos fournisseurs, vous passez en revue les écarts détectés automatiquement. Les hausses de prix, les quantités erronées et les surfacturations sont déjà listées. Vous contestez ce qui doit l\'être, factures à l\'appui, sans avoir passé une heure à éplucher chaque ligne.',
              },
              {
                icon: <Database className="w-7 h-7" />,
                title: 'Pour alimenter la mercuriale en continu',
                desc: 'Chaque facture scannée enrichit l\'historique des prix de chaque produit. Vous voyez la courbe d\'évolution du beurre, du filet de bœuf ou de la caisse de tomates sur plusieurs mois, par fournisseur. C\'est cette base, toujours à jour sans effort, qui rend vos food cost et votre menu engineering réellement fiables.',
              },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl p-7 flex flex-col sm:flex-row gap-5 transition-shadow hover:shadow-md" style={{ border: `1px solid ${BORDER}` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT_BG, color: ACCENT_DARK }}>
                  {c.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: TEXT }}>{c.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: TEXT_MUTED }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formats acceptés (rappel visuel) */}
          <div className="mt-12 grid sm:grid-cols-3 gap-5">
            {[
              { icon: <ImageIcon className="w-5 h-5" />, label: 'Photo (JPEG, PNG)', desc: 'Prise depuis la tablette ou le smartphone, même en cuisine.' },
              { icon: <FileText className="w-5 h-5" />, label: 'PDF', desc: 'Facture reçue par e-mail ou bordereau scanné, mono ou multi-pages.' },
              { icon: <PenLine className="w-5 h-5" />, label: 'Manuscrit lisible', desc: 'Tenté avec vérification renforcée pour les lignes douteuses.' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: '#FAFAFA', border: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFFFFF', color: ACCENT_DARK, border: `1px solid ${BORDER}` }}>
                  {f.icon}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: TEXT }}>{f.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: TEXT }}>
              Questions fréquentes sur l'OCR de factures
            </h2>
            <p className="text-lg" style={{ color: TEXT_MUTED }}>
              Tout ce que les restaurateurs demandent avant de scanner leur première facture fournisseur.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <div className="rounded-2xl p-5 mt-8 flex gap-3 text-sm leading-relaxed" style={{ backgroundColor: ACCENT_BG, border: `1px solid ${ACCENT}33`, color: ACCENT_DARK }}>
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Une autre question ?</strong> Découvrez comment l'OCR alimente la{' '}
              <Link to="/fonctionnalites/mercuriale-alertes-prix" className="underline font-semibold hover:opacity-80">mercuriale et les alertes de prix</Link>,
              ou comment il se branche sur vos{' '}
              <Link to="/fonctionnalites/commandes-fournisseurs" className="underline font-semibold hover:opacity-80">commandes fournisseurs</Link>{' '}
              pour la réconciliation.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <Lock className="w-10 h-10 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Arrêtez de recopier vos factures
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-3" style={{ color: '#D1FAE5' }}>
            Photographiez, vérifiez, c'est dans la mercuriale. Testez l'OCR de factures sur vos vrais bordereaux fournisseurs dès aujourd'hui.
          </p>
          <p className="mb-10" style={{ color: '#A7F3D0' }}>
            Essai gratuit 7 jours — Sans carte bancaire — Données hébergées en Europe
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 font-extrabold rounded-2xl transition-transform hover:scale-[1.02] text-lg shadow-2xl bg-white"
              style={{ color: ACCENT_DARK }}
            >
              Scanner ma première facture
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 font-bold rounded-2xl transition-colors hover:bg-white/10 text-lg text-white"
              style={{ border: '2px solid rgba(255,255,255,0.4)' }}
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center" style={{ color: TEXT }}>
            Continuez avec ces fonctionnalités
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              to="/fonctionnalites/mercuriale-alertes-prix"
              className="rounded-2xl p-6 transition-all hover:shadow-md group"
              style={{ backgroundColor: '#FAFAFA', border: `1px solid ${BORDER}` }}
            >
              <TrendingUp className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2 transition-opacity group-hover:opacity-70" style={{ color: TEXT }}>
                Mercuriale & alertes de prix
              </h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                Suivez l'historique des prix par fournisseur et recevez une alerte dès qu'une hausse impacte vos marges.
              </p>
            </Link>
            <Link
              to="/fonctionnalites/commandes-fournisseurs"
              className="rounded-2xl p-6 transition-all hover:shadow-md group"
              style={{ backgroundColor: '#FAFAFA', border: `1px solid ${BORDER}` }}
            >
              <ShoppingCart className="w-8 h-8 mb-3" style={{ color: ACCENT }} />
              <h3 className="font-bold mb-2 transition-opacity group-hover:opacity-70" style={{ color: TEXT }}>
                Commandes fournisseurs
              </h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                Passez vos commandes et rapprochez-les automatiquement des factures scannées pour traquer les écarts.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4" style={{ backgroundColor: '#FAFAFA', borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto text-center text-sm" style={{ color: TEXT_MUTED }}>
          <Link to="/landing" className="flex items-center justify-center gap-2 font-extrabold text-lg mb-4 tracking-tight" style={{ color: TEXT }}>
            <ChefHat className="w-6 h-6" style={{ color: ACCENT }} />
            RestauMargin
          </Link>
          <p className="mb-4">Photographiez vos factures, vos prix se mettent à jour tout seuls.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/mentions-legales" className="hover:opacity-70 transition-opacity">Mentions légales</Link>
            <Link to="/cgv" className="hover:opacity-70 transition-opacity">CGV</Link>
            <Link to="/cgu" className="hover:opacity-70 transition-opacity">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:opacity-70 transition-opacity">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs" style={{ color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════ Sous-composant FAQ ═══════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white rounded-2xl group" style={{ border: `1px solid ${BORDER}` }}>
      <summary
        className="px-5 py-4 font-semibold cursor-pointer select-none flex items-center justify-between gap-3 hover:opacity-70 transition-opacity"
        style={{ color: TEXT }}
      >
        {q}
        <ArrowRight className="w-4 h-4 shrink-0 group-open:rotate-90 transition-transform" style={{ color: TEXT_MUTED }} />
      </summary>
      <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{a}</p>
    </details>
  );
}
