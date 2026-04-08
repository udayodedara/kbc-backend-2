import { PartialType } from '@nestjs/swagger';
import { CreateReferEarnDto } from './create-refer-earn.dto';

export class UpdateReferEarnDto extends PartialType(CreateReferEarnDto) {}
