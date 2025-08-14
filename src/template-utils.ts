import * as fs from "fs";
import * as path from "path";
import { TemplateResolver } from "./template-metadata";

// Polyfill __dirname for ESM compatibility
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export function renderTemplate(
  templatePath: string,
  variables: Record<string, string>
): string {
  let content = fs.readFileSync(templatePath, "utf8");
  for (const [key, value] of Object.entries(variables)) {
    const re = new RegExp(`{{${key}}}`, "g");
    content = content.replace(re, value);
  }
  return content;
}

export function writeTemplate(
  templateName: string,
  destPath: string,
  variables: Record<string, string>,
  language: string = "go"
) {
  let templatePath: string;
  
  // Handle shared templates
  if (templateName.startsWith('shared/')) {
    templatePath = path.join(
      __dirname,
      "templates",
      templateName
    );
  } else {
    // Handle language-specific templates
    templatePath = path.join(
      __dirname,
      "templates",
      `templates-${language}`,
      templateName
    );
  }
  
  const rendered = renderTemplate(templatePath, variables);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, rendered);
}

export function writeMultipleTemplates(
  templates: Array<{
    templateName: string;
    destPath: string;
  }>,
  language: string = "go",
  variables: Record<string, string>
) {
  for (const { templateName, destPath } of templates) {
    writeTemplate(templateName, destPath, variables, language);
  }
}

export function mkdirs(dirs: string[]) {
  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate files using the new metadata-driven approach
 */
export function generateFromMetadata(
  category: 'service' | 'module',
  language: string,
  variables: Record<string, string>
) {
  const resolver = new TemplateResolver();
  
  // Get directories to create
  const directories = resolver.getDirectoriesForLanguage(language);
  mkdirs(directories);
  
  // Get templates to generate
  const templates = resolver.getTemplatesForLanguage(category, language);
  
  // Process each template
  for (const template of templates) {
    // Resolve variables in destination path
    let destPath = template.destPath;
    for (const [key, value] of Object.entries(variables)) {
      const re = new RegExp(`{{${key}}}`, "g");
      destPath = destPath.replace(re, value);
    }
    
    writeTemplate(template.templateName, destPath, variables, language);
  }
  
  return {
    directories,
    files: templates.map(t => t.destPath)
  };
}
