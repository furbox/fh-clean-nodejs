import { regularExps } from "../../../config";

export class LoginAuthDto {
    private constructor(
        public email: string,
        public password: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginAuthDto?] {
        const { email, password } = object;
        if (!email) return ["Email is required", undefined];
        if (!regularExps.email.test(email)) return ["Email is invalid", undefined];
        if (!password) return ["Password is required", undefined];

        return [undefined, new LoginAuthDto(email, password)];
    }
}