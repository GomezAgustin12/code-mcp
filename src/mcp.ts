import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createService } from "./create-service";
import { createModule } from "./create-module";

const server = new McpServer({
  name: "My MCP Server",
  version: "1.0.0",
  description: "A simple Model Context Protocol server example",
});

server.tool(
  "create-service",
  {
    serviceName: z.string().describe("Name of the service to create"),
    cwd: z
      .string()
      .default(process.cwd())
      .describe("Working directory for the service creation"),
    language: z
      .enum(["go", "py"])
      .default("go")
      .describe("Programming language for the service (default: go)"),
  },
  async ({ serviceName, cwd, language }) => {
    // For MCP tools, input is usually on extra.data or extra.arguments
    await createService({
      serviceName,
      cwd,
      language,
    });
    return {
      content: [
        {
          type: "text",
          text: `Service  ${cwd}/'${serviceName}' created.`,
        },
      ],
    };
  }
);

server.tool(
  "create-module",
  {
    moduleName: z.string().describe("Name of the module to create"),
    serviceDir: z
      .string()
      .default(process.cwd())
      .describe("Directory of the service (default: cwd)"),
    mainGoPath: z
      .string()
      .default("cmd/main.go")
      .describe("Path to main.go (default: cmd/main.go)"),
    language: z
      .enum(["go", "py"])
      .default("go")
      .describe("Programming language for the module (default: go)"),
  },
  async ({ moduleName, serviceDir, mainGoPath, language }) => {
    await createModule({
      moduleName,
      serviceDir,
      mainGoPath,
      language: "go",
    });
    return {
      content: [
        {
          type: "text",
          text: `Module ${moduleName} created in ${serviceDir}.`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

export * from "./create-service";
export * from "./create-module";
