# Cahier des Charges — RestauMargin Station
## Kit Balance + Tablette pour la Restauration

---

## 1. Vue d'ensemble

**Produit :** Support intégré tablette + balance de cuisine professionnelle
**Nom commercial :** RestauMargin Station
**Cible :** Restaurants, traiteurs, cuisines centrales
**Prix cible kit complet :** 1 200 — 1 500 € HT
**Abonnement SaaS :** 29 €/mois

---

## 2. Composants du Kit

### 2.1 Tablette
| Spec | Valeur |
|------|--------|
| Modèle référence | Samsung Galaxy Tab A9+ |
| Écran | 11" (1920 x 1200 px) |
| Dimensions | 257.1 x 168.7 x 6.9 mm |
| Poids | 480 g (Wi-Fi) |
| OS | Android 13+ |
| Processeur | Snapdragon 695 5G |
| Stockage | 128 GB |
| Batterie | 7040 mAh |
| Connectivité | Wi-Fi + Bluetooth 5.0 |

### 2.2 Le support EST la balance (monobloc)
| Spec | Valeur |
|------|--------|
| Approche | **Le support blanc = la balance.** Pas de balance séparée cachée. C'est un produit unique moulé avec la pesée intégrée. |
| Capacité | 5 000 g (5 kg) |
| Précision | 0.5 — 1 g |
| Plateau | Inox 304L encastré en surface (accès libre) |
| LCD façade | Petit écran vert intégré = affichage poids de la balance |
| Connectivité | Bluetooth BLE 5.0 → tablette Samsung |
| Bras | Solidaire du support, part de l'arrière |
| Alimentation | USB-C rechargeable ou piles |
| Électronique | Cellules de charge + HX711 + ESP32-C3 (BLE) intégrés dans la coque |

### 2.3 Les 3 pièces du produit

**PIÈCE 1 — Support-Balance (injection ABS/PC)**
| Spec | Valeur |
|------|--------|
| Type | Coque monobloc = balance + bras tablette en un seul bloc |
| Matériau | ABS/PC injecté blanc (alimentaire) |
| Plateau pesée | Inox 304L encastré à fleur |
| LCD façade | Fenêtre verte = écran poids de la balance |
| Bras | Solidaire, part de l'arrière, ~250 mm de haut |
| Dimensions base | ~320 x 280 x 45 mm |
| Dimensions totales | ~320 x 280 x 350 mm (avec bras) |
| Électronique intégrée | 4 cellules de charge + HX711 + ESP32-C3 + LCD + batterie |
| IP | IP54 minimum |

**PIÈCE 2 — Moule silicone tablette (en haut du bras)**
| Spec | Valeur |
|------|--------|
| Type | Sleeve/étui silicone alimentaire |
| Fonction | On GLISSE la tablette dedans |
| Dimensions intérieures | 258 x 170 x 8 mm (Tab A9+ avec jeu) |
| Matériau | Silicone alimentaire souple (shore 40-50A) |
| Couleur | Blanc (assorti à la coque) |
| Fixation | Clipsé / vissé sur le bras |
| Amovible | Oui — pour retirer la tablette facilement |

**PIÈCE 3 — Tablette Samsung Galaxy Tab A9+**
| Spec | Valeur |
|------|--------|
| Modèle | Samsung Galaxy Tab A9+ (achat séparé) |
| Écran | 11" (1920 x 1200) |
| Dimensions | 257.1 x 168.7 x 6.9 mm |
| App | RestauMargin PWA (Web Bluetooth) |

### 2.4 Concept — LE SUPPORT EST LA BALANCE

```
    ┌─────────────────┐
    │   TABLETTE A9+   │  ← On la GLISSE dans
    │   (écran visible)│     le moule silicone
    └────────┬─────────┘
             │
    ┌────────┴────────┐
    │ MOULE SILICONE  │  ← Pièce 2 : sleeve souple
    │ blanc, amovible │     clipsé en haut du bras
    └────────┬────────┘
             │
        BRAS RIGIDE      ← Fait partie de la Pièce 1
        ABS/PC blanc       solidaire du support
        ~250mm haut
             │
    ┌────────┴───────────────────┐
    │                            │
    │  SUPPORT = BALANCE         │  ← Pièce 1 : c'est UN produit
    │                            │     la balance EST le support
    │  ┌──────────────────┐      │
    │  │  PLATEAU INOX    │      │  ← Encastré, accès libre
    │  │  200 x 200 mm    │      │     pour poser les plats
    │  └──────────────────┘      │
    │                            │
    │  ▓▓▓▓▓▓▓▓▓▓                │  ← 4 cellules de charge
    │  ▓ ÉLECTRO ▓                │     HX711 + ESP32 + batterie
    │  ▓▓▓▓▓▓▓▓▓▓                │
    │                            │
    │  [█ LCD VERT █]            │  ← Fenêtre façade = poids
    │                            │
    └────────────────────────────┘
         ▬▬▬▬      ▬▬▬▬          ← Patins antidérapants

    VUE DE PROFIL :

         Tablette ──┐
         (silicone)  │  70°
              Bras   │ /
              long   │/
    ┌─────────┴──────────────┐
    │ ▓▓ PLATEAU INOX ▓▓▓▓▓ │
    │ [cellules de charge]   │
    │ [LCD vert]  [USB-C]    │
    └────────────────────────┘
```

