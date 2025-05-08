---
description: "Guide Cascade to manage, execute a task and update a task list"
---

# Task List Management

Guidelines for managing and executing tasks from a task list in markdown files to track progress on completing a PRD

## Input Process

The user points Windsurf editor to a specific PRD and a task list file:

1. Receive the task list file and the PRD file from the user and load them in the context
2. Ask the user to specify the task number
3. start executing the task following the instructions below

## Task Implementation
- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say “yes” or "y"
- **Completion protocol:**
  1. When you finish a **sub‑task**, immediately mark it as completed by changing `[ ]` to `[x]`.
  2. Ask the user if they want to create a memory about the sub-task, if the user says "yes" or "y", create a memory about the sub-task
  3. If **all** subtasks underneath a parent task are now `[x]`, also mark the **parent task** as completed.
- Stop after each sub‑task and wait for the user’s go‑ahead.

## Task List Maintenance

1. **Update the task list as you work:**
   - Mark tasks and subtasks as completed (`[x]`) per the protocol above.
   - Add new tasks as they emerge.

2. **Maintain the “Relevant Files” section:**
   - List every file created or modified.
   - Give each file a one‑line description of its purpose.

## AI Instructions

When working with task lists, the AI must:

1. Regularly update the task list file after finishing any significant work.
2. Follow the completion protocol:
   - Mark each finished **sub‑task** `[x]`.
   - Mark the **parent task** `[x]` once **all** its subtasks are `[x]`.
3. Add newly discovered tasks.
4. Keep “Relevant Files” accurate and up to date.
5. Before starting work, check which sub‑task is next.
6. After implementing a sub‑task, update the file and then pause for user approval.

> Run `/manage-task <prd-file> <task-list-file>` in Cascade to start this workflow.
