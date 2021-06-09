const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname,'dist/js'),
    filename: '[name].js'
  },
  entry: {
    "./redux/rootReducer": ['@babel/polyfill','./src/redux/rootReducer.js'],
    "./redux/counter.action": ['@babel/polyfill','./src/redux/counter/action.js'],
    "./redux/counter.reducer": ['@babel/polyfill','./src/redux/counter/reducer.js'],
    "./counter": ['@babel/polyfill','./src/counter.js'],
    "./redux/todos.action": ['@babel/polyfill','./src/redux/todos/action.js'],
    "./redux/todos.reducer": ['@babel/polyfill','./src/redux/todos/reducer.js'],
    "./todos": ['@babel/polyfill','./src/todos.js']
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          },
        },
      }
    ]
  }
};