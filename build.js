import { GasPlugin } from "esbuild-gas-plugin"
import * as esbuild from "esbuild"


esbuild.build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'public/app.js',
  plugins: [GasPlugin]
}).catch(() => process.exit(1))
