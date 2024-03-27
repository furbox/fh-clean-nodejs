import { Request, Response } from "express";
import { CustomError, LoginAuthDto, RegisterAuthDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController{
    constructor(
        public readonly authService: AuthService
    ){}

    private handleError = ( error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statsCode).json({error: error.message});
        }
        return res.status(500).json({error: 'Internal server error'});
    }

    register = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterAuthDto.create(req.body);
        if(error) return res.status(400).json({error});
        
        return this.authService.register(registerDto!)
        .then((data) => res.json({data}))
        .catch((error) => this.handleError(error, res));
    }

    login = (req: Request, res: Response) => {
        const [error, loginDto] = LoginAuthDto.create(req.body);
        if(error) return res.status(400).json({error});

        return this.authService.login(loginDto!)
        .then((data) => res.json({data}))
        .catch((error) => this.handleError(error, res));
    }

    validateEmail = (req: Request, res: Response) => {
        const {token} = req.params;
        this.authService.validateEmail(token)
        .then((data) => res.json({message: 'Email validated'}))
        .catch((error) => this.handleError(error, res));
    }
}