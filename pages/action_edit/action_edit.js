// pages/action_edit/action_edit.js
var util = require('../utils/util.js');
const date = new Date()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityTitle:null,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    address:null,
    errMsg:null,
    latitude:null,
    longitude:null,
    location_name:"",
    time:null,
    remind_time: 0,
    timestamp: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('!!!!!!!time', this.data.time)
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('123123',this.data.timestamp)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  time_select_click: function (event) {
    wx.navigateTo({
      url: 'action_edit_time_select/action_edit_time_select'
    })
  },
  remind_select_click: function (event) {
    wx.navigateTo({
      url: 'action_edit_remind/action_edit_remind'
    })
  },
  location_select_click: function (event) {
    // wx.navigateTo({
    //   url: 'action_edit_time_select/action_edit_time_select'
    // })
    var that = this;
    wx.chooseLocation({
      success:function (res) {
        console.log(res)
        that.setData({
          address:res.address,
          errMsg: res.errMsg,
          latitude: res.latitude,
          longitude: res.longitude,
          location_name: res.name,
        })
      }
    })
  },
})