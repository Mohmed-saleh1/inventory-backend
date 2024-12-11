import { ApiProperty } from '@nestjs/swagger';

export class SalaryDto {
  @ApiProperty({
    description: 'The salary of an individual employee',
    example: 3000,
  })
  salary: number;
}

export class CalcProfitRequestDto {
  @ApiProperty({
    description: 'Array of salaries',
    type: [SalaryDto],
    example: [{ salary: 3000 }, { salary: 2000 }, { salary: 1000 }],
  })
  salaries: SalaryDto[];

  @ApiProperty({
    description: 'The total profit available for distribution',
    example: 10000,
  })
  profit: number;
}

export class CalcProfitResponseDto {
  @ApiProperty({
    description: 'The remaining profit after deducting all salaries',
    example: 4000,
  })
  remainingProfit: number;
}
