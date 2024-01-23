import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async signUp(signUpDto: SignUpDto) {
    const newUser = { fullName: signUpDto.fullName, email: signUpDto.email, password: signUpDto.password };

    return await this.usersService.create(newUser);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email };

    return {
      email: user.email,
      accessToken: await this.jwtService.signAsync(payload)
    };
  }
}