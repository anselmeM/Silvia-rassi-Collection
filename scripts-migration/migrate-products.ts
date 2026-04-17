import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEDUSA_API_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@silvia.com';
const ADMIN_PASSWORD = 'Jordan234';

async function migrate() {
  try {
    console.log('Authenticating...');
    const authResponse = await axios.post(`${MEDUSA_API_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    // Medusa 2.0 uses cookies for auth in dev, but for script we might need the session
    // Actually, create-medusa-app uses @medusajs/medusa-js usually.
    // Let's try to just get the products from the JSON file first.
    
    const productsPath = path.join(__dirname, '../../silvia-tcherassi/src/data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const { products } = productsData;

    console.log(`Found ${products.length} products to migrate.`);

    // Note: Medusa 2.0 Admin API uses /admin/products
    // We need to set the cookie from the auth response
    const cookie = authResponse.headers['set-cookie'];

    for (const product of products) {
      console.log(`Migrating ${product.name}...`);
      
      // Map categories to Medusa format
      // In a real migration we'd create categories first, but for now we'll just add tags or handle titles
      
      try {
        await axios.post(`${MEDUSA_API_URL}/admin/products`, {
          title: product.name,
          description: product.description,
          handle: product.name.toLowerCase().replace(/ /g, '-'),
          status: 'published',
          images: product.images.map((img: string) => `http://localhost:3006${img}`),
          options: [{ title: 'Default' }],
          variants: [
            {
              title: 'Default Variant',
              prices: [
                {
                  amount: product.price, // Prices are already in cents in products.json
                  currency_code: 'usd',
                }
              ],
              inventory_items: [
                {
                  sku: `${product.id.substring(0, 8)}`,
                  requirement_inventory: true,
                }
              ]
            }
          ]
        }, {
          headers: {
            Cookie: cookie ? cookie.join('; ') : '',
          }
        });
        console.log(`Successfully migrated ${product.name}`);
      } catch (err: any) {
        console.error(`Failed to migrate ${product.name}:`, err.response?.data || err.message);
      }
    }

    console.log('Migration complete!');
  } catch (error: any) {
    console.error('Migration failed:', error.response?.data || error.message);
  }
}

migrate();
