# RestauMargin Mobile

Application mobile React Native (Expo) pour RestauMargin.

## Prerequis

- Node.js 18+
- Application **Expo Go** installee sur votre telephone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Installation

```bash
cd mobile
npm install
```

## Lancement

```bash
npx expo start
```

Scannez le QR code affiche dans le terminal avec l'application Expo Go.

### Commandes supplementaires

| Commande | Description |
| --- | --- |
| `npm run android` | Demarrer sur emulateur Android |
| `npm run ios` | Demarrer sur simulateur iOS |

## Structure

```
mobile/
  App.tsx                  # Point d'entree, navigation par onglets
  app.json                 # Configuration Expo
  src/
    api/
      client.ts            # Client API (fetch + auth token)
    screens/
      DashboardScreen.tsx   # Tableau de bord avec stats et alertes
      ScannerScreen.tsx     # Scanner de factures (camera + import)
    theme.ts               # Couleurs, typographie, espacements
```

## Configuration API

Par defaut l'application se connecte a `https://restaumargin.vercel.app`.

Pour pointer vers un serveur local, creez un fichier `.env` :

```
EXPO_PUBLIC_API_URL=http://192.168.1.42:3000
```
