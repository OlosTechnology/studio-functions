export default {
  transform: {
    '^.+\\.js$': './config/studio-transformer.js',
  },
  reporters: [
    'default',
    [
      './config/missing-test-reporter.cjs',
      {
        functionsDir: 'functions',
        testsDir: 'tests',
        testSuffix: '.spec.js',
      },
    ],
  ],
};
