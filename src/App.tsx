import { useEffect, useState } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Loader2,
  CheckCircle,
  AlertCircle,
  Tv
} from "lucide-react";
import { type DownloadVersion } from "./services/versions";

type APKVariant = "arm7a" | "universal";

function App() {
  const [apks, setApks] = useState<{
    arm7a: DownloadVersion | null;
    universal: DownloadVersion | null;
  } | null>(null);
  const [projectorApk, setProjectorApk] = useState<DownloadVersion | null>(null);
  const [exeVersion, setExeVersion] = useState<DownloadVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"android" | "windows" | "projectors">("android");

  const fileNameMap = {
    android: {
      universal: "mrplayer-v4.2.1.apk",
      arm7a: "mrplayer-v7a.apk",
    },
    projectors: {
      universal: "mrplayer-gimbal-v4.2.1.apk",
    },
    windows: "mr-player-desktop-setup.exe",
  };

  useEffect(() => {
    const storedApks = localStorage.getItem("mrplayer_apks");
    const storedExe = localStorage.getItem("mrplayer_exe");
    const storedProjector = localStorage.getItem("mrplayer_projector");

    const isValidSize = (obj: any) => obj && obj.size && obj.size !== "N/A" && !obj.size.includes("0,");

    if (storedApks && isValidSize(JSON.parse(storedApks))) {
      const parsed = JSON.parse(storedApks);
      setApks(parsed);
    } else {
      setApks({
        universal: {
          version: "4.2.1",
          fileName: fileNameMap.android.universal,
          downloadUrl: `/${fileNameMap.android.universal}`,
          size: "84.4 MB",
          date: "23/04/2026",
          platform: "android",
          variant: "universal"
        },
        arm7a: {
          version: "4.2.1",
          fileName: fileNameMap.android.arm7a,
          downloadUrl: `/${fileNameMap.android.arm7a}`,
          size: "32.5 MB",
          date: "23/04/2026",
          platform: "android",
          variant: "arm7a"
        }
      });
    }

    if (storedProjector && isValidSize(JSON.parse(storedProjector))) {
      setProjectorApk(JSON.parse(storedProjector));
    } else {
      setProjectorApk({
        version: "4.2.1",
        fileName: fileNameMap.projectors.universal,
        downloadUrl: `/${fileNameMap.projectors.universal}`,
        size: "32.5 MB",
        date: "23/04/2026",
        platform: "android",
        variant: "universal"
      });
    }

    if (storedExe && isValidSize(JSON.parse(storedExe))) {
      setExeVersion(JSON.parse(storedExe));
    } else {
      setExeVersion({
        version: "latest",
        fileName: "mr-player-desktop-setup.exe",
        downloadUrl: "/mr-player-desktop-setup.exe",
        size: "20 MB",
        date: "23/04/2026",
        platform: "windows"
      });
    }

    setLoading(false);
  }, []);

  const handleDownload = async (
    version: DownloadVersion | null,
    fallbackFile: string,
  ) => {
    setDownloading(fallbackFile);
    try {
      const url = version?.downloadUrl || `/${fallbackFile}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", version?.fileName || fallbackFile);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      const link = document.createElement("a");
      link.href = `/${fallbackFile}`;
      link.setAttribute("download", fallbackFile);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(null);
    }
  };

  const VersionBadge = ({ version }: { version: DownloadVersion }) => (
    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
      <span className="bg-slate-800 px-2 py-0.5 rounded-full font-mono">
        {version.version}
      </span>
      <span>{version.date}</span>
      <span>•</span>
      <span>{version.size}</span>
    </div>
  );

  const APKButton = ({
    variant,
    label,
    version,
  }: {
    variant: APKVariant;
    label: string;
    version: DownloadVersion | null;
  }) => {
    const fileNameMap: Record<APKVariant, string> = {
      arm7a: "mrplayer-v7a.apk",
      universal: "mrplayer-v4.2.1.apk",
    };

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
        <h4 className="text-lg font-bold text-white mb-2">{label}</h4>
        <p className="text-slate-400 text-xs mb-3 leading-relaxed">
          {variant === "arm7a"
            ? "Processadores Antigos (ARMv7)"
            : "Todos os dispositivos"}
        </p>
        {version ? (
          <VersionBadge version={version} />
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
            <AlertCircle className="w-3 h-3" />
            <span>Versão local</span>
          </div>
        )}
        <button
          onClick={() => handleDownload(version, fileNameMap[variant])}
          disabled={downloading !== null}
          className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Baixando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Baixar
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <img
            src="/icon.png"
            alt="Mr. Player Logo"
            className="w-24 h-24 mx-auto mb-6 rounded-2xl"
          />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Mr. Player
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A melhor experiência IPTV. Sem bloqueios, sem limites de formato e
            com reprodução nativa.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <span className="ml-3 text-slate-400">Carregando versões...</span>
          </div>
        )}

        {!loading && (
          <div className="mb-8">
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              <button
                onClick={() => setActiveTab("android")}
                className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors ${
                  activeTab === "android"
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-slate-400 hover:bg-white/20"
                }`}
              >
                <Smartphone className="w-5 h-5" />
                Android & TV
              </button>
              <button
                onClick={() => setActiveTab("windows")}
                className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors ${
                  activeTab === "windows"
                    ? "bg-sky-500 text-white"
                    : "bg-white/10 text-slate-400 hover:bg-white/20"
                }`}
              >
                <Monitor className="w-5 h-5" />
                Windows
              </button>
              <button
                onClick={() => setActiveTab("projectors")}
                className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors ${
                  activeTab === "projectors"
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-slate-400 hover:bg-white/20"
                }`}
              >
                <Tv className="w-5 h-5" />
                Projetores
              </button>
            </div>

            {activeTab === "android" && (
              <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
                <APKButton
                  variant="universal"
                  label="Universal"
                  version={apks?.universal ?? null}
                />
                <APKButton
                  variant="arm7a"
                  label="ARMv7"
                  version={apks?.arm7a ?? null}
                />
              </div>
            )}

            {activeTab === "windows" && (
              <div className="grid md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors">
                  <Monitor className="w-12 h-12 text-sky-400 mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-white mb-3">Windows</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Assista direto do seu PC com aceleração de hardware.
                  </p>

                  {exeVersion ? (
                    <VersionBadge version={exeVersion} />
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
                      <AlertCircle className="w-3 h-3" />
                      <span>Versão local</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleDownload(exeVersion, "mr-player-desktop-setup.exe")
                    }
                    disabled={downloading !== null}
                    className="w-full md:w-auto md:px-12 py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Baixando...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Baixar EXE
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "projectors" && (
              <div className="grid md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors">
                  <Tv className="w-12 h-12 text-purple-400 mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-white mb-3">Projetores</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Versão otimizada para projetores e smart TVs.
                  </p>

                  {projectorApk ? (
                    <VersionBadge version={projectorApk} />
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
                      <AlertCircle className="w-3 h-3" />
                      <span>Versão local</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleDownload(projectorApk, fileNameMap.projectors.universal)
                    }
                    disabled={downloading !== null}
                    className="w-full md:w-auto md:px-12 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Baixando...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Baixar APK
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Como instalar
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-2">
                <span className="text-green-500 font-bold">Android:</span> Baixe
                o APK, permita instalações de fontes desconhecidas nas
                configurações.
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">
                <span className="text-sky-400 font-bold">Windows:</span> Execute
                o instalador e siga as instruções na tela.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs max-w-xl mx-auto leading-relaxed">
          Ao baixar, você concorda com nossos termos de uso. O Mr. Player é apenas
          um reprodutor de mídia e não fornece conteúdo.
        </p>
      </div>
    </div>
  );
}

export default App;