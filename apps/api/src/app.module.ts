import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ItemsModule } from './items/items.module'
import { CategoriesModule } from './categories/categories.module'
import { UsersModule } from './users/users.module'
import { DownloadsModule } from './downloads/downloads.module'
import { LicensesModule } from './licenses/licenses.module'
import { StorageModule } from './storage/storage.module'
import { SearchModule } from './search/search.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { AdminModule } from './admin/admin.module'
import { WebhooksModule } from './webhooks/webhooks.module'
import { AnalyticsModule } from './analytics/analytics.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ItemsModule,
    CategoriesModule,
    UsersModule,
    DownloadsModule,
    LicensesModule,
    StorageModule,
    SearchModule,
    SubscriptionsModule,
    AdminModule,
    WebhooksModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
