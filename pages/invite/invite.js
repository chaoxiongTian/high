const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionId:0,
    wxid:0,
    peopleNum:3,
    showEdit:true,
    personArray:[
      { avatarUrl: "image/back.png", userName: "小明"},
      { avatarUrl: "image/back.png", userName: "小明"},
      { avatarUrl: "image/back.png", userName: "小明"},
    ],
    latitude:null, 
    longitude:null,
    actionName: "吃饭",
    actionTime: "8月4日\t周日\t11:45",
    actionPosName: "深圳腾讯滨海大厦",
    actionPosDec: "广东省深圳市南山区后海大道与滨海大道交汇处",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setData({
      actionId:options.id,
      wxid:app.global.userInfo.wxid
    })

    wx.request({
      url: '149.28.31.199:8080/get_action',
      data: {
        wxid:this.wxid,
        actionId:this.actionId,
      },
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200){
          
        } else {
          console.log("invite.js getAction error : "+res.statusCode)
        }
      }
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

  onTapBack: function () {

  },

  openLocation: function() {
    
  }
})
