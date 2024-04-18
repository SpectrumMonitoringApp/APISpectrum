import 'dotenv/config';
import * as bcrypt from 'bcrypt';
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
    const hashedPassword = await bcrypt.hash(signUpDto.password + process.env.PASSWORD_SALT, 10);
    const newUser = { fullName: signUpDto.fullName, email: signUpDto.email, password: hashedPassword };

    return await this.usersService.create(newUser);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (!await bcrypt.compare(signInDto.password + process.env.PASSWORD_SALT, user?.password)) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email, fullName: user.fullName };

    return {
      email: user.email,
      fullName: user.fullName,
      accessToken: await this.jwtService.signAsync(payload, { expiresIn: '2h' })
    };
  }
}