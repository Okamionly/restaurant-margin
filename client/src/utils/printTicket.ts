// Impression d'un ticket / reçu / facture via un iframe caché du document courant.
//
// Pourquoi pas window.open() : en PWA installée (mode standalone / kiosk) et sur
// mobile, window.open('', '_blank', 'width=...,height=...') est bloqué et renvoie
// null → le clic "Imprimer" ne faisait rien, silencieusement. L'iframe caché
// n'est pas soumis au blocage de popup, fonctionne en standalone, et route vers
// l'imprimante par défaut (ex: K2 Pro) via le dialogue d'impression natif.
export function printTicketHtml(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  const fire = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => iframe.remove(), 1000);
    }
  };

  if (doc.readyState === 'complete') fire();
  else iframe.onload = fire;
}
