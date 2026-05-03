import { body, validationResult } from 'express-validator';
import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {

    static validateCreate = [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('category').notEmpty().withMessage('Category is required'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ];

    static validateUpdate = [
        body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ];

    static getAll(req, res) {
        const { category } = req.query;
        const products = category
            ? productService.getByCategory(category)
            : productService.getAll();
        res.status(200).json(products);
    }

    static getById(req, res) {
        try {
            const product = productService.getById(req.params.id);
            res.status(200).json(product);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    static create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const product = productService.create(req.body);
            res.status(201).json(product);
        } catch (err) {
            res.status(409).json({ error: err.message });
        }
    }

    static update(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const product = productService.update(req.params.id, req.body);
            res.status(200).json(product);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    static remove(req, res) {
        try {
            const result = productService.remove(req.params.id);
            res.status(200).json(result);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
}
