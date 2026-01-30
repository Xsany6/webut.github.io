// ===== NAVBAR SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== CATEGORY FILTER - DIPERBAIKI =====
const tabBtns = document.querySelectorAll('.tab-btn');
const downloadCards = document.querySelectorAll('.download-card');
const categoryTabs = document.getElementById('categoryTabs');

// Fungsi untuk menampilkan/menyembunyikan kartu berdasarkan kategori
function filterCards(category) {
    downloadCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            // Tampilkan kartu
            card.style.display = 'block';
            // Trigger reflow untuk animasi
            void card.offsetWidth;
            card.classList.remove('hidden');
        } else {
            // Sembunyikan kartu
            card.classList.add('hidden');
            setTimeout(() => {
                if (card.classList.contains('hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Fungsi untuk scroll tombol yang aktif ke tengah (mobile)
function scrollActiveButtonIntoView(button) {
    if (window.innerWidth <= 768 && categoryTabs) {
        const tabsContainer = categoryTabs;
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;
        const containerWidth = tabsContainer.offsetWidth;
        
        // Scroll agar tombol berada di tengah container
        const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
        
        tabsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}

// Event listener untuk tombol kategori
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus kelas active dari semua tombol
        tabBtns.forEach(b => b.classList.remove('active'));
        
        // Tambahkan kelas active ke tombol yang diklik
        btn.classList.add('active');
        
        // Scroll tombol aktif ke tengah (mobile)
        scrollActiveButtonIntoView(btn);
        
        // Dapatkan kategori yang dipilih
        const category = btn.getAttribute('data-category');
        
        // Filter kartu berdasarkan kategori
        filterCards(category);
        
        // Scroll ke section downloads dengan smooth
        const downloadsSection = document.getElementById('downloads');
        if (downloadsSection) {
            const headerOffset = 100;
            const elementPosition = downloadsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== TOUCH/SWIPE SUPPORT UNTUK CATEGORY TABS (MOBILE) =====
if (categoryTabs) {
    let isDown = false;
    let startX;
    let scrollLeft;

    categoryTabs.addEventListener('mousedown', (e) => {
        isDown = true;
        categoryTabs.style.cursor = 'grabbing';
        startX = e.pageX - categoryTabs.offsetLeft;
        scrollLeft = categoryTabs.scrollLeft;
    });

    categoryTabs.addEventListener('mouseleave', () => {
        isDown = false;
        categoryTabs.style.cursor = 'grab';
    });

    categoryTabs.addEventListener('mouseup', () => {
        isDown = false;
        categoryTabs.style.cursor = 'grab';
    });

    categoryTabs.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - categoryTabs.offsetLeft;
        const walk = (x - startX) * 2;
        categoryTabs.scrollLeft = scrollLeft - walk;
    });

    // Touch support untuk mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    categoryTabs.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX - categoryTabs.offsetLeft;
        touchScrollLeft = categoryTabs.scrollLeft;
    }, { passive: true });

    categoryTabs.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - categoryTabs.offsetLeft;
        const walk = (x - touchStartX) * 2;
        categoryTabs.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });
}

// ===== SEARCH FUNCTIONALITY - DIPERBAIKI =====
const searchInput = document.getElementById('searchInput');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    // Clear timeout sebelumnya
    clearTimeout(searchTimeout);
    
    // Set timeout baru untuk debounce
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Reset filter kategori ke "Semua" saat mencari
        if (searchTerm !== '') {
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtns[0].classList.add('active'); // Aktivasi tombol "Semua"
        }
        
        let foundCount = 0;
        
        downloadCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const version = card.querySelector('.version').textContent.toLowerCase();
            
            // Cek apakah search term ada di title, description, atau version
            const isMatch = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          version.includes(searchTerm);
            
            if (isMatch || searchTerm === '') {
                card.style.display = 'block';
                void card.offsetWidth;
                card.classList.remove('hidden');
                foundCount++;
                
                // Highlight text jika ada pencarian
                if (searchTerm !== '') {
                    highlightText(card, searchTerm);
                } else {
                    removeHighlight(card);
                }
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Tampilkan pesan jika tidak ada hasil
        showSearchResult(foundCount, searchTerm);
    }, 300); // Delay 300ms untuk debounce
});

// Fungsi untuk highlight teks pencarian
function highlightText(card, searchTerm) {
    // Implementasi sederhana tanpa mengubah HTML
    // Bisa diperluas dengan mark.js library jika diinginkan
}

// Fungsi untuk menghapus highlight
function removeHighlight(card) {
    // Reset highlight
}

// Fungsi untuk menampilkan hasil pencarian
function showSearchResult(count, term) {
    // Hapus pesan sebelumnya jika ada
    const existingMsg = document.querySelector('.search-result-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    if (term !== '' && count === 0) {
        const downloadGrid = document.getElementById('downloadGrid');
        const message = document.createElement('div');
        message.className = 'search-result-message';
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: var(--text-light);
            font-size: 1.1rem;
        `;
        message.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <p>Tidak ditemukan hasil untuk "<strong>${term}</strong>"</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Coba kata kunci lain atau pilih kategori di atas</p>
        `;
        downloadGrid.appendChild(message);
    }
}

// Clear search saat menekan Escape
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
});

// ===== DOWNLOAD FUNCTION =====
function downloadFile(filename) {
    // Ambil tombol yang diklik
    const btn = event.target.closest('.download-btn');
    const originalText = btn.innerHTML;
    
    // Disable tombol dan tampilkan loading
    btn.innerHTML = '<span>⏳</span> Mengunduh...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // Simulasi download
    setTimeout(() => {
        btn.innerHTML = '<span>✅</span> Berhasil!';
        btn.style.opacity = '1';
        
        // Reset tombol setelah 2 detik
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
        
        // Tampilkan notifikasi download
        showDownloadNotification(filename);
        
        // Di production, trigger actual download
        console.log(`Download started: ${filename}`);
    }, 1500);
}

// Fungsi untuk menampilkan notifikasi download
function showDownloadNotification(filename) {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.5rem;">✅</span>
            <div>
                <strong>Download Dimulai!</strong>
                <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">${filename}</p>
            </div>
        </div>
    `;
    
    // Tambahkan CSS untuk animasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Tambahkan notifikasi ke body
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== LAZY LOADING UNTUK GAMBAR (jika ada) =====
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K untuk focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Ctrl/Cmd + 1-7 untuk kategori
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (tabBtns[index]) {
            tabBtns[index].click();
        }
    }
});

// ===== PERFORMANCE: Debounce Scroll Event =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll handling sudah ada di atas
    });
}, { passive: true });

// ===== INITIALIZE =====
console.log('IT-Vub Download Center loaded successfully! 🚀');
console.log('Keyboard shortcuts:');
console.log('- Ctrl/Cmd + K: Focus search');
console.log('- Ctrl/Cmd + 1-7: Quick category filter');
console.log('- ESC: Clear search');