"use client";
import { applyChangesAction } from "@/actions/apply-changes-actions";
import { useEffect, useState } from "react";

export function ApplyChangesForm() {
  const [xml, setXml] = useState<string>("");
  const [projectDirectory, setProjectDirectory] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage]);

  const handleApply = async () => {
    setErrorMessage("");
    if (!xml.trim()) {
      setErrorMessage("Please paste XML before applying changes.");
      return;
    }
    try {
      await applyChangesAction(xml, projectDirectory.trim());
      setXml("");
      setSuccessMessage("Changes applied successfully");
    } catch (error: any) {
      setErrorMessage("An error occurred while applying changes.");
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-4 flex flex-col gap-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-200">
        O1-xml-parser{" "}
        <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
          (@AdrianDoesAI/@mckaywrigley)
        </span>
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Use this to apply code changes received from the LLM (e.g. O1) to your local files
      </p>
      {errorMessage && <div className="text-red-400">{errorMessage}</div>}
      {successMessage && <div className="text-green-400">{successMessage}</div>}
      <div className="flex flex-col">
        <label className="mb-2 font-bold">Project Directory:</label>
        <input
          className="border bg-secondary text-secondary-foreground p-2 w-full rounded-md"
          type="text"
          value={projectDirectory}
          onChange={(e) => setProjectDirectory(e.target.value)}
          placeholder="e.g. /Users/myusername/projects/o1-xml-parser"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-bold">Paste XML here:</label>
        <textarea
          className="border bg-secondary text-secondary-foreground p-2 h-64 w-full rounded-md"
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          placeholder="Paste the <code_changes>...</code_changes> XML here"
        />
      </div>
      <button
        className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
        onClick={handleApply}
      >
        Apply
      </button>

      {/* Social Links */}
      <div className="mt-8 flex flex-col gap-4 text-base">
        <a
          href="https://freepoprompt.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          🚀 Use with FreepoPrompt
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            "I'm rocking O1-pro for my coding w/ o1-xml-parser! @AdrianDoesAI"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          𝕏 Share on X
        </a>
        <a
          href="https://twitter.com/AdrianDoesAI"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          𝕏 Follow @AdrianDoesAI
        </a>
        <a
          href="https://twitter.com/mckayWrigley"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          𝕏 Follow @mckaywrigley
        </a>
      </div>
    </div>
  );
}
