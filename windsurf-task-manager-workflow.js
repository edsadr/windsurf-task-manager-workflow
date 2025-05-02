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
const DOCS_PATH = 'docs' // remote docs directory
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
  const apiUrl = `https://api.github.com/repos/${REMOTE_REPO}/contents/${DOCS_PATH}`
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
  // Ensure docs directory exists
  if (!fs.existsSync(DOCS_PATH)) {
    fs.mkdirSync(DOCS_PATH, { recursive: true })
  }
  // Use the correct raw URL for docs
  const url = `${RAW_BASE}/docs/${file.name}`
  const dest = path.join(DOCS_PATH, file.name)
  try {
    const data = await fetchRemoteFile(url)
    fs.writeFileSync(dest, data)
    console.log(green(`Copied: docs/${file.name}`))
  } catch (err) {
    console.log(red(`Failed to copy ${file.name}: ${err.message}`))
  }
}

// Extract the workflow instructions section from README.md and write to docs/instructions.md in the current working directory
async function copyInstructionsFromReadme () {
  // Read README.md from the script's directory
  const readmePath = path.join(__dirname, 'README.md')
  // Write instructions.md to the docs/ subdirectory of the current working directory
  const docsDir = path.join(process.cwd(), 'docs')
  const instructionsPath = path.join(docsDir, 'instructions.md')
  try {
    const content = await fs.promises.readFile(readmePath, 'utf8')
    const lines = content.split(/\r?\n/)
    // Find the start of the workflow section
    const startIdx = lines.findIndex(line => line.trim().startsWith('## Windsurf Task Manager Workflow'))
    if (startIdx === -1) throw new Error('Workflow section not found in README.md')
    // Find the end of the workflow summary (after the last numbered step)
    let endIdx = -1
    const summaryIdx = lines.findIndex((line, i) => i > startIdx && line.trim() === '**Workflow Summary:**')
    if (summaryIdx !== -1) {
      // Find the last numbered step after summaryIdx
      let lastStep = summaryIdx + 1
      while (lastStep < lines.length && /^\d+\./.test(lines[lastStep].trim())) {
        lastStep++
      }
      // Also include any indented code blocks under the last numbered step
      while (lastStep < lines.length && (lines[lastStep].startsWith('    ') || lines[lastStep].trim() === '')) {
        lastStep++
      }
      endIdx = lastStep
    } else {
      // If summary not found, fall back to next major header or end of file
      endIdx = lines.findIndex((line, i) => i > startIdx && line.startsWith('## '))
      if (endIdx === -1) endIdx = lines.length
    }
    const instructions = lines.slice(startIdx, endIdx).join('\n').trim()
    if (!instructions) {
      throw new Error('No instructions found in the workflow section of README.md')
    }
    // Ensure docs directory exists in cwd
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }
    await fs.promises.writeFile(instructionsPath, instructions, 'utf8')
    console.log(green(`Instructions copied to docs/instructions.md in the current directory`))
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
  // Copy instructions from local README.md to docs/instructions.md
  await copyInstructionsFromReadme()
  console.log(cyan('\nFetching docs from remote repo...'))
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
  console.log(bold(green('\nAll docs copied successfully!')))
})()
