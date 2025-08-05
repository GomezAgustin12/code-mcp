import * as fs from "fs";
import * as path from "path";

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
  const templatePath = path.join(
    __dirname,
    `templates-${language}`,
    templateName
  );
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
