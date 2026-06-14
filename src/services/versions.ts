export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
  variant?: "arm7a" | "universal";
}

const GITHUB_APK_REPO = "Paulo-Santos20/iptv-mobile-gimbal";
const GITHUB_EXE_REPO = "Paulo-Santos20/mr-player-desktop";
const GITHUB_API = "https://api.github.com/repos";

interface GithubRelease {
  tag_name: string;
  published_at: string;
  assets: Array<{ name: string; size: number }>;
}

interface VersionJson {
  version: string;
  variant: string;
  apk: string;
  size_bytes: number;
  size_mb: string;
  updated_at: string;
}

interface ExeVersionJson {
  version: string;
  exe: string;
  size_bytes: number;
  size_mb: string;
  updated_at: string;
}

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

async function fetchGithubRelease(repo: string): Promise<GithubRelease | null> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}/releases/latest`);
    if (!res.ok) return null;
    return await res.json() as GithubRelease;
  } catch {
    return null;
  }
}

function releaseToApkJson(release: GithubRelease): VersionJson | null {
  const version = release.tag_name.replace(/^v/, '');
  const apkName = `Mr-Player-Gimbal-v${version}.apk`;
  const asset = release.assets?.find((a: any) => a.name === apkName);
  return {
    version,
    variant: 'universal',
    apk: apkName,
    size_bytes: asset?.size || 0,
    size_mb: asset ? (asset.size / 1048576).toFixed(1) : '?',
    updated_at: release.published_at,
  };
}

function releaseToExeJson(release: GithubRelease): ExeVersionJson | null {
  const version = release.tag_name.replace(/^v/, '');
  const exeName = `Mr.Player_${version}_x64-setup.exe`;
  const asset = release.assets?.find((a: any) => a.name === exeName);
  return {
    version,
    exe: exeName,
    size_bytes: asset?.size || 0,
    size_mb: asset ? (asset.size / 1048576).toFixed(1) : '?',
    updated_at: release.published_at,
  };
}

async function fetchVersionJson(): Promise<VersionJson | null> {
  const release = await fetchGithubRelease(GITHUB_APK_REPO);
  return release ? releaseToApkJson(release) : null;
}

async function fetchExeVersionJson(): Promise<ExeVersionJson | null> {
  const release = await fetchGithubRelease(GITHUB_EXE_REPO);
  return release ? releaseToExeJson(release) : null;
}

export async function fetchAPKVersion(
  variant: "arm7a" | "universal",
): Promise<DownloadVersion | null> {
  const data = await fetchVersionJson();
  if (data) {
    const version = data.version;
    return {
      version,
      fileName: data.apk,
      downloadUrl: `https://github.com/${GITHUB_APK_REPO}/releases/download/v${version}/${data.apk}`,
      size: data.size_mb ? `${data.size_mb} MB` : formatFileSize(data.size_bytes),
      date: formatDate(data.updated_at),
      platform: "android",
      variant,
    };
  }

  const fileName = "Mr-Player-Gimbal-v5.2.23.apk";
  const downloadUrl = `https://github.com/${GITHUB_APK_REPO}/releases/download/v5.2.23/${fileName}`;
  return {
    version: "5.2.23",
    fileName,
    downloadUrl,
    size: "76 MB",
    date: formatDate(new Date().toISOString()),
    platform: "android",
    variant,
  };
}

export async function fetchEXEVersion(): Promise<DownloadVersion | null> {
  const data = await fetchExeVersionJson();
  if (data) {
    const version = data.version;
    const size = data.size_mb
      ? `${data.size_mb} MB`
      : formatFileSize(data.size_bytes);
    return {
      version,
      fileName: data.exe,
      downloadUrl: `https://github.com/${GITHUB_EXE_REPO}/releases/download/v${version}/${data.exe}`,
      size,
      date: formatDate(data.updated_at),
      platform: "windows",
    };
  }

  const filename = "Mr.Player_1.0.7_x64-setup.exe";
  const downloadUrl = `https://github.com/${GITHUB_EXE_REPO}/releases/download/v1.0.7/${filename}`;
  return {
    version: "1.0.7",
    fileName: filename,
    downloadUrl,
    size: "340 MB",
    date: formatDate(new Date().toISOString()),
    platform: "windows",
  };
}

export async function fetchAllVersions(): Promise<{
  apks: { arm7a: DownloadVersion | null; universal: DownloadVersion | null };
  exe: DownloadVersion | null;
}> {
  const [universal, exe] = await Promise.all([
    fetchAPKVersion("universal"),
    fetchEXEVersion(),
  ]);
  return { apks: { arm7a: null, universal }, exe };
}
