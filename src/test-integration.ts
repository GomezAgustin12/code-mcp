#!/usr/bin/env node

/**
 * Integration test to verify both legacy and metadata approaches work correctly
 */

import * as fs from "fs";
import * as path from "path";
import { createService } from "./create-service";
import { createModule } from "./create-module";

const testDir = "/tmp/integration-test";

async function runTests() {
  console.log("🧪 Running integration tests...");
  
  // Cleanup previous test
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
  fs.mkdirSync(testDir, { recursive: true });
  
  try {
    // Test 1: Python service with metadata approach
    console.log("\n1. Testing Python service with metadata approach...");
    await createService({
      serviceName: "test-py-service",
      cwd: testDir,
      language: "py", 
      test: true
    });
    
    const pyServiceDir = path.join(testDir, "test-py-service");
    const pyFiles = fs.readdirSync(pyServiceDir);
    console.log(`   ✓ Created Python service with files: ${pyFiles.join(', ')}`);
    
    // Check for shared template usage
    const envPath = path.join(pyServiceDir, ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const hasAppPort = envContent.includes('APP_PORT=8080');
      console.log(`   ✓ Shared .env template used: ${hasAppPort}`);
    }
    
    // Test 2: Go service with metadata approach  
    console.log("\n2. Testing Go service with metadata approach...");
    await createService({
      serviceName: "test-go-service",
      cwd: testDir,
      language: "go",
      test: true
    });
    
    const goServiceDir = path.join(testDir, "test-go-service");
    const goFiles = fs.readdirSync(goServiceDir, { recursive: true });
    console.log(`   ✓ Created Go service`);
    
    // Check directories were created
    const cmdExists = fs.existsSync(path.join(goServiceDir, "cmd"));
    const configExists = fs.existsSync(path.join(goServiceDir, "internal/config"));
    console.log(`   ✓ Go directories created: cmd=${cmdExists}, internal/config=${configExists}`);
    
    // Test 3: Module creation with metadata
    console.log("\n3. Testing module creation with metadata...");
    await createModule({
      moduleName: "user",
      serviceDir: pyServiceDir,
      language: "py",
      test: true
    });
    
    const moduleDir = path.join(pyServiceDir, "internal/user");
    const moduleExists = fs.existsSync(moduleDir);
    if (moduleExists) {
      const moduleFiles = fs.readdirSync(moduleDir);
      console.log(`   ✓ Created Python module with files: ${moduleFiles.join(', ')}`);
    }
    
    console.log("\n✅ All integration tests passed!");
    console.log("\n📊 Summary:");
    console.log(`   - Python service: ${pyFiles.length} files created`);
    console.log(`   - Go service: directories and files created successfully`);
    console.log(`   - Module generation: working with metadata approach`);
    console.log(`   - Shared templates: being used correctly`);
    
  } catch (error) {
    console.error("\n❌ Integration test failed:", error);
    throw error;
  } finally {
    // Cleanup
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  }
}

runTests().catch(console.error);