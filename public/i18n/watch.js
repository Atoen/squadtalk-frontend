const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const chalk = require('chalk');
const chokidar = require('chokidar');

const yamlDir = './public/i18n';
const jsonDir = './public/i18n/generated';
const yamlExt = /\.(yaml|yml)$/;

if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
    console.log(chalk.green(`Created json dir [${jsonDir}]`));
}

function convertFile(filePath) {
    const filename = path.basename(filePath);
    if (!yamlExt.test(filename)) return;

    const yamlFilePath = filePath;
    const jsonFilePath = path.join(jsonDir, filename.replace(yamlExt, '.json'));

    try {
        const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
        const jsonContent = JSON.stringify(yaml.parse(yamlContent), null, 2);

        fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });

        fs.writeFileSync(jsonFilePath, jsonContent);
        console.log(chalk.blue(`Converted: ${filename} -> ${jsonFilePath}`));
    } catch (error) {
        console.error(chalk.red(`Error converting ${filename}:`), error);
    }
}

chokidar.watch(yamlDir, { persistent: true, ignoreInitial: true })
    .on('add', convertFile)
    .on('change', convertFile);

console.log(chalk.green('Watching for YAML file changes...'));
