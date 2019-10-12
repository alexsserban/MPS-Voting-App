import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import users from './modules/users';
import contests from './modules/contests';
import {db} from '@/main';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},

    getters: {},

    actions: {
        // functie generica pentru extragerea unei resurse din db
        // ex: resource -> users si id-ul unui user
        fetchItem({state, commit}, {id, resource}) {
            console.log(`Fetching ${resource}: ${id}`);

            return new Promise((resolve, reject) => {
                db.collection(resource)
                    .doc(id)
                    .get()
                    .then(doc => {
                        if (doc.exists) {
                            console.log('The document is loaded!');
                            commit('setItem', {resource, id, item: doc.data()});
                            resolve(state[resource].items[id]);
                        } else {
                            // doc.data() will be undefined in this case
                            console.log('No such document!');
                        }
                    })
                    .catch(function(error) {
                        console.log('Error getting document:', error);
                    });
            });
        },

        fetchItems({dispatch}, {ids, resource}) {
            if (ids) {
                ids = Object.keys(ids);
                return Promise.all(
                    ids.map(id => dispatch('fetchItem', {id, resource}))
                );
            }
            return;
        }
    },

    // functie generica pentru a face update local in Store
    // ex: atunci cand sunt extrase toate contesturile din db, pentru fiecare este apelata functia asta cu
    // item -> obiectul contest
    // id -> id-ul obiectului
    // resource -> 'contests'
    mutations: {
        setItem(state, {item, id, resource}) {
            Vue.set(state[resource].items, id, item);
        }
    },

    modules: {
        auth,
        users,
        contests
    }
});
