import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from './products.service';
import { Product } from './products.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product with an image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The product has been created.',
    type: Product,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Save files to the uploads folder
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    const imagePath = `/uploads/${file.filename}`;
    const productWithImage = { ...createProductDto, image: imagePath };
    return this.productService.create(productWithImage);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [Product],
  })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    example: '63f9fdf4a8e7315c6b1b5af7',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been retrieved.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    example: '63f9fdf4a8e7315c6b1b5af7',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    example: '63f9fdf4a8e7315c6b1b5af7',
  })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }

  @Post('sales')
  @ApiOperation({ summary: 'Add sales and update product quantities' })
  @ApiResponse({
    status: 200,
    description: 'Sales processed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient stock or invalid input.',
  })
  @ApiBody({
    description: 'Array of sales items containing product ID and quantity.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'The unique identifier of the product.',
            example: '63f3d7b45134563d9d4f423b',
          },
          quantity: {
            type: 'number',
            description: 'The quantity of the product to be sold.',
            example: 5,
          },
        },
      },
      example: [
        {
          productId: '63f3d7b45134563d9d4f423b',
          quantity: 5,
        },
        {
          productId: '63f3d7b45134563d9d4f123a',
          quantity: 3,
        },
      ],
    },
  })
  async processSales(
    @Body() salesItems: { productId: string; quantity: number }[],
  ): Promise<{ message: string }> {
    await this.productService.processSales(salesItems);
    return { message: 'Sales processed successfully' };
  }

  @Post('waste')
  @ApiOperation({ summary: 'Add Waste and update product quantities' })
  @ApiResponse({
    status: 200,
    description: 'Waste processed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient stock or invalid input.',
  })
  @ApiBody({
    description: 'Array of Waste items containing product ID and quantity.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'The unique identifier of the product.',
            example: '63f3d7b45134563d9d4f423b',
          },
          quantity: {
            type: 'number',
            description: 'The quantity of the product to be sold.',
            example: 5,
          },
        },
      },
      example: [
        {
          productId: '63f3d7b45134563d9d4f423b',
          quantity: 5,
        },
        {
          productId: '63f3d7b45134563d9d4f123a',
          quantity: 3,
        },
      ],
    },
  })
  async processWaste(
    @Body() westedItems: { productId: string; quantity: number }[],
  ): Promise<{ message: string }> {
    await this.productService.processWaste(westedItems);
    return { message: 'Wastes processed successfully' };
  }
}
