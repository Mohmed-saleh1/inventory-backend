import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Create a new product
  async create(productDto: Partial<Product>): Promise<Product> {
    const product = new this.productModel(productDto);
    return product.save();
  }

  // Get all products
  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments({ isActive: true }).exec(),
    ]);

    return { data, total };
  }

  // Get a product by ID
  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Update a product by ID
  async update(id: string, productDto: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, productDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // Delete a product by ID
  async delete(id: string): Promise<void> {
    const result = await this.productModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
  async processSales(
    salesItems: { productId: string; quantity: number }[],
  ): Promise<void> {
    const session = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      for (const item of salesItems) {
        const product = await this.productModel
          .findById(item.productId)
          .session(session)
          .exec();

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
          );
        }

        product.sales += item.quantity;
        await product.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processWaste(
    westedItems: { productId: string; quantity: number }[],
  ): Promise<void> {
    const session = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      for (const item of westedItems) {
        console.log(item);
        const product = await this.productModel
          .findById(item.productId)
          .session(session)
          .exec();

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
          );
        }

        product.waste += item.quantity;
        await product.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processNewOrders(
    newOrders: { productId: string; quantity: number }[],
  ): Promise<void> {
    const session = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      for (const item of newOrders) {
        const product = await this.productModel
          .findById(item.productId)
          .session(session)
          .exec();

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        product.quantity += item.quantity;
        await product.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async calcProfit(
    salaries: { salary: number }[],
    profit: number,
  ): Promise<number> {
    // Calculate the total sum of all salaries
    const totalSalary = salaries.reduce(
      (sum, employee) => sum + employee.salary,
      0,
    );

    // Subtract the total salary from the profit
    const remainingProfit = profit - totalSalary;

    return remainingProfit;
  }
}
