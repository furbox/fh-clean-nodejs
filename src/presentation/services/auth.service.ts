import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginAuthDto, RegisterAuthDto, UserEntity } from "../../domain";
import { EmailService } from "./email-service";

export class AuthService{
    constructor(
        private readonly emailService: EmailService
    ){}

    public async register(registerAuthDto: RegisterAuthDto) {
        const existUser = await UserModel.findOne({ email: registerAuthDto.email });
        if (existUser) throw CustomError.badRequest("Email already exists");
        try {
            const user = new UserModel(registerAuthDto);
            
            //encriptar password
            user.password = bcryptAdapter.hash(registerAuthDto.password);
            
            await user.save();

            //enviar email
            await this.sendEmailValidation(registerAuthDto.email);

            const {password, ...rest} = UserEntity.fromObject(user);

            return {
                message: "User registered successfully",
                user: rest,

            }
        } catch (error) {
            throw CustomError.internal("Internal server error");
        }

    }

    public async login(loginAuthDto: LoginAuthDto) {
        const user = await UserModel.findOne({ email: loginAuthDto.email });
        if (!user) throw CustomError.badRequest("Invalid password or email");
        const isPasswordValid = bcryptAdapter.compare(loginAuthDto.password, user.password);
        if (!isPasswordValid) throw CustomError.badRequest("Invalid password or email");
        if(!user.emailValidated) throw CustomError.badRequest("User is not active");
        const {password, ...rest} = UserEntity.fromObject(user);
        //jwt
        const token = await JwtAdapter.generateToken({id: rest.id, email: rest.email});
        if(!token) throw CustomError.internal("Internal server error");

        return {
            message: "User logged in successfully",
            user: rest,
            token
        }
    }

    private async sendEmailValidation(email: string) {
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internal("Internal server error");

        const html = `
            <h1>Validate your email</h1>
            <p>Click <a href="${envs.WEB_URL}/auth/validate-email/${token}">here</a> to validate your email</p>
        `;
        const isSent = await this.emailService.sendEmail({
            to: email,
            subject: "Validate your email",
            htmlBody: html
        });

        if(!isSent) throw CustomError.internal("Internal server error");

        return true;

    }

    public async validateEmail(token: string) {
        const decoded = await JwtAdapter.verifyToken(token);
        if(!decoded) throw CustomError.badRequest("Invalid token");

        const {email} = decoded as {email: string};
        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.badRequest("Invalid token");
        user.emailValidated = true;
        await user.save();
        return true;
    }
}