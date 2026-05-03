export class User {
    constructor({ id, email, password, username, role }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.role = role || 'user'; // 'user' | 'admin'
    }
}
