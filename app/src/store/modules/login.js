import axios from 'axios';
function defaultState() {
	return {
		items: [],
	};
}
const state = defaultState();
const getters = {};
const mutations = {
	setItems(state, items) {
		state.items = items;
	},
};
const actions = {
	async authenticate_local({ commit, dispatch },form) {
		if(form.user === 'admin' && form.pass === 'admin') return true;
		return false;		
	}
};
export default {
	state,
	getters,
	actions,
	mutations,
};
