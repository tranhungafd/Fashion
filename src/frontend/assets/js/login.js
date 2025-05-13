document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Ngăn hành vi mặc định của form (tránh gửi qua GET)

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data); // Thêm log để debug

    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Đăng nhập thành công!');
      window.location.href = '/admin'; // Redirect đến route bảo vệ
    } else {
      alert(data.error || 'Đăng nhập thất bại.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Lỗi: ' + error.message);
  }
});