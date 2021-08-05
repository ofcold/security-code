import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import { pascalCase } from 'change-case';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = pascalCase(pkg.name.replace(/^.+\//, ''));

export default ['umd', 'esm'].map((format) => ({
  input: 'src/index.ts',
  output: ['development', 'production'].map((mode) => {
    const output = {
      format,
      name,
      file: pkg.main,
      globals: {
        vue: 'Vue',
      },
    };

    if (format === 'esm') {
      output.file = pkg.module;
    }

    if (mode === 'production') {
      output.compact = true;
      output.file = output.file.replace(/(\.js)$/, '.min$1');
      output.plugins = [
        terser(),
      ];
    }

    return output;
  }),
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    typescript(),
    vue({
      preprocessStyles: true,
    }),
    postcss({
      extensions: ['.css', '.scss'],
      minimize: true,
    }),
  ],
}));
