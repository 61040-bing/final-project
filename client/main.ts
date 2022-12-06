import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VModal from 'vue-js-modal'



import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular, faCommentDots} from '@fortawesome/free-regular-svg-icons'

library.add(faHeartSolid)
library.add(faHeartRegular)

library.add(faCommentDots)

Vue.config.productionTip = false;


Vue.use(VModal)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
