const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const chalk = require('chalk');

const timeLabel = 'i18n build time';

const yamlDir = './localization/translations';
const jsonDir = './public/i18n/';

const yamlExt = /\.(yaml|yml)$/;

console.time(timeLabel);

if (!fs.existsSync(jsonDir)) {
    const path = fs.mkdirSync(jsonDir, { recursive: true });
    console.log(chalk.green(`Created json dir [${path}]`));
}

let convertedFiles = 0;

fs.readdirSync(yamlDir).forEach(file => {
    if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const yamlFilePath = path.join(yamlDir, file);
        const jsonFilePath = path.join(jsonDir, file.replace(yamlExt, '.json'));

        if (!fs.existsSync(jsonFilePath) || fs.statSync(yamlFilePath).mtime > fs.statSync(jsonFilePath).mtime) {
            const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
            const jsonContent = JSON.stringify(yaml.parse(yamlContent), null, 2);

            fs.writeFileSync(jsonFilePath, jsonContent);
            console.log(chalk.blue(`Converted: ${file} -> ${file.replace(yamlExt, '.json')}`));

            convertedFiles++;
        } else {
            console.log(chalk.gray(`No changes detected for ${file}`));
        }
    }
});

if (convertedFiles) {
    console.log(chalk.green(`Converted ${convertedFiles} files`));
    console.timeEnd(timeLabel);
} else {
    console.log(chalk.gray('No YAML conversion performed'));
}
