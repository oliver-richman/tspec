import { glob } from 'glob';
import path from 'node:path';
export async function findTestFiles(config) {
    const patterns = config?.testMatch || ['**/*.tspec.ts'];
    const ignore = config?.testIgnore || ['**/node_modules/**', '**/dist/**', '**/build/**'];
    let allFiles = [];
    for (const pattern of patterns) {
        const files = await glob(pattern, {
            ignore: ignore
        });
        allFiles.push(...files);
    }
    // Remove duplicates and resolve paths
    const uniqueFiles = Array.from(new Set(allFiles));
    return uniqueFiles.map(file => path.resolve(file));
}
