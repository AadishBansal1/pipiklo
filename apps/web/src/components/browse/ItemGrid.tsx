import type { ItemCard } from '@pipiklo/types'
import { ItemCard as ItemCardComponent } from './ItemCard'

interface ItemGridProps {
  items: ItemCard[]
  emptyMessage?: string
}

export function ItemGrid({ items, emptyMessage = 'No items found' }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCardComponent key={item.id} item={item} />
      ))}
    </div>
  )
}
