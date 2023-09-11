const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200,
  })
);

// Importar rutas de usuarios y menús
const usuariosRouter = require('./services/users/users');
const menusRouter = require('./services/menus/menus');

// Montar rutas de usuarios y menús
app.use('/users', usuariosRouter);
app.use('/menus', menusRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
