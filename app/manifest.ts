import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VisoryX - Premium Design Studio",
    short_name: "VisoryX",
    description: "Premium design services for branding, Discord, ERLC liveries, and business solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#f9b72e",
    orientation: "portrait-primary",
    categories: ["design", "business", "graphics"],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png"
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow"
      }
    ],
    shortcuts: [
      {
        name: "New Order",
        short_name: "Order",
        url: "/order",
        icons: [{ src: "/icons/shortcut-order.png", sizes: "96x96" }]
      },
      {
        name: "My Dashboard",
        short_name: "Dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/shortcut-dashboard.png", sizes: "96x96" }]
      },
      {
        name: "Portfolio",
        short_name: "Portfolio",
        url: "/portfolio",
        icons: [{ src: "/icons/shortcut-portfolio.png", sizes: "96x96" }]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  }
}
