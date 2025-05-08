#!/usr/bin/env node

// windsurf-task-manager-workflow.js
// CLI script to fetch docs from a remote GitHub repo, print README instructions, and copy docs after user confirmation

const fs = require('fs')
const path = require('path')
const https = require('https')
const readline = require('readline')
const { cyan, yellow, green, red, bold } = require('colorette')
const marked = require('marked')

// marked-terminal v7+ is ESM-only. Use require and .default for CJS compatibility.
const TerminalRenderer = require('marked-terminal').default || require('marked-terminal')

const REMOTE_REPO = 'edsadr/windsurf-task-manager-workflow'
// Use the correct branch ref for raw URLs
const RAW_BASE = `https://raw.githubusercontent.com/${REMOTE_REPO}/refs/heads/master`
const REMOTE_WORKFLOWS_PATH = 'workflows' // remote workflows directory
const LOCAL_WORKFLOWS_DIR = '.windsurf/workflows' // local workflows directory
const LOCAL_DEST = process.cwd()

// Helper to fetch a remote file as string
function fetchRemoteFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url} (status ${res.statusCode})`))
        return
      }
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

// Helper to fetch remote directory listing via GitHub API
function fetchDocsList() {
  const apiUrl = `https://api.github.com/repos/${REMOTE_REPO}/contents/${REMOTE_WORKFLOWS_PATH}`
  return new Promise((resolve, reject) => {
    https.get(apiUrl, {
      headers: { 'User-Agent': 'fetch-remote-docs-script' }
    }, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch docs list (status ${res.statusCode})`))
        return
      }
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const files = JSON.parse(data)
          resolve(files.filter(f => f.type === 'file'))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

// Print README instructions
async function printReadme() {
  // Use the correct URL for the README
  const readmeUrl = `${RAW_BASE}/README.md`
  try {
    const readme = await fetchRemoteFile(readmeUrl)
    // Render markdown to terminal-friendly output using marked-terminal
    marked.setOptions({
      renderer: new TerminalRenderer(),
      mangle: false,
      headerIds: false
    })
    const rendered = marked.parse(readme)
    console.log(rendered)
    console.log(bold(cyan('\n--- End of Instructions ---\n')))
  } catch (err) {
    console.log(red('Could not fetch remote README.md:'), err.message)
  }
}

// Ask user for confirmation
function askConfirmation() {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(bold(green('Continue copying docs to this folder? [y/N]: ')), answer => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 'y')
    })
  })
}

// Download and write a file
async function downloadDoc(file) {
  const localDir = LOCAL_WORKFLOWS_DIR
  // Ensure local workflows directory exists
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true })
  }
  // Use the correct raw URL for workflows
  const url = `${RAW_BASE}/${REMOTE_WORKFLOWS_PATH}/${file.name}`
  const dest = path.join(localDir, file.name)
  try {
    const data = await fetchRemoteFile(url)
    fs.writeFileSync(dest, data)
    console.log(green(`Copied: ${LOCAL_WORKFLOWS_DIR}/${file.name}`))
  } catch (err) {
    console.log(red(`Failed to copy ${file.name}: ${err.message}`))
  }
}

// Extract the workflow instructions section from README.md and write to .windsurf/workflows/instructions.md in the current working directory
async function copyInstructionsFromReadme () {
  // Read README.md from the script's directory
  const readmePath = path.join(__dirname, 'README.md')
  // Write instructions.md to the local workflows directory
  const localDir = path.join(process.cwd(), LOCAL_WORKFLOWS_DIR)
  const instructionsPath = path.join(localDir, 'instructions.md')
  try {
    const content = await fs.promises.readFile(readmePath, 'utf8')
    const lines = content.split(/\r?\n/)
    // Find the start of the workflow section
    const startIdx = lines.findIndex(line => line.trim().startsWith('## Windsurf Task Manager Workflow'))
    if (startIdx === -1) throw new Error('Workflow section not found in README.md')
    // Find the end of the workflow section: next major header or EOF
    let endIdx = lines.findIndex((line, i) => i > startIdx && line.startsWith('## '))
    if (endIdx === -1) {
      endIdx = lines.length
    }
    const instructions = lines.slice(startIdx, endIdx).join('\n').trim()
    if (!instructions) {
      throw new Error('No instructions found in the workflow section of README.md')
    }
    // Ensure local workflows directory exists in cwd
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true })
    }
    await fs.promises.writeFile(instructionsPath, instructions, 'utf8')
    console.log(green(`Instructions copied to ${LOCAL_WORKFLOWS_DIR}/instructions.md in the current directory`))
  } catch (err) {
    console.log(red('Failed to extract/write instructions from README.md:'), err.message)
  }
}

// Main logic
(async () => {
  await printReadme()
  const confirmed = await askConfirmation()
  if (!confirmed) {
    console.log(red('Aborted by user.'))
    process.exit(1)
  }
  // Copy instructions from local README.md to workflows/instructions.md
  await copyInstructionsFromReadme()
  console.log(cyan('\nFetching workflows from remote repo...'))
  let docs
  try {
    docs = await fetchDocsList()
    if (!docs.length) throw new Error('No docs found in remote repo.')
  } catch (err) {
    console.log(red('Error fetching docs list:'), err.message)
    process.exit(1)
  }
  for (const file of docs) {
    await downloadDoc(file)
  }
  console.log(bold(green('\nAll workflows copied successfully!')))
})()
