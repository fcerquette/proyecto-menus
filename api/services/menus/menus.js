const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Ruta para crear un nuevo menú
router.post('/add', async (req, res) => {
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

// Ruta para marcar un menú como eliminado (delete lógico)
router.delete('/delete/:id', async (req, res) => {
  const menuId = parseInt(req.params.id);

  try {
    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: { status: 1 }, // Marcamos el menú como eliminado
    });
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el menú' });
  }
});

// Ruta para actualizar un menú existente
router.put('/update/:id', async (req, res) => {
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

// Ruta para obtener un menú específico por su ID
router.get('/:id', async (req, res) => {
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

// Ruta para obtener todos los menús activos
router.get('/menu/all', async (req, res) => {
  try {
    const filter = req.query.filter || '';
    let menus = await getMenusRecursive(null, 8, new Set());
    if (filter) {
      menus = await getMenusRecursiveFilter(filter, new Set());
    }
    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los menús' });
  }
});

async function getMenusRecursiveFilter(filter, menuIds = new Set()) {
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
              const childMenus = await getMenusRecursive(menu.id, 8,menuIds);
               menu.children = childMenus;
                return menu;
            }
            return null;
          })
        );
        return menus;
}

async function getMenusRecursive(parentId, maxDepth, menuIds = new Set()) {
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
              const childMenus = await getMenusRecursive(menu.id, maxDepth - 1,menuIds);
               menu.children = childMenus;
                return menu;
            }
            return null;
          })
        );
        return menus;
}

module.exports = router;
