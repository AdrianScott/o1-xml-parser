"use server";

import { applyFileChanges } from "@/lib/apply-changes";
import { parseXmlString } from "@/lib/xml-parser";

export async function applyChangesAction(xml: string, projectDirectory: string) {
  try {
    const changes = await parseXmlString(xml);

    if (!changes) {
      throw new Error("Failed to parse XML. Check the console for detailed parsing errors.");
    }

    if (changes.length === 0) {
      console.log("\n⚠️ No valid file changes found in the XML");
      console.log("Please check that your XML contains:");
      console.log("1. A <changed_files> root element");
      console.log("2. One or more <file> elements with:");
      console.log("   - <file_operation> (CREATE, UPDATE, DELETE, or REWRITE)");
      console.log("   - <file_path>");
      console.log("   - <file_code> (required for CREATE, UPDATE, or REWRITE)");
      throw new Error("No valid file changes found in the XML");
    }

    let finalDirectory = projectDirectory && projectDirectory.trim() !== "" ? projectDirectory.trim() : process.env.PROJECT_DIRECTORY;

    if (!finalDirectory) {
      throw new Error("No project directory provided and no fallback found in environment.");
    }

    // Log summary of changes to be applied
    console.log("\n=== Files to be changed ===");
    changes.forEach((file, index) => {
      console.log(`${index + 1}. ${file.file_operation.toUpperCase()}: ${file.file_path}`);
      if (file.file_summary) {
        console.log(`   Summary: ${file.file_summary}`);
      }
    });
    console.log("========================\n");

    // Apply changes with progress logging
    for (const file of changes) {
      try {
        await applyFileChanges(file, finalDirectory);
      } catch (error: any) {
        console.error(`Failed to ${file.file_operation.toLowerCase()} ${file.file_path}:`, error.message);
        throw error;
      }
    }

    console.log("\n✅ All changes applied successfully");
  } catch (error: any) {
    // Preserve the original error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.toString());
  }
}
