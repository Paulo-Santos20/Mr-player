export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
}

const GITHUB_OWNER = "Paulo-Santos20";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function getGitHubFileInfo(
  owner: string,
  repo: string,
  path: string,
): Promise<{ size: number; date: string } | null> {
  if (!GITHUB_TOKEN) return null;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&path=${path}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (response.ok) {
      const commits = await response.json();
      const lastCommit = commits[0];
      return {
        date: lastCommit?.commit?.author?.date || new Date().toISOString(),
        size: 0,
      };
    }
  } catch {
    // Ignore errors
  }
  return null;
}

async function getGitHubReleaseInfo(
  owner: string,
  repo: string,
): Promise<{ version: string; date: string } | null> {
  if (!GITHUB_TOKEN) return null;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (response.ok) {
      const release = await response.json();
      return {
        version: release.tag_name || "latest",
        date: release.published_at || new Date().toISOString(),
      };
    }
  } catch {
    // Ignore errors
  }
  return null;
}

export async function fetchAPKVersion(): Promise<DownloadVersion | null> {
  try {
    const githubInfo = await getGitHubFileInfo(
      GITHUB_OWNER,
      "TV",
      "public/mrplayer.apk",
    );
    const date = githubInfo?.date || new Date().toISOString();

    return {
      version: "latest",
      fileName: "mrplayer.apk",
      downloadUrl: "/mrplayer.apk",
      size: githubInfo?.size ? formatFileSize(githubInfo.size) : "N/A",
      date: formatDate(date),
      platform: "android",
    };
  } catch (error) {
    console.error("Error fetching APK version:", error);
    return {
      version: "latest",
      fileName: "mrplayer.apk",
      downloadUrl: "/mrplayer.apk",
      size: "N/A",
      date: formatDate(new Date().toISOString()),
      platform: "android",
    };
  }
}

export async function fetchEXEVersion(): Promise<DownloadVersion | null> {
  try {
    const githubInfo = await getGitHubReleaseInfo(GITHUB_OWNER, "TV.exe");
    const version = githubInfo?.version || "latest";
    const date = githubInfo?.date || new Date().toISOString();

    return {
      version,
      fileName: "mr-player.exe",
      downloadUrl: "/mr-player.exe",
      size: "N/A",
      date: formatDate(date),
      platform: "windows",
    };
  } catch (error) {
    console.error("Error fetching EXE version:", error);
    return {
      version: "latest",
      fileName: "mr-player.exe",
      downloadUrl: "/mr-player.exe",
      size: "N/A",
      date: formatDate(new Date().toISOString()),
      platform: "windows",
    };
  }
}

export async function fetchAllVersions(): Promise<{
  apk: DownloadVersion | null;
  exe: DownloadVersion | null;
}> {
  const [apk, exe] = await Promise.all([fetchAPKVersion(), fetchEXEVersion()]);
  return { apk, exe };
}
