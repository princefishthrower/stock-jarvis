const jwt = require('jsonwebtoken');

export function sign(userId: number): string {
    return jwt.sign({ userId: userId }, process.env.STOCK_JARVIS_JWT_SECRET);
}

// Returns user id if decoded successfully. Throws error otherwise
export function decode(token: string): number {
    const decoded = jwt.verify(token, process.env.STOCK_JARVIS_JWT_SECRET);
    return decoded.userId
}