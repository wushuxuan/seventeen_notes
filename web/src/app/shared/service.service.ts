import { Injectable, Inject } from '@angular/core';
import { CacheService } from '@delon/cache';
import { MessageService } from '@shared/message.service';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public srv: CacheService, public message: MessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, ) { }

  judging(res) {
    if (res.data.errorCode != -1) {
      return res;
    } else if (res.data.errorCode == -1) {
      this.message.error(res.data.msg)
    } else {
      return null;
    }
  }

  http(params, url, type) {
    console.log(this.srv.getNone('token'))
    var headers: any = {};
    if (url != '/api/user/register' && url != '/api/user/login') {
      headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': this.tokenService.get().token
      }
    } else {
      headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      }
    }
    return axios({
      url: url,
      method: type,
      data: params,
      headers: headers,
      withCredentials: true,
    });
  }
  //注册
  register(params) {
    return this.http(params, '/api/user/register', 'post')
  }
  //注册
  login(params) {
    return this.http(params, '/api/user/login', 'post')
  }
  //创建日程
  save(params) {
    return this.http(params, '/api/tasks', 'post')
  }
  //获取日程
  get(params) {
    return this.http(params, '/api/tasks', 'get')
  }
  //更新日程
  update(params) {
    return this.http(params, '/api/tasks/' + params.id, 'put')
  }
  //删除日程
  del(params) {
    console.log("params.id:" + params.id)
    return this.http(params, '/api/tasks/' + params.id, 'delete')
  }
  //搜索日程
  search(params) {
    return this.http(params, '/api/tasks/search' + "?keyword=" + params.keyword + '&email=' + params.email, 'get')
  }

}
