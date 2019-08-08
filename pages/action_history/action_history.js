//获取应用实例
const app = getApp()

Page({
  data: {
    listData: []
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },

  onLoad: function () {
    var that = this;
    var userInfo = new Array();
    var user1 = {
      "id": 1,
      "avatar": '../../img/avatar1.jpg'
    };
    var user2 = {
      "id": 2,
      "avatar": '../../img/avatar2.jpg'
    };
    var user3 = {
      "id": 3,
      "avatar": '../../img/avatar3.jpg',
    };
    var user4 = {
      "id": 4,
      "avatar": '../../img/ellipsis.jpg',
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
      "status": true
    }

    var action2 = {
      "id": 2,
      "theme": "吃饭",
      "time": "8月5日 周一 16:45",
      "location": "竹乡味（海王银河科技大厦店）",
      "address": "广东省深圳市南山区科技中三路1号海王银河科技大厦4层",
      "participants": userInfo,
      "status": false
    }

    var action3 = {
      "id": 3,
      "theme": "KTV",
      "time": "8月6日 周二 14:45",
      "location": "利歌宴自助式KTV（天利名城店）",
      "address": "广东省深圳市南山区海德三道85号天利名城购物中心F4层L4-01",
      "participants": userInfo,
      "status": false
    }

    actionInfo.push(action1);
    actionInfo.push(action2);
    actionInfo.push(action3);

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          actionList: actionInfo
        })
      },
    })
  },

  onClickAction: function (e) {
    console.log("action id:" + e.currentTarget.dataset.supplierid);
  },

  onShow: function () {
    global.sss = this;
    let scope = this;
  },
},
)
