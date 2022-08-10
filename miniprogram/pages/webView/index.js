// pages/webView/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        href:'',
        cwid:'',
        openid:'',
        s:'',
        x:'',
        xian:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.setData({
            cwid:options.cwid,
            openid:options.openid,
            s:options.s,
            x:options.x,
            xian:options.xian,
        });
        if(options.share == '1'){
            this.setData({
                href: 'https://tm2021.forhoo.com.cn/21/2021TM/invitation.html?cwid='+options.cwid+'&s='+options.s+'&openid='+options.openid+'&x='+options.x+'&xian='+options.xian
            });
        }else{
            this.setData({
                href: 'https://TM2021.forhoo.com.cn/21/2021TM/index.html?cwid='+options.cwid+'&s='+options.s+'&openid='+options.openid+'&x='+options.x+'&xian='+options.xian
            });
        }
        console.log(this.data.href);
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
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // wx.hideShareMenu({
        //     menus: ['shareAppMessage', 'shareTimeline']
        // })
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
    onShareAppMessage: function (res) {
        let that = this;
        console.log(res);
        if(res.from == "menu"){
            return {
                path:'/pages/index/index?share='+'1'+'&cwid='+that.data.cwid+'&s='+'d'+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian
            }
        }
    }
})