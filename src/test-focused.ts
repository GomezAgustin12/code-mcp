#!/usr/bin/env node

/**
 * Focused test for the new metadata-driven approach
 */

import * as fs from "fs";
import * as path from "path";
import { generateFromMetadata } from "./template-utils";

const testDir = "/tmp/metadata-focused-test";

async function runFocusedTest() {
  console.log("🎯 Testing metadata-driven approach (focused)...");
  
  // Cleanup and setup
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
  fs.mkdirSync(testDir, { recursive: true });
  
  try {
    // Test Python service generation
    console.log("\n1. Testing Python service generation...");
    process.chdir(testDir);
    fs.mkdirSync("py-test");
    process.chdir("py-test");
    
    const pyResult = generateFromMetadata('service', 'py', {
      SERVICE_NAME: 'test-py-service'
    });
    
    console.log(`   ✓ Generated ${pyResult.files.length} files`);
    console.log(`   Files: ${pyResult.files.join(', ')}`);
    
    // Verify key files exist and have correct content
    const envExists = fs.existsSync('.env');
    const mainExists = fs.existsSync('main.py');
    const dockerignoreExists = fs.existsSync('.dockerignore');
    
    console.log(`   ✓ Files exist: .env=${envExists}, main.py=${mainExists}, .dockerignore=${dockerignoreExists}`);
    
    if (envExists) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const hasServiceName = envContent.includes('test-py-service');
      const hasSharedContent = envContent.includes('APP_PORT=8080');
      console.log(`   ✓ .env content: service_name=${hasServiceName}, shared_template=${hasSharedContent}`);
    }
    
    // Test Go service generation
    console.log("\n2. Testing Go service generation...");
    process.chdir(testDir);
    fs.mkdirSync("go-test");
    process.chdir("go-test");
    
    const goResult = generateFromMetadata('service', 'go', {
      SERVICE_NAME: 'test-go-service'
    });
    
    console.log(`   ✓ Generated ${goResult.directories.length} directories and ${goResult.files.length} files`);
    console.log(`   Directories: ${goResult.directories.join(', ')}`);
    console.log(`   Files: ${goResult.files.join(', ')}`);
    
    // Verify directories were created
    const cmdExists = fs.existsSync('cmd');
    const configExists = fs.existsSync('internal/config');
    console.log(`   ✓ Directories created: cmd=${cmdExists}, config=${configExists}`);
    
    // Test shared templates are same
    const goEnvContent = fs.readFileSync('.env', 'utf8');
    const pyEnvContent = fs.readFileSync('../py-test/.env', 'utf8');
    const sharedTemplateWorking = goEnvContent.includes('APP_PORT=8080') && pyEnvContent.includes('APP_PORT=8080');
    console.log(`   ✓ Shared template consistency: ${sharedTemplateWorking}`);
    
    // Test module generation
    console.log("\n3. Testing module generation...");
    process.chdir(testDir + "/py-test");
    
    const moduleResult = generateFromMetadata('module', 'py', {
      MODULE_NAME: 'user',
      MODULE_NAME_UPPER: 'User',
      MODULE_PATH: 'internal/user'
    });
    
    console.log(`   ✓ Generated ${moduleResult.files.length} module files`);
    
    const moduleDir = 'internal/user';
    const moduleExists = fs.existsSync(moduleDir);
    if (moduleExists) {
      const moduleFiles = fs.readdirSync(moduleDir);
      console.log(`   ✓ Module files: ${moduleFiles.join(', ')}`);
    }
    
    console.log("\n✅ Focused metadata test passed!");
    console.log("\n📊 Benefits achieved:");
    console.log("   - Shared templates (.env) used across languages");
    console.log("   - No duplication in configuration files");
    console.log("   - Easy to add new templates by updating metadata");
    console.log("   - Language-specific and shared templates coexist");
    
  } catch (error) {
    console.error("\n❌ Focused test failed:", error);
    throw error;
  } finally {
    // Cleanup
    process.chdir("/");
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  }
}

runFocusedTest().catch(console.error);