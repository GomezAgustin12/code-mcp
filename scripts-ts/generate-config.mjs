#!/usr/bin/env node

// This script generates language config files using the new discovery system
// It can be used to populate empty config files or regenerate existing ones

import { discoverTemplates } from "./template-discovery.js";
import * as fs from "fs";
import * as path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

function generateLanguageConfig(language, type = "service") {
  const config = discoverTemplates(language, type);
  
  // Convert to old format for backward compatibility
  const oldFormat = {
    directories: config.directories,
    files: config.files.map(f => ({
      templateName: f.templateName,
      destPath: f.destPath,
      variables: f.variables
    }))
  };
  
  return oldFormat;
}

// Generate py.json
console.log("Generating py.json...");
const pyConfig = generateLanguageConfig("py", "service");
const pyConfigPath = path.join(__dirname, "language-config", "py.json");
fs.writeFileSync(pyConfigPath, JSON.stringify(pyConfig, null, 2));
console.log("Generated py.json:", pyConfigPath);
console.log("Content:", JSON.stringify(pyConfig, null, 2));

// Verify go.json would be the same
console.log("\nVerifying go.json would generate the same result...");
const goConfig = generateLanguageConfig("go", "service");
console.log("Generated go.json content:", JSON.stringify(goConfig, null, 2));

// Compare with existing go.json
const existingGoConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "language-config", "go.json"), "utf8"));
console.log("Existing go.json content:", JSON.stringify(existingGoConfig, null, 2));

console.log("Match:", JSON.stringify(goConfig, null, 2) === JSON.stringify(existingGoConfig, null, 2));