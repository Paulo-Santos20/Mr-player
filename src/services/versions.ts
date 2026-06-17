export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
  variant?: "arm7a" | "universal";
}

const FIREBASE_DOWNLOADS = "https://downloads-iptv-gerenciador.web.app";
const GITHUB_EXE_REPO = "Paulo-Santos20/mr-player-desktop";

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

async function fetchVersionJson(): Promise<VersionJson | null> {
  try {
    const res = await fetch(`${FIREBASE_DOWNLOADS}/version.json`);
    if (!res.ok) return null;
    return await res.json() as VersionJson;
  } catch {
    return null;
  }
}

async function fetchExeVersionJson(): Promise<ExeVersionJson | null> {
  try {
    const res = await fetch(`/api/version-exe`, { cache: "no-cache" });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      version: data.version,
      exe: data.exe,
      size_bytes: data.size_bytes,
      size_mb: data.size_mb || '',
      updated_at: data.updated_at,
    };
  } catch {
    return null;
  }
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
      downloadUrl: `${FIREBASE_DOWNLOADS}/${data.apk}`,
      size: data.size_mb ? `${data.size_mb} MB` : formatFileSize(data.size_bytes),
      date: formatDate(data.updated_at),
      platform: "android",
      variant,
    };
  }

  const fileName = "Mr-Player-Gimbal-v5.2.64.apk";
  const downloadUrl = `${FIREBASE_DOWNLOADS}/${fileName}`;
  return {
    version: "5.2.64",
    fileName,
    downloadUrl,
    size: "78 MB",
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
