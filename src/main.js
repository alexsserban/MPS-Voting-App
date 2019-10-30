import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store';

import firebase from 'firebase/app';
import '@firebase/firestore';

import vuelidate from 'vuelidate';
Vue.use(vuelidate);

Vue.config.productionTip = false;

const firebaseConfig = {};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const firestore = firebase.firestore;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
