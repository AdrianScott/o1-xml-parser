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
git clone https://github.com/AdrianScott/o1-xml-parser
cd o1-xml-parser
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

5. Open in browser, e.g. http://localhost:3000

## The XML Prompt

Use this in the prompt you submit to the LLM, so it generates the XML output that this tool can parse:

### o1 format

```
You will respond with 2 sections: A summary section and an XML section.

Summary section:
Provide a brief overall summary
Provide a 1-sentence summary for each file changed and why.
Provide a 1-sentence summary for each file deleted and why.
Format this section as markdown.

Present a complete plan to solve the problem and implement it in the codebase.

At the end of your response, respond with the following XML section (if applicable).

XML Section:

    Do not get lazy. Always output the full code in the XML section.
    Enclose this entire section in a markdown codeblock.
    Include all of the changed files.
    Specify each file operation with CREATE, UPDATE, or DELETE.
    For CREATE or UPDATE operations, include the full file code.
	Each file should include a brief change summary (<file_summary>).
    Use only the local file path starting after the root directory. (Do not include the full root path.) relative to the project directory, good: app/page.tsx, bad: /Users/mckaywrigley/Desktop/projects/new-chat-template/app/page.tsx)
    Enclose the code with ![CDATA[CODE HERE]]
	If the code has ]]> in it, replace that part with ]]]]><![CDATA[> so it won't break the XML
    Use the following XML structure:

<code_changes>
  <changed_files>
    <file>
      <file_operation>__FILE OPERATION HERE__</file_operation>
      <file_path>__FILE PATH HERE__</file_path>
      <file_code><![CDATA[
__FULL FILE CODE HERE__
]]></file_code>
    </file>
    __REMAINING FILES HERE__
  </changed_files>
</code_changes>

Other rules:
    DO NOT remove <ai_context> sections. These are to provide you additional context about each file.
    If you create a file, add an <ai_context> comment section at the top of the file.
    If you update a file make sure its <ai_context> stays up-to-date
    DO NOT add comments related to your edits
    DO NOT remove my existing comments

We may go back and forth a few times. If we do, remember to continue to output the entirety of the code in an XML section (if applicable).

Take all the time you need.

We will copy/paste that entire XML section into a parser to automatically apply the changes you made, so put the XML in a fenced code block like this:

<code_changes> <changed_files> <file><file_summary>BRIEF CHANGE SUMMARY HERE</file_summary> <file_operation>FILE OPERATION HERE</file_operation> <file_path>FILE PATH HERE</file_path> <file_code><![CDATA[CODE HERE]]></file_code></file><!-- more <file> blocks here if needed --></changed_files> </code_changes>

Make sure to enclose the code with ![CDATA[CODE HERE]], and don’t put “===“ at the beginning or end of the code.


Example Format

Summary Section (in Markdown):

**Summary of Changes**
- Overall: ...
- File A: ...
- File B: ...

XML Section (in a fenced code block, so we can parse it):

<code_changes>
    <changed_files>
        <file>
            <file_summary>BRIEF CHANGE SUMMARY HERE</file_summary>
            <file_operation>CREATE or UPDATE or DELETE</file_operation>
            <file_path>relative/path/to/file.py</file_path>
            <file_code><![CDATA[
# (file code here, with any internal XML tags escaped or wrapped)
]]></file_code>
        </file>
    </changed_files>
</code_changes>

Remember: The entire XML output is placed inside a single fenced code block, so it can be parsed automatically.

reply xml section xml schema:

<?xml version="1.0" encoding="UTF-8"?>
<xs:schema
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    targetNamespace="https://example.com/code_changes"
    elementFormDefault="qualified"
    attributeFormDefault="unqualified">

  <!-- Root element: <code_changes> -->
  <xs:element name="code_changes">
    <xs:complexType>
      <xs:sequence>
        <!-- A required <changed_files> element -->
        <xs:element name="changed_files">
          <xs:complexType>
            <xs:sequence>
              <!-- One or more <file> elements -->
              <xs:element name="file" maxOccurs="unbounded" minOccurs="1">
                <xs:complexType>
                  <xs:sequence>

                    <!-- <file_summary>: short text describing the change -->
                    <xs:element name="file_summary" type="xs:string"/>

                    <!-- <file_operation>: must be CREATE, UPDATE, or DELETE -->
                    <xs:element name="file_operation">
                      <xs:simpleType>
                        <xs:restriction base="xs:string">
                          <xs:enumeration value="CREATE"/>
                          <xs:enumeration value="UPDATE"/>
                          <xs:enumeration value="DELETE"/>
                        </xs:restriction>
                      </xs:simpleType>
                    </xs:element>

                    <!-- <file_path>: local (relative) file path -->
                    <xs:element name="file_path" type="xs:string"/>

                    <!-- <file_code>: entire file content wrapped in <![CDATA[...]]> -->
                    <xs:element name="file_code" type="xs:string"/>

                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>

</xs:schema>
```

## Community & Support

### Social Links - Adrian Does A.I.

- [Follow @AdrianDoesAI on X](https://x.com/intent/follow?screen_name=AdrianDoesAI)
- [Join our Discord Community](https://discord.gg/uQjNv9pWFm)
- [Star on GitHub](https://github.com/AdrianScott/o1-xml-parser)
- [Visit AdrianDoesAI.com](https://adriandoesai.com)

### Support the Project

If you find o1-xml-parser helpful, consider supporting its development:

bc1qvzqjyrmu0tz75g67mfprfsc5gp304nzcvtz83n

(or DM on X for Zelle)

Your support helps maintain and improve o1-xml-parser for everyone!

### Citation

If you use o1-xml-parser in your research or project, please cite it as:

```bibtex
@software{o1-xml-parser2025,
  author = {Adrian Scott},
  title = {o1-xml-parser: XML Parser for LLM/o1-pro chat coding},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/AdrianScott/o1-xml-parser}
}
```

## About Mckay Wrigley

Follow Mckay Wrigley here:

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
