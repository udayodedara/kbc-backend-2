import { Controller, Get, NotFoundException } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Schema')
@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  @ApiOperation({ summary: 'Get the OpenAPI schema of all APIs' })
  getSchema() {
    const schema = this.schemaService.getSchema();
    if (!schema) {
      throw new NotFoundException('Schema not found. Make sure Swagger is configured correctly.');
    }
    return schema;
  }
}
