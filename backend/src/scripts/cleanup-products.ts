import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function cleanupProducts({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });

  const medusaHandles = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];
  const toDelete = products
    .filter((p: any) => !medusaHandles.includes(p.handle))
    .map((p: any) => p.id);

  if (toDelete.length > 0) {
    logger.info(`Deleting ${toDelete.length} products...`);
    await deleteProductsWorkflow(container).run({
      input: { ids: toDelete },
    });
    logger.info("Cleanup completed.");
  } else {
    logger.info("No products to delete.");
  }
}
