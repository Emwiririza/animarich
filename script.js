// ================= Product Details & Related Products =================
function renderRelatedProducts() {
  if (!window.location.pathname.includes('products-details.html')) return;
  const products = JSON.parse(sessionStorage.getItem('allProducts')) || [];
  const grid = document.getElementById('related-products-grid');
  if (!grid || !products.length) return;
  grid.innerHTML = '';
  // Show up to 4 related products (excluding current)
  const params = new URLSearchParams(window.location.search);
  const currentId = params.get('id');
  const related = products.filter(p => String(p.id) !== String(currentId)).slice(0, 4);
  related.forEach(product => {
    const card = document.createElement('div');
    card.className = 'col-4';
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}">
      <h4 style="cursor:pointer;color:#de005e;" onclick="window.location.href='products-details.html?id=${product.id}&product=${encodeURIComponent(product.name)}'">${product.name}</h4>
      <div class="rating">
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star-o"></i>
      </div>
      <p>$${Number(product.price || 0).toFixed(2)}</p>
      <button onclick="addToCart('${product.name.replace(/'/g, "&#39;")}')">Add To cart</button>
    `;
    grid.appendChild(card);
  });
}

function renderProductDetails() {
  if (!window.location.pathname.includes('products-details.html')) return;
  const productData = sessionStorage.getItem('selectedProduct');
  const detailsContainer = document.getElementById('product-details-container');
  const infoContainer = document.getElementById('product-info');
  if (!productData) {
    if (infoContainer) infoContainer.innerHTML = '<h2 style="color:red;">Product not found.</h2>';
    if (detailsContainer) detailsContainer.innerHTML = '<div style="color:red;">No images available.</div>';
    return;
  }
  const product = JSON.parse(productData);
  const images = product.images || [];
  if (detailsContainer) {
    detailsContainer.innerHTML = '<div id="loading-spinner" style="text-align:center;padding:24px;"><span>Loading...</span></div>';
  }
  setTimeout(function () {
    if (detailsContainer) {
      detailsContainer.innerHTML = '';
      const mainImg = document.createElement('img');
      mainImg.id = 'MainImg';
      mainImg.src = images.length ? images[0] : '';
      mainImg.alt = product.name || '';
      mainImg.style.width = '100%';
      detailsContainer.appendChild(mainImg);
      const thumbnailsRow = document.createElement('div');
      thumbnailsRow.className = 'small-img-row';
      thumbnailsRow.id = 'thumbnails';
      if (images.length) {
        images.forEach(function (img) {
          const thumb = document.createElement('img');
          thumb.src = img;
          thumb.alt = product.name + ' thumbnail';
          thumb.style.width = '48px';
          thumb.style.height = '48px';
          thumb.style.margin = '0 6px 12px 0';
          thumb.style.cursor = 'pointer';
          thumb.onclick = function () { mainImg.src = img; };
          thumbnailsRow.appendChild(thumb);
        });
      } else {
        thumbnailsRow.innerHTML = '<span style="color:#888;">No images available.</span>';
      }
      detailsContainer.appendChild(thumbnailsRow);
    }
    if (infoContainer) {
      infoContainer.innerHTML = '';
      const categoryP = document.createElement('p');
      categoryP.id = 'product-category';
      categoryP.textContent = product.category || '';
      infoContainer.appendChild(categoryP);
      const nameH1 = document.createElement('h1');
      nameH1.id = 'product-name';
      nameH1.textContent = product.name || '';
      infoContainer.appendChild(nameH1);
      const priceH4 = document.createElement('h4');
      priceH4.id = 'product-price';
      priceH4.textContent = product.price ? ('$' + Number(product.price).toFixed(2)) : '';
      infoContainer.appendChild(priceH4);
      if (product.description) {
        const descP = document.createElement('p');
        descP.id = 'product-description';
        descP.textContent = product.description;
        descP.style.margin = '12px 0';
        infoContainer.appendChild(descP);
      }
      const sizesSelect = document.createElement('select');
      sizesSelect.id = 'product-sizes';
      if (product.sizes && product.sizes.length) {
        product.sizes.forEach(function (size) {
          const opt = document.createElement('option');
          opt.value = size; opt.textContent = size; sizesSelect.appendChild(opt);
        });
      } else {
        const opt = document.createElement('option');
        opt.value = ''; opt.textContent = 'One Size'; sizesSelect.appendChild(opt);
      }
      infoContainer.appendChild(sizesSelect);
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number'; quantityInput.id = 'product-quantity';
      quantityInput.value = 1; quantityInput.min = 1; infoContainer.appendChild(quantityInput);
      const addToCartBtn = document.createElement('button');
      addToCartBtn.className = 'button'; addToCartBtn.id = 'add-to-cart-btn';
      addToCartBtn.textContent = 'Add to cart';
      addToCartBtn.onclick = function () {
        if (typeof addToCart === 'function') {
          addToCart(product.name, quantityInput.value, sizesSelect.value);
        }
      };
      infoContainer.appendChild(addToCartBtn);
    }
  }, 300);
}

if (window.location.pathname.includes('products-details.html')) {
  document.addEventListener('DOMContentLoaded', function () {
    renderProductDetails();
    renderRelatedProducts();
  });
}

// ================= Utilities =================
function showToast(message, type = 'info') {
  var toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed'; toast.style.bottom = '32px'; toast.style.right = '32px';
  toast.style.background = type === 'error' ? '#ffdddd' : (type === 'success' ? '#d4edda' : '#e0e0e0');
  toast.style.color = type === 'error' ? '#a94442' : (type === 'success' ? '#155724' : '#333');
  toast.style.padding = '12px 24px'; toast.style.borderRadius = '6px';
  toast.style.zIndex = '9999'; toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  toast.style.fontWeight = 'bold'; document.body.appendChild(toast);
  setTimeout(function () { if (toast) toast.remove(); }, 3000);
}

if (window.location.pathname.includes('products-details.html')) {
  document.addEventListener('DOMContentLoaded', function () {
    var productData = sessionStorage.getItem('selectedProduct');
    if (productData) {
      var product = JSON.parse(productData);
      showToast('Product selected: ' + (product.name || ''), 'success');
    } else {
      showToast('No product selected. Please choose a product from the shop.', 'error');
    }
  });
}

// ================= Cart =================
function addToCart(productName, quantity = 1, size = '') {
  let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  let item = cart.find(i => i.name === productName && i.size === size);
  if (item) {
    showToast('This item has already been added to the cart.', 'error');
    return;
  } else {
    cart.push({ name: productName, quantity: parseInt(quantity, 10), size });
    showToast(quantity + ' x ' + productName + (size ? ' (' + size + ')' : '') + ' added to cart!', 'success');
  }
  sessionStorage.setItem('cart', JSON.stringify(cart));
  const cartCountSpan = document.getElementById('cartCount');
  if (cartCountSpan) {
    let total = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartCountSpan.textContent = total;
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
      cartIcon.classList.add('cart-animate'); setTimeout(() => cartIcon.classList.remove('cart-animate'), 600);
    }
  }
  const cartCountPage = document.getElementById('cartCountPage');
  if (cartCountPage) {
    let total = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartCountPage.textContent = total;
  }
}

// ================= Carousel =================
document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('.carousel');
  const arrowBtns = document.querySelectorAll('.wrapper i');
  const wrapper = document.querySelector('.wrapper');
  if (!carousel || !wrapper) return;
  const firstCard = carousel.querySelector('.card');
  if (!firstCard) return;
  const firstCardWidth = firstCard.offsetWidth;
  let isDragging = false, startX, startScrollLeft, timeoutId;
  const dragStart = (e) => { isDragging = true; carousel.classList.add('dragging'); startX = e.pageX; startScrollLeft = carousel.scrollLeft; };
  const dragging = (e) => {
    if (!isDragging) return; const newScrollLeft = startScrollLeft - (e.pageX - startX);
    if (newScrollLeft <= 0 || newScrollLeft >= carousel.scrollWidth - carousel.offsetWidth) { isDragging = false; return; }
    carousel.scrollLeft = newScrollLeft;
  };
  const dragStop = () => { isDragging = false; carousel.classList.remove('dragging'); };
  const autoPlay = () => { if (window.innerWidth < 800) return; const totalCardWidth = carousel.scrollWidth;
    const maxScrollLeft = totalCardWidth - carousel.offsetWidth; if (carousel.scrollLeft >= maxScrollLeft) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
  };
  carousel.addEventListener('mousedown', dragStart);
  carousel.addEventListener('mousemove', dragging);
  document.addEventListener('mouseup', dragStop);
  wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
  wrapper.addEventListener('mouseleave', autoPlay);
  arrowBtns.forEach(btn => { btn.addEventListener('click', () => { carousel.scrollLeft += btn.id === 'left' ? -firstCardWidth : firstCardWidth; }); });
});

// ================= Single Product quick add =================
document.addEventListener('DOMContentLoaded', function () {
  const addToCartBtn = document.querySelector('.single-product .button');
  const quantityInput = document.querySelector('.single-product input[type="number"]');
  const sizeSelect = document.querySelector('.single-product select');
  const cartCountSpan = document.getElementById('cartCount');
  if (!addToCartBtn) return;
  function updateCartCount() {
    if (cartCountSpan) {
      let count = parseInt(cartCountSpan.textContent, 10) || 0;
      cartCountSpan.textContent = count + parseInt(quantityInput.value, 10);
    }
  }
  addToCartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const productName = document.querySelector('.single-product h1').textContent;
    const size = sizeSelect.value; const quantity = quantityInput.value;
    updateCartCount(); alert(`${quantity} x ${productName} (${size}) added to cart!`);
  });
});

// ================= Cart Page =================
function displayCartContents() {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items'); if (!container) return;
  if (cart.length === 0) { container.innerHTML = '<p>Your cart is empty.</p>'; return; }
  container.innerHTML = '';
  let html = ''; let itemSubtotal = 0;
  html += '<table style="width:100%;border-collapse:collapse;"><tr><th>Image</th><th>Product</th><th>Size</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Remove</th></tr>';
  cart.forEach(item => {
    let imgSrc = ''; let price = 0; let subtotal = 0;
    if (typeof products !== 'undefined') {
      let prod = products.find(p => p.name === item.name);
      if (prod) { if (prod.images && prod.images.length > 0) { imgSrc = prod.images[0]; } price = prod.price || 0; }
    }
    subtotal = price * item.quantity; itemSubtotal += subtotal;
    html += `<tr>
      <td>${imgSrc ? `<img src='${imgSrc}' alt='${item.name}' style='width:48px;height:48px;'>` : ''}</td>
      <td>${item.name}</td>
      <td>${item.size || '-'}</td>
      <td>$${Number(price).toFixed(2)}</td>
      <td><input type='number' min='1' value='${item.quantity}' style='width:48px;text-align:center;' onchange="updateCartQuantity('${item.name.replace(/'/g, "&#39;")}', '${item.size.replace(/'/g, "&#39;")}', this.value)"></td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button onclick="removeFromCart('${item.name.replace(/'/g, "&#39;")}', '${item.size.replace(/'/g, "&#39;")}')">Remove</button></td>
    </tr>`;
  });
  html += '</table>';
  container.innerHTML = html;
  const summaryDiv = document.getElementById('cart-summary');
  if (summaryDiv) {
    const tax = itemSubtotal * 0.07; const finalTotal = itemSubtotal + tax;
    summaryDiv.innerHTML = `<strong>Item Subtotal: $${itemSubtotal.toFixed(2)}<br>Tax: $${tax.toFixed(2)}<br>Final Total: $${finalTotal.toFixed(2)}</strong>`;
  }

  if (typeof window.updateCartQuantity !== 'function') {
    window.updateCartQuantity = function (productName, size, newQuantity) {
      let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      let item = cart.find(i => i.name === productName && i.size === size);
      if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity, 10));
        sessionStorage.setItem('cart', JSON.stringify(cart)); displayCartContents();
        const cartCountSpan = document.getElementById('cartCount');
        if (cartCountSpan) { let total = cart.reduce((sum, i) => sum + i.quantity, 0); cartCountSpan.textContent = total; }
      }
    };
  }
  if (typeof window.removeFromCart !== 'function') {
    window.removeFromCart = function (productName, size = '') {
      if (!confirm('Are you sure you want to remove this item from the cart?')) return;
      let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      let removedItem = cart.find(i => i.name === productName && i.size === size);
      cart = cart.filter(i => !(i.name === productName && i.size === size));
      sessionStorage.setItem('cart', JSON.stringify(cart)); displayCartContents();
      const cartCountSpan = document.getElementById('cartCount');
      if (cartCountSpan) { let total = cart.reduce((sum, i) => sum + i.quantity, 0); cartCountSpan.textContent = total; }
      if (removedItem) {
        let undoDiv = document.createElement('div'); undoDiv.id = 'undo-remove-msg';
        Object.assign(undoDiv.style, { position:'fixed', bottom:'32px', right:'32px', background:'#222', color:'#fff', padding:'12px 24px', borderRadius:'6px', zIndex:'9999', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' });
        undoDiv.innerHTML = `Item removed. <button style='margin-left:12px;background:#e67e22;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;' id='undo-remove-btn'>Undo</button>`;
        document.body.appendChild(undoDiv);
        let undoTimeout = setTimeout(() => { if (undoDiv) undoDiv.remove(); }, 5000);
        document.getElementById('undo-remove-btn').onclick = function () {
          let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
          cart.push(removedItem); sessionStorage.setItem('cart', JSON.stringify(cart)); displayCartContents();
          if (undoDiv) undoDiv.remove(); clearTimeout(undoTimeout);
        };
      }
    };
  }
}

if (window.location.pathname.includes('cart.html')) {
  document.addEventListener('DOMContentLoaded', displayCartContents);
}

// ================= Ratings (clear/toggle) =================
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.rating').forEach(function (ratingDiv) {
    var stars = Array.prototype.slice.call(ratingDiv.querySelectorAll('i'));
    function applyRating(value) {
      stars.forEach(function (s, idx) {
        if (idx < value) { s.classList.remove('fa-star-o'); s.classList.add('fa-star'); }
        else { s.classList.remove('fa-star'); s.classList.add('fa-star-o'); }
      });
      ratingDiv.setAttribute('data-rating', String(value));
    }
    stars.forEach(function (star) {
      star.onclick = function () {
        var value = parseInt(star.getAttribute('data-value'), 10);
        var current = parseInt(ratingDiv.getAttribute('data-rating') || '0', 10);
        if (current === value) { value = 0; }
        applyRating(value);
      };
    });
  });
});

// ================= Newsletter =================
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('newsletterForm'); if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailInput = document.getElementById('newsletterEmail');
    var errorDiv = document.getElementById('newsletterError');
    var successDiv = document.getElementById('newsletterSuccess');
    var email = emailInput.value.trim(); errorDiv.style.display = 'none'; successDiv.style.display = 'none';
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { errorDiv.textContent = 'Please enter a valid email address.'; errorDiv.style.display = 'block'; return; }
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email })
    })
      .then(function (response) {
        if (response.ok) { successDiv.textContent = 'Thank you for subscribing!'; successDiv.style.display = 'block'; emailInput.value = ''; }
        else { throw new Error('Subscription failed. Please try again.'); }
      })
      .catch(function () { errorDiv.textContent = 'Subscription failed. Please try again.'; errorDiv.style.display = 'block'; });
  });
});

// ================= Registration/Login toggle =================
function showForm(formId) {
  document.querySelectorAll('.form-box').forEach(form => form.classList.remove('active'));
  document.getElementById(formId).classList.add('active');
}

// ================= Product Listing (product.html) =================
document.addEventListener('DOMContentLoaded', function () {
  if (!window.location.pathname.includes('product.html')) return;
  // Persist products for other pages
  try {
    if (typeof products !== 'undefined' && Array.isArray(products)) {
      sessionStorage.setItem('allProducts', JSON.stringify(products));
    }
  } catch (e) {}
  // Nav toggles for product.html
  window.showMenu = function () { var el = document.getElementById('navLink'); if (el) el.style.right = '0'; };
  window.hideMenu = function () { var el = document.getElementById('navLink'); if (el) el.style.right = '-200px'; };

  const grid = document.getElementById('product-grid');
  const pager = document.getElementById('pagination');
  const sortSelect = document.getElementById('sortSelect');
  if (!grid) return;
  const PAGE_SIZE = 8; let currentPage = 1; let sortMode = 'default';

  function getAllProducts() {
    try {
      if (typeof products !== 'undefined' && Array.isArray(products)) { return products.slice(); }
      const stored = JSON.parse(sessionStorage.getItem('allProducts') || '[]');
      return Array.isArray(stored) ? stored.slice() : [];
    } catch (e) { return []; }
  }
  function sortProducts(list) {
    if (sortMode === 'price-asc') return list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    if (sortMode === 'price-desc') return list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    return list;
  }
  function renderGrid(page) {
    const all = sortProducts(getAllProducts());
    const start = (page - 1) * PAGE_SIZE; const slice = all.slice(start, start + PAGE_SIZE);
    if (!slice.length) { grid.innerHTML = '<p>No products available.</p>'; return; }
    grid.innerHTML = slice.map(p => {
      const img = Array.isArray(p.images) && p.images.length ? p.images[0] : '';
      const price = (Number(p.price) || 0).toFixed(2);
      const href = 'products-details.html' + (p.id ? ('?id=' + encodeURIComponent(p.id) + '&product=' + encodeURIComponent(p.name)) : ('?product=' + encodeURIComponent(p.name)));
      const safeName = String(p.name || '').replace(/"/g, '&quot;');
      const jsName = String(p.name || '').replace(/'/g, '&#39;');
      return `
        <div class="col-4 product-card" data-name="${safeName}">
          <a href="${href}"><img src="${img}" alt="${safeName}"></a>
          <h4><a href="${href}" style="color:inherit;text-decoration:none;">${safeName}</a></h4>
          <div class="rating">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star-o"></i>
          </div>
          <p>$${price}</p>
          <button onclick="addToCart('${jsName}')">Add To cart</button>
        </div>
      `;
    }).join('');
    grid.querySelectorAll('.product-card a').forEach(aEl => {
      aEl.addEventListener('click', ev => {
        const card = ev.currentTarget.closest('.product-card'); const name = card ? card.getAttribute('data-name') : null;
        if (!name) return; try {
          const all = getAllProducts(); const found = all.find(p => String(p.name) === String(name));
          if (found) sessionStorage.setItem('selectedProduct', JSON.stringify(found));
        } catch (_) {}
      }, true);
    });
  }
  function renderPager() {
    const total = getAllProducts().length; const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (!pager) return; if (pages <= 1) { pager.innerHTML = ''; return; }
    let html = '<span data-nav="prev" style="cursor:pointer;">&laquo;</span>';
    for (let i = 1; i <= pages; i++) {
      const active = i === currentPage ? 'background:#ff523b;color:#fff;border-radius:4px;' : '';
      html += '<span data-page="' + i + '" style="cursor:pointer;' + active + '">' + i + '</span>';
    }
    html += '<span data-nav="next" style="cursor:pointer;">&raquo;</span>';
    pager.innerHTML = html; pager.onclick = function (e) {
      const t = e.target; const pages = Math.max(1, Math.ceil(getAllProducts().length / PAGE_SIZE));
      if (t.dataset.page) { currentPage = parseInt(t.dataset.page, 10) || 1; }
      else if (t.dataset.nav === 'prev') { currentPage = Math.max(1, currentPage - 1); }
      else if (t.dataset.nav === 'next') { currentPage = Math.min(pages, currentPage + 1); }
      else { return; }
      renderGrid(currentPage); renderPager();
    };
  }
  if (sortSelect) sortSelect.addEventListener('change', function () {
    sortMode = this.value || 'default'; currentPage = 1; renderGrid(currentPage); renderPager();
  });
  renderGrid(currentPage); renderPager();
});
