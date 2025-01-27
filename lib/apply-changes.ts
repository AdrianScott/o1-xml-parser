import { promises as fs } from "fs";
import { dirname, join } from "path";
import { validatePath, validateFileSize } from "./security";

interface FileChange {
  file_summary: string;
  file_operation: string;
  file_path: string;
  file_code?: string;
}

export async function applyFileChanges(change: FileChange, projectDirectory: string) {
  // Check if project directory exists
  try {
    const dirStats = await fs.stat(projectDirectory);
    if (!dirStats.isDirectory()) {
      throw new Error(`Project path exists but is not a directory: ${projectDirectory}`);
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`Project directory does not exist: ${projectDirectory}`);
    }
    throw error;
  }

  const { file_operation, file_path, file_code } = change;
  
  // Validate and sanitize the file path
  const safePath = validatePath(projectDirectory, file_path);
  const fullPath = join(projectDirectory, safePath);

  try {
    switch (file_operation.toUpperCase()) {
      case "CREATE":
        if (!file_code) {
          throw new Error(`No file_code provided for CREATE operation on ${safePath}`);
        }
        // Validate file size
        validateFileSize(file_code);
        console.log(`📝 Creating file: ${safePath}`);
        await ensureDirectoryExists(dirname(fullPath));
        await fs.writeFile(fullPath, file_code, "utf-8");
        console.log(`✅ Created: ${safePath}`);
        break;

      case "UPDATE":
      case "REWRITE":
        if (!file_code) {
          throw new Error(`No file_code provided for ${file_operation} operation on ${safePath}`);
        }
        // Validate file size
        validateFileSize(file_code);
        console.log(`📝 ${file_operation === "REWRITE" ? "Rewriting" : "Updating"} file: ${safePath}`);
        await ensureDirectoryExists(dirname(fullPath));
        await fs.writeFile(fullPath, file_code, "utf-8");
        console.log(`✅ ${file_operation === "REWRITE" ? "Rewrote" : "Updated"}: ${safePath}`);
        break;

      case "DELETE":
        console.log(`🗑️  Deleting file: ${safePath}`);
        await fs.rm(fullPath, { force: true });
        console.log(`✅ Deleted: ${safePath}`);
        break;

      default:
        console.warn(`⚠️  Unknown file_operation: ${file_operation} for file: ${safePath}`);
        break;
    }
  } catch (error: any) {
    console.error(`❌ Error ${file_operation.toLowerCase()}ing ${safePath}:`, error.message);
    throw error;
  }
}

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") {
      console.error(`Error creating directory ${dir}:`, error);
      throw error;
    }
  }
}
