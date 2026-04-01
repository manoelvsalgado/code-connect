import {
  Controller,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/interfaces/jwt-payload.interface';
import { multerConfig } from '../posts/multer.config';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar avatar do usuário logado' })
  @ApiBody({
    description: 'Arquivo de imagem para avatar',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem para o avatar (obrigatório)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        avatar: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou não fornecido',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  updateAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(req.user.sub, file);
  }
}
