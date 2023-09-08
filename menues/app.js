const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Endpoints para la gestión de menús
app.post('/menus/add', async (req, res) => {
  try {
    const menu = await prisma.menu.create({
      data: req.body, // Debes enviar los datos del menú en el cuerpo de la solicitud POST
    });
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el menú' });
  }
});

app.delete('/menus/delete/:id', async (req, res) => {
  const menuId = parseInt(req.params.id);

  try {
    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: { status: 1 }, // Marcamos el menú como eliminado (delete lógico)
    });
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el menú' });
  }
});

app.put('/menus/update/:id', async (req, res) => {
  const menuId = parseInt(req.params.id);

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: req.body, // Debes enviar los datos actualizados en el cuerpo de la solicitud PUT
    });
    res.json(updatedMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el menú' });
  }
});

app.get('/menus/:id', async (req, res) => {
  const menuId = parseInt(req.params.id);

  try {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
});

app.get('/menus/all', async (req, res) => {
  try {
    const filter = req.query.filter || '';
    const menus = await prisma.menu.findMany({
      where: {
        name: {
          contains: filter,
        },
      },
      orderBy: {
        parentId: 'asc',
      },
      include: {
        children: {
          orderBy: {
            parentId: 'asc',
          },
        },
      },
    });
    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los menús' });
  }
});

// Endpoints para la gestión de usuarios
app.post('/users/add', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body, // Debes enviar los datos del usuario en el cuerpo de la solicitud POST
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

app.delete('/users/delete/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 1 }, // Marcamos al usuario como eliminado (delete lógico)
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

app.put('/users/update/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: req.body, // Debes enviar los datos actualizados en el cuerpo de la solicitud PUT
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

app.get('/users/:id/menus', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const filter = req.query.filter || '';
    const userMenus = await prisma.user.findUnique({
      where: { id: userId },
    }).menus({
      where: {
        name: {
          contains: filter,
        },
      },
      orderBy: {
        parentId: 'asc',
      },
      include: {
        children: {
          orderBy: {
            parentId: 'asc',
          },
        },
      },
    });
    res.json(userMenus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los menús del usuario' });
  }
});

app.get('/users/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

app.post('/users/:id/menus', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { userId: targetUserId, menus } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        menus: {
          connect: menus.map(menuId => ({ id: menuId })),
        },
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asignar menús al usuario' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
