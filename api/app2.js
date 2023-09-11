const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:8080",
		optionsSuccessStatus: 200, 
	})
);
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

app.get('/menu/:id', async (req, res) => {
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
    let menus = await getMenusRecursive2(null, filter, 8);
    if (filter) {
      menus = await getMenusRecursive(filter);
    }
    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los menús' });
  }
});

async function getMenusRecursive(filter,menuIds = new Set()) {
  const menus = await prisma.menu.findMany({
    where: {
      name: {
        equals: filter,
      },
      status: 0,
    },
    orderBy: {
      parentId: 'asc',
    },
  });
    // Realizar una llamada recursiva para obtener menús hijos
    const childrenMenus = await Promise.all(
      menus.map(async (menu) => {
        if (!menuIds.has(menu.id)) {
          menuIds.add(menu.id);
          const childMenus = await getMenusRecursive2(menu.id, 8,menuIds);
           menu.children = childMenus;
            return menu;
        }
        return null;
      })
    );
    return menus;
}
async function getMenusRecursive2(parentId, maxDepth,  menuIds = new Set()) {
  if (maxDepth === 0) {
    return []; // Condición de parada: no se incluyen más niveles
  }
  const whereCondition = {
    parentId: parentId, // Filtrar por el ID del padre
    status: 0,
  };
  const menus = await prisma.menu.findMany({
    where: whereCondition,
    orderBy: {
      parentId: 'asc',
    },
  });
    // Realizar una llamada recursiva para obtener menús hijos
    const childrenMenus = await Promise.all(
      menus.map(async (menu) => {
        if (!menuIds.has(menu.id)) {
          menuIds.add(menu.id);
          const childMenus = await getMenusRecursive2(menu.id, maxDepth - 1,menuIds);
           menu.children = childMenus;
            return menu;
        }
        return null;
      })
    );
    return menus;
}
// Endpoints para la gestión de usuarios
app.post('/user/add', async (req, res) => {
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

app.get('/user/:id', async (req, res) => {
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
    const userMenus = await prisma.menusToUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        menu: {
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
        },
      },
    });

    // Extraer los menús del resultado
    const menus = userMenus.map(item => item.menu);

    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los menús del usuario' });
  }
});

app.get('/users/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany({where: {
      status: 0 // Filtrar por usuarios con status igual a cero
    }});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

app.post('/users/:id/menus', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { menus } = req.body;

  try {
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear los registros de MenusToUser para agregar menús al usuario
    const createdMenusToUser = await prisma.menusToUser.createMany({
      data: menus.map(menuId => ({
        userId: userId,
        menuId: menuId,
      })),
    });

    res.json(createdMenusToUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asignar menús al usuario' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
