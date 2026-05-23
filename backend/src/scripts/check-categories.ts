import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function checkCategories({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "handle", "categories.name", "categories.handle"],
  });
  
  console.log(JSON.stringify(products, null, 2));
}
