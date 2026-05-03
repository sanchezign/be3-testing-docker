import { expect } from 'chai';
import { ProductService } from '../services/product.service.js';

describe('ProductService — Tests Unitarios', () => {
    let service;
    let createdId;

    before(() => {
        service = new ProductService();
        const p = service.create({
            name: 'Laptop Pro',
            description: 'Laptop de alta gama',
            price: 1299.99,
            category: 'Electronics',
            stock: 10,
        });
        createdId = p.id;
    });

    // ── getAll ──────────────────────────────────────────────────────────────

    describe('getAll()', () => {
        it('✅ retorna un Array con al menos un producto', () => {
            const products = service.getAll();
            expect(products).to.be.an('array');
            expect(products.length).to.be.greaterThan(0);
        });
    });

    // ── getById ─────────────────────────────────────────────────────────────

    describe('getById()', () => {
        it('✅ retorna el producto correcto por ID', () => {
            const product = service.getById(createdId);
            expect(product).to.have.property('id', createdId);
            expect(product).to.have.property('name', 'Laptop Pro');
        });

        it('❌ lanza error si el ID no existe', () => {
            expect(() => service.getById('id-inexistente')).to.throw('Product not found');
        });
    });

    // ── getByCategory ────────────────────────────────────────────────────────

    describe('getByCategory()', () => {
        it('✅ retorna productos de la categoría correcta', () => {
            const results = service.getByCategory('Electronics');
            expect(results).to.be.an('array');
            expect(results.every(p => p.category === 'Electronics')).to.be.true;
        });

        it('❌ retorna array vacío si la categoría no existe', () => {
            const results = service.getByCategory('NoExiste');
            expect(results).to.be.an('array').that.is.empty;
        });
    });

    // ── create ───────────────────────────────────────────────────────────────

    describe('create()', () => {
        it('✅ crea un producto y retorna id, name, price, category', () => {
            const p = service.create({
                name: 'Mouse Gamer',
                price: 59.99,
                category: 'Electronics',
                stock: 25,
            });
            expect(p).to.include.keys('id', 'name', 'price', 'category', 'stock');
            expect(p.name).to.equal('Mouse Gamer');
        });

        it('❌ lanza error si el nombre ya existe', () => {
            expect(() => service.create({
                name: 'Laptop Pro',
                price: 999,
                category: 'Electronics',
            })).to.throw('A product with that name already exists');
        });

        it('❌ lanza error si el precio es 0 o negativo', () => {
            expect(() => service.create({
                name: 'Producto Gratis',
                price: 0,
                category: 'Other',
            })).to.throw('Price must be greater than 0');
        });

        it('❌ caso de borde: stock por defecto es 0 si no se indica', () => {
            const p = service.create({
                name: 'Teclado Básico',
                price: 29.99,
                category: 'Electronics',
            });
            expect(p.stock).to.equal(0);
        });
    });

    // ── update ───────────────────────────────────────────────────────────────

    describe('update()', () => {
        it('✅ actualiza campos del producto correctamente', () => {
            const updated = service.update(createdId, { price: 1099.99, stock: 5 });
            expect(updated.price).to.equal(1099.99);
            expect(updated.stock).to.equal(5);
        });

        it('❌ lanza error si el ID no existe', () => {
            expect(() => service.update('id-falso', { price: 100 })).to.throw('Product not found');
        });

        it('❌ lanza error si el precio actualizado es negativo', () => {
            expect(() => service.update(createdId, { price: -10 })).to.throw('Price must be greater than 0');
        });
    });

    // ── remove ───────────────────────────────────────────────────────────────

    describe('remove()', () => {
        it('✅ elimina el producto y retorna mensaje de éxito', () => {
            const toDelete = service.create({ name: 'Para Borrar', price: 1, category: 'Test' });
            const result = service.remove(toDelete.id);
            expect(result).to.have.property('message', 'Product deleted successfully');
        });

        it('❌ lanza error si el ID no existe', () => {
            expect(() => service.remove('id-falso')).to.throw('Product not found');
        });
    });
});
