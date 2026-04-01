import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async updateAvatar(userId: string, file?: Express.Multer.File) {
    // Valida se o arquivo foi enviado
    if (!file) {
      throw new BadRequestException(
        'É necessário enviar uma imagem para o avatar',
      );
    }

    // Gera a URL completa do avatar
    const avatarUrl = `${process.env.APP_URL || 'http://localhost:3000'}/uploads/${file.filename}`;

    // Atualiza o usuário no banco
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
