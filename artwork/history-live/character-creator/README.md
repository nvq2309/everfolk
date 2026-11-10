# Bên dòng Nile — xưởng tạo nhân vật pixel art

Chuẩn cho các sản phẩm tiếp theo: đọc
[Báo cáo chuẩn design Bên dòng Nile](../BAO_CAO_CHUAN_DESIGN_BEN_DONG_NILE.md)
trước khi làm UI hoặc asset mới. Báo cáo này và ART_DIRECTION.md là chỉ đọc;
chỉ sửa khi người dùng yêu cầu rõ.

Mở PowerShell tại thư mục này và chạy `npm start`, sau đó mở
http://127.0.0.1:4173 . Không cần cài dependency.

## Có thể làm gì

- 3 bước: diện mạo, đồ mặc, nét riêng; khung nhân vật cập nhật ngay.
- 6 vai trò gợi ý dựa trên thư viện, vẫn chỉnh được từng món.
- Chọn cơ thể, chiều cao, 7 tông da, mặt, tóc, mắt/mày/mũi, biểu cảm, dấu riêng.
- Áo, màu vải, trang sức, dép và một dụng cụ; màu da không quyết định nghề.
- Xem trước/nghiêng/sau, hình bóng, thang xám và tắt chuyển động.
- Giữ nhóm khi ngẫu nhiên, hoàn tác, quay về mẫu đầu.
- Đặt tên, nơi sinh, tính cách và câu chuyện; prompt cập nhật theo lựa chọn.
- Lưu tối đa 30 mẫu trong trình duyệt, mở/xóa từng mẫu, nhập/xuất JSON.
- Tải PNG trong suốt 192×288, sheet 3 góc 576×288, palette strip 1px/màu và HEX.

Canvas vẽ trực tiếp từng pixel từ cấu hình, không dùng API sinh ảnh hoặc khóa dịch vụ.
Màu/font UI có thể tải Be Vietnam Pro từ Google Fonts; có font hệ thống dự phòng.
State chỉ lưu trong localStorage, không gửi tới server. Khi đổi trình duyệt/port,
bộ sưu tập không tự đi theo; dùng xuất/nhập JSON để chuyển.

Kiểm tra logic bằng `npm test`. Các quyết định mỹ thuật ở ART_DIRECTION.md;
kết quả đánh giá được ghi trong QA.md sau khi kiểm bản dựng.

Không sửa ba báo cáo nền tại thư mục cha nếu người dùng chưa yêu cầu rõ.
