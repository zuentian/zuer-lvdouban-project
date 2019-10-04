const movie={
    state:{
        movieName:'',
    },
    mutations:{
        SET_MOVIE_NAME: (state, movieName) => {
            state.movieName=movieName
        }
    },
    actions: {
        SetMovieName({commit},data){
            commit('SET_MOVIE_NAME',data);
        }
    }
}

export default movie;