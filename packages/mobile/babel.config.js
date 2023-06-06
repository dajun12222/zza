module.exports = {
  presets: ['@babel/preset-env', ['@vue/app']],
  plugins: [
    [
      'import',
      { libraryName: '@h3/antd-vue', libraryDirectory: 'lib', style: true },
      '@h3/antd-vue',
    ],
    [
      'import',
      {
        libraryName: '@h3/report-mobile',
        libraryDirectory: 'lib',
        style: true,
      },
      '@h3/report-mobile',
    ],
    [
      'import',
      { libraryName: '@h3/thinking-ui', libraryDirectory: 'lib', style: true },
      '@h3/thinking-ui',
    ],
    [
      'import',
      { libraryName: '@h3/awesome-ui', libraryDirectory: 'lib', style: true },
      '@h3/awesome-ui',
    ],
  ],
};
