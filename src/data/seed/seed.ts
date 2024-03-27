import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";

(async () => {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await seed();

    await MongoDatabase.disconnect();
})();

const randomBetween0andX = (x: number) => Math.floor(Math.random() * x);

async function seed() {

    //borrar todo
    await Promise.all([
        ProductModel.deleteMany(),
        UserModel.deleteMany(),
        CategoryModel.deleteMany()
    ]);

    //crear usuarios
    const users = await UserModel.insertMany(seedData.users);

    //crear categorias
    const categories = await CategoryModel.insertMany(seedData.categories.map((category) => ({
        ...category,
        user: users[randomBetween0andX(users.length)]._id
    })));

    //crear productos
    await ProductModel.insertMany(seedData.products.map((product) => ({
        ...product,
        user: users[randomBetween0andX(users.length-1)]._id,
        category: categories[randomBetween0andX(categories.length-1)]._id
    })));


}