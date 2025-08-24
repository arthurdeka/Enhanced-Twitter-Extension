(async function main() {
  // get saved options from storage (key, defaultValue)
  const { theme, hideSubscribeToPremiumCard, hideRightSidebarLinks, hideGrokShortcut } = await chrome.storage.local.get({
    theme: 'red',
    hideSubscribeToPremiumCard: true,
    hideRightSidebarLinks: true,
    hideGrokShortcut: true
  });


  // listener to apply changes again if tab changes
  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === "local" && changes.theme) {
      await injectTheme(changes.theme.newValue);
    }
  });

  // run functions
  await injectTheme(theme);
  if (hideSubscribeToPremiumCard) hideElement('[data-testid="super-upsell-UpsellCardRenderProperties"], a[href="/i/premium_sign_up"]');
  if (hideRightSidebarLinks) hideElement('div.css-175oi2r.r-1kqtdi0.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64');
  if (hideGrokShortcut) hideElement('div.css-175oi2r.r-15zivkp.r-1bymd8e.r-13qz1uu > nav > a:nth-child(5)');

})();

async function injectTheme(themeName) {
  // Remove old style if any
  const old = document.getElementById("twitter-theme-style");
  if (old) old.remove();

  // Load the theme CSS and inject as <style>
  const url = chrome.runtime.getURL(`themes/${themeName}.css`);
  const cssText = await fetch(url)
    .then((r) => r.text())
    .catch(() => "");
  if (!cssText) return;

  const style = document.createElement("style");
  style.id = "twitter-theme-style";
  style.textContent = cssText;
  document.documentElement.appendChild(style);
}

const hideElement = (() => {
  // Mapeia cada seletor a { styleEl, observer }
  const registry = new Map();

  function enable(selector) {
    if (registry.has(selector)) return; // já ativo

    /* 1. Injeta CSS que força display:none */
    const styleEl = document.createElement('style');
    styleEl.textContent = `${selector} { display: none !important; }`;
    document.head.appendChild(styleEl);

    /* 2. Remove os elementos que já existem na página */
    document.querySelectorAll(selector).forEach(el => el.remove());

    /* 3. Observa mutações futuras */
    const observer = new MutationObserver(muts => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;

          // Se o próprio nó corresponde
          if (node.matches?.(selector)) node.remove();

          // Ou se contém algo que corresponda
          node.querySelectorAll?.(selector).forEach(hit => hit.remove());
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    registry.set(selector, { styleEl, observer });
  }

  function disable(selector) {
    const entry = registry.get(selector);
    if (!entry) return;

    entry.observer.disconnect();
    entry.styleEl.remove();
    registry.delete(selector);
  }

  // Função que o usuário chama
  function hideElement(selector) {
    if (typeof selector !== 'string' || !selector.trim()) return;
    enable(selector);
  }

  // API para parar de esconder
  hideElement.stop = disable;

  return hideElement;
})();
