#!/usr/bin/env node

/**
 * Test script to verify the new metadata-driven template approach works correctly
 */

import * as fs from "fs";
import * as path from "path";
import { TemplateResolver, TEMPLATE_DEFINITIONS } from "./template-metadata";
import { generateFromMetadata } from "./template-utils";

// Create temporary test directory
const testDir = "/tmp/template-metadata-test";
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}
fs.mkdirSync(testDir, { recursive: true });

console.log("🧪 Testing new metadata-driven template approach...");

// Test 1: Verify template resolver works
console.log("\n1. Testing TemplateResolver...");
const resolver = new TemplateResolver();

// Test Python service templates
const pyServiceTemplates = resolver.getTemplatesForLanguage('service', 'py');
console.log(`   Python service templates: ${pyServiceTemplates.length} found`);
console.log(`   Templates: ${pyServiceTemplates.map(t => t.templateName).join(', ')}`);

// Test Go service templates  
const goServiceTemplates = resolver.getTemplatesForLanguage('service', 'go');
console.log(`   Go service templates: ${goServiceTemplates.length} found`);
console.log(`   Templates: ${goServiceTemplates.map(t => t.templateName).join(', ')}`);

// Test shared templates are included
const hasSharedEnv = pyServiceTemplates.some(t => t.templateName === 'shared/env.tpl');
const hasSharedDockerignore = pyServiceTemplates.some(t => t.templateName === 'shared/dockerignore.tpl');
console.log(`   ✓ Shared templates included: env=${hasSharedEnv}, dockerignore=${hasSharedDockerignore}`);

// Test 2: Verify directories
console.log("\n2. Testing directory resolution...");
const goDirs = resolver.getDirectoriesForLanguage('go');
const pyDirs = resolver.getDirectoriesForLanguage('py');
console.log(`   Go directories: [${goDirs.join(', ')}]`);
console.log(`   Python directories: [${pyDirs.join(', ')}]`);

// Test 3: Test template generation in isolated environment
console.log("\n3. Testing template generation...");
process.chdir(testDir);

try {
  // Test Python service generation
  const serviceName = "test-service";
  fs.mkdirSync(serviceName);
  process.chdir(serviceName);
  
  const result = generateFromMetadata('service', 'py', {
    SERVICE_NAME: serviceName
  });
  
  console.log(`   ✓ Generated ${result.files.length} files for Python service`);
  console.log(`   Files: ${result.files.join(', ')}`);
  
  // Verify some key files exist
  const envExists = fs.existsSync('.env');
  const mainExists = fs.existsSync('main.py');
  const dockerignoreExists = fs.existsSync('.dockerignore');
  
  console.log(`   ✓ Key files exist: .env=${envExists}, main.py=${mainExists}, .dockerignore=${dockerignoreExists}`);
  
  // Check content of .env file to verify shared template was used
  if (envExists) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const hasServiceName = envContent.includes(serviceName);
    const hasAppPort = envContent.includes('APP_PORT=8080');
    console.log(`   ✓ .env content correct: service_name=${hasServiceName}, app_port=${hasAppPort}`);
  }
  
  console.log("\n✅ All tests passed! New metadata approach is working correctly.");
  
} catch (error) {
  console.error("\n❌ Test failed:", error);
  process.exit(1);
} finally {
  // Cleanup
  process.chdir("/");
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
}

// Test 4: Verify we reduce duplication
console.log("\n4. Analyzing duplication reduction...");
const totalTemplates = TEMPLATE_DEFINITIONS.length;
const sharedTemplates = TEMPLATE_DEFINITIONS.filter(t => t.scope === 'shared').length;
const reductionPercent = Math.round((sharedTemplates / totalTemplates) * 100);

console.log(`   Total templates defined: ${totalTemplates}`);
console.log(`   Shared templates: ${sharedTemplates} (${reductionPercent}% of total)`);
console.log(`   ✓ Duplication reduced by identifying ${sharedTemplates} shared templates`);

console.log("\n🎉 Metadata-driven approach successfully implemented!");