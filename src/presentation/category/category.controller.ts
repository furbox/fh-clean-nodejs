import { Request, Response } from "express";
import { CategoryCreateDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController{
    constructor(
        private readonly categoryService: CategoryService
    ){}

    private handleError = ( error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statsCode).json({error: error.message});
        }
        return res.status(500).json({error: 'Internal server error'});
    }

    getAll = (req: Request, res: Response) => {
        const { page = 1, limit = 12 } = req.query;
        const [error, paginationDto] = PaginationDto.create(Number(page), Number(limit));
        if(error) return res.status(400).json({error});
        
        this.categoryService.getAll(paginationDto!, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }

    getById = (req: Request, res: Response) => {
        const { id } = req.params;
        this.categoryService.getById(id, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }

    create = (req: Request, res: Response) => {
        const [error, categoryCreateDto] = CategoryCreateDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.categoryService.create(categoryCreateDto!, req.body.user)
            .then((response) => res.status(201).json(response))
            .catch((error) => this.handleError(error, res));
    }

    update = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, categoryCreateDto] = CategoryCreateDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.categoryService.update(id, categoryCreateDto!, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }

    delete = (req: Request, res: Response) => {
        const { id } = req.params;
        this.categoryService.delete(id, req.body.user)
            .then((response) => res.status(200).json(response))
            .catch((error) => this.handleError(error, res));
    }
}