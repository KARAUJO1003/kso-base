import { brandConfig } from "./brand.config";
import { SIDEBAR_PAGES } from "./sidebar-menu.config";

export const siteConfig = {
  developer: brandConfig.developer,
  title: brandConfig.title,
  name: brandConfig.name,
  description: brandConfig.description,
  webSocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
  url: brandConfig.url,
  ogImage: brandConfig.ogImage,
  links: brandConfig.links,
  sidebarRootItems: SIDEBAR_PAGES,
  baseUrlFiles: process.env.NEXT_PUBLIC_BASEURL_FILES,
};
