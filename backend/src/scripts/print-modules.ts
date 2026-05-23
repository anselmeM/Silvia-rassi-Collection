import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function printModules({ container }: ExecArgs) {
  console.log(Object.keys(Modules));
}
