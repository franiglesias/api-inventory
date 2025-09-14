/**
 * dependency-cruiser configuration to enforce architectural dependency rules.
 * Run: npm run dep:check
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: {
      path: '(^node_modules/|/test/|/coverage/|/dist/|/\\.vscode/|/\\.idea/|/openapi/|/scripts/)',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/([^/]+)', // group node_modules
      },
    },
  },
  forbidden: [
    // no circular dependencies
    {
      name: 'no-circular',
      comment: 'Disallow circular dependencies',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    // layering rules
    // 1) inventory (domain + its ports under inventory/driven) must stay self-contained
    {
      name: 'inventory-is-self-contained',
      severity: 'error',
      from: { path: '^src/inventory' },
      to: { pathNot: '^(src/inventory|node_modules/|^.)' },
    },

    // 2) driven adapters may depend only on inventory/driven (ports) and general libs, not on inventory/driving or inventory/Product directly
    {
      name: 'driven-only-depends-on-inventory-ports',
      comment: 'driven adapters should not import inventory/driving',
      severity: 'error',
      from: { path: '^src/driven' },
      to: { path: '^src/inventory/driving' },
    },
    {
      name: 'driven-no-domain-dependency',
      severity: 'error',
      from: { path: '^src/driven' },
      to: { path: '^src/inventory/(?!driven)(.*)$' },
    },

    // 3) driving (API) may depend on inventory (domain + messages) but not on driven adapters
    {
      name: 'driving-must-not-depend-on-driven',
      severity: 'error',
      from: { path: '^src/driving' },
      to: { path: '^src/driven' },
    },

    // 4) prevent cross-talk between inventory sub-layers: inventory/driving (use cases) shouldn't import adapters or API
    {
      name: 'inventory-driving-no-adapters',
      severity: 'error',
      from: { path: '^src/inventory/driving' },
      to: { path: '^(src/driven|src/driving)' },
    },
  ],
  allowed: [
    // Allow everything else
  ],
}
