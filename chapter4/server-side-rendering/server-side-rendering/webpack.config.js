// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/
const path = require('path')

const nodeExternals = require('webpack-node-externals')

/** @type WebpackConfig[] */
const configs = [
  {
    // 브라우저의 경우 entry가 ./src/index.tsx 이며 그중 resolve.extensions로 번들링에 포함해야 하는 파일 선언
    // 이 결과물을 __dirname, './dist'에 만들도록 선언 
    // react와 react-dom은 외부 CDN 서비스를 사용하기 위해 번들링에서 제외
    // 타입스크립트 파일을 읽어 들이기 위한 ts-loader를 추가
    entry: {
      browser: './src/index.tsx',
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx'],
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
      ],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  // 서버의 경우 entry가 ./src/server.ts이며 그 외 설정은 비슷하다
  // HTML을 불러오기 위한 raw-loader 그리고 target을 node로 하고 node의 API는 모두 Node.js에서 제공하므로 nodeExternal()로 번들러 제외
  {
    entry: {
      server: './src/server.ts',
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx'],
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          test: /\.html$/,
          use: 'raw-loader',
        },
      ],
    },
    target: 'node',
    externals: [nodeExternals()],
  },
]

module.exports = configs

// entry를 선언해 시작점을 선언하고 필요한 파일과 그에 맞는 loader를 제공 마지막으로 번들링에서 제외할 내용을 선언한 뒤 output으로 내보낸다
// create-react-app 내부에서 이러한 웹팩 설정을 모두 대신 해주기 떄문에 webpack.config.js를 만들 필요가 없다
// 설정파일을 추출하는 명령어인 eject를 실행하면 어떠한 설정이 있는지 확인해 볼 수 있다