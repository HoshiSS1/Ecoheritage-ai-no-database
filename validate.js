/**
 * 🔍 EcoHeritage AI - Hệ thống Kiểm tra & Chẩn đoán Tự động (Diagnostics Utility)
 * 
 * Script này quét toàn bộ dự án để phát hiện:
 * 1. Lỗi cú pháp JavaScript trong các tệp tin lõi.
 * 2. Lỗi trùng lặp ID trong các trang HTML (dễ làm loạn logic điều khiển jQuery).
 * 3. Lỗi liên kết tài nguyên cục bộ bị gãy (Broken references cho CSS, JS, Images).
 * 4. Lỗi thiếu tệp tin hình ảnh dược liệu/bản đồ đã khai báo trong cơ sở dữ liệu data.js.
 * 
 * Cách chạy:
 *   node validate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_DIR = __dirname;

// Màu sắc đầu ra trên console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function logHeader(title) {
    console.log(`\n${colors.bold}${colors.cyan}=== ${title} ===${colors.reset}`);
}

function runDiagnostics() {
    console.log(`${colors.bold}🍀 BẮT ĐẦU KIỂM TRA TOÀN DIỆN HỆ THỐNG ECOHERITAGE AI v7.5...${colors.reset}\n`);
    let totalErrors = 0;
    let totalWarnings = 0;

    // ─── 1. KIỂM TRA CÚ PHÁP JAVASCRIPT LÕI ───────────────────
    logHeader('1. KIỂM TRA CÚ PHÁP JAVASCRIPT');
    const jsFiles = ['config.js', 'data.js', 'script.js', 'api/chat.js'];
    jsFiles.forEach(file => {
        const filePath = path.join(WORKSPACE_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.log(`${colors.red}❌ Lỗi: Không tìm thấy tệp ${file}${colors.reset}`);
            totalErrors++;
            return;
        }
        try {
            execSync(`node --check "${filePath}"`);
            console.log(`${colors.green}✅ ${file}: Cú pháp chính xác.${colors.reset}`);
        } catch (e) {
            console.log(`${colors.red}❌ Lỗi cú pháp trong ${file}:${colors.reset}`);
            console.log(e.stderr ? e.stderr.toString() : e.message);
            totalErrors++;
        }
    });

    // ─── 2. QUÉT TRÙNG LẶP ID VÀ LIÊN KẾT GÃY TRONG CÁC FILE HTML ────────
    logHeader('2. KIỂM TRA CÁC FILE GIAO DIỆN HTML');
    const htmlFiles = fs.readdirSync(WORKSPACE_DIR).filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        const filePath = path.join(WORKSPACE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log(`\n📄 Phân tích: ${colors.bold}${file}${colors.reset}`);

        // A. Kiểm tra trùng lặp ID
        const idRegex = /(?:^|\s)id=["']([^"']+)["']/g;
        const ids = [];
        let match;
        while ((match = idRegex.exec(content)) !== null) {
            ids.push(match[1]);
        }

        const idCounts = {};
        ids.forEach(id => { idCounts[id] = (idCounts[id] || 0) + 1; });

        const duplicates = Object.keys(idCounts).filter(id => idCounts[id] > 1);
        if (duplicates.length > 0) {
            console.log(`  ${colors.red}❌ Lỗi: Trùng lặp ID trong thẻ HTML (gây xung đột jQuery):${colors.reset}`);
            duplicates.forEach(id => {
                console.log(`    - ID "${id}" xuất hiện ${idCounts[id]} lần.`);
                totalErrors++;
            });
        } else {
            console.log(`  ${colors.green}✅ Không có ID trùng lặp.${colors.reset}`);
        }

        // B. Kiểm tra link/src gãy
        const srcRegex = /(?:^|\s)src=["']([^"']+)["']/g;
        const hrefRegex = /(?:^|\s)href=["']([^"']+)["']/g;
        const links = [];

        while ((match = srcRegex.exec(content)) !== null) {
            links.push({ attr: 'src', val: match[1] });
        }
        while ((match = hrefRegex.exec(content)) !== null) {
            links.push({ attr: 'href', val: match[1] });
        }

        let brokenCount = 0;
        links.forEach(link => {
            const val = link.val;
            if (
                val.startsWith('http://') || 
                val.startsWith('https://') || 
                val.startsWith('mailto:') || 
                val.startsWith('tel:') || 
                val.startsWith('#') || 
                val.startsWith('data:') ||
                val.startsWith('javascript:') ||
                !val.trim()
            ) {
                return;
            }

            const cleanPath = val.split('?')[0].split('#')[0];
            const resolvedPath = path.join(WORKSPACE_DIR, cleanPath);

            if (!fs.existsSync(resolvedPath)) {
                console.log(`  ${colors.red}❌ Lỗi: Liên kết gãy ${link.attr}="${val}" (Không tìm thấy: ${cleanPath})${colors.reset}`);
                brokenCount++;
                totalErrors++;
            }
        });

        if (brokenCount === 0) {
            console.log(`  ${colors.green}✅ Tất cả liên kết tài nguyên cục bộ đều chính xác.${colors.reset}`);
        }
    });

    // ─── 3. QUÉT TOÀN BỘ ẢNH TRONG CSDL DATA.JS ────────────────
    logHeader('3. KIỂM TRA HÌNH ẢNH DỮ LIỆU TRONG data.js');
    const dataJsPath = path.join(WORKSPACE_DIR, 'data.js');
    if (fs.existsSync(dataJsPath)) {
        try {
            let dataContent = fs.readFileSync(dataJsPath, 'utf-8');
            dataContent = dataContent.replace('const EcoHeritageDefaultData =', 'module.exports =');
            
            const tempFile = path.join(WORKSPACE_DIR, 'temp_validate_data.js');
            fs.writeFileSync(tempFile, dataContent);
            const data = require(tempFile);
            fs.unlinkSync(tempFile);

            console.log(`${colors.cyan}A. Kiểm tra ảnh vùng di sản (Regions):${colors.reset}`);
            data.regions.forEach(reg => {
                if (reg.image) {
                    const cleanPath = reg.image.replace(/^\.\//, '');
                    const imgPath = path.join(WORKSPACE_DIR, cleanPath);
                    if (!fs.existsSync(imgPath)) {
                        console.log(`  ${colors.red}❌ Thiếu ảnh vùng "${reg.name}": ${reg.image}${colors.reset}`);
                        totalErrors++;
                    } else {
                        console.log(`  ✅ Vùng "${reg.name}": OK.`);
                    }
                } else {
                    console.log(`  ${colors.yellow}⚠️ Cảnh báo: Vùng "${reg.name}" không cấu hình ảnh.${colors.reset}`);
                    totalWarnings++;
                }
            });

            console.log(`\n${colors.cyan}B. Kiểm tra ảnh bài thuốc cổ phương (Herbs):${colors.reset}`);
            data.herbs.forEach(herb => {
                if (herb.image) {
                    if (herb.image.startsWith('data:')) {
                        console.log(`  ✅ Bài thuốc "${herb.name}": OK (Ảnh Base64).`);
                        return;
                    }
                    const cleanPath = herb.image.replace(/^\.\//, '');
                    const imgPath = path.join(WORKSPACE_DIR, cleanPath);
                    if (!fs.existsSync(imgPath)) {
                        console.log(`  ${colors.red}❌ Thiếu ảnh bài thuốc "${herb.name}": ${herb.image}${colors.reset}`);
                        totalErrors++;
                    } else {
                        console.log(`  ✅ Bài thuốc "${herb.name}": OK.`);
                    }
                } else {
                    console.log(`  ${colors.yellow}⚠️ Cảnh báo: Bài thuốc "${herb.name}" không cấu hình ảnh.${colors.reset}`);
                    totalWarnings++;
                }
            });

        } catch (err) {
            console.log(`${colors.red}❌ Không thể phân tích data.js: ${err.message}${colors.reset}`);
            totalErrors++;
        }
    }

    // ─── 4. TỔNG KẾT BÁO CÁO ─────────────────────────────────
    console.log(`\n${colors.bold}=======================================${colors.reset}`);
    console.log(`${colors.bold}📊 TỔNG KẾT BÁO CÁO CHẨN ĐOÁN:${colors.reset}`);
    console.log(`  - Lỗi nghiêm trọng (Errors): ${totalErrors > 0 ? colors.red : colors.green}${totalErrors}${colors.reset}`);
    console.log(`  - Cảnh báo (Warnings):      ${totalWarnings > 0 ? colors.yellow : colors.green}${totalWarnings}${colors.reset}`);
    console.log(`${colors.bold}=======================================${colors.reset}`);

    if (totalErrors === 0) {
        console.log(`\n🎉 ${colors.bold}${colors.green}HỆ THỐNG HOÀN TOÀN SẠCH LỖI! DỰ ÁN SẴN SÀNG HOẠT ĐỘNG CHUẨN 100%.${colors.reset}\n`);
    } else {
        console.log(`\n⚠️ ${colors.bold}${colors.red}VUI LÒNG SỬA CÁC LỖI TRÊN TRƯỚC KHI DEPLOY DỰ ÁN.${colors.reset}\n`);
    }
}

runDiagnostics();
