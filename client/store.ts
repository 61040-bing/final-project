import { STATES } from 'mongoose';
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
      state.neighborhoods = res;
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
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
