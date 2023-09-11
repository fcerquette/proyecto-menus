<template>
  <el-row>
    <el-col :span="8">.</el-col>
    <el-col :span="8"
      ><div>
        <el-button @click="goMenus()">Gestion de Menus</el-button>
        <el-button @click="goUsers()">Gestion de Usuarios</el-button>
        <h1>Tu menu de opciones</h1>
        <el-tree
          :data="menu"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree></div
    ></el-col>
    <el-col :span="8">.</el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      }
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
    goUsers() {
      this.$router.push("/users");
    },
    goMenus() {
      this.$router.push("/menus");
    }
  },
  mounted() {
    let params = { start: this.start, limit: this.limit };
    this.$store.dispatch("getAllMenu", params);
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
