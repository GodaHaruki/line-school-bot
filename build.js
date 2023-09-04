import { GasPlugin } from "esbuild-gas-plugin"
import * as esbuild from "esbuild"


esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [GasPlugin]
}).catch(() => process.exit(1))
