/**
 * Template metadata system for determining which files and directories 
 * should be created during service/module scaffolding.
 * 
 * This approach reduces duplication by using metadata to categorize templates
 * instead of maintaining explicit lists in each language configuration.
 */

export interface TemplateMetadata {
  /** Template filename relative to templates directory */
  templateName: string;
  /** Destination path pattern (can include variables like {{SERVICE_NAME}}) */
  destPath: string;
  /** Template category */
  category: 'service' | 'module';
  /** Whether template is shared across languages or language-specific */
  scope: 'shared' | 'language-specific';
  /** Languages this template applies to (empty array means all languages) */
  languages?: string[];
  /** Whether this template is required for the category */
  required?: boolean;
}

/**
 * Template definitions using metadata approach.
 * This replaces the need for explicit file lists in language config files.
 */
export const TEMPLATE_DEFINITIONS: TemplateMetadata[] = [
  // Shared service templates (language-agnostic)
  {
    templateName: 'shared/env.tpl',
    destPath: '.env',
    category: 'service',
    scope: 'shared',
    required: true
  },
  {
    templateName: 'shared/dockerignore.tpl', 
    destPath: '.dockerignore',
    category: 'service',
    scope: 'shared',
    required: false
  },
  
  // Language-specific service templates
  {
    templateName: 'service/main.py.tpl',
    destPath: 'main.py',
    category: 'service',
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  {
    templateName: 'service/config.py.tpl',
    destPath: 'config.py', 
    category: 'service',
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  {
    templateName: 'service/database.py.tpl',
    destPath: 'database.py',
    category: 'service', 
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  {
    templateName: 'service/Dockerfile.tpl',
    destPath: 'Dockerfile',
    category: 'service',
    scope: 'language-specific', 
    languages: ['py'],
    required: false
  },
  {
    templateName: 'service/docker-compose.yml.tpl',
    destPath: 'docker-compose.yml',
    category: 'service',
    scope: 'language-specific',
    languages: ['py'], 
    required: false
  },
  {
    templateName: 'service/requirements.txt.tpl',
    destPath: 'requirements.txt',
    category: 'service',
    scope: 'language-specific',
    languages: ['py'],
    required: false
  },
  
  // Go service templates
  {
    templateName: 'service/main.go.tpl',
    destPath: 'cmd/main.go',
    category: 'service',
    scope: 'language-specific',
    languages: ['go'],
    required: true
  },
  {
    templateName: 'service/config.go.tpl', 
    destPath: 'internal/config/config.go',
    category: 'service',
    scope: 'language-specific',
    languages: ['go'],
    required: true
  },
  
  // Module templates (both languages follow similar patterns)
  {
    templateName: 'module/model.py.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.model.py',
    category: 'module',
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  {
    templateName: 'module/repository.py.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.repository.py',
    category: 'module',
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  {
    templateName: 'module/service.py.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.service.py',
    category: 'module',
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  {
    templateName: 'module/use-cases.py.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.use-cases.py',
    category: 'module',
    scope: 'language-specific',
    languages: ['py'],
    required: true
  },
  
  // Go module templates
  {
    templateName: 'module/model.go.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.model.go',
    category: 'module',
    scope: 'language-specific',
    languages: ['go'],
    required: true
  },
  {
    templateName: 'module/repository.go.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.repository.go',
    category: 'module',
    scope: 'language-specific',
    languages: ['go'],
    required: true
  },
  {
    templateName: 'module/service.go.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.service.go',
    category: 'module',
    scope: 'language-specific',
    languages: ['go'],
    required: true
  },
  {
    templateName: 'module/use-cases.go.tpl',
    destPath: '{{MODULE_PATH}}/{{MODULE_NAME}}.use-cases.go',
    category: 'module',
    scope: 'language-specific',
    languages: ['go'],
    required: true
  }
];

/**
 * Service directory definitions that apply to specific languages
 */
export const DIRECTORY_DEFINITIONS: Record<string, string[]> = {
  go: ['cmd', 'internal/config', 'diagrams'],
  py: []
};

/**
 * Resolver class for determining which templates to use based on metadata
 */
export class TemplateResolver {
  /**
   * Get templates for a specific category and language
   */
  getTemplatesForLanguage(
    category: 'service' | 'module',
    language: string
  ): Array<{ templateName: string; destPath: string }> {
    return TEMPLATE_DEFINITIONS
      .filter(template => {
        // Filter by category
        if (template.category !== category) return false;
        
        // Include shared templates for all languages
        if (template.scope === 'shared') return true;
        
        // Include language-specific templates for the target language
        if (template.scope === 'language-specific') {
          return !template.languages || template.languages.includes(language);
        }
        
        return false;
      })
      .map(template => ({
        templateName: template.templateName,
        destPath: template.destPath
      }));
  }
  
  /**
   * Get directories that should be created for a language and category
   */
  getDirectoriesForLanguage(language: string): string[] {
    return DIRECTORY_DEFINITIONS[language] || [];
  }
  
  /**
   * Resolve template path, handling shared vs language-specific templates
   */
  resolveTemplatePath(templateName: string, language: string): string {
    if (templateName.startsWith('shared/')) {
      return templateName;
    }
    return templateName;
  }
}