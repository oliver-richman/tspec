import { pathToFileURL } from 'url';
import { existsSync } from 'fs';
import { resolve } from 'path';
const DEFAULT_CONFIG = {
    testMatch: ['**/*.tspec.ts', '**/*.test.ts', '**/*.spec.ts'],
    testIgnore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    timeout: 5000,
    parallel: false,
    maxWorkers: 1,
    verbose: false,
    silent: false,
    setupFilesAfterEnv: [],
    collectCoverage: false,
    coverageDirectory: 'coverage',
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'node',
    clearMocks: false,
    resetMocks: false,
    restoreMocks: false,
};
export async function loadConfig(configPath) {
    const possibleConfigPaths = [
        configPath,
        'tspec.config.ts',
        'tspec.config.js',
        'tspec.config.mjs',
        '.tspec.config.ts',
        '.tspec.config.js',
        '.tspec.config.mjs'
    ].filter(Boolean);
    for (const path of possibleConfigPaths) {
        const fullPath = resolve(path);
        if (existsSync(fullPath)) {
            try {
                let configModule;
                // Handle TypeScript config files with tsx
                if (fullPath.endsWith('.ts')) {
                    const { register } = await import('tsx/esm/api');
                    const unregister = register();
                    try {
                        configModule = await import(pathToFileURL(fullPath).href);
                    }
                    finally {
                        unregister();
                    }
                }
                else {
                    configModule = await import(pathToFileURL(fullPath).href);
                }
                const config = configModule.default || configModule;
                return mergeConfig(DEFAULT_CONFIG, config);
            }
            catch (error) {
                console.warn(`Failed to load config from ${fullPath}:`, error);
                continue;
            }
        }
    }
    // No config file found, return default config
    return DEFAULT_CONFIG;
}
export function mergeConfig(defaultConfig, userConfig) {
    return {
        ...defaultConfig,
        ...userConfig,
        // Merge arrays instead of replacing
        testMatch: userConfig.testMatch || defaultConfig.testMatch,
        testIgnore: [...(defaultConfig.testIgnore || []), ...(userConfig.testIgnore || [])],
        setupFilesAfterEnv: [...(defaultConfig.setupFilesAfterEnv || []), ...(userConfig.setupFilesAfterEnv || [])],
        extensionsToTreatAsEsm: [...(defaultConfig.extensionsToTreatAsEsm || []), ...(userConfig.extensionsToTreatAsEsm || [])],
        moduleFileExtensions: [...(defaultConfig.moduleFileExtensions || []), ...(userConfig.moduleFileExtensions || [])],
        // Merge nested objects
        coverageThreshold: {
            ...defaultConfig.coverageThreshold,
            ...userConfig.coverageThreshold,
            global: {
                ...defaultConfig.coverageThreshold?.global,
                ...userConfig.coverageThreshold?.global,
            },
        },
    };
}
export function validateConfig(config) {
    const errors = [];
    if (config.timeout && config.timeout < 0) {
        errors.push('timeout must be a positive number');
    }
    if (config.maxWorkers && config.maxWorkers < 1) {
        errors.push('maxWorkers must be at least 1');
    }
    if (config.testMatch && config.testMatch.length === 0) {
        errors.push('testMatch cannot be empty');
    }
    if (config.coverageThreshold?.global) {
        const { branches, functions, lines, statements } = config.coverageThreshold.global;
        for (const [key, value] of Object.entries({ branches, functions, lines, statements })) {
            if (value !== undefined && (value < 0 || value > 100)) {
                errors.push(`coverageThreshold.global.${key} must be between 0 and 100`);
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
