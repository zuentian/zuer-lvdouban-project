const getters={

    sidebar: state => state.app.sidebar,
    visitedViews: state => state.app.visitedViews,
    token: state => state.user.token,
    menus: state => state.user.menus,
    addRouters: state => state.permission.addRouters,
    permissionMenus: state => state.user.permissionMenus
}

export default getters