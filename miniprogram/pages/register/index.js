// pages/register/index.js
const util = require('../../utils/util.js');
import pageUtil from '../../utils/page-util.js';
const hrp = require('../../api/hrp.js');
const customer = require('../../api/customer.js');
import http from '../../utils/http.js';
import config from '../../env/config.js';
// 获取应用实例
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:'',
        userName:'',
        Company:'',
        gradeArray: ['三级', '二级', '一级及社区'],
        gradeVal:'',
        departmentArray: ['心内科', '神经科', '血外科','呼吸科','内分泌科','骨科','骨瘤科','老年科','全科','介入科','其他'],
        departmentVal:'',
        titleArray:['主任医师','副主任医师','主治医师','住院医师','其他'],
        titleVal:'',
        disableInput:false,
        checkedFlag:false,
        cwid:'admin',
        openid:'',
        x:'',
        xian:'',
        s:'',
    },
    userNameChange:function(e){
        this.setData({
            userName: e.detail.value
        })
        console.log(this.data.userName);
    },
    CompanyChange:function(e){
        this.setData({
            Company: e.detail.value
        })
    },
    gradePickerChange:function(e){
        console.log(111)
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
        switch (e.detail.value) {
            case '0':
                this.setData({
                    gradeVal: '三级'
                })
                break;
            case '1':
                this.setData({
                    gradeVal: '二级'
                })
                break;
            case '2':
                this.setData({
                    gradeVal: '一级及社区'
                })
                break;            
            default:
                break;
        }
    },
    departmentPickerChange:function(e){
        switch (e.detail.value) {
            case '0':
                this.setData({
                    departmentVal: '心内科'
                })
                break;
            case '1':
                this.setData({
                    departmentVal: '神经科'
                })
                break;
            case '2':
                this.setData({
                    departmentVal: '血外科'
                })
                break; 
            case '3':
                this.setData({
                    departmentVal: '呼吸科'
                })
                break;
            case '4':
                this.setData({
                    departmentVal: '内分泌科'
                })
                break; 
            case '5':
                this.setData({
                    departmentVal: '骨科'
                })
                break; 
            case '6':
                this.setData({
                    departmentVal: '骨瘤科'
                })
                break;
            case '7':
                this.setData({
                    departmentVal: '老年科'
                })
                break;
            case '8':
                this.setData({
                    departmentVal: '全科'
                })
                break;
            case '9':
                this.setData({
                    departmentVal: '介入科'
                })
                break;   
            case '10':
                this.setData({
                    departmentVal: '其他'
                })
                break;         
            default:
                break;
        }
    },
    titlePickerChange:function(e){
        console.log(e.detail)
        switch (e.detail.value) {
            case '0':
                this.setData({
                    titleVal: '主任医师'
                })
                break;
            case '1':
                this.setData({
                    titleVal: '副主任医师'
                })
                break;
            case '2':
                this.setData({
                    titleVal: '主治医师'
                })
                break;   
            case '3':
                this.setData({
                    titleVal: '住院医师'
                })
                break;  
            case '4':
                this.setData({
                    titleVal: '其他'
                })
                break;        
            default:
                break;
        }
    },
    postUserProfile(e){
        let that = this;
        
        if(that.data.userName ==''){
            wx.showModal({
                title: '提示',
                content: '请填写姓名',
                showCancel:false
            })
             return
        }else if(that.data.Company ==''){
            wx.showModal({
                title: '提示',
                content: '请填写单位',
                showCancel:false
            })
             return
        }else if(that.data.gradeVal ==''){
            wx.showModal({
                title: '提示',
                content: '请选择医院等级',
                showCancel:false
            })
             return
        }else if(that.data.departmentVal ==''){
            wx.showModal({
                title: '提示',
                content: '请选择科室',
                showCancel:false
            })
             return
        }else if(that.data.titleVal ==''){
            wx.showModal({
                title: '提示',
                content: '请选择职称',
                showCancel:false
            })
             return
        }else if(!that.data.checkedFlag){
            wx.showModal({
                title: '提示',
                content: '请勾选条款',
                showCancel:false
            })
            return
        }else{
            that.setData({
                disableInput:true,
            });
            setTimeout(() => {
                that.setData({
                    disableInput:false,
                });
            }, 3000);
            wx.getUserProfile({
                desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    console.log(res.errMsg == 'getUserProfile:ok')
                    console.log(res);
                    if(res.errMsg == 'getUserProfile:ok'){
                        that.setData({
                            userInfo: res.userInfo,
                        });
                        that.GetInfo();
                    }
                }
            })
           
        }
    },
    
    //获取用户信息
    GetInfo(){
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
                        that.UserLogin();
                        }
                    }
                })
            }
        })
    },

    UserLogin(){
        let that = this;
        wx.login({
            timeout: 50000,//超时时间
            success: (result) => {
                customer.DoctorLogin({ 
                    'username':that.data.userName,
                    'hospital':that.data.Company,
                    'hospiallv':that.data.gradeVal,
                    'department':that.data.departmentVal,
                    'title':that.data.titleVal,
                    'cwid':that.data.cwid,
                    'openid':that.data.openid,
                    'xian':that.data.xian,
                    'code':result.code
                }).then((res) => {
                    console.log(res);
                    if (res.data.code && res.data.code == '200') {
                        // if(res.data.success){
                        if(res.data.msg == 'ok'){
                            wx.setStorage({
                                key:"openid",
                                data:that.data.openid
                            });
                            wx.showModal({
                                title: '提示',
                                content: '完成注册+300分',
                                showCancel:false,
                                success (res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定');
                                        wx.redirectTo({
                                            url: '../webView/index?Cwid='+that.data.cwId+'&s='+that.data.s+'&openid='+that.data.openid+'&x='+that.data.x+'&xian='+that.data.xian,
                                        })
                                    } 
                                }
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
            }
          })

    },
    privacyClauseChange(){
        wx.navigateTo({
          url: '../privacyClause/index',
        })
    },
    checkboxChange(e){
        this.data.checkedFlag = !this.data.checkedFlag;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            cwid:options.cwid,
            x:options.x,
            xian:options.xian,
            openid:options.openid,
            s:options.s,
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

})