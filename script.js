// Data State Keranjang & Menu Aktif
let cart = [];
let currentSelectedItem = null;
let modalQty = 1;

// Database Sementara Menu
const menuData = {
  p1: { name: "Paket Ayam Sambal Bawang", price: 22000, type: "paket" },
  p2: { name: "Paket Ayam Sambal Matah", price: 23000, type: "paket" },
  p3: { name: "Paket Ayam Mozza Leleh", price: 30000, type: "paket" },
  p4: { name: "Paket Ayam Saus Gulai", price: 24000, type: "paket" },
  a1: { name: "Ayam Sambal Bawang (Satuan)", price: 17000, type: "ayam_only" },
  a2: { name: "Ayam Sambal Matah (Satuan)", price: 18000, type: "ayam_only" },
  a5: { name: "Ayam Mozza Leleh (Satuan)", price: 21000, type: "ayam_only" },
  a6: { name: "Ayam Saus Gulai (Satuan)", price: 19000, type: "ayam_only" },
  a7: { name: "Nasi Putih", price: 4000, type: "none" },
  a3: { name: "Nasi Ijo Jeruk", price: 10000, type: "none" },
  a4: { name: "Indomie Goreng", price: 7000, type: "none" },
  m1: { name: "Teh Manis", price: 5000, type: "minuman" },
  m2: { name: "Teh Tawar", price: 4000, type: "minuman" },
  m3: { name: "Air Putih", price: 3000, type: "none" },
};

// 1. FILTER KATEGORI MENU
function filterMenu(category, element) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  element.classList.add("active");

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// 2. OPEN POP-UP MODAL KUSTOMISASI MENU
function openCustomizeModal(menuId) {
  const item = menuData[menuId];
  if (!item) return;

  currentSelectedItem = { id: menuId, ...item };
  modalQty = 1; // Reset kuantitas ke 1 setiap kali modal dibuka

  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalBasePrice").textContent =
    `Harga Base: Rp ${item.price.toLocaleString("id-ID")}`;

  const qtyEl = document.getElementById("modalQty");
  if (qtyEl) qtyEl.textContent = modalQty;

  // Reset Dropdown Display
  const grpAyam = document.getElementById("grpAyam");
  const grpKarbo = document.getElementById("grpKarbo");
  const grpSuhu = document.getElementById("grpSuhu");
  const grpSambal = document.getElementById("grpSambal");

  if (grpAyam) grpAyam.style.display = "none";
  if (grpKarbo) grpKarbo.style.display = "none";
  if (grpSuhu) grpSuhu.style.display = "none";
  if (grpSambal) grpSambal.style.display = "none";

  // Reset Value Dropdown
  if (document.getElementById("selAyam"))
    document.getElementById("selAyam").value = "0";
  if (document.getElementById("selKarbo"))
    document.getElementById("selKarbo").value = "0";
  if (document.getElementById("selSuhu"))
    document.getElementById("selSuhu").value = "Iced";
  if (document.getElementById("selSambal"))
    document.getElementById("selSambal").value = "Pisah";

  // Show Relevant Group
  if (item.type === "paket") {
    if (grpAyam) grpAyam.style.display = "block";
    if (grpKarbo) grpKarbo.style.display = "block";
    if (grpSambal) grpSambal.style.display = "block";
  } else if (item.type === "ayam_only") {
    if (grpAyam) grpAyam.style.display = "block";
    if (grpSambal) grpSambal.style.display = "block";
  } else if (item.type === "minuman") {
    if (grpSuhu) grpSuhu.style.display = "block";
  }

  calcModalTotal();
  document.getElementById("customizeModal").style.display = "flex";
}

function closeCustomizeModal() {
  document.getElementById("customizeModal").style.display = "none";
}

// 3. FUNGSI PLUS-MINUS DI MODAL
function changeModalQty(delta) {
  if (modalQty + delta >= 1) {
    modalQty += delta;
    const qtyEl = document.getElementById("modalQty");
    if (qtyEl) qtyEl.textContent = modalQty;
    calcModalTotal();
  }
}

// 4. HITUNG HARGA DALAM MODAL (DIKALIKAN MODAL QTY)
function calcModalTotal() {
  if (!currentSelectedItem) return;

  let base = currentSelectedItem.price;
  let selAyam = document.getElementById("selAyam");
  let selKarbo = document.getElementById("selKarbo");

  let addAyam =
    selAyam && selAyam.offsetParent !== null ? parseInt(selAyam.value) || 0 : 0;
  let addKarbo =
    selKarbo && selKarbo.offsetParent !== null
      ? parseInt(selKarbo.value) || 0
      : 0;

  // Hitung total harga dikali kuantitas modal
  let totalPrice = (base + addAyam + addKarbo) * modalQty;

  document.getElementById("modalTotalPrice").textContent =
    `Rp ${totalPrice.toLocaleString("id-ID")}`;
}

