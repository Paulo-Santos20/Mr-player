export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
  variant?: "arm7a" | "universal";
}

const DOWNLOADS_URL = "https://downloads-iptv-gerenciador.web.app";
const FIRE_HOSTING_URL = "https://iptv-gerenciador.web.app";

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
    const res = await fetch(`${DOWNLOADS_URL}/version.json`, { cache: "no-cache" });
    if (!res.ok) return null;
    return await res.json() as VersionJson;
  } catch {
    return null;
  }
}

async function fetchExeVersionJson(): Promise<ExeVersionJson | null> {
  try {
    const res = await fetch(`${DOWNLOADS_URL}/version-exe.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json() as ExeVersionJson;
  } catch {
    return null;
  }
}

export async function fetchAPKVersion(
  variant: "arm7a" | "universal",
): Promise<DownloadVersion | null> {
  const data = await fetchVersionJson();
  if (data) {
    return {
      version: data.version,
      fileName: data.apk,
      downloadUrl: `${DOWNLOADS_URL}/${data.apk}`,
      size: data.size_mb ? `${data.size_mb} MB` : formatFileSize(data.size_bytes),
      date: formatDate(data.updated_at),
      platform: "android",
      variant,
    };
  }

  const fileName = "Mr-Player-Gimbal-v5.2.23.apk";
  const downloadUrl = `${DOWNLOADS_URL}/${fileName}`;
  try {
    const response = await fetch(downloadUrl, { method: "HEAD" });
    let size = "76 MB";
    if (response.ok) {
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        size = formatFileSize(parseInt(contentLength, 10));
      }
    }
    return {
      version: "5.2.23",
      fileName,
      downloadUrl,
      size,
      date: formatDate(new Date().toISOString()),
      platform: "android",
      variant,
    };
  } catch {
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
}

export async function fetchEXEVersion(): Promise<DownloadVersion | null> {
  const data = await fetchExeVersionJson();
  if (data) {
    const size = data.size_mb
      ? `${data.size_mb} MB`
      : formatFileSize(data.size_bytes);
    return {
      version: data.version,
      fileName: data.exe,
      downloadUrl: `${DOWNLOADS_URL}/${data.exe}`,
      size,
      date: formatDate(data.updated_at),
      platform: "windows",
    };
  }
  return null;
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
