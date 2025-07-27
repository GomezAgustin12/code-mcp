import * as fs from "fs";
import * as path from "path";
// Extract metadata from template file comments
export function extractTemplateMetadata(templatePath, templateName) {
    if (!fs.existsSync(templatePath)) {
        return null;
    }
    const content = fs.readFileSync(templatePath, "utf8");
    const lines = content.split("\n").slice(0, 10); // Check first 10 lines for metadata
    let destPath = null;
    let variables = {};
    let dependencies = [];
    for (const line of lines) {
        const trimmed = line.trim();
        // Check for destination path metadata
        if (trimmed.startsWith("# Template-Destination:") || trimmed.startsWith("// Template-Destination:")) {
            destPath = trimmed.split(":")[1]?.trim();
        }
        // Check for variables metadata
        if (trimmed.startsWith("# Template-Variables:") || trimmed.startsWith("// Template-Variables:")) {
            const varList = trimmed.split(":")[1]?.trim();
            if (varList) {
                // Parse variables like "SERVICE_NAME, MODULE_NAME"
                varList.split(",").forEach(v => {
                    const varName = v.trim();
                    variables[varName] = varName.toLowerCase();
                });
            }
        }
        // Check for dependencies metadata
        if (trimmed.startsWith("# Template-Dependencies:") || trimmed.startsWith("// Template-Dependencies:")) {
            const depList = trimmed.split(":")[1]?.trim();
            if (depList) {
                dependencies = depList.split(",").map(d => d.trim());
            }
        }
    }
    // If no destination path found in metadata, try to infer from template name
    if (!destPath) {
        destPath = inferDestinationPath(templateName);
    }
    if (!destPath) {
        return null;
    }
    return {
        templateName,
        destPath,
        variables,
        dependencies
    };
}
// Infer destination path from template name when metadata is not available
function inferDestinationPath(templateName) {
    // Remove .tpl extension and convert to appropriate path
    const baseName = templateName.replace(/\.tpl$/, "");
    // Common patterns
    if (baseName.includes("config.go"))
        return "internal/config/config.go";
    if (baseName.includes("config.py"))
        return "internal/config/config.py";
    if (baseName.includes("main.go"))
        return "cmd/main.go";
    if (baseName.includes("main.py"))
        return "main.py";
    if (baseName.includes("env"))
        return ".env";
    if (baseName.includes("Dockerfile"))
        return "Dockerfile";
    if (baseName.includes("docker-compose"))
        return "docker-compose.yml";
    if (baseName.includes("requirements"))
        return "requirements.txt";
    if (baseName.includes(".dockerignore"))
        return ".dockerignore";
    if (baseName.includes("database.py"))
        return "internal/database/database.py";
    // Module patterns - these need special handling
    if (baseName.includes("model.go"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.model.go";
    if (baseName.includes("model.py"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.model.py";
    if (baseName.includes("repository.go"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.repository.go";
    if (baseName.includes("repository.py"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.repository.py";
    if (baseName.includes("service.go"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.service.go";
    if (baseName.includes("service.py"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.service.py";
    if (baseName.includes("use-cases.go"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.use-cases.go";
    if (baseName.includes("use-cases.py"))
        return "internal/{{MODULE_NAME}}/{{MODULE_NAME}}.use-cases.py";
    return null;
}
// Discover templates for a specific language and type
export function discoverTemplates(language, type, templatesDir = ".") {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const baseDir = path.join(__dirname, templatesDir);
    const languageDir = path.join(baseDir, `templates-${language}`, type);
    const commonDir = path.join(baseDir, "templates-common", type);
    const directories = new Set();
    const files = [];
    // Function to process templates in a directory
    function processTemplateDir(dir, isOverride = false) {
        if (!fs.existsSync(dir)) {
            return;
        }
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            if (stat.isFile() && item.endsWith(".tpl")) {
                const templateName = path.join(type, item);
                const metadata = extractTemplateMetadata(itemPath, templateName);
                if (metadata) {
                    // Add dependencies as directories
                    if (metadata.dependencies) {
                        metadata.dependencies.forEach(dep => directories.add(dep));
                    }
                    // Extract directory from destination path
                    const destDir = path.dirname(metadata.destPath);
                    if (destDir && destDir !== ".") {
                        directories.add(destDir);
                    }
                    // Check if this template already exists (language override)
                    const existingIndex = files.findIndex(f => f.templateName === templateName);
                    if (existingIndex >= 0 && isOverride) {
                        // Replace with language-specific version
                        files[existingIndex] = metadata;
                    }
                    else if (existingIndex < 0) {
                        // Add new template
                        files.push(metadata);
                    }
                }
            }
        }
    }
    // Process common templates first
    processTemplateDir(commonDir, false);
    // Process language-specific templates (these override common ones)
    processTemplateDir(languageDir, true);
    return {
        directories: Array.from(directories),
        files
    };
}
// Get template configuration for backward compatibility
export function getTemplateConfig(language, type) {
    return discoverTemplates(language, type);
}
