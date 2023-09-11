const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/add', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Ruta para marcar un usuario como eliminado (delete lógico)
router.delete('/delete/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 1 }, // Marcamos al usuario como eliminado
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Ruta para actualizar un usuario existente
router.put('/update/:id', async (req, res) => {
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

// Ruta para obtener un usuario específico por su ID
router.get('/:id', async (req, res) => {
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

// Ruta para obtener todos los usuarios activos
router.get('/user/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: 0, // Filtrar por usuarios con status igual a cero
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Ruta para asignar menús a un usuario
router.post('/:id/menus', async (req, res) => {
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
      data: menus.map((menuId) => ({
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

module.exports = router;