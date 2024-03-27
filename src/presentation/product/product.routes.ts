import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ProductRoutes {

  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();
    const controller = new ProductController(productService);

    //crud products
    router.get('/', [AuthMiddleware.validateToken], controller.getAll);
    router.get('/:id', [AuthMiddleware.validateToken], controller.getById);
    router.post('/', [AuthMiddleware.validateToken], controller.create);
    router.put('/:id', [AuthMiddleware.validateToken], controller.update);
    router.delete('/:id', [AuthMiddleware.validateToken], controller.delete);

    return router;
  }


}