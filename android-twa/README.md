# RestauMargin - Android TWA (Trusted Web Activity)

## Description

Ce dossier contient les instructions pour generer l'application Android
RestauMargin pour le Google Play Store via TWA (Trusted Web Activity).

Le TWA encapsule la PWA existante dans une application Android native,
sans WebView visible, avec une experience identique au web.

## Prerequis

- Node.js 18+
- Java JDK 17+
- Android SDK (via Android Studio)
- Un compte Google Play Developer (25 USD one-time)

## Etape 1 : Generer le projet TWA avec Bubblewrap

```bash
npx @nicolo-ribaudo/bubblewrap init --manifest=https://www.restaumargin.fr/manifest.webmanifest
```

Bubblewrap va vous demander :
- **Package name** : `fr.restaumargin.twa`
- **App name** : `RestauMargin`
- **Launcher name** : `RestauMargin`
- **Display mode** : `standalone`
- **Orientation** : `any`
- **Theme color** : `#000000`
- **Background color** : `#000000`
- **Start URL** : `/dashboard`
- **Signing key** : Generer une nouvelle cle ou utiliser une existante

## Etape 2 : Configurer Digital Asset Links

Le fichier `assetlinks.json` doit etre accessible a l'URL suivante :
```
https://www.restaumargin.fr/.well-known/assetlinks.json
```

Ce fichier est deja cree dans `client/public/.well-known/assetlinks.json`.
Vous devez remplacer `TODO:ADD_YOUR_SIGNING_KEY_FINGERPRINT` par
l'empreinte SHA-256 de votre cle de signature.

### Obtenir l'empreinte SHA-256

```bash
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

Copiez la ligne `SHA256:` et collez-la dans `assetlinks.json`.

## Etape 3 : Compiler l'APK / AAB

```bash
# Compiler l'APK de debug
npx @nicolo-ribaudo/bubblewrap build

# Le fichier AAB (pour le Play Store) sera dans :
# app/build/outputs/bundle/release/app-release.aab
```

## Etape 4 : Publier sur le Play Store

1. Aller sur [Google Play Console](https://play.google.com/console)
2. Creer une nouvelle application
3. Remplir les informations (description, captures d'ecran, etc.)
4. Uploader le fichier `.aab`
5. Soumettre pour review

## Notes importantes

- Le TWA requiert HTTPS et un manifest web valide
- Le Digital Asset Links doit etre accessible AVANT de soumettre au Play Store
- La PWA doit avoir un score Lighthouse > 80 pour les criteres PWA
- Les mises a jour de l'app se font via le web (pas besoin de republier)
