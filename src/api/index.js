import http from './../utils/http'
export default {
  // 后台登录
  loginByUsername (data) {
    return http({
      url: '/api/auth/login',
      method: 'post',
      data
    })
  },
  // 当前登录用户信息
  getUserInfo (params) {
    return http({
      url: '/api/auth/me',
      method: 'get',
      params
    })
  },
  //   获取codePackages
  getCodePackages (params) {
    return http({
      url: '/api/code_packages',
      method: 'get',
      params
    })
  },
  //   修改CodePackage
  updateCodePackaget (data) {
    return http({
      url: `/api/code_packages/${data.id}`,
      method: 'put',
      data
    })
  },
  //   新增CodePackage
  insertCodePackage (data) {
    return http({
      url: '/api/code_packages',
      method: 'post',
      data
    })
  },
  // 修改状态
  deleteCodePackage (data) {
    return http({
      url: `/api/code_packages/${data.id}`,
      method: 'delete',
      data
    })
  },
  logOut (data) {
    return http({
      url: `/api/auth/logout`,
      method: 'delete',
      data
    })
  }
}
