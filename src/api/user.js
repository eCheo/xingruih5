import service from '@/utils/axios'

export const login = data => {
    return service({
      url: '/api/login/login.json',
      data,
      method: 'post'
    })
}

export const loginOut = data => {
  return service({
    url: '/api/login/loginOut.json',
    data,
    method: 'post'
  })
}

export const getStaff = data => {
  return service({
    url: '/api/backend/customer/findByCondition.json',
    params: data,
    method: 'get'
  })
}

export const findCityAll = data => {
  return service({
    url: '/api/backend/customer/findCityAll.json',
    params: data,
    method: 'get'
  })
}