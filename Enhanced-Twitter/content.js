(async function main() {

  // themes ===============================

  // get selected theme and apply
  const { theme } = await chrome.storage.local.get({ theme: 'red' });
  await injectTheme(theme);

  // if the user changes the theme with the tab open, reapply.
  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local' && changes.theme) {
      await injectTheme(changes.theme.newValue);
    }
  });
})();

async function injectTheme(themeName) {
  // Remove old style if any
  const old = document.getElementById('twitter-theme-style');
  if (old) old.remove();

  // Load the theme CSS and inject as <style>
  const url = chrome.runtime.getURL(`themes/${themeName}.css`);
  const cssText = await fetch(url).then(r => r.text()).catch(() => '');
  if (!cssText) return;

  const style = document.createElement('style');
  style.id = 'twitter-theme-style';
  style.textContent = cssText;
  document.documentElement.appendChild(style);
}
