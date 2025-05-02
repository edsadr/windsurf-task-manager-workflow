# Rule: Generating a Windsurf Rules Document

## Goal

To guide users in creating a clear, actionable, and effective `.windsurfrules` document for their project, ensuring Cascade (Windsurf AI) follows specific coding, workflow, or project guidelines tailored to the workspace. This process aligns with Windsurf's best practices.

## Process

1. **Receive Initial Prompt:** The user provides a description or intent for the rules they want Cascade to follow.
2. **Ask Clarifying Questions:** Before generating the rules document, Cascade should ask clarifying questions one by one until enough context is gathered. The goal is to understand the user's coding standards, workflow preferences, and any unique project requirements.
3. **Generate Rules Document:** Based on the prompt and answers, generate a `.windsurfrules` document using the structure and best practices outlined below.
4. **Save Rules:** Save the generated document as `.windsurfrules` in the project root. Optionally ask the user if they want to add `.windsurfrules` to `.gitignore` if the rules are workspace-specific.

## Clarifying Questions (Examples)

Cascade should adapt its questions, but common areas include:

- **Programming Languages & Frameworks:** "What languages and frameworks are used in this project?"
- **Code Style:** "Are there specific code style guides or formatting rules to follow?"
- **Project Structure:** "Should Cascade follow any architectural or directory structure conventions?"
- **Dependencies & Tools:** "Are there preferred libraries, tools, or package managers?"
- **Workflow & Collaboration:** "Are there any branching, commit, or PR review rules?"
- **Testing & Quality:** "What are the requirements for testing, documentation, or code quality?"
- **Edge Cases:** "Are there any specific scenarios or exceptions Cascade should be aware of?"
- **Other Preferences:** "Any other rules or preferences unique to this workspace?"

## Rules Document Structure

The generated `.windsurfrules` should include the following sections as appropriate:

1. **Introduction/Overview:** Briefly state the purpose of the rules and their intended scope (e.g., "These rules guide Cascade in generating code for this workspace.")
2. **Coding Guidelines:** Bullet points or numbered lists of code style, formatting, and language-specific rules.
3. **Project Structure & Architecture:** Directives for file organization, component structure, or design patterns.
4. **Workflow & Collaboration:** Rules for version control, branching, PRs, and team practices.
5. **Testing & Documentation:** Requirements for tests, coverage, and documentation standards.
6. **Tooling & Dependencies:** Preferred tools, libraries, or package management practices.
7. **Edge Cases & Exceptions:** Any special cases or exclusions.

## Best Practices for Writing Rules

- Keep rules simple, concise, and specific.
- Use bullet points, numbered lists, and markdown formatting for clarity.
- Avoid generic rules (e.g., "write good code").
- Group related rules using headers or XML-style tags if helpful.
- Example:

```
# Coding Guidelines
- Use JavaScript (no TypeScript)
- Follow StandardJS code style
- Always use pnpm for package management

# Project Structure
- Place all components in the `src/components` directory
- Use kebab-case for file and directory names

# Workflow
- Use feature branches for new work
- Require code review before merging to main
```

Or using XML-style grouping:

```
<coding_guidelines>
- Use Python 3.10+
- Add docstrings to all public functions
- Prefer early returns
</coding_guidelines>
```

## Output

- **Format:** Markdown (`.md`) or plaintext (`.windsurfrules`)
- **Location:** Project root (for `.windsurfrules`) or `docs/` (for documentation)
- **Filename:** `.windsurfrules` (for workspace rules), `global_rules.md` (for global rules)

## References

- [Windsurf Rules Documentation](https://docs.windsurf.com/windsurf/memories#windsurfrules)
- [Windsurf Rules Directory](https://windsurf.com/editor/directory)

## Final Instructions

1. Always ask clarifying questions before generating rules.
2. Use the user's answers to refine and improve the rules document.
3. Keep the document actionable, clear, and concise for both technical and non-technical contributors.
