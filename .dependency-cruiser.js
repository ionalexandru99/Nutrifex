module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'info',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$',
          '[.]d[.]ts$',
          '(^|/)tsconfig[.]json$',
          '(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$',
        ],
      },
      to: {},
    },
    {
      name: 'no-deprecated-core',
      severity: 'info',
      from: {},
      to: {
        dependencyTypes: ['core'],
        path: [
          '^v8/tools/codemap$',
          '^v8/tools/consarray$',
          '^v8/tools/csvparser$',
          '^v8/tools/logreader$',
          '^v8/tools/profile_view$',
          '^v8/tools/profile$',
          '^v8/tools/SourceMap$',
          '^v8/tools/splaytree$',
          '^v8/tools/tickprocessor-driver$',
          '^v8/tools/tickprocessor$',
          '^node-inspect/lib/_inspect$',
          '^node-inspect/lib/internal/inspect_client$',
          '^node-inspect/lib/internal/inspect_repl$',
          '^async_hooks$',
          '^punycode$',
          '^domain$',
          '^constants$',
          '^sys$',
          '^_linklist$',
          '^_stream_wrap$',
          '^(fs|http|https|net|path|events|stream|util)$',
        ],
      },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
      },
    },
    {
      name: 'no-duplicate-dep-types',
      comment:
        "it's an error when a module depends on an external ('npm') package that occurs more than once in its dependency graph: that is - the same package is dependent on directly and as a transpiled custom modification.",
      severity: 'error',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'no-unlicensed-packages',
      comment:
        'some packages do not have license information, which can be problematic when used as a commercial package',
      severity: 'info',
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
      from: {},
      to: {
        path: '[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: ['^node_modules', '^\\.git', '^\\.next', '^dist', '^build'],
    },
    moduleSystems: ['cjs', 'es6', 'tsd'],
    reporterOptions: {
      archi: {
        collapsePattern: '^(packages|src)/[^/]+',
      },
      dot: {
        collapsePattern: '^(packages|src)/[^/]+',
        theme: {
          graph: {
            rankdir: 'LR',
          },
        },
      },
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
