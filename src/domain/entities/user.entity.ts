import { CustomError } from "../errors/custom.errors";

export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): UserEntity {
        const { id, _id, name, email, emailValidated, password, role, img } = object;
        if (!_id && !id) {
            throw CustomError.badRequest("User id is required");
        }

        if(!name) throw CustomError.badRequest("User name is required");
        if(!email) throw CustomError.badRequest("User email is required");
        if(emailValidated === undefined) throw CustomError.badRequest("User emailValidated is required");
        if(!password) throw CustomError.badRequest("User password is required");
        if(!role) throw CustomError.badRequest("User role is required");

        return new UserEntity(id || _id, name, email, emailValidated, password, role, img);
    }
}