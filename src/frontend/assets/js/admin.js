document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found, redirecting to login page');
    alert('Vui lòng đăng nhập để truy cập trang admin.');
    window.location.href = '/pages/login.html';
    return;
  }

  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Xử lý các trường checkbox thành mảng và thêm vào formData
    const processCheckboxes = (name) => {
      const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
      const values = Array.from(checkboxes).map(cb => cb.value);
      formData.delete(name); // Xóa giá trị mặc định
      if (values.length > 0) {
        formData.append(name, JSON.stringify(values)); // Gửi mảng dưới dạng JSON
      }
      return values;
    };

    const colors = processCheckboxes('colors');
    const occasions = processCheckboxes('occasions');
    const styles = processCheckboxes('styles');
    const categories = processCheckboxes('categories');

    console.log('Form data (raw):', Array.from(formData.entries()));
    console.log('Processed colors:', colors);
    console.log('Processed occasions:', occasions);
    console.log('Processed styles:', styles);
    console.log('Processed categories:', categories);

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