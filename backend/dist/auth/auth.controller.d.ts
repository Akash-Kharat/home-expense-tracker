import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            name: string;
            email: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            familyId: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            familyId: string;
        };
    }>;
    getProfile(user: any): Promise<{
        family: {
            name: string;
            id: string;
        };
        name: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        familyId: string;
    } | null>;
}
