# Mẫu lịch sử — Alexander và Euclid

Bổ sung ngày 2026-11-10. Các báo cáo nền và ART_DIRECTION.md được giữ nguyên.

## Quyết định thiết kế

Dùng chính renderer modular 64×96 hiện có, tỷ lệ khoảng bốn đầu, viền nâu, ánh sáng trên trái và bảng màu hữu hạn. Không gắn tranh AI riêng lên sprite. Mẫu lịch sử chỉ là cấu hình của các lựa chọn dùng chung, có thể chỉnh từng món, hoàn tác, lưu và xuất như nhân vật khác.

- Alexander: tóc hất trán, không râu, giáp lanh ngà, chlamys theo màu vải đã chọn, trâm cài và giáo; bối cảnh Pella có đồi, cây ô liu và kiến trúc thấp.
- Euclid: tóc xoăn, râu học giả, himation theo màu vải đã chọn trên áo lanh ngà, papyrus hình học; bối cảnh Alexandria có hàng cột và thuyền. Mặt sau tờ giấy không hiển thị hình ở mặt trước; góc nghiêng có bề rộng nhỏ hơn.
- Mới: hai kiểu tóc, ba lựa chọn râu (bao gồm không râu), màu tóc vàng mật, hai bộ đồ, trâm cài, ủng, giáo, bộ hình học, compa, hai vai trò, hai nét tính cách và hai địa điểm.
- Giữ schema hồ sơ version 1. Hồ sơ cũ không có trường beard được chuẩn hóa thành none. Nhóm khóa gương mặt bao gồm râu khi ngẫu nhiên.
- Đổi nhãn Đến từ đâu thành Nơi gắn bó để không suy diễn Alexandria là nơi sinh của Euclid. Râu, da, mặt và phối màu đều là lựa chọn tạo hình K3; không phải dữ kiện ngoại hình lịch sử.
- Nguồn cảm hứng: [Princeton, chân dung Alexander](https://artmuseum.princeton.edu/art/collections/objects/55773), [MacTutor, Euclid](https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/). Diện mạo và nơi sinh của Euclid không được biết chắc.

## Tệp dùng lại

- alexander.json, euclid.json: nhập lại qua Bộ sưu tập → Nhập hồ sơ JSON.
- alexander-front-3x.png, euclid-front-3x.png: PNG thật từ nút Tải ảnh PNG của xưởng, 192×288 RGBA trong suốt.
- alexander-prompt.txt, euclid-prompt.txt: prompt mô tả cấu hình; không dùng để tạo ảnh trong lần triển khai này.
- alexander-desktop.jpg, euclid-desktop.jpg, mobile-360.jpg, mobile-390.jpg: ảnh kiểm tra giao diện.

## Đã kiểm tra

- npm test: 8/8 qua; gồm thay đổi raster theo lựa chọn, ba góc khác nhau, silhouette/thang xám, alpha 0/255, palette hợp lệ, không cắt sprite cho cả hai mẫu ở mọi vóc dáng, chiều cao và hai frame idle.
- Chuẩn hóa và round-trip JSON, tương thích hồ sơ cũ, khóa nhóm khi ngẫu nhiên, cấu hình mẫu không bị thay đổi khi sửa bản sao.
- Trình duyệt: chọn hai mẫu, ba tab, ba góc; mẫu Euclid không có mặt ở góc sau; đổi màu vải Alexander sang đất đỏ rồi Hoàn tác trở về ô liu.
- Nút xuất PNG thực tế đã tải được hai ảnh 192×288 RGBA.
- Desktop 1280×960; mobile 360×800 và 390×844. Document rộng lần lượt 345 và 375px sau khi trừ scrollbar; các nút góc nhìn nằm trong khung preview.
- Chưa thực hiện playtest với người dùng, kiểm định khảo cổ từng pixel, hoặc thử mọi tổ hợp bộ phận bằng tay.

## Hoàn thiện collectible / NFT style

Cập nhật theo yêu cầu mới: ba chế độ hoàn thiện Mộc mạc, Vàng hoàng gia và Ngọc ánh kim; hai background Cung điện hoàng hôn và Sân thiên văn đêm. Alexander chọn Vàng hoàng gia, Euclid chọn Ngọc ánh kim. Viền vàng/ngọc, dây đai và tay áo có chi tiết kim loại; nền có vòm, cột, đèn và đốm sáng hình kim cương. Đây là lựa chọn mỹ thuật, không phải tuyên bố phục dựng phục trang nghi lễ lịch sử.

Đồ mặc → Độ hoàn thiện; Nét riêng → Phông nền thẻ. Trường finish/backdrop mặc định classic/local cho hồ sơ cũ; nhóm khóa và random bao gồm các trường mới.

Nút Tải thẻ nhân vật xuất PNG 480×640 với cảnh, sprite, tên và khung. Dùng cùng renderer; crop background theo tỷ lệ thay vì kéo dãn. PNG sprite trong suốt vẫn xuất riêng. Thẻ web có ánh quét và viền sáng khi hover; CSS tôn trọng reduced-motion. Hiệu ứng hover không được bake thành chuyển động trong PNG.

8/8 kiểm thử qua sau cập nhật, gồm thay đổi raster theo chế độ hoàn thiện. Đã xuất và kiểm tra trực quan hai thẻ: alexander-collectible.png, euclid-collectible.png. Không sửa các báo cáo gốc.
