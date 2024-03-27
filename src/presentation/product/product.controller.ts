import { Request, Response } from "express";
import { CustomError, PaginationDto, ProductCreateDto } from "../../domain";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statsCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }

    getAll = (req: Request, res: Response) => {
        const { page = 1, limit = 12 } = req.query;
        const [error, paginationDto] = PaginationDto.create(Number(page), Number(limit));
        if (error) return res.status(400).json({ error });

        this.productService.getAll(paginationDto!, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }

    getById = (req: Request, res: Response) => {
        const { id } = req.params;
        this.productService.getById(id, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }

    create = (req: Request, res: Response) => {
        const [error, productCreateDto] = ProductCreateDto.create({
            ...req.body,
            user: req.body.user.id
        });
        if (error) return res.status(400).json({ error });

        this.productService.create(productCreateDto!)
            .then((response) => res.status(201).json(response))
            .catch((error) => this.handleError(error, res));
    }

    update = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, productCreateDto] = ProductCreateDto.create({
            ...req.body,
            user: req.body.user.id
        });
        if (error) return res.status(400).json({ error });

        this.productService.update(id, productCreateDto!, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }

    delete = (req: Request, res: Response) => {
        const { id } = req.params;
        this.productService.delete(id, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }
}