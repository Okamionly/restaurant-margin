/**
 * @file client/src/pages/Landing.tsx
 * Page d'accueil de RestauMargin.
 *
 * Refonte « sobre » du 2026-11-04 (demande du fondateur : « suppression du vibe
 * coding, rendre le site plus professionnel ») :
 *  - en-tete et pied de page partages par tout le site public (PublicHeader,
 *    PublicFooter) ;
 *  - retires : le bandeau Product Hunt (lancement du 6 mai, perime), la barre de
 *    progression lumineuse, la fenetre de sortie « Avant de partir... » (elle
 *    promettait des economies calculees sur un gain invente de 4 % du CA), le faux
 *    cadre de navigateur (pastilles macOS, fausse barre d'adresse) et les deux
 *    fonds WebGL animes ;
 *  - plus de GSAP : le CLAUDE.md du depot n'autorise que les transitions
 *    Tailwind, et le contenu s'affiche sans attendre un declencheur de defilement
 *    (les compteurs de la maquette montraient « 0.0 % » au premier affichage) ;
 *  - aucun resultat promis : la section « Simulation » calcule sur l'hypothese
 *    que le visiteur choisit lui-meme (regle « Aucune preuve sociale fabriquee »
 *    du CLAUDE.md : une vingtaine de comptes, aucun abonne payant).
 *
 * Structure en sections numerotees validee par le fondateur. Ancres utilisees par
 * d'autres pages : #tarifs, #fonctionnalites, #contact — et #temoignages, rendue
 * seulement quand de vrais temoignages existent.
 */

