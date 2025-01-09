import { promises as fs } from "fs";
import { dirname, join } from "path";

interface FileChange {
  file_summary: string;
  file_operation: string;
  file_path: string;
  file_code?: string;
}

export async function applyFileChanges(change: FileChange, projectDirectory: string) {
  const { file_operation, file_path, file_code } = change;
  const fullPath = join(projectDirectory, file_path);

  try {
    switch (file_operation.toUpperCase()) {
      case "CREATE":
        if (!file_code) {
          throw new Error(`No file_code provided for CREATE operation on ${file_path}`);
        }
        console.log(`📝 Creating file: ${file_path}`);
        await ensureDirectoryExists(dirname(fullPath));
        await fs.writeFile(fullPath, file_code, "utf-8");
        console.log(`✅ Created: ${file_path}`);
        break;

      case "UPDATE":
      case "REWRITE":
        if (!file_code) {
          throw new Error(`No file_code provided for ${file_operation} operation on ${file_path}`);
        }
        console.log(`📝 ${file_operation === "REWRITE" ? "Rewriting" : "Updating"} file: ${file_path}`);
        await ensureDirectoryExists(dirname(fullPath));
        await fs.writeFile(fullPath, file_code, "utf-8");
        console.log(`✅ ${file_operation === "REWRITE" ? "Rewrote" : "Updated"}: ${file_path}`);
        break;

      case "DELETE":
        console.log(`🗑️  Deleting file: ${file_path}`);
        await fs.rm(fullPath, { force: true });
        console.log(`✅ Deleted: ${file_path}`);
        break;

      default:
        console.warn(`⚠️  Unknown file_operation: ${file_operation} for file: ${file_path}`);
        break;
    }
  } catch (error: any) {
    console.error(`❌ Error ${file_operation.toLowerCase()}ing ${file_path}:`, error.message);
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
