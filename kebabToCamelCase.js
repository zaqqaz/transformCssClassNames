const fs = require('fs');
const glob = require('glob');

function updateCase(filePath) {
    const src = fs.readFileSync(filePath, 'utf8');
    const matches = src.match(/\.(.*) {/gm);

    if (!matches) {
        return;
    }

    let result;

    for (const identifier of matches) {
        const camelCase = identifier.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

        const identifierRegExp = new RegExp(identifier.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        result = src.replace(
            identifierRegExp,
            camelCase,
        );
    }

    fs.writeFileSync(filePath, result,'utf8');
}

async function processCSS() {
    const cssPaths = [
        './**/*.css',
    ];

    const cssFiles = cssPaths.reduce((arr, path) => ([...arr, ...glob.sync(path)]), []);
    await Promise.all(cssFiles.map(updateCase));
}

processCSS().then(
    () => {
        console.log('done');
    }
);
