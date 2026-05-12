import { Controller, Post, Body, Get, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SubscriptionsService } from './subscriptions.service'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription' })
  getMySubscription(@Request() req: any) {
    return this.subscriptionsService.getByUserId(req.userId)
  }

  @Post('razorpay/create-order')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order for subscription' })
  createRazorpayOrder(@Body() body: { plan: string }, @Request() req: any) {
    return this.subscriptionsService.createRazorpayOrder(body.plan, req.userId)
  }

  @Post('razorpay/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment and activate subscription' })
  verifyRazorpay(@Body() body: { orderId: string; paymentId: string; signature: string; plan: string }, @Request() req: any) {
    return this.subscriptionsService.verifyAndActivate(body, req.userId)
  }
}
