import { normalize, relative, isAbsolute, dirname, basename } from "path";
import sanitizeFilename from "sanitize-filename";

// Maximum file size (100MB by default)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function validatePath(basePath: string, filePath: string): string {
  // Prevent absolute paths in filePath
  if (isAbsolute(filePath)) {
    throw new Error("Absolute paths are not allowed");
  }

  // Normalize paths
  const normalizedBase = normalize(basePath);
  const normalizedPath = normalize(filePath);
  
  // Sanitize each path component
  const pathParts = normalizedPath.split('/');
  const sanitizedParts = pathParts.map(part => {
    // Skip empty parts (consecutive slashes)
    if (!part) return part;
    const sanitized = sanitizeFilename(part);
    if (sanitized !== part) {
      throw new Error(`Invalid characters in path component: ${part}`);
    }
    return part;
  });

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
