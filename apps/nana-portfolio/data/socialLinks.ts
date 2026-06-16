import { Mail, Briefcase, Play, AtSign, FolderGit2 } from "lucide-react"

import type { SocialLink } from "@/types/socialLinkTypes"
export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/Nana-Addo-d",
    icon: FolderGit2,
    ariaLabel:
      "Visit my GitHub profile to explore my projects and contributions.",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/nana-addo-bampoe-addo",
    icon: Briefcase,
    ariaLabel: "Connect with me on LinkedIn for professional networking.",
  },
  {
    name: "Twitter",
    href: "https://x.com/andybampoe",
    icon: AtSign,
    ariaLabel: "Follow me on Twitter for updates and insights.",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@nanaaddo8916",
    icon: Play,
    ariaLabel:
      "Subscribe to my YouTube channel for educational and technical content.",
  },
  {
    name: "Email",
    href: "mailto:nanaaddoldoe@gmail.com",
    icon: Mail,
    ariaLabel: "Send me an email to get in touch directly.",
  },
]
