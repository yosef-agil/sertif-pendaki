// assets/script.js

const dataGunung = [
    { id: "merbabu", nama: "Gunung Merbabu", ketinggian: "3.145 mdpl" },
    { id: "sumbing", nama: "Gunung Sumbing", ketinggian: "3.371 mdpl" },
    { id: "sindoro", nama: "Gunung Sindoro", ketinggian: "3.153 mdpl" },
    { id: "prau", nama: "Gunung Prau", ketinggian: "2.565 mdpl" },
    { id: "semeru", nama: "Gunung Semeru", ketinggian: "3.676 mdpl" },
    { id: "bromo", nama: "Gunung Bromo", ketinggian: "2.329 mdpl" },
    // ...tambahkan gunung lainnya
];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("certificate-form");
    const selectGunung = document.getElementById("gunung");
    const canvas = document.getElementById("certificate-canvas");
    const ctx = canvas.getContext("2d");
    const resultSection = document.getElementById("result");
    const downloadBtn = document.getElementById("download-btn");
    const generateBtn = document.getElementById("generate-btn");

    function populateGunungSelect() {
        dataGunung.forEach(gunung => {
            const option = document.createElement("option");
            option.value = gunung.id;
            option.textContent = `${gunung.nama} (${gunung.ketinggian})`;
            selectGunung.appendChild(option);
        });
    }
    populateGunungSelect();

    form.addEventListener("submit", async (e) => { // Menggunakan async
        e.preventDefault();
        
        generateBtn.disabled = true;
        generateBtn.textContent = "🚀 Membuat Sertifikat...";

        const namaPendaki = document.getElementById("nama").value.trim();
        const idGunung = selectGunung.value;
        
        const gunungTerpilih = dataGunung.find(g => g.id === idGunung);
        
        if (!namaPendaki) {
            alert("Nama pendaki tidak boleh kosong!");
            generateBtn.disabled = false;
            generateBtn.textContent = "🌟 Buat Sertifikatnya! 🌟";
            return;
        }

        if (gunungTerpilih) {
            // Tunggu sampai font dimuat jika menggunakan Google Fonts
            // Menggunakan Font Loading API untuk memastikan font siap
            try {
                await document.fonts.load("40px 'Pacifico'"); // Contoh, sesuaikan ukuran dan nama font
                await document.fonts.load("24.5px 'Georgian'");
                await document.fonts.load("24.5px 'Georgian'");
            } catch (err) {
                console.warn("Gagal memuat font, menggunakan fallback:", err);
            }
            
            generateCertificate(namaPendaki, gunungTerpilih);
        } else {
            alert("Silakan pilih gunung terlebih dahulu.");
            generateBtn.disabled = false;
            generateBtn.textContent = "🌟 Buat Sertifikatnya! 🌟";
        }
    });

    async function generateCertificate(nama, gunung) { // Menggunakan async
        const templateImage = new Image();
        templateImage.src = "assets/images/template.png"; 
        
        // Menggunakan Promise untuk menunggu gambar dimuat
        await new Promise((resolve, reject) => {
            templateImage.onload = resolve;
            templateImage.onerror = reject;
        });

        // Hapus apa pun yang sudah ada di canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gambar template ke canvas
        ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

        // --- Mulai Menulis Teks ---
        // Penyesuaian Koordinat untuk template 800x1200 portrait

        // 1. Nama Pendaki
        ctx.font = "40px 'Pacifico', cursive"; // Font yang lebih fun
        ctx.fillStyle = "#344e41"; // Warna hijau gelap dari template
        ctx.textAlign = "center";
        // Koordinat (X, Y) - Sesuaikan ini!
        // X = tengah canvas (800 / 2 = 400)
        // Y = perkiraan posisi baris nama
        ctx.fillText(nama, 400, 430); // Perkiraan: Di bawah "THIS CERTIFICATE AWARDED TO"

        // 2. Deskripsi Gunung (Baris 1: "telah menyelesaikan pendakian gunung")
        ctx.font = "24.5px 'Georgian', serif";
        ctx.fillStyle = "#344e41";
        ctx.textAlign = "center";
        // Koordinat (X, Y) - Sesuaikan ini!
        ctx.fillText(`${gunung.nama}`, 236, 533); // Perkiraan: Di baris setelah nama
        
        // 3. Deskripsi Gunung (Baris 2: "dengan ketinggian")
        ctx.font = "24.5px 'Georgian', serif";
        ctx.fillStyle = "#344e41";
        ctx.fillText(`${gunung.ketinggian}`, 580, 533); // Perkiraan: Di baris setelah nama gunung

        // 4. Baris terakhir: "dengan selamat." (Opsional jika template sudah ada)
        // Jika teks "dengan selamat" sudah ada di template, bagian ini bisa dihilangkan
        // Atau disesuaikan jika ingin menambah info tanggal, dll.
        // ctx.fillText("dengan selamat.", 400, 700); 

        // --- Selesai Menulis Teks ---

        resultSection.style.display = "block";
        const dataURL = canvas.toDataURL("image/png");
        downloadBtn.href = dataURL;
        
        generateBtn.disabled = false;
        generateBtn.textContent = "🌟 Buat Sertifikatnya! 🌟";
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
});