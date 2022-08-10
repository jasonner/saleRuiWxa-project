// index.js
const util = require('../../utils/util.js');
import pageUtil from '../../utils/page-util.js';
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
import http from '../../utils/http.js';
import config from '../../env/config.js';
// 获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') ,// 如需尝试获取用户信息可改为false
    openid:null,
    userInfo:null,
    cwid:'-1',
    x:'',
    xian:'',
    s:'',
    disableInput:false,
    show:false,
    isLogin:false,
  },

  onShow(){
    wx.hideShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onLoad(options) {
    let that = this;
    //1.角色;
    //2.是否登录过:（调医生和销售分别接口) 缓存中有openid则调用接口;
    //3.进入途径（三种情况）
    that.channel(options);
    
  },
  
  channel(options){//途径
    let that = this;
    //两个角色（销售和医生） 医生三种进入途径   1.x:s=xian:线上（参数获取），2.x:x=xian:线下（cwid为-1,);
    const scene = decodeURIComponent(options.scene);
    console.log(options.scene);
    console.log(scene);
    const query = decodeURIComponent(options.q);
    if(query && query!='undefined'){//途径1：普通二维码进入
      console.log('普通二维码进入');
      //角色判断
      if(query.indexOf("s=u") != -1){
        that.setData({
          s:'u',
        });
        //销售码
        that.GetSaleInfo();
      }else{
        that.setData({
          s:'d',
        });
        if(query.indexOf("cwid") != -1){
          that.setData({
            cwid:query.match(/&cwid=(\S*)&/)[1],
          });
        }else{
          that.setData({
            cwid:'-1'
          });
        }; 
        if(query.indexOf("x=") != -1){
          if(query.match(/&x=(\S*)&/)[1] =='s'){//线上
            that.setData({
              x:'s',
              xian:'线上'
            });
          }else{//线下
            that.setData({
              x:'x',
              xian:'线下'
            });
          };
        };
        that.GetDoctorInfo();
      }
    }else if(scene !='undefined' && scene){//途径2：小程序太阳码进入
      if(scene.indexOf("s=u") != -1){//销售
        that.setData({
          s:'u',
          xian:'线上',
          x:'s'
        });
        that.GetSaleInfo();
      }else{//医生
        that.setData({
          s:'d',
        });
        if(scene.indexOf("x=s") != -1){//线上
          that.setData({
            x:'s',
            xian:'线上'
          });
        }else{//线下
          that.setData({
            x:'x',
            xian:'线下'
          });
        };
        if(scene.indexOf("cwid") != -1){
          that.setData({
            cwid:scene.match(/&cwid=(\S*)&/)[1],
          });
        }else{
          that.setData({
            cwid:'-1'
          });
        }; 
        that.GetDoctorInfo();
      }
    }else{//途径3：搜索进入
      if(options.share =='1'){//点击分享图片进入
        that.setData({
          cwid:options.cwid,
          x:'s',
          s:'d',
          xian:'线上'
        });
      }else{
        that.setData({
          cwid:'-1',
          x:'s',
          s:'d',
          xian:'线上'
        });
      };
      that.getOpenid();
      // wx.navigateTo({
      //   url: '../lecture/index',
      // })
      console.log('搜索进入');
    }
  },

  getOpenid(){
    let that = this;
    wx.login({
        timeout: 5000,//超时时间
        success: (result) => {
            customer.checkLogin({ 
              'JSCODE':result.code,
            }).then((res) => {
                console.log(res);
                if (res.data.code && res.data.code== '200') {
                    if(res.data.success && res.data.data){ 
                      that.setData({
                        openid:res.data.data
                      })
                      customer.GetUserInfoByOpenid({ //销售是否登录过
                        'openid':that.data.openid,
                      }).then((res1) => {
                        if (res1.data.code && res1.data.code == '200') {
                          if(res1.data.data){//销售跳转到H5页面
                            that.setData({
                              openid:res1.data.data.openid,
                              cwid:res1.data.data.cwid,
                              s:'u'
                            });
                            wx.setStorage({
                              key:"openid",
                              data:res1.data.data.openid
                            });
                            wx.setStorage({
                              key:"cwid",
                              data:res1.data.data.cwid
                            });
                            wx.redirectTo({
                              url: '../webView/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                            });
                          }else{
                            that.GetDoctorInfo();
                          }
                        }
                      })
                      console.log(that.data.openid)
                    }
                }
            })
        }
    })
  },

  //获取销售信息（判断缓存中是否有值）
  GetSaleInfo(){
    let that = this;
    let value1 = wx.getStorageSync('openid');
    let value2 = wx.getStorageSync('cwid');
    if(value1 && value2){
      that.setData({
        openid:value1,
        cwid:value2,
      });
      that.HasSale();
    }else{
      that.setData({
        show:true,
      });
    }
  },

  //获取医生信息（判断缓存中是否有值）
  GetDoctorInfo(){
    let that = this;
      wx.login({
        timeout: 5000,//超时时间
        success: (result) => {
            customer.checkLogin({ 
              'JSCODE':result.code,
            }).then((res) => {
                console.log(res);
                if (res.data.code && res.data.code== '200') {
                    if(res.data.success && res.data.data){ 
                      that.setData({
                        openid:res.data.data
                      })
                      customer.GetDoctorInfo({ 
                        'openid':that.data.openid,
                      }).then((res1) => {
                        console.log(res1);
                        if (res1.data.code && res1.data.code == '200') {
                          if(res1.data.success && res1.data.data){//跳转到H5页面
                            console.log('跳转到H5页面')
                            wx.redirectTo({
                              url: '../webView/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                            });
                          }else{
                            console.log('重新进入到邀请页面')
                            wx.redirectTo({
                              url: '../invitation/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                            })
                          }
                        }
                      })
                    }
                }
            })
        }
    })
  },

  hasDoctor(){//销售数据表中是否有医生
    let that = this;
    customer.GetUserInfo({ 
      'openid':that.data.openid,
      'cwid':that.data.cwid
    }).then((res) => {
      console.log(res.data);
      if (res.data.code && res.data.code == '200') {
        if(res.data.success && res.data.data){//跳转到H5页面
          wx.showModal({
            title: '提示',
            content: '请使用销售端',
            showCancel:false,
          })
        }else{
          customer.GetDoctorInfo({ 
            'openid':that.data.openid,
          }).then((res1) => {
            console.log(res1);
            if (res1.data.code && res1.data.code == '200') {
              if(res1.data.success && res1.data.data){//跳转到H5页面
                console.log('跳转到H5页面')
                wx.redirectTo({
                  url: '../webView/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                });
              }else{
                console.log('重新进入到邀请页面')
                wx.redirectTo({
                  url: '../invitation/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                })
              }
            }
          })
        }
      }
    })
  },

  HasSale(){//医生数据表中是否有销售
    let that = this;
    customer.GetDoctorInfo({ 
      'openid':that.data.openid,
    }).then((res) => {
      console.log(res);
      if (res.data.code && res.data.code == '200') {
        if(res.data.success && res.data.data){
          wx.showModal({
            title: '提示',
            content: '请使用医生端',
            showCancel:false
          })  
        }else{
          customer.GetUserInfo({ 
            'openid':that.data.openid,
            'cwid':that.data.cwid
          }).then((res) => {
            console.log(res.data);
            if (res.data.code && res.data.code == '200') {
              if(res.data.data){//跳转到H5页面
                wx.redirectTo({
                  url: '../webView/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                });
              }else{
                that.setData({
                  show:true,
                });
              } 
            }
          })
        }
      }
    })
  },

  getUserCwid(e){
    this.data.cwid = e.detail.value;
  },

  getUserProfile(e) {
    let that = this;
    that.setData({
      disableInput:true,
    });
    setTimeout(() => {
      that.setData({
        disableInput:false,
      });
    }, 5000);
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.errMsg == 'getUserProfile:ok')
        console.log(res);
        if(res.errMsg == 'getUserProfile:ok'){
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          that.GetInfo();
        }
      }
    })
  },

  //获取用户信息
  GetInfo(){
    if(this.data.cwid ==''){
      wx.showToast({
        title: '请输入CWID',
        icon: 'error',
        duration: 2000
      })
      return;
    }else{
      let that = this;
      wx.login({
        timeout: 50000,//超时时间
        success: (result) => {
          customer.checkLogin({ 
            'JSCODE':result.code,
            'headurl':that.data.userInfo.avatarUrl,
            'nickname':that.data.userInfo.nickName
          }).then((res) => {
            console.log(res);
            if (res.data.code && res.data.code== '200') {
              if(res.data.success){
                that.setData({
                  openid: res.data.data
                });
                if(that.data.userInfo.avatarUrl){
                  that.UserLogin();
                }
              }
            }
          })
        }
      })
    }
  },

  UserLogin(){
    let that = this;
    customer.bindLogin({ 
      'cwid':that.data.cwid,
      'openid':that.data.openid,
    }).then((res) => {
      console.log(res);
      if (res.data.code && res.data.code == '200') {
        if(res.data.msg == 'ok'){
          wx.setStorage({
            key:"openid",
            data:that.data.openid
          });
          wx.setStorage({
            key:"cwid",
            data:that.data.cwid
          });
          wx.redirectTo({
            url: '../webView/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },

})
