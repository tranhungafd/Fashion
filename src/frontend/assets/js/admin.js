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

    // Xóa giá trị mặc định của richDescription từ textarea
    formData.delete('richDescription');

    // Lấy nội dung từ CKEditor
    let richDescription = '';
    try {
      if (typeof CKEditor !== 'undefined' && CKEditor.instances.richDescription) {
        richDescription = CKEditor.instances.richDescription.getData();
        console.log('CKEditor richDescription:', richDescription);
        if (!richDescription) {
          console.warn('CKEditor returned empty data');
          richDescription = '';
        }
      } else {
        console.warn('CKEditor not loaded, using empty richDescription');
      }
    } catch (editorError) {
      console.error('Error accessing CKEditor:', editorError);
      richDescription = '';
    }

    // Thêm richDescription vào formData
    formData.append('richDescription', richDescription);

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
        if (CKEditor.instances.richDescription) {
          CKEditor.instances.richDescription.setData('');
        }
      } else {
        alert(data.error || 'Lỗi khi upload sản phẩm.');
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Lỗi: ' + error.message);
    }
  });
});