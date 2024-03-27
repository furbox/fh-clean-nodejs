import { ProductModel } from "../../data";
import { CustomError, PaginationDto, UserEntity, ProductCreateDto } from "../../domain";

export class ProductService {

    constructor() { }

    async getAll(paginationDto: PaginationDto, user: UserEntity) {
        const { page, limit } = paginationDto;

        const [products, total] = await Promise.all([
            ProductModel.find({ user: user.id })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("user","name email")
                .populate("category","name"),
            ProductModel.countDocuments({ user: user.id }),
        ]);

        return {
            total,
            page,
            limit,
            next: `/api/v1/products?page=${page + 1}&limit=${limit}`,
            prev: (page - 1 > 0) ? `/api/v1/products?page=${page - 1}&limit=${limit}` : null,
            products
        }
    }

    async getById(id: string, user: UserEntity) {
        const product = await ProductModel.findOne({ _id: id, user: user.id });
        if (!product) throw CustomError.notFound("Product not found");
        return product;
    }

    async create(productCreateDto: ProductCreateDto) {
        const productExist = await ProductModel.findOne({ name: productCreateDto.name });
        if (productExist) throw CustomError.badRequest("Product already exists");
        try {
            const product = new ProductModel(productCreateDto);
            await product.save();
            return {
                message: "Product created successfully",
                product
            }
        } catch (error) {
            throw CustomError.internal("Internal server error");
        }
    }

    async update(id: string, productCreateDto: ProductCreateDto, user: UserEntity) {
        const product = await ProductModel.findOne({ _id: id, user: user.id });
        if (!product) throw CustomError.notFound("Product not found");
        try {
            product.name = productCreateDto.name || product.name;
            product.available = productCreateDto.available || product.available;
            await product.save();
            return {
                message: "Product updated successfully",
                product
            }
        } catch (error) {
            throw CustomError.internal("Internal server error");
        }
    }

    async delete(id: string, user: UserEntity) {
        const product = await ProductModel.findOneAndDelete({ _id: id, user: user.id });
        if (!product) throw CustomError.notFound("Product not found");
        return {
            message: "Product deleted successfully",
            product
        }
    }
}