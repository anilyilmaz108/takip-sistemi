import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Role } from 'src/common/entities/role.entity';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: `-----BEGIN PUBLIC KEY-----\n${configService.get<string>(
      'KEYCLOAK_PUBLIC_KEY',
    )}\n-----END PUBLIC KEY-----`,
    });
  }

  async validate(payload: any) {
    const { email, sub, realm_access } = payload;

    // 1️⃣ Kullanıcı DB’de var mı?
    let user = await this.userRepository.findOne({
      where: { keycloakId: sub },
      relations: ['roles'],
    });

    if (!user) {
      user = this.userRepository.create({
        email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        keycloakId: sub,
        roles: [],
      });
    }

    // 2️⃣ Token içindeki rolleri al
    const tokenRoles: string[] = realm_access?.roles || [];

    const dbRoles: Role[] = [];

    for (const roleName of tokenRoles) {
      let role = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!role) {
        role = this.roleRepository.create({
          name: roleName,
        });
        await this.roleRepository.save(role);
      }

      dbRoles.push(role);
    }

    user.roles = dbRoles;
    await this.userRepository.save(user);

    return user; // request.user burada DB user olacak
  }
}