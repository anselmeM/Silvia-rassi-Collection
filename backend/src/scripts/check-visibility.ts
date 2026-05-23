import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function checkVisibility({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "handle", "status", "sales_channels.name", "sales_channels.id"],
  });
  
  console.log(JSON.stringify(products, null, 2));
}
