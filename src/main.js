import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store';

import firebase from 'firebase/app';
import '@firebase/firestore';

import vuelidate from 'vuelidate';
Vue.use(vuelidate);

Vue.config.productionTip = false;

const firebaseConfig = {
    apiKey: 'AIzaSyDAmj34_zsCRxdT1wlY133KH4cxvQbWc50',
    authDomain: 'mps-rap-battles-app.firebaseapp.com',
    databaseURL: 'https://mps-rap-battles-app.firebaseio.com',
    projectId: 'mps-rap-battles-app',
    storageBucket: 'mps-rap-battles-app.appspot.com',
    messagingSenderId: '888577573869',
    appId: '1:888577573869:web:7cfd4c4971d918fe169de4',
    measurementId: 'G-8ZCKSBLPHR'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const firestore = firebase.firestore;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
