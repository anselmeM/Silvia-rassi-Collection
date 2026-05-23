const fetchProducts = async () => {
  const baseUrl = 'http://localhost:9000';
  const publishableKey = 'pk_c97cb3b73bcfb29b80cf1248a95f00d9b9f9c664b8eca271f6dcff1a6d5f77fd';

  try {
    console.log('Testing connection to Medusa 2.0...');
    const response = await fetch(`${baseUrl}/store/products`, {
      headers: {
        'x-publishable-api-key': publishableKey,
      },
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    if (response.status !== 200) {
      console.log('Error Details:', JSON.stringify(data, null, 2));
      return;
    }
    console.log('Product Count:', data.products?.length);
    console.log('First Product:', JSON.stringify(data.products?.[0], null, 2));
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};

fetchProducts();
