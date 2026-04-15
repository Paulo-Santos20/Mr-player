export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
}

const GITHUB_APK_OWNER = "Paulo-Santos20";
const GITHUB_APK_REPO = "TV";
const GITHUB_EXE_OWNER = "Paulo-Santos20";
const GITHUB_EXE_REPO = "TV.exe";
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

export async function fetchAPKVersion(): Promise<DownloadVersion | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_APK_OWNER}/${GITHUB_APK_REPO}/contents/public/mrplayer.apk`,
      { headers },
    );

    if (!response.ok) {
      const releaseResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_APK_OWNER}/${GITHUB_APK_REPO}/releases/latest`,
        { headers },
      );
      if (releaseResponse.ok) {
        const release = await releaseResponse.json();
        const apkAsset = release.assets?.find((a: any) =>
          a.name.endsWith(".apk"),
        );
        if (apkAsset) {
          return {
            version: release.tag_name || "latest",
            fileName: apkAsset.name,
            downloadUrl: apkAsset.browser_download_url,
            size: formatFileSize(apkAsset.size),
            date: formatDate(release.published_at),
            platform: "android",
          };
        }
      }
      throw new Error("APK not found");
    }

    const data = await response.json();
    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_APK_OWNER}/${GITHUB_APK_REPO}/commits?per_page=1`,
      { headers },
    );
    const commits = await commitResponse.json();
    const lastCommit = commits[0];
    const date = lastCommit?.commit?.author?.date || new Date().toISOString();

    return {
      version: "latest",
      fileName: data.name,
      downloadUrl: data.download_url,
      size: formatFileSize(data.size),
      date: formatDate(date),
      platform: "android",
    };
  } catch (error) {
    console.error("Error fetching APK version:", error);
    return null;
  }
}

export async function fetchEXEVersion(): Promise<DownloadVersion | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_EXE_OWNER}/${GITHUB_EXE_REPO}/releases/latest`,
      { headers },
    );

    if (!response.ok) {
      const releaseResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_EXE_OWNER}/${GITHUB_EXE_REPO}/contents/release/mr-player.exe`,
        { headers },
      );
      if (releaseResponse.ok) {
        const data = await releaseResponse.json();
        const commitResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_EXE_OWNER}/${GITHUB_EXE_REPO}/commits?per_page=1`,
          { headers },
        );
        const commits = await commitResponse.json();
        const lastCommit = commits[0];
        const date =
          lastCommit?.commit?.author?.date || new Date().toISOString();

        return {
          version: "latest",
          fileName: "mr-player.exe",
          downloadUrl: data.download_url,
          size: formatFileSize(data.size),
          date: formatDate(date),
          platform: "windows",
        };
      }
      throw new Error("EXE not found");
    }

    const release = await response.json();
    const exeAsset = release.assets?.find(
      (a: any) => a.name.endsWith(".exe") && a.name.includes("setup"),
    );

    if (exeAsset) {
      return {
        version: release.tag_name || "latest",
        fileName: exeAsset.name,
        downloadUrl: exeAsset.browser_download_url,
        size: formatFileSize(exeAsset.size),
        date: formatDate(release.published_at),
        platform: "windows",
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching EXE version:", error);
    return null;
  }
}

export async function fetchAllVersions(): Promise<{
  apk: DownloadVersion | null;
  exe: DownloadVersion | null;
}> {
  const [apk, exe] = await Promise.all([fetchAPKVersion(), fetchEXEVersion()]);
  return { apk, exe };
}
