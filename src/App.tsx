import { useState } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  CheckCircle,
  Tv,
  RotateCcw
} from "lucide-react";
import { type DownloadVersion } from "./services/versions";

type APKVariant = "arm7a" | "universal";

const FIRE_HOSTING = "https://iptv-gerenciador.web.app";

function App() {
  const [apks] = useState({
    universal: {
      version: "4.2.4",
      fileName: "mrplayer-v4.2.4.apk",
      downloadUrl: `${FIRE_HOSTING}/mrplayer-v4.2.4.apk`,
      size: "84.4 MB",
      date: "24/04/2026",
      platform: "android" as const,
      variant: "universal" as const
    },
    arm7a: {
      version: "4.2.4",
      fileName: "mrplayer-v7a-v4.2.4.apk",
      downloadUrl: `${FIRE_HOSTING}/mrplayer-v7a-v4.2.4.apk`,
      size: "32.5 MB",
      date: "24/04/2026",
      platform: "android" as const,
      variant: "arm7a" as const
    }
  });

  const [projectorApk] = useState<DownloadVersion | null>({
    version: "4.2.4",
    fileName: "mrplayer-gimbal-v4.2.4.apk",
    downloadUrl: `${FIRE_HOSTING}/mrplayer-gimbal-v4.2.4.apk`,
    size: "85 MB",
    date: "24/04/2026",
    platform: "android",
    variant: "universal"
  });

const [exeVersion] = useState<DownloadVersion | null>({
    version: "1.0.0",
    fileName: "mr-player-desktop-setup-v1.0.0.exe",
    downloadUrl: `${FIRE_HOSTING}/mr-player-desktop-setup-v1.0.0.exe`,
    size: "4.0 MB",
    date: "26/04/2026",
    platform: "windows"
  });

  const [activeTab, setActiveTab] = useState<"android" | "windows" | "projectors">("android");

  const fileNameMap = {
    android: {
      universal: `${FIRE_HOSTING}/mrplayer-v4.2.4.apk`,
      arm7a: `${FIRE_HOSTING}/mrplayer-v7a-v4.2.4.apk`,
    },
    projectors: {
      universal: `${FIRE_HOSTING}/mrplayer-gimbal-v4.2.4.apk`,
    },
    windows: `${FIRE_HOSTING}/mr-player-desktop-setup-v1.0.0.exe`,
  };

  const handleDownload = (version: DownloadVersion | null, fallbackFile: string) => {
    const url = version?.downloadUrl || `/${fallbackFile}`;
    window.location.href = url;
  };

  const handleClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const VersionBadge = ({ version }: { version: DownloadVersion }) => (
    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
      <span className="bg-slate-800 px-2 py-0.5 rounded-full font-mono">{version.version}</span>
      <span>{version.date}</span>
      <span>•</span>
      <span>{version.size}</span>
    </div>
  );

  const APKButton = ({ variant, label, version }: { variant: APKVariant; label: string; version: DownloadVersion }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
      <h4 className="text-lg font-bold text-white mb-2">{label}</h4>
      <p className="text-slate-400 text-xs mb-3">{variant === "arm7a" ? "Processadores Antigos (ARMv7)" : "Todos os dispositivos"}</p>
      <VersionBadge version={version} />
      <button onClick={() => handleDownload(version, fileNameMap.android[variant])} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full flex items-center justify-center gap-2">
        <Download className="w-4 h-4" /> Baixar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <img src="/icon.png" alt="Mr. Player Logo" className="w-24 h-24 mx-auto mb-6 rounded-2xl" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Mr. Player</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">A melhor experiência IPTV v4.2.4.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button onClick={() => setActiveTab("android")} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${activeTab === "android" ? "bg-green-500 text-white" : "bg-white/10 text-slate-400"}`}>
              <Smartphone className="w-5 h-5" /> Android & TV
            </button>
            <button onClick={() => setActiveTab("windows")} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${activeTab === "windows" ? "bg-sky-500 text-white" : "bg-white/10 text-slate-400"}`}>
              <Monitor className="w-5 h-5" /> Windows
            </button>
            <button onClick={() => setActiveTab("projectors")} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${activeTab === "projectors" ? "bg-purple-500 text-white" : "bg-white/10 text-slate-400"}`}>
              <Tv className="w-5 h-5" /> Projetores
            </button>
          </div>

          {activeTab === "android" && (
            <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
              <APKButton variant="universal" label="Universal" version={apks.universal} />
              <APKButton variant="arm7a" label="ARMv7" version={apks.arm7a} />
            </div>
          )}

          {activeTab === "windows" && exeVersion && (
            <div className="grid md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <Monitor className="w-12 h-12 text-sky-400 mx-auto mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">Windows</h3>
                <p className="text-slate-400 text-sm mb-4">Assista direto do seu PC.</p>
                <VersionBadge version={exeVersion} />
                <button onClick={() => handleDownload(exeVersion, fileNameMap.windows)} className="w-full md:w-auto md:px-12 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Baixar EXE
                </button>
              </div>
            </div>
          )}

          {activeTab === "projectors" && projectorApk && (
            <div className="grid md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <Tv className="w-12 h-12 text-purple-400 mx-auto mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">Projetores</h3>
                <p className="text-slate-400 text-sm mb-4">Versão otimizada para projetores.</p>
                <VersionBadge version={projectorApk} />
                <button onClick={() => handleDownload(projectorApk, fileNameMap.projectors.universal)} className="w-full md:w-auto md:px-12 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Baixar APK
                </button>
                <button onClick={handleClearCache} className="mt-3 text-xs text-slate-500 underline flex items-center justify-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Limpar Cache
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Como instalar</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p className="text-slate-400"><span className="text-green-500 font-bold">Android:</span> Baixe o APK e permita fontes desconhecidas.</p>
            <p className="text-slate-400"><span className="text-sky-500 font-bold">Windows:</span> Execute o instalador.</p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs">Mr. Player - reprodutor de mídia</p>
      </div>
    </div>
  );
}

export default App;