# RestauMargin MCP Server - Plan

## 1. Concept

Un serveur MCP (Model Context Protocol) natif pour RestauMargin qui permet a Claude Desktop, Claude Code ou tout client MCP compatible d'interagir directement avec la base de donnees et l'API RestauMargin.

Le restaurateur connecte le serveur MCP a Claude et gere son restaurant entierement depuis une conversation naturelle.

### Outils exposes

| Outil | Description | Parametres |
|-------|-------------|------------|
| `list_recipes` | Liste toutes les recettes avec leurs couts et marges | `?search`, `?category`, `?limit` |
| `create_recipe` | Cree une nouvelle recette complete | `name`, `category`, `ingredients[]`, `sellingPrice` |
| `update_recipe` | Met a jour une recette existante | `recipeId`, champs modifiables |
| `list_ingredients` | Liste tous les ingredients avec prix courants | `?search`, `?supplier` |
| `create_ingredient` | Ajoute un nouvel ingredient | `name`, `unit`, `price`, `supplier?` |
| `get_mercuriale_prices` | Recupere les prix de la mercuriale en cours | `?date`, `?category` |
| `create_order` | Cree une commande fournisseur | `supplierId`, `items[]` |
| `get_dashboard_stats` | Statistiques du tableau de bord | `?period`, `?dateRange` |

### Exemples de prompts utilisateur

```
"Quelle est ma recette la plus rentable ce mois-ci ?"
-> get_dashboard_stats(period: "month") + list_recipes(sort: "margin_desc")

"Cree une recette de risotto aux champignons a 14EUR avec 70% de marge"
-> list_ingredients(search: "champignon") + create_recipe(...)

"Les prix du saumon ont augmente, mets a jour toutes les recettes concernees"
-> get_mercuriale_prices(category: "poisson") + list_recipes(ingredient: "saumon") + update_recipe(...)

"Commande 20kg de boeuf et 10kg de poulet chez Metro"
-> create_order(supplier: "Metro", items: [...])
```

---

## 2. Architecture

```
Claude Desktop / Claude Code
        |
        | MCP Protocol (stdio ou Streamable HTTP)
        v
+---------------------------+
|  RestauMargin MCP Server  |
|  (Node.js / TypeScript)   |
|                           |
|  - Express server         |
|  - MCP SDK (@modelcontextprotocol/sdk) |
|  - Auth middleware (JWT)  |
+---------------------------+
        |
        | Prisma ORM
        v
+---------------------------+
|   Supabase PostgreSQL     |
|   (base existante)        |
+---------------------------+
```

### Stack technique

- **Runtime** : Node.js + TypeScript
- **MCP SDK** : `@modelcontextprotocol/sdk` (SDK officiel)
- **ORM** : Prisma (reutilise le schema existant de RestauMargin)
- **Auth** : JWT - le restaurateur s'authentifie avec ses identifiants RestauMargin
- **Transport** : stdio (pour Claude Desktop) + Streamable HTTP (pour Claude.ai)

### Structure du projet

```
packages/mcp-server/
  src/
    index.ts              # Point d'entree, initialisation MCP
    tools/
      recipes.ts          # list_recipes, create_recipe, update_recipe
      ingredients.ts      # list_ingredients, create_ingredient
      mercuriale.ts       # get_mercuriale_prices
      orders.ts           # create_order
      dashboard.ts        # get_dashboard_stats
    auth/
      jwt.ts              # Validation du token restaurateur
    prisma/
      client.ts           # Instance Prisma partagee
  package.json
  tsconfig.json
```

### Flux d'authentification

1. Le restaurateur genere un token API dans RestauMargin (Settings > API)
2. Il configure le token dans Claude Desktop (`claude_desktop_config.json`)
3. Le serveur MCP valide le JWT a chaque appel et filtre les donnees par `restaurantId`

---

## 3. Cas d'usage

### Gestion quotidienne par la voix

Le restaurateur parle a Claude comme a un assistant de cuisine :

- **Matin** : "Montre-moi les stats d'hier" / "Quels ingredients je dois commander ?"
- **Midi** : "Ajoute le plat du jour : tartare de boeuf a 18EUR"
- **Soir** : "Quel est mon food cost de la semaine ?"

### Optimisation des marges

Claude analyse les donnees et suggere proactivement :

- "Ta recette Burger Classic a une marge de 58%. En remplacant le cheddar par du comte, tu passes a 65%."
- "Le prix du saumon a augmente de 12% ce mois-ci. 3 recettes sont impactees."

### Commandes fournisseurs

- "Commande pour demain : 15kg boeuf, 8kg poulet, 5kg saumon chez Metro"
- Claude cree la commande, calcule le total previsionnel et confirme

### Integration multi-outils

Le restaurateur peut combiner RestauMargin MCP avec d'autres serveurs MCP :

- **Google Calendar MCP** : "Bloque 30 min demain matin pour la reception de commande Metro"
- **Gmail MCP** : "Envoie la commande par email au fournisseur"
- **Stripe MCP** : "Quel est mon chiffre d'affaires du mois vs mon food cost ?"

---

## 4. Avantage concurrentiel

### Aucun concurrent n'a de serveur MCP

| Plateforme | API REST | Serveur MCP |
|------------|----------|-------------|
| **RestauMargin** | Oui | **Oui (premier du marche)** |
| MarketMan | Oui | Non |
| BlueCart | Oui | Non |
| Apicbase | Oui | Non |
| Melba | Non | Non |
| Koust | Non | Non |

### Pourquoi c'est un game-changer

1. **Premier SaaS restauration avec MCP** : positionnement "AI-native" avant tous les concurrents
2. **Zero friction** : pas d'app a ouvrir, pas de dashboard a naviguer. Le restaurateur parle, Claude agit
3. **Effet de reseau MCP** : chaque nouveau serveur MCP dans l'ecosysteme (Calendar, Email, Compta) rend RestauMargin plus puissant
4. **Moat technique** : les concurrents devront d'abord creer une API, puis un serveur MCP. RestauMargin a deja les deux
5. **Argument marketing fort** : "Gerez votre restaurant depuis Claude" - message simple et differentiant

### Timeline estimee

| Phase | Duree | Livrable |
|-------|-------|----------|
| Phase 1 - MVP | 2 semaines | `list_recipes`, `get_dashboard_stats` en stdio |
| Phase 2 - CRUD | 2 semaines | Tous les outils CRUD + auth JWT |
| Phase 3 - Streamable HTTP | 1 semaine | Support Claude.ai + deploiement |
| Phase 4 - Publication | 1 semaine | Page MCP Directory + docs utilisateur |

---

## References

- [MCP Specification](https://spec.modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Directory](https://www.claudemcp.com)
- [Claude Desktop MCP Config](https://modelcontextprotocol.io/quickstart/user)
