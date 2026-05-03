import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../app.js';

process.env.JWT_SECRET = 'TestSecretKey123';

describe('Product Routes — Tests Funcionales de Integración', () => {

    let userToken;
    let adminToken;
    let createdProductId;

    const uid = Date.now();

    const userPayload = { email: `user${uid}@test.com`, password: 'pass123', username: `user${uid}` };
    const adminPayload = { email: `admin${uid}@test.com`, password: 'pass123', username: `admin${uid}`, role: 'admin' };

    const productPayload = {
        name: `Laptop ${uid}`,
        description: 'Laptop de alta gama',
        price: 1299.99,
        category: 'Electronics',
        stock: 10,
    };

    before(async () => {
        // Registrar usuario normal y admin, obtener tokens
        await request(app).post('/api/users/register').send(userPayload);
        await request(app).post('/api/users/register').send(adminPayload);

        const userLogin = await request(app).post('/api/users/login')
            .send({ email: userPayload.email, password: userPayload.password });
        const adminLogin = await request(app).post('/api/users/login')
            .send({ email: adminPayload.email, password: adminPayload.password });

        userToken = userLogin.body.token;
        adminToken = adminLogin.body.token;
    });

    // ── GET /api/products ────────────────────────────────────────────────────

    describe('GET /api/products', () => {
        it('✅ retorna 200 y un Array (público, sin auth)', async () => {
            const res = await request(app).get('/api/products');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });

        it('✅ filtra por categoría con ?category=Electronics', async () => {
            await request(app).post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(productPayload);
            const res = await request(app).get('/api/products?category=Electronics');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.every(p => p.category === 'Electronics')).to.be.true;
        });
    });

    // ── POST /api/products ───────────────────────────────────────────────────

    describe('POST /api/products', () => {
        it('✅ crea un producto con token válido y retorna 201', async () => {
            const payload = { ...productPayload, name: `Monitor ${uid}` };
            const res = await request(app).post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(payload);
            expect(res.status).to.equal(201);
            expect(res.body).to.include.keys('id', 'name', 'price', 'category');
            createdProductId = res.body.id;
        });

        it('❌ retorna 401 sin token', async () => {
            const res = await request(app).post('/api/products').send(productPayload);
            expect(res.status).to.equal(401);
        });

        it('❌ retorna 400 si falta el nombre', async () => {
            const res = await request(app).post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 100, category: 'Test' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('errors');
        });

        it('❌ retorna 400 si el precio es negativo', async () => {
            const res = await request(app).post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Producto', price: -5, category: 'Test' });
            expect(res.status).to.equal(400);
        });

        it('❌ retorna 403 con token inválido', async () => {
            const res = await request(app).post('/api/products')
                .set('Authorization', 'Bearer token.invalido')
                .send(productPayload);
            expect(res.status).to.equal(403);
        });

        it('❌ caso de borde: nombre duplicado retorna 409', async () => {
            const res = await request(app).post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(productPayload);
            expect(res.status).to.equal(409);
        });
    });

    // ── GET /api/products/:id ────────────────────────────────────────────────

    describe('GET /api/products/:id', () => {
        it('✅ retorna 200 con el producto correcto', async () => {
            const res = await request(app).get(`/api/products/${createdProductId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('id', createdProductId);
        });

        it('❌ retorna 404 si el ID no existe', async () => {
            const res = await request(app).get('/api/products/id-inexistente');
            expect(res.status).to.equal(404);
        });
    });

    // ── PUT /api/products/:id ────────────────────────────────────────────────

    describe('PUT /api/products/:id', () => {
        it('✅ actualiza precio y stock, retorna 200', async () => {
            const res = await request(app).put(`/api/products/${createdProductId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 999.99, stock: 3 });
            expect(res.status).to.equal(200);
            expect(res.body.price).to.equal(999.99);
        });

        it('❌ retorna 401 sin token', async () => {
            const res = await request(app).put(`/api/products/${createdProductId}`)
                .send({ price: 500 });
            expect(res.status).to.equal(401);
        });

        it('❌ retorna 400 si el precio actualizado es negativo', async () => {
            const res = await request(app).put(`/api/products/${createdProductId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: -1 });
            expect(res.status).to.equal(400);
        });

        it('❌ retorna 404 si el ID no existe', async () => {
            const res = await request(app).put('/api/products/id-falso')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 100 });
            expect(res.status).to.equal(404);
        });
    });

    // ── DELETE /api/products/:id ─────────────────────────────────────────────

    describe('DELETE /api/products/:id', () => {
        it('❌ retorna 403 si el usuario no es admin', async () => {
            const res = await request(app).delete(`/api/products/${createdProductId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.status).to.equal(403);
        });

        it('✅ admin puede eliminar el producto, retorna 200', async () => {
            const res = await request(app).delete(`/api/products/${createdProductId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Product deleted successfully');
        });

        it('❌ retorna 404 luego de eliminado', async () => {
            const res = await request(app).get(`/api/products/${createdProductId}`);
            expect(res.status).to.equal(404);
        });

        it('❌ retorna 401 sin token', async () => {
            const res = await request(app).delete(`/api/products/${createdProductId}`);
            expect(res.status).to.equal(401);
        });
    });
});
