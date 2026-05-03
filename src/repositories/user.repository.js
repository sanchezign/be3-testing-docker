import { User } from '../models/user.model.js';
import { randomUUID } from 'crypto';

const users = [];

export class UserRepository {
    findAll() { return users; }
    findById(id) { return users.find(u => u.id === id) || null; }
    findByEmail(email) { return users.find(u => u.email === email) || null; }
    findByUsername(username) { return users.find(u => u.username === username) || null; }

    create({ email, password, username, role }) {
        const user = new User({ id: randomUUID(), email, password, username, role });
        users.push(user);
        return user;
    }
}
