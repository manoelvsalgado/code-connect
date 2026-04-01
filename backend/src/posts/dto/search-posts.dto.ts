import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPostsDto {
  @ApiProperty({
    example: 'clxyz123abc',
    description: 'ID do autor para filtrar posts',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({
    example: 'react typescript',
    description: 'Termo de busca (procura no título, corpo e markdown)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
