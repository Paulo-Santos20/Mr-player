import { useEffect, useState } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { fetchAllVersions, type DownloadVersion } from "./services/versions";

function App() {
  const [apkVersion, setApkVersion] = useState<DownloadVersion | null>(null);
  const [exeVersion, setExeVersion] = useState<DownloadVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function loadVersions() {
      try {
        const { apk, exe } = await fetchAllVersions();
        setApkVersion(apk);
        setExeVersion(exe);
      } catch (error) {
        console.error("Error loading versions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVersions();
  }, []);

  const handleDownload = async (
    version: DownloadVersion | null,
    fallbackFile: string,
  ) => {
    if (!version) {
      const link = document.createElement("a");
      link.href = `/${fallbackFile}`;
      link.setAttribute("download", fallbackFile);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    setDownloading(version.fileName);
    try {
      const response = await fetch(version.downloadUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", version.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors">
              <Smartphone className="w-12 h-12 text-green-500 mx-auto mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">
                Android & TV
              </h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Versão otimizada para Celulares, Tablets e Android TV.
              </p>

              {apkVersion ? (
                <VersionBadge version={apkVersion} />
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
                  <AlertCircle className="w-3 h-3" />
                  <span>Versão local</span>
                </div>
              )}

              <button
                onClick={() => handleDownload(apkVersion, "mrplayer.apk")}
                disabled={downloading !== null}
                className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors"
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
                onClick={() => handleDownload(exeVersion, "mr-player.exe")}
                disabled={downloading !== null}
                className="w-full py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors"
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

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors opacity-60">
              <Apple className="w-12 h-12 text-slate-400 mx-auto mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">iOS</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Em breve para iPhone e iPad.
              </p>
              <button
                disabled
                className="w-full py-4 bg-slate-700 text-slate-400 font-bold rounded-full flex items-center justify-center gap-2 cursor-not-allowed"
              >
                Em breve
              </button>
            </div>
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
          Ao baixar, você concorda com nossos termos de uso. O Mr. Player é
          apenas um reprodutor de mídia e não fornece conteúdo.
        </p>
      </div>
    </div>
  );
}

export default App;
