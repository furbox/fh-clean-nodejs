import { CategoryModel } from "../../data";
import { CategoryCreateDto, CustomError, PaginationDto, UserEntity } from "../../domain";


export class CategoryService {
    constructor(
    ) { }

    async getAll(paginationDto: PaginationDto, user: UserEntity) {
        const { page, limit } = paginationDto;


        const [categories, total] = await Promise.all([
            CategoryModel.find({ user: user.id })
                .skip((page - 1) * limit)
                .limit(limit),
            CategoryModel.countDocuments({ user: user.id }),
        ]);

        return {
            total,
            page,
            limit,
            next: `/api/v1/categories?page=${page + 1}&limit=${limit}`,
            prev: (page - 1 > 0) ? `/api/v1/categories?page=${page - 1}&limit=${limit}` : null,
            categories
        }
    }

    async getById(id: string, user: UserEntity) {
        const category = await CategoryModel.findOne({ _id: id, user: user.id });
        if (!category) throw CustomError.notFound("Category not found");
        return category;
    }

    async create(categoryCreateDto: CategoryCreateDto, user: UserEntity) {
        const categoryExist = await CategoryModel.findOne({ name: categoryCreateDto.name });
        if (categoryExist) throw CustomError.badRequest("Category already exists");
        try {
            const category = new CategoryModel({
                ...categoryCreateDto,
                user: user.id
            });
            await category.save();
            return {
                message: "Category created successfully",
                category
            }
        } catch (error) {
            throw CustomError.internal("Internal server error");
        }
    }

    async update(id: string, categoryCreateDto: CategoryCreateDto, user: UserEntity) {
        const category = await CategoryModel.findOne({ _id: id, user: user.id });
        if (!category) throw CustomError.notFound("Category not found");
        try {
            category.name = categoryCreateDto.name || category.name;
            category.available = categoryCreateDto.available || category.available;
            await category.save();
            return {
                message: "Category updated successfully",
                category
            }
        } catch (error) {
            throw CustomError.internal("Internal server error");
        }
    }

    async delete(id: string, user: UserEntity) {
        const category = await CategoryModel.findOneAndDelete({ _id: id, user: user.id });
        if (!category) throw CustomError.notFound("Category not found");
        return {
            message: "Category deleted successfully",
            category
        }
    }
}