import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from '../users/users.service'

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly usersService: UsersService) {}

  @Post('clerk')
  async handleClerkWebhook(@Body() payload: any) {
    const { type } = payload
    if (type === 'user.created' || type === 'user.updated') {
      await this.usersService.syncFromClerk(payload)
    }
    return { received: true }
  }

  @Post('razorpay')
  async handleRazorpayWebhook(@Body() payload: any) {
    // Handle Razorpay webhook events
    const { event } = payload
    console.log('Razorpay webhook:', event)
    return { received: true }
  }
}
