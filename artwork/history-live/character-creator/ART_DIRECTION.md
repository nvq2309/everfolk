# Bên dòng Nile — quyết định hình ảnh cho bản dựng 1

## Nguồn bất biến

Ba báo cáo ở thư mục cha chỉ được đọc. Quyết định triển khai ở đây bổ sung cho
báo cáo, không chỉnh lại báo cáo. Hình lịch sử là cảm hứng; cơ thể khoảng 4 đầu,
đồ mặc phối màu và khuôn mặt pixel là cách điệu cho game dành cho người trẻ.

## Hướng đã chọn

Ấm áp, dễ thương, hơi hoài cổ. Người dùng đã xác nhận hướng này trong chat.
Giấy ngà, nét nâu, nút chọn xanh ô liu, phong cảnh sông nhẹ và nhân vật nổi bật.
Tham chiếu UI của người dùng: các ô lựa chọn, mã số nhóm, viền kép và bóng cứng.
Không dùng font pixel bé cho cả đoạn tiếng Việt; ưu tiên chữ có dấu dễ đọc.

## Áp dụng các skill được chỉ định

- [character-design](https://github.com/claude-dev-suite/claude-dev-suite/blob/main/skills/gamedev/2d-art/character-design/SKILL.md): hình bóng trước chi tiết, khe tay–thân, bộ phận gọn, 3 góc được dựng riêng. Không coi bảng kích cỡ ví dụ hoặc các liên tưởng tính cách là định luật.
- [game-art-director](https://github.com/roohe/agentic-super-skills/blob/master/skills_library/game-art-director/SKILL.md): tài liệu hướng hình ảnh này, lý do từng lựa chọn, giới hạn tài sản, QA theo tiêu chí. Không thay đổi các báo cáo đã khóa. Các file docs/collaboration-protocol.md, docs/game-design-theory.md và templates/art-bible.md không hiện diện ở đường dẫn tương đối trong kho skill khi tra cứu; dùng báo cáo dự án làm khung thay thế. Không có đoàn artist hoặc pipeline 3D trong bản dựng.
- [color-and-palettes](https://github.com/ProkStudio/skills/blob/main/skills/game/2d/color-and-palettes/SKILL.md): ramp theo vật liệu, nền dịu và màu nhấn chọn lọc, bóng khác hue với sáng, xuất strip PNG và HEX. Bảng màu là tập hữu hạn các màu đã định nghĩa, không sinh màu tùy ý. Có ramp da riêng để các tông da đều rõ. Mỗi ảnh có bộ màu riêng lấy từ raster thực tế.
- [scenario-refine-loop](https://github.com/scenario-labs/skills/blob/main/skills/scenario-refine-loop/SKILL.md): rubric trước duyệt, ghi pass/fail, sửa đúng lỗi, tối đa 3 vòng; giữ state gốc khi sửa renderer. Không có Scenario MCP/model/analyzer trong phiên. Thay bằng renderer Canvas xác định, kiểm pixel và quan sát trình duyệt; không tuyên bố đã dùng Scenario API hoặc đã được con người playtest.

## Thông số và chất liệu

- Sprite raster gốc 64×96, nền trong suốt; PNG 3× dùng nearest-neighbor 192×288.
- Góc trước, nghiêng, sau. Không hứa 3/4 hoặc sprite sheet 8 hướng.
- Nét biên #29252a; bóng dưới vật liệu chung #493d34; ánh sáng ấm trên trái.
- Vải lanh: #958467 → #d8c8a0 → #f4e8c6. Da nâu đồng: #734538 → #a86b46 → #d49665.
- Faience: #38665e → #6caaa0 → #b0d3bb. Vàng: #8b5d35 → #d6aa52 → #f1d889.
- Gốm: #80463d → #b3694c → #d99166. Gỗ: #493d34 → #9b7852 → #c7a66c.
- Khối tóc lớn, ít nếp vải, một vật cầm chính, khe giữa hai chân và khuỷu với áo.
- Giới thể hiện qua vài nét mặt nhẹ; không tự ép trang phục hay nghề theo giới.
- Nơi sinh không tự thay đổi da/diện mạo. Màu da không mang chỉ số sức mạnh/tính cách.
- Chuyển động chỉ là idle 2 trạng thái nhẹ; chưa phải walk cycle sản xuất.
- Phong cảnh phục vụ kiểm nhìn; không phải di tích cụ thể được tái dựng chính xác.

## Rubric dùng cho duyệt bản dựng

1. Có đủ 3 bước: ngoại hình, trang phục, nét nhận diện; nhân vật hiển thị bên cạnh trên desktop.
2. Chọn thân, da, tóc, mặt, áo, trang sức và đồ nghề đều đổi hình thật; chọn tên/đặc điểm đổi thẻ nhận diện và prompt.
3. Raster 64×96; primitive pixel nguyên; alpha ảnh gốc chỉ 0 hoặc 255; màu thuộc tập hữu hạn.
4. Đầu/thân/tay/chân và đồ chính không bị cắt; khe chân/tay đọc được trong góc trước.
5. 3 góc có thay đổi cấu tạo; góc sau không còn mắt/mũi/miệng.
6. Các mục giữ lại không đổi khi random; undo đưa về trạng thái trước.
7. Save/load, JSON import/export, PNG và bảng màu thực sự hoạt động; lỗi import không xóa state cũ.
8. Điều khiển có label/trạng thái, phím Tab/arrow/ESC; responsive không tràn ngang.
9. Giảm chuyển động được tôn trọng; không cần gửi cấu hình nhân vật ra máy chủ.
10. Ba báo cáo gốc giữ nguyên hash và thuộc tính chỉ đọc.

## Giới hạn công bố

Đây là bộ tạo nhân vật modular chạy cục bộ, không phải model AI vẽ tùy ý.
Prompt có thể sao chép để dùng với AI khác; không có nút giả gọi AI.
Lưu trên localStorage của trình duyệt này; xuất JSON để chuyển máy hoặc giữ lâu.
Không có backend tài khoản, cloud sync, combat, sprite walk hoặc kiểm chứng khảo cổ từng pixel.
