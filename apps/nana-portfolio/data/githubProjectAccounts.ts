export const githubProjectAccounts = ["Nana-Addo-d", "NanaAddoDBa"] as const

export const githubProjectFeedConfig = {
  maxRepos: 9,
  revalidateSeconds: 3600,
  requestTimeoutMs: 5000,
  excludedRepoNames: [
    "Nana-Portfolio",
    "nana-monorepo",
    "nana-portfolio",
    "Mobile-expence-tracker",
    "everything-beaded-tv-ecommerce",
  ],
} as const
