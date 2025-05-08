---
description: "Guide Cascade to produce a step-by-step task list based on a PRD."
---

# Generate a Task List from a PRD

## Goal

To guide Windsurf editor in creating a detailed, step-by-step task list in Markdown format based on an existing Product Requirements Document (PRD). The task list should be suitable for a developer to follow for implementation.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `docs/`
- **Filename:** `tasks-[prd-file-name].md` (e.g., `tasks-prd-user-profile-editing.md`)

## Process

1.  **Receive PRD Reference:** The user points the AI to a specific PRD file
2.  **Analyze PRD:** The AI reads and analyzes the functional requirements, user stories, and other sections of the specified PRD.
3.  **Phase 1: Generate Parent Tasks:** Based on the PRD analysis, create the file and generate the main, high-level tasks required to implement the feature. Use your judgement on how many high-level tasks to use. It's likely to be 3-5. Present these tasks to the user in the specified format (without sub-tasks yet). Inform the user: "I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."
4.  **Wait for Confirmation:** Pause and wait for the user to respond with "Go".
5.  **Phase 2: Generate Sub-Tasks:** Once the user confirms, break down each parent task into smaller, actionable sub-tasks. Ensure sub-tasks logically follow from the parent task and cover the implementation details implied by the PRD.
6.  **Identify Relevant Files:** Based on the tasks and PRD, identify potential files that will need to be created or modified. List these under the `Relevant Files` section with a brief description of their purpose in relation to the tasks.
7.  **Generate Final Output:** Combine the parent tasks, sub-tasks, and relevant files into the final Markdown structure.
8.  **Save Task List:** Save the generated document in the `docs/tasks/` directory with the filename `tasks-[prd-file-name].md`, where `[prd-file-name]` matches the base name of the input PRD file (e.g., if the input was `prd-user-profile-editing.md`, the output is `tasks-prd-user-profile-editing.md`).

## Output Format

The generated task list _must_ follow this structure:

```markdown

### Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).

## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 Sub-task description
  - [ ] 1.2 Sub-task description
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 Sub-task description
  - [ ] 2.2 Sub-task description
  - [ ] 2.3 Sub-task description
- [ ] 3.0 Parent Task Title (may not have sub-tasks if simple enough)

```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.

## Target Audience

Assume the primary reader of the task list is a **developer** who will implement the feature.

> Run `/generate-tasks <prd-file>` in Cascade to start this workflow.
