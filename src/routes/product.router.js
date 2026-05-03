import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = new Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos los productos (opcionalmente filtrado por categoría)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Array de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Product' }
 */
router.get('/', ProductController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', ProductController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto (requiere autenticación)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category]
 *             properties:
 *               name: { type: string, example: 'Laptop Pro' }
 *               description: { type: string, example: 'Laptop de alta gama' }
 *               price: { type: number, example: 1299.99 }
 *               category: { type: string, example: 'Electronics' }
 *               stock: { type: integer, example: 10 }
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token requerido
 */
router.post('/', authenticateToken, ProductController.validateCreate, ProductController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto (requiere autenticación)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', authenticateToken, ProductController.validateUpdate, ProductController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto (requiere rol admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       403:
 *         description: Se requiere rol admin
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', authenticateToken, requireAdmin, ProductController.remove);

export default router;
