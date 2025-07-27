import * as fs from "fs";
import * as path from "path";
// Polyfill __dirname for ESM compatibility
const __dirname = path.dirname(new URL(import.meta.url).pathname);
export function renderTemplate(templatePath, variables) {
    let content = fs.readFileSync(templatePath, "utf8");
    for (const [key, value] of Object.entries(variables)) {
        const re = new RegExp(`{{${key}}}`, "g");
        content = content.replace(re, value);
    }
    return content;
}
export function writeTemplate(templateName, destPath, variables, language = "go") {
    const templatePath = path.join(__dirname, `templates-${language}`, templateName);
    const rendered = renderTemplate(templatePath, variables);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, rendered);
}
export function writeMultipleTemplates(templates, language = "go") {
    for (const { templateName, destPath, variables } of templates) {
        writeTemplate(templateName, destPath, variables, language);
    }
}
export function mkdirs(dirs) {
    for (const dir of dirs) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
// New function to write templates using the discovery system
export function writeTemplatesFromConfig(config, variables, language = "go") {
    // Create directories first
    mkdirs(config.directories);
    // Write files from discovered templates
    for (const template of config.files) {
        // Merge template variables with provided variables
        const allVariables = { ...template.variables, ...variables };
        // Process destination path with variables
        let destPath = template.destPath;
        for (const [key, value] of Object.entries(allVariables)) {
            const re = new RegExp(`{{${key}}}`, "g");
            destPath = destPath.replace(re, value);
        }
        writeTemplate(template.templateName, destPath, allVariables, language);
    }
}
