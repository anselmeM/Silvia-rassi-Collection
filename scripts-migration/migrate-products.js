import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEDUSA_API_URL = 'http://localhost:9000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLUEIxV01QMFM3OVI3V0hYWTFBRjlRS0IiLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLUEIxV01XM0E1REM1TVg1MVRRR1ZTWlkiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLUEIxV01QMFM3OVI3V0hYWTFBRjlRS0IifSwidXNlcl9tZXRhZGF0YSI6e30sImlhdCI6MTc3NjM1MTEwMSwiZXhwIjoxNzc2NDM3NTAxfQ.-gxPqMunxf6GEO54U2X06eTuEkP2sx_rwuIcsFTiFKk';

async function migrate() {
  try {
    const productsPath = path.join(__dirname, '../silvia-tcherassi/src/data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const { products } = productsData;

    console.log(`Found ${products.length} products to migrate.`);

    const headers = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    };

    console.log('Checking/Creating Region...');
    let regionId;
    try {
      const regionsRes = await axios.get(`${MEDUSA_API_URL}/admin/regions`, { headers });
      if (regionsRes.data.regions?.length > 0) {
        regionId = regionsRes.data.regions[0].id;
        console.log(`Using existing region: ${regionId}`);
      } else {
        const createRegionRes = await axios.post(`${MEDUSA_API_URL}/admin/regions`, {
          name: 'North America',
          currency_code: 'usd',
          countries: ['us', 'ca'],
        }, { headers });
        regionId = createRegionRes.data.region.id;
        console.log(`Created new region: ${regionId}`);
      }
    } catch (err) {
      console.error('Failed to handle regions:', err.response?.data || err.message);
      return;
    }

    for (const product of products) {
      console.log(`Migrating ${product.name}...`);
      
      try {
        const productPayload = {
          title: product.name,
          description: product.description,
          handle: product.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
          status: 'published',
          options: [{ title: 'Size', values: ['One Size'] }],
          variants: [
            {
              title: 'Default Variant',
              sku: `${product.id.substring(0, 8)}-${Date.now().toString().slice(-4)}`,
              manage_inventory: false,
              prices: [
                {
                  amount: product.price, // cents
                  currency_code: 'usd'
                }
              ],
              options: {
                'Size': 'One Size'
              }
            }
          ]
        };

        const res = await axios.post(`${MEDUSA_API_URL}/admin/products`, productPayload, { headers });
        console.log(`Successfully migrated ${product.name} (ID: ${res.data.product.id})`);
      } catch (err) {
        console.error(`Failed to migrate ${product.name}:`, JSON.stringify(err.response?.data) || err.message);
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error.response?.data || error.message);
  }
}

migrate();
