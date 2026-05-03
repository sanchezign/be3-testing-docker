import { ProductRepository } from '../repositories/product.repository.js';

const productRepo = new ProductRepository();

export class ProductService {

    getAll() {
        return productRepo.findAll();
    }

    getById(id) {
        const product = productRepo.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    getByCategory(category) {
        return productRepo.findByCategory(category);
    }

    create({ name, description, price, category, stock }) {
        if (productRepo.findByName(name)) {
            throw new Error('A product with that name already exists');
        }
        if (price <= 0) throw new Error('Price must be greater than 0');
        return productRepo.create({ name, description, price, category, stock });
    }

    update(id, fields) {
        productRepo.findById(id); // throws if not found
        const existing = productRepo.findById(id);
        if (!existing) throw new Error('Product not found');
        if (fields.price !== undefined && fields.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
        return productRepo.update(id, fields);
    }

    remove(id) {
        const existing = productRepo.findById(id);
        if (!existing) throw new Error('Product not found');
        productRepo.remove(id);
        return { message: 'Product deleted successfully' };
    }
}
