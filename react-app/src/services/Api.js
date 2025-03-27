import 'bootstrap/dist/css/bootstrap.min.css';

const baseUrl = 'https://localhost:7192/api/products';

export const getProducts = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const createProduct = async (product) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
};

export const updateProduct = async (id, product) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  return response;
};
