import { body, validationResult } from 'express-validator';
import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {

    static validateRegister = [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('username').notEmpty().withMessage('Username is required'),
    ];

    static getAll(req, res) {
        res.status(200).json(userService.getAll());
    }

    static register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const user = userService.register(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(409).json({ error: err.message });
        }
    }

    static login(req, res) {
        try {
            const { token, user } = userService.login(req.body);
            res.status(200).json({ token, user });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }

    static profile(req, res) {
        res.status(200).json({ message: `Bienvenido ${req.user.username}`, user: req.user });
    }
}
