import { useEffect, useState, useCallback } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Loader2,
} from "lucide-react";
import {
  type DownloadVersion,
  fetchAPKVersion,
  fetchEXEVersion,
} from "./services/versions";

function App() {
  const [apk, setApk] = useState<DownloadVersion | null>(null);
  const [exe, setExe] = useState<DownloadVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"android" | "windows">("android");

  useEffect(() => {
    Promise.all([
      fetchAPKVersion("universal"),
      fetchEXEVersion(),
    ]).then(([apkData, exeData]) => {
      setApk(apkData);
      setExe(exeData);
      setLoading(false);
    });
  }, []);

  const handleDownload = useCallback((version: DownloadVersion | null) => {
    if (version?.downloadUrl) {
      window.location.href = version.downloadUrl;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, action: () => void) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        action();
      }
    },
    []
  );

  const VersionBadge = ({ version }: { version: DownloadVersion }) => (
    <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-white/40">
      <span className="bg-white/10 px-2 py-0.5 rounded-full font-mono">
        v{version.version}
      </span>
      <span className="text-white/20">•</span>
      <span className="hidden sm:inline">{version.date}</span>
      <span className="text-white/20">•</span>
      <span>{version.size}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-2xl border border-white/10 mx-auto mb-3 flex items-center justify-center motion-safe:animate-pulse">
            <Loader2 className="w-6 h-6 text-green-400 motion-safe:animate-spin" />
          </div>
          <p className="text-white/30 text-xs">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F23] flex flex-col justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-emerald-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-4">
          <div className="inline-block mb-3 motion-safe:animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-green-500/20 blur-xl motion-safe:animate-glow-pulse" />
              <img
                src="/icon.png"
                alt="Mr. Player"
                className="relative w-14 h-14 mx-auto rounded-xl shadow-2xl motion-safe:animate-float"
              />
            </div>
          </div>

          <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              <span className="gradient-text">Mr. Player</span>
            </h1>
          </div>
        </div>

        <nav
          className="glass rounded-xl p-1 flex gap-1 mb-3 motion-safe:animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          role="tablist"
          aria-label="Plataforma"
        >
          <button
            role="tab"
            aria-selected={activeTab === "android"}
            onClick={() => setActiveTab("android")}
            onKeyDown={(e) => handleKeyDown(e, () => setActiveTab("android"))}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 ${
              activeTab === "android"
                ? "bg-white/10 text-white shadow-lg shadow-black/20"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" aria-hidden="true" />
            Android & TV
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "windows"}
            onClick={() => setActiveTab("windows")}
            onKeyDown={(e) => handleKeyDown(e, () => setActiveTab("windows"))}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 ${
              activeTab === "windows"
                ? "bg-white/10 text-white shadow-lg shadow-black/20"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Monitor className="w-4 h-4 shrink-0" aria-hidden="true" />
            Windows
          </button>
        </nav>

        {activeTab === "android" && (
          <div className="motion-safe:animate-fade-in" role="tabpanel" aria-label="Android">
            <div className="glass-card p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/10 flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-5 h-5 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Universal
              </h3>
              {apk && <VersionBadge version={apk} />}
              <button
                onClick={() => handleDownload(apk)}
                disabled={!apk}
                className={`btn-primary w-full py-3 mt-3 text-xs sm:text-sm ${
                  apk
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 motion-safe:glow-green"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
                aria-label={apk ? `Baixar APK versão ${apk.version}` : "Indisponível"}
              >
                {apk ? (
                  <>
                    <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Baixar APK
                  </>
                ) : (
                  "Indisponível"
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "windows" && exe && (
          <div className="motion-safe:animate-fade-in" role="tabpanel" aria-label="Windows">
            <div className="glass-card-strong p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/10 flex items-center justify-center mx-auto mb-3">
                <Monitor className="w-5 h-5 text-sky-400" aria-hidden="true" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Windows
              </h3>
              <VersionBadge version={exe} />
              <button
                onClick={() => handleDownload(exe)}
                className="btn-primary w-full py-3 mt-3 text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/20 motion-safe:glow-green"
                aria-label={`Baixar EXE versão ${exe.version}`}
              >
                <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                Baixar EXE
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-white/15 text-[10px] mt-4 motion-safe:animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
          Mr. Player
        </p>
      </div>
    </div>
  );
}

export default App;
