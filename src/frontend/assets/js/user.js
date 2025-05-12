async function fetchProducts() {
     try {
       const response = await fetch('http://localhost:3000/api/products');
       const products = await response.json();
       const productList = document.getElementById('product-list');
       productList.innerHTML = '';
       products.forEach(product => {
         productList.innerHTML += `
           <div class="bg-white p-4 rounded-lg shadow">
             <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded">
             <h2 class="text-xl font-semibold mt-2">${product.name}</h2>
             <p class="text-gray-600">${product.description}</p>
             <p class="text-lg font-bold mt-2">${product.price} VND/ngày</p>
           </div>
         `;
       });
     } catch (error) {
       console.error('Error fetching products:', error);
     }
   }
   fetchProducts();