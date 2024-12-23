import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(orderDto: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(orderDto);
    return await order.save();
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Order[]; total: number }> {
    const skip = (page - 1) * limit;

    // Retrieve paginated orders and the total count
    const [data, total] = await Promise.all([
      this.orderModel
        .find()
        .populate('record.productId') // Include population for related fields
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('record.productId')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, orderDto: Partial<Order>): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, orderDto, { new: true })
      .populate('record.productId')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async delete(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
