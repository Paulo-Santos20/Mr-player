export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
  variant?: "arm7a" | "universal";
}

const FIRE_HOSTING_URL = "https://mr-player.web.app";

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

export async function fetchAPKVersion(
  variant: "arm7a" | "universal",
): Promise<DownloadVersion | null> {
  const fileNameMap = {
    arm7a: "mrplayer-gimbal-v4.2.1.apk",
    universal: "mrplayer-gimbal-v4.2.1.apk",
  };

  try {
    const githubInfo = await getGitHubFileInfo(
      GITHUB_OWNER,
      "TV",
      `public/${fileNameMap[variant]}`,
    );
    const date = githubInfo?.date || new Date().toISOString();

    return {
      version: "4.2.1",
      fileName: fileNameMap[variant],
      downloadUrl: `${FIRE_HOSTING_URL}/${fileNameMap[variant]}`,
      size: githubInfo?.size ? formatFileSize(githubInfo.size) : "N/A",
      date: formatDate(date),
      platform: "android",
      variant,
    };
  } catch (error) {
    console.error(`Error fetching APK ${variant} version:`, error);
    return {
      version: "4.2.1",
      fileName: fileNameMap[variant],
      downloadUrl: `${FIRE_HOSTING_URL}/${fileNameMap[variant]}`,
      size: "N/A",
      date: formatDate(new Date().toISOString()),
      platform: "android",
      variant,
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
      fileName: "mr-player-desktop-setup.exe",
      downloadUrl: `${FIRE_HOSTING_URL}/mr-player-desktop-setup.exe`,
      size: "N/A",
      date: formatDate(date),
      platform: "windows",
    };
  } catch (error) {
    console.error("Error fetching EXE version:", error);
    return {
      version: "latest",
      fileName: "mr-player-desktop-setup.exe",
      downloadUrl: `${FIRE_HOSTING_URL}/mr-player-desktop-setup.exe`,
      size: "N/A",
      date: formatDate(new Date().toISOString()),
      platform: "windows",
    };
  }
}

export async function fetchAllVersions(): Promise<{
  apks: {
    arm7a: DownloadVersion | null;
    universal: DownloadVersion | null;
  };
  exe: DownloadVersion | null;
}> {
  const [arm7a, universal, exe] = await Promise.all([
    fetchAPKVersion("arm7a"),
    fetchAPKVersion("universal"),
    fetchEXEVersion(),
  ]);
  return {
    apks: { arm7a, universal },
    exe,
  };
}