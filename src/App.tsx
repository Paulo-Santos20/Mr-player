import { useEffect, useState } from "react";
import { Download, Smartphone, Monitor, CheckCircle, Loader2 } from "lucide-react";
import { type DownloadVersion, fetchAPKVersion, fetchEXEVersion } from "./services/versions";

function App() {
  const [apk, setApk] = useState<DownloadVersion | null>(null);
  const [exe, setExe] = useState<DownloadVersion | null>(null);
  const [loading, setLoading] = useState(true);

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

  const [activeTab, setActiveTab] = useState<"android" | "windows">("android");

  const handleDownload = (version: DownloadVersion | null, fallbackUrl: string) => {
    window.location.href = version?.downloadUrl || fallbackUrl;
  };

  const VersionBadge = ({ version }: { version: DownloadVersion }) => (
    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
      <span className="bg-slate-800 px-2 py-0.5 rounded-full font-mono">{version.version}</span>
      <span>{version.date}</span>
      <span>•</span>
      <span>{version.size}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <img src="/icon.png" alt="Mr. Player Logo" className="w-24 h-24 mx-auto mb-6 rounded-2xl" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Mr. Player</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">A melhor experiência em reprodutor de mídia.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button onClick={() => setActiveTab("android")} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${activeTab === "android" ? "bg-green-500 text-white" : "bg-white/10 text-slate-400"}`}>
              <Smartphone className="w-5 h-5" /> Android & TV
            </button>
            <button onClick={() => setActiveTab("windows")} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${activeTab === "windows" ? "bg-sky-500 text-white" : "bg-white/10 text-slate-400"}`}>
              <Monitor className="w-5 h-5" /> Windows
            </button>
          </div>

          {activeTab === "android" && (
            <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Universal</h4>
                <p className="text-slate-400 text-xs mb-3">Compatível com todos os dispositivos Android</p>
                {apk && <VersionBadge version={apk} />}
                <button
                  onClick={() => apk && handleDownload(apk, apk.downloadUrl)}
                  disabled={!apk}
                  className={`w-full py-3 font-bold rounded-full flex items-center justify-center gap-2 ${apk ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                >
                  <Download className="w-4 h-4" /> {apk ? 'Baixar' : 'Carregando...'}
                </button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <h4 className="text-lg font-bold text-white mb-2">ARM7A</h4>
                <p className="text-slate-400 text-xs mb-3">Para dispositivos com processador ARM de 32 bits</p>
                <button disabled className="w-full py-3 bg-slate-700 text-slate-400 font-bold rounded-full flex items-center justify-center gap-2 cursor-not-allowed">
                  <Download className="w-4 h-4" /> Indisponível
                </button>
              </div>
            </div>
          )}

          {activeTab === "windows" && exe && (
            <div className="grid md:grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <Monitor className="w-12 h-12 text-sky-400 mx-auto mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">Windows</h3>
                <p className="text-slate-400 text-sm mb-4">Assista direto do seu PC.</p>
                <VersionBadge version={exe} />
                <div className="flex justify-center">
                  <button onClick={() => handleDownload(exe, exe.downloadUrl)} className="px-12 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> Baixar EXE
                  </button>
                </div>
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
