<template>
  <el-row>
    <el-col :span="4">.</el-col>
    <el-col :span="16"
      ><div>
        <h1>Seleccionar el menu del usuario {{ user.username }}</h1>
        <div style="display: flex;">
          <el-input placeholder="Buscar" v-model="filterText"> </el-input>
          <el-button @click="getAllMenu()">Buscar</el-button>
        </div>
        <el-tree
          :data="menu"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
        </el-tree></div
    ></el-col>
    <el-col :span="4">.</el-col>
    <el-dialog
      :title="this.edit ? 'Editar menu' : 'Agregar Menu'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form" ref="menuForm">
        <p>Padre:{{ form.parentId }}</p>
        <el-form-item label="Nombre de menu">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelar()">Cancelar</el-button>
        <el-button v-if="!this.edit" type="primary" @click="callAddMenu()"
          >Aceptar</el-button
        >
        <el-button v-if="this.edit" type="primary" @click="callPutMenu()"
          >Editar</el-button
        >
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { TimeSelect } from "element-ui";

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      dialogFormVisible: false,
      form: {
        name: "",
        parentId: "",
        id: ""
      },
      edit: false,
      filterText: ""
    };
  },
  computed: {
    menu() {
      return this.$store.state.menus.menu;
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    cancelar() {
      this.dialogFormVisible = false;
      this.$refs["menuForm"].resetFields();
      this.edit = false;
    },
    addMenu(node, data) {
      this.form.name = "";
      this.form.id = "";
      this.form.parentId = data.id;
      this.dialogFormVisible = true;
    },
    callAddMenu() {
      this.$store.dispatch("postMenu", this.form).then(response => {
        if (response) {
          this.$refs["menuForm"].resetFields();
          this.form.name = "";
          this.dialogFormVisible = false;
          let params = { start: this.start, limit: this.limit };
          this.$store.dispatch("getAllMenu", params);
        } else {
          this.$notify.error({
            title: "Error",
            message: "Error en la creacion ",
            position: "top-right"
          });
          this.loading = false;
        }
      });
    },
    removeMenu(node, data) {
      this.$store.dispatch("deleteMenu", data.id).then(response => {
        console.log("esta es response de eliminar", response);
        if (!response) {
          this.$notify.error({
            title: "Error",
            message: "Error en la eliminación ",
            position: "top-right"
          });
        } else {
          this.getAllMenu();
        }
      });
    },
    editMenu(node, data) {
      this.edit = true;
      this.form.name = data.name;
      this.form.parentId = data.parentId;
      this.form.id = data.id;
      this.dialogFormVisible = true;
    },
    getAllMenu() {
      let params = { filter: this.filterText };
      this.$store.dispatch("getAllMenu", params);
    },
    callPutMenu() {
      // this.form.id = id;
      this.$store.dispatch("putMenu", this.form).then(response => {
        if (response) {
          this.$refs["menuForm"].resetFields();
          this.form.name = "";
          this.dialogFormVisible = false;
          let params = { start: this.start, limit: this.limit };
          //this.$store.dispatch("getAllMenu", params);
          this.getAllMenu();
        } else {
          this.$notify.error({
            title: "Error",
            message: "Error en la creacion ",
            position: "top-right"
          });
          this.loading = false;
        }
      });
    },
    createRoot() {
      this.form.name = "";
      this.form.id = "";
      this.form.parentId = null;
      this.dialogFormVisible = true;
    },
    goUsers() {
      this.$router.push("/users");
    },
    goMenus() {
      this.$router.push("/menus");
    },
    goHome() {
      this.$router.push(`/home`);
    }
  },
  mounted() {
    //let params = { start: this.start, limit: this.limit };
    //this.$store.dispatch("getAllMenu", params);
    this.getAllMenu();
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
