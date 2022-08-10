import http from '../utils/http.js'
import config from'../env/config.js'

const URL = config.customer_server_url

module.exports = {

  //获取用户openid
  checkLogin:(params) => http.get(URL + '/home/GetInfo', { data: params, header: {'content-type': 'application/json;charset=UTF-8' } }),
  
   //销售登录
  bindLogin:(params) => http.post(URL + '/home/UserLogin', { data: params, header: {"Content-Type": "application/x-www-form-urlencoded"}}), 

  //获取销售信息
  GetUserInfo:(params) => http.get(URL + '/home/GetUserInfo', { data: params, header: {'content-type': 'application/json;charset=UTF-8' } }),

  //医生注册
  DoctorLogin:(params) => http.post(URL + '/home/DoctorLogin', { data: params, header: {"Content-Type": "application/x-www-form-urlencoded"}}), 

  //获取医生信息
  GetDoctorInfo:(params) => http.get(URL + '/home/GetDoctorInfo', { data: params, header: {'content-type': 'application/json;charset=UTF-8' } }),

  //获取销售信息
  GetUserInfoByOpenid:(params) => http.get(URL + '/home/GetUserInfoByOpenid', { data: params, header: {'content-type': 'application/json;charset=UTF-8' } }),

  //立即预约
  YuYue:(params) => http.post(URL + '/home/YuYue', { data: params, header: {"Content-Type": "application/x-www-form-urlencoded"}}), 

  //获取预约状态
  GetYuYueState:(params) => http.post(URL + '/home/GetYuYueState', { data: params, header: {"Content-Type": "application/x-www-form-urlencoded"}}), 

  //取消预约
  QuXiaoYuYue:(params) => http.post(URL + '/home/QuXiaoYuYue', { data: params, header: {"Content-Type": "application/x-www-form-urlencoded"}}), 
}