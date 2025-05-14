document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) {
    alert('Không tìm thấy sản phẩm.');
    window.location.href = '/pages/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const product = await response.json();
    console.log('Product details:', product);

    if (!response.ok) {
      alert(product.message || 'Lỗi khi tải chi tiết sản phẩm.');
      window.location.href = '/pages/index.html';
      return;
    }

    // Cập nhật giao diện
    document.getElementById('product-image').src = product.image || '';
    document.getElementById('product-name').textContent = product.name || 'Không có tên';
    document.getElementById('product-price').textContent = `${product.price || 0}đ`;
    document.getElementById('product-description').textContent = product.description || 'Không có mô tả';

    // Hiển thị mô tả chi tiết (giống mô tả ngắn)
    document.getElementById('product-rich-description').textContent = product.richDescription || 'Không có mô tả chi tiết';

    // Hiển thị ảnh phụ
    const thumbnailList = document.getElementById('thumbnail-list');
    if (product.secondaryImages && product.secondaryImages.length > 0) {
      product.secondaryImages.forEach((img, index) => {
        const thumbnail = `<img src="${img}" alt="Thumbnail ${index + 1}" class="w-20 h-20 object-cover cursor-pointer">`;
        thumbnailList.innerHTML += thumbnail;
      });
    } else {
      thumbnailList.innerHTML = '<p>Không có ảnh phụ</p>';
    }

    // Hiển thị kích thước
    const sizesList = document.getElementById('product-sizes');
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach(size => {
        const sizeButton = `<button class="px-3 py-1 bg-gray-200 rounded">${size}</button>`;
        sizesList.innerHTML += sizeButton;
      });
    } else {
      sizesList.innerHTML = '<p>Không có kích thước</p>';
    }

    // Cập nhật ngày mặc định
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rent-start').value = today;
    document.getElementById('rent-end').value = today;

  } catch (error) {
    console.error('Error fetching product details:', error);
    alert('Lỗi: ' + error.message);
  }
});