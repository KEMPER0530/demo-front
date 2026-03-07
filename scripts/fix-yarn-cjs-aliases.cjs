const fs = require('fs');
const path = require('path');

const nodeModules = path.resolve(process.cwd(), 'node_modules');

const aliasPairs = [
  ['string-width', 'string-width-cjs'],
  ['strip-ansi', 'strip-ansi-cjs'],
  ['wrap-ansi', 'wrap-ansi-cjs'],
];

function ensureReexportPackage(targetName, aliasName) {
  const targetDir = path.join(nodeModules, targetName);
  const aliasDir = path.join(nodeModules, aliasName);

  if (fs.existsSync(targetDir)) {
    return;
  }
  if (!fs.existsSync(aliasDir)) {
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify({ name: targetName, private: true, main: 'index.js' }, null, 2),
  );
  fs.writeFileSync(path.join(targetDir, 'index.js'), `module.exports = require('${aliasName}');\n`);
  console.log(`[postinstall] created shim: ${targetName} -> ${aliasName}`);
}

for (const [targetName, aliasName] of aliasPairs) {
  ensureReexportPackage(targetName, aliasName);
}
