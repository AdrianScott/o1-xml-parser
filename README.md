# o1 XML Parser

A simple parse-and-apply tool that parses XML responses from o1 in ChatGPT and applies them to a target codebase.

This is a fork of Mckay Wrigley's [o1-xml-parser](https://github.com/mckaywrigley/o1-xml-parser). The main changes are:

- Added more logging to console, showing what files are being changed.
- Updated XML style to expect file info to be enclosed in <file> tags.
- Updated o1 format prompt below to also request relative paths in <file> info
- Updated readme

## Tutorial

View a tutorial [here](https://x.com/mckaywrigley/status/1865825221560893798).

## Quick Start

1. Clone the repo.

```bash
git clone https://github.com/mckaywrigley/o1-xml-parser
```

2. Install dependencies.

```bash
npm install
```

3. (Optional) Create a `.env.local` file and set the `PROJECT_DIRECTORY` environment variable to your project directory.

```bash
cp .env.example .env.local
```

```bash
PROJECT_DIRECTORY=/path/to/your/project # Ex: /Users/you/your-project
```

4. Run the xml parser

```bash
npm run dev
```

## The XML Prompt

You are an expert software engineer.

You are tasked with following my instructions.

Use the included project instructions as a general guide.

### o1 format

```
You will respond with 2 sections: A summary section and an XML section.

Here are some notes on how you should respond in the summary section:

Provide a brief overall summary
Provide a 1-sentence summary for each file changed and why.
Provide a 1-sentence summary for each file deleted and why.
Format this section as markdown.
Here are some notes on how you should respond in the XML section:

Respond with the XML and nothing else
Include all of the changed files
Specify each file operation with CREATE, UPDATE, or DELETE
If it is a CREATE or UPDATE include the full file code. Do not get lazy.
Each file should include a brief change summary.
Include only the local file path starting after the root directory. Do not include the full root path.
I am going to copy/paste that entire XML section into a parser to automatically apply the changes you made, so put the XML block inside a markdown codeblock.
Make sure to enclose the code with ![CDATA[CODE HERE]], and don’t put “===“ at the beginning or end of the code.
Here is how you should structure the XML:

<code_changes> <changed_files> <file><file_summary>BRIEF CHANGE SUMMARY HERE</file_summary> <file_operation>FILE OPERATION HERE</file_operation> <file_path>FILE PATH HERE</file_path> <file_code></file_code></file> REMAINING FILES HERE </changed_files> </code_changes>

So the XML section will be:

__XML HERE__
```

## About Mckay Wrigley

"I'm Mckay. I like to build AI tools."

Follow me here:

- [X](https://x.com/mckaywrigley)
- [YouTube](https://www.youtube.com/@realmckaywrigley)
- [GitHub](https://github.com/mckaywrigley)
- [Newsletter](https://mckaywrigley.substack.com/)

## No Warranty

This software is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. In no event shall the
authors or copyright holders be liable for any claim, damages or other
liability, whether in an action of contract, tort or otherwise, arising from,
out of or in connection with the software or the use or other dealings in the
software.
