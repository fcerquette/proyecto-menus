<template>
  <el-row>
    <el-col :span="8">.</el-col>
    <el-col :span="8"
      ><div>
        <h1>BIENVENIDO</h1>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
        >
          <el-form-item label="Usuario" prop="user">
            <el-input v-model.number="ruleForm.user"></el-input>
          </el-form-item>

          <el-form-item label="Clave" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >Ingresar</el-button
            >
            <el-button @click="resetForm('ruleForm')">Limpiar</el-button>
          </el-form-item>
        </el-form>
      </div></el-col
    >
    <el-col :span="8">.</el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        pass: "",
        user: ""
      },
      rules: {
        pass: [
          {
            required: true,
            message: "La clave es obligatoria.",
            trigger: "blur"
          }
        ],
        user: [
          {
            required: true,
            message: "El usuario es obligatorio.",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("authenticate_local", this.ruleForm)
            .then(response => {
              if (response) {
                this.$refs["ruleForm"].resetFields();
                this.$router.push("/home");
                this.loading = false;
              } else {
                this.$notify.error({
                  title: "Error",
                  message: "Error en la autenticación ",
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
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
