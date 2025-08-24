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

/* NAVBAR OPTIONS ============================ */

const checkboxes = [
  { id: "hide-home-shortcut",          key: "hideHomeShortcut",          def: false },
  { id: "hide-explore-shortcut",       key: "hideExploreShortcut",       def: false },
  { id: "hide-notifications-shortcut", key: "hideNotificationsShortcut", def: false },
  { id: "hide-messages-shortcut",      key: "hideMessagesShortcut",      def: false },
  { id: "hide-grok-shortcut",          key: "hideGrokShortcut",          def: true  },
  { id: "hide-bookmarks-shortcut",     key: "hideBookmarksShortcut",     def: false },
  { id: "hide-jobs-shortcut",          key: "hideJobsShortcut",          def: true  },
  { id: "hide-communities-shortcut",   key: "hideCommunitiesShortcut",   def: false },
  { id: "hide-verifiedorgs-shortcut",  key: "hideVerifiedOrgsShortcut",  def: true  },
  { id: "hide-profile-shortcut",       key: "hideProfileShortcut",       def: false },
  { id: "hide-more-shortcut",          key: "hideMoreShortcut",          def: false },
];

checkboxes.forEach(({ id, key, def }) => {
  const input = document.getElementById(id);
  if (!input) return console.warn(`${id} não encontrado`);

  // carrega valor
  chrome.storage.local.get({ [key]: def }, obj => {
    input.checked = obj[key];
  });

  // salva valor
  input.addEventListener("change", () => {
    chrome.storage.local.set({ [key]: input.checked });
  });
});


/* SIDEBAR ============================ */

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
