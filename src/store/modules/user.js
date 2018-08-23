
import { constantRouterMap, asyncRouterMap, errorRouterMap } from '@/router/routes'
import { setToken, clearAllCache, setKey, getKey } from '@/utils/auth'
import api from '@/api'
import router from './../../router'
const user = {
  state: {
    token: '',
    name: '',
    avatar: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
    roles: [],
    hasMenus: {},
    menuList: [],
    firstPage: '/'
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_MENULIST: (state, routes) => {
      state.menuList = constantRouterMap.concat(routes)
    },
    SET_HASMENUS: (state, menus) => {
      state.hasMenus = menus
    },
    SET_FIRSTPAGE: (state, firstPage) => {
      state.firstPage = firstPage
    }
  },
  actions: {
    login: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        api.loginByUsername(data).then((res) => {
          const result = res.data
          commit('SET_TOKEN', result.access_token)
          setToken(result.access_token)
          setKey('refresh_token', result.refresh_token)
          setKey('expires_in', result.expires_in)
          //   let routes = asyncRouterMap
          //   commit('SET_MENULIST', routes)
          //   router.addRoutes(routes.concat(errorRouterMap))
          //   setKey('refresh_token', result.refresh_token)
          //   setKey('expires_in', result.expires_in)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户菜单
    getUserMenu: ({ commit, state }) => {
      return new Promise((resolve, reject) => {
        // 暂时无权限控制 分配所有菜单路由
        let routes = asyncRouterMap
        commit('SET_NAME', getKey('user_name'))
        commit('SET_MENULIST', routes)
        router.addRoutes(routes.concat(errorRouterMap))
        resolve()
        // let routes = []
        // // const userMenus = state.hasMenus
        // const userMenus = JSON.parse(getKey('hasMenus'))

        // asyncRouterMap.forEach(item => {
        //   if (userMenus.hasOwnProperty(item.name) && userMenus[item.name]) {
        //     if (item.children && item.children.length) {
        //       let children = item.children.filter(element => {
        //         return userMenus.hasOwnProperty(element.name) && userMenus[element.name]
        //       })
        //       item.children = children
        //     }
        //     routes.push(item)
        //   }
        // })
        // commit('SET_MENULIST', routes)
        // router.addRoutes(routes.concat(errorRouterMap))
        // resolve()
        //     router.addRoutes(routes.concat(errorRouterMap))
        // api.getUserInfo().then(res => {
        //   if (res && res.data) {
        //     const user = res.data
        //     commit('SET_HASMENUS', res.data.menus)
        //     commit('SET_NAME', user.name)
        //     commit('SET_AVATAR', user.avatar)
        //     const userMenus = res.data.menus

        //     //  设置左侧可显示菜单
        //     let routes = []
        //     if (!user.is_admin) {
        //       asyncRouterMap.forEach(item => {
        //         if (userMenus.hasOwnProperty(item.name) && userMenus[item.name]) {
        //           if (item.children && item.children.length) {
        //             let children = item.children.filter(element => {
        //               return userMenus.hasOwnProperty(element.name) && userMenus[element.name]
        //             })
        //             item.children = children
        //           }
        //           routes.push(item)
        //         }
        //       })
        //     } else {
        //       routes = asyncRouterMap
        //     }
        //     commit('SET_MENULIST', routes)
        //     router.addRoutes(routes.concat(errorRouterMap))
        //   }
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    getUserInfo: ({commit}) => {
      return new Promise((resolve, reject) => {
        api.getUserInfo().then((res) => {
          const user = res.data
          commit('SET_NAME', user.name)
          setKey('user_name', user.name)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取codepackages
    getCodePackages: ({commit}, data) => {
      return api.getCodePackages(data)
    },
    // 新增code
    insertCodePackage: ({commit}, data) => {
      return api.insertCodePackage(data)
    },
    // 编辑code
    updateCodePackaget: ({commit}, data) => {
      return api.updateCodePackaget(data)
    },
    // 修改状态
    deleteCodePackage: ({commit}, data) => {
      return api.deleteCodePackage(data)
    },
    // 退出登录
    logOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        clearAllCache()
        resolve()
      })
    },
    // 前端 登出
    fedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        clearAllCache()
        resolve()
      })
    }
  }
}

export default user
