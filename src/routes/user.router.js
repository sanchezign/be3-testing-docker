import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = new Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos los usuarios (sin password)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Array de usuarios
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, username]
 *             properties:
 *               email: { type: string, example: 'ana@example.com' }
 *               password: { type: string, example: 'miPassword123' }
 *               username: { type: string, example: 'ana' }
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Email o username ya en uso
 */
router.post('/register', UserController.validateRegister, UserController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login — obtiene JWT
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: 'ana@example.com' }
 *               password: { type: string, example: 'miPassword123' }
 *     responses:
 *       200:
 *         description: Token JWT y datos del usuario
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *       401:
 *         description: Token requerido
 */
router.get('/profile', authenticateToken, UserController.profile);

export default router;
