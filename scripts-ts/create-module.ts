import * as fs from "fs";
import * as path from "path";
import { writeTemplate, writeMultipleTemplates, writeTemplatesFromConfig } from "./template-utils";
import { getTemplateConfig } from "./template-discovery";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function createModule({
  moduleName,
  serviceDir = process.cwd(),
  mainGoPath = "cmd/main.go",
  useDiscovery = true,
}: {
  moduleName: string;
  serviceDir?: string;
  mainGoPath?: string;
  useDiscovery?: boolean;
}) {
  const moduleDir = path.join(serviceDir, "internal", moduleName);
  fs.mkdirSync(moduleDir, { recursive: true });
  const moduleNameUpper = capitalize(moduleName);

  if (useDiscovery) {
    // Use new template discovery system
    // For now, we need to detect the language from the project structure
    // This could be enhanced to be passed as a parameter
    const language = fs.existsSync(path.join(serviceDir, "go.mod")) ? "go" : "py";
    
    const config = getTemplateConfig(language, "module");
    const variables = {
      MODULE_NAME: moduleName,
      MODULE_NAME_UPPER: moduleNameUpper,
      module_name: moduleName,
      moduleName: moduleName,
    };
    
    writeTemplatesFromConfig(config, variables, language);
  } else {
    // Original hardcoded template system
    writeMultipleTemplates([
      {
        templateName: "module/model.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.model.go`),
        variables: {
          MODULE_NAME: moduleName,
          MODULE_NAME_UPPER: moduleNameUpper,
        },
      },
      {
        templateName: "module/repository.go.tpl", 
        destPath: path.join(moduleDir, `${moduleName}.repository.go`),
        variables: {
          MODULE_NAME: moduleName,
          MODULE_NAME_UPPER: moduleNameUpper,
        },
      },
      {
        templateName: "module/service.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.service.go`),
        variables: {
          MODULE_NAME: moduleName,
          MODULE_NAME_UPPER: moduleNameUpper,
        },
      },
      {
        templateName: "module/use-cases.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.use-cases.go`),
        variables: {
          MODULE_NAME: moduleName,
          MODULE_NAME_UPPER: moduleNameUpper,
        },
      },
    ]);
  }

  // Register module in main.go
  const mainGo = path.join(serviceDir, mainGoPath);
  let mainGoContent = fs.readFileSync(mainGo, "utf8");
  const registrationCode = `    // Register ${moduleNameUpper}s\n    ${moduleName}Repo := ${moduleName}.NewRepository(db)\n    ${moduleName}Service := ${moduleName}.NewService(${moduleName}Repo)\n    ${moduleName}UseCases := ${moduleName}.NewUseCases(${moduleName}Service)\n    ${moduleName}UseCases.Register(router)\n\n    // USE THIS COMMENT TO AUTO-GENERATE NEW MODULES`;
  mainGoContent = mainGoContent.replace(
    /\s*\/\/ USE THIS COMMENT TO AUTO-GENERATE NEW MODULES/g,
    "\n" + registrationCode
  );
  fs.writeFileSync(mainGo, mainGoContent);

  //   execSync("go mod tidy", { stdio: "inherit" });
}
