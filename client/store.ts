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
    async refreshNeighborhoodRoundTables(state) {
      /**
       * Request the server for the currently available roundtables in the user's neighborhood.
       */
      if (state.userNeighborhood !== null){
        const url = `/api/roundtables?neighborhood=${state.userNeighborhood}`;
        const res = await fetch(url).then(async r => r.json());
        state.neighborhoodRoundTables = res;
      }
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
      const url = neighborhood ? `/api/petitions?neighborhood=${this.$route.params.id}` : '/api/petitions';
      const res = await fetch(url).then(async r => r.json());
      state.petitions = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
