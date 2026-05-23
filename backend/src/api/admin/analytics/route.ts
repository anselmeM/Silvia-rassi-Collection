import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { IOrderModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const orderService: IOrderModuleService = req.scope.resolve(Modules.ORDER);

  try {
    // 1. Fetch all orders (in a real scenario, you'd filter by date and paginate)
    const [orders, count] = await orderService.listOrders(
      {},
      { relations: ["items"] }
    );

    // 2. Aggregate Revenue
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    // 3. Aggregate Top Selling Products
    const productSales: Record<string, { title: string, quantity: number }> = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        const productId = item.product_id || "unknown";
        if (!productSales[productId]) {
          productSales[productId] = { title: item.title, quantity: 0 };
        }
        productSales[productId].quantity += item.quantity;
      });
    });

    const topSelling = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      summary: {
        total_orders: count,
        total_revenue: totalRevenue,
      },
      top_selling: topSelling,
      recent_orders_count: orders.length
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
