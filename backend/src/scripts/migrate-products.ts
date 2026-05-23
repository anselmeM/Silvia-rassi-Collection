import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import * as fs from "fs";
import * as path from "path";

export default async function migrateProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  logger.info("Starting product migration...");

  // Read products from json
  const productsPath = path.resolve(__dirname, "../../../silvia-tcherassi/src/data/products.json");
  const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const sourceProducts = productsData.products;

  // Get Default Sales Channel
  const [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel) {
    throw new Error("Default Sales Channel not found. Please run seed first.");
  }

  // Get Default Shipping Profile
  const [shippingProfile] = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });

  if (!shippingProfile) {
    throw new Error("Default Shipping Profile not found. Please run seed first.");
  }

  // Extract unique categories
  const categoryHandles = Array.from(new Set(sourceProducts.map((p: any) => p.category))) as string[];
  
  logger.info(`Checking/Creating categories: ${categoryHandles.join(", ")}`);

  const productModuleService = container.resolve(Modules.PRODUCT);
  
  const categoryResult: any[] = [];
  for (const handle of categoryHandles) {
    const [existing] = await productModuleService.listProductCategories({
      handle: handle,
    }, {
      select: ["id", "handle"]
    });
    
    if (existing) {
      logger.info(`Found existing category for handle ${handle}: ${JSON.stringify(existing)}`);
      categoryResult.push(existing);
    } else {
      const { result: newCategories } = await createProductCategoriesWorkflow(
        container
      ).run({
        input: {
          product_categories: [{
            name: handle.charAt(0).toUpperCase() + handle.slice(1),
            handle: handle,
            is_active: true,
          }],
        },
      });
      // The workflow result should include the handle, but let's be safe
      categoryResult.push({ ...newCategories[0], handle });
    }
  }

  logger.info("Seeding products...");
  logger.info(`Category result count: ${categoryResult.length}`);
  logger.info(`Category handles: ${categoryResult.map(c => c.handle).join(", ")}`);

  const productsToCreate = sourceProducts.map((p: any) => {
    const category = categoryResult.find((c) => c.handle === p.category);
    logger.info(`Mapping product ${p.name} to category ${p.category}: ${JSON.stringify(category)}`);
    
    return {
      title: p.name,
      handle: p.name.toLowerCase().replace(/ /g, "-"),
      description: p.description,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: category ? [category.id] : [],
      images: p.images.map((img: string) => ({
        // Map local paths to placeholder URLs or keep them if they will be handled by a proxy
        // For now, we'll keep them as is or prepend a base URL if needed.
        // Medusa 2.0 expects valid URLs for the S3/File modules.
        url: img.startsWith("/") ? `http://localhost:3006${img}` : img,
      })),
      options: [
        {
          title: "Default Option",
          values: ["Default"],
        },
      ],
      variants: [
        {
          title: "Standard",
          sku: `${p.category.toUpperCase()}-${p.name.toUpperCase().replace(/ /g, "-")}`,
          options: {
            "Default Option": "Default",
          },
          prices: [
            {
              amount: p.price, // Assuming price in products.json is already in cents
              currency_code: "usd",
            },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel.id,
        },
      ],
    };
  });

  await createProductsWorkflow(container).run({
    input: {
      products: productsToCreate,
    },
  });

  logger.info("Product migration completed successfully.");
}
