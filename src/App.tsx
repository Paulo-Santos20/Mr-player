import { useEffect, useState, useCallback } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  CheckCircle,
  Loader2,
  Shield,
  Zap,
  ChevronRight,
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
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-white/50">
      <span className="bg-white/10 px-3 py-1 rounded-full font-mono tracking-tight">
        v{version.version}
      </span>
      <span className="hidden sm:inline text-white/30">•</span>
      <span className="hidden sm:inline">{version.date}</span>
      <span className="text-white/30">•</span>
      <span>{version.size}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-2xl border border-white/10 mx-auto mb-6 flex items-center justify-center motion-safe:animate-pulse">
            <Loader2 className="w-8 h-8 text-green-400 motion-safe:animate-spin" />
          </div>
          <p className="text-white/40 text-base">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F23] relative">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-emerald-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-block mb-8 motion-safe:animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-2xl motion-safe:animate-glow-pulse" />
              <img
                src="/icon.png"
                alt="Mr. Player"
                className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl shadow-2xl motion-safe:animate-float"
              />
            </div>
          </div>

          <div
            className="space-y-4 motion-safe:animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
              <span className="gradient-text">Mr. Player</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/50 max-w-xl mx-auto font-light leading-relaxed">
              A melhor experiência em reprodutor de mídia.
            </p>
          </div>

          <div
            className="flex flex-wrap justify-center gap-3 mt-8 motion-safe:animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            {[
              { icon: Zap, label: "Rápido" },
              { icon: Shield, label: "Seguro" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="glass rounded-full px-4 py-2 text-sm text-white/50 flex items-center gap-1.5"
              >
                <Icon className="w-4 h-4 text-green-400 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <nav
            className="glass rounded-2xl p-2 flex justify-center gap-2 mb-8 motion-safe:animate-fade-in-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            role="tablist"
            aria-label="Selecione a plataforma"
          >
            <button
              role="tab"
              aria-selected={activeTab === "android"}
              onClick={() => setActiveTab("android")}
              onKeyDown={(e) => handleKeyDown(e, () => setActiveTab("android"))}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23] ${
                activeTab === "android"
                  ? "bg-white/10 text-white shadow-lg shadow-black/20"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <Smartphone className="w-5 h-5 shrink-0" aria-hidden="true" />
              Android & TV
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "windows"}
              onClick={() => setActiveTab("windows")}
              onKeyDown={(e) => handleKeyDown(e, () => setActiveTab("windows"))}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23] ${
                activeTab === "windows"
                  ? "bg-white/10 text-white shadow-lg shadow-black/20"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <Monitor className="w-5 h-5 shrink-0" aria-hidden="true" />
              Windows
            </button>
          </nav>

          {activeTab === "android" && (
            <div
              className="grid sm:grid-cols-2 gap-4 motion-safe:animate-fade-in"
              role="tabpanel"
              aria-label="Downloads Android"
            >
              <div
                className="glass-card p-6 sm:p-8 text-center"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-7 h-7 text-green-400" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                  Universal
                </h3>
                <p className="text-sm text-white/40 mb-5">
                  Compatível com todos os dispositivos Android
                </p>
                {apk && <VersionBadge version={apk} />}
                <button
                  onClick={() => handleDownload(apk)}
                  disabled={!apk}
                  className={`btn-primary w-full py-4 mt-5 text-sm sm:text-base ${
                    apk
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 motion-safe:glow-green"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
                  aria-label={apk ? `Baixar APK versão ${apk.version}` : "Indisponível"}
                >
                  {apk ? (
                    <>
                      <Download className="w-5 h-5 shrink-0" aria-hidden="true" />
                      Baixar APK
                    </>
                  ) : (
                    "Indisponível"
                  )}
                </button>
              </div>

              <div
                className="glass-card p-6 sm:p-8 text-center opacity-50"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-7 h-7 text-white/30" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                  ARM7A
                </h3>
                <p className="text-sm text-white/40 mb-5">
                  Para dispositivos com processador ARM de 32 bits
                </p>
                <button
                  disabled
                  className="btn-primary w-full py-4 mt-5 text-sm sm:text-base bg-white/5 text-white/20 cursor-not-allowed"
                  aria-label="ARM7A indisponível"
                >
                  Indisponível
                </button>
              </div>
            </div>
          )}

          {activeTab === "windows" && exe && (
            <div
              className="motion-safe:animate-fade-in"
              role="tabpanel"
              aria-label="Downloads Windows"
            >
              <div className="glass-card-strong p-8 sm:p-10 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/10 flex items-center justify-center mx-auto mb-5">
                  <Monitor className="w-8 h-8 text-sky-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  Windows
                </h3>
                <p className="text-sm sm:text-base text-white/40 mb-6">
                  Assista direto do seu PC.
                </p>
                <VersionBadge version={exe} />
                <button
                  onClick={() => handleDownload(exe)}
                  className="btn-primary w-full sm:w-auto mx-auto py-4 px-12 mt-6 text-sm sm:text-base bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/20 motion-safe:glow-green"
                  aria-label={`Baixar EXE versão ${exe.version}`}
                >
                  <Download className="w-5 h-5 shrink-0" aria-hidden="true" />
                  Baixar EXE
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="max-w-2xl mx-auto mt-12 sm:mt-16 motion-safe:animate-fade-in-up"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h4 className="text-white font-semibold mb-5 flex items-center gap-2 text-base sm:text-lg">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              Como instalar
            </h4>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/80 font-medium text-sm sm:text-base">
                  <Smartphone className="w-5 h-5 text-green-400 shrink-0" aria-hidden="true" />
                  Android
                </div>
                <ol className="space-y-3 text-sm sm:text-base text-white/40">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-green-400/50 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Baixe o APK clicando no botão acima</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-green-400/50 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Permita fontes desconhecidas nas configurações</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-green-400/50 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Abra o arquivo e instale</span>
                  </li>
                </ol>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/80 font-medium text-sm sm:text-base">
                  <Monitor className="w-5 h-5 text-sky-400 shrink-0" aria-hidden="true" />
                  Windows
                </div>
                <ol className="space-y-3 text-sm sm:text-base text-white/40">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-sky-400/50 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Baixe o instalador EXE</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-sky-400/50 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Execute o arquivo e siga as instruções</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-sky-400/50 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Pronto! O Mr. Player estará instalado</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 sm:mt-20 motion-safe:animate-fade-in pb-8">
          <p className="text-white/20 text-xs sm:text-sm">
            Mr. Player — reprodutor de mídia
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
