import { 
  SubscriberConfig, 
  SubscriberArgs,
} from "@medusajs/framework"
import { IInventoryModuleService, IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function inventoryUpdateHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const inventoryService: IInventoryModuleService = container.resolve(
    Modules.INVENTORY
  )
  const productService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )

  const inventoryItemId = data.id
  
  // 1. Get the inventory item to see current levels
  const [inventoryItem] = await inventoryService.listInventoryItems(
    { id: inventoryItemId },
    { relations: ["location_levels"] }
  )

  if (!inventoryItem) return

  // 2. Sum up stock across all locations
  const totalStock = inventoryItem.location_levels?.reduce(
    (acc, level) => acc + level.stocked_quantity, 
    0
  ) || 0

  // 3. Find the associated product variant to check for threshold in metadata
  // In Medusa 2.0, links are used. For simplicity, we search variants with this inventory_item_id
  const variants = await productService.listProductVariants(
    { inventory_item_id: inventoryItemId }
  )

  for (const variant of variants) {
    const threshold = (variant.metadata?.inventory_threshold as number) || 5 // Default threshold of 5
    
    if (totalStock <= threshold) {
      console.warn(
        `[LOW STOCK ALERT] Variant ${variant.title} (SKU: ${variant.sku}) is low on stock. ` +
        `Current: ${totalStock}, Threshold: ${threshold}`
      )
      // Future: Integrate with an email/SMS notification service here
    }
  }
}

export const config: SubscriberConfig = {
  event: "inventory-item.updated",
}
