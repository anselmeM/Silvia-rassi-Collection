import { ExecArgs } from "@medusajs/framework/types";
import { createRegionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function addNARegion({ container }: ExecArgs) {
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "North America",
          currency_code: "usd",
          countries: ["us", "ca", "mx"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  console.log("North America region created:", regionResult[0].id);
}
