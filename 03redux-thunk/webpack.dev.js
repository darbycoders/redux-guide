const path = require('path');

module.exports = {
  mode: 'development',  
  watch:true,
  devServer: {
    contentBase: path.join(__dirname,'dist'),
    overlay: true,
    // hot: false,
    port: 3003,
    stats: "errors-only",
    // historyApiFallback: true, // SAP 경우 사용
    // before: (app,server,complier) => {
    //   app.get('/api/keywords',(req,res) => {
    //     res.json([
    //       {keyword: 'API 테스트1'},
    //       {keyword: 'API 테스트2'},
    //       {keyword: 'API 테스트3'}
    //     ])
    //   });
    // }
  },
  devtool:'cheap-module-eval-source-map'
}