import http from '../utils/http.js'
import config from'../env/config.js'

const URL = config.hrp_server_url
module.exports = {
    //获取栏目
    getColumn: (params) => http.get(URL + '/onlineClass/taxonList', { data: params, header: { 
      'content-type': 'application/json;charset=UTF-8'}}),

    //创建VTE
    createTrade:(params) => http.post(URL + '/onlineClass/createTrade', { data: params, header: { 
      "Content-Type": "application/x-www-form-urlencoded"}}), 
      
}