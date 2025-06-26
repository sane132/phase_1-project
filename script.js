document.addEventListener("DOMContentLoaded", () => {
    // Mock API URL (replace with your actual API endpoint)
    const API_URL = "http://localhost:3000/products";
    
    // Initialize data
    let products = [];
    let cart = [];
    let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
    let isEditMode = false;
    let currentEditId = null;

    // DOM Elements
    const productList = document.getElementById("product-list");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const cartToggle = document.getElementById("cartToggle");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const closeCart = document.getElementById("closeCart");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const productForm = document.getElementById("productForm");
    const cartCount = document.getElementById("cartCount");
    const totalLikes = document.getElementById("totalLikes");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const categoryCards = document.querySelectorAll('.category-card');

    // Create modal for delete confirmation
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this product?</p>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Initialize the app
    init();

    function init() {
        loadProducts();
        setupEventListeners();
        updateLikesCount();
        
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    async function loadProducts() {
        try {
            // In a real app, you would fetch from your API
            // const response = await fetch(API_URL);
            // products = await response.json();
            
            // For demo purposes, we'll use mock data
            products = [
                {
                    id: 1,
                    name: "Smartphone",
                    price: "$599.99",
                    category: "electronics",
                    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
                },
                {
                    id: 2,
                    name: "T-Shirt",
                    price: "$19.99",
                    category: "clothing",
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
                },
                {
                    id: 3,
                    name: "Novel Book",
                    price: "$9.99",
                    category: "books",
                    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                }
            ];
            
            renderProducts(products);
        } catch (error) {
            console.error("Error loading products:", error);
            showNotification("Failed to load products");
        }
    }

    function renderProducts(data) {
        productList.innerHTML = "";

        data.forEach(product => {
            const isLiked = likedProducts.includes(product.id);
            const card = document.createElement("div");
            card.className = "product";
            card.innerHTML = `
                <div class="admin-actions">
                    <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <p class="category">${product.category}</p>
                <div class="actions">
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${product.id}">
                        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;

            // Add event listeners
            card.querySelector(".add-to-cart").addEventListener("click", () => {
                addToCart(product);
            });

            card.querySelector(".like-btn").addEventListener("click", (e) => {
                toggleLike(product.id, e.currentTarget);
            });

            card.querySelector(".edit-btn").addEventListener("click", () => {
                editProduct(product);
            });

            card.querySelector(".delete-btn").addEventListener("click", () => {
                showDeleteModal(product.id);
            });

            productList.appendChild(card);
        });
    }

    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
            showNotification(`Increased quantity of ${product.name}`);
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
            showNotification(`${product.name} added to cart`);
        }
        
        updateCartUI();
    }

    function updateCartUI() {
        cartItems.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
        } else {
            emptyCartMessage.style.display = "none";
        }

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50'">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">${item.price}</span>
                        <div class="cart-item-controls">
                            <button class="decrease-btn" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" data-index="${index}">❌</button>
                </div>
            `;
            
            li.querySelector(".remove-btn").addEventListener("click", () => {
                cart.splice(index, 1);
                updateCartUI();
                showNotification(`${item.name} removed from cart`);
            });

            li.querySelector(".increase-btn").addEventListener("click", () => {
                cart[index].quantity += 1;
                updateCartUI();
            });

            li.querySelector(".decrease-btn").addEventListener("click", () => {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                    showNotification(`${item.name} removed from cart`);
                }
                updateCartUI();
            });

            cartItems.appendChild(li);
            total += parseFloat(item.price.replace("$", "")) * item.quantity;
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function toggleLike(productId, likeBtn) {
        const index = likedProducts.indexOf(productId);
        
        if (index === -1) {
            likedProducts.push(productId);
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('Added to favorites');
        } else {
            likedProducts.splice(index, 1);
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('Removed from favorites');
        }
        
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        updateLikesCount();
    }

    function updateLikesCount() {
        totalLikes.textContent = likedProducts.length;
    }

    function editProduct(product) {
        isEditMode = true;
        currentEditId = product.id;
        
        document.getElementById('newName').value = product.name;
        document.getElementById('newPrice').value = product.price.replace("$", "");
        document.getElementById('newImage').value = product.image;
        document.getElementById('newCategory').value = product.category;
        
        // Change form button text
        productForm.querySelector('button[type="submit"]').textContent = 'Update Product';
        
        // Scroll to form
        document.getElementById('add-product').scrollIntoView({ behavior: 'smooth' });
    }

    function showDeleteModal(productId) {
        modal.style.display = 'flex';
        currentEditId = productId;
        
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        // Remove previous event listeners
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        
        // Add new event listeners
        modal.querySelector('.confirm-btn').addEventListener('click', async () => {
            try {
                // In a real app, you would call your API
                // await fetch(`${API_URL}/${productId}`, { method: 'DELETE' });
                
                // For demo, we'll just filter it out
                products = products.filter(p => p.id !== productId);
                renderProducts(products);
                
                modal.style.display = 'none';
                showNotification('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Failed to delete product');
            }
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    function setupFormSubmit() {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('newName').value.trim();
            const price = document.getElementById('newPrice').value.trim();
            const image = document.getElementById('newImage').value.trim();
            const category = document.getElementById('newCategory').value;
            
            if (!name || !price || !image || !category) {
                showNotification('Please fill all fields');
                return;
            }
            
            const priceValue = parseFloat(price);
            if (isNaN(priceValue) || priceValue <= 0) {
                showNotification('Please enter a valid price');
                return;
            }
            
            const productData = {
                name,
                price: `$${priceValue.toFixed(2)}`,
                image,
                category
            };
            
            try {
                if (isEditMode) {
                    // Update existing product
                    // In a real app, you would call your API
                    // await fetch(`${API_URL}/${currentEditId}`, {
                    //     method: 'PUT',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(productData)
                    // });
                    
                    // For demo, we'll update the local array
                    const index = products.findIndex(p => p.id === currentEditId);
                    if (index >= 0) {
                        products[index] = { ...products[index], ...productData };
                    }
                    
                    showNotification('Product updated successfully');
                } else {
                    // Add new product
                    // In a real app, you would call your API
                    // const response = await fetch(API_URL, {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(productData)
                    // });
                    // const newProduct = await response.json();
                    
                    // For demo, we'll add to the local array
                    const newId = Math.max(...products.map(p => p.id), 0) + 1;
                    const newProduct = { ...productData, id: newId };
                    products.push(newProduct);
                    
                    showNotification('Product added successfully');
                }
                
                // Reset form and reload products
                productForm.reset();
                isEditMode = false;
                currentEditId = null;
                productForm.querySelector('button[type="submit"]').textContent = 'Submit Product';
                renderProducts(products);
            } catch (error) {
                console.error('Error saving product:', error);
                showNotification('Failed to save product');
            }
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filtered = products.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            const categoryMatch = category ? product.category === category : true;
            return nameMatch && categoryMatch;
        });

        renderProducts(filtered);
    }

    function setupEventListeners() {
        // Search and filter
        searchInput.addEventListener("input", filterProducts);
        categoryFilter.addEventListener("change", filterProducts);

        // Cart controls
        cartToggle.addEventListener("click", () => {
            cartSidebar.style.display = "block";
        });

        closeCart.addEventListener("click", () => {
            cartSidebar.style.display = "none";
        });

        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                showNotification('Checkout completed! Thank you for your purchase.');
                cart = [];
                updateCartUI();
                cartSidebar.style.display = 'none';
            } else {
                showNotification('Your cart is empty');
            }
        });

        // Dark mode toggle
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Category card click events
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                categoryFilter.value = category;
                filterProducts();
            });
        });

        // Form submission
        setupFormSubmit();
    }
});