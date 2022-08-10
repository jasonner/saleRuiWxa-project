// pages/lecture/index.js
const util = require('../../utils/util.js');
import pageUtil from '../../utils/page-util.js';
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
import http from '../../utils/http.js';
import config from '../../env/config.js';
// 获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoid:'',
        openid:'',
        x:'s',
        SignUpState:false,
        title:'立即预约'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //线下是报名 （可以取消报名）   线上是预约（不可以取消报名）        
        console.log(options);
        if(options.videoid){
            this.setData({
                videoid:options.videoid,
                x:options.x
            });
        };
        let value1 = wx.getStorageSync('openid');
        if(value1){
            this.setData({
                openid:value1
            })
            this.GetYuYueState();
        }else{
            this.GetDoctorInfo();
        }
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
        wx.hideHomeButton();
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },

    GetDoctorInfo(){//获取医生openid
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
                          that.GetYuYueState();
                        }else{
                            that.getOpenid();
                        }
                    }
                })
            }
        })
    },

    getOpenid(){//获取销售openid
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
                          that.GetYuYueState();
                        }else{
                            wx.redirectTo({
                              url: '../index/index',
                            })
                        }
                    }
                })
            }
        })
    },   

    GetYuYueState(){//获取预约状态
        let that = this;
        customer.GetYuYueState({ 
            'videoid':that.data.videoid,//视频ID
            'openid':that.data.openid,
          }).then((res1) => {
            if (res1.data.code && res1.data.code == '200') {
                console.log(res1.data)
                if(res1.data.msg == 'ok'){
                    if(res1.data.data.state>1 && res1.data.data.xian != '线上'){//（大于1表示就是预约过或者报名过）
                        that.setData({//线下已报名
                            SignUpState:true
                        })
                    }else{//线下或线上未报名
                        that.setData({
                            SignUpState:false
                        })
                    };
                    if(res1.data.data.state>1){
                        that.setData({
                            title:'预约成功'
                        })
                    }else{
                        if(res1.data.data.xian == '线上' || !res1.data.data.xian){
                            that.setData({
                                title:'立即预约'
                            })
                        }else{
                            that.setData({
                                title:'立即报名'
                            })
                        }
                    }
                }
            }
        })
    },

    yuyueChange(){//预约
        let that = this;
        wx.showModal({
            title: '',
            content: '是否确认预约？',
            cancelText:'否',
            confirmText:'是',
            cancelColor:'#5692ce',
            confirmColor:'#5692ce',
            success (res) {
                if (res.confirm) {
                    that.appointmentChange();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }, 

    appointmentChange(){//预约
        let that = this;
        customer.YuYue({ 
            'videoid':that.data.videoid,//视频ID
            'openid':that.data.openid,
          }).then((res1) => {
            if (res1.data.code && res1.data.code == '200') {
                if(res1.data.msg && res1.data.msg == 'ok'){
                    wx.requestSubscribeMessage({
                        tmplIds: ['mZVc3P-SE1z5-4ZsAo7tZBEQ1SOTUKR5Whb12sTnv4o','wYWTrECZ1xnJQrVG8tN334-Uho-qOoA0enaOFt4GsHs'],
                        success (res) {//mZVc3P-SE1z5-4ZsAo7tZBEQ1SOTUKR5Whb12sTnv4o(提前一天发)，wYWTrECZ1xnJQrVG8tN334-Uho-qOoA0enaOFt4GsHs（提前两小时发）
                            console.log(res);
                            wx.showModal({
                                title: '',
                                content: '预约成功',
                                cancelColor:'#5692ce',
                                confirmColor:'#5692ce',
                                showCancel:false
                            })
                            that.setData({
                                title:'预约成功'
                            })
                        }
                    })
                }else{
                    if(that.data.x =='s'){
                        wx.showModal({
                            title: '',
                            cancelText:'是',
                            confirmText:'否',
                            cancelColor:'#5692ce',
                            confirmColor:'#5692ce',
                            content: res1.data.msg,
                            success (res) {
                                if (res.confirm) {
                                    return
                                } else if (res.cancel) {//继续预约
                                    customer.YuYue({ 
                                        'videoid':that.data.videoid,//视频ID
                                        'openid':that.data.openid,
                                    }).then((res1) => {
                                        if (res1.data.code && res1.data.code == '200') {
                                            wx.requestSubscribeMessage({
                                                tmplIds: ['mZVc3P-SE1z5-4ZsAo7tZBEQ1SOTUKR5Whb12sTnv4o','wYWTrECZ1xnJQrVG8tN334-Uho-qOoA0enaOFt4GsHs'],
                                                success (res) {//mZVc3P-SE1z5-4ZsAo7tZBEQ1SOTUKR5Whb12sTnv4o(提前一天发)，wYWTrECZ1xnJQrVG8tN334-Uho-qOoA0enaOFt4GsHs（提前两小时发）
                                                    console.log(res);
                                                    wx.showModal({
                                                        title: '',
                                                        content: '预约成功',
                                                        cancelColor:'#5692ce',
                                                        confirmColor:'#5692ce',
                                                        showCancel:false
                                                    })
                                                    that.setData({
                                                        title:'预约成功'
                                                    })
                                                    //that.GetYuYueState();
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        wx.showModal({
                            title: '',
                            content: res1.data.msg,
                            cancelColor:'#5692ce',
                            confirmColor:'#5692ce',
                            showCancel:false
                        })
                    }
                }
            }
        })
    },

    //取消报名
    delyuyueChange(){
        let that = this;
        wx.showModal({
            title: '',
            content: '是否取消报名？',
            cancelText:'是',
            confirmText:'否',
            cancelColor:'#5692ce',
            confirmColor:'#5692ce',
            success (res) {
                if (res.confirm) {

                } else if (res.cancel) {
                    that.QuXiaoYuYueChange();
                }
            }
        })     
    },

    //取消报名
    QuXiaoYuYueChange(){
        let that = this;
        customer.QuXiaoYuYue({ 
            'videoid':that.data.videoid,//视频ID
            'openid':that.data.openid,
          }).then((res1) => {
            if (res1.data.code && res1.data.code == '200') {
                if(res1.data.msg && res1.data.msg == 'ok'){
                    wx.showModal({
                        title: '',
                        content: '取消成功',
                        cancelColor:'#5692ce',
                        confirmColor:'#5692ce',
                        showCancel:false
                    })
                    that.GetYuYueState();
                }else{
                    wx.showModal({
                        title: '',
                        content: res1.data.msg,
                    })
                }
            }
        })
    },

    getUserdetail(e){//详情
        wx.navigateTo({
          url: '../lectureDetail/index?id=1',
        })
    }
})