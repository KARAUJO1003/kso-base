/**
 * Fonte única de branding do projeto. Cada cliente/deploy preenche as
 * variáveis NEXT_PUBLIC_BRAND_* no seu .env — nenhum arquivo de código
 * precisa ser editado para trocar título, nome, descrição ou redes sociais.
 * Ver .env.example.
 */
export const brandConfig = {
  title: process.env.NEXT_PUBLIC_BRAND_TITLE || "Kso Base | Template",
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Kso Base",
  description:
    process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ||
    "Template de sistema administrativo",
  developer: process.env.NEXT_PUBLIC_BRAND_DEVELOPER || "Kso",
  url: process.env.NEXT_PUBLIC_BRAND_URL || "https://www.exemplo.com.br",
  ogImage:
    process.env.NEXT_PUBLIC_BRAND_OG_IMAGE ||
    "https://www.exemplo.com.br/og-image.jpg",
  links: {
    twitter: process.env.NEXT_PUBLIC_BRAND_TWITTER || "",
    facebook: process.env.NEXT_PUBLIC_BRAND_FACEBOOK || "",
    instagram: process.env.NEXT_PUBLIC_BRAND_INSTAGRAM || "",
  },
};
