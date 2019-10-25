import {db} from '@/main';
import Vue from 'vue';

export default {
    namespaced: true,

    state: {
        items: {}
    },

    actions: {
        createUser(
            {state, commit},
            {id, email, name, username, role, avatar = null}
        ) {
            return new Promise((resolve, reject) => {
                email = email.toLowerCase();
                const user = {
                    email,
                    name,
                    role
                };
                console.log(user);

                console.log('New User id: ', id);

                db.collection('users')
                    .doc(id)
                    .set(user)
                    .then(() => {
                        commit(
                            'setItem',
                            {
                                resource: 'users',
                                item: user,
                                id
                            },
                            {root: true}
                        );
                        resolve(state.items[id]);
                    });
            });
        },

        fetchUser: ({dispatch}, {id}) =>
            dispatch('fetchItem', {id, resource: 'users'}, {root: true})
    },

    mutations: {
        setUser(state, {user, userId}) {
            Vue.set(state.items, userId, user);
        }
    }
};
