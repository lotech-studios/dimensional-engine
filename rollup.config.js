import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: './index.js',
    output: [
        {
            file: './build/dimension-engine.js',
            format: 'cjs'
        },
        {
            file: './build/dimension-engine.module.js',
            format: 'es'
        },
    ],
    plugins: [ nodeResolve() ]
}