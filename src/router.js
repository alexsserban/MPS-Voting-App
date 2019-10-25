import Vue from 'vue';
import store from '@/store';

import Router from 'vue-router';
import Home from './views/PageHome.vue';
import Register from './views/PageRegister';
import SignIn from './views/PageSignIn';
import Contest from './views/PageContest';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },

        {
            path: '/contest/:id',
            name: 'Contest',
            component: Contest,
            meta: {requiresAuth: true},
            props: true
        },

        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {requiresGuest: true}
        },

        {
            path: '/signIn',
            name: 'SignIn',
            component: SignIn,
            meta: {requiresGuest: true}
        },

        {
            path: '/logout',
            name: 'SignOut',
            meta: {requiresAuth: true},
            beforeEnter(to, from, next) {
                store
                    .dispatch('auth/signOut')
                    .then(() => next({name: 'SignIn'}));
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    console.log(`🚦 navigating to ${to.name} from ${from.name}`);

    store.dispatch('auth/initAuthentification').then(user => {
        if (to.matched.some(route => route.meta.requiresAuth)) {
            if (user) {
                next();
            } else {
                next({name: 'SignIn', query: {redirectTo: to.path}});
            }
        } else if (to.matched.some(route => route.meta.requiresGuest)) {
            if (!user) {
                next();
            } else {
                next({name: 'Home'});
            }
        } else {
            next();
        }
    });
});

export default router;
