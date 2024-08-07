import { Controller, Post } from '@nestjs/common';

@Controller('direct_post')
export class DirectPostController {
  constructor() {}

  @Post()
  verify() {
    return 'OK';
  }
}
