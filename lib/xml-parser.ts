import { DOMParser } from "@xmldom/xmldom";

// Secure XML parser options to prevent XXE attacks
const SECURE_PARSER_OPTIONS = {
  // Use onError, onWarning callbacks instead of errorHandler object
  onError: (msg: string) => console.error('XML Parser Error:', msg),
  onWarning: (msg: string) => console.warn('XML Parser Warning:', msg),
  locator: {},
  xmlns: true,
  // Disable external entities to prevent XXE attacks
  resolveExternalEntities: false
};

interface ParsedFileChange {
  file_summary: string;
  file_operation: string;
  file_path: string;
  file_code?: string;
}

export async function parseXmlString(
  xmlString: string
): Promise<ParsedFileChange[] | null> {
  try {
    const parser = new DOMParser(SECURE_PARSER_OPTIONS);
    console.log(xmlString);
    const doc = parser.parseFromString(xmlString, "text/xml");

    // Check for XML parsing errors
    const errors = Array.from(doc.getElementsByTagName("parsererror"));
    if (errors.length > 0) {
      console.error("XML Parsing Error:", errors[0].textContent);
      return null;
    }

    const changedFilesNode = doc.getElementsByTagName("changed_files")[0];
    if (!changedFilesNode) {
      console.warn("No <changed_files> element found in the XML");
      return null;
    }

    const fileNodes = changedFilesNode.getElementsByTagName("file");
    if (fileNodes.length === 0) {
      console.warn("No <file> elements found within <changed_files>");
      return null;
    }

    const changes: ParsedFileChange[] = [];
    let skippedFiles = 0;

    for (let i = 0; i < fileNodes.length; i++) {
      const fileNode = fileNodes[i];

      const fileSummaryNode = fileNode.getElementsByTagName("file_summary")[0];
      const fileOperationNode =
        fileNode.getElementsByTagName("file_operation")[0];
      const filePathNode = fileNode.getElementsByTagName("file_path")[0];
      const fileCodeNode = fileNode.getElementsByTagName("file_code")[0];

      if (!fileOperationNode || !filePathNode) {
        console.warn(
          `Skipping file ${i + 1}: Missing required file_operation or file_path`
        );
        skippedFiles++;
        continue;
      }

      const file_summary = fileSummaryNode?.textContent?.trim() ?? "";
      const file_operation = fileOperationNode.textContent?.trim() ?? "";
      const file_path = filePathNode.textContent?.trim() ?? "";

      let file_code: string | undefined = undefined;
      if (fileCodeNode && fileCodeNode.firstChild) {
        file_code = fileCodeNode.textContent?.trim() ?? "";
      }

      // Validate operation type
      const validOperations = ["CREATE", "UPDATE", "DELETE", "REWRITE"];
      const upperOperation = file_operation.toUpperCase();
      if (!validOperations.includes(upperOperation)) {
        console.warn(
          `Skipping file ${
            i + 1
          }: Invalid operation type "${file_operation}". Must be one of: ${validOperations.join(
            ", "
          )}`
        );
        skippedFiles++;
        continue;
      }

      changes.push({
        file_summary,
        file_operation: upperOperation,
        file_path,
        file_code,
      });
    }

    if (skippedFiles > 0) {
      console.warn(
        `Skipped ${skippedFiles} file(s) due to missing required fields`
      );
    }

    return changes;
  } catch (error: unknown) {
    console.error("Error parsing XML:", error);
    return null;
  }
}