**Le produit en 3 points :**
1. **Le support BLANC = la balance** : cellules de charge, ESP32 BLE, LCD vert, tout intégré dedans
2. **Le bras** : rigide, solidaire du support, monte ~25cm vers l'arrière
3. **Le moule silicone** : en haut du bras, on GLISSE la tablette dedans comme un étui

---

## 3. Plan du Support — Description technique

```
           ┌──────────────────┐
           │    TABLETTE 11"  │  ← Berceau silicone
           │  (257 x 169 mm)  │     amovible, grip
           │                  │     antidérapant
           └────────┬─────────┘
                    │
              ┌─────┴─────┐
              │  CHARNIÈRE │  ← Axe en inox,
              │  RÉGLABLE  │     angle 60°-90°
              └─────┬──────┘
                    │
    ┌───────────────┴───────────────┐
    │     CORPS PRINCIPAL ABS/PC    │
    │                               │
    │   ┌───────────────────────┐   │
    │   │   PLATEAU INOX 304L   │   │  ← Surface pesée
    │   │   (200 x 200 mm)      │   │     enveloppée
    │   │   ┌─────────────────┐ │   │
    │   │   │ CELLULE CHARGE  │ │   │  ← Capteur intégré
    │   │   └─────────────────┘ │   │
    │   └───────────────────────┘   │
    │                               │
    │  [LCD]  [TARE] [ON/OFF]       │  ← Afficheur frontal
    │                               │
    │  ┌─────────────────────────┐  │
    │  │ COMPARTIMENT ÉLECTRONIQUE│  │
    │  │ - Module BLE             │  │
    │  │ - Batterie Li-Po 3.7V   │  │
    │  │ - Convertisseur A/D     │  │
    │  │ - Port USB-C charge     │  │
    │  └─────────────────────────┘  │
    │                               │
    │  ════════════════════════════  │  ← Patins antidérapants
    └───────────────────────────────┘     silicone (4x)
```

### 3.1 Vues

**Vue de face :**
- Écran tablette visible au-dessus
- Plateau inox au centre
- Afficheur LCD numérique en bas à gauche
- Boutons Tare / On-Off en façade

**Vue de profil :**
- Support tablette incliné à 70° (réglable)
- Pliable à plat pour rangement/transport
- Hauteur totale : ~280 mm (déplié) / ~80 mm (plié)

**Vue arrière :**
- Port USB-C pour charge (tablette + balance)
- Aérations compartiment électronique
- Emplacement câble sécurité Kensington

---

## 4. Matériaux & Contraintes cuisine

| Composant | Matériau | Justification |
|-----------|----------|---------------|
| Coque principale | ABS/PC blanc | Résistance chocs, alimentaire, lavable |
| Plateau pesée | Inox 304L | Norme alimentaire, anticorrosion |
| Berceau tablette | Silicone alimentaire | Grip, amortissement, lavable |
| Charnière | Inox 316 | Robustesse, anticorrosion |
| Patins | Silicone | Antidérapant, stable |
| Joints | Silicone IP54 | Étanchéité éclaboussures |

### Normes
- **Alimentaire** : Matériaux contact alimentaire (Règlement CE 1935/2004)
- **Électrique** : CE, directive basse tension 2014/35/UE
- **IP54** : Protection éclaboussures et poussière
- **REACH / RoHS** : Conformité substances chimiques

---

## 5. Électronique intégrée dans le support

Le support EST la balance. Électronique custom intégrée dans la coque.

| Module | Référence | Rôle | Prix |
|--------|-----------|------|------|
| 4x cellules de charge | demi-pont 5kg | Mesure poids | ~5 € |
| ADC | HX711 | Conversion analogique→numérique | ~2 € |
| MCU | ESP32-C3 Mini | BLE 5.0 + traitement poids | ~4 € |
| LCD | 4 digits 7 segments (vert) | Affichage poids en façade | ~3 € |
| Batterie | Li-Po 3.7V 2000mAh | Autonomie ~8h | ~5 € |
| Chargeur | TP4056 USB-C | Charge batterie | ~2 € |
| Boutons | Tare + On/Off | Contrôle façade | ~1 € |
| **Total électronique** | | | **~22 €** |

**Protocole BLE :**
- Service UUID : `0x181D` (Weight Scale)
- Characteristic : `0x2A9D` (Weight Measurement)
- Notification push à chaque pesée stable → tablette

**Communication :**
- ESP32 envoie le poids en BLE à la tablette Samsung
- La tablette affiche le poids dans l'app RestauMargin (PWA + Web Bluetooth API)
- Le LCD vert en façade affiche aussi le poids (double affichage)

**Certification nécessaire :** CE + RoHS (produit électronique custom)

---

## 6. Options de fabrication

