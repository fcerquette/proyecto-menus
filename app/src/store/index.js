import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';


import login from './modules/login';
import menus from './modules/menus';
import users from './modules/users';

Vue.use(Vuex, axios);

export default new Vuex.Store({
	modules: {
		menus,
		login,
		users,
	},
});
