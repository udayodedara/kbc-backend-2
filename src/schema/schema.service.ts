import { Injectable } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class SchemaService {
  private schema: OpenAPIObject;

  setSchema(schema: OpenAPIObject) {
    this.schema = schema;
  }

  getSchema(): OpenAPIObject {
    return this.schema;
  }
}
