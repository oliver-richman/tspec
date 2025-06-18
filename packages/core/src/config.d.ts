export interface TSpecConfig {
    testMatch?: string[];
    testIgnore?: string[];
    timeout?: number;
    parallel?: boolean;
    maxWorkers?: number;
    verbose?: boolean;
    silent?: boolean;
    setupFilesAfterEnv?: string[];
    globalSetup?: string;
    globalTeardown?: string;
    collectCoverage?: boolean;
    coverageDirectory?: string;
    coverageThreshold?: {
        global?: {
            branches?: number;
            functions?: number;
            lines?: number;
            statements?: number;
        };
    };
    extensionsToTreatAsEsm?: string[];
    moduleFileExtensions?: string[];
    testEnvironment?: string;
    clearMocks?: boolean;
    resetMocks?: boolean;
    restoreMocks?: boolean;
}
export declare function loadConfig(configPath?: string): Promise<TSpecConfig>;
export declare function mergeConfig(defaultConfig: TSpecConfig, userConfig: Partial<TSpecConfig>): TSpecConfig;
export declare function validateConfig(config: TSpecConfig): {
    isValid: boolean;
    errors: string[];
};
