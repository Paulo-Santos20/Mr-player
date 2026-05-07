export interface DownloadVersion {
  version: string;
  fileName: string;
  downloadUrl: string;
  size: string;
  date: string;
  platform: "android" | "windows";
  variant?: "arm7a" | "universal";
}

const FIRE_HOSTING_URL = "https://iptv-gerenciador.web.app";

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

export async function fetchAPKVersion(
  variant: "arm7a" | "universal",
): Promise<DownloadVersion | null> {
  const fileName = "v4.7.0-gimbal.apk";
  const downloadUrl = `${FIRE_HOSTING_URL}/${fileName}`;

  try {
    const response = await fetch(downloadUrl, { method: "HEAD" });
    let size = "76 MB";
    const date = new Date().toISOString();

    if (response.ok) {
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        size = formatFileSize(parseInt(contentLength, 10));
      }
    }

    return {
      version: "4.7.0",
      fileName,
      downloadUrl,
      size,
      date: formatDate(date),
      platform: "android",
      variant,
    };
  } catch (error) {
    console.error(`Error fetching APK ${variant} version:`, error);
    return {
      version: "4.7.0",
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
  return {
    version: "latest",
    fileName: "mrplayer-setup.exe",
    downloadUrl: `${FIRE_HOSTING_URL}/mrplayer-setup.exe`,
    size: "N/A",
    date: formatDate(new Date().toISOString()),
    platform: "windows",
  };
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