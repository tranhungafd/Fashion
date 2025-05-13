document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();
    console.log('Products fetched:', products); // Thêm log để debug

    const productList = document.getElementById('product-list');
    if (products.length > 0) {
      products.forEach(product => {
        const productCard = `
          <div class="bg-white p-4 rounded shadow">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <h2 class="text-xl font-bold mt-2">${product.name}</h2>
            <p class="text-gray-600">${product.description}</p>
            <p class="text-green-600 font-semibold">${product.price} VND/ngày</p>
          </div>
        `;
        productList.innerHTML += productCard;
      });
    } else {
      productList.innerHTML = '<p>Không có sản phẩm nào.</p>';
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    document.getElementById('product-list').innerHTML = '<p>Lỗi khi tải sản phẩm.</p>';
  }
});