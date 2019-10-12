import {db} from '@/main';
import firebase from 'firebase';

export default {
    namespaced: true,

    state: {
        authId: null,
        unsubscribeAuthObserver: null
    },
    getters: {
        authUser(state, getters, rootState) {
            return state.authId ? rootState.users.items[state.authId] : null;
        }
    },
    actions: {
        registerUserWithEmailAndPassword({dispatch}, {email, name, password}) {
            return firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(
                    ref => {
                        console.log('User uid: ', ref.user.uid);
                        return dispatch(
                            'users/createUser',
                            {
                                id: ref.user.uid,
                                email,
                                name
                            },
                            {root: true}
                        );
                    },
                    {root: true}
                )
                .then(() => dispatch('fetchAuthUser'));
        },

        signInWithEmailAndPassword(context, {email, password}) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        },

        signInWithGoogle({dispatch}) {
            const provider = new firebase.auth.GoogleAuthProvider();
            return firebase
                .auth()
                .signInWithPopup(provider)
                .then(data => {
                    const user = data.user;
                    db.collection('users')
                        .doc(user.uid)
                        .get()
                        .then(docSnapshot => {
                            if (!docSnapshot.exists) {
                                return dispatch(
                                    'users/createUser',
                                    {
                                        id: user.uid,
                                        name: user.displayName,
                                        email: user.email,
                                        username: user.email,
                                        avatar: user.photoURL
                                    },
                                    {root: true}
                                ).then(() => dispatch('fetchAuthUser'));
                            }
                        });
                });
        },

        signOut({commit}) {
            return firebase
                .auth()
                .signOut()
                .then(() => {
                    commit('setAuthId', null);
                });
        },

        initAuthentification({dispatch, commit, state}) {
            return new Promise((resolve, reject) => {
                if (state.unsubscribeAuthObserver) {
                    state.unsubscribeAuthObserver();
                }

                const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                    console.log('👣 the user has changed');
                    if (user) {
                        dispatch('fetchAuthUser').then(dbUser =>
                            resolve(dbUser)
                        );
                    } else {
                        resolve(null);
                    }
                });

                commit('setUnsubscribeAuthObserver', unsubscribe);
            });
        },

        fetchAuthUser({dispatch, commit}) {
            const userId = firebase.auth().currentUser.uid;

            return new Promise((resolve, reject) => {
                db.collection('users')
                    .doc(userId)
                    .get()
                    .then(docSnapshot => {
                        if (docSnapshot.exists) {
                            return dispatch(
                                'users/fetchUser',
                                {id: userId},
                                {root: true}
                            ).then(user => {
                                commit('setAuthId', userId);
                                resolve(user);
                            });
                        } else {
                            resolve(null);
                        }
                    });
            });
        }
    },
    mutations: {
        setAuthId(state, id) {
            state.authId = id;
        },

        setUnsubscribeAuthObserver(state, unsubscribe) {
            state.unsubscribeAuthObserver = unsubscribe;
        }
    }
};