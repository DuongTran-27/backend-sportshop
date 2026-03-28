const Utils = {
    StringToSlug(str) {
        return str
            .toLowerCase()
            .normalize("NFD") // tách dấu khỏi chữ
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/đ/g, "d") // xử lý riêng chữ đ
            .replace(/[^a-z0-9\s-]/g, "") // xóa ký tự đặc biệt
            .trim() // xóa khoảng trắng đầu/cuối
            .replace(/\s+/g, "-") // space -> -
            .replace(/-+/g, "-"); // tránh -- nhiều lần
    },
    generateOrderCode(length = 6) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }

        return result;
    }
}

module.exports = Utils;