import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'Introdução ao React',
    description: 'Título do post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Neste post, vamos explorar os conceitos básicos do React...',
    description: 'Corpo do post',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    example:
      '```javascript\nfunction HelloComponent() {\n  return <h1>Hello, world!</h1>;\n}\n```',
    description: 'Código markdown do post',
  })
  @IsString()
  @IsNotEmpty()
  markdown: string;
}
