import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/Api';

const Products = () => {
  const [products, setProducts] = useState([]);
  // Start with empty strings so we don't have to remove '0'
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editingProduct, setEditingProduct] = useState(null); // holds the product being edited

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle creating a new product (called on form submit or button click)
  const handleCreate = async (e) => {
    // Prevent form from reloading the page
    e.preventDefault();

    // Validate inputs
    if (!newProduct.name.trim()) {
      alert('Please enter a valid product name.');
      return;
    }
    const priceValue = parseFloat(newProduct.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid product price.');
      return;
    }

    try {
      // Make the POST request
      await createProduct({ name: newProduct.name, price: priceValue });
      // Reset form
      setNewProduct({ name: '', price: '' });
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Enter edit mode for a specific product
  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
  };

  // Update the local editing state as the user types
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes to the product
  const handleUpdate = async (id) => {
    if (!editingProduct.name.trim()) {
      alert('Please enter a valid product name.');
      return;
    }
    const priceValue = parseFloat(editingProduct.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid product price.');
      return;
    }

    try {
        await updateProduct(id, {
            name: editingProduct.name,
            price: parseFloat(editingProduct.price)
          });
      setEditingProduct(null); // exit edit mode
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Delete a product
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Manage Products</h2>

      {/* Add New Product Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Add a New Product</h4>
          <form onSubmit={handleCreate} className="row g-3 align-items-end mt-2">
            <div className="col-auto">
              <label htmlFor="productName" className="form-label mb-0">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div className="col-auto">
              <label htmlFor="productPrice" className="form-label mb-0">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="productPrice"
                placeholder="Product price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-success">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products List Section */}
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Products List</h4>
          <table className="table table-bordered table-hover mt-3">
            <thead className="table-light">
              <tr>
                <th style={{ width: '40%' }}>Name</th>
                <th style={{ width: '20%' }}>Price</th>
                <th style={{ width: '40%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isEditing = editingProduct && editingProduct.id === product.id;
                return (
                  <tr key={product.id}>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={editingProduct.name}
                          onChange={handleEditChange}
                        />
                      ) : (
                        product.name
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={editingProduct.price}
                          onChange={handleEditChange}
                        />
                      ) : (
                        `₹${product.price}`
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={() => handleUpdate(product.id)}
                          >
                            Save
                          </button>
                          <button className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => handleEditClick(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
