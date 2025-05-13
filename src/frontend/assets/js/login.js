document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

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
    console.log('Login response:', data);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      console.log('Token stored:', data.token); // Thêm log để kiểm tra token
      alert('Đăng nhập thành công!');
      // Đảm bảo redirect với token
      window.location.href = `/admin?token=${data.token}`;
    } else {
      alert(data.error || 'Đăng nhập thất bại.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Lỗi: ' + error.message);
  }
});