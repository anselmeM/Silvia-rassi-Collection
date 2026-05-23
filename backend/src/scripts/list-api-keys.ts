import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function listPublishableKeys({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token", "type"],
  });
  
  console.log(JSON.stringify(keys, null, 2));
}
