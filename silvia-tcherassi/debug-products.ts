import { medusaFetch } from './src/lib/medusa';

async function test() {
  try {
    const data = await medusaFetch('/store/products?limit=1');
    console.log('Raw Product Sample:', JSON.stringify(data.products[0], null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
