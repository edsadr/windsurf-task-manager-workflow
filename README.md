## Windsurf Task Manager Workflow

Follow this 5-step process for effectively managing an AI development workflows within Windsurf editor to build complex features by breaking down large development tasks into manageable, verifiable steps for sequential AI execution.

**Prerequisites:** Access to Windsurf editor and the necessary worflows files (`create-prd.md`, `create-windsurf-rules.md`, `generate-tasks.md`, `manage-task.md`).

**Step 1: Create a Product Requirement Document (PRD)**

* **Purpose:** Define what you are trying to build. A clear PRD is essential for guiding Windsurf editor.
* **How:** Create a PRD in a markdown file (`.md`) directly within Windsurf editor. Clearly outline the features, requirements, and goals of your project.
    * Start like this:
        ```
        /create-prd
        Feature: {define your feature here}
        ```
* **Output:** A markdown file (e.g., `YourProject-PRD.md`) detailing the product requirements.

**Step 2: Prepare Workspace with Windsurf Rules**

* **Purpose:** Establish clear coding, workflow, and collaboration standards for your project by creating a `windsurfrules.md` file, ensuring Cascade (Windsurf AI) behaves according to your team's conventions.
* **How:**
    * Use the [docs/create-windsurf-rules.md](docs/create-windsurf-rules.md) as a guide.
    * In Windsurf editor Agent chat, start with:
        ```
        /create-windsurf-rules
        ```
    * Answer any clarifying questions from Cascade to refine your rules.
    * Save the output as `windsurfrules.md` in your project root.
    * **Important:** After reviewing and editing, manually rename `windsurfrules.md` to `.windsurfrules` to activate the rules for your workspace.
* **Output:** A `windsurfrules.md` file in your project root, to be renamed as `.windsurfrules`.

**Step 3: Generate a Task List from the PRD**

* **Purpose:** Convert the high-level requirements from the PRD into a detailed, step-by-step implementation plan for Windsurf editor.
* **How:**
    * Use the `generate-tasks.md` rule file (available within Windsurf editor).
    * In Windsurf editor Agent chat, use the following command structure, replacing `YourProject-PRD.md` with the actual filename of your PRD from Step 1:
        ```
        /generate-tasks @YourProject-PRD.md
        ```
* **Output:** A detailed, multi-step task list, likely broken down into tasks and sub-tasks.

**Step 4: Examine the Task List**

* **Purpose:** Review Windsurf editor-generated task list for accuracy, completeness, and logical flow.
* **How:** Carefully read through the tasks and sub-tasks generated in the previous step. Ensure they accurately reflect the steps needed to implement the PRD. Make any necessary manual adjustments.

**Step 5: Execute and Verify Tasks**

* **Purpose:** Work through the development process by having Windsurf editor execute each task and verifying the output before proceeding.
* **How:**
    * In Windsurf editor Agent chat, start the process with the first task (e.g., 1.1) by using the following command structure:
        ```
        /manage-task @YourProject-PRD.md @tasks-YourProject-PRD.md
        ```
    * After each task, review the output. When ready, instruct Windsurf editor to move to the next task (e.g., 1.2) by using the following command structure:
        ```
        Continue with the next task
        ```
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

**Workflow Summary:**

Here are example prompts to use with the files already provided in this repo:

1. **Create a PRD**
Prompt:
```
/create-prd
Feature: {describe your feature here}
```

2. **Prepare Workspace with Windsurf Rules**
Prompt:
```
/create-windsurf-rules
```

3. **Generate Tasks from PRD**
Prompt:
```
/generate-tasks @YourProject-PRD.md
```

4. **Start A Task Execution**
Prompt:
```
/manage-task @YourProject-PRD.md @tasks-YourProject-PRD.md
```

5. **Continue/Verify**
After each task, review the output and repeat the step 4 for the next task.
