module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        alias: {
          '@app': './src/app',
          '@screens': './src/screens',
          '@features': './src/features',
          '@shared': './src/shared',
          '@assets': './assets',
        },
      },
    ],
  ],
};
