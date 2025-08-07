# Template Metadata System

This document describes the new metadata-driven approach for template and file generation that replaces the explicit file lists in language configuration files.

## Problem Solved

The previous approach required maintaining explicit lists of files and directories in each language configuration file (`py.json`, `go.json`), leading to:

- **Duplication**: Same template types listed across languages
- **Maintenance burden**: Adding new templates required updating all language configs
- **Inconsistency**: Shared templates like `.env` were duplicated with slight differences
- **Complexity**: Hard to understand what files would be generated

## New Approach

### Template Metadata System

Templates are now defined with metadata in `src/template-metadata.ts`:

```typescript
export interface TemplateMetadata {
  templateName: string;        // Template file path
  destPath: string;           // Destination path (supports variables)
  category: 'service' | 'module';  // Template category
  scope: 'shared' | 'language-specific';  // Scope
  languages?: string[];       // Target languages (optional)
  required?: boolean;         // Whether template is required
}
```

### Benefits

1. **Reduced Duplication**: Shared templates defined once
2. **Easy Extension**: Add new templates by updating metadata
3. **Clear Categorization**: Templates categorized by scope and purpose
4. **Language Agnostic**: Support for shared templates across languages
5. **Backward Compatible**: Existing configs still work with fallback

### Usage Examples

#### Shared Templates
```typescript
{
  templateName: 'shared/env.tpl',
  destPath: '.env',
  category: 'service',
  scope: 'shared',
  required: true
}
```

#### Language-Specific Templates
```typescript
{
  templateName: 'service/main.py.tpl',
  destPath: 'main.py',
  category: 'service',
  scope: 'language-specific',
  languages: ['py'],
  required: true
}
```

### Template Structure

```
src/templates/
├── shared/                    # Shared templates
│   ├── env.tpl
│   └── dockerignore.tpl
├── templates-go/              # Go-specific templates
│   ├── service/
│   └── module/
└── templates-py/              # Python-specific templates
    ├── service/
    └── module/
```

### Migration Path

Language configs now support a `useMetadata` flag:

```json
{
  "useMetadata": true,
  "service": { /* legacy config for fallback */ }
}
```

When `useMetadata: true`, the system uses the metadata approach. Otherwise, it falls back to the legacy explicit file lists.

## API

### TemplateResolver

```typescript
const resolver = new TemplateResolver();

// Get templates for Python services
const templates = resolver.getTemplatesForLanguage('service', 'py');

// Get directories for Go
const directories = resolver.getDirectoriesForLanguage('go');
```

### generateFromMetadata

```typescript
// Generate service files using metadata
const result = generateFromMetadata('service', 'py', {
  SERVICE_NAME: 'my-service'
});

console.log(`Created ${result.files.length} files`);
```

## Adding New Templates

To add a new template:

1. **Create the template file** in the appropriate directory
2. **Add metadata entry** in `TEMPLATE_DEFINITIONS`
3. **Specify scope**: `shared` for all languages, `language-specific` for specific languages

Example - adding a new shared template:

```typescript
{
  templateName: 'shared/gitignore.tpl',
  destPath: '.gitignore', 
  category: 'service',
  scope: 'shared',
  required: true
}
```

The template will automatically be included for all languages without updating individual language configs.

## Testing

Run the metadata system tests:

```bash
npx tsx src/test-metadata.ts     # Basic metadata functionality
npx tsx src/test-focused.ts      # Focused generation testing
```

Both tests verify:
- Template resolution works correctly
- Shared templates are used consistently
- Language-specific templates are isolated
- File generation produces expected results