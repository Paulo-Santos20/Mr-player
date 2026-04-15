import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Coloque os links diretos do seu repositório do GitHub aqui!
const APK_DOWNLOAD_LINK = "https://raw.githubusercontent.com/SeuUsuario/SeuRepositorio/main/caminho/para/mrplayer.apk"; // Ou link de release
const EXE_DOWNLOAD_LINK = "https://github.com/SeuUsuario/SeuRepositorio/releases/download/v1.0.0/mrplayer.exe"; // Exemplo de link de release

export default function WebLanding() {
  const { width } = useWindowDimensions();
  const isMobileView = width < 768;

  // Função simplificada usando Linking do React Native
  const handleDownload = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Não foi possível abrir o link:", url);
      }
    } catch (error) {
      console.error("Erro ao tentar abrir o link:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#0f172a', '#020617']} style={StyleSheet.absoluteFillObject} />

      <View style={[styles.content, isMobileView && styles.contentMobile]}>
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons name="play" size={40} color="#38bdf8" />
          </View>
          <Text style={styles.title}>Mr. Player</Text>
          <Text style={styles.subtitle}>
            A melhor experiência IPTV. Sem bloqueios, sem limites de formato e com reprodução nativa.
          </Text>
        </View>

        <View style={[styles.cardsRow, isMobileView && styles.cardsRowMobile]}>
          {/* Card Android */}
          <View style={styles.card}>
            <Ionicons name="logo-android" size={48} color="#22c55e" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Para Android & TV</Text>
            <Text style={styles.cardDesc}>Versão otimizada para Celulares, Tablets e Android TV.</Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#22c55e' }]} 
              onPress={() => handleDownload(APK_DOWNLOAD_LINK)}
            >
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Baixar APK</Text>
            </TouchableOpacity>
          </View>

          {/* Card Windows */}
          <View style={styles.card}>
            <Ionicons name="logo-windows" size={48} color="#38bdf8" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Para Windows</Text>
            <Text style={styles.cardDesc}>Assista direto do seu PC com aceleração de hardware.</Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#38bdf8' }]} 
              onPress={() => handleDownload(EXE_DOWNLOAD_LINK)}
            >
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Baixar EXE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerText}>
          Ao baixar, você concorda com nossos termos de uso. O Mr. Player é apenas um reprodutor de mídia e não fornece conteúdo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  content: { width: '100%', maxWidth: 1000, padding: 40, alignItems: 'center' },
  contentMobile: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 60 },
  logoWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(56,189,248,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)' },
  title: { fontSize: 48, fontWeight: '900', color: '#fff', marginBottom: 10, letterSpacing: -1 },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center', maxWidth: 600, lineHeight: 28 },
  cardsRow: { flexDirection: 'row', gap: 30, justifyContent: 'center', width: '100%' },
  cardsRowMobile: { flexDirection: 'column', gap: 20 },
  card: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', maxWidth: 400 },
  cardIcon: { marginBottom: 20 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  cardDesc: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 100, width: '100%', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerText: { marginTop: 60, color: '#475569', fontSize: 12, textAlign: 'center', maxWidth: 600, lineHeight: 18 }
});