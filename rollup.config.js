import babel from 'rollup-plugin-babel';

export default {
  entry: './src/index.js',
  dest: './dist/open-address.js',
  format: 'cjs',
  plugins: [ babel()
  ]
};
