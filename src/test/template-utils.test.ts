import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderTemplate } from "../utils/template-service.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("template-utils", () => {
  const testTemplateDir = path.join(__dirname, "temp-test-templates");
  const testTemplatePath = path.join(testTemplateDir, "test-template.txt");

  beforeEach(() => {
    // Create temporary test template directory
    if (!fs.existsSync(testTemplateDir)) {
      fs.mkdirSync(testTemplateDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testTemplateDir)) {
      fs.rmSync(testTemplateDir, { recursive: true, force: true });
    }
  });

  describe("renderTemplate", () => {
    it("should replace single variable in template", () => {
      // Arrange
      const templateContent = "Hello {{name}}!";
      fs.writeFileSync(testTemplatePath, templateContent, "utf8");
      const variables = { name: "World" };

      // Act
      const result = renderTemplate(testTemplatePath, variables);

      // Assert
      expect(result).toBe("Hello World!");
    });

    it("should replace multiple variables in template", () => {
      // Arrange
      const templateContent = "Hello {{name}}! Welcome to {{place}}.";
      fs.writeFileSync(testTemplatePath, templateContent, "utf8");
      const variables = { name: "Alice", place: "Wonderland" };

      // Act
      const result = renderTemplate(testTemplatePath, variables);

      // Assert
      expect(result).toBe("Hello Alice! Welcome to Wonderland.");
    });

    it("should replace multiple occurrences of the same variable", () => {
      // Arrange
      const templateContent = "{{greeting}} {{name}}! How are you {{name}}?";
      fs.writeFileSync(testTemplatePath, templateContent, "utf8");
      const variables = { greeting: "Hi", name: "Bob" };

      // Act
      const result = renderTemplate(testTemplatePath, variables);

      // Assert
      expect(result).toBe("Hi Bob! How are you Bob?");
    });

    it("should handle template with no variables", () => {
      // Arrange
      const templateContent = "This is a static template.";
      fs.writeFileSync(testTemplatePath, templateContent, "utf8");
      const variables = {};

      // Act
      const result = renderTemplate(testTemplatePath, variables);

      // Assert
      expect(result).toBe("This is a static template.");
    });

    it("should leave unreplaced variables unchanged", () => {
      // Arrange
      const templateContent = "Hello {{name}}! Welcome to {{place}}.";
      fs.writeFileSync(testTemplatePath, templateContent, "utf8");
      const variables = { name: "Alice" };

      // Act
      const result = renderTemplate(testTemplatePath, variables);

      // Assert
      expect(result).toBe("Hello Alice! Welcome to {{place}}.");
    });
  });
});
