// themes ===============================

document
  .getElementById("btn-red")
  .addEventListener("click", () => setTheme("red"));
document
  .getElementById("btn-green")
  .addEventListener("click", () => setTheme("green"));
document
  .getElementById("btn-blue")
  .addEventListener("click", () => setTheme("blue"));

// shows current theme
const statusEl = document.getElementById("status");

chrome.storage.local.get({ theme: "red" }, ({ theme }) => {
  statusEl.textContent = `Tema atual: ${theme}`;
});
async function setTheme(theme) {
  await chrome.storage.local.set({ theme });
  statusEl.textContent = `Tema salvo: ${theme}`;
}


// hide "subscribe to premium card" checkbox
const chkHideSubscribeToPremiumCard = document.getElementById(
  "hide-subscribe-to-premium-card"
);
chrome.storage.local.get(
  { hideSubscribeToPremiumCard: true },
  ({ hideSubscribeToPremiumCard }) => {
    chkHideSubscribeToPremiumCard.checked = hideSubscribeToPremiumCard;
  }
);
chkHideSubscribeToPremiumCard.addEventListener("change", async () => {
  await chrome.storage.local.set({
    hideSubscribeToPremiumCard: chkHideSubscribeToPremiumCard.checked,
  });
});


// hide "ToS and Privacy Policy links" checkbox
const chkHideRightSidebarLinks = document.getElementById(
  "hide-right-sidebar-links"
);
chrome.storage.local.get(
  { hideRightSidebarLinks: true },
  ({ hideRightSidebarLinks }) => {
    chkHideRightSidebarLinks.checked = hideRightSidebarLinks;
  }
);
chkHideRightSidebarLinks.addEventListener("change", async () => {
  await chrome.storage.local.set({
    hideRightSidebarLinks: chkHideRightSidebarLinks.checked,
  });
});


// hide "Grok shortcut" checkbox
const chkHideGrokShortcut = document.getElementById("hide-grok-shortcut");
chrome.storage.local.get({ hideGrokShortcut: true }, ({ hideGrokShortcut }) => {
  chkHideGrokShortcut.checked = hideGrokShortcut;
});
chkHideGrokShortcut.addEventListener("change", async () => {
  await chrome.storage.local.set({
    hideGrokShortcut: chkHideGrokShortcut.checked,
  });
});
