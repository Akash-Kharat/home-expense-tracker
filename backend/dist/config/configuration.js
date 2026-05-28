"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3001', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiration: process.env.JWT_EXPIRATION || '7d',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
});
//# sourceMappingURL=configuration.js.map