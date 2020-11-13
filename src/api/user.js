import request from '@/utils/axios'

export function login(data) {
    return request({
      url: '/api/front/member/login.json',
      headers: {
        Authorization: 'Basic TW9iaWxlOkFuZHJvaWQtSU9T',
        'Content-Type': 'application/json'
      },
      data,
      method: 'post'
    })
  }