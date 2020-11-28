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

export const createCustomer = data => {
  return service({
    url: '/api/backend/customer/create.json',
    data,
    method: 'post'
  })
}

export const getTrackInfo = data => {
  return service({
    url: '/api/backend/customer/findFollowUpRecord.json',
    params: data,
    method: 'get'
  })
} 

export const findById = data => {
  return service({
    url: '/api/backend/customer/findById.json',
    params: data,
    method: 'get'
  })
} 

export const viewPhone = data => {
  return service({
    url: '/api/backend/customer/viewPhone.json',
    params: data,
    method: 'get'
  })
}

export const getShop = data => {
  return service({
    url: '/api/backend/shop/findPageByCondition.json',
    params: data,
    method: 'get'
  })
} 

export const rented = data => {
  return service({
    url: '/api/backend/shop/rented.json',
    data,
    method: 'post'
  })
}

export const getShopDetails = data => {
  return service({
    url: '/api/backend/shop/findById.json',
    params: data,
    method: 'get'
  })
}

export const createShop = data => {
  return service({
    url: '/api/backend/shop/create.json',
    data,
    method: 'post'
  })
}
// http://47.108.133.94:8080/api/obs/upload.json
export const uploadImg = data => {
  return service({
    url: 'api/obs/upload.json',
    data,
    method: 'post'
  })
}