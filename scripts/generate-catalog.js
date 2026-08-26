const fs = require('fs');
const path = require('path');

const PACKS_DIR = path.join(__dirname, '..', 'packs');
const REPO = process.env.GITHUB_REPOSITORY;
const BRANCH = 'main';

const folders = fs.readdirSync(PACKS_DIR)
  .filter(f => fs.statSync(path.join(PACKS_DIR, f)).isDirectory());

const packages = folders.map(folder => {
  const manifestPath = path.join(PACKS_DIR, folder, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return null;

  const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const iconUrl = `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/packs/${folder}/${data.icon}`;

  return {
    id: data.id,
    name: data.name,
    author: data.author,
    short_desc: data.short_desc,
    type: data.type,
    category: data.category || [],
    featured: data.featured || false,
    version: data.version,
    icon: iconUrl,
    size_bytes: data.file ? data.file.size_bytes : null,
    updated_at: data.updated_at
  };
}).filter(Boolean);

const catalog = {
  generated_at: new Date().toISOString(),
  total: packages.length,
  packages: packages
};

fs.writeFileSync(
  path.join(__dirname, '..', 'catalog.json'),
  JSON.stringify(catalog, null, 2)
);

console.log(`Generated catalog.json with ${packages.length} package(s).`);
