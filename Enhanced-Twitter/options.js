// functions ===============================

// set selected theme
async function setTheme(theme) {
  await chrome.storage.local.set({ theme });
  statusEl.textContent = `Tema salvo: ${theme}`;
}

// related to the html ===============================

document.getElementById('btn-red').addEventListener('click', () => setTheme('red'));
document.getElementById('btn-green').addEventListener('click', () => setTheme('green'));
document.getElementById('btn-blue').addEventListener('click', () => setTheme('blue'));

// shows current theme
const statusEl = document.getElementById('status');

chrome.storage.local.get({ theme: 'red' }, ({ theme }) => {
  statusEl.textContent = `Tema atual: ${theme}`;
});
