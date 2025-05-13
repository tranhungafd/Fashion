document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form data:', Array.from(formData.entries())); // Thêm log để kiểm tra dữ liệu form
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Thêm log để kiểm tra token
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log('Response from API:', data); // Thêm log để kiểm tra response
      if (response.ok) {
        alert('Sản phẩm đã được upload!');
        e.target.reset();
      } else {
        alert(data.error || 'Lỗi khi upload sản phẩm.');
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Lỗi: ' + error.message);
    }
  });
});