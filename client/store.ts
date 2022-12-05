import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    //TODO: change this into neighborhood objects
    neighborhoods: [],
    userEmail: null,
    userNeighborhood: null,
    alerts: {},
    neighborhoodRoundTables: [], // the roundTables for the user's neighborhood
    neighborhoodRoundTableFilter : null,
    forumPosts: [],
    forumPostComments: [],
    userObject: null,
    petitions: [],
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setEmail(state, email) {
      /**
       * Update the stored email to the specified one.
       * @param email - new email to set
       */
      state.userEmail = email;
    },
    setUserObject(state, user){
      state.userObject = user
    },
    setNeighborhood(state, neighborhood) {
      /**
       * Update the stored neighborhood to the specified one.
       * @param neighborhood - new neighborhood to set
       */
      state.userNeighborhood = neighborhood;
    },
    updateNeighborhoods(state, neighborhoods) {
      /**
       * Update the stored neighborhoods to the provided neighborhoods.
       * @param neighborhoods - Neighborhoods to store
       */
      state.neighborhoods = neighborhoods;
    },
    async refreshNeighborhoods(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/neighborhood`;
      const res = await fetch(url).then(async r => r.json());
      state.neighborhoods = res.filter(neighborhood => neighborhood.name !== 'city');
    },

    /**
     * Updates the stored filter for roundtable neighborhood
     * @param neighborhood - neighborhood to store
     */
    async updateRoundTableFilter(state, neighborhood){
      state.neighborhoodRoundTableFilter = neighborhood;
    },

    updateNeighborhoodRoundtables(state, roundTables) {
      /**
       * Update the stored roundTables to the provided roundTables.
       * @param roundTables - roundTables to store
       */
      state.neighborhoodRoundTables = roundTables;
    },
    async refreshNeighborhoodRoundTables(state, neighborhood) {
      /**
       * Request the server for the currently available roundtables in the user's neighborhood.
       */
        const url = `/api/roundtables?neighborhood=${neighborhood}`;
        const res = await fetch(url).then(async r => r.json());
        console.log("res in store", res)
        state.neighborhoodRoundTables = res;
    },
    async refreshForumPosts(state, neighborhoodId) {
      /**
       * Request the server for the currently available freets.
       */

      if (neighborhoodId !== undefined){
        const url = `/api/forum?neighborhoodId=${neighborhoodId}`;
        const res = await fetch(url).then(async r => r.json());
        for (const comment of res){
          const url = `/api/likes/${comment._id}`;
          const response = await fetch(url).then(async r => r.json());
          comment.likes = response.map(liker => liker.author.email);
        }
        state.forumPosts = res;
      }
    },
    async refreshForumPostComments(state, parentId) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/comments/${parentId}`;
      const res = await fetch(url).then(async r => r.json());
      for (const comment of res){
        const url = `/api/likes/${comment._id}`;
        const response = await fetch(url).then(async r => r.json());
        comment.likes = response.map(liker => liker.author.email);
      }
      res.sort((commentOne, commentTwo) => {
        return commentTwo.likes.length - commentOne.likes.length;
      });
      state.forumPostComments = res;
    },
    async updatePetitions(state, petitions) {
      /**
       * Update the stored petitions to the provided petitions.
       * @param petitions - petitions to store
       */
      state.petitions = petitions;
    },
    async refreshPetitions(state, neighborhood) {
      /**
       * Request the server for the currently available freets.
       */
      const url = neighborhood ? `/api/petitions?neighborhood=${neighborhood}` : '/api/petitions';
      const res = await fetch(url).then(async r => r.json());
      state.petitions = res;
    },
    async refreshUser(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/users/session`;
      console.log("refreshing user");
      const r = await fetch(url);
      let res = await r.json();
      state.userObject = res.user;
      console.log("user obj", state.userObject)
    },


  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
