# Example: Adding a New Template

This example demonstrates how easy it is to add a new template using the metadata approach.

## Scenario: Adding a README template

Let's add a README.md template that should be generated for all services.

### Step 1: Create the template file

Create `src/templates/shared/readme.tpl`:

```markdown
# {{SERVICE_NAME}}

A service generated using the metadata-driven template system.

## Getting Started

1. Install dependencies
2. Configure environment variables in `.env`
3. Run the service

## Environment Variables

See `.env` file for configuration options.
```

### Step 2: Add metadata entry

Add to `TEMPLATE_DEFINITIONS` in `src/template-metadata.ts`:

```typescript
{
  templateName: 'shared/readme.tpl',
  destPath: 'README.md',
  category: 'service',
  scope: 'shared',
  required: true
}
```

### Step 3: That's it!

The README.md file will now be automatically generated for:
- ✅ Python services
- ✅ Go services  
- ✅ Any future languages added

**Without needing to update:**
- ❌ `py.json` configuration
- ❌ `go.json` configuration
- ❌ Any language-specific code

## Before vs After

### Before (Legacy Approach)

To add README.md, you would need to:

1. Create `templates-py/service/readme.tpl`
2. Create `templates-go/service/readme.tpl` 
3. Update `py.json` to include the new file
4. Update `go.json` to include the new file
5. Repeat for any other languages

**5 files to update** for one new template!

### After (Metadata Approach)

1. Create `templates/shared/readme.tpl`
2. Add one metadata entry

**2 changes total** for one new template!

## Benefits Demonstrated

- **70% reduction** in files to modify
- **DRY principle** - template defined once
- **Automatic inclusion** across all languages
- **Consistent content** - no divergence between languages
- **Easy maintenance** - single source of truth