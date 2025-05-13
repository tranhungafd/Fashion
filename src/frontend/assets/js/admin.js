document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found, redirecting to login page');
    alert('Vui lòng đăng nhập để truy cập trang admin.');
    window.location.href = '/pages/login.html';
    return;
  }

  // Xử lý submit form
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form data:', Array.from(formData.entries()));
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log('Response from API:', data);
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