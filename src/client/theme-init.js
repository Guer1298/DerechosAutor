// Script clásico antes de los estilos: la clave procede de la configuración del HTML.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let theme;
  try { theme = localStorage.getItem(root.dataset.themeKey); } catch { /* Preferencia opcional. */ }
  if (!['light', 'dark'].includes(theme)) theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = theme;
})();
