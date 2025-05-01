#!/usr/bin/env node

// windsurf-task-manager-workflow.js
// CLI script to fetch docs from a remote GitHub repo, print README instructions, and copy docs after user confirmation

const fs = require('fs')
const path = require('path')
const https = require('https')
const readline = require('readline')
const { cyan, yellow, green, red, bold } = require('colorette')

const REMOTE_REPO = 'edsadr/windsurf-task-manager-workflow'
const RAW_BASE = `https://raw.githubusercontent.com/${REMOTE_REPO}/main`
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
  const readmeUrl = `${RAW_BASE}/README.md`
  try {
    const readme = await fetchRemoteFile(readmeUrl)
    console.log(bold(cyan('\n--- Remote README Instructions ---\n')))
    console.log(yellow(readme))
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
  const url = file.download_url
  const dest = path.join(LOCAL_DEST, file.name)
  try {
    const data = await fetchRemoteFile(url)
    fs.writeFileSync(dest, data)
    console.log(green(`Copied: ${file.name}`))
  } catch (err) {
    console.log(red(`Failed to copy ${file.name}: ${err.message}`))
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
