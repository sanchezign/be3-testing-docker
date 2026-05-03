import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const userRepo = new UserRepository();

export class UserService {

    getAll() {
        return userRepo.findAll().map(({ password, ...rest }) => rest);
    }

    register({ email, password, username, role }) {
        if (userRepo.findByEmail(email)) throw new Error('Email is already in use');
        if (userRepo.findByUsername(username)) throw new Error('Username is already in use');
        const hashed = bcrypt.hashSync(password, SALT_ROUNDS);
        const user = userRepo.create({ email, password: hashed, username, role: role || 'user' });
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    login({ email, password }) {
        const user = userRepo.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid credentials');
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
    }
}
