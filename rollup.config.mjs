import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import pkg from "./package.json" assert { type: "json" };

const createOutput = (config) => ({
  sourcemap: true,
  ...(config || {}),
});

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ].map(createOutput),
  plugins: [typescript(), nodeResolve({ preferBuiltins: false }), commonjs()],
  external: [
    ...Object.keys(pkg.dependencies || {}),        // Exclude dependencies
    ...Object.keys(pkg.devDependencies || {}),    // Exclude peerDependencies
]
};

export default config;
