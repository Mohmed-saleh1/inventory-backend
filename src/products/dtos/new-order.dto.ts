import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewOrderDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product to order',
    example: 10,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
