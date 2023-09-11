import axios from 'axios';
function defaultState() {
	return {
		users: [],
		total:0,
	};
}
const state = defaultState();
const getters = {};
const mutations = {
	setUsers(state, users) {
		state.users = users;
	},
	setTotal(state,total) {
		state.total = total;
	}
};
const actions = {
	async getAllUsers({ commit, dispatch },params) {
		await axios
			.get(`http://localhost:3000/users/user/all`, {params})
			.then(response => {
				console.log(response);
				commit('setUsers', response.data);
			})
			.catch(() => {
				this.$notify.error({
					title: 'Error',
					message: 'Error al consultar las ordenes',
					position: 'top-right',
				});
			});
	},
	async postUser({ commit, dispatch }, params) {
		console.log('params', params);
		try {
		  delete params.id;
		  delete params.status;
		  const response = await axios.post(`http://localhost:3000/users/add`, params);
		  if (response) {
			// this.getAllUsers(); 
			return true;
		  }
		} catch (error) {
			return false;
		}
		return false; // Retornar false en caso de error
	  },
	  async putUser({ commit, dispatch }, params) {
		console.log('params', params);
		try {
		  const response = await axios.put(`http://localhost:3000/users/update/${params.id}`, params);
		  if (response) {
			// this.getAllUsers(); 
			return true;
		  }
		} catch (error) {
			return false;
		}
		return false; // Retornar false en caso de error
	  },
	  async deleteUser({ commit, dispatch }, id) {
		try {
		  const response = await axios.delete(`http://localhost:3000/users/delete/${id}`);
		  if (response) {
			//this.getAllUsers(); 
			return true;
		  }
		} catch (error) {
		  return false; // Retornar false en caso de error
		}
	  }
};
export default {
	state,
	getters,
	actions,
	mutations,
};
