import { Mail, Clock, MapPin } from "lucide-react";

const contactDetails = [
  { icon: Mail, title: "Email Us", description: "Our team is ready to help", value: "contact@visoryx.design" },
  { icon: Clock, title: "Response Time", description: "We aim to respond within", value: "24-48 hours" },
  { icon: MapPin, title: "Location", description: "Based in", value: "Worldwide Remote" },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {contactDetails.map((item) => (
        <div key={item.title} className="tilt-card rounded-2xl border border-border/50 bg-card p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <item.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-5 font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          <p className="mt-3 text-sm font-bold text-primary">{item.value}</p>
        </div>
      ))}

      {/* Social Links */}
      <div className="rounded-2xl border border-border/50 bg-card p-8">
        <h3 className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Follow Us</h3>
        <p className="mt-1 text-sm text-muted-foreground">Connect with us on social media</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { name: "Discord", href: "https://discord.gg/Zeu8F7a2Rx" },
            { name: "X", href: "https://x.com/VisoryXdesign" },
            { name: "YouTube", href: "https://www.youtube.com/@VisoryXdesign" },
            { name: "TikTok", href: "https://www.tiktok.com/@visoryxdesign" },
            { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61588087643774" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
