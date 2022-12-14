import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VModal from 'vue-js-modal'



import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHeart as faHeartSolid, faArrowLeft, faTrash, faX, faCircleInfo, faCaretDown, faCaretUp, faXmark, faFile, faCheck, faPencil, faArrowUp, faScroll, faFilePen, faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular, faCommentDots} from '@fortawesome/free-regular-svg-icons'

library.add(faHeartSolid)
library.add(faHeartRegular)
library.add(faArrowLeft);
library.add(faTrash);

library.add(faCommentDots)
library.add(faX)
library.add(faCircleInfo)
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faXmark);
library.add(faFile);
library.add(faCheck);
library.add(faPencil);
library.add(faArrowUp);
library.add(faScroll);
library.add(faFilePen);
library.add(faMinus);
library.add(faPlus);


Vue.config.productionTip = false;


Vue.use(VModal)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