import { useEffect, useState } from 'react';
import type { ComponentType, FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, ArrowUpRight, Bell, CalendarX, Calculator, Camera, Check,
  ChefHat, ClipboardList, CreditCard, FileCheck, LayoutDashboard, Mail, Mic, Newspaper,
  Scale, Send, ShieldCheck, Sparkles, Star, Thermometer, TrendingUp, Truck,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHIE ET STYLES PARTAGES
// ═══════════════════════════════════════════════════════════════════════════

// Espace insecable : avant « : », « % », « € » et a l'interieur des guillemets.
const NBSP = ' ';
const nombreFr = new Intl.NumberFormat('fr-FR');
function euros(n: number) {
  return `${nombreFr.format(n)}${NBSP}€`;
}

// Vert d'accent : #047857 (contraste 5,5:1 sur blanc). Le #10B981 d'avant tombait
// a 2,5:1, sous le seuil AA meme pour un titre ; il ne sert plus qu'au decor
// (barres, points), jamais au texte.
const BOUTON_PRINCIPAL =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#065F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2';
const TITRE_H2 =
  'font-satoshi text-3xl font-extrabold leading-[1.1] tracking-tight text-[#111111] sm:text-4xl lg:text-5xl';
const CARTE = 'rounded-2xl border border-[#E5E7EB] bg-white';
const SECTION = 'px-4 py-20 sm:px-6 sm:py-24 lg:px-8';

function SectionNumber({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-4 inline-flex items-center gap-3">
      <span className="inline-flex h-9 min-w-[40px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-3 text-sm font-semibold tabular-nums text-[#111111]">
        {n}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">{label}</span>
    </div>
  );
}

// En-tete commun des sections numerotees : numero et titre a gauche, texte
// d'introduction a droite, aligne sur la derniere ligne du titre (et non plus
// decale a la main par un padding fixe qui ne tombait juste qu'a une largeur).
function EnTeteSection({ n, label, titre, intro }: { n: string; label: string; titre: ReactNode; intro?: ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-12">
      <div>
        <SectionNumber n={n} label={label} />
        <h2 className={TITRE_H2}>{titre}</h2>
      </div>
      {intro && <p className="max-w-xl text-base leading-relaxed text-[#525252] sm:text-lg lg:pb-1">{intro}</p>}
    </div>
  );
}

function Vert({ children }: { children: ReactNode }) {
  return <span className="text-[#047857]">{children}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════

// Maquettes du hero : valeurs FIXES, affichees telles quelles des le premier
// rendu. Ce sont des donnees d'exemple, annoncees comme telles sous la maquette.
function MaquetteTableauDeBord() {
  const kpis = [
    { l: 'Food cost', v: `27,3${NBSP}%`, sub: `Objectif${NBSP}: 30${NBSP}%`, vert: true },
    { l: 'Marge brute', v: `72,7${NBSP}%`, sub: `Objectif${NBSP}: 70${NBSP}%` },
    { l: 'Chiffre d’affaires', v: `38${NBSP}k€`, sub: `+4,2${NBSP}% sur un an` },
    { l: 'Alertes prix', v: '3', sub: 'Cette semaine' },
  ];
  const OBJECTIF = 30;
  const plats = [
    { n: 'Entrecôte', pct: 41 },
    { n: 'Saumon', pct: 29 },
    { n: 'Poulet rôti', pct: 24 },
    { n: 'Risotto', pct: 18 },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_24px_60px_-28px_rgba(17,17,17,0.22)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECFDF5]">
            <ChefHat className="h-4 w-4 text-[#047857]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-[#111111]">Tableau de bord</span>
        </div>
        <span className="text-xs text-[#737373]">Ce mois-ci</span>
      </div>
      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((k) => (
            <div key={k.l} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
              <div className="text-xs font-medium text-[#737373]">{k.l}</div>
              <div className={`mt-1 font-satoshi text-2xl font-bold tabular-nums ${k.vert ? 'text-[#047857]' : 'text-[#111111]'}`}>
                {k.v}
              </div>
              <div className="mt-0.5 text-xs text-[#737373]">{k.sub}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-xs font-semibold text-[#111111]">Food cost par plat</span>
            <span className="flex items-center gap-1.5 text-xs text-[#737373]">
              <span className="h-3 w-px bg-[#111111]/40" aria-hidden="true" />
              Objectif {OBJECTIF}{NBSP}%
            </span>
          </div>
          <div className="space-y-2.5">
            {plats.map((p) => {
              const auDessus = p.pct > OBJECTIF;
              return (
                <div key={p.n} className="grid grid-cols-[80px_1fr_40px] items-center gap-3 text-xs">
                  <span className="text-[#111111]">{p.n}</span>
                  {/* Echelle de 0 a 50 % : la barre fait le double du pourcentage. */}
                  <div className="relative h-2 rounded-full bg-[#F5F5F5]">
                    <div
                      className={`h-full rounded-full ${auDessus ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                      style={{ width: `${p.pct * 2}%` }}
                    />
                    <span
                      className="absolute -bottom-1 -top-1 w-px bg-[#111111]/40"
                      style={{ left: `${OBJECTIF * 2}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className={`text-right font-semibold tabular-nums ${auDessus ? 'text-[#B45309]' : 'text-[#525252]'}`}>
                    {p.pct}{NBSP}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-xs leading-relaxed text-[#92400E]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Entrecôte à 41{NBSP}%</strong>, au-dessus de l’objectif{NBSP}: revoir le grammage
            ou le prix d’achat.
          </span>
        </div>
      </div>
    </div>
  );
}

function MaquetteFicheDictee() {
  // Chiffres coherents entre eux : 4,84 + 0,45 + 0,84 + 0,95 = 7,08 € de cout
  // matiere ; 7,08 / 26,90 = 26,3 % ; 26,90 / 7,08 = coefficient 3,8.
  const lignes = [
    { n: 'Magret de canard', q: `220${NBSP}g`, p: `4,84${NBSP}€` },
    { n: 'Pommes grenailles', q: `150${NBSP}g`, p: `0,45${NBSP}€` },
    { n: 'Haricots verts', q: `80${NBSP}g`, p: `0,84${NBSP}€` },
    { n: 'Sauce miel et thym', q: `6${NBSP}cl`, p: `0,95${NBSP}€` },
  ];
  // Forme d'onde figee (pas d'animation) : hauteurs deterministes.
  const barres = Array.from({ length: 36 }, (_, i) => 6 + Math.round(24 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31))));
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_24px_60px_-28px_rgba(17,17,17,0.22)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECFDF5]">
            <Mic className="h-4 w-4 text-[#047857]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-[#111111]">Nouvelle fiche dictée</span>
        </div>
        <span className="text-xs tabular-nums text-[#737373]">0:14</span>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex h-9 items-center justify-between overflow-hidden" aria-hidden="true">
          {barres.map((h, i) => (
            <span key={i} className="w-[3px] shrink-0 rounded-full bg-[#10B981]" style={{ height: h, opacity: 0.35 + h / 50 }} />
          ))}
        </div>
        <p className="text-sm leading-relaxed text-[#111111]">
          «{NBSP}Magret de canard sauce miel et thym, pommes grenailles et haricots verts. 220{NBSP}grammes de magret
          par portion, coefficient 3,8.{NBSP}»
        </p>
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-xs font-semibold text-[#047857]">Fiche générée</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-[#111111]">Magret, sauce miel et thym</div>
            <div className="mt-0.5 text-xs text-[#737373]">Plat · 1 portion</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs text-[#737373]">Coût matière</div>
            <div className="font-satoshi text-xl font-bold tabular-nums text-[#111111]">7,08{NBSP}€</div>
          </div>
        </div>
        <div className="divide-y divide-[#F5F5F5] rounded-xl border border-[#E5E7EB]">
          {lignes.map((l) => (
            <div key={l.n} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-2 text-xs">
              <span className="text-[#111111]">{l.n}</span>
              <span className="tabular-nums text-[#737373]">{l.q}</span>
              <span className="w-14 text-right font-semibold tabular-nums text-[#111111]">{l.p}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { l: 'Food cost', v: `26,3${NBSP}%`, vert: true },
            { l: 'Coefficient', v: `×${NBSP}3,8` },
            { l: 'Prix de vente HT', v: `26,90${NBSP}€`, vert: true },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-xs text-[#737373]">{s.l}</div>
              <div className={`mt-0.5 font-satoshi text-lg font-bold tabular-nums ${s.vert ? 'text-[#047857]' : 'text-[#111111]'}`}>
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Deux vues au choix du visiteur. L'ancien carrousel basculait seul toutes les
// 6,5 s avec une rotation 3D et une inclinaison au defilement ; ici, rien ne
// bouge tant qu'on ne clique pas.
function ApercuProduit() {
  const [vue, setVue] = useState<'tableau' | 'fiche'>('tableau');
  const vues = [
    { id: 'tableau' as const, label: 'Tableau de bord', Icone: LayoutDashboard },
    { id: 'fiche' as const, label: 'Fiche dictée', Icone: Mic },
  ];
  return (
    <div className="min-w-0">
      <div role="group" aria-label="Choisir la vue de l’aperçu" className="mb-4 inline-flex rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-1">
        {vues.map(({ id, label, Icone }) => {
          const actif = vue === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={actif}
              onClick={() => setVue(id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] ${
                actif ? 'bg-white text-[#111111] shadow-sm' : 'text-[#525252] hover:text-[#111111]'
              }`}
            >
              <Icone className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
      {vue === 'tableau' ? <MaquetteTableauDeBord /> : <MaquetteFicheDictee />}
      <p className="mt-3 text-xs text-[#737373]">Aperçu de l’application, données d’exemple.</p>
    </div>
  );
}

// Faits verifiables en un clic (CLAUDE.md) : essai, tarif, fiches illimitees,
// inventaire (client/src/pages/Inventory.tsx) et historique des prix (modele
// PriceHistory). Aucune statistique client, aucun resultat promis.
function FaitsProduit() {
  const faits = [
    { v: '7 jours', l: 'd’essai gratuit, sans carte bancaire' },
    { v: `29${NBSP}€`, l: 'par mois, sans engagement' },
    { v: 'Illimitées', l: 'fiches techniques' },
    { v: 'Inventaire', l: 'et historique des prix fournisseurs' },
  ];
  return (
    <ul className="mx-auto mt-14 grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4">
      {faits.map((f) => (
        <li key={f.v} className={`${CARTE} px-4 py-4 sm:px-5 sm:py-5`}>
          <div className="font-satoshi text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">{f.v}</div>
          <div className="mt-1 text-sm leading-snug text-[#525252]">{f.l}</div>
        </li>
      ))}
    </ul>
  );
}

function HeroSection() {
  const atouts = [
    'Coût matière recalculé dès qu’un prix change',
    'Fiches techniques illimitées, allergènes compris',
    'Alerte quand un fournisseur augmente ses prix',
  ];
  return (
    <section className="bg-white px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#047857]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
            Pensée pour les restaurateurs
          </span>
          {/* « Logiciel marge restaurant » reste en tete du H1 : la page est 1re
              sur Google pour cette requete. */}
          <h1 className="mt-6 font-satoshi text-4xl font-extrabold leading-[1.05] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
            Logiciel marge restaurant{NBSP}:
            <br />
            <Vert>la marge réelle de chaque plat.</Vert>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#525252] sm:text-xl">
            RestauMargin calcule le coût de vos plats à partir de vos prix d’achat et réunit fiches techniques,
            food cost, commandes fournisseurs et inventaire dans un seul outil.
          </p>
          <ul className="mt-8 space-y-3">
            {atouts.map((a) => (
              <li key={a} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#047857]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-base font-medium text-[#111111]">{a}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link to="/login?mode=register" className={BOUTON_PRINCIPAL}>
              Essayer gratuitement <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="text-sm text-[#525252]">7 jours gratuits · Sans carte bancaire · Sans engagement</p>
          </div>
        </div>
        <ApercuProduit />
      </div>
      <FaitsProduit />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATION (ex « calculateur d'economies »)
// ═══════════════════════════════════════════════════════════════════════════

// Avant : « Quatre points de marge recuperes sur des milliers de couverts »,
// « sur la base de +4 pts de marge », « RETOUR ×7 », « DELAI 30 j » — des
// resultats annonces sans aucune preuve, et un curseur « Plats a la carte » qui
// n'entrait dans aucun calcul. Ici l'hypothese est CHOISIE par le visiteur, la
// formule est affichee, et le rapport a l'abonnement dit ce qu'il compare.
const JOURS_OUVERTURE = 26; // 6 jours sur 7 ; affiche dans la formule.
const ABONNEMENT_PRO = 29; // € par mois, tarif public du plan Pro.

function SimulationSection({ n }: { n: string }) {
  const [couverts, setCouverts] = useState(80);
  const [ticket, setTicket] = useState(18);
  const [points, setPoints] = useState(2);

  const caMensuel = couverts * ticket * JOURS_OUVERTURE;
  const gainMensuel = Math.round((caMensuel * points) / 100);
  const gainAnnuel = gainMensuel * 12;
  const rapport = gainMensuel / ABONNEMENT_PRO;
  const rapportTexte = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: rapport < 10 ? 1 : 0 }).format(rapport);
  const pointsTexte = `${points}${NBSP}point${points > 1 ? 's' : ''}`;

  const curseurs = [
    { id: 'sim-couverts', label: 'Couverts par jour', valeur: couverts, set: setCouverts, min: 20, max: 300, pas: 5, format: (v: number) => String(v) },
    { id: 'sim-ticket', label: 'Ticket moyen HT', valeur: ticket, set: setTicket, min: 8, max: 60, pas: 1, format: (v: number) => euros(v) },
    {
      id: 'sim-points',
      label: 'Points de marge gagnés (hypothèse)',
      valeur: points,
      set: setPoints,
      min: 1,
      max: 5,
      pas: 1,
      format: (v: number) => `${v}${NBSP}point${v > 1 ? 's' : ''}`,
    },
  ];

  return (
    <section className={`${SECTION} bg-[#FAFAFA]`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Simulation"
          titre={<>Ce que valent <Vert>quelques points de marge.</Vert></>}
          intro={`Indiquez votre activité et le gain de marge que vous visez${NBSP}: le calcul s’applique à votre propre chiffre d’affaires. C’est une simulation, pas une promesse de résultat.`}
        />

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          <div className={`${CARTE} flex flex-col rounded-3xl p-6 sm:p-8`}>
            {curseurs.map((c, i) => (
              <div key={c.id} className={i < curseurs.length - 1 ? 'mb-8' : ''}>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label htmlFor={c.id} className="text-sm font-semibold text-[#111111]">
                    {c.label}
                  </label>
                  <span className="shrink-0 rounded-full bg-[#ECFDF5] px-3 py-1 text-sm font-semibold tabular-nums text-[#047857]">
                    {c.format(c.valeur)}
                  </span>
                </div>
                <input
                  id={c.id}
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.pas}
                  value={c.valeur}
                  onChange={(e) => c.set(Number(e.target.value))}
                  className="w-full rounded-full accent-[#047857] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2"
                />
                <div className="mt-2 flex justify-between text-xs text-[#737373]">
                  <span>{c.format(c.min)}</span>
                  <span>{c.format(c.max)}</span>
                </div>
              </div>
            ))}
            <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 lg:mt-auto">
              <div className="text-xs font-semibold text-[#111111]">Hypothèses du calcul</div>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-[#525252]">
                <li>{JOURS_OUVERTURE}{NBSP}jours d’ouverture par mois (6{NBSP}jours sur{NBSP}7).</li>
                <li>Montants hors taxes.</li>
                <li>Un point de marge gagné = 1{NBSP}% du chiffre d’affaires conservé.</li>
              </ul>
            </div>
          </div>

          <div className={`${CARTE} flex flex-col rounded-3xl p-6 sm:p-8`} aria-live="polite">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">Résultat de la simulation</div>
            <p className="mt-3 text-base text-[#111111]">
              Si vous gagnez <strong className="font-semibold">{pointsTexte} de marge</strong>, cela représente{NBSP}:
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-satoshi text-5xl font-extrabold tabular-nums leading-none text-[#111111] sm:text-6xl">
                {euros(gainMensuel)}
              </span>
              <span className="text-lg text-[#525252]">par mois</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#525252]">
              {couverts} couverts × {euros(ticket)} × {JOURS_OUVERTURE} jours d’ouverture = {euros(caMensuel)} de chiffre
              d’affaires HT par mois. {points}{NBSP}% de ce montant = {euros(gainMensuel)}.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#E5E7EB] pt-5">
              <div>
                <dt className="text-xs font-medium text-[#737373]">Sur un an</dt>
                <dd className="mt-1 font-satoshi text-xl font-bold tabular-nums text-[#047857]">{euros(gainAnnuel)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#737373]">Rapporté à l’abonnement Pro</dt>
                <dd className="mt-1 font-satoshi text-xl font-bold tabular-nums text-[#111111]">{rapportTexte} fois</dd>
                <dd className="mt-0.5 text-xs text-[#737373]">
                  gain simulé ÷ {ABONNEMENT_PRO}{NBSP}€ d’abonnement mensuel
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-[#737373]">
              Ordre de grandeur, pas une promesse{NBSP}: le résultat réel dépend de votre carte, de vos prix d’achat et
              des décisions que vous prendrez.
            </p>

            <div className="mt-auto pt-6">
              <Link to="/login?mode=register" className={`${BOUTON_PRINCIPAL} w-full`}>
                Lancer mon essai de 7 jours <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/outils/calculateur-marge-restaurant"
                className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-[#047857] hover:underline"
              >
                <Calculator className="h-4 w-4 shrink-0" aria-hidden="true" />
                Ou calculez la marge d’un plat avec l’outil gratuit, sans inscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TARIFS
// ═══════════════════════════════════════════════════════════════════════════
function PricingSection({ n }: { n: string }) {
  const [annuel, setAnnuel] = useState(false);
  // Memes prix que /pricing (annuel = mensuel × 0,8, arrondi) et que Stripe.
  const offres = [
    {
      nom: 'Pro',
      pour: 'Pour un restaurant indépendant',
      mensuel: 29,
      annuel: 23,
      fonctions: ['Fiches techniques illimitées', '19 actions IA', 'Commandes fournisseurs', 'Lecture des factures par IA', '500 requêtes IA par mois'],
    },
    {
      nom: 'Business',
      pour: 'Pour plusieurs établissements',
      mensuel: 79,
      annuel: 63,
      fonctions: ['Tout le plan Pro', 'Plusieurs établissements', '2 000 requêtes IA par mois', 'Rapport IA hebdomadaire', 'Ingénierie de menu', 'Support prioritaire'],
    },
  ];

  return (
    <section id="tarifs" className={`${SECTION} scroll-mt-20 bg-white`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Tarifs"
          titre={<>Des tarifs <Vert>simples</Vert> et <Vert>transparents.</Vert></>}
          intro={`Sans engagement${NBSP}: vous arrêtez quand vous voulez. Chaque offre commence par 7${NBSP}jours d’essai gratuit, sans carte bancaire.`}
        />

        <div className="mt-10 flex justify-center lg:mt-12">
          <div role="group" aria-label="Période de facturation" className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] p-1">
            {[
              { val: false, label: 'Mensuel' },
              { val: true, label: 'Annuel' },
            ].map((o) => {
              const actif = annuel === o.val;
              return (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => setAnnuel(o.val)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] ${
                    actif ? 'bg-white text-[#111111] shadow-sm' : 'text-[#525252] hover:text-[#111111]'
                  }`}
                >
                  {o.label}
                  {o.val && (
                    <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-[#047857]">
                      −20{NBSP}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          {offres.map((o) => {
            const prix = annuel ? o.annuel : o.mensuel;
            return (
              <div key={o.nom} className={`${CARTE} flex flex-col rounded-3xl p-7 sm:p-8`}>
                <h3 className="font-satoshi text-2xl font-bold text-[#111111]">{o.nom}</h3>
                <p className="mt-1 text-sm text-[#525252]">{o.pour}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-satoshi text-5xl font-extrabold tabular-nums text-[#111111]">{euros(prix)}</span>
                  <span className="text-base text-[#525252]">par mois</span>
                </div>
                {/* Ligne toujours presente : le bloc ne saute pas quand on bascule. */}
                <p className={`mt-2 min-h-[20px] text-sm ${annuel ? 'text-[#047857]' : 'text-[#737373]'}`}>
                  {annuel ? `Soit ${euros(o.annuel * 12)} par an au lieu de ${euros(o.mensuel * 12)}` : 'Facturation mensuelle'}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {o.fonctions.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[#111111]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" strokeWidth={2.5} aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/login?mode=register" className={`${BOUTON_PRINCIPAL} mt-8 w-full`}>
                  Commencer l’essai gratuit
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-[#525252]">
          Plusieurs sites ou besoin d’un accompagnement{NBSP}?{' '}
          <Link to="/pricing" className="font-semibold text-[#047857] hover:underline">
            Voir toutes les offres
          </Link>
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONNALITES
// ═══════════════════════════════════════════════════════════════════════════
function FeaturesSection({ n }: { n: string }) {
  const fonctions = [
    { Icone: Send, titre: 'Commandes fournisseurs en un clic', texte: 'Le bon de commande part par e-mail ou WhatsApp depuis la mercuriale, prérempli avec vos quantités.', slug: 'commandes-fournisseurs' },
    { Icone: Sparkles, titre: 'Un assistant IA qui parle cuisine', texte: `Dictez la recette${NBSP}: l’assistant structure les ingrédients, les allergènes et le coût.`, slug: 'ia-cuisine' },
    { Icone: ClipboardList, titre: 'Fiches techniques complètes', texte: 'Food cost, marge, coefficient et allergènes calculés automatiquement, prêts pour un contrôle.', slug: 'fiches-techniques' },
    { Icone: Truck, titre: 'Mercuriale et alertes de prix', texte: 'Les prix de chaque fournisseur sont suivis, et vous êtes alerté dès qu’un produit augmente.', slug: 'mercuriale-alertes-prix' },
    { Icone: Scale, titre: 'Pesage Bluetooth', texte: 'Une balance reliée à la fiche technique pour respecter les grammages en plein service.', slug: 'pesage-bluetooth' },
    { Icone: Thermometer, titre: 'HACCP numérique', texte: 'Relevés de températures, plan de nettoyage et traçabilité sur tablette, exportables en PDF.', slug: 'haccp-digital' },
    { Icone: Camera, titre: 'Lecture des factures', texte: `Photographiez une facture${NBSP}: les prix sont reportés dans la mercuriale, sans ressaisie.`, slug: 'ocr-factures' },
    { Icone: TrendingUp, titre: 'Ingénierie de menu', texte: 'Chaque plat classé selon sa popularité et sa marge, pour savoir lesquels mettre en avant ou retirer.', slug: 'menu-engineering' },
  ];

  return (
    <section id="fonctionnalites" className={`${SECTION} scroll-mt-20 bg-[#FAFAFA]`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Fonctionnalités"
          titre={<>Tout ce qu’il faut pour piloter <Vert>une cuisine rentable.</Vert></>}
          intro={`Huit modules reliés entre eux${NBSP}: quand un prix fournisseur change, vos fiches techniques et vos marges se mettent à jour.`}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {fonctions.map(({ Icone, titre, texte, slug }, i) => (
            <Link
              key={slug}
              to={`/fonctionnalites/${slug}`}
              className={`${CARTE} group flex flex-col p-5 transition-colors hover:border-[#047857] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] lg:p-6`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold tabular-nums text-[#A3A3A3]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111111]">{titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#525252]">{texte}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#047857]">
                En savoir plus <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MISE EN ROUTE
// ═══════════════════════════════════════════════════════════════════════════
function ProcessSection({ n }: { n: string }) {
  const etapes = [
    { n: '1', titre: 'Ajoutez vos ingrédients', texte: 'Importez votre liste en fichier CSV (exportable depuis Excel) ou dictez-la. Prix, fournisseurs et unités sont rangés au même endroit.' },
    { n: '2', titre: 'Créez vos fiches techniques', texte: 'Décrivez le plat, l’assistant prépare la fiche. Food cost, marge, allergènes et coefficient sont calculés automatiquement.' },
    { n: '3', titre: 'Pilotez vos marges', texte: `Tableau de bord, alertes de prix et ingénierie de menu${NBSP}: vous voyez où agir, plat par plat.` },
  ];
  return (
    <section className={`${SECTION} bg-white`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Mise en route"
          titre={<>Trois étapes <Vert>pour démarrer.</Vert></>}
          intro="De l’inscription à vos premières fiches techniques chiffrées."
        />
        <div className="relative mt-14 lg:mt-16">
          <div
            className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-px md:block"
            style={{ backgroundImage: 'repeating-linear-gradient(to right, #A7F3D0 0 8px, transparent 8px 16px)' }}
            aria-hidden="true"
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {etapes.map((e) => (
              <li key={e.n} className="relative text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#047857] bg-white font-satoshi text-base font-bold tabular-nums text-[#047857]">
                  {e.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#111111]">{e.titre}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#525252]">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMOIGNAGES
// ═══════════════════════════════════════════════════════════════════════════
type Temoignage = {
  stars: number; quote: string; initials: string;
  name: string; role: string; restaurant: string;
};

// FIX 2026-09-24 : ce tableau contenait TROIS temoignages entierement inventes
// — Laurent Dubois (Le Jardin des Saveurs, Lyon), Sophie Martin (Brasserie Le
// Comptoir, Paris), Karim Benali (Street Flavors, Bordeaux) — note cinq etoiles
// et resultats chiffres a l'appui ("+4 points de marge", "de 34 % a 27 %",
// "800 € economises"). Aucun de ces clients n'existe : la base compte une
// vingtaine de comptes et aucun abonne payant.
// Publier de faux avis de consommateurs est une pratique commerciale trompeuse
// (Code de la consommation, art. L121-2 et suivants). Et sur le fond : un
// prospect qui cherche "Le Jardin des Saveurs Lyon" et ne trouve rien est perdu
// definitivement — la fausse preuve sociale coute plus cher que son absence.
//
// Le tableau est VIDE, pas supprime : y remettre de vrais temoignages, obtenus
// et autorises par leurs auteurs, suffit a rallumer la section — son ancre
// #temoignages et son numero (les sections suivantes se renumerotent seules).
const testimonials: Temoignage[] = [];

function TestimonialsSection({ n }: { n: string }) {
  // Sans temoignage reel, on n'affiche pas une section vide : on n'affiche rien.
  if (testimonials.length === 0) return null;

  return (
    <section id="temoignages" className={`${SECTION} scroll-mt-20 bg-white`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection n={n} label="Témoignages" titre={<>Ils en <Vert>parlent.</Vert></>} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className={`${CARTE} flex flex-col rounded-3xl p-7`}>
              <div className="mb-4 flex gap-0.5" role="img" aria-label={`${t.stars} sur 5`}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-[#111111]" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mb-6 text-sm leading-relaxed text-[#111111]">«{NBSP}{t.quote}{NBSP}»</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-[#E5E7EB] pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5] text-xs font-semibold text-[#047857]">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#111111]">{t.name}</span>
                  <span className="block text-xs text-[#525252]">{t.role}</span>
                  <span className="block text-xs text-[#525252]">{t.restaurant}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APERCU — cinq ecrans de l'application, avec des donnees d'exemple
// ═══════════════════════════════════════════════════════════════════════════
// Plus de faux chrome de navigateur (pastilles, adresse « app.restaumargin.fr »
// tapee lettre par lettre, voyant « Live »), plus de defilement automatique :
// le visiteur choisit l'ecran. Fournisseurs generiques (grossiste, mareyeur,
// primeur) plutot que des enseignes reelles qui laisseraient croire a un
// partenariat. Aucun element de maquette n'est un vrai bouton.

function MaquetteBalance() {
  const lignes = [
    { n: 'Saumon', poids: `120${NBSP}g`, cout: `2,45${NBSP}€`, etat: 'fait' as const },
    { n: 'Avocat', poids: `80${NBSP}g`, cout: `1,10${NBSP}€`, etat: 'fait' as const },
    { n: 'Tomate', poids: `78${NBSP}g`, cout: '—', etat: 'encours' as const },
    { n: 'Riz basmati', poids: `150${NBSP}g`, cout: `0,35${NBSP}€`, etat: 'attente' as const },
  ];
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-[#737373]">Pesée en cours</div>
          <div className="mt-0.5 text-base font-semibold text-[#111111]">Bowl saumon</div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#047857]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
          Connectée
        </span>
      </div>
      <div className="mb-4 rounded-2xl bg-[#111111] p-6 text-center">
        <div className="text-xs font-medium text-white/60">Tomate · poids actuel</div>
        <div className="mt-1 font-satoshi text-5xl font-bold tabular-nums text-[#34D399] sm:text-6xl">
          78<span className="ml-1 text-2xl text-white/60">g</span>
        </div>
        <div className="mt-2 text-xs text-white/60">Cible{NBSP}: 80{NBSP}g · tolérance ±{NBSP}5{NBSP}g</div>
        <div className="mx-8 mt-3 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#34D399]" style={{ width: `${(78 / 80) * 100}%` }} />
        </div>
      </div>
      <div className="space-y-2">
        {lignes.map((l) => (
          <div
            key={l.n}
            className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${
              l.etat === 'encours' ? 'border-[#A7F3D0] bg-[#ECFDF5]' : 'border-[#E5E7EB] bg-[#FAFAFA]'
            }`}
          >
            <div className="flex items-center gap-3">
              {l.etat === 'fait' ? (
                <Check className="h-4 w-4 text-[#047857]" aria-hidden="true" />
              ) : (
                <span className={`h-3 w-3 rounded-full ${l.etat === 'encours' ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`} aria-hidden="true" />
              )}
              <span className={l.etat === 'encours' ? 'font-semibold text-[#111111]' : 'text-[#111111]'}>{l.n}</span>
            </div>
            <div className="flex items-center gap-4 text-xs tabular-nums">
              <span className="text-[#525252]">{l.poids}</span>
              <span className="w-12 text-right font-semibold text-[#111111]">{l.cout}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MaquetteCommandes() {
  const fournisseurs = [
    { n: 'Grossiste', lettre: 'G', teinte: 'bg-amber-50 text-amber-700', produits: 5, total: `127,40${NBSP}€`, etat: 'Proposée par l’assistant', envoye: false },
    { n: 'Mareyeur', lettre: 'M', teinte: 'bg-sky-50 text-sky-700', produits: 3, total: `218,70${NBSP}€`, etat: 'Prête à partir par WhatsApp', envoye: false },
    { n: 'Primeur', lettre: 'P', teinte: 'bg-[#ECFDF5] text-[#047857]', produits: 4, total: `94,20${NBSP}€`, etat: 'Envoyée par e-mail', envoye: true },
  ];
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-[#737373]">Commandes du jour</div>
          <div className="mt-0.5 whitespace-nowrap text-sm font-semibold text-[#111111] sm:text-base">3 fournisseurs · 12 produits</div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#047857] px-3 py-1.5 text-xs font-semibold text-white">
          <Send className="h-3.5 w-3.5" aria-hidden="true" /> Tout envoyer
        </span>
      </div>
      <div className="space-y-2">
        {fournisseurs.map((f) => (
          <div key={f.n} className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${f.teinte}`}>{f.lettre}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#111111]">{f.n}</div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#525252]">
                <span>{f.produits} produits</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  {f.envoye && <Check className="h-3 w-3 text-[#047857]" aria-hidden="true" />}
                  {f.etat}
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-semibold tabular-nums text-[#111111]">{f.total}</div>
              <div className="text-xs text-[#737373]">HT</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-xs leading-relaxed text-[#065F46]">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">L’assistant suggère</strong> de regrouper les commandes du grossiste et du
          primeur{NBSP}: économie estimée 24{NBSP}€.
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between border-t border-[#E5E7EB] pt-4 text-sm">
        <span className="text-[#525252]">Total du jour</span>
        <span className="font-semibold tabular-nums text-[#111111]">440,30{NBSP}€ HT</span>
      </div>
    </>
  );
}

function MaquetteAssistant() {
  const messages = [
    { de: 'vous', texte: 'Crée une fiche pour un bowl saumon, 4 portions' },
    { de: 'ia', texte: `Fiche «${NBSP}Bowl saumon${NBSP}» créée${NBSP}: food cost 27,3${NBSP}%, marge 72,7${NBSP}%, 4 allergènes (poisson, gluten, lait, sésame). Je l’enregistre${NBSP}?` },
    { de: 'vous', texte: 'Oui, et propose deux variantes végétariennes' },
    { de: 'ia', texte: `Fiche enregistrée. Deux variantes${NBSP}: «${NBSP}Bowl tofu mariné${NBSP}» (food cost 22,1${NBSP}%) et «${NBSP}Bowl falafels${NBSP}» (food cost 19,8${NBSP}%). Je crée les fiches${NBSP}?` },
  ];
  return (
    <>
      <div className="mb-4 text-xs text-[#737373]">19 actions disponibles · fiches, prix, commandes, analyses</div>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.de === 'vous' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.de === 'vous' ? 'rounded-tr-md bg-[#047857] text-white' : 'rounded-tl-md bg-[#F5F5F5] text-[#111111]'
              }`}
            >
              {m.texte}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2.5">
        <Sparkles className="h-4 w-4 shrink-0 text-[#047857]" aria-hidden="true" />
        <span className="flex-1 text-sm text-[#737373]">Posez votre question…</span>
        <span className="rounded-lg bg-[#047857] px-3 py-1.5 text-xs font-semibold text-white">Envoyer</span>
      </div>
    </>
  );
}

function MaquetteAlertes() {
  const alertes = [
    { Icone: AlertTriangle, teinte: 'bg-amber-50 text-amber-700', titre: `Hausse de prix${NBSP}: tomate`, texte: `Grossiste${NBSP}: +12${NBSP}% (1,40${NBSP}€ → 1,57${NBSP}€ le kg). Impact${NBSP}: −0,3${NBSP}point de marge sur 4 plats.`, quand: `il y a 2${NBSP}min` },
    { Icone: Check, teinte: 'bg-[#ECFDF5] text-[#047857]', titre: 'Commande livrée', texte: `Mareyeur · 218,70${NBSP}€ · toutes les références sont conformes.`, quand: `il y a 14${NBSP}min` },
    { Icone: TrendingUp, teinte: 'bg-sky-50 text-sky-700', titre: 'Plat le plus rentable', texte: `Bowl saumon${NBSP}: marge de 72,7${NBSP}%, 18 ventes cette semaine.`, quand: `il y a 1${NBSP}h` },
    { Icone: Sparkles, teinte: 'bg-[#ECFDF5] text-[#047857]', titre: 'Suggestion de l’assistant', texte: `Augmenter le tartare de bœuf de 1${NBSP}€ pour retrouver la marge perdue.`, quand: `il y a 2${NBSP}h` },
    { Icone: Bell, teinte: 'bg-[#F5F5F5] text-[#111111]', titre: 'Stock bas', texte: `3 produits sous le seuil d’alerte${NBSP}: crème, beurre, citrons.`, quand: `il y a 3${NBSP}h` },
  ];
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0 text-base font-semibold text-[#111111]">5 nouvelles aujourd’hui</div>
        <span className="shrink-0 whitespace-nowrap rounded-lg bg-[#F5F5F5] px-3 py-1.5 text-xs font-semibold text-[#111111]">Tout marquer comme lu</span>
      </div>
      <div className="space-y-2">
        {alertes.map(({ Icone, teinte, titre, texte, quand }) => (
          <div key={titre} className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${teinte}`}>
              <Icone className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="truncate text-sm font-semibold text-[#111111]">{titre}</div>
                <span className="shrink-0 text-xs text-[#737373]">{quand}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-[#525252]">{texte}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MaquetteActualites() {
  // Exemples generiques et vrais : pas d'« arrete 2026 » ni de statistique
  // de recherche inventee (« +34 % sur Google ») comme dans la version d'avant.
  const actus = [
    { tag: 'Marché', teinte: 'bg-sky-50 text-sky-700', titre: `Saumon${NBSP}: prix en baisse cette semaine`, texte: `−8${NBSP}% par rapport à la semaine dernière chez vos fournisseurs.`, quand: 'Aujourd’hui' },
    { tag: 'Réglementation', teinte: 'bg-amber-50 text-amber-700', titre: `Allergènes${NBSP}: les 14 à signaler sur la carte`, texte: 'Vos fiches techniques indiquent déjà les allergènes de chaque plat.', quand: 'Hier' },
    { tag: 'Saison', teinte: 'bg-[#ECFDF5] text-[#047857]', titre: 'Courges et champignons en pleine saison', texte: `Souvent moins chers en ce moment${NBSP}: de bons candidats pour la carte.`, quand: 'Il y a 2 jours' },
  ];
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0 text-sm text-[#525252]">Sélectionnées pour votre restaurant</div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#047857]">3 nouvelles</span>
      </div>
      <div className="space-y-3">
        {actus.map((a) => (
          <div key={a.titre} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${a.teinte}`}>{a.tag}</span>
              <span className="text-xs text-[#737373]">{a.quand}</span>
            </div>
            <div className="text-sm font-semibold text-[#111111]">{a.titre}</div>
            <p className="mt-1 text-xs leading-relaxed text-[#525252]">{a.texte}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function TutorialsSection({ n }: { n: string }) {
  const [actif, setActif] = useState(0);
  const ecrans: { Icone: ComponentType<{ className?: string }>; titre: string; texte: string; Maquette: ComponentType }[] = [
    { Icone: Scale, titre: 'Balance connectée', texte: 'Pesez les ingrédients pendant le service.', Maquette: MaquetteBalance },
    { Icone: Truck, titre: 'Commandes fournisseurs', texte: 'L’assistant prépare, vous envoyez en un clic.', Maquette: MaquetteCommandes },
    { Icone: Sparkles, titre: 'Assistant IA', texte: '19 actions pour piloter votre cuisine.', Maquette: MaquetteAssistant },
    { Icone: Bell, titre: 'Alertes', texte: 'Hausses de prix, livraisons, suggestions.', Maquette: MaquetteAlertes },
    { Icone: Newspaper, titre: 'Actualités', texte: 'Marché, réglementation, saisons.', Maquette: MaquetteActualites },
  ];
  const { Icone: IconeActive, titre: titreActif, Maquette } = ecrans[actif];

  return (
    <section className={`${SECTION} bg-[#FAFAFA]`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Aperçu"
          titre={<>Le produit, <Vert>écran par écran.</Vert></>}
          intro="Cinq écrans de l’application, présentés avec des données d’exemple. Choisissez celui qui vous intéresse."
        />
        <div className="mt-10 grid items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div role="group" aria-label="Choisir un écran" className="flex flex-wrap gap-2 lg:order-2 lg:flex-col lg:flex-nowrap lg:gap-3">
            {ecrans.map(({ Icone, titre, texte }, i) => {
              const choisi = i === actif;
              return (
                <button
                  key={titre}
                  type="button"
                  aria-pressed={choisi}
                  onClick={() => setActif(i)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] lg:w-full lg:gap-3 lg:rounded-2xl lg:p-4 ${
                    choisi ? 'border-[#047857] bg-white' : 'border-[#E5E7EB] bg-white hover:border-[#A3A3A3]'
                  }`}
                >
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-lg lg:h-10 lg:w-10 lg:rounded-xl ${
                      choisi ? 'text-[#047857] lg:bg-[#047857] lg:text-white' : 'text-[#525252] lg:bg-[#F5F5F5] lg:text-[#111111]'
                    }`}
                  >
                    <Icone className="h-4 w-4 lg:h-5 lg:w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#111111]">{titre}</span>
                    <span className="mt-0.5 hidden text-xs leading-snug text-[#525252] lg:block">{texte}</span>
                  </span>
                </button>
              );
            })}
            <div className="mt-2 hidden lg:block">
              <Link to="/login?mode=register" className={`${BOUTON_PRINCIPAL} w-full`}>
                Essayer gratuitement <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white lg:order-1">
            <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-3">
              <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#111111]">
                <IconeActive className="h-4 w-4 shrink-0 text-[#047857]" />
                <span className="truncate">{titreActif}</span>
              </div>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-[#F5F5F5] px-2.5 py-1 text-xs text-[#525252]">Exemple</span>
            </div>
            <div className="p-5 sm:p-6 lg:min-h-[470px]">
              <Maquette />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIANCE
// ═══════════════════════════════════════════════════════════════════════════
// Avant : « Made in France — Hébergé en Europe » (faux : le site est heberge
// par Vercel Inc., aux Etats-Unis — mentions legales, article 4) et « Support
// 7j/7 — Réponse sous 24h » (engagement que rien ne garantit). Ne restent que
// des faits verifiables.
function TrustSection({ n }: { n: string }) {
  const garanties = [
    { Icone: ShieldCheck, titre: 'Connexion chiffrée', texte: 'HTTPS sur tout le site' },
    { Icone: FileCheck, titre: 'Vos données personnelles', texte: 'Accès, rectification et effacement sur simple demande (RGPD)' },
    { Icone: Mail, titre: 'Support par e-mail', texte: 'contact@restaumargin.fr', href: 'mailto:contact@restaumargin.fr' },
    { Icone: CreditCard, titre: 'Essai sans carte bancaire', texte: '7 jours gratuits' },
    { Icone: CalendarX, titre: 'Sans engagement', texte: 'Résiliable à tout moment' },
  ];
  return (
    <section className={`${SECTION} bg-white`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection n={n} label="Confiance" titre={<>Clair sur ce qui compte <Vert>avant de s’inscrire.</Vert></>} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 lg:gap-4">
          {garanties.map(({ Icone, titre, texte, href }) => (
            <li key={titre} className={`${CARTE} flex items-start gap-4 p-5 lg:flex-col lg:gap-3`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                <Icone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111111]">{titre}</p>
                {href ? (
                  <a href={href} className="mt-1 block break-words text-sm text-[#047857] hover:underline">
                    {texte}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-[#525252]">{texte}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-[#525252]">
          Hébergement, sous-traitants et durées de conservation sont détaillés dans la{' '}
          <Link to="/politique-confidentialite" className="font-semibold text-[#047857] hover:underline">
            politique de confidentialité
          </Link>{' '}
          et les{' '}
          <Link to="/mentions-legales" className="font-semibold text-[#047857] hover:underline">
            mentions légales
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// POUR QUI ? — maillage interne vers les pages par type d'etablissement
// (ajoute le 2026-05-26 pour la longue traine : bistrot, pizzeria, boulangerie,
// gastronomique).
// ═══════════════════════════════════════════════════════════════════════════
function SeoNicheSection({ n }: { n: string }) {
  const niches = [
    // Food cost et marge brute se completent a 100 % : 28-32 % <-> 68-72 %
    // (la version d'avant annoncait 65-70 % de marge pour 28-32 % de food cost).
    { to: '/logiciel-marge-bistrot', label: 'Bistrot', desc: `Food cost de 28 à 32${NBSP}%, soit une marge brute de 68 à 72${NBSP}%.` },
    { to: '/logiciel-marge-pizzeria', label: 'Pizzeria', desc: 'Coût de la pâte, des garnitures et des commissions de livraison.' },
    { to: '/logiciel-marge-boulangerie', label: 'Boulangerie', desc: 'Coût de la farine, pertes sur invendus, marge des viennoiseries.' },
    { to: '/logiciel-marge-gastronomique', label: 'Gastronomique', desc: `Produits nobles, food cost de 32 à 40${NBSP}%, cave haut de gamme.` },
  ];
  return (
    <section className={`${SECTION} bg-[#FAFAFA]`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Pour qui"
          titre={<>Un <Vert>logiciel marge restaurant</Vert> pensé pour votre métier.</>}
          intro={`Bistrot, pizzeria, boulangerie ou restaurant gastronomique${NBSP}: objectifs de food cost, fournisseurs et marges ne sont pas les mêmes.`}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {niches.map((x) => (
            <Link
              key={x.to}
              to={x.to}
              className={`${CARTE} group flex flex-col p-6 transition-colors hover:border-[#047857] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#111111]">{x.label}</h3>
                <ArrowUpRight className="h-4 w-4 text-[#047857] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#525252]">{x.desc}</p>
              <span className="mt-auto pt-4 text-sm font-semibold text-[#047857]">Voir la page</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARATIFS (ajoute le 2026-05-26 pour les requetes « alternative à X »)
// ═══════════════════════════════════════════════════════════════════════════
// Chaque ligne dit ce que fait l'autre outil et ce que fait RestauMargin, comme
// les pages comparatives elles-memes : RestauMargin ne remplace ni une caisse ni
// un outil de reservation (l'ancien texte promettait « remplace ou complète » et
// « Réservations + marges en une plateforme »).
function SeoAlternativesSection({ n }: { n: string }) {
  const alternatives = [
    { to: '/alternative-zenchef', label: 'Zenchef', desc: `Zenchef gère les réservations${NBSP}; RestauMargin, les marges et le food cost.` },
    { to: '/alternative-innovorder', label: 'Innovorder', desc: `Innovorder gère la caisse et la commande en ligne${NBSP}; RestauMargin, les marges.` },
    { to: '/alternative-hubrise', label: 'Hubrise', desc: `Hubrise relie les plateformes de livraison${NBSP}; RestauMargin calcule ce qu’il vous reste.` },
    { to: '/alternative-lightspeed', label: 'Lightspeed', desc: `Lightspeed gère l’encaissement${NBSP}; RestauMargin, le coût de chaque plat.` },
  ];
  return (
    <section className={`${SECTION} bg-white`}>
      <div className="mx-auto max-w-7xl">
        <EnTeteSection
          n={n}
          label="Comparatifs"
          titre={<><Vert>Alternatives</Vert> à Zenchef, Innovorder, Hubrise et Lightspeed.</>}
          intro={`Ces outils gèrent la réservation, la caisse ou les commandes${NBSP}; RestauMargin s’occupe des marges et les complète. Comparez les fonctions et les prix.`}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {alternatives.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 transition-colors hover:border-[#047857] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#111111]">{a.label}</h3>
                <ArrowUpRight className="h-4 w-4 text-[#047857] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#525252]">{a.desc}</p>
              <span className="mt-auto pt-4 text-sm font-semibold text-[#047857]">Voir le comparatif</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMARRER
// ═══════════════════════════════════════════════════════════════════════════
// La carte de droite affichait « Économies ce mois 479,00 € ↗ +12 % » et une
// « Marge moyenne 4,8 % / +0,0 % » : un resultat sans source, et un chiffre
// casse. Elle resume desormais les conditions de l'essai, verifiables en un clic.
function FinalCtaSection({ n }: { n: string }) {
  const conditions = [
    { l: 'Essai gratuit', v: '7 jours' },
    { l: 'Carte bancaire', v: 'Non demandée' },
    { l: 'Fiches techniques', v: 'Illimitées' },
    { l: 'Ensuite', v: `${euros(ABONNEMENT_PRO)} par mois (Pro)` },
    { l: 'Engagement', v: 'Aucun' },
  ];
  return (
    <section className={`${SECTION} bg-[#FAFAFA]`}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionNumber n={n} label="Démarrer" />
          <h2 className={TITRE_H2}>
            Testez RestauMargin <Vert>sur votre propre carte.</Vert>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#525252] sm:text-lg">
            Ajoutez vos ingrédients et vos plats{NBSP}: la marge de chaque plat s’affiche dès la première fiche technique.
          </p>
          <Link to="/login?mode=register" className={`${BOUTON_PRINCIPAL} mt-8`}>
            Commencer l’essai gratuit <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-sm text-[#525252]">Sans carte bancaire · Sans engagement</p>
        </div>
        <dl className={`${CARTE} divide-y divide-[#E5E7EB] rounded-3xl px-6 sm:px-8`}>
          {conditions.map((c) => (
            <div key={c.l} className="flex items-baseline justify-between gap-6 py-4">
              <dt className="text-sm text-[#525252]">{c.l}</dt>
              <dd className="text-right text-base font-semibold text-[#111111]">{c.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LETTRE D'INFORMATION
// ═══════════════════════════════════════════════════════════════════════════
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Échec de l’inscription. Réessayez.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={`${SECTION} bg-white`}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-satoshi text-2xl font-extrabold tracking-tight text-[#111111] sm:text-3xl">Restez informé</h2>
        <p className="mt-3 text-base text-[#525252]">
          Nos conseils sur les marges, l’actualité des fournisseurs et les nouveautés du produit, par e-mail.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-8">
            <Check className="mx-auto mb-3 h-10 w-10 text-[#047857]" strokeWidth={3} aria-hidden="true" />
            <p className="text-lg font-semibold text-[#111111]">Merci{NBSP}!</p>
            <p className="mt-1 text-sm text-[#525252]">Votre inscription est enregistrée.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="lettre-email" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="lettre-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@restaurant.fr"
                className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="whitespace-nowrap rounded-xl bg-[#047857] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#065F46] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Inscription…' : 'S’inscrire'}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-[#B91C1C]">{error}</p>}
            <p className="mt-3 text-xs text-[#737373]">Désinscription en un clic, à tout moment.</p>
          </form>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════════════════
function ContactSection() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Échec de l’envoi. Réessayez.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  const champ =
    'w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#111111] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-1';

  return (
    <section id="contact" className={`${SECTION} scroll-mt-20 bg-[#FAFAFA]`}>
      <div className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">Contact</p>
          <h2 className="font-satoshi text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">Parlons de votre projet</h2>
          <p className="mt-3 text-[#525252]">Une question, une démonstration{NBSP}? Écrivez-nous, nous vous répondons par e-mail.</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-8 text-center">
            <Check className="mx-auto mb-4 h-12 w-12 text-[#047857]" strokeWidth={3} aria-hidden="true" />
            <p className="text-lg font-semibold text-[#111111]">Demande envoyée{NBSP}!</p>
            <p className="mt-1 text-sm text-[#525252]">Nous vous répondons par e-mail.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className={`${CARTE} space-y-5 p-6 sm:p-8`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-nom" className="mb-1.5 block text-sm font-medium text-[#111111]">Nom</label>
                <input
                  id="contact-nom"
                  type="text"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className={champ}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[#111111]">E-mail</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={champ}
                  placeholder="vous@restaurant.fr"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-telephone" className="mb-1.5 block text-sm font-medium text-[#111111]">
                Téléphone <span className="font-normal text-[#737373]">(facultatif)</span>
              </label>
              <input
                id="contact-telephone"
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className={champ}
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[#111111]">Message</label>
              <textarea
                id="contact-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${champ} resize-none`}
                placeholder="Décrivez votre besoin…"
              />
            </div>
            {error && (
              <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#047857] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#065F46] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Envoi en cours…' : <>Envoyer <Send className="h-4 w-4" aria-hidden="true" /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BARRE D'APPEL A L'ACTION (mobile)
// ═══════════════════════════════════════════════════════════════════════════
// Fond uni, sans lueur animee en boucle. Elle se place a GAUCHE de la bulle de
// l'assistant (AssistantWidget : 56 px, fixed right-4 / sm:right-6, z-50) — avant,
// elle courait sur toute la largeur et passait sous la bulle — et remonte comme
// elle au-dessus du bandeau cookies (--cookie-banner-h, publiee par CookieBanner).
function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const surDefilement = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);
  return (
    <div
      className={`fixed left-4 right-[88px] z-40 transition-transform duration-300 sm:left-6 sm:right-[100px] lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-[200%]'
      }`}
      style={{ bottom: 'calc(1rem + var(--cookie-banner-h, 0px))' }}
      aria-hidden={!visible}
    >
      <Link
        to="/login?mode=register"
        tabIndex={visible ? undefined : -1}
        className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#047857] px-5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-[#065F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2"
      >
        Essai gratuit 7 jours <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr', logo: 'https://www.restaumargin.fr/og-image.png' },
      { '@type': 'SoftwareApplication', name: 'RestauMargin', applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS, Android', offers: { '@type': 'Offer', price: '29', priceCurrency: 'EUR' } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Landing() {
  // Numerotation continue : la section temoignages ne prend un numero (et ne
  // decale les suivantes) que si elle s'affiche.
  const decalage = testimonials.length > 0 ? 1 : 0;
  const num = (i: number) => String(i).padStart(2, '0');

  return (
    <>
      <SEOHead
        title="Logiciel marge restaurant + food cost IA | RestauMargin (29€/mois)"
        description="RestauMargin, logiciel SaaS pour calculer la marge de votre restaurant, optimiser le food cost et automatiser les fiches techniques. Essai gratuit 7 jours."
        path="/"
      />
      <StructuredData />

      <div className="min-h-screen bg-white">
        <PublicHeader />
        <main>
          <HeroSection />
          <SimulationSection n={num(1)} />
          <PricingSection n={num(2)} />
          <FeaturesSection n={num(3)} />
          <ProcessSection n={num(4)} />
          <TestimonialsSection n={num(5)} />
          <TutorialsSection n={num(5 + decalage)} />
          <TrustSection n={num(6 + decalage)} />
          <SeoNicheSection n={num(7 + decalage)} />
          <SeoAlternativesSection n={num(8 + decalage)} />
          <FinalCtaSection n={num(9 + decalage)} />
          <NewsletterSection />
          <ContactSection />
        </main>
        <PublicFooter />
      </div>

      <StickyCtaBar />
    </>
  );
}
