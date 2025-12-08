module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      type: 'circular',
    },
    {
      name: 'no-orphans',
      severity: 'info',
      type: 'orphan',
      from: {
        orphanType: 'nonResolvable',
      },
    },
    {
      name: 'no-deprecated-core',
      severity: 'info',
      type: 'deprecation',
      from: {},
      to: {
        dependencyTypes: ['core'],
        module: {
          match: '^(fs|http|https|net|path|events|stream|util)$',
        },
      },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      type: 'unknown',
      from: {},
      to: {
        dependencyTypes: ['unknown', 'undetermined', 'invalid-extension'],
      },
    },
    {
      name: 'no-duplicate-dep-types',
      comment:
        "it's an error when a module depends on an external ('npm') package that occurs more than once in its dependency graph: that is - the same package is dependent on directly and as a transpiled custom modification.",
      severity: 'error',
      type: 'duplicate',
      from: {},
      to: {
        dependencyTypes: ['npm'],
      },
    },
    {
      name: 'no-unlicensed-packages',
      comment:
        'some packages do not have license information, which can be problematic when used as a commercial package',
      severity: 'info',
      type: 'unlicensed',
      from: {},
      to: {
        dependencyTypes: ['npm'],
      },
    },
    {
      name: 'not-to-unresolvable',
      comment: 'sure you want to allow a negation of a popular rule',
      severity: 'info',
      from: {
        path: 'src/excluded',
      },
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'no-test-imports-in-source',
      severity: 'error',
      comment: 'test code should not be imported by source code',
      type: 'sourceReachesTest',
      from: {
        pathNot: '^(tests?/|__tests__/)',
      },
      to: {
        path: '^(tests?/|__tests__/)',
      },
    },
    {
      name: 'not-to-spec',
      comment:
        'in some situations you want to allow to still import from a spec file e.g. it does not (only) contain specs, but utilities made available for other modules as well. By default we recommend to not do this though',
      severity: 'warn',
      type: 'reachesNonTestCode',
      from: {},
      to: {
        path: '\\.spec\\.(js|ts|tsx)$',
      },
    },
  ],
  options: {
    cache: true,
    cacheStrategy: 'metadata',
    combinedDependencies: false,
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: ['^node_modules', '^\\.git', '^\\.next', '^dist', '^build'],
    },
    includeOnly: '',
    maxDepth: 0,
    moduleSystems: ['cjs', 'es6', 'tsd'],
    outputType: 'err',
    preserveCompilationInfo: false,
    reporterOptions: {
      archi: {
        collapsePattern: '^(packages|src)/[^/]+',
        showMetrics: false,
      },
      csv: {
        separator: ',',
      },
      dot: {
        collapsePattern: '^(packages|src)/[^/]+',
        showMetrics: false,
        theme: {
          graph: {
            rankdir: 'LR',
          },
        },
      },
      html: {
        mainAttributes: ['severity', 'type'],
      },
      metrics: {
        hiddenFromRoot: [],
        monostrait: false,
        orphans: false,
        hidecircles: false,
      },
      mermaid: {
        collapsePattern: '^(packages|src)/[^/]+',
      },
    },
    rulesFile: '',
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    typings: 'cjs',
    webpackConfig: '',
  },
};
