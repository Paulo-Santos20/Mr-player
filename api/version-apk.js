export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const r = await fetch(
    'https://api.github.com/repos/Paulo-Santos20/MrPlayer-releases/releases/latest'
  );
  if (!r.ok) return res.status(502).json({ error: 'GitHub API failed' });

  const release = await r.json();
  const tagVer = release.tag_name.replace(/^v/, '');
  const apk = release.assets?.find(a => a.name?.includes(tagVer) && a.name?.endsWith('.apk'));
  if (!apk) return res.status(404).json({ error: 'APK asset not found' });

  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    version: tagVer,
    apk: apk.name,
    size_bytes: apk.size,
    updated_at: apk.updated_at || release.published_at,
  });
}
