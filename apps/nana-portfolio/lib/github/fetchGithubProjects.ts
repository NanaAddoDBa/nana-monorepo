import {
  githubProjectAccounts,
  githubProjectFeedConfig,
} from "@/data/githubProjectAccounts"
import { projectsData } from "@/data/projectsData"
import type { ProjectItem } from "@/types/projectsSectionTypes"

type GithubRepository = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  language: string | null
  topics?: string[]
  fork: boolean
  archived: boolean
  stargazers_count: number
  forks_count: number
  pushed_at: string | null
  updated_at: string
  owner: {
    login: string
  }
}

function getConfiguredAccounts() {
  return (
    process.env.GITHUB_PROJECT_USERNAMES?.split(",")
      .map((account) => account.trim())
      .filter(Boolean) ?? [...githubProjectAccounts]
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function titleFromRepoName(name: string) {
  return name
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value))
}

function mapRepositoryToProject(repo: GithubRepository): ProjectItem {
  const techStack = [
    repo.language,
    ...(repo.topics ?? []).slice(0, 4).map((topic) => titleFromRepoName(topic)),
  ].filter((item): item is string => Boolean(item))

  return {
    id: `github-${repo.owner.login}-${slugify(repo.name)}`,
    title: titleFromRepoName(repo.name),
    organization: repo.owner.login,
    summary:
      repo.description ??
      `A GitHub repository from ${repo.owner.login}, automatically synced into this portfolio.`,
    techStack: techStack.length ? techStack : ["GitHub Repository"],
    category: repo.language ?? "GitHub Repository",
    featured: true,
    owner: repo.owner.login,
    source: "github",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.pushed_at ?? repo.updated_at,
    outcomes: [
      `Last updated ${formatDate(repo.pushed_at ?? repo.updated_at)}`,
      `${repo.stargazers_count} stars`,
      `${repo.forks_count} forks`,
    ],
    links: [
      {
        label: "Repository",
        href: repo.html_url,
      },
      ...(repo.homepage
        ? [
            {
              label: "Live Demo",
              href: repo.homepage,
            },
          ]
        : []),
    ],
  }
}

async function fetchReposForAccount(account: string) {
  const response = await fetch(
    `https://api.github.com/users/${account}/repos?per_page=100&sort=pushed&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      signal: AbortSignal.timeout(githubProjectFeedConfig.requestTimeoutMs),
      next: {
        revalidate: githubProjectFeedConfig.revalidateSeconds,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub repos request failed for ${account}.`)
  }

  return (await response.json()) as GithubRepository[]
}

export async function getPortfolioProjects(): Promise<ProjectItem[]> {
  const curatedProjects = projectsData.items

  try {
    const reposByAccount = await Promise.all(
      getConfiguredAccounts().map((account) => fetchReposForAccount(account))
    )

    const excludedRepoNames = new Set<string>(
      githubProjectFeedConfig.excludedRepoNames
    )

    const githubProjects = reposByAccount
      .flat()
      .filter((repo) => !repo.fork)
      .filter((repo) => !repo.archived)
      .filter((repo) => !excludedRepoNames.has(repo.name))
      .sort((first, second) => {
        const firstDate = new Date(
          first.pushed_at ?? first.updated_at
        ).getTime()
        const secondDate = new Date(
          second.pushed_at ?? second.updated_at
        ).getTime()

        return secondDate - firstDate
      })
      .slice(0, githubProjectFeedConfig.maxRepos)
      .map(mapRepositoryToProject)

    return [...curatedProjects, ...githubProjects]
  } catch {
    return curatedProjects
  }
}
