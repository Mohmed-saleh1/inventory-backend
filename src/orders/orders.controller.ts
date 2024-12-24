import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Order } from './order.schema';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
    type: Order,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({
    description: 'Order creation payload',
    schema: {
      type: 'object',
      properties: {
        record: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string', description: 'Product ID' },
              amount: {
                type: 'number',
                description: 'Quantity of the product',
              },
            },
            required: ['productId', 'amount'],
          },
        },
      },
      required: ['record'],
    },
    examples: {
      validPayload: {
        summary: 'Valid payload example',
        value: {
          record: [
            { productId: '63f1a4b7c25e1e4d4b8f0c20', amount: 2 },
            { productId: '63f1a4b7c25e1e4d4b8f0c21', amount: 1 },
          ],
        },
      },
    },
  })
  async create(@Body() orderDto: Partial<Order>): Promise<Order> {
    try {
      return await this.ordersService.create(orderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders with pagination metadata',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const result = await this.ordersService.findAll(
      Number(page),
      Number(limit),
    );
    return {
      ...result,
      page: Number(page),
      limit: Number(limit),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an order by ID with product details' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '63f1a4b7c25e1e4d4b8f0c20',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully with product details.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async findById(@Param('id') id: string): Promise<Order> {
    try {
      return await this.ordersService.findById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '63f1a4b7c25e1e4d4b8f0c20',
  })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async update(
    @Param('id') id: string,
    @Body() orderDto: Partial<Order>,
  ): Promise<Order> {
    try {
      return await this.ordersService.update(id, orderDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '63f1a4b7c25e1e4d4b8f0c20',
  })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.ordersService.delete(id);
      return { message: `Order with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
