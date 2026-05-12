import { Injectable } from '@nestjs/common'
import { prisma } from '@pipiklo/database'
import * as crypto from 'crypto'

const PLAN_PRICES = { monthly: 165000, annual: 1650000, team: 550000 } // paise

@Injectable()
export class SubscriptionsService {
  async getByUserId(userId: string) {
    return prisma.subscription.findUnique({ where: { userId } })
  }

  async createRazorpayOrder(plan: string, userId: string) {
    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES] ?? 165000

    // In production: call Razorpay API to create order
    // Returning mock order for now
    const orderId = `order_${Date.now()}`

    await prisma.payment.create({
      data: {
        userId,
        amount: amount / 100,
        currency: 'INR',
        gateway: 'razorpay',
        status: 'pending',
        razorpayOrderId: orderId,
        metadata: { plan },
      },
    })

    return {
      orderId,
      amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    }
  }

  async verifyAndActivate(body: { orderId: string; paymentId: string; signature: string; plan: string }, userId: string) {
    const { orderId, paymentId, signature, plan } = body

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (expectedSignature !== signature) {
      throw new Error('Invalid payment signature')
    }

    // Update payment record
    await prisma.payment.updateMany({
      where: { razorpayOrderId: orderId },
      data: { status: 'success', razorpayPaymentId: paymentId },
    })

    // Activate/update subscription
    const now = new Date()
    const periodEnd = plan === 'annual'
      ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
      : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

    const subscription = await prisma.subscription.upsert({
      where: { userId },
      create: { userId, plan: plan as any, status: 'active', currentPeriodEnd: periodEnd, razorpaySubId: paymentId },
      update: { plan: plan as any, status: 'active', currentPeriodEnd: periodEnd, razorpaySubId: paymentId, currentPeriodStart: now },
    })

    return { subscription, success: true }
  }
}
