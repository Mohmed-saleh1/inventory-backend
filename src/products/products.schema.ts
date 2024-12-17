import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Product {
  @ApiProperty({
    description: 'Category of the product',
    example: 'Electronics',
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({ description: 'Name of the product', example: 'Smartphone' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Price of the product', example: 299.99 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'Quantity of the product in stock', example: 50 })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-end smartphone with a great camera',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/image.jpg',
  })
  @Prop({ required: true })
  image: string;

  @Prop({ default: 0 })
  waste: number;

  @Prop({ default: 0 })
  sales: number;

  @ApiProperty({
    description: 'Available stock calculated as quantity - (sales + waste)',
    example: 40,
  })
  get available(): number {
    return this.quantity - (this.sales + this.waste);
  }
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
