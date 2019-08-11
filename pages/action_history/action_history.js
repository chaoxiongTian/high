//获取应用实例
const app = getApp()

Page({
  data: {
    listData: [],
    backBtnTop: 6,
    navHeight:6,
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },

  onLoad: function () {
    this.onRequestData();
    this.setBackBtn();
  },
  setBackBtn() {
    this.setData({
      backBtnTop: wx.getSystemInfoSync().statusBarHeight + 6,
      navHeight: wx.getSystemInfoSync().statusBarHeight + 43,
    })
  },
  tapBack() {
    wx.navigateBack({
    })
  },
  onClickAction: function (e) {
    var next_url = '../invite/invite?id=' + e.currentTarget.dataset.supplierid;
    wx.navigateTo({
      url:next_url
    })
    console.log("action id:" + e.currentTarget.dataset.supplierid);
  },

  onRequestData:function(){
    //请求数据
    var that = this;
    var userInfo = new Array();
    console.log('in list view')
    console.log(app.globalData.userOpenId);
    var user1 = {
      "id": 1,
      "avatar": 'https://img2.woyaogexing.com/2019/08/09/45d6df80f5cb46ad99a99368f3829ac5!400x400.jpeg',
      "show":false
    };
    var user2 = {
      "id": 2,
      "avatar": 'https://img2.woyaogexing.com/2019/08/09/6f4620051985427c910e76447fed9862!400x400.jpeg',
      "show": false
    };
    var user3 = {
      "id": 3,
      "avatar": 'https://img2.woyaogexing.com/2019/08/09/eeb3c242170447dfa3e58ba6b7be88d5!400x400.jpeg',
      "show": false
    };
    var user4 = {
      "id": 4,
      "avatar": 'https://img2.woyaogexing.com/2019/08/09/0bc9f4ca84134c739e910a78d5f08f26!400x400.jpeg',
      "show": false
    };
    userInfo.push(user1);
    userInfo.push(user2);
    userInfo.push(user3);
    userInfo.push(user4);

    var actionInfo = new Array();
    var action1 = {
      "id": 1,
      "theme": "看电影",
      "time": "8月4日 周日 11:45",
      "location": "中影南方影城（科技园店）",
      "address": "广东省深圳市南山区科兴路10号科技园文化广场3层",
      "participants": userInfo,
      "status": true,
      "shouldEllipsis":false
    }

    var action2 = {
      "id": 2,
      "theme": "吃饭",
      "time": "8月5日 周一 16:45",
      "location": "竹乡味（海王银河科技大厦店）",
      "address": "广东省深圳市南山区科技中三路1号海王银河科技大厦4层",
      "participants": userInfo,
      "status": false,
      "shouldEllipsis": false
    }

    var action3 = {
      "id": 3,
      "theme": "KTV",
      "time": "8月6日 周二 14:45",
      "location": "利歌宴自助式KTV（天利名城店）",
      "address": "广东省深圳市南山区海德三道85号天利名城购物中心F4层L4-01",
      "participants": userInfo,
      "status": false,
      "shouldEllipsis": false
    }

    actionInfo.push(action1);
    actionInfo.push(action2);
    actionInfo.push(action3);

    console.log(actionInfo);

    actionInfo.forEach((action, action_index, array) => {
      action.participants.forEach((user, user_index,array) => {
        if (user_index < 3){
          this.getAvatarImage(user.avatar);
          user.show = true;
        }
        else{
          user.show = false;
        }
      })
      if (this.userNum(action.participants) > 3) {
        action.shouldEllipsis = true;
      }
      else {
        action.shouldEllipsis = false;
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          actionList: actionInfo
        })
      },
    })
  },

  getAvatarImage: function (avatarUrl) {
    var that = this;
    console.log(avatarUrl);
    wx.downloadFile({
      url: avatarUrl,
      success: function (res) {
        var cachePath = res.tempFilePath.replace("http:/", '').replace("https:/", '')
        that.setData({
          avatarUrl: cachePath,
          hasAvatar: true
        })
      }
    })
  },

  userNum:function(users){
    var counter = 0;
    for(var x in users){
      counter++;
    }
    return counter;
  },

  onShow: function () {
    global.sss = this;
    let scope = this;
  },
},
)
