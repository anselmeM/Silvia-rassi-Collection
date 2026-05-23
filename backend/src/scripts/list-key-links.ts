import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function listSalesChannelKeys({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const { data: links } = await query.graph({
    entity: "publishable_api_key_sales_channel",
    fields: ["publishable_key_id", "sales_channel_id"],
  });
  
  console.log(JSON.stringify(links, null, 2));
}
