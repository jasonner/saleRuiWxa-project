// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') ,// 如需尝试获取用户信息可改为false
    openid:null
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  sedMsg(){
    console.log('发送消息');

    wx.requestSubscribeMessage({
      tmplIds: ['rQmfM4pIJgKCWCAL_VoFrJclXu90kxlWVEq6KR4PMBY','Det09jcj1MEofNFWa_ZHPDMUpyZTGlqPap3xBVf6DCM','OlaV0KWN7ngjzKXwP3NGOUYKOA4LMUl8A6VSBZmbv4k'],
      success (res) {
        console.log(res)
        res === {
           errMsg: "requestSubscribeMessage:ok",
           "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
        }
      }
    })
  },
  getsedMsg(e){
    let that=this;
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log(res.code);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              // 小程序唯一标示
              appid: 'wxbf384a11364388c7',
              // 小程序的 app secret
              secret: 'e95b74e63f3cd4cd2e980ccff6124f70',
              grant_type: 'authorization_code',
              js_code: res.code
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (openIdRes) {
              // 获取到 openId
              console.log(openIdRes);
              console.log("openid:"+openIdRes.data.openid);
              that.setData({
                openid: app.globalData.openid
              })
             
              // 判断openId是否为空
              if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                let openIdRes =  app.globalData.openid;
                let token = '50_2Imos8zyiazt5eqS_-IgQZNu4nhqiLg60udPMdtGvM3OiiBanMetRxmZj1FdNphEfhOhmh5SnxcsZwx7Kz3XhImAs5eOCfdjsn-Wbzwu_sL_2ywCEJQt1KxhrMuIXieh91l9Qj99Bcv3aKQEWAPhAHASWL'
                wx.request({
                  url: 'https://tm2021.forhoo.com.cn/home/test?accesstoken='+token+'&openid='+openIdRes,
                  data: { },
                  method: 'GET',
                  header: { 'content-type': 'application/json; charset=utf-8' },
                  success: function (res) {
                    // 获取到 openId
                    console.log(res);
                  }
                })
              } else {
                // openId为空
              }
            }
          })
          // code = res.code
          var code = res.code;
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log(res);
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
          //发起网络请求
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    
  },
  onShow(){
    let that=this;
    wx.login({
      success: res => {
        console.log(res.code)
       
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log(res.code);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              // 小程序唯一标示
              appid: 'wxbf384a11364388c7',
              // 小程序的 app secret
              secret: 'e95b74e63f3cd4cd2e980ccff6124f70',
              grant_type: 'authorization_code',
              js_code: res.code
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (openIdRes) {
              // 获取到 openId
              console.log(openIdRes);
              console.log("openid:"+openIdRes.data.openid);
              that.setData({
                openid: app.globalData.openid
              })
             
              // 判断openId是否为空
              if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                wx.getUserInfo({
                  success: function (data) {
                    // 自定义操作
                    // 绑定数据，渲染页面
                    console.log(data);
                   
                  }
                })
              } else {
                // openId为空
              }
            }
          })
          // code = res.code
          var code = res.code;
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
              console.log(res2);
              //that.globalData.userInfo = res2.userInfo;
             // console.log(that.globalData.userInfo);
            }
          })
          //发起网络请求
          console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  
  onLoad() {
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
