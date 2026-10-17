export type GitHubSettings = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
};

const STORAGE_KEY = "nexura-github-settings";

export const DEFAULT_GITHUB: GitHubSettings = {
  token: "",
  owner: "alezabatol49",
  repo: "nexura",
  branch: "main",
  path: "src/data/products.json",
};

export function loadGitHubSettings(): GitHubSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GITHUB;
    const parsed = JSON.parse(raw) as Partial<GitHubSettings>;
    return { ...DEFAULT_GITHUB, ...parsed };
  } catch {
    return DEFAULT_GITHUB;
  }
}

export function saveGitHubSettings(settings: GitHubSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function hasGitHubToken(settings: GitHubSettings): boolean {
  return settings.token.trim().length > 0;
}

/**
 * Pushes a JSON payload to the configured GitHub repo via the Contents API.
 * Returns true on success, throws on failure.
 */
export async function pushToGitHub(
  settings: GitHubSettings,
  content: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!hasGitHubToken(settings)) {
    return { success: false, error: "No GitHub token configured" };
  }

  const apiBase = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${settings.path}`;

  try {
    // 1. Get current file SHA (needed to update an existing file)
    let sha: string | undefined;
    const headRes = await fetch(`${apiBase}?ref=${settings.branch}`, {
      headers: {
        Authorization: `Bearer ${settings.token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (headRes.ok) {
      const headData = await headRes.json();
      sha = headData.sha as string;
    }

    // 2. Push the updated content
    const body: Record<string, unknown> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: settings.branch,
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${settings.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => null);
      const msg = errData?.message || `GitHub API error (${putRes.status})`;
      return { success: false, error: msg };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
