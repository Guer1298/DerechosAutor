export const securityHeaders = Object.freeze({
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});

// Formato reconocido por Netlify y Cloudflare Pages; otros hosts deben configurar sus equivalentes.
export function hostingHeaders() {
  return `/*\n${Object.entries(securityHeaders).map(([key,value]) => `  ${key}: ${value}`).join('\n')}\n  Cache-Control: public, max-age=0, must-revalidate\n`;
}
