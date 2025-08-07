import * as fs from "fs";
import * as path from "path";
import { writeMultipleTemplates } from "./template-utils.js";
import { LogService } from "./utils/log-service.js";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function createModule({
  moduleName,
  serviceDir = process.cwd(),
  mainGoPath = "cmd/main.go",
  language = "go",
  test = false,
}: {
  moduleName: string;
  serviceDir?: string;
  mainGoPath?: string;
  language?: string;
  test?: boolean;
}) {
  const logger = new LogService(test);

  logger.info(`Creating module: ${moduleName} in ${serviceDir}`);
  const moduleDir = path.join(serviceDir, "internal", moduleName);
  fs.mkdirSync(moduleDir, { recursive: true });
  const moduleNameUpper = capitalize(moduleName);

  // Generate Go files from templates (now organized in subfolders)
  logger.info("Generating module files...");
  writeMultipleTemplates(
    [
      {
        templateName: "module/model.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.model.go`),
      },
      {
        templateName: "module/repository.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.repository.go`),
      },
      {
        templateName: "module/service.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.service.go`),
      },
      {
        templateName: "module/use-cases.go.tpl",
        destPath: path.join(moduleDir, `${moduleName}.use-cases.go`),
      },
    ],
    language,
    {
      MODULE_NAME: moduleName,
      MODULE_NAME_UPPER: moduleNameUpper,
    }
  );

  // Register module in main.go
  logger.info("Updating main.go to register the new module...");
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

// Example usage:
// createModule({
//   moduleName: "user",
//   serviceDir: `${process.cwd()}/test`,
//   mainGoPath: "cmd/main.go",
//   language: "go",
//   test: true,
// });
