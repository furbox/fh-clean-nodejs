import { regularExps } from "../../../config";

export class RegisterAuthDto {
    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterAuthDto?] {
        const { name, email, password } = object;
        if (!name) return ["Name is required", undefined];
        if (!email) return ["Email is required", undefined];
        if (!regularExps.email.test(email)) return ["Email is invalid", undefined];
        if (!password) return ["Password is required", undefined];
        if (password.length < 8) return ["Password must be at least 8 characters", undefined];

        return [undefined, new RegisterAuthDto(name, email, password)];
    }
}