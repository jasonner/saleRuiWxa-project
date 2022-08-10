// pages/invitation/index.js
const util = require('../../utils/util.js');
import pageUtil from '../../utils/page-util.js';
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
import http from '../../utils/http.js';
import config from '../../env/config.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cwid:'',
        x:'',
        xian:'',
        openid:'',
        s:'',
        share:'',
        url:"https://oss.sxyweb.com.cn/2021/w/TM2021/qrlist/lst.png"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.setData({
            cwid:options.cwid,
            x:options.x,
            xian:options.xian,
            openid:options.openid,
            s:options.s
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    goPage(){
        let that = this;
        let value1 = wx.getStorageSync('openid');
        if(value1){
            that.setData({
                openid:value1
            })
        };
        customer.GetDoctorInfo({ 
            'openid':that.data.openid,
        }).then((res1) => {
            console.log(res1);
            if (res1.data.code && res1.data.code == '200') {
              if(res1.data.success && res1.data.data){//跳转到H5页面
                wx.redirectTo({
                  url: '../webView/index?cwid='+that.data.cwid+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                });
              }else{
                wx.redirectTo({
                    url: '../register/index?cwid='+that.data.cwid+'&s='+that.data.s+'&x='+that.data.x+'&xian='+that.data.xian,
                });
              }
            }
        });
    },

    // 长按保存图片
    saveImage(e){
        let url = e.currentTarget.dataset.url;
        //用户需要授权
        wx.getSetting({
        success: (res) => {
            if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success:()=> {
                // 同意授权
                this.saveImg1(url);
                },
                fail: (res) =>{
                console.log(res);
                }
            })
            }else{
            // 已经授权了
            this.saveImg1(url);
            }
        },
        fail: (res) =>{
            console.log(res);
        }
        })   
    },

    saveImg1(url){
        wx.getImageInfo({
        src: url,
        success:(res)=> {
            let path = res.path;
            wx.saveImageToPhotosAlbum({
            filePath:path,
            success:(res)=> { 
                console.log(res);
            },
            fail:(res)=>{
                console.log(res);
            }
            })
        },
        fail:(res)=> {
            console.log(res);
        }
        })
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
        
    }
})