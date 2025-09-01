import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { SearchPostsDto } from './dto/search-posts.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/interfaces/jwt-payload.interface';
import { multerConfig } from './multer.config';

@ApiTags('Blog Posts')
@Controller('blog-posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Criar novo post' })
  @ApiBody({
    description: 'Dados do post com imagem obrigatória',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Título do post' },
        body: { type: 'string', description: 'Corpo do post' },
        markdown: { type: 'string', description: 'Código markdown do post' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem para usar como capa (obrigatório)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Post criado com sucesso',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou slug/autor já existente',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.create(createPostDto, file, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os posts com filtros opcionais' })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'ID do autor para filtrar posts',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca (procura no título, corpo e markdown)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de posts retornada com sucesso',
    type: [PostResponseDto],
  })
  findAll(@Query() searchParams: SearchPostsDto) {
    return this.postsService.findAll(searchParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar post por ID' })
  @ApiParam({ name: 'id', description: 'ID do post', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Post encontrado com sucesso',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Buscar post por slug' })
  @ApiParam({ name: 'slug', description: 'Slug do post', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Post encontrado com sucesso',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar post (apenas o autor)' })
  @ApiParam({ name: 'id', description: 'ID do post', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Post atualizado com sucesso',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou você não é o autor',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: RequestWithUser,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar post (apenas o autor)' })
  @ApiParam({ name: 'id', description: 'ID do post', type: 'number' })
  @ApiResponse({ status: 200, description: 'Post deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @ApiResponse({ status: 400, description: 'Você não é o autor do post' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    return this.postsService.remove(id, req.user.sub);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Curtir post (incrementar likes)' })
  @ApiParam({ name: 'id', description: 'ID do post', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Like adicionado com sucesso',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  like(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.incrementLikes(id);
  }
}
