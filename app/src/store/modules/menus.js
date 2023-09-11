import axios from 'axios';
function defaultState() {
	return {
		menu: [],
		total:0,
	};
}
const state = defaultState();
const getters = {};
const mutations = {
	setMenu(state, menu) {
		state.menu = menu;
	},
	setTotal(state,total) {
		state.total = total;
	}
};
const actions = {
	async getAllMenu({ commit, dispatch },params) {
		await axios
			.get(`http://localhost:3000/menus/menu/all`, {params})
			.then(response => {
				commit('setMenu', response.data);
			})
			.catch(() => {
				this.$notify.error({
					title: 'Error',
					message: 'Error al consultar las ordenes',
					position: 'top-right',
				});
			});
	},
	async postMenu({ commit, dispatch }, params) {
		console.log('params', params);
		try {
		  delete params.id;
		  const response = await axios.post(`http://localhost:3000/menus/add`, params);
		  if (response) {
			// this.getAllUsers(); 
			return true;
		  }
		} catch (error) {
			return false;
		}
		return false; // Retornar false en caso de error
	  },
	  async putMenu({ commit, dispatch }, params) {
		console.log('params', params);
		try {
		  const response = await axios.put(`http://localhost:3000/menus/update/${params.id}`, params);
		  if (response) {
			// this.getAllUsers(); 
			return true;
		  }
		} catch (error) {
			return false;
		}
		return false; // Retornar false en caso de error
	  },
	async deleteMenu({ commit, dispatch }, id) {
		try {
		  const response = await axios.delete(`http://localhost:3000/menus/delete/${id}`);
		  console.log('ESTA', response);
		  if (response) {
			return true;
		  }
		} catch (error) {
		  return false; // Retornar false en caso de error
		}
	  },
	async loadOrdenes({ commit, dispatch }, params) {
		await axios
			.get(`http://localhost:3000/orders`,{params})
			.then(response => {
				console.log('esta es response', response.data);
				commit('setOrders', response.data.orders);
				commit('setTotal', parseInt(response.data.total));
			})
			.catch(() => {
				this.$notify.error({
					title: 'Error',
					message: 'Error al consultar las ordenes',
					position: 'top-right',
				});
			});
	},
};
export default {
	state,
	getters,
	actions,
	mutations,
};
