import express from 'express';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import logger from '../config/logger.js';
import productRoutes from '../routes/product.router.js';
import userRoutes from '../routes/user.router.js';

dotenv.config();

export const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Tienda — be3-testing-docker',
            version: '1.0.0',
            description: 'API REST de Productos con autenticación JWT. Backend III — CoderHouse.',
        },
        servers: [
            { url: 'http://localhost:8000', description: 'Desarrollo' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-1234' },
                        name: { type: 'string', example: 'Laptop Pro' },
                        description: { type: 'string', example: 'Laptop de alta gama' },
                        price: { type: 'number', example: 1299.99 },
                        category: { type: 'string', example: 'Electronics' },
                        stock: { type: 'integer', example: 10 },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-5678' },
                        username: { type: 'string', example: 'ana' },
                        email: { type: 'string', example: 'ana@example.com' },
                        role: { type: 'string', example: 'user' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: { error: { type: 'string', example: 'Error description' } },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
}));

app.use(express.json());

app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API Tienda — be3-testing-docker',
        docs: '/api-docs',
        endpoints: {
            products: '/api/products',
            users: '/api/users',
        },
    });
});

const PORT = Number(process.env.PORT) || 8000;

export function startServer() {
    app.listen(PORT, () => logger.info(`Servidor en http://localhost:${PORT}`));
}
