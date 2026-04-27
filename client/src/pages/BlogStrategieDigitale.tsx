import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, MapPin, Globe, Instagram, Video, Star, Mail, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BlogStrategieDigitale() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Stratégie digitale pour restaurant : attirer et fidéliser plus de clients en 2026"
        description="Les 6 piliers du marketing digital pour restaurant : Google Business, Instagram, TikTok, avis clients, réservation en ligne et fidélisation."
        path="/blog/strategie-digitale-restaurant"
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Stratégie digitale pour restaurant : attirer et fidéliser plus de clients en 2026",
            "datePublished": "2026-04-27",
            "dateModified": "2026-04-27",
            "author": {
              "@type": "Organization",
              "name": "La rédaction RestauMargin",
              "url": "https://www.restaumargin.fr/a-propos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RestauMargin",
              "logo": { "@type": "ImageObject", "url": "https://www.restaumargin.fr/icon-512.png" }
            },
            "image": "https://www.restaumargin.fr/og-image.png",
            "inLanguage": "fr-FR",
            "mainEntityOfPage": "https://www.restaumargin.fr/blog/strategie-digitale-restaurant"
          })
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-b from-teal-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-[720px] mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-pink-700 bg-pink-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Marketing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight mb-4">
            Stratégie digitale pour restaurant : attirer et fidéliser plus de clients en 2026
          </h1>
          <p className="text-lg text-[#525252] max-w-[600px] mx-auto mb-8">
            85 % des clients consultent Google Maps avant de choisir un restaurant. Six piliers bien tenus suffisent à doubler le flux.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#737373]">
            <span>27 avril 2026</span>
            <span>·</span>
            <span>11 min de lecture</span>
            <span>·</span>
            <span>La rédaction RestauMargin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 pb-24">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          85 % des clients consultent Google Maps avant de choisir un restaurant en 2026. Un établissement avec 200 avis positifs remplit sa salle, son voisin avec une fiche fantôme cherche des couverts. La stratégie digitale n'a jamais été aussi accessible : pas besoin de 5 000 €/mois. Six piliers bien tenus suffisent à doubler le flux en 12 mois.
        </p>

        {/* Table des matières */}
        <nav className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-4">Sommaire</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li><a href="#chiffres" className="hover:text-teal-600 transition-colors">1. Le digital en 2026 : les chiffres</a></li>
            <li><a href="#google" className="hover:text-teal-600 transition-colors">2. Pilier 1 : Google Business Profile</a></li>
            <li><a href="#site" className="hover:text-teal-600 transition-colors">3. Pilier 2 : Site web et réservation</a></li>
            <li><a href="#instagram" className="hover:text-teal-600 transition-colors">4. Pilier 3 : Instagram</a></li>
            <li><a href="#tiktok" className="hover:text-teal-600 transition-colors">5. Pilier 4 : TikTok</a></li>
            <li><a href="#avis" className="hover:text-teal-600 transition-colors">6. Pilier 5 : Avis Google (méthode CARE)</a></li>
            <li><a href="#fidelisation" className="hover:text-teal-600 transition-colors">7. Pilier 6 : Email/SMS fidélisation</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="chiffres" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">1. Le digital en 2026</h2>
          </div>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>85 %</strong> cherchent sur Google Maps avant de réserver</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>74 %</strong> lisent au moins 3 avis avant de choisir</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>48 %</strong> ont découvert leur dernier resto sur Instagram/TikTok</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span>Restaurant à <strong>4,5 étoiles</strong> attire <strong>+34 %</strong> de couverts qu'à 4,0</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" /><span><strong>+10 % de note = +5 % de CA</strong> (Harvard Business 2024)</span></li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="google" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">2. Google Business Profile</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Le pilier numéro un. Si vous ne deviez en faire qu'un, ce serait celui-ci.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Checklist d'optimisation :</strong></p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span>Catégorie principale précise + 3-5 secondaires</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span>20+ photos qualitatives (extérieur, intérieur, plats, équipe)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span>Menu intégré, lien réservation direct, horaires fériés</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" /><span>Posts hebdo, réponse aux avis sous 48 h</span></li>
          </ul>
          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4 mb-4">
            <p className="text-sm font-semibold text-emerald-700">Impact mesuré</p>
            <p className="text-sm text-emerald-600">Une fiche optimisée : +25 à +40 % d'appels et +30 à +60 % d'itinéraires en 6 mois.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="site" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">3. Site web et réservation</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Pas besoin d'un site à 8 000 €. Un site simple et rapide vaut 100 fois mieux qu'un site sophistiqué qui charge en 6 secondes.
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>Bouton réservation visible dès l'accueil</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>Téléphone cliquable (75 % du trafic mobile)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>Vitesse de chargement {'<'} 3 secondes</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" /><span>Mentions ville/quartier 3-5 fois pour SEO local</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Outils 2026 :</strong></p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div>Wix Restaurants / Square : 15-30 €/mois</div>
            <div>Site sur mesure freelance : 1 500-4 000 € one-shot</div>
            <div>Zenchef / TheFork Manager : mini-site inclus</div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="instagram" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">4. Instagram</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Réseau privilégié pour la restauration en 2026, devant Facebook (en déclin {'<'} 40 ans).
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Reels {'>'}  posts</strong> : algorithme favorise vidéos 15-30 s</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Hashtags locaux</strong> : #restaurantlyon #foodbordeaux (5-10/post)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Heures clés</strong> : 11h30 (avant midi), 18h30 (avant dîner)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span><strong>Ratio idéal</strong> : 80 % inspiration / 20 % vente</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Investissement temps : 3-5 h/sem. Idéalement délégué à un membre de l'équipe (souvent un serveur passionné).
          </p>
        </section>

        {/* Section 5 */}
        <section id="tiktok" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">5. TikTok</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Moteur de découverte n°1 pour les 18-30 ans. Une vidéo virale peut amener 200 couverts en 2 semaines.
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Recette signature 30 s, plat fini en hook (1ère seconde)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Coulisses du coup de feu (rythme + musique tendance)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>3-5 publications/semaine (rythme nécessaire pour percer)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" /><span>Hashtags : #foodtok #parisfood + #fyp #pourtoi</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Investissement : 5-8 h/sem. Plusieurs restaurants français ont vu leur CA doubler grâce à 1-2 vidéos vues 1M+.
          </p>
        </section>

        {/* Section 6 */}
        <section id="avis" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">6. Avis Google : méthode CARE</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Note 4,5+, volume 200+, 100 % de réponse : seuils psychologiques pour être choisi.
          </p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Collecter plus d'avis :</strong> QR code sur addition + email post-visite à J+1 + formation équipe à demander.</p>
          <p className="text-[#374151] leading-relaxed mb-4"><strong>Méthode CARE pour répondre aux négatifs :</strong></p>
          <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4 font-mono text-sm text-[#111111] space-y-1">
            <div><strong>C</strong>onstater : "Nous sommes désolés que..."</div>
            <div><strong>A</strong>ssumer : "Vous avez raison sur..."</div>
            <div><strong>R</strong>emédier : "Nous avons ajusté X pour..."</div>
            <div><strong>E</strong>ngager : "Heureux de vous accueillir à nouveau"</div>
          </div>
          <p className="text-[#374151] leading-relaxed">
            Jamais : répondre dans l'émotion, contredire, mentionner d'autres clients.
          </p>
        </section>

        {/* Section 7 */}
        <section id="fidelisation" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">7. Email/SMS fidélisation</h2>
          </div>
          <p className="text-[#374151] leading-relaxed mb-4">
            Acquérir un nouveau client coûte 5-7 fois plus cher que faire revenir un client. Mine d'or oubliée.
          </p>
          <ul className="space-y-2 text-[#374151] mb-4">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>Wi-Fi en échange d'email (opt-in clair)</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>1 newsletter/mois : nouveautés carte, événements</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>Email anniversaire automatique avec avantage</span></li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" /><span>SMS : 2-3/an max (réveillon, fête mères, été)</span></li>
          </ul>
          <p className="text-[#374151] leading-relaxed">
            Outils : Mailchimp gratuit {'<'} 500 contacts, Brevo, MailerLite. SMS : Octopush, Spot-Hit (5-10 cts/SMS).
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions fréquentes</h2>
          <div className="space-y-5">
            {[
              {
                q: "Faut-il être sur tous les réseaux sociaux ?",
                a: "Non. Mieux vaut être excellent sur 2 (Instagram + TikTok) que médiocre sur 5. La règle : choisir là où votre cible passe du temps."
              },
              {
                q: "Combien de temps pour voir les résultats ?",
                a: "Google Business : 1-3 mois. Instagram : 3-6 mois. TikTok : 1-12 mois (très volatil). Avis Google : effets visibles dès 50 avis."
              },
              {
                q: "Faut-il déléguer à une agence ?",
                a: "Pour un restaurant solo, payer 1 500 €/mois une agence est rarement rentable. Mieux vaut former un membre de l'équipe + faire appel à un freelance ponctuel pour la production photo/vidéo."
              },
              {
                q: "Comment mesurer le ROI marketing digital ?",
                a: "3 indicateurs simples : (1) évolution mensuelle des couverts, (2) demandes d'itinéraire Google Business, (3) réservations en ligne directes. Comparer à N-1 mensuel pour neutraliser la saisonnalité."
              }
            ].map(({ q, a }) => (
              <div key={q} className="border border-[#E5E7EB] rounded-xl p-5">
                <p className="font-semibold text-[#111111] mb-2">{q}</p>
                <p className="text-[#525252] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Image cap­tée, marges captées</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            Une stratégie digitale attire plus de clients. Une gestion des marges les transforme en bénéfices. RestauMargin pilote vos coûts pendant que vous pilotez votre image.
          </p>
          <a
            href="https://www.restaumargin.fr/pricing"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/chiffre-affaires-restaurant-comment-calculer" className="text-sm text-teal-600 hover:underline">Calculer son CA →</Link>
        </div>
      </main>
    </div>
  );
}
