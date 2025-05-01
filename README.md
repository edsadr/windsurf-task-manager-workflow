## Windsurf Task Manager Workflow

Follow this 5-step process for effectively managing an AI developer within Windsurf editor to build complex features by breaking down large development tasks into manageable, verifiable steps for sequential AI execution.

**Prerequisites:** Access to Windsurf editor and the necessary rule files (`generate-tasks.md`, `task-list.md`).

**Step 1: Create a Product Requirement Document (PRD)**

* **Purpose:** Define what you are trying to build. A clear PRD is essential for guiding Windsurf editor.
* **How:** Create a PRD in a markdown file (`.md`) directly within Windsurf editor. Clearly outline the features, requirements, and goals of your project.
    * Start like this:
        ```
        Use @create-prd.md
        Here's the feature: {define your feature here}
        ```
* **Output:** A markdown file (e.g., `YourProject-PRD.md`) detailing the product requirements.

**Step 2: Generate a Task List from the PRD**

* **Purpose:** Convert the high-level requirements from the PRD into a detailed, step-by-step implementation plan for Windsurf editor.
* **How:**
    * Use the `generate-tasks.md` rule file (available within Windsurf editor).
    * In Windsurf editor Agent chat, use the following command structure, replacing `YourProject-PRD.md` with the actual filename of your PRD from Step 1:
        ```
        Take @YourProject-PRD.md and create tasks using @generate-tasks.md
        ```
* **Output:** A detailed, multi-step task list, likely broken down into tasks and sub-tasks.

**Step 3: Examine the Task List**

* **Purpose:** Review Windsurf editor-generated task list for accuracy, completeness, and logical flow.
* **How:** Carefully read through the tasks and sub-tasks generated in the previous step. Ensure they accurately reflect the steps needed to implement the PRD. Make any necessary manual adjustments.

**Step 4: Create Instructions for Task Completion**

* **Purpose:** Instruct Windsurf editor on how to process the task list, focusing on completing one task at a time for verification.
* **How:**
    * Use the `task-list.md` rule file (available within Windsurf editor). This file contains instructions to guide Windsurf editor through the list sequentially.
    * In Windsurf editor Agent chat, start the process with the first task (e.g., 1.1) using this command structure:
        ```
        Start on 1.1 and use @task-list.md
        ```
    * **Note:** You only need to reference `@task-list.md` for the very first task. The rules within the file should guide Windsurf editor to prompt for the next step after each completion.
* **Output:** Windsurf editor is now set up to tackle the tasks one by one.

**Step 5: Execute and Verify Tasks**

* **Purpose:** Work through the development process by having Windsurf editor execute each task and verifying the output before proceeding.
* **How:**
    * Windsurf editor will perform the first task (e.g., 1.1).
    * Review the changes made by Windsurf editor.
    * If correct, approve or instruct Windsurf editor to move to the next task (e.g., 1.2).
    * Repeat this cycle: Windsurf editor executes a task -> You verify -> Instruct Windsurf editor on the next task.
* **Output:** A progressively built feature, with each step validated. The task list gets marked off as you proceed.

## Usage: Fetch Remote Docs from Workflow Repo

You can use the workflow docs fetcher via npm or pnpm:

```sh
pnpm dlx windsurf-task-manager
# or
npx windsurf-task-manager
```

This will:
- Print the instructions from the remote workflow repo's README.md in color
- Ask for confirmation
- Copy all documentation files from the remote repo's `docs` directory into your current folder

You can also run it directly if you have the repo cloned:

```sh
./windsurf-task-manager-workflow.js
```

> The script uses the latest Node.js and requires the `colorette` module (already included as a dependency).

**Workflow Summary:**

1.  **Create PRD:** Manually create your `YourProject-PRD.md` file within Windsurf editor.
2.  **Generate Tasks (Windsurf Agent):** Use the available `generate-tasks.md` file.
    ```
    Now take @YourProject-PRD.md and create tasks using @generate-tasks.md
    ```
3.  **Review Tasks:** Manually examine the generated task list.
4.  **Start Execution (Windsurf Agent - First Task Only):** Use the available `task-list.md` file.
    ```
    Please start on 1.1 and use @task-list.md
    ```
5.  **Verify & Continue:** Review Windsurf editor output for each task and prompt it for the next one as needed.
