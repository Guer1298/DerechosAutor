export function initArticle() {
const sections = document.querySelectorAll('.article-body > section[id]');
if (sections.length && 'IntersectionObserver' in window) {
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id));
    const active = [...sections].find(section => visible.has(section.id));
    if (!active) return;
    document.querySelectorAll('[data-toc]').forEach(link => {
      if (link.dataset.toc === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-110px 0px -55% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));
}


}
