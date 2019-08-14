// pages/action_edit/action_edit.js
const app = getApp();
var util = require('../utils/util.js');
const date = new Date()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityTitle:'',
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    address:'',
    errMsg:'',
    latitude:0,
    longitude:0,
    location_name:"",
    time:0,
    remind_time: 0,
    timestamp: "",
    backBtnTop: 6,
    navHeight: 6,
    isUpdate:false,
    actionId:'',
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
    this.setBackBtn();
    if(options.actionId) {
      this.updateInfo(options);
      console.log('updateAction:',options);
    }
  },
  updateInfo:function(options){
    let data = JSON.parse(options.action)
    //let data = options.action
    console.log(data);
    let actionTimes = new Date(data.actionTime * 1000)
    this.setData({
      isUpdate:true,
      actionId:options.actionId,
      location_name: data.actionPosName,
      longitude: data.longitude,
      latitude: data.latitude,
      address: data.actionPosDec,
      activityTitle: data.actionName,
      remind_time: data.noticeTime,
      timestamp: data.actionTime,
      year:actionTimes.getFullYear(),
      month: actionTimes.getMonth() + 1,
      day: actionTimes.getDate(),
      hours: actionTimes.getHours(),
      minutes: actionTimes.getMinutes(),
      time: util.formatTime(actionTimes),
    });
    
  },
  setBackBtn() {
    this.setData({
      backBtnTop: wx.getSystemInfoSync().statusBarHeight + 6,
      navHeight: wx.getSystemInfoSync().statusBarHeight + 43,
    })
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
    if (this.data.actionId !=''){
      var path = "pages/index/index?share=1&id=" + app.globalData.userOpenId + '&actionId=' + this.data.actionId;
      var desc = app.globalData.userInfo.nickName + "邀请你来使用";
      return {
        title: '嗨的不行',
        desc: desc,
        path: path,
      }
    } else {
        var path = "pages/index/index?share=1&id=" + app.globalData.userOpenId;
        var desc = app.globalData.userInfo.nickName + "邀请你来使用";
        return {
          title: '嗨的不行',
          desc: desc,
          path: path,
        }
    }
  },
  inputEnd:function(e){
    this.setData({
      activityTitle: e.detail.value
    });
    console.log('inputEnd:', e.detail.value);
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
  onTapBack:function() {
    wx.navigateBack({
      
    })
  },
  bindButtonTap:function(){
    if(this.data.isUpdate) {
      this.updateAction();
      wx.navigateBack({

      })
    } else {
      this.addAction();
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
  addAction:function() {
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/add_action.php',
      data: {
        wxid: app.globalData.userOpenId,
        isAdd: true ,
        actionID: '',
        actionName: this.data.activityTitle,
        actionTime: this.data.timestamp,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        actionPosName: this.data.location_name,
        actionPosDec: this.data.address,
        noticeTime: this.data.remind_time,
        otherInfo: "没有备注"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType: "json",
      method: 'POST',
      success: function (res) {
        console.log("add_action: " + res.data.actionId)
        that.setData({
          actionId: res.data.actionId
        })
        //that.onShareAppMessage();
      },
      fail: function () {
        console.log("add_action")
      }
    })
  },
  updateAction: function () {
    var that = this;
    wx.request({
      url: 'http://149.28.31.199/add_action.php',
      data: {
        wxid: app.globalData.userOpenId,
        isAdd: false,
        actionID: this.data.actionId,
        actionName: this.data.activityTitle,
        actionTime:this.data.timestamp,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        actionPosName: this.data.location_name,
        actionPosDec: this.data.address,
        noticeTime: this.data.remind_time,
        otherInfo: "没有备注"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      dataType: "json",
      method: 'POST',
      success: function (res) {
        console.log("add_action_update: " + res.data)
        console.log("add_action_update: " + res.data.actionId)
        that.setData({
          actionId: res.data.actionId,
        });
        //that.onShareAppMessage();
      },
      fail: function () {
        console.log("add_action")
      }
    })
  },
})