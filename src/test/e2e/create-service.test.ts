import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createService } from '../../create-service.js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

// Get __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Mock execSync to avoid actual system commands during testing
vi.mock('child_process', () => ({
  execSync: vi.fn((cmd, options) => {
    // Allow git init to run for real
    if (cmd === 'git init') {
      return require('child_process').execSync(cmd, options)
    }
    // Mock other commands
    if (cmd.includes('createdb')) {
      throw new Error('createdb: command not found')
    }
    if (cmd.includes('cp -R ../scripts/new-module')) {
      // Mock the copying - we'll handle this in our test setup
      return ''
    }
    if (cmd.includes('cp -R ../scripts/new-module.sh')) {
      return ''
    }
    return ''
  })
}))

describe('createService E2E', () => {
  const testWorkspace = path.join(__dirname, 'temp-test-workspace')
  const originalCwd = process.cwd()
  
  // Mock console methods to capture logs during tests
  const consoleMocks = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }

  beforeEach(() => {
    // Create a temporary workspace for testing
    if (fs.existsSync(testWorkspace)) {
      fs.rmSync(testWorkspace, { recursive: true, force: true })
    }
    fs.mkdirSync(testWorkspace, { recursive: true })
    
    // Create necessary source templates directory structure if it doesn't exist
    const srcPath = path.join(testWorkspace, 'src')
    fs.mkdirSync(srcPath, { recursive: true })
    
    // Copy the language config and templates to test workspace
    const languageConfigDir = path.join(srcPath, 'language-config')
    const templatesDir = path.join(srcPath, 'templates')
    const scriptsDir = path.join(testWorkspace, 'scripts')
    
    fs.mkdirSync(languageConfigDir, { recursive: true })
    fs.mkdirSync(templatesDir, { recursive: true })
    fs.mkdirSync(scriptsDir, { recursive: true })
    
    // Copy language config
    const originalLanguageConfigDir = path.join(originalCwd, 'src', 'language-config')
    if (fs.existsSync(originalLanguageConfigDir)) {
      fs.cpSync(originalLanguageConfigDir, languageConfigDir, { recursive: true })
    }
    
    // Copy templates
    const originalTemplatesDir = path.join(originalCwd, 'src', 'templates')
    if (fs.existsSync(originalTemplatesDir)) {
      fs.cpSync(originalTemplatesDir, templatesDir, { recursive: true })
    }
    
    // Copy scripts
    const originalScriptsDir = path.join(originalCwd, 'scripts')
    if (fs.existsSync(originalScriptsDir)) {
      fs.cpSync(originalScriptsDir, scriptsDir, { recursive: true })
    }
    
    // Create a new-module.sh in the test workspace root as well
    const newModuleShPath = path.join(testWorkspace, 'new-module.sh')
    const originalNewModuleShPath = path.join(originalCwd, 'scripts', 'new-module.sh')
    if (fs.existsSync(originalNewModuleShPath)) {
      fs.copyFileSync(originalNewModuleShPath, newModuleShPath)
    }

    // Mock console methods
    vi.spyOn(console, 'info').mockImplementation(consoleMocks.info)
    vi.spyOn(console, 'warn').mockImplementation(consoleMocks.warn)
    vi.spyOn(console, 'error').mockImplementation(consoleMocks.error)
    vi.spyOn(console, 'debug').mockImplementation(consoleMocks.debug)
  })

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd)
    
    // Clean up test workspace
    if (fs.existsSync(testWorkspace)) {
      fs.rmSync(testWorkspace, { recursive: true, force: true })
    }
    
    // Restore console methods
    vi.restoreAllMocks()
    
    // Clear mock calls
    Object.values(consoleMocks).forEach(mock => mock.mockClear())
    
    // Clear execSync mock calls
    vi.clearAllMocks()
  })

  it('should create a new Go service with correct directory structure', async () => {
    const serviceName = 'test-service'
    
    await createService({
      serviceName,
      cwd: testWorkspace,
      language: 'go',
      test: true  // Enable logging for testing
    })

    const serviceDir = path.join(testWorkspace, serviceName)

    // Check that service directory was created
    expect(fs.existsSync(serviceDir)).toBe(true)
    expect(fs.statSync(serviceDir).isDirectory()).toBe(true)

    // Check required directories were created
    const expectedDirectories = ['cmd', 'internal/config', 'diagrams', 'scripts']
    
    for (const dir of expectedDirectories) {
      const dirPath = path.join(serviceDir, dir)
      expect(fs.existsSync(dirPath)).toBe(true)
      expect(fs.statSync(dirPath).isDirectory()).toBe(true)
    }

    // Check required files were created
    const expectedFiles = [
      '.env',
      'internal/config/config.go',
      'cmd/main.go'
    ]

    for (const file of expectedFiles) {
      const filePath = path.join(serviceDir, file)
      expect(fs.existsSync(filePath)).toBe(true)
      expect(fs.statSync(filePath).isFile()).toBe(true)
    }

    // Verify .git directory was initialized
    const gitDir = path.join(serviceDir, '.git')
    expect(fs.existsSync(gitDir)).toBe(true)
    expect(fs.statSync(gitDir).isDirectory()).toBe(true)
  })

  it('should generate files with correct service name substitution', async () => {
    const serviceName = 'my-awesome-service'
    
    await createService({
      serviceName,
      cwd: testWorkspace,
      language: 'go',
      test: true
    })

    const serviceDir = path.join(testWorkspace, serviceName)
    const mainGoPath = path.join(serviceDir, 'cmd', 'main.go')
    
    // Read the generated main.go file
    if (fs.existsSync(mainGoPath)) {
      const mainGoContent = fs.readFileSync(mainGoPath, 'utf8')
      
      // Check that SERVICE_NAME was replaced with the actual service name
      // This assumes the template contains {{SERVICE_NAME}} placeholders
      expect(mainGoContent).toContain(serviceName)
      expect(mainGoContent).not.toContain('{{SERVICE_NAME}}')
    }
  })

  it('should default to go language when not specified', async () => {
    const serviceName = 'default-language-service'
    
    await createService({
      serviceName,
      cwd: testWorkspace,
      // language not specified, should default to 'go'
      test: true
    })

    const serviceDir = path.join(testWorkspace, serviceName)
    expect(fs.existsSync(serviceDir)).toBe(true)
    
    // Should have Go-specific files
    const goConfigPath = path.join(serviceDir, 'internal/config/config.go')
    const goMainPath = path.join(serviceDir, 'cmd/main.go')
    expect(fs.existsSync(goConfigPath)).toBe(true)
    expect(fs.existsSync(goMainPath)).toBe(true)
  })

  it('should handle unsupported languages gracefully', async () => {
    const serviceName = 'unsupported-service'
    
    // Test with a language that doesn't exist
    await expect(createService({
      serviceName,
      cwd: testWorkspace,
      language: 'rust', // This language config doesn't exist
      test: true
    })).rejects.toThrow() // Should fail when trying to import non-existent config
  })

  it('should use default current working directory when cwd is not provided', async () => {
    const serviceName = 'default-cwd-service'
    
    // Change to test workspace first
    process.chdir(testWorkspace)
    
    await createService({
      serviceName,
      language: 'go',
      test: true
    })

    const serviceDir = path.join(testWorkspace, serviceName)
    expect(fs.existsSync(serviceDir)).toBe(true)
  })

  it('should log appropriate messages during service creation', async () => {
    const serviceName = 'logging-test-service'
    
    await createService({
      serviceName,
      cwd: testWorkspace,
      language: 'go',
      test: true  // Enable logging
    })

    // Check that info logs were called with expected formatted messages
    expect(consoleMocks.info).toHaveBeenCalledWith('\x1b[34m[INFO] Creating directories...\x1b[0m')
    expect(consoleMocks.info).toHaveBeenCalledWith('\x1b[34m[INFO] Creating files...\x1b[0m')
    expect(consoleMocks.info).toHaveBeenCalledWith('\x1b[34m[INFO] Copying new-module scripts...\x1b[0m')
    expect(consoleMocks.info).toHaveBeenCalledWith('\x1b[34m[INFO] Initializing git repository...\x1b[0m')
  })

  it('should handle database creation gracefully when commands fail', async () => {
    const serviceName = 'db-test-service'
    
    // This test verifies the service creation completes even if database creation fails
    await expect(createService({
      serviceName,
      cwd: testWorkspace,
      language: 'go',
      test: true
    })).resolves.not.toThrow()

    const serviceDir = path.join(testWorkspace, serviceName)
    expect(fs.existsSync(serviceDir)).toBe(true)
  })

  it('should create service in nested directory path', async () => {
    const serviceName = 'nested-service'
    const nestedWorkspace = path.join(testWorkspace, 'projects', 'backend')
    
    // Create nested directory
    fs.mkdirSync(nestedWorkspace, { recursive: true })
    
    await createService({
      serviceName,
      cwd: nestedWorkspace,
      language: 'go',
      test: true
    })

    const serviceDir = path.join(nestedWorkspace, serviceName)
    expect(fs.existsSync(serviceDir)).toBe(true)
    
    // Verify basic structure
    expect(fs.existsSync(path.join(serviceDir, 'cmd'))).toBe(true)
    expect(fs.existsSync(path.join(serviceDir, 'internal', 'config'))).toBe(true)
  })

  it('should handle service creation when current directory changes', async () => {
    const serviceName = 'directory-change-service'
    const initialCwd = process.cwd()
    
    await createService({
      serviceName,
      cwd: testWorkspace,
      language: 'go',
      test: true
    })

    // Verify that the service was created in the correct location
    const serviceDir = path.join(testWorkspace, serviceName)
    expect(fs.existsSync(serviceDir)).toBe(true)
    
    // Verify that we're in the service directory after creation (as per the function logic)
    expect(process.cwd()).toBe(serviceDir)
  })
})
