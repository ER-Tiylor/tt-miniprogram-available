const app = getApp();
const util = app.require('./utils/utils1.js'); // CJS模块可以用app.require模拟路径别名
import {tool} from '../../utils/utils2.js' //ESM模块只能使用相对路径
Page({
  data: {

  },
  onLoad: function () {
    console.log('Welcome to Mini Code')
    util.tool()
    tool()
  },
})
