"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

// Supported locales
export const LOCALES = {
  en: { name: "English", flag: "🇺🇸", dir: "ltr" },
  es: { name: "Español", flag: "🇪🇸", dir: "ltr" },
  fr: { name: "Français", flag: "🇫🇷", dir: "ltr" },
  de: { name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  pt: { name: "Português", flag: "🇧🇷", dir: "ltr" },
  ja: { name: "日本語", flag: "🇯🇵", dir: "ltr" },
  zh: { name: "中文", flag: "🇨🇳", dir: "ltr" },
  ar: { name: "العربية", flag: "🇸🇦", dir: "rtl" },
} as const

export type Locale = keyof typeof LOCALES

// Translation keys
type TranslationKeys = {
  // Navigation
  "nav.home": string
  "nav.services": string
  "nav.portfolio": string
  "nav.pricing": string
  "nav.about": string
  "nav.contact": string
  "nav.dashboard": string
  "nav.orders": string
  "nav.help": string
  
  // Auth
  "auth.login": string
  "auth.signup": string
  "auth.logout": string
  "auth.email": string
  "auth.password": string
  "auth.forgotPassword": string
  
  // Common
  "common.loading": string
  "common.error": string
  "common.success": string
  "common.cancel": string
  "common.save": string
  "common.delete": string
  "common.edit": string
  "common.view": string
  "common.search": string
  "common.filter": string
  "common.sort": string
  "common.all": string
  "common.none": string
  "common.submit": string
  "common.close": string
  "common.back": string
  "common.next": string
  "common.previous": string
  
  // Orders
  "orders.title": string
  "orders.new": string
  "orders.pending": string
  "orders.inProgress": string
  "orders.completed": string
  "orders.cancelled": string
  "orders.total": string
  "orders.status": string
  "orders.date": string
  "orders.details": string
  
  // Services
  "services.branding": string
  "services.discord": string
  "services.gaming": string
  "services.marketing": string
  "services.business": string
  
  // Pricing
  "pricing.perMonth": string
  "pricing.perYear": string
  "pricing.free": string
  "pricing.popular": string
  "pricing.enterprise": string
  "pricing.startTrial": string
  "pricing.contactSales": string
  
  // Messages
  "messages.welcome": string
  "messages.thankYou": string
  "messages.orderPlaced": string
  "messages.orderUpdated": string
  "messages.paymentSuccess": string
  "messages.paymentFailed": string
}

// English translations (default)
const en: TranslationKeys = {
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.portfolio": "Portfolio",
  "nav.pricing": "Pricing",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.dashboard": "Dashboard",
  "nav.orders": "Orders",
  "nav.help": "Help",
  
  "auth.login": "Log In",
  "auth.signup": "Sign Up",
  "auth.logout": "Log Out",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.forgotPassword": "Forgot Password?",
  
  "common.loading": "Loading...",
  "common.error": "An error occurred",
  "common.success": "Success!",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.view": "View",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.sort": "Sort",
  "common.all": "All",
  "common.none": "None",
  "common.submit": "Submit",
  "common.close": "Close",
  "common.back": "Back",
  "common.next": "Next",
  "common.previous": "Previous",
  
  "orders.title": "Orders",
  "orders.new": "New Order",
  "orders.pending": "Pending",
  "orders.inProgress": "In Progress",
  "orders.completed": "Completed",
  "orders.cancelled": "Cancelled",
  "orders.total": "Total",
  "orders.status": "Status",
  "orders.date": "Date",
  "orders.details": "Order Details",
  
  "services.branding": "Branding",
  "services.discord": "Discord",
  "services.gaming": "Gaming",
  "services.marketing": "Marketing",
  "services.business": "Business",
  
  "pricing.perMonth": "/month",
  "pricing.perYear": "/year",
  "pricing.free": "Free",
  "pricing.popular": "Most Popular",
  "pricing.enterprise": "Enterprise",
  "pricing.startTrial": "Start Free Trial",
  "pricing.contactSales": "Contact Sales",
  
  "messages.welcome": "Welcome to VisoryX!",
  "messages.thankYou": "Thank you!",
  "messages.orderPlaced": "Your order has been placed successfully.",
  "messages.orderUpdated": "Your order has been updated.",
  "messages.paymentSuccess": "Payment successful!",
  "messages.paymentFailed": "Payment failed. Please try again.",
}

// Spanish translations
const es: TranslationKeys = {
  "nav.home": "Inicio",
  "nav.services": "Servicios",
  "nav.portfolio": "Portafolio",
  "nav.pricing": "Precios",
  "nav.about": "Nosotros",
  "nav.contact": "Contacto",
  "nav.dashboard": "Panel",
  "nav.orders": "Pedidos",
  "nav.help": "Ayuda",
  
  "auth.login": "Iniciar Sesión",
  "auth.signup": "Registrarse",
  "auth.logout": "Cerrar Sesión",
  "auth.email": "Correo",
  "auth.password": "Contraseña",
  "auth.forgotPassword": "¿Olvidaste tu contraseña?",
  
  "common.loading": "Cargando...",
  "common.error": "Ocurrió un error",
  "common.success": "¡Éxito!",
  "common.cancel": "Cancelar",
  "common.save": "Guardar",
  "common.delete": "Eliminar",
  "common.edit": "Editar",
  "common.view": "Ver",
  "common.search": "Buscar",
  "common.filter": "Filtrar",
  "common.sort": "Ordenar",
  "common.all": "Todo",
  "common.none": "Ninguno",
  "common.submit": "Enviar",
  "common.close": "Cerrar",
  "common.back": "Atrás",
  "common.next": "Siguiente",
  "common.previous": "Anterior",
  
  "orders.title": "Pedidos",
  "orders.new": "Nuevo Pedido",
  "orders.pending": "Pendiente",
  "orders.inProgress": "En Progreso",
  "orders.completed": "Completado",
  "orders.cancelled": "Cancelado",
  "orders.total": "Total",
  "orders.status": "Estado",
  "orders.date": "Fecha",
  "orders.details": "Detalles del Pedido",
  
  "services.branding": "Marca",
  "services.discord": "Discord",
  "services.gaming": "Juegos",
  "services.marketing": "Marketing",
  "services.business": "Negocios",
  
  "pricing.perMonth": "/mes",
  "pricing.perYear": "/año",
  "pricing.free": "Gratis",
  "pricing.popular": "Más Popular",
  "pricing.enterprise": "Empresarial",
  "pricing.startTrial": "Iniciar Prueba Gratis",
  "pricing.contactSales": "Contactar Ventas",
  
  "messages.welcome": "¡Bienvenido a VisoryX!",
  "messages.thankYou": "¡Gracias!",
  "messages.orderPlaced": "Tu pedido se ha realizado correctamente.",
  "messages.orderUpdated": "Tu pedido ha sido actualizado.",
  "messages.paymentSuccess": "¡Pago exitoso!",
  "messages.paymentFailed": "Pago fallido. Por favor intenta de nuevo.",
}

// All translations
const translations: Record<Locale, TranslationKeys> = {
  en,
  es,
  fr: en, // Fallback to English for now
  de: en,
  pt: en,
  ja: en,
  zh: en,
  ar: en,
}

// Context
interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof TranslationKeys) => string
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = LOCALES[newLocale].dir
    localStorage.setItem("locale", newLocale)
  }, [])

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      return translations[locale]?.[key] ?? translations.en[key] ?? key
    },
    [locale]
  )

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: LOCALES[locale].dir,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export function useTranslation() {
  const { t } = useI18n()
  return { t }
}
