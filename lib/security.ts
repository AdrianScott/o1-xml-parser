import { normalize, relative, isAbsolute } from "path";

// Maximum file size (100MB by default)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Regex for safe file paths - allows alphanumeric, dash, underscore, forward/back slash, dot, and space
const SAFE_PATH_REGEX = /^[a-zA-Z0-9-_/\\. ]+$/;

export function validatePath(basePath: string, filePath: string): string {
  // Normalize paths
  const normalizedBase = normalize(basePath);
  const normalizedPath = normalize(filePath);
  
  // Prevent absolute paths in filePath
  if (isAbsolute(filePath)) {
    throw new Error("Absolute paths are not allowed");
  }
  
  // Check if path contains only safe characters
  if (!SAFE_PATH_REGEX.test(filePath)) {
    throw new Error("Path contains invalid characters");
  }
  
  // Get relative path and ensure it doesn't escape base directory
  const relativePath = relative(normalizedBase, normalize(`${normalizedBase}/${normalizedPath}`));
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error("Path traversal detected");
  }
  
  return relativePath;
}

export function validateFileSize(content: string): void {
  const byteSize = new TextEncoder().encode(content).length;
  if (byteSize > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes`);
  }
}
