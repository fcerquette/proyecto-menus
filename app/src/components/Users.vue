<template>
  <el-row>
    <el-col :span="4">.</el-col>
    <el-col :span="16"
      ><div>
        <el-button @click="goHome()">Volver a Home</el-button>
        <h1>Gestion de Usuarios</h1>

        <el-button @click="createUser()">Crear Usuario</el-button>
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="name" label="Nombre" width="120">
          </el-table-column>
          <el-table-column prop="lastname" label="Apellido" width="120">
          </el-table-column>
          <el-table-column prop="username" label="Usuario" width="300">
          </el-table-column>
          <el-table-column prop="email" label="email"> </el-table-column>
          <el-table-column fixed="right" label="Operations" width="200">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                >Menus</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="editUser(scope.row.id)"
                >Editar</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteUser(scope.row.id)"
                >Eliminar</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="4">.</el-col>
    <el-dialog
      title="Menu por usuario"
      :visible.sync="dialogFormVisible"
      :show-close="true"
      :close-on-press-escape="false"
      ><UsersMenu v-if="dialogFormVisible" :user="userSelected"></UsersMenu
    ></el-dialog>
  </el-row>
</template>

<script>
import UsersMenu from "@/components/UsersMenu";
export default {
  components: {
    UsersMenu
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      dialogFormVisible: false,
      userSelected: {}
    };
  },
  computed: {
    users() {
      return this.$store.state.users.users;
    }
  },
  methods: {
    handleClick(node) {
      this.dialogFormVisible = true;
      this.userSelected = node;
      console.log("click");
    },
    createUser() {
      this.$router.push("/users/create");
    },
    editUser(id) {
      this.$router.push(`/users/edit/${id}`);
    },
    deleteUser(id) {
      this.$store.dispatch("deleteUser", id).then(response => {
        if (!response) {
          this.$notify.error({
            title: "Error",
            message: "Error en la eliminación ",
            position: "top-right"
          });
        } else {
          let params = { start: this.start, limit: this.limit };
          this.$store.dispatch("getAllUsers", params);
        }
      });
    },
    goHome(id) {
      this.$router.push(`/home`);
    }
  },
  mounted() {
    let params = { start: this.start, limit: this.limit };
    this.$store.dispatch("getAllUsers", params);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
