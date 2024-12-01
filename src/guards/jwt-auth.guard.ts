import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request = context.switchToHttp().getRequest();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const payload = await this.jwtService.verifyAsync(token);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        request.user = payload;

        return true;
      } catch (jwtError: unknown) {
        this.logger.error(
          `JWT verification failed: ${(jwtError as Error).message}`,
        );

        throw new UnauthorizedException('Invalid token');
      }
    } catch (error: unknown) {
      this.logger.error(`Authentication failed: ${(error as Error).message}`);

      throw error;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      return type === 'Bearer' ? token : undefined;
    } catch (error: unknown) {
      this.logger.error(`Token extraction failed: ${(error as Error).message}`);

      throw error;
    }
  }
}
