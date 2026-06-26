export default async function handler(req, res) {
  const r = await fetch(
    'https://api.github.com/repos/Paulo-Santos20/MrPlayer-releases/releases/latest'
  );
  if (!r.ok) return res.status(502).json({ error: 'GitHub API failed' });

  const release = await r.json();
  const tagVer = release.tag_name.replace(/^v/, '');
  const exe = release.assets?.find(a => a.name?.includes(tagVer) && a.name?.endsWith('.exe'));
  if (!exe) return res.status(404).json({ error: 'EXE asset not found' });

  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    version: tagVer,
    exe: exe.name,
    size_bytes: exe.size,
    updated_at: exe.updated_at || release.published_at,
  });
}
