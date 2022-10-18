var path = require( 'path' )

function createESConfig () {

    return {
        entry: './index.js',
        output: {
            path: path.resolve( __dirname, 'build' ),
            filename: 'dimensional-engine.esm.js',
            library: {
                type: "module",
            }
        },
        experiments: {
            outputModule: true,
        },
        resolve: {
            modules: [ 'node_modules' ]
        }
    }

}

function createJSConfig ( target ) {

    return {
        entry: './index.js',
        output: {
            path: path.resolve( __dirname, 'build' ),
            filename: `dimensional-engine.${ target }.js`,
            library: 'dimensional-engine',
            libraryTarget: target
        },
        resolve: {
            modules: [ 'node_modules' ]
        }
    }

}

module.exports = [ 
    createESConfig(), 
    createJSConfig( 'var' ), 
    createJSConfig( 'commonjs2' ) 
]