import { Validators } from "../../../config";


export class ProductCreateDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, ProductCreateDto?] {
        const { name, description, price, category, available, user } = object;
        if (!name) return ['name is required'];
        if (!user) return ['user is required'];
        if (!price) return ['price is required'];
        if (!category) return ['category is required'];
        if(!Validators.isMongoId(user)) return ['user is invalid'];
        if(!Validators.isMongoId(category)) return ['category is invalid'];


        return [undefined, new ProductCreateDto(name, !!available, price, description, user, category)];
    }

}