// 5. MASUKKAN KE KERANJANG
function addSelectedToCart() {
  if (!currentSelectedItem) return;

  let selAyam = document.getElementById("selAyam");
  let selKarbo = document.getElementById("selKarbo");
  let selSuhu = document.getElementById("selSuhu");
  let selSambal = document.getElementById("selSambal");

  let addAyamVal =
    selAyam && selAyam.offsetParent !== null ? parseInt(selAyam.value) || 0 : 0;
  let addKarboVal =
    selKarbo && selKarbo.offsetParent !== null
      ? parseInt(selKarbo.value) || 0
      : 0;

  let descParts = [];

  if (currentSelectedItem.type === "paket") {
    if (selAyam) {
      let text = selAyam.options[selAyam.selectedIndex].text.split(" (+")[0];
      descParts.push(`Ayam: ${text}`);
    }
    if (selKarbo) {
      let text = selKarbo.options[selKarbo.selectedIndex].text.split(" (+")[0];
      descParts.push(`Karbo: ${text}`);
    }
    if (selSambal) {
      descParts.push(`Sambal: ${selSambal.value}`);
    }
  } else if (currentSelectedItem.type === "ayam_only") {
    if (selAyam) {
      let text = selAyam.options[selAyam.selectedIndex].text.split(" (+")[0];
      descParts.push(`Ayam: ${text}`);
    }
    if (selSambal) {
      descParts.push(`Sambal: ${selSambal.value}`);
    }
  } else if (currentSelectedItem.type === "minuman") {
    if (selSuhu) {
      descParts.push(`Suhu: ${selSuhu.value}`);
    }
  }

  let unitPrice = currentSelectedItem.price + addAyamVal + addKarboVal;

  cart.push({
    name: currentSelectedItem.name,
    desc: descParts.join(" | "),
    price: unitPrice,
    qty: modalQty, // Memasukkan kuantitas yang dipilih dari modal
  });

  updateCartUI();
  closeCustomizeModal();
}

// 6. UPDATE TAMPILAN KERANJANG & BADGE
function updateCartUI() {
  // Hitung total item berdasarkan penjumlahan qty
  let totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartBadge").textContent = totalItemsCount;

  const container = document.getElementById("cartItemsContainer");
  const btnCheckout = document.getElementById("btnGoCheckout");

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-msg">Keranjang belanjaanmu masih kosong.</p>';
    document.getElementById("cartGrandTotal").textContent = "Rp 0";
    if (btnCheckout) btnCheckout.disabled = true;
    return;
  }

  if (btnCheckout) btnCheckout.disabled = false;
  let html = "";
  let grandTotal = 0;

  cart.forEach((item, index) => {
    // DIBETULKAN: Menambahkan perkalian `*`
    let subtotal = item.price * item.qty;
    grandTotal += subtotal;

    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-desc">${item.desc ? item.desc : "-"}</div>
          <div class="cart-item-price">Rp ${subtotal.toLocaleString("id-ID")}</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button type="button" class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
            <span class="qty-number">${item.qty}</span>
            <button type="button" class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
          </div>
          <button type="button" class="btn-remove-item" onclick="removeFromCart(${index})" title="Hapus">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById("cartGrandTotal").textContent =
    `Rp ${grandTotal.toLocaleString("id-ID")}`;
}

// 7. FUNGSI UBAH QTY DI KERANJANG
function updateCartQty(index, delta) {
  if (cart[index].qty + delta > 0) {
    cart[index].qty += delta;
  } else {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// TOGGLE DRAWER KERANJANG
function toggleCartDrawer() {
  document.getElementById("cartDrawer").classList.toggle("open");
}

// 5 & 6. OPEN MODAL CHECKOUT
function openCheckoutModal() {
  toggleCartDrawer();
  document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckoutModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

// 8. VALIDASI FORM CHECKOUT
function validateCheckoutForm() {
  const orderType = document.querySelector('input[name="orderType"]:checked');
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked',
  );
  const btnPay = document.getElementById("btnPayNow");

  if (orderType && paymentMethod) {
    btnPay.disabled = false;
  } else {
    btnPay.disabled = true;
  }
}

// 9. PROSES PEMBAYARAN & MODAL TERIMA KASIH (DIBETULKAN)
function processPayment() {
  const orderType = document.querySelector(
    'input[name="orderType"]:checked',
  ).value;
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked',
  ).value;

  // DIBETULKAN: Mengalikan harga dengan kuantitas pesanan
  let grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // DIBETULKAN: Menghitung total unit barang yang dibeli
  let totalItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  let summaryHtml = `
        <p><strong>Tipe Layanan:</strong> ${orderType}</p>
        <p><strong>Metode Pembayaran:</strong> ${paymentMethod}</p>
        <p><strong>Total Pembayaran:</strong> Rp ${grandTotal.toLocaleString("id-ID")}</p>
        <p><strong>Jumlah Item:</strong> ${totalItemCount} Pesanan</p>
    `;

  document.getElementById("successSummaryBox").innerHTML = summaryHtml;

  closeCheckoutModal();
  document.getElementById("successModal").style.display = "flex";
}

// RESET SEMUA STATE
function resetAllAndClose() {
  cart = [];
  updateCartUI();

  document.getElementById("checkoutForm").reset();
  validateCheckoutForm();

  document.getElementById("successModal").style.display = "none";
}
