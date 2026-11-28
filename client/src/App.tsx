import { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import CookieBanner from './components/CookieBanner';
import { captureLandingSource } from './utils/signupSource';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { CollaborationProvider } from './hooks/useCollaboration';
import { RestaurantProvider } from './hooks/useRestaurant';
import { lazyRetry } from './utils/lazyRetry';

// Perf 2026-11-14 : sortis du chunk d'entree (~66 Ko de source) que paie chaque visiteur
// d'article. NotificationCenter ne sert qu'a l'espace connecte (AppLayout) ; AssistantWidget
// est un bouton en position fixe, son arrivee differee ne decale rien (CLS nul).
//
// Perf/SEO 2026-11-28 : la coquille de l'espace connecte part dans son propre chunk (voir AppLayout.tsx).
const AppLayout = lazyRetry(() => import('./AppLayout'));
const AssistantWidget = lazyRetry(() => import('./components/AssistantWidget'));

import PublicNotFound from './pages/PublicNotFound';

// Login is lazy-loaded: it renders only on /login, but was previously bundled
// eagerly into the critical `index` chunk that EVERY public/SEO page (landing,
// /blog/*, /pricing…) downloads before first paint. It pulls in a heavy WebGL
// PaperFoldBackground; splitting it out shrinks the critical path for SEO pages.
// Returning users hit /login with a token and get auto-redirected anyway.
const Login = lazyRetry(() => import('./pages/Login'));

// Public marketing pages — lazy loaded to keep initial bundle small.
// Landing.tsx (2341 lines + GSAP) and StationLanding etc. are heavy and not always
// the first page users see (we have many entry points : /blog, /pricing, /launch, etc.).
// Loading them lazily reduces critical path JS by ~80 KB gzip.
const Landing = lazyRetry(() => import('./pages/Landing'));
const StationLanding = lazyRetry(() => import('./pages/StationLanding'));
const PublicMenu = lazyRetry(() => import('./pages/PublicMenu'));

// Lazy-loaded heavy components (kept out of main bundle)
// Gamification is only needed on /mon-score — lazy it.

// App-shell chrome (overlays / status bars / modals) — rendered only inside AppLayout
// (authenticated routes). Lazy-loaded so they stay OUT of the critical `index` chunk that
// every public/SEO page (landing, /blog/*, /pricing…) downloads before first paint.
// All render sites are wrapped in <Suspense fallback={null}> (invisible chrome pop-in).
const MobileBottomNav = lazyRetry(() => import('./components/MobileBottomNav'));

// Lazy-loaded pages for code splitting
const WeighStation = lazyRetry(() => import('./pages/WeighStation'));
const DevCorp = lazyRetry(() => import('./pages/DevCorp'));
const MentionsLegales = lazyRetry(() => import('./pages/MentionsLegales'));
const CGV = lazyRetry(() => import('./pages/CGV'));
const PolitiqueConfidentialite = lazyRetry(() => import('./pages/PolitiqueConfidentialite'));
const CGU = lazyRetry(() => import('./pages/CGU'));
const Pricing = lazyRetry(() => import('./pages/Pricing'));
const ResetPassword = lazyRetry(() => import('./pages/ResetPassword'));
const FoodCostCalculator = lazyRetry(() => import('./pages/FoodCostCalculator'));
const CalculateurMargeRestaurant = lazyRetry(() => import('./pages/CalculateurMargeRestaurant'));
const LaunchPH = lazyRetry(() => import('./pages/LaunchPH'));
const BlogCalcMarge = lazyRetry(() => import('./pages/BlogCalcMarge'));
const BlogFAQMargeRestaurant = lazyRetry(() => import('./pages/BlogFAQMargeRestaurant'));
const BlogMargeBeneficiaireRestaurant = lazyRetry(() => import('./pages/BlogMargeBeneficiaireRestaurant'));
const AlternativeInnovorder = lazyRetry(() => import('./pages/AlternativeInnovorder'));
const BlogPrixDeVente = lazyRetry(() => import('./pages/BlogPrixDeVente'));
const LogicielMargeRestaurant = lazyRetry(() => import('./pages/LogicielMargeRestaurant'));
const LogicielMargeBistrot = lazyRetry(() => import('./pages/LogicielMargeBistrot'));
const LogicielMargeDarkKitchen = lazyRetry(() => import('./pages/LogicielMargeDarkKitchen'));
// Pages Fonctionnalités (8 modules détaillés + index)
const FonctionnalitesIndex = lazyRetry(() => import('./pages/FonctionnalitesIndex'));
const FonctionnaliteCommandesFournisseurs = lazyRetry(() => import('./pages/FonctionnaliteCommandesFournisseurs'));
const FonctionnaliteIACuisine = lazyRetry(() => import('./pages/FonctionnaliteIACuisine'));
const FonctionnaliteFichesTechniques = lazyRetry(() => import('./pages/FonctionnaliteFichesTechniques'));
const FonctionnaliteMercuriale = lazyRetry(() => import('./pages/FonctionnaliteMercuriale'));
const FonctionnalitePesageBluetooth = lazyRetry(() => import('./pages/FonctionnalitePesageBluetooth'));
const FonctionnaliteHACCP = lazyRetry(() => import('./pages/FonctionnaliteHACCP'));
const FonctionnaliteOCRFactures = lazyRetry(() => import('./pages/FonctionnaliteOCRFactures'));
const FonctionnaliteMenuEngineering = lazyRetry(() => import('./pages/FonctionnaliteMenuEngineering'));
const LogicielMargeGastronomique = lazyRetry(() => import('./pages/LogicielMargeGastronomique'));
const LogicielMargeFoodTruck = lazyRetry(() => import('./pages/LogicielMargeFoodTruck'));
const LogicielMargePizzeria = lazyRetry(() => import('./pages/LogicielMargePizzeria'));
const LogicielMargeSushi = lazyRetry(() => import('./pages/LogicielMargeSushi'));
const LogicielMargeSaladBar = lazyRetry(() => import('./pages/LogicielMargeSaladBar'));
const LogicielMargeCreperie = lazyRetry(() => import('./pages/LogicielMargeCreperie'));
const LogicielMargeBurger = lazyRetry(() => import('./pages/LogicielMargeBurger'));
const LogicielMargeKebab = lazyRetry(() => import('./pages/LogicielMargeKebab'));
const LogicielMargeTraiteur = lazyRetry(() => import('./pages/LogicielMargeTraiteur'));
const LogicielMargeItalien = lazyRetry(() => import('./pages/LogicielMargeItalien'));
const LogicielMargeIndien = lazyRetry(() => import('./pages/LogicielMargeIndien'));
const BlogIndex = lazyRetry(() => import('./pages/BlogIndex'));
const APropos = lazyRetry(() => import('./pages/APropos'));
const NicheLanding = lazyRetry(() => import('./pages/NicheLanding'));
const QRCodeGenerator = lazyRetry(() => import('./pages/QRCodeGenerator'));
const PublicFeedback = lazyRetry(() => import('./pages/PublicFeedback'));
const PublicRecipe = lazyRetry(() => import('./pages/PublicRecipe'));
const Temoignages = lazyRetry(() => import('./pages/Temoignages'));
const Demo = lazyRetry(() => import('./pages/Demo'));
const BlogCoefficient = lazyRetry(() => import('./pages/BlogCoefficient'));
const BlogFoodCost = lazyRetry(() => import('./pages/BlogFoodCost'));
const BlogTvaRestaurant = lazyRetry(() => import('./pages/BlogTvaRestaurant'));
const BlogMargeBoissons = lazyRetry(() => import('./pages/BlogMargeBoissons'));
const BlogIA = lazyRetry(() => import('./pages/BlogIA'));
const BlogGaspillage = lazyRetry(() => import('./pages/BlogGaspillage'));
const BlogHACCP = lazyRetry(() => import('./pages/BlogHACCP'));
const BlogFicheTechnique = lazyRetry(() => import('./pages/BlogFicheTechnique'));
const BlogKpiRestaurateur = lazyRetry(() => import('./pages/BlogKpiRestaurateur'));
const BlogCoutPersonnel = lazyRetry(() => import('./pages/BlogCoutPersonnel'));
const BlogFifoLifo = lazyRetry(() => import('./pages/BlogFifoLifo'));
const BlogSeuilRentabilite = lazyRetry(() => import('./pages/BlogSeuilRentabilite'));
const BlogKpiGuide = lazyRetry(() => import('./pages/BlogKpiGuide'));
const BlogLogicielCaisse = lazyRetry(() => import('./pages/BlogLogicielCaisse'));
const BlogGestionTresorerie = lazyRetry(() => import('./pages/BlogGestionTresorerie'));
const BlogMethodeFifo = lazyRetry(() => import('./pages/BlogMethodeFifo'));
const BlogMenuEngineering = lazyRetry(() => import('./pages/BlogMenuEngineering'));
const BlogOuvrirRestaurant = lazyRetry(() => import('./pages/BlogOuvrirRestaurant'));
const BlogPrimeCost = lazyRetry(() => import('./pages/BlogPrimeCost'));
const BlogTauxMarque = lazyRetry(() => import('./pages/BlogTauxMarque'));
const BlogRegle30303010 = lazyRetry(() => import('./pages/BlogRegle30303010'));
const BlogTauxOccupation = lazyRetry(() => import('./pages/BlogTauxOccupation'));
const BlogTicketMoyen = lazyRetry(() => import('./pages/BlogTicketMoyen'));
const BlogInventaire = lazyRetry(() => import('./pages/BlogInventaire'));
const BlogPrixCarte = lazyRetry(() => import('./pages/BlogPrixCarte'));
const BlogChargesSociales = lazyRetry(() => import('./pages/BlogChargesSociales'));
const BlogPourboiresRestaurant = lazyRetry(() => import('./pages/BlogPourboiresRestaurant'));
const BlogCoutRevient = lazyRetry(() => import('./pages/BlogCoutRevient'));
const BlogLogicielGestion = lazyRetry(() => import('./pages/BlogLogicielGestion'));
const BlogRotationStocks = lazyRetry(() => import('./pages/BlogRotationStocks'));
const BlogBudgetPrevisionnel = lazyRetry(() => import('./pages/BlogBudgetPrevisionnel'));
const BlogSalaireProprietaireRestaurant = lazyRetry(() => import('./pages/BlogSalaireProprietaireRestaurant'));
const BlogPrixVenteMenu = lazyRetry(() => import('./pages/BlogPrixVenteMenu'));
const BlogPrevisionVentes = lazyRetry(() => import('./pages/BlogPrevisionVentes'));
const BlogFormationPersonnel = lazyRetry(() => import('./pages/BlogFormationPersonnel'));
const BlogStrategieDigitale = lazyRetry(() => import('./pages/BlogStrategieDigitale'));
const BlogChiffreAffaires = lazyRetry(() => import('./pages/BlogChiffreAffaires'));
const BlogCalendrierHaccp = lazyRetry(() => import('./pages/BlogCalendrierHaccp'));
const BlogLivraisonRentabilite = lazyRetry(() => import('./pages/BlogLivraisonRentabilite'));
const BlogFoodTruck = lazyRetry(() => import('./pages/BlogFoodTruck'));
const BlogContratTravail = lazyRetry(() => import('./pages/BlogContratTravail'));
const BlogEnergieRestaurant = lazyRetry(() => import('./pages/BlogEnergieRestaurant'));
const BlogAllergenes = lazyRetry(() => import('./pages/BlogAllergenes'));
const BlogFideliserClients = lazyRetry(() => import('./pages/BlogFideliserClients'));
const BlogCarteVins = lazyRetry(() => import('./pages/BlogCarteVins'));
const BlogPlatPlusRentable = lazyRetry(() => import('./pages/BlogPlatPlusRentable'));
const Blog5RatiosCles = lazyRetry(() => import('./pages/Blog5RatiosCles'));
const BlogPsychologiePrix = lazyRetry(() => import('./pages/BlogPsychologiePrix'));
const BlogOuvrirTerrasseRestaurant = lazyRetry(() => import('./pages/BlogOuvrirTerrasseRestaurant'));
const BlogNegocierFournisseurs = lazyRetry(() => import('./pages/BlogNegocierFournisseurs'));
const BlogRepriseRestaurant = lazyRetry(() => import('./pages/BlogRepriseRestaurant'));
const BlogGoogleMyBusiness = lazyRetry(() => import('./pages/BlogGoogleMyBusiness'));
const BlogTvaRestaurationTaux = lazyRetry(() => import('./pages/BlogTvaRestaurationTaux'));
const BlogLicenceIV = lazyRetry(() => import('./pages/BlogLicenceIV'));
const BlogAvisGoogleNegatifs = lazyRetry(() => import('./pages/BlogAvisGoogleNegatifs'));
const BlogNoShowRestaurant = lazyRetry(() => import('./pages/BlogNoShowRestaurant'));
const BlogBrigadeCuisine = lazyRetry(() => import('./pages/BlogBrigadeCuisine'));
const BlogLogicielReservation = lazyRetry(() => import('./pages/BlogLogicielReservation'));
const Careers = lazyRetry(() => import('./pages/Careers'));
const AlternativeHubrise = lazyRetry(() => import('./pages/AlternativeHubrise'));
const AlternativeZenchef = lazyRetry(() => import('./pages/AlternativeZenchef'));
const AlternativeLAddition = lazyRetry(() => import('./pages/AlternativeLAddition'));
const AlternativeLightspeed = lazyRetry(() => import('./pages/AlternativeLightspeed'));
const AlternativeInpulse = lazyRetry(() => import('./pages/AlternativeInpulse'));
const AlternativeTheFork = lazyRetry(() => import('./pages/AlternativeTheFork'));
const AlternativeCosKitchen = lazyRetry(() => import('./pages/AlternativeCosKitchen'));
const AlternativeMargeBrut = lazyRetry(() => import('./pages/AlternativeMargeBrut'));
const ComparatifLogicielsRestaurant = lazyRetry(() => import('./pages/ComparatifLogicielsRestaurant'));
const ComparatifRestauMarginZenchef = lazyRetry(() => import('./pages/ComparatifRestauMarginZenchef'));
const LogicielMargeBoulangerie = lazyRetry(() => import('./pages/LogicielMargeBoulangerie'));
const LogicielMargeGlacier = lazyRetry(() => import('./pages/LogicielMargeGlacier'));
const LogicielMargeCafeBar = lazyRetry(() => import('./pages/LogicielMargeCafeBar'));
const GlossaireRestauration = lazyRetry(() => import('./pages/GlossaireRestauration'));
const BlogPourquoiPasRentable = lazyRetry(() => import('./pages/BlogPourquoiPasRentable'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#9CA3AF] dark:text-mono-500">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}


// Premier segment des routes de l'application (bloc <Routes> d'AppLayout), releve le 2026-11-04.
// A tenir a jour quand une page de l'application est ajoutee : sinon, un visiteur deconnecte
// qui suit un lien vers elle verra « page introuvable » au lieu de la page de connexion.
const SEGMENTS_APPLICATION = new Set([
  'abonnement', 'actualites', 'admin', 'aide', 'allergen-matrix', 'analytics', 'assistant', 'bon-cadeau',
  'calculateur-tva', 'checklist-service', 'chrono-preparation', 'clients', 'commandes', 'comptabilite',
  'cout-couvert', 'cout-main-oeuvre', 'couverts-cible', 'dashboard', 'devis', 'dlc-tracker', 'email-marketing',
  'feedback', 'financial-intelligence', 'fournisseur', 'gaspillage', 'haccp', 'ingredients', 'integrations',
  'inventory', 'kitchen-mode', 'marketplace', 'menu', 'menu-calendar', 'menu-engineering', 'mercuriale',
  'mes-parrainages', 'messagerie', 'mon-score', 'negociation-ia', 'planning', 'prime-saisonniere', 'qr-menu',
  'reactivation', 'recettes-semaine', 'recipes', 'rentabilite', 'restaurants', 'rfqs', 'roi-equipement',
  'saisonnalite', 'scanner-factures', 'seminaires', 'service-tracker', 'settings', 'simulateur-prix',
  'suppliers', 'users',
]);

// Adresse inconnue et visiteur non connecte : vraie page « introuvable » (2026-11-04).
// Avant, tout tombait dans la route protegee et renvoyait vers la page de connexion.
function RouteApplicationOuIntrouvable() {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();
  const segment = pathname.split('/')[1] || '';
  if (!isLoading && !isAuthenticated && !SEGMENTS_APPLICATION.has(segment)) return <PublicNotFound />;
  return (
    <ProtectedRoute>
      <CollaborationProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#9CA3AF] dark:text-mono-500">Chargement...</div>}>
          <AppLayout />
        </Suspense>
      </CollaborationProvider>
    </ProtectedRoute>
  );
}

function PublicHome() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#9CA3AF] dark:text-mono-500">Chargement...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#9CA3AF] dark:text-mono-500">Chargement...</div>}>
      <Landing />
    </Suspense>
  );
}

function App() {
  // Capture utm + referrer + landing_path au tout 1er load (pour signup tracking).
  // Idempotent : ne re-capture pas si déjà fait.
  useEffect(() => { captureLandingSource(); }, []);
  return (
    <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <RestaurantProvider>
          <Routes>
            <Route path="/" element={<PublicHome />} />
          <Route path="/landing" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}><Landing /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>}><Login /></Suspense>} />
          <Route path="/menu-public" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}><PublicMenu /></Suspense>} />
          <Route path="/feedback/:id" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-mono-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-mono-100 dark:text-white" /></div>}><PublicFeedback /></Suspense>} />
          <Route path="/r/:token" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-mono-100" /></div>}><PublicRecipe /></Suspense>} />
          <Route path="/station-produit" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}><StationLanding /></Suspense>} />
          <Route path="/dev-corp" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><DevCorp /></Suspense>} />
          <Route path="/mentions-legales" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><MentionsLegales /></Suspense>} />
          <Route path="/cgv" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><CGV /></Suspense>} />
          <Route path="/cgu" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><CGU /></Suspense>} />
          <Route path="/politique-confidentialite" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><PolitiqueConfidentialite /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><Pricing /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><ResetPassword /></Suspense>} />
          <Route path="/outils/calculateur-food-cost" element={<Suspense fallback={<div className="min-h-screen bg-[#f8fafb] flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><FoodCostCalculator /></Suspense>} />
          <Route path="/outils/calculateur-marge-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><CalculateurMargeRestaurant /></Suspense>} />
          <Route path="/launch" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><LaunchPH /></Suspense>} />
          <Route path="/outils/generateur-qr-menu" element={<Suspense fallback={<div className="min-h-screen bg-[#f8fafb] flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><QRCodeGenerator /></Suspense>} />
          <Route path="/blog" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogIndex /></Suspense>} />
          <Route path="/guide-marge/:slug" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><NicheLanding /></Suspense>} />
          <Route path="/a-propos" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><APropos /></Suspense>} />
          <Route path="/carrieres" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><Careers /></Suspense>} />
          <Route path="/blog/calcul-marge-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCalcMarge /></Suspense>} />
          {/* SEO mega-FAQ 2026-05-26 : domination People Also Ask Google sur "marge restaurant" (25 questions + Schema FAQPage massif). */}
          <Route path="/blog/faq-marge-restaurant-25-questions" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFAQMargeRestaurant /></Suspense>} />
          {/* SEO PAA 2026-05-26 : nouvel article cible 4 questions PAA Google "marge beneficiaire restaurant ideale", "4% bon", "50% excessive", "que signifie 50%". */}
          <Route path="/blog/marge-beneficiaire-restaurant-ideal" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogMargeBeneficiaireRestaurant /></Suspense>} />
          <Route path="/alternative-innovorder" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeInnovorder /></Suspense>} />
          {/* Pages Fonctionnalités (8 modules détaillés + hub index) — 2026-05-28 */}
          <Route path="/fonctionnalites" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnalitesIndex /></Suspense>} />
          <Route path="/fonctionnalites/commandes-fournisseurs" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteCommandesFournisseurs /></Suspense>} />
          <Route path="/fonctionnalites/ia-cuisine" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteIACuisine /></Suspense>} />
          <Route path="/fonctionnalites/fiches-techniques" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteFichesTechniques /></Suspense>} />
          <Route path="/fonctionnalites/mercuriale-alertes-prix" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteMercuriale /></Suspense>} />
          <Route path="/fonctionnalites/pesage-bluetooth" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnalitePesageBluetooth /></Suspense>} />
          <Route path="/fonctionnalites/haccp-digital" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteHACCP /></Suspense>} />
          <Route path="/fonctionnalites/ocr-factures" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteOCRFactures /></Suspense>} />
          <Route path="/fonctionnalites/menu-engineering" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><FonctionnaliteMenuEngineering /></Suspense>} />
          {/* FIX 2026-04-28 (audit cohérence) : pages orphelines BlogPrixDeVente + LogicielMargeRestaurant restaurées (SEO). */}
          <Route path="/blog/prix-de-vente-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPrixDeVente /></Suspense>} />
          <Route path="/logiciel-marge-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeRestaurant /></Suspense>} />
          <Route path="/logiciel-marge-bistrot" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeBistrot /></Suspense>} />
          <Route path="/logiciel-marge-dark-kitchen" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeDarkKitchen /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Restaurant Gastronomique (mots-cles etoile, food cost 32-40%, produits nobles, cave premium). */}
          <Route path="/logiciel-marge-gastronomique" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}><LogicielMargeGastronomique /></Suspense>} />
          <Route path="/logiciel-marge-food-truck" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeFoodTruck /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Pizzeria (mots-cles food cost pizza, marge pizzeria, commissions livraison). */}
          <Route path="/logiciel-marge-pizzeria" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargePizzeria /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Sushi Japonais (mots-cles food cost saumon thon, marge sushi, perte poisson 24h). */}
          <Route path="/logiciel-marge-sushi" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-rose-500 animate-spin" /></div>}><LogicielMargeSushi /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Salad Bar Healthy (mots-cles marge salad bar, food cost poke bowl, rentabilite bowl healthy, marche 1.4Md +12%/an). */}
          <Route path="/logiciel-marge-salad-bar" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}><LogicielMargeSaladBar /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Creperie (mots-cles marge creperie, food cost galettes, rentabilite creperie, creperie bretagne). */}
          <Route path="/logiciel-marge-creperie" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeCreperie /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Burger fast casual (mots-cles food cost smash burger, marge burger restaurant, productivite flat top, market burger France 1.6Md). */}
          <Route path="/logiciel-marge-burger" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}><LogicielMargeBurger /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Kebab Doner sandwicherie (mots-cles food cost kebab, marge sandwich shop, broche veau-agneau, market kebab France 3Md). */}
          <Route path="/logiciel-marge-kebab" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}><LogicielMargeKebab /></Suspense>} />
          {/* SEO niche 2026-05-28 : page Logiciel Marge Traiteur evenementiel (mots-cles marge traiteur, food cost traiteur, devis traiteur, cout prestation, main d'oeuvre evenementielle). */}
          <Route path="/logiciel-marge-traiteur" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeTraiteur /></Suspense>} />
          {/* SEO niche 2026-06-04 : page Logiciel Marge Restaurant Italien / trattoria (mots-cles marge restaurant italien, food cost pates 8-18%, coefficient italien, levier vins italiens, menu mix antipasti/primi/secondi). Distinct de la page pizzeria. */}
          <Route path="/logiciel-marge-restaurant-italien" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeItalien /></Suspense>} />
          {/* SEO niche 2026-07-16 : page Logiciel Marge Restaurant Indien (mots-cles marge restaurant indien, food cost curry 9-32%, coefficient indien, sauce de base gravy, levier boissons biere/lassi/chai, menu mix vegetarien/viande/riz). Structure staples cheap (riz/dal/naan) vs proteines cheres (agneau/gambas), miroir de la page italien. */}
          <Route path="/logiciel-marge-restaurant-indien" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><LogicielMargeIndien /></Suspense>} />
          {/* SEO niche 2026-05-26 : Logiciel Marge Boulangerie + Alternative Zenchef (comparatif concurrent). */}
          <Route path="/logiciel-marge-boulangerie" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}><LogicielMargeBoulangerie /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Cafe / Bar / Brasserie de quartier (mots-cles marge bar, coefficient boissons, marge brute boissons 80-85 %, market cafe-bar France 40 000 etablissements). */}
          <Route path="/logiciel-marge-cafe-bar" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}><LogicielMargeCafeBar /></Suspense>} />
          {/* SEO niche 2026-05-26 : page Logiciel Marge Glacier Salon de The (mots-cles food cost glace 18-25%, marge boules 80-90%, saisonnalite extreme 70% CA sur 5 mois, cout froid -18C). */}
          <Route path="/logiciel-marge-glacier" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>}><LogicielMargeGlacier /></Suspense>} />
          <Route path="/alternative-zenchef" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeZenchef /></Suspense>} />
          <Route path="/alternative-laddition" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeLAddition /></Suspense>} />
          {/* Route /temoignages RETIREE le 2026-09-24 — le fichier est conserve.
              La page publiait DOUZE temoignages nominatifs entierement inventes
              ("Thomas Renard, Le Comptoir de Tom, Paris 11e"), avec citations,
              gains chiffres ("+12% de marge") et une note de 4.8/5, alors
              qu'aucun avis client n'a jamais ete collecte. Publier de faux avis de
              consommateurs est une pratique commerciale trompeuse (Code de la
              consommation, art. L121-2 et suivants) : ce n'est pas un exces de
              marketing, c'est un risque juridique reel, aggrave par le fait que la
              page etait indexee (sitemap + robots Allow + prerendu).
              Le composant Temoignages.tsx reste dans le depot : rebrancher cette
              route le jour ou de VRAIS temoignages, obtenus et autorises, pourront
              y figurer. */}
          <Route path="/demo" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><Demo /></Suspense>} />
          <Route path="/blog/coefficient-multiplicateur" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCoefficient /></Suspense>} />
          <Route path="/blog/reduire-food-cost" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFoodCost /></Suspense>} />
          <Route path="/blog/tva-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogTvaRestaurant /></Suspense>} />
          <Route path="/blog/marge-boissons-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogMargeBoissons /></Suspense>} />
          <Route path="/blog/ia-restauration" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogIA /></Suspense>} />
          <Route path="/blog/gaspillage-alimentaire" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogGaspillage /></Suspense>} />
          <Route path="/blog/haccp-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogHACCP /></Suspense>} />
          <Route path="/blog/fiche-technique-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFicheTechnique /></Suspense>} />
          <Route path="/blog/kpi-essentiels-restaurateur" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogKpiRestaurateur /></Suspense>} />
          <Route path="/blog/reduire-cout-personnel-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCoutPersonnel /></Suspense>} />
          <Route path="/blog/fifo-lifo-stocks-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFifoLifo /></Suspense>} />
          <Route path="/blog/seuil-rentabilite-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogSeuilRentabilite /></Suspense>} />
          <Route path="/blog/menu-engineering-boston-matrix" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogMenuEngineering /></Suspense>} />
          <Route path="/blog/kpi-restaurateur" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogKpiGuide /></Suspense>} />
          <Route path="/blog/logiciel-caisse-enregistreuse-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogLogicielCaisse /></Suspense>} />
          <Route path="/blog/gestion-tresorerie-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogGestionTresorerie /></Suspense>} />
          <Route path="/blog/methode-fifo-gestion-stocks-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogMethodeFifo /></Suspense>} />
          {/* FIX 2026-04-28 (audit cohérence) : redirect canonical pour éviter duplicate content SEO.
              L'URL ...-restaurant pointait sur le même composant que le canonique. */}
          <Route path="/blog/menu-engineering-boston-matrix-restaurant" element={<Navigate to="/blog/menu-engineering-boston-matrix" replace />} />
          <Route path="/blog/comment-ouvrir-restaurant-guide-complet" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogOuvrirRestaurant /></Suspense>} />
          <Route path="/blog/prime-cost-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPrimeCost /></Suspense>} />
          <Route path="/blog/taux-de-marque-taux-de-marge" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogTauxMarque /></Suspense>} />
          <Route path="/blog/regle-30-30-30-10-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogRegle30303010 /></Suspense>} />
          <Route path="/blog/taux-occupation-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogTauxOccupation /></Suspense>} />
          <Route path="/blog/augmenter-ticket-moyen-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogTicketMoyen /></Suspense>} />
          <Route path="/blog/inventaire-restaurant-guide" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogInventaire /></Suspense>} />
          <Route path="/blog/fixer-prix-carte-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPrixCarte /></Suspense>} />
          <Route path="/blog/charges-sociales-restauration" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogChargesSociales /></Suspense>} />
          <Route path="/blog/pourboires-restaurant-legislation-fiscalite" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPourboiresRestaurant /></Suspense>} />
          <Route path="/blog/cout-revient-plat-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCoutRevient /></Suspense>} />
          <Route path="/blog/logiciel-gestion-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogLogicielGestion /></Suspense>} />
          <Route path="/blog/rotation-stocks-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogRotationStocks /></Suspense>} />
          <Route path="/blog/budget-previsionnel-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogBudgetPrevisionnel /></Suspense>} />
          <Route path="/blog/salaire-proprietaire-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogSalaireProprietaireRestaurant /></Suspense>} />
          <Route path="/blog/prevision-ventes-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPrevisionVentes /></Suspense>} />
          <Route path="/blog/formation-personnel-restauration" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFormationPersonnel /></Suspense>} />
          <Route path="/blog/strategie-digitale-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogStrategieDigitale /></Suspense>} />
          <Route path="/blog/chiffre-affaires-restaurant-comment-calculer" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogChiffreAffaires /></Suspense>} />
          <Route path="/blog/calendrier-haccp-restaurant-modele-gratuit" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCalendrierHaccp /></Suspense>} />
          <Route path="/blog/pourquoi-mon-restaurant-ne-rapporte-pas" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPourquoiPasRentable /></Suspense>} />
          <Route path="/blog/livraison-restaurant-rentabilite" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogLivraisonRentabilite /></Suspense>} />
          <Route path="/blog/ouvrir-food-truck-france-guide" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFoodTruck /></Suspense>} />
          <Route path="/blog/contrat-travail-restauration-guide" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogContratTravail /></Suspense>} />
          <Route path="/blog/reduire-facture-energie-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogEnergieRestaurant /></Suspense>} />
          <Route path="/blog/allergenes-restaurant-obligations-legales" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogAllergenes /></Suspense>} />
          <Route path="/blog/fideliser-clients-restaurant-strategies" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFideliserClients /></Suspense>} />
          <Route path="/blog/construire-carte-vins-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCarteVins /></Suspense>} />
          {/* SEO PAA 2026-05-26 : "Quels sont les 5 ratios cles en restauration ?" (food cost / prime cost / personnel / ticket moyen / occupation). */}
          <Route path="/blog/5-ratios-cles-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><Blog5RatiosCles /></Suspense>} />
          {/* PAA SEO 2026-05-26 : "Quel est le plat le plus rentable dans un restaurant ?" — top 15 + menu engineering. */}
          <Route path="/blog/plat-le-plus-rentable-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPlatPlusRentable /></Suspense>} />
          <Route path="/blog/psychologie-des-prix-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPsychologiePrix /></Suspense>} />
          <Route path="/blog/ouvrir-terrasse-restaurant-demarches" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogOuvrirTerrasseRestaurant /></Suspense>} />
          <Route path="/blog/negocier-fournisseurs-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogNegocierFournisseurs /></Suspense>} />
          <Route path="/blog/reprise-restaurant-guide-acheteur" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogRepriseRestaurant /></Suspense>} />
          <Route path="/blog/google-my-business-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogGoogleMyBusiness /></Suspense>} />
          {/* SEO daily push 2026-08-31 : lot de publication (3 articles rediges en attente depuis 6 semaines). */}
          <Route path="/blog/tva-restauration-taux-guide" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogTvaRestaurationTaux /></Suspense>} />
          <Route path="/blog/licence-iv-restaurant-guide" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogLicenceIV /></Suspense>} />
          <Route path="/blog/avis-google-negatifs-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogAvisGoogleNegatifs /></Suspense>} />
          <Route path="/blog/no-show-restaurant-solutions" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogNoShowRestaurant /></Suspense>} />
          <Route path="/blog/brigade-cuisine-organisation-postes" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogBrigadeCuisine /></Suspense>} />
          <Route path="/blog/prix-vente-menu-restaurant-methode" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogPrixVenteMenu /></Suspense>} />
          <Route path="/blog/logiciel-reservation-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogLogicielReservation /></Suspense>} />
          {/* SEO long-tail 2026-05-26 : Glossaire restauration (60+ termes : food cost, marge, prime cost, fiche technique, HACCP, GMP, RevPASH). */}
          <Route path="/glossaire-restauration" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><GlossaireRestauration /></Suspense>} />
          {/* Pages comparatives (alternatives) */}
          <Route path="/alternative-hubrise" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeHubrise /></Suspense>} />
          <Route path="/alternative-lightspeed" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeLightspeed /></Suspense>} />
          <Route path="/alternative-inpulse" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeInpulse /></Suspense>} />
          <Route path="/alternative-thefork" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeTheFork /></Suspense>} />
          <Route path="/alternative-cos-kitchen" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeCosKitchen /></Suspense>} />
          <Route path="/alternative-marge-brut" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AlternativeMargeBrut /></Suspense>} />
          {/* Mega-comparatif 12 logiciels restaurant 2026 */}
          <Route path="/comparatif-logiciels-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><ComparatifLogicielsRestaurant /></Suspense>} />
          {/* SEO contre-attaque 2026-05-27 : benchmark direct RestauMargin vs Zenchef (capter "zenchef alternative", "zenchef vs restaumargin"). */}
          <Route path="/comparatif-restaumargin-vs-zenchef" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><ComparatifRestauMarginZenchef /></Suspense>} />
          {/* Catch-all: unknown blog slug → redirect to blog index (avoids falling into ProtectedRoute /login) */}
          <Route path="/blog/*" element={<Navigate to="/blog" replace />} />
          {/* Catch-all: unknown public tool → redirect to home */}
          <Route path="/outils/*" element={<Navigate to="/" replace />} />
          <Route
            path="/station"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>}>
                  <WeighStation />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<RouteApplicationOuIntrouvable />} />
          </Routes>
          <CookieBanner />
          {/* Assistant IA visiteurs : monte a cote du CookieBanner (hors <Routes>) pour couvrir
              toutes les pages publiques (landing, SEO, blog, outils) sans toucher au routing.
              Le composant se masque lui-meme quand l'utilisateur est connecte, ce qui evite
              tout recouvrement de la MobileBottomNav (rendue uniquement dans AppLayout). */}
          <Suspense fallback={null}><AssistantWidget /></Suspense>
        </RestaurantProvider>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
