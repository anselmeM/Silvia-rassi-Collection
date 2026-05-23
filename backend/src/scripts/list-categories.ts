import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function listCategories({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["name", "handle", "id"],
  });
  console.log(JSON.stringify(categories, null, 2));
}
