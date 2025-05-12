document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Sản phẩm đã được upload!');
        e.target.reset();
      } else {
        alert(data.error || 'Lỗi khi upload sản phẩm.');
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  });
});