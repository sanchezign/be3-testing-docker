import { Product } from '../models/product.model.js';
import { randomUUID } from 'crypto';

const products = [];

export class ProductRepository {
    findAll() {
        return products;
    }

    findById(id) {
        return products.find(p => p.id === id) || null;
    }

    findByCategory(category) {
        return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    findByName(name) {
        return products.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
    }

    create({ name, description, price, category, stock }) {
        const product = new Product({
            id: randomUUID(),
            name,
            description,
            price,
            category,
            stock: stock ?? 0,
        });
        products.push(product);
        return product;
    }

    update(id, fields) {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...fields };
        return products[index];
    }

    remove(id) {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return false;
        products.splice(index, 1);
        return true;
    }
}
