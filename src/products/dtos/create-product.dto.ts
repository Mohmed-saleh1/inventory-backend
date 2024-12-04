import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Category of the product',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({ description: 'Name of the product', example: 'Smartphone' })
  name: string;

  @ApiProperty({ description: 'Price of the product', example: 299.99 })
  price: number;

  @ApiProperty({ description: 'Quantity of the product in stock', example: 50 })
  quantity: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-end smartphone with a great camera',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of the product',
  })
  image?: string;
}
