import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function inspectImages({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "handle", "images.url", "thumbnail"],
  });
  
  // Filter for our migrated products (non-demo)
  const migrated = products.filter(p => !["t-shirt", "sweatshirt", "sweatpants", "shorts"].includes(p.handle));
  
  console.log(JSON.stringify(migrated, null, 2));
}
