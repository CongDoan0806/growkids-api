import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ObjectScanningService } from './object-scanning.service';
import { ScanningObjectDto } from './dto/object-scanning.dto';

@UseGuards(JwtAuthGuard)
@Controller('object-scanning')
export class ObjectScanningController {
  constructor(private readonly objectScanningService: ObjectScanningService) {}

  @Post('identify')
  async identifyObject(@Body() dto: ScanningObjectDto, @Req() req: any) {
    const image = dto.imageBase64;
    const childId = req.user.childId;
    return await this.objectScanningService.handleObjectScanning(
      image,
      childId,
    );
  }
}
