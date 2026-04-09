//src\assets\data\socialLinks.ts
import { Github, Linkedin, Twitter, Youtube, Mail ,LucideIcon} from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
  ariaLabel: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/Nana-Addo-d",
    icon: Github,
    ariaLabel: "Visit my GitHub profile to explore my projects and contributions.",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/nana-addo-bampoe-addo",
    icon: Linkedin,
    ariaLabel: "Connect with me on LinkedIn for professional networking.",
  },
  {
    name: "Twitter",
    href: "https://x.com/andybampoe",
    icon: Twitter,
    ariaLabel: "Follow me on Twitter for updates and insights.",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@nanaaddo8916",
    icon: Youtube,
    ariaLabel: "Subscribe to my YouTube channel for educational and technical content.",
  },
  {
    name: "Email",
    href: "mailto:andybampoe.ad@gmail.com",
    icon: Mail,
    ariaLabel: "Send me an email to get in touch directly.",
  },
];
