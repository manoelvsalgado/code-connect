import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostsDto } from './dto/search-posts.dto';
import { generateSlug } from './utils/slug.util';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPostDto: CreatePostDto,
    file?: Express.Multer.File,
    userId?: string,
  ) {
    // Valida se o arquivo foi enviado
    if (!file) {
      throw new BadRequestException(
        'É necessário enviar uma imagem para o post',
      );
    }

    // Valida se o userId foi fornecido
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado');
    }

    // Gera o slug baseado no título
    let slug = generateSlug(createPostDto.title);

    // Verifica se o slug já existe e adiciona um número se necessário
    const existingPost = await this.prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      let counter = 1;
      let newSlug = `${slug}-${counter}`;

      while (await this.prisma.post.findUnique({ where: { slug: newSlug } })) {
        counter++;
        newSlug = `${slug}-${counter}`;
      }

      slug = newSlug;
    }

    const data = {
      ...createPostDto,
      slug,
      cover: `${process.env.APP_URL || 'http://localhost:3000'}/uploads/${file.filename}`,
      authorId: userId,
      likes: 0,
    };

    return this.prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAll(searchParams?: SearchPostsDto) {
    const where: any = {};

    // Filtro por autor
    if (searchParams?.authorId) {
      where.authorId = searchParams.authorId;
    }

    // Filtro de busca textual
    if (searchParams?.search) {
      where.OR = [
        {
          title: {
            contains: searchParams.search,
            mode: 'insensitive',
          },
        },
        {
          body: {
            contains: searchParams.search,
            mode: 'insensitive',
          },
        },
        {
          markdown: {
            contains: searchParams.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Post não encontrado');
    }

    // Verificar se o usuário logado é o autor do post
    if (existingPost.authorId !== userId) {
      throw new BadRequestException('Você só pode editar seus próprios posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    // Verificar se o usuário logado é o autor do post
    if (post.authorId !== userId) {
      throw new BadRequestException('Você só pode deletar seus próprios posts');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async incrementLikes(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
