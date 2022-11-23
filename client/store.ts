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
    alerts: {} 
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
    setUsername(state, email) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.userEmail = email;
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
      state.neighborhoods = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
