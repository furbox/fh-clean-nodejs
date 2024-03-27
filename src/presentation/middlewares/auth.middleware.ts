import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    static async validateToken(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'Token not provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Token malformatted' });
        const [bearer, token] = authorization.split(' ');
        try {
            const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Token invalid' });

            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: 'User not found' });

            req.body.user = UserEntity.fromObject(user);

            return next();

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}