const getters={

    sidebar: state => state.app.sidebar,
    visitedViews: state => state.app.visitedViews,
    token: state => state.user.token,
    menus: state => state.user.menus,
    addRouters: state => state.permission.addRouters,
    permissionMenus: state => state.user.permissionMenus,
    avatar: state => state.user.avatar,
    name:state=>state.user.name,
    username:state=>state.user.username,
    userId:state=>state.user.userId,
    routerTrees:state=>state.user.routerTrees,
    roles:state=>state.user.roles,
    elements:state=>state.user.elements,
    nameBak:state=>state.user.nameBak,
    movieName:state=>state.movie.movieName,
    level:state=>state.user.level,
    crtTime:state=>state.user.crtTime,
}

export default getters