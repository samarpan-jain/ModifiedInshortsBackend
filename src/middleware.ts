import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req: any, res: any, next: any) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Respond to preflight requests
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }

        next();
    }
}
