(async function main() {
  // themes ===============================

  // get selected theme and apply
  const { theme, hideUpsell } = await chrome.storage.local.get({
    theme: 'red',
    hideUpsell: true
  });

  // run functions
  await injectTheme(theme);
  setUpsellHidden(hideUpsell);

  // listener to apply changes again if tab changes
  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === "local" && changes.theme) {
      await injectTheme(changes.theme.newValue);
    }
  });

  // hidable elements =====================
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

const setUpsellHidden = (() => {
  let styleEl = null;
  let observer = null;
  const SELECTOR =
    '[data-testid="super-upsell-UpsellCardRenderProperties"], a[href="/i/premium_sign_up"]';

  function injectStyle() {
    if (styleEl) return;
    styleEl = document.createElement("style");
    styleEl.id = "upsell-hide-style";
    styleEl.textContent = `
      ${SELECTOR} { display: none !important; }
    `;
    document.documentElement.appendChild(styleEl);
  }
  function removeStyle() {
    if (styleEl) {
      styleEl.remove();
      styleEl = null;
    }
  }
  function removeExisting() {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      (el.closest(".css-175oi2r") || el).remove();
    });
  }
  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          const hits = node.querySelectorAll?.(SELECTOR);
          if (hits && hits.length) {
            hits.forEach((hit) =>
              (hit.closest(".css-175oi2r") || hit).remove()
            );
          }
        }
      }
    });
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  return function setUpsellHidden(shouldHide) {
    if (shouldHide) {
      injectStyle();
      removeExisting();
      startObserver();
    } else {
      stopObserver();
      removeStyle();
    }
  };
})();
