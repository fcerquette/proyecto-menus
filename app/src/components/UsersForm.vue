<template>
  <el-row>
    <el-col :span="4">.</el-col>
    <el-col :span="16"
      ><div>
        <h1>
          {{
            $route.name === "Edit" ? "EDITAR USUARIO" : "CERACION DE USUARIO"
          }}
        </h1>
        <el-button style="margin:20px" @click="goUser()">Volver</el-button>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="userForm"
          label-width="120px"
        >
          <el-form-item label="Nombre" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Apellido" prop="lastname">
            <el-input v-model="ruleForm.lastname"></el-input>
          </el-form-item>
          <el-form-item label="Usuario" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="Clave" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="$route.name !== 'Edit'"
              type="primary"
              @click="submitForm('userForm')"
              >Crear</el-button
            >

            <el-button v-else type="primary" @click="submitFormEdit('userForm')"
              >Editar</el-button
            >
            <el-button @click="resetForm('userForm')">Limpiar</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4">.</el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        id: "",
        name: "",
        lastname: "",
        email: "",
        password: "",
        username: "",
        status: ""
      },
      rules: {
        password: [
          {
            required: true,
            message: "La clave es obligatoria.",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "El usuario es obligatorio.",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "El nombre es obligatorio.",
            trigger: "blur"
          }
        ],
        lastname: [
          {
            required: true,
            message: "El apellido es obligatorio.",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Ingrese un mail válido.",
            trigger: "blur",
            type: "email"
          }
        ]
      }
    };
  },
  computed: {
    users() {
      return this.$store.state.users.users;
    }
  },
  methods: {
    handleClick() {
      console.log("click");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch("postUser", this.ruleForm).then(response => {
            if (response) {
              this.$refs["userForm"].resetFields();
              this.$router.push("/users");
            } else {
              this.$notify.error({
                title: "Error",
                message: "Error en la creacion ",
                position: "top-right"
              });
              this.loading = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitFormEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch("putUser", this.ruleForm).then(response => {
            if (response) {
              this.$refs["userForm"].resetFields();
              this.$router.push("/users");
            } else {
              this.$notify.error({
                title: "Error",
                message: "Error en la creacion ",
                position: "top-right"
              });
              this.loading = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goUser() {
      this.$router.push("/users");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    let params = { start: this.start, limit: this.limit };
    this.$store.dispatch("getAllUsers", params).then(() => {
      if (this.$route.name == "Edit") {
        this.ruleForm = this.users.filter(
          user => user.id == this.$route.params.id
        )[0];
      }
    });
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
