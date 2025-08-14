import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import { writeMultipleTemplates, mkdirs } from "./utils/template-service";
import { LogService } from "./utils/log-service";

export async function createService({
  serviceName,
  cwd = process.cwd(),
  language = "go",
  test = false,
}: {
  serviceName: string;
  cwd?: string;
  language?: string;
  test?: boolean;
}) {
  const logger = new LogService(test);

  if (!cwd) {
    //use current working directory
    cwd = process.cwd();
  }

  const serviceDir = path.join(cwd, serviceName);
  fs.mkdirSync(serviceDir);
  process.chdir(serviceDir);

  const {
    service: { directories, files },
  } = await import(`./language-config/${language}.json`);

  // Create directories
  logger.info("Creating directories...");
  mkdirs(directories);

  // Generate files from templates
  logger.info("Creating files...");
  writeMultipleTemplates(files, language, {
    SERVICE_NAME: serviceName,
  });

  // go.mod and dependencies
  // execSync(`go mod init ${serviceName}`, { stdio: "inherit" });
  // execSync("go get github.com/gin-gonic/gin", { stdio: "inherit" });
  // execSync("go get github.com/swaggo/gin-swagger", { stdio: "inherit" });
  // execSync("go get github.com/swaggo/files", { stdio: "inherit" });
  // execSync("go get gorm.io/gorm", { stdio: "inherit" });
  // execSync("go get gorm.io/driver/postgres", { stdio: "inherit" });

  // Install swag CLI if not present
  // try {
  //   execSync("swag --version", { stdio: "ignore" });
  // } catch {
  //   execSync("go install github.com/swaggo/swag/cmd/swag@latest", {
  //     stdio: "inherit",
  //   });
  // }
  // process.env.PATH = `${process.env.GOPATH || ""}/bin:${process.env.PATH}`;

  // Copy new-module scripts
  logger.info("Copying new-module scripts...");
  fs.mkdirSync("scripts", { recursive: true });
  execSync("cp -R ../scripts/new-module scripts/");
  execSync("cp -R ../scripts/new-module.sh ./");

  // Git
  logger.info("Initializing git repository...");
  execSync("git init", { stdio: "inherit" });

  // Swagger docs
  // try {
  //   execSync("swag init -g ./cmd/main.go -o ./docs/swagger", {
  //     stdio: "inherit",
  //   });
  // } catch {
  //   console.warn(
  //     "⚠️  swag CLI not found or failed, please ensure it's installed and in your PATH."
  //   );
  // }

  // Create DB (local or Docker)
  try {
    logger.info("Creating database...");
    execSync(`createdb ${serviceName}`, { stdio: "inherit" });
  } catch {
    // Try Docker
    try {
      const container = execSync(
        "docker ps --filter ancestor=postgres --format '{{.ID}}' | head -n 1"
      )
        .toString()
        .trim();
      if (!container) {
        logger.error(
          "Error: No running postgres Docker container found. Please start your postgres container."
        );
      } else {
        try {
          execSync(
            `docker exec -u postgres ${container} psql -tc \"SELECT 1 FROM pg_database WHERE datname = '${serviceName}'\" | grep -q 1 || docker exec -u postgres ${container} createdb ${serviceName}`
          );
        } catch {
          return;
        }
      }
    } catch {
      logger.warn("Could not create database locally or in Docker.");
    }
  }

  // Final steps
  // execSync("go mod tidy", { stdio: "inherit" });
}

// Example usage GO:
// createService({ serviceName: "test", language: "go", test: true });

// Example usage python:
createService({ serviceName: "test-python", language: "py", test: true });
