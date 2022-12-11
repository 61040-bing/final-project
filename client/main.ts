import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VModal from 'vue-js-modal'



import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
<<<<<<< HEAD
import { faHeart as faHeartSolid, faArrowLeft, faX, faInfo} from '@fortawesome/free-solid-svg-icons'
=======
import { faHeart as faHeartSolid, faArrowLeft, faTrash} from '@fortawesome/free-solid-svg-icons'
>>>>>>> 406d8fd7c44e8039769ede41199a563f45424dbd
import { faHeart as faHeartRegular, faCommentDots} from '@fortawesome/free-regular-svg-icons'

library.add(faHeartSolid)
library.add(faHeartRegular)
library.add(faArrowLeft);
library.add(faTrash);

library.add(faCommentDots)
library.add(faX)
library.add(faInfo)


Vue.config.productionTip = false;


Vue.use(VModal)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
