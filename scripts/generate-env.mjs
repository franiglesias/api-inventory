#!/usr/bin/env node
/**
 * generate-env.mjs
 *
 * Generate a .env file from .env.dist, overriding keys from:
 * - CLI --set KEY=VALUE flags (can be repeated)
 * - Process env vars (only for keys present in .env.dist)
 *
 * Usage examples:
 *   node scripts/generate-env.mjs                      # writes .env
 *   node scripts/generate-env.mjs --out .env.prod
 *   PORT=8080 NODE_ENV=production node scripts/generate-env.mjs
 *   node scripts/generate-env.mjs --set NODE_ENV=production --set STORAGE_ADAPTER=sqlite
 *
 * In npm scripts, you can do:
 *   NODE_ENV=production STORAGE_ADAPTER=sqlite npm run env:from-dist
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const CWD = process.cwd()
const DIST_DEFAULT = '.env.dist'
const OUT_DEFAULT = '.env'

function parseArgs(argv) {
  const args = { out: OUT_DEFAULT, dist: DIST_DEFAULT, sets: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--out' && argv[i + 1]) {
      args.out = argv[++i]
    } else if (a === '--dist' && argv[i + 1]) {
      args.dist = argv[++i]
    } else if (a === '--set' && argv[i + 1]) {
      args.sets.push(argv[++i])
    } else if (a === '-h' || a === '--help') {
      printHelpAndExit()
    } else {
      console.warn(`[generate-env] Unknown arg: ${a}`)
    }
  }
  return args
}

function printHelpAndExit(code = 0) {
  console.log(
    `Usage: node scripts/generate-env.mjs [--dist .env.dist] [--out .env] [--set KEY=VALUE ...]\n`,
  )
  process.exit(code)
}

function parseSetPairs(pairs) {
  const map = {}
  for (const p of pairs) {
    const idx = p.indexOf('=')
    if (idx === -1) {
      console.warn(`[generate-env] Ignoring --set without = : ${p}`)
      continue
    }
    const k = p.slice(0, idx).trim()
    const v = p.slice(idx + 1)
    if (!k) continue
    map[k] = v
  }
  return map
}

function main() {
  const { out, dist, sets } = parseArgs(process.argv)
  const distPath = resolve(CWD, dist)
  const outPath = resolve(CWD, out)

  if (!existsSync(distPath)) {
    console.error(`[generate-env] Missing template file: ${dist}`)
    process.exit(1)
  }

  const template = readFileSync(distPath, 'utf8').split(/\r?\n/)
  const cliOverrides = parseSetPairs(sets)

  // Gather keys present in the template for safe override from process.env.
  const keysInTemplate = new Set()
  for (const line of template) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=/)
    if (m) keysInTemplate.add(m[1])
  }

  const resultLines = template.map((line) => {
    // Only attempt to override simple KEY=VALUE lines; leave comments/blank lines untouched.
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!m) return line

    const key = m[1]
    const originalValueWithMaybeComments = m[2]

    // Preserve inline comments by splitting on unescaped #
    let value = originalValueWithMaybeComments
    let comment = ''
    const hashIdx = originalValueWithMaybeComments.indexOf('#')
    if (hashIdx !== -1) {
      value = originalValueWithMaybeComments.slice(0, hashIdx).trimEnd()
      comment = originalValueWithMaybeComments.slice(hashIdx)
    }

    // Determine override: CLI --set > process.env (if key is in template) > keep
    let newValue
    if (Object.prototype.hasOwnProperty.call(cliOverrides, key)) {
      newValue = cliOverrides[key]
    } else if (keysInTemplate.has(key) && process.env[key] != null) {
      newValue = process.env[key]
    }

    if (newValue == null) return `${key}=${value}${comment}`

    // When value contains spaces or special chars, keep as-is: user can quote explicitly in --set or env.
    return `${key}=${newValue}${comment}`
  })

  writeFileSync(outPath, resultLines.join('\n'))
  console.log(`[generate-env] Wrote ${out}`)
}

main()
