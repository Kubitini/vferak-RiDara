import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../common/providers/api-config.service';
import { UserService } from '../../shared/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly apiConfigService: ApiConfigService, // REVIEW: Proč to mít na this(u)
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: apiConfigService.getJwt().secret_key,
        });
    }
    // REVIEW: Proč používat any, když víme jaký JSON máme v tokenu
    async validate(payload: any) {
        return this.userService.getOneByUuid(payload.uuid);
    }
}
