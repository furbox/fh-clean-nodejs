import { Router } from 'express';
import { CategoryController } from './category.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';

export class CategoryRoutes {

  static get routes(): Router {

    // Definir las rutas
    const router = Router();

    const categoryService = new CategoryService();

    const controller = new CategoryController(categoryService);

    router.get('/', [AuthMiddleware.validateToken], controller.getAll);
    router.get('/:id', [AuthMiddleware.validateToken], controller.getById);
    router.post('/', [AuthMiddleware.validateToken], controller.create);
    router.put('/:id', [AuthMiddleware.validateToken], controller.update);
    router.delete('/:id', [AuthMiddleware.validateToken], controller.delete);

    return router;
  }
}