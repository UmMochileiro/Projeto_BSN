const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build da aplicação
console.log('Building Angular application...');
execSync('npx ng build --configuration=production --base-href=/pokedex/', { stdio: 'inherit' });

// Modificar arquivos para funcionar em subpath
console.log('Modifying files for subpath deployment...');

const indexPath = path.join(__dirname, 'www', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Corrigir paths dos recursos que não começam com /pokedex/
indexContent = indexContent.replace(/href="(?!\/pokedex\/|http|\/\/)/g, 'href="/pokedex/');
indexContent = indexContent.replace(/src="(?!\/pokedex\/|http|\/\/)/g, 'src="/pokedex/');

fs.writeFileSync(indexPath, indexContent);

console.log('Build completed and configured for /pokedex/ subpath');
