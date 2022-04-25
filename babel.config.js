module.exports = {
  overrides: [
    { test: /\.js$/, presets: common },
    { test: /\.ts$/, presets: [...common, "@babel/typescript"] },
    { test: /\.tsx$/, presets: [...common, "@babel/typescript", "@babel/react"] }
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@adapters': './src/adapters',
        '@business': './src/business',
        '@config': './src/config',
        '@ports': './src/ports',
        '@utils': './src/utils',
        '@models': './src/models'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
