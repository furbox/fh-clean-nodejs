import { Router } from 'express';
import { AuthRoutes } from './auth/auth.routes';
import { CategoryRoutes } from './category/category.routes';
import { ProductRoutes } from './product/product.routes';

export class AppRoutes {
  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/v1/auth', AuthRoutes.routes );
    router.use('/api/v1/category', CategoryRoutes.routes );
    router.use('/api/v1/product', ProductRoutes.routes );

    return router;
  }

}