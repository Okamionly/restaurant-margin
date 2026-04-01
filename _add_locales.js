const fs = require('fs');
const paths = {
  fr: 'client/src/locales/fr.json',
  en: 'client/src/locales/en.json',
  es: 'client/src/locales/es.json',
  de: 'client/src/locales/de.json',
  ar: 'client/src/locales/ar.json'
};

for (const [lang, path] of Object.entries(paths)) {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  // CLIENTS
  if (lang === 'fr') {
    data.clients = {
      title: "Clients CRM", subtitle: "{count} clients \u00b7 CA total : {ca}", statistics: "Statistiques", importCSV: "Import CSV", newClient: "Nouveau client",
      searchPlaceholder: "Rechercher par nom, entreprise, email...", allTypes: "Tous les types", individual: "Particulier", company: "Entreprise", association: "Association",
      allTags: "Tous les tags", regular: "R\u00e9gulier", newTag: "Nouveau", sortByName: "Trier par nom", sortByCA: "Trier par CA", sortByVisit: "Trier par visite",
      resultsCount: "{count} r\u00e9sultat(s) sur {total} clients", caTotal: "CA total", orders: "Commandes", lastVisit: "Derni\u00e8re visite", actions: "Actions",
      call: "Appeler", quote: "Devis", edit: "Modifier", sendEmail: "Envoyer un email", noClientFound: "Aucun client trouv\u00e9",
      nameAndEmailRequired: "Nom et email sont requis", clientUpdated: "Client mis \u00e0 jour avec succ\u00e8s", newClientAdded: "Nouveau client ajout\u00e9", clientDeleted: "Client supprim\u00e9",
      duplicateFound: "Client similaire trouv\u00e9 : {name} ({email})", fillSubjectAndMessage: "Veuillez remplir l'objet et le message",
      emailSent: "Email envoy\u00e9 pour {name}", emailSendError: "Erreur lors de l'envoi de l'email", dataExported: "Donn\u00e9es export\u00e9es avec succ\u00e8s",
      rgpdForget: "Donn\u00e9es de {name} supprim\u00e9es (droit \u00e0 l'oubli)", csvImportSoon: "Import CSV : fonctionnalit\u00e9 \u00e0 venir",
      infos: "Infos", preferences: "Pr\u00e9f\u00e9rences", history: "Historique", documents: "Documents", rgpd: "RGPD",
      fullName: "Nom complet", companyLabel: "Entreprise", siret: "SIRET", address: "Adresse", email: "Email", phone: "T\u00e9l\u00e9phone",
      clientSince: "Client depuis", ordersEvents: "Commandes / \u00e9v\u00e9nements", notes: "Notes", allergens: "Allerg\u00e8nes", diet: "R\u00e9gime alimentaire",
      favoriteDishes: "Plats favoris", noInteraction: "Aucune interaction enregistr\u00e9e", noDocument: "Aucun document li\u00e9", invoice: "Facture",
      dataProtection: "Protection des donn\u00e9es", consentDate: "Date de consentement RGPD : ",
      collectedData: "Donn\u00e9es collect\u00e9es : nom, coordonn\u00e9es, pr\u00e9f\u00e9rences alimentaires, historique commercial",
      exportData: "Exporter les donn\u00e9es", rightToForget: "Droit \u00e0 l'oubli", editClient: "Modifier le client", firstName: "Pr\u00e9nom", lastName: "Nom *",
      emailLabel: "Email *", phoneLabel: "T\u00e9l\u00e9phone", companyField: "Entreprise", siretField: "SIRET", addressField: "Adresse", type: "Type", tags: "Tags",
      allergensEU: "Allerg\u00e8nes (14 allerg\u00e8nes UE)", dietLabel: "R\u00e9gime alimentaire", cancel: "Annuler", save: "Enregistrer", add: "Ajouter",
      quickTemplates: "Mod\u00e8les rapides", subject: "Objet", subjectPlaceholder: "Objet de l'email...", message: "Message", messagePlaceholder: "Votre message...",
      send: "Envoyer", sendEmailTo: "Envoyer un email \u00e0 {name}", statsTitle: "Statistiques clients", totalClients: "Total clients", avgCA: "CA moyen", vipClients: "Clients VIP",
      top10ByCA: "Top 10 clients par CA", distributionByType: "R\u00e9partition par type", distributionByTag: "R\u00e9partition par tag", client: "Client", typCol: "Type", tagsCol: "Tags"
    };
  } else if (lang === 'en') {
    data.clients = {
      title: "Clients CRM", subtitle: "{count} clients \u00b7 Total revenue: {ca}", statistics: "Statistics", importCSV: "Import CSV", newClient: "New client",
      searchPlaceholder: "Search by name, company, email...", allTypes: "All types", individual: "Individual", company: "Company", association: "Association",
      allTags: "All tags", regular: "Regular", newTag: "New", sortByName: "Sort by name", sortByCA: "Sort by revenue", sortByVisit: "Sort by visit",
      resultsCount: "{count} result(s) out of {total} clients", caTotal: "Total revenue", orders: "Orders", lastVisit: "Last visit", actions: "Actions",
      call: "Call", quote: "Quote", edit: "Edit", sendEmail: "Send email", noClientFound: "No client found",
      nameAndEmailRequired: "Name and email are required", clientUpdated: "Client updated successfully", newClientAdded: "New client added", clientDeleted: "Client deleted",
      duplicateFound: "Similar client found: {name} ({email})", fillSubjectAndMessage: "Please fill in subject and message",
      emailSent: "Email sent for {name}", emailSendError: "Error sending email", dataExported: "Data exported successfully",
      rgpdForget: "Data for {name} deleted (right to be forgotten)", csvImportSoon: "CSV Import: coming soon",
      infos: "Info", preferences: "Preferences", history: "History", documents: "Documents", rgpd: "GDPR",
      fullName: "Full name", companyLabel: "Company", siret: "SIRET", address: "Address", email: "Email", phone: "Phone",
      clientSince: "Client since", ordersEvents: "Orders / events", notes: "Notes", allergens: "Allergens", diet: "Dietary requirements",
      favoriteDishes: "Favorite dishes", noInteraction: "No interaction recorded", noDocument: "No linked document", invoice: "Invoice",
      dataProtection: "Data protection", consentDate: "GDPR consent date: ",
      collectedData: "Collected data: name, contact details, dietary preferences, commercial history",
      exportData: "Export data", rightToForget: "Right to be forgotten", editClient: "Edit client", firstName: "First name", lastName: "Last name *",
      emailLabel: "Email *", phoneLabel: "Phone", companyField: "Company", siretField: "SIRET", addressField: "Address", type: "Type", tags: "Tags",
      allergensEU: "Allergens (14 EU allergens)", dietLabel: "Dietary requirements", cancel: "Cancel", save: "Save", add: "Add",
      quickTemplates: "Quick templates", subject: "Subject", subjectPlaceholder: "Email subject...", message: "Message", messagePlaceholder: "Your message...",
      send: "Send", sendEmailTo: "Send email to {name}", statsTitle: "Client statistics", totalClients: "Total clients", avgCA: "Avg revenue", vipClients: "VIP clients",
      top10ByCA: "Top 10 clients by revenue", distributionByType: "Distribution by type", distributionByTag: "Distribution by tag", client: "Client", typCol: "Type", tagsCol: "Tags"
    };
  } else if (lang === 'es') {
    data.clients = { title: "Clientes CRM", statistics: "Estad\u00edsticas", newClient: "Nuevo cliente", cancel: "Cancelar", save: "Guardar", add: "A\u00f1adir", send: "Enviar", edit: "Editar", noClientFound: "Ning\u00fan cliente encontrado", infos: "Info", preferences: "Preferencias", history: "Historial", documents: "Documentos", rgpd: "RGPD", statsTitle: "Estad\u00edsticas de clientes", totalClients: "Total clientes", vipClients: "Clientes VIP" };
  } else if (lang === 'de') {
    data.clients = { title: "Kunden CRM", statistics: "Statistiken", newClient: "Neuer Kunde", cancel: "Abbrechen", save: "Speichern", add: "Hinzuf\u00fcgen", send: "Senden", edit: "Bearbeiten", noClientFound: "Kein Kunde gefunden", infos: "Info", preferences: "Pr\u00e4ferenzen", history: "Verlauf", documents: "Dokumente", rgpd: "DSGVO", statsTitle: "Kundenstatistiken", totalClients: "Kunden gesamt", vipClients: "VIP-Kunden" };
  } else if (lang === 'ar') {
    data.clients = { title: "\u0639\u0645\u0644\u0627\u0621 CRM", statistics: "\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a", newClient: "\u0639\u0645\u064a\u0644 \u062c\u062f\u064a\u062f", cancel: "\u0625\u0644\u063a\u0627\u0621", save: "\u062d\u0641\u0638", add: "\u0625\u0636\u0627\u0641\u0629", send: "\u0625\u0631\u0633\u0627\u0644", edit: "\u062a\u0639\u062f\u064a\u0644", infos: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a", preferences: "\u062a\u0641\u0636\u064a\u0644\u0627\u062a", history: "\u0633\u062c\u0644", documents: "\u0648\u062b\u0627\u0626\u0642", statsTitle: "\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a \u0627\u0644\u0639\u0645\u0644\u0627\u0621", totalClients: "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0639\u0645\u0644\u0627\u0621", vipClients: "\u0639\u0645\u0644\u0627\u0621 VIP" };
  }

  // INVENTORY
  if (lang === 'fr') {
    data.inventory = {
      title: "Inventaire", subtitle: "Gestion des stocks d'ingr\u00e9dients", add: "Ajouter", fullInventory: "Inventaire complet", exportCSV: "Export CSV", print: "Imprimer",
      itemsInStock: "Articles en stock", totalEstimatedValue: "Valeur totale estim\u00e9e", lowStockAlerts: "Alertes stock bas", lastUpdate: "Derni\u00e8re mise \u00e0 jour",
      stockAlerts: "Alertes de stock", restock: "R\u00e9approvisionner", valueByCategory: "Valeur par cat\u00e9gorie", searchPlaceholder: "Rechercher un ingr\u00e9dient...",
      allCategories: "Toutes cat\u00e9gories", allLocations: "Tous emplacements", alertsOnly: "Alertes uniquement", ingredient: "Ingr\u00e9dient", stock: "Stock", unit: "Unit\u00e9",
      min: "Min", max: "Max", value: "Valeur", status: "Statut", noItems: "Aucun article dans l'inventaire. Ajoutez des ingr\u00e9dients pour commencer.",
      noResults: "Aucun r\u00e9sultat pour cette recherche.", expired: "Expir\u00e9", expiresSoon: "Expire bient\u00f4t", clickToEdit: "Cliquer pour modifier",
      lastRestock: "Dernier r\u00e9appro", ok: "OK", low: "Bas", critical: "Critique", declareWaste: "D\u00e9clarer perte", weighScale: "Peser avec la balance",
      addToInventory: "Ajouter \u00e0 l'inventaire", selectIngredient: "-- S\u00e9lectionner --", allInInventory: "Tous les ingr\u00e9dients sont d\u00e9j\u00e0 dans l'inventaire.",
      initialStock: "Stock initial", minStock: "Stock minimum", expirationDate: "Date d'expiration", location: "Emplacement", none: "-- Aucun --", cancel: "Annuler",
      restockTitle: "R\u00e9approvisionner : {name}", quantityToAdd: "Quantit\u00e9 \u00e0 ajouter", editItem: "Modifier l'article", currentStock: "Stock actuel", unitLabel: "Unit\u00e9",
      maxStock: "Stock maximum", optional: "Optionnel", notesLabel: "Notes", notesPlaceholder: "Notes optionnelles...", save: "Enregistrer",
      wasteTitle: "D\u00e9clarer perte : {name}", lostQuantity: "Quantit\u00e9 perdue", reason: "Raison", notesOptional: "Notes (optionnel)", detailsPlaceholder: "D\u00e9tails suppl\u00e9mentaires...",
      declareWasteBtn: "D\u00e9clarer perte", deleteTitle: "Supprimer de l'inventaire",
      deleteMessage: "\u00cates-vous s\u00fbr de vouloir supprimer cet article de l'inventaire ? Cette action est irr\u00e9versible.",
      addedToInventory: "Ingr\u00e9dient ajout\u00e9 \u00e0 l'inventaire", invalidQuantity: "Quantit\u00e9 invalide", stockUpdated: "Stock mis \u00e0 jour", inventoryUpdated: "Inventaire mis \u00e0 jour",
      deletedFromInventory: "Supprim\u00e9 de l'inventaire", invalidValue: "Valeur invalide", bulkAdded: "{count} ingr\u00e9dient(s) ajout\u00e9(s) \u00e0 l'inventaire",
      csvExported: "Export CSV t\u00e9l\u00e9charg\u00e9", wasteAndStockUpdated: "Perte d\u00e9clar\u00e9e et stock mis \u00e0 jour", selectAnIngredient: "S\u00e9lectionnez un ingr\u00e9dient",
      loadError: "Erreur de chargement", outOfStock: "en rupture", lowStockLabel: "en stock bas", clickToFilterAlerts: "Cliquez pour filtrer les alertes", actions: "Actions",
      updateError: "Erreur lors de la mise \u00e0 jour", quantity: "Quantit\u00e9", ingredientLabel: "Ingr\u00e9dient"
    };
  } else if (lang === 'en') {
    data.inventory = {
      title: "Inventory", subtitle: "Ingredient stock management", add: "Add", fullInventory: "Full inventory", exportCSV: "Export CSV", print: "Print",
      itemsInStock: "Items in stock", totalEstimatedValue: "Total estimated value", lowStockAlerts: "Low stock alerts", lastUpdate: "Last update",
      stockAlerts: "Stock alerts", restock: "Restock", valueByCategory: "Value by category", searchPlaceholder: "Search an ingredient...",
      allCategories: "All categories", allLocations: "All locations", alertsOnly: "Alerts only", ingredient: "Ingredient", stock: "Stock", unit: "Unit",
      min: "Min", max: "Max", value: "Value", status: "Status", noItems: "No items in inventory. Add ingredients to start.",
      noResults: "No results for this search.", expired: "Expired", expiresSoon: "Expires soon", clickToEdit: "Click to edit",
      lastRestock: "Last restock", ok: "OK", low: "Low", critical: "Critical", declareWaste: "Declare waste", weighScale: "Weigh with scale",
      addToInventory: "Add to inventory", selectIngredient: "-- Select --", allInInventory: "All ingredients are already in inventory.",
      initialStock: "Initial stock", minStock: "Minimum stock", expirationDate: "Expiration date", location: "Location", none: "-- None --", cancel: "Cancel",
      restockTitle: "Restock: {name}", quantityToAdd: "Quantity to add", editItem: "Edit item", currentStock: "Current stock", unitLabel: "Unit",
      maxStock: "Maximum stock", optional: "Optional", notesLabel: "Notes", notesPlaceholder: "Optional notes...", save: "Save",
      wasteTitle: "Declare waste: {name}", lostQuantity: "Lost quantity", reason: "Reason", notesOptional: "Notes (optional)", detailsPlaceholder: "Additional details...",
      declareWasteBtn: "Declare waste", deleteTitle: "Delete from inventory",
      deleteMessage: "Are you sure you want to delete this item from inventory? This action is irreversible.",
      addedToInventory: "Ingredient added to inventory", invalidQuantity: "Invalid quantity", stockUpdated: "Stock updated", inventoryUpdated: "Inventory updated",
      deletedFromInventory: "Deleted from inventory", invalidValue: "Invalid value", bulkAdded: "{count} ingredient(s) added to inventory",
      csvExported: "CSV export downloaded", wasteAndStockUpdated: "Waste declared and stock updated", selectAnIngredient: "Select an ingredient",
      loadError: "Loading error", outOfStock: "out of stock", lowStockLabel: "low stock", clickToFilterAlerts: "Click to filter alerts", actions: "Actions",
      updateError: "Error during update", quantity: "Quantity", ingredientLabel: "Ingredient"
    };
  } else if (lang === 'es') {
    data.inventory = { title: "Inventario", add: "A\u00f1adir", cancel: "Cancelar", save: "Guardar", ok: "OK", low: "Bajo", critical: "Cr\u00edtico", print: "Imprimir", exportCSV: "Exportar CSV" };
  } else if (lang === 'de') {
    data.inventory = { title: "Inventar", add: "Hinzuf\u00fcgen", cancel: "Abbrechen", save: "Speichern", ok: "OK", low: "Niedrig", critical: "Kritisch", print: "Drucken", exportCSV: "CSV Export" };
  } else if (lang === 'ar') {
    data.inventory = { title: "\u0627\u0644\u0645\u062e\u0632\u0648\u0646", add: "\u0625\u0636\u0627\u0641\u0629", cancel: "\u0625\u0644\u063a\u0627\u0621", save: "\u062d\u0641\u0638" };
  }

  // COMPTABILITE
  if (lang === 'fr') {
    data.comptabilite = {
      title: "Comptabilit\u00e9", subtitle: "Suivi financier, TVA, ratios et exports comptables", loading: "Chargement des donn\u00e9es...",
      month: "Mois", quarter: "Trimestre", year: "Ann\u00e9e", monthlyRevenue: "CA du mois", vsPrevMonth: "+5,2% vs mois pr\u00e9c.", charges: "Charges", ofCA: "du CA",
      netResult: "R\u00e9sultat net", marginLabel: "Marge", foodCost: "Co\u00fbt mati\u00e8re", targetLabel: "Objectif", payroll: "Masse salariale",
      tvaBreakdown: "Ventilation TVA", tvaRate: "Taux TVA", appliedTo: "Applicable \u00e0", baseHT: "Base HT", tvaAmount: "Montant TVA", totalTTC: "Total TTC", total: "Total",
      takeaway: "Vente \u00e0 emporter", dineIn: "Sur place", alcoholServices: "Alcool / Services",
      salesJournal: "Journal des ventes", chargesExpenses: "Charges & d\u00e9penses", ratiosIndicators: "Ratios & indicateurs", exports: "Exports",
      from: "Du", to: "Au", payment: "Paiement", all: "Tous", search: "Recherche", invoiceSearchPlaceholder: "N\u00b0 facture, client...",
      date: "Date", invoiceNum: "N\u00b0 facture", client: "Client", description: "Description", ht: "HT", tva: "TVA", ttc: "TTC",
      entries: "\u00e9critures", totalHT: "Total HT", totalTVA: "Total TVA", totalTTCBottom: "Total TTC",
      addExpense: "Ajouter une d\u00e9pense", chargesBreakdown: "R\u00e9partition des charges", supplier: "Fournisseur", category: "Cat\u00e9gorie", amountHT: "Montant HT", deleteBtn: "Supprimer",
      expenseAdded: "D\u00e9pense ajout\u00e9e avec succ\u00e8s", expenseAddedOffline: "D\u00e9pense ajout\u00e9e localement (hors-ligne)", expenseDeleted: "D\u00e9pense supprim\u00e9e",
      fillRequired: "Veuillez remplir tous les champs obligatoires", invalidAmount: "Montant invalide",
      comparisonVsTarget: "Comparaison vs objectifs", evolution12m: "\u00c9volution sur 12 mois",
      fecTitle: "Fichier des \u00c9critures Comptables", fecDesc: "Format FEC obligatoire (article A47 A-1 du LPF)",
      fecExplain: "Export au format r\u00e9glementaire pour le contr\u00f4le fiscal. Contient toutes les \u00e9critures de l'exercice.", downloadFEC: "T\u00e9l\u00e9charger le FEC",
      fecExported: "Export FEC t\u00e9l\u00e9charg\u00e9", fecError: "Erreur lors de l'export FEC",
      csvExportTitle: "Export CSV logiciel comptable", csvExportDesc: "Compatible Pennylane, Sage, Cegid",
      csvExportExplain: "Exportez vos donn\u00e9es dans un format compatible avec votre logiciel comptable.", csvExported: "Export CSV pour {target} t\u00e9l\u00e9charg\u00e9",
      pdfTitle: "Rapport PDF mensuel", pdfDesc: "Synth\u00e8se compl\u00e8te du mois",
      pdfExplain: "Rapport synth\u00e9tique avec CA, charges, TVA et ratios cl\u00e9s. Id\u00e9al pour votre expert-comptable.", generatePDF: "G\u00e9n\u00e9rer le rapport PDF", pdfExported: "Rapport PDF mensuel t\u00e9l\u00e9charg\u00e9",
      printTitle: "Imprimer", printDesc: "Impression de la page courante",
      printExplain: "Imprimez les donn\u00e9es actuellement affich\u00e9es pour vos classeurs comptables.", printBtn: "Imprimer",
      addExpenseModal: "Ajouter une d\u00e9pense", dateLabel: "Date", categoryLabel: "Cat\u00e9gorie", supplierRequired: "Fournisseur *", supplierPlaceholder: "Nom du fournisseur",
      amountHTRequired: "Montant HT *", tvaRate2: "Taux TVA (%)", descriptionLabel: "Description", descriptionPlaceholder: "Description de la d\u00e9pense",
      htLabel: "Montant HT :", tvaLabel: "TVA ({rate}%) :", totalTTCLabel: "Total TTC :", cancel: "Annuler", addBtn: "Ajouter", exonerated: "Exon\u00e9r\u00e9"
    };
  } else if (lang === 'en') {
    data.comptabilite = {
      title: "Accounting", subtitle: "Financial tracking, VAT, ratios and accounting exports", loading: "Loading data...",
      month: "Month", quarter: "Quarter", year: "Year", monthlyRevenue: "Monthly revenue", vsPrevMonth: "+5.2% vs prev. month", charges: "Expenses", ofCA: "of revenue",
      netResult: "Net result", marginLabel: "Margin", foodCost: "Food cost", targetLabel: "Target", payroll: "Payroll",
      tvaBreakdown: "VAT breakdown", tvaRate: "VAT rate", appliedTo: "Applied to", baseHT: "Base excl. tax", tvaAmount: "VAT amount", totalTTC: "Total incl. tax", total: "Total",
      takeaway: "Takeaway", dineIn: "Dine-in", alcoholServices: "Alcohol / Services",
      salesJournal: "Sales journal", chargesExpenses: "Expenses & costs", ratiosIndicators: "Ratios & indicators", exports: "Exports",
      from: "From", to: "To", payment: "Payment", all: "All", search: "Search", invoiceSearchPlaceholder: "Invoice #, client...",
      date: "Date", invoiceNum: "Invoice #", client: "Client", description: "Description", ht: "Excl. tax", tva: "VAT", ttc: "Incl. tax",
      entries: "entries", totalHT: "Total excl. tax", totalTVA: "Total VAT", totalTTCBottom: "Total incl. tax",
      addExpense: "Add expense", chargesBreakdown: "Expenses breakdown", supplier: "Supplier", category: "Category", amountHT: "Amount excl. tax", deleteBtn: "Delete",
      expenseAdded: "Expense added successfully", expenseAddedOffline: "Expense added locally (offline)", expenseDeleted: "Expense deleted",
      fillRequired: "Please fill in all required fields", invalidAmount: "Invalid amount",
      comparisonVsTarget: "Comparison vs targets", evolution12m: "12-month evolution",
      fecTitle: "Accounting Entries File", fecDesc: "Mandatory FEC format (article A47 A-1 LPF)",
      fecExplain: "Regulatory export for tax audits. Contains all entries for the fiscal year.", downloadFEC: "Download FEC",
      fecExported: "FEC export downloaded", fecError: "Error during FEC export",
      csvExportTitle: "Accounting software CSV export", csvExportDesc: "Compatible with Pennylane, Sage, Cegid",
      csvExportExplain: "Export your data in a format compatible with your accounting software.", csvExported: "CSV export for {target} downloaded",
      pdfTitle: "Monthly PDF report", pdfDesc: "Complete monthly summary",
      pdfExplain: "Summary report with revenue, expenses, VAT and key ratios. Ideal for your accountant.", generatePDF: "Generate PDF report", pdfExported: "Monthly PDF report downloaded",
      printTitle: "Print", printDesc: "Print current page",
      printExplain: "Print the currently displayed data for your accounting binders.", printBtn: "Print",
      addExpenseModal: "Add expense", dateLabel: "Date", categoryLabel: "Category", supplierRequired: "Supplier *", supplierPlaceholder: "Supplier name",
      amountHTRequired: "Amount excl. tax *", tvaRate2: "VAT rate (%)", descriptionLabel: "Description", descriptionPlaceholder: "Expense description",
      htLabel: "Amount excl. tax:", tvaLabel: "VAT ({rate}%):", totalTTCLabel: "Total incl. tax:", cancel: "Cancel", addBtn: "Add", exonerated: "Exempt"
    };
  } else if (lang === 'es') {
    data.comptabilite = { title: "Contabilidad", loading: "Cargando datos...", cancel: "Cancelar", addBtn: "A\u00f1adir", month: "Mes", quarter: "Trimestre", year: "A\u00f1o" };
  } else if (lang === 'de') {
    data.comptabilite = { title: "Buchhaltung", loading: "Daten werden geladen...", cancel: "Abbrechen", addBtn: "Hinzuf\u00fcgen", month: "Monat", quarter: "Quartal", year: "Jahr" };
  } else if (lang === 'ar') {
    data.comptabilite = { title: "\u0627\u0644\u0645\u062d\u0627\u0633\u0628\u0629", loading: "\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a...", cancel: "\u0625\u0644\u063a\u0627\u0621", addBtn: "\u0625\u0636\u0627\u0641\u0629" };
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('All locale files updated.');
