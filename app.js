// const globalData = {
//   alias: {
//     '@': __dirname,
//     // 添加其他路径别名...
//   }
// };


App({
  onLaunch: function () {
    console.log(getApp())
  },
  require(path) {
    return require(`${path}`)
  },
})
