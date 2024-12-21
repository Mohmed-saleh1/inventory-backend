import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/products.schema';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Order {
  @Prop({
    required: true,
    type: [
      {
        productId: { type: String, ref: 'Product' },
        amount: Number,
      },
    ],
  })
  record: Array<{ productId: Product; amount: number }>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Order & Document;