### Phase 1 — Prototype (1-5 unités)
| Méthode | Coût estimé | Délai |
|---------|-------------|-------|
| Impression 3D SLS/FDM | 200-400 € / pièce | 1-2 semaines |
| Plateau inox découpé laser | 50-80 € / pièce | 1 semaine |
| Assemblage manuel | — | 1 jour |
| **Total prototype** | **~500-800 €** | **2-3 semaines** |

### Phase 2 — Petite série (50-200 unités)
| Méthode | Coût estimé | Délai |
|---------|-------------|-------|
| Moule injection ABS (2 cavités) | 8 000-15 000 € (une fois) | 6-8 semaines |
| Pièce injectée unitaire | 3-8 € / pièce | — |
| Plateau inox emboutissage | 15-25 € / pièce | — |
| Électronique assemblée | 25-40 € / pièce | — |
| **Coût unitaire série** | **~80-120 €** | — |

### Phase 3 — Série (1000+ unités)
| Méthode | Coût estimé |
|---------|-------------|
| Moule multi-cavités | amorti |
| Pièce injectée | 1.5-3 € |
| Électronique | 15-20 € |
| Assemblage | 10-15 € |
| **Coût unitaire** | **~45-65 €** |

---

## 7. Fabricants identifiés

### Prototype & impression 3D
| Fabricant | Localisation | Spécialité |
|-----------|-------------|------------|
| **Protolis** | France | Prototypage + petites séries injection |
| **MC Plast** | France | Moules optimisés petite série |
| **Hybster** | France | Injection ABS petite/moyenne série |

### Injection plastique série
| Fabricant | Localisation | Spécialité |
|-----------|-------------|------------|
| **Plastisem** | Neuville-en-Ferrain (59) | ABS/PC, boîtiers électroniques |
| **PRODIUM** | Rhône-Alpes | Injection + surmoulage |
| **ARRK** | France (réseau mondial) | 100 presses, 35 à 3200 tonnes |

### Inox alimentaire
| Fabricant | Localisation | Spécialité |
|-----------|-------------|------------|
| **Tournus Équipement** | Saône-et-Loire (71) | Fabrication inox sur mesure cuisine |
| **SOFINOR** | France | 5000+ refs inox restauration |
| **Realinox** | France | Inox agroalimentaire 30 ans |

### Support tablette OEM
| Fabricant | Localisation | Spécialité |
|-----------|-------------|------------|
| **Peacemounts** | International | Supports tablette custom |
| **Kiosk Group** | International | Kiosques tablette sur mesure |

---

## 8. Planning prévisionnel

| Phase | Durée | Livrable |
|-------|-------|----------|
| Design industriel (CAD 3D) | 2-3 semaines | Fichiers STEP/STL |
| Prototype impression 3D | 2 semaines | 2 prototypes fonctionnels |
| Tests utilisateur cuisine | 2 semaines | Rapport feedback |
| Itération design | 1-2 semaines | Design final |
| Moule injection | 6-8 semaines | Moule prêt |
| Pré-série (50 unités) | 3-4 semaines | Stock initial |
| **Total MVP → Vente** | **~4-5 mois** | **Kit prêt à commercialiser** |

---

## 9. Budget total lancement

| Poste | Coût |
|-------|------|
| Design industriel CAD | 2 000 - 4 000 € |
| Prototypes (5 unités) | 2 500 - 4 000 € |
| Moule injection | 8 000 - 15 000 € |
| Pré-série 50 unités (fabrication) | 4 000 - 6 000 € |
| Certification CE/IP54 | 2 000 - 5 000 € |
| Packaging + branding | 1 500 - 3 000 € |
| **TOTAL** | **20 000 - 37 000 €** |

---

## 10. Coût unitaire du Kit

| Composant | Série 200 | Série 1000 |
|-----------|-----------|------------|
| Coque ABS/PC + bras (injection) | 15 € | 5 € |
| Plateau inox 304L | 20 € | 12 € |
| Électronique (ESP32+HX711+LCD+batterie) | 22 € | 15 € |
| Moule silicone tablette | 8 € | 4 € |
| Samsung Tab A9+ 128GB | 270 € | 250 € |
| Assemblage | 15 € | 8 € |
| Packaging + branding | 15 € | 10 € |
| **TOTAL Kit** | **~365 €** | **~304 €** |

## 11. Marge commerciale

| | Coût | Prix vente | Marge |
|---|------|-----------|-------|
| Kit complet (série 200) | ~365 € | 1 200 € HT | **229%** |
| Kit complet (série 1000) | ~304 € | 1 200 € HT | **295%** |
| Support seul (sans tablette) | ~95 € | 450 € HT | **374%** |
| SaaS mensuel | ~3 € infra | 29 €/mois | **867%** |

**Revenu récurrent annuel par client :** 29 × 12 = **348 €/an**
**LTV 3 ans :** 1 200 + 1 044 = **2 244 €**

**Option intéressante :** Vendre le support-balance SEUL à 450€ HT (le restaurateur a peut-être déjà une tablette)

---

*Document généré le 27/03/2026 — RestauMargin Station v1.0*
