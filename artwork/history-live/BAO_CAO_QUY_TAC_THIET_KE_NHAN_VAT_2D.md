# BÁO CÁO: NGUYÊN TẮC THIẾT KẾ NHÂN VẬT 2D CHO GAME

Ngày biên soạn: 09/11/2026 • Phạm vi: 24 chủ đề theo yêu cầu • Có đề xuất áp dụng cho thư viện nhân vật Ai Cập 350–246 TCN

## A. Mục đích và phương pháp

Thiết kế nhân vật 2D cần đáp ứng đồng thời bốn mục tiêu: người chơi nhận ra nhân vật và hành động; hình ảnh truyền đạt vai trò và tính cách; người vẽ có thể tái tạo đúng qua nhiều góc, tư thế và khung hình; tài sản hoạt động được trong game. Một bản minh họa đẹp khi phóng lớn chưa đủ để chứng minh nhân vật đáp ứng bốn mục tiêu này.

Báo cáo đối chiếu hướng dẫn của nhà phát triển game Valve, bài giảng của Proko, Animation Mentor, các bài hướng dẫn do nghệ sĩ viết trên CLIP STUDIO/Art Rocket, hướng dẫn tiếp cận game và tài liệu Spine. Nguồn chính được dẫn bằng liên kết gần luận điểm; thư mục ở cuối để đọc tiếp. Các nguyên tắc có thể chuyển từ hoạt hình hoặc đồ họa 3D sang thiết kế 2D, nhưng quy định kỹ thuật riêng của một game không tự trở thành tiêu chuẩn chung.

**Cách phân biệt nội dung:** đoạn dẫn nguồn trình bày ý chính từ tài liệu; các bài tập, tiêu chí nghiệm thu, ngưỡng kiểm tra và ví dụ NV dưới đây là **đề xuất thực hành của báo cáo cho dự án**, không phải tiêu chuẩn được các nguồn chứng nhận. Tỷ lệ đầu, số màu, số góc nhìn, số biểu cảm và kích thước sprite là thông số lựa chọn cần kiểm chứng bằng thử nghiệm.

Chưa có thông tin về camera, phong cách và độ phân giải game. Vì vậy, báo cáo dùng phương án khởi đầu là **2D cách điệu vừa phải**, phục trang và dụng cụ dựa trên thư viện lịch sử đã xây dựng. Có hướng điều chỉnh riêng cho pixel art, góc ngang và góc nhìn từ trên. Đây là đề xuất để làm mẫu thử, chưa phải lựa chọn phong cách đã được người dùng chốt.

### Bản đồ các khái niệm dễ nhầm

| Khái niệm | Câu hỏi chính | Khác với |
|---|---|---|
| Silhouette | Chỉ thấy đường bao, có nhận ra người và hướng không? | Shape language nói về cách tổ chức các khối bên trong và bên ngoài |
| Shape language | Các khối lặp lại tạo cảm giác gì? | Shape contrast tạo khác biệt giữa các khối |
| Line of action | Hướng chuyển động/lực chủ đạo chạy ra sao? | Pose là toàn bộ vị trí cơ thể ở một thời điểm |
| Anatomy | Cơ thể cấu tạo và vận động thế nào? | Proportions là quan hệ kích thước giữa các phần |
| Negative space | Khoảng trống quanh và giữa các bộ phận có rõ không? | Silhouette là hình đặc của nhân vật |
| Simplification | Bỏ hoặc gộp chi tiết nào? | Detail hierarchy quyết định phần nào được ưu tiên |
| Design consistency | Một nhân vật có giữ đúng thiết kế qua các bản không? | Style consistency là cả dàn nhân vật dùng chung hệ tạo hình |
| Readability | Người xem có hiểu thông tin cần thiết trong hoàn cảnh chơi không? | Differentiation là phân biệt nhân vật này với nhân vật khác |

## B. Hai nguyên tắc nền tảng

### Nền tảng 01 — Hình bóng / Silhouette

**Nguyên tắc:** đường bao phải giúp nhận ra hình thể lớn, hướng nhìn và động tác quan trọng ở góc camera thật. Valve đặt khả năng nhận diện và hướng của nhân vật vào nhóm yêu cầu silhouette trong hướng dẫn Dota 2. Đây là một tiền lệ sản xuất hữu ích, đặc biệt với nhân vật nhỏ trên màn hình. [Nguồn: Valve](https://help.steampowered.com/en/faqs/view/0688-7692-4D5A-1935).

**Cách áp dụng đề xuất:** vẽ 8–12 hình nhỏ bằng một màu đặc trước khi thêm mặt và vải. Thay đổi chiều rộng vai, độ dài thân/chân, khối tóc/khăn, độ rủ áo và vị trí dụng cụ. Chọn vài thiết kế rồi kiểm ở kích thước chơi thật. Đường bao cần rõ ở các tư thế thiết yếu, không chỉ ở tư thế giới thiệu. Hướng mặt có thể cần mũi, tóc, đầu khăn hoặc bất đối xứng nhẹ để phân biệt trước/sau.

**Lỗi và sửa:** tay dính vào hông → mở khuỷu hoặc đổi góc; dụng cụ chìm sau thân → đổi độ nghiêng; nhiều nhân vật cùng hình trụ → điều chỉnh khối trang phục và tư thế; mép giáo chạm mép mặt → tách khoảng hoặc cho chồng rõ ràng. Không cần mọi bộ phận tách rời trong mọi khung hình: khi ôm đồ hoặc gập người, một số chồng lấp là đúng.

**Kiểm tra/ví dụ:** tô đen NV01 và NV22. Để người khác phân biệt người cuốc ruộng với tư tế bằng động tác, tỷ lệ khối và vật cầm. Thử lại khi bỏ vật cầm để xem dấu nhận diện nào còn lại. Phép thử sau dùng để tìm độ phụ thuộc vào dụng cụ, không yêu cầu mọi nghề được nhận ra khi mất toàn bộ đồ nghề.

### Nền tảng 02 — Ngôn ngữ hình khối / Shape Language

**Nguyên tắc:** tổ chức đầu, thân, chân, tóc và áo bằng một họ hình chính, có biến thể phụ để tạo nhịp. Etherington Brothers đề xuất khảo sát khối chính/phụ và thay đổi kích thước ba phần lớn cơ thể để mở rộng phương án nhân vật. [Nguồn: Art Rocket](https://www.clipstudio.net/how-to-draw/archives/160863).

**Cách áp dụng đề xuất:** phân nhân vật thành đầu–ngực–hông/chân, thử tròn, hộp, nêm và khối thuôn. Hình tròn thường gợi mềm; hộp gợi chắc; đường nhọn gợi căng, nhanh hoặc sắc. Đó là liên tưởng tạo hình phụ thuộc ngữ cảnh, không phải công thức đọc đạo đức hoặc tâm lý. Một người tốt có thể có dáng góc cạnh, một nhân vật nguy hiểm có thể rất tròn.

**Lỗi và sửa:** mỗi bộ phận theo một họ khối không liên hệ → lặp một góc hoặc đường cong chủ đạo; mọi người cùng một khối → thay cách phân bố thể tích; dùng mũi nhọn, da sẫm hay cơ thể đậm làm ký hiệu mặc định cho cái ác → chuyển thông tin tính cách sang thái độ, lựa chọn phục trang và hành vi cụ thể.

**Kiểm tra/ví dụ:** NV10 thợ mộc có thể dùng khối thân vững, cẳng tay gọn; NV16 thư lại dùng khối thân thuôn và nếp vải dài. Đây là hai phương án mỹ thuật, không phải kết luận về hình thể thực tế của hai nghề. Giữ nhiều vóc dáng trong cùng nghề để dàn người có sức sống.

## C. Hai mươi hai quy tắc chuyên đề

### 01 — Tỷ lệ cơ thể / Body Proportions

**Nguyên tắc:** chọn một hệ tỷ lệ có thể đo và tái tạo; biến thể phải có chủ đích. Proko lưu ý tỷ lệ nhìn thấy thay đổi khi cơ thể rời tư thế thẳng và chịu phối cảnh. Vì vậy không dùng lưới đầu ở mặt trước để ép mọi tư thế vào cùng chiều dài trên mặt giấy. [Nguồn: Measuring Techniques](https://www.proko.com/course-lesson/measuring-techniques/).

**Áp dụng đề xuất:** lấy H là chiều cao đầu từ đỉnh sọ đến cằm, không tính khăn/mũ. Có thể thử 6,5–7,5H cho cách điệu gần thực; khoảng 5–6H khi cần mặt/tay lớn hơn; chibi dùng đầu lớn hơn nữa nếu game chọn phong cách đó. Những khoảng này là công cụ thử nghiệm mỹ thuật, không phải số đo dân cư Ai Cập. Ghi chiều cao tổng, vai, hông, đầu gối, khuỷu, bàn tay và bàn chân trên bản chuẩn.

**Lỗi:** chỉ thu nhỏ người lớn để làm trẻ em; tay dài ngắn đổi qua từng hình; mũ làm người vẽ nhầm chiều cao đầu; tất cả phụ nữ cùng dáng, tất cả nam giới cùng vai. **Kiểm:** đặt các góc cùng đường nền, kiểm các mốc; kiểm lại bằng khối 3D tưởng tượng khi xoay.

**Ví dụ:** NV01 và NV16 có thể cùng 7H nhưng khác vai, bụng, chiều dài thân và tư thế. NV33 cần quan hệ đầu–thân và nét tuổi riêng, không chỉ scale NV01 xuống.

### 02 — Giải phẫu / Anatomy

**Nguyên tắc:** hiểu cấu trúc trước khi giản lược. Những phần quyết định chuyển động gồm hộp sọ, lồng ngực, chậu, cột sống, khớp vai, khuỷu, cổ tay, hông, gối và cổ chân. Không cần vẽ toàn bộ cơ lên bề mặt; cần biết khối nào xoay và bộ phận nào nối ở đâu. Proko dùng nghiên cứu tỷ lệ, gesture, giải phẫu và sắc độ làm bước chuẩn bị cho hình người. [Nguồn: Torso Drawing](https://www.proko.com/course-lesson/torso-drawing-part-1-preparing-for-the-drawing-with-studies).

**Áp dụng đề xuất:** dựng người bằng ba khối chính và các khối chi; đánh dấu khớp; xoay chúng trước khi mặc đồ. Khi tay giơ, vai và bả vai tham gia; khi quay thân, chia xoay qua ngực và chậu thay vì bẻ ở một điểm. Dùng ảnh tham khảo thực hiện đúng công việc, đặc biệt khi cầm vật nặng.

**Lỗi:** vai gắn vào cổ; gối uốn ngược; bàn tay giữ vật không có lực kẹp; vải che cấu trúc sai. **Kiểm:** vẽ lớp mannequin dưới áo, kiểm cả tay khuất và chân khuất. Người xem không cần thấy lớp này, nhưng họ sẽ cảm thấy tác động của nó.

**Ví dụ:** NV04 kéo lưới phải có liên hệ vai–ngực–hông; NV10 giữ đục cần ngón và cổ tay tương thích với hướng gõ. Chỉ tô cơ bắp sẽ không giải quyết lực và khớp sai.

### 03 — Đường hành động / Line of Action

**Nguyên tắc:** chọn một dòng chuyển động hoặc thái độ chủ đạo nối các khối, thường biểu diễn bằng đường C, S hoặc đường thẳng có hướng. Đường này là cấu trúc thiết kế, không nhất thiết trùng cột sống. Animation Mentor dùng line of action như một trong các tiêu chí đọc pose. [Nguồn: Building Appealing Character Poses](https://www.animationmentor.com/blog/tutorial-building-appealing-character-poses-for-animation/).

**Áp dụng đề xuất:** viết động từ trước: đẩy, kéo, chờ, cúi, né. Vẽ một đường chính rồi đặt đầu, lồng ngực, chậu và chân đỡ theo dòng lực đó. Tay và dụng cụ có thể tạo đường phụ hỗ trợ. Giữ hướng khớp và thể tích sau khi tăng độ cong.

**Lỗi:** nhiều đường mạnh cạnh tranh; vẽ người xong mới kẻ đường trang trí; đường C quá mức làm gãy lưng; mọi pose đều cong giống nhau. **Kiểm:** bỏ chi tiết, còn ba khối và nét chính; động từ có còn đọc ra không?

**Ví dụ:** NV01 cuốc đất có dòng cúi từ đầu qua thân về chân chống; NV20 kéo tải nghiêng người theo hướng tạo lực; NV22 đứng nghi lễ có thể gần thẳng và điềm tĩnh. Tư thế thẳng có thể là lựa chọn diễn xuất tốt khi có chủ đích.

### 04 — Tư thế và cử chỉ / Pose & Gesture

**Nguyên tắc:** pose cho biết nhân vật đang làm gì; gesture truyền năng lượng và thái độ của hành động. Chọn một ý chính trong mỗi tư thế quan trọng. Hình cơ thể đúng nhưng hành động mơ hồ vẫn chưa đáp ứng thiết kế.

**Áp dụng đề xuất:** tạo nhóm pose gồm đứng nghỉ, đi, làm việc, tương tác và phản ứng đặc trưng. Xác định điểm nhìn, tay chủ động, tay hỗ trợ và chân chịu lực. Khác biệt góc vai/chậu và hai tay giúp tránh đối xứng máy móc; đối xứng vẫn có thể dùng cho kỷ luật, nghi lễ hoặc căng thẳng.

**Lỗi:** mọi người chống nạnh; bàn tay mở giống nhau; ngón tay diễn quá mức khi thao tác chính cần chắc; biểu cảm mặt nói một việc nhưng cơ thể vô tình nói việc khác. **Kiểm:** mô tả pose bằng một câu có động từ và đối tượng, chẳng hạn “đang đưa bình cho khách”. Cho người khác xem khi che mặt để thử ý nghĩa cơ thể.

**Ví dụ đề xuất:** NV18 người bán hàng chìa món hàng và hướng mắt về khách; NV16 ghi chép tập trung vào mặt viết; NV27 nghỉ nhiệm vụ có thể thả lỏng một vai. Nghề không quyết định tất cả tính cách, nên cần một bộ cử chỉ cá nhân ngoài pose nghề.

### 05 — Cân bằng và trọng lượng / Balance & Weight

**Nguyên tắc:** ở tư thế đứng tĩnh không có lực hỗ trợ ngoài, hình chiếu trọng tâm cần nằm trong vùng chân đỡ để có cân bằng bền. Khi ngồi, tựa tay, kéo dây hoặc mang tải, phải xét cả điểm tựa và lực liên quan. Khi chạy/nhảy/ngã, hình chiếu trọng tâm có thể ra ngoài vùng đỡ ở một khung hình. Bài Proko về pose cân bằng lấy trọng tâm làm cơ sở. [Nguồn: Balanced Poses](https://www.proko.com/course-lesson/how-to-draw-balanced-poses).

**Áp dụng đề xuất:** đánh dấu mặt đất, vùng tiếp xúc và hướng lực. Xét cả người và vật đang mang: tải phía trước có thể cần thân ngả sau hoặc chân bước lại. Đầu gối, hông, vai, độ nén và bước chân phải phản ứng với khối lượng.

**Lỗi:** chân không chạm nền; gót cùng nhấc nhưng không có động lượng; vật nặng được nâng như tờ giấy; bóng chân thay cho điểm tiếp xúc đúng. **Kiểm:** xóa bóng, xem nhân vật có còn đứng vững; dựng ba khung chuẩn bị–nâng–giữ để kiểm đường chuyển lực.

**Ví dụ:** NV20 bốc amphora dùng hai tay và đặt tải gần thân khi cần; NV29 trên ngựa cân bằng với chuyển động yên/ngựa, không đứng nổi phía trên lưng.

### 06 — Phóng đại / Exaggeration

**Nguyên tắc:** tăng đặc điểm đang mang thông tin, giữ quan hệ đủ tin được. Bài tập Proko về gestural torso đề xuất so pose với trạng thái trung tính rồi đẩy khác biệt có chọn lọc. [Nguồn: Gestural Torso Boxes](https://www.proko.com/course-lesson/project-gestural-torso-boxes).

**Áp dụng đề xuất:** mỗi mẫu chọn một hoặc hai yếu tố nhấn: bàn tay thao tác, khối khăn, góc cúi, nhịp áo hay dáng đứng. Vẽ ba mức nhẹ–vừa–mạnh và chọn mức thấp nhất còn đọc tốt ở camera. Phóng đại có thể nằm ở gesture và độ tương phản, không nhất thiết tăng kích thước cơ thể.

**Lỗi:** đầu, tay, áo, mắt và đồ nghề đều cùng phóng lớn; vật lớn đến mức không thể dùng; chỉ phóng đại nữ tính/nam tính; bóp méo nét dân tộc thành ký hiệu đạo đức. **Kiểm:** so với bản chuẩn chưa nhấn, chỉ rõ mỗi thay đổi giúp người chơi hiểu điều gì.

**Ví dụ:** tăng nhẹ bề rộng đầu cuốc trong biểu diễn sprite có thể giúp nhận công cụ, nhưng phải ghi đó là cách điệu. Không biến cuốc lao động thành búa chiến khổng lồ nếu dự án giữ độ tin cậy lịch sử.

### 07 — Biểu cảm khuôn mặt / Facial Expressions

**Nguyên tắc:** biểu cảm là phối hợp của ánh mắt, mí, lông mày, má, miệng, hàm và góc đầu. Animation Mentor phân tích biểu cảm dựa trên nhóm cơ và sự phối hợp giữa các vùng thay vì thay riêng miệng. [Nguồn: Facial Expressions and Emotion](https://www.animationmentor.com/blog/tutorial-how-to-animate-facial-expressions-and-emotion/).

**Áp dụng đề xuất:** dựng mặt trung tính trước, rồi thử vui, buồn, giận, sợ, ngạc nhiên, khó chịu và hai trạng thái cá nhân như nghi ngờ/tập trung. Làm mức nhẹ và mạnh cho trạng thái hay dùng. Giữ bề rộng sọ, vị trí mắt, tuổi và đặc trưng cằm qua biến dạng. Bất đối xứng nhẹ có thể diễn tốt nhưng không bắt buộc mọi mặt phải lệch.

**Lỗi:** mọi cảm xúc dùng miệng chữ O; mắt vui nhưng hàm vô tình căng giận; đầu đổi thành nhân vật khác; sprite nhỏ vẫn nhồi đủ răng và nếp nhăn. **Kiểm:** xem mặt ở kích thước sử dụng; nếu không đọc, chuyển tín hiệu sang đầu, vai và thân. Biểu cảm nên được hiểu cùng bối cảnh, không giả định mọi nền văn hóa đọc giống nhau từng sắc thái.

**Ví dụ:** NV16 tập trung có ánh nhìn bám văn bản và miệng ít chuyển động; NV18 thân thiện có thể cười rộng hoặc chỉ nhướn mày, tùy tính cách riêng.

### 08 — Thiết kế trang phục / Costume Design

**Nguyên tắc:** áo phải có cấu tạo, điểm giữ, độ rủ và chức năng. Art Rocket nhấn mạnh nếp gấp phụ thuộc chất liệu và độ nặng; quan sát vải thật quan trọng hơn một công thức nếp gấp duy nhất. [Nguồn: Folds and Drapery](https://www.clipstudio.net/how-to-draw/archives/157926).

**Áp dụng đề xuất:** ghi lớp trong/ngoài, chỗ buộc/ghim, hướng chồng mép, độ dài và điều kiện sử dụng. Đặt nếp lớn ở chỗ treo, kéo, nén; giản lược nếp nhỏ khi xuống sprite. Kiểm động tác giơ tay, bước rộng, ngồi và xoay. Trang phục làm việc, dự lễ và chiến đấu có thể là ba biến thể của cùng người.

**Lỗi:** vải dính như sơn lên da; đai không giữ gì; áo dài xuyên chân; mọi nếp giống nhau; tùy tiện lấy đồ nghi lễ làm đồng phục hằng ngày. **Kiểm:** vẽ cấu tạo áo trải đơn giản và nhìn sau; không chỉ vẽ mặt trước đẹp.

**Ví dụ:** NV01 dùng TP01, NV22 dùng TP13, NV30 dùng TP21/22 + TP07. Số nếp, độ trắng và trang sức có thể khác nhưng chức năng và mã vật liệu vẫn theo thư viện. Màu nhuộm cụ thể chưa được kiểm chứng phải giữ nhãn phục dựng.

### 09 — Phụ kiện và đạo cụ / Props & Accessories

**Nguyên tắc:** mỗi món cần một lý do xuất hiện, cách mang, cách dùng và vị trí khi cất. Đạo cụ có thể truyền nghề hoặc hành động; không bắt buộc một nhân vật phải đeo tất cả tài sản của nghề lên người.

**Áp dụng đề xuất:** chia thành món nhận diện, món phục vụ thao tác và đồ môi trường. Với món cầm, chốt tay thuận, điểm nắm, chiều dài, vùng quét chuyển động và tư thế cất. Với trang sức, chốt cách buộc và vật liệu. Đạo cụ chính cần hình riêng ở các góc thấy được trong game.

**Lỗi:** cán xuyên lòng bàn tay; đồ không có nơi gắn; vòng cổ mắc vào chuyển động; cuốc/giáo đều thành một que; toàn bộ thợ mộc mang cả xưởng. **Kiểm:** dựng ít nhất một động tác lấy–dùng–cất hoặc chuyển tay; bỏ đồ phụ để xem thiết kế có bớt rối không.

**Ví dụ đề xuất:** NV10 chỉ cầm DC28 hoặc DC30/DC31 theo công đoạn, các món khác đặt trong xưởng; NV16 có DC44 và một bề mặt viết hợp lý. TS10 vòng cổ thu nhỏ nghi lễ giữ đúng giới hạn chứng cứ trong thư viện, không dùng làm đồ cá nhân phổ thông.

### 10 — Bảng màu nhân vật / Character Color Palette

**Nguyên tắc:** phân vai cho màu nền, màu phụ và màu nhấn, đồng thời tách sáng tối. Valve khuyến nghị bảng màu có tổ chức và tiết chế vùng bão hòa cao để hỗ trợ tiêu điểm. Đây là lựa chọn phù hợp game của họ, cần thử lại trong bối cảnh 2D này. [Nguồn: Valve, Color and Saturation](https://help.steampowered.com/en/faqs/view/0688-7692-4D5A-1935).

**Áp dụng đề xuất:** bắt đầu với khoảng 3–5 nhóm màu vật liệu rồi mở rộng bằng biến thể sáng/tối. 60–30–10 có thể dùng để thử phân bố diện tích nhưng không là điều kiện bắt buộc. Kiểm trên nền đất, nước, tường sáng, cây và cảnh đêm dự kiến. Màu da là vật liệu tự nhiên của nhân vật, không là mã phe hay tính cách.

**Lỗi:** tất cả màu đều rực; màu nhấn bị rải toàn thân; khác hue nhưng cùng sáng tối khiến hình dính nhau; dùng màu áo làm tín hiệu độc nhất cho đồng đội/địch. Hướng dẫn tiếp cận khuyến nghị bổ sung hình, ký hiệu hoặc mẫu bên cạnh màu. [Nguồn: Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/ensure-no-essential-information-is-conveyed-by-a-fixed-colour-alone/).

**Kiểm/ví dụ:** thử thang xám và mô phỏng thiếu hụt nhận màu, sau đó kiểm trong gameplay. Lanh ngà–gỗ nâu–faience xanh là bảng thử NV02; không phải bảng màu đã chứng minh cho một cá nhân lịch sử.

### 11 — Ánh sáng và bóng / Lighting & Shading

**Nguyên tắc:** tách màu vật liệu khỏi ảnh hưởng ánh sáng; giữ khối đọc được mà không tạo hai hệ chiếu sáng mâu thuẫn. Ánh sáng/bóng có thể làm rõ chiều sâu và hướng nhìn. [Nguồn khái quát: Adobe, Light and Shadow](https://www.adobe.com/creativecloud/photography/hub/guides/understanding-light-and-shadow-photography.html).

**Áp dụng đề xuất cho 2D:** chọn một trong ba phương án: màu phẳng và ánh sáng engine; bóng vẽ sẵn theo quy ước; hoặc phối hợp nhưng có giới hạn rõ. Phân biệt bóng bản thân và bóng đổ lên vật khác. Nếu cel shading, thử một màu nền + một lớp bóng + highlight chọn lọc trước khi tăng số lớp. Bóng tiếp xúc nhỏ giúp chân gắn đất nhưng không sửa được pose sai.

**Lỗi:** mặt sáng trái, áo sáng phải; mỗi món có viền sáng riêng; kim loại và vải cùng bóng nhựa; sprite lật ngang làm nguồn sáng đảo trong khi nền không đảo. **Kiểm:** lật và quay nhân vật theo các hướng camera, chạy qua vùng sáng/tối nếu engine có chiếu sáng.

**Ví dụ:** NV14 có điểm sáng gọn trên kim loại, bóng dịu trên lanh; không dùng vùng sáng chói chiếm hết bàn tay. Nắng gắt sa mạc là ánh sáng cảnh, không cần đóng vĩnh viễn vào mọi sprite.

### 12 — Tương phản hình dạng / Shape Contrast

**Nguyên tắc:** khác biệt có tổ chức giữa lớn/nhỏ, rộng/hẹp, thẳng/cong và dài/ngắn tạo nhịp và giúp mắt phân nhóm. Đây là quan hệ giữa các phần; không chỉ là dùng tam giác cạnh hình tròn.

**Áp dụng đề xuất:** chia khối lớn là thân/áo, khối vừa là đầu/tay/đạo cụ, khối nhỏ là khóa/hạt. Cho một số cạnh thẳng đối thoại với vùng cong, một khối lớn đi cùng cụm nhỏ. Giữ độ tương phản phù hợp phong cách chung. Tương phản có thể nằm trong cùng nhân vật hoặc giữa hai người trong đội.

**Lỗi:** mọi chi tiết cùng kích cỡ; cân hai nửa quá đều; nhọn hóa toàn bộ áo để tạo “cá tính”; thêm khối lạ không liên quan cấu tạo. **Kiểm:** thay nhân vật bằng vài mảng phẳng; nếu các mảng giống nhau về diện tích và nhịp, thử đổi một quan hệ lớn trước.

**Ví dụ đề xuất:** bát tròn của NV09 đối với thân người thuôn và cẳng tay chéo; lưới mềm của NV04 đối với mái chèo thẳng. Không cần gắn vũ khí nhọn lên nghề dân sự để tăng tương phản.

### 13 — Không gian âm / Negative Space

**Nguyên tắc:** khoảng trống giữa cánh tay–thân, hai chân và người–dụng cụ cũng mang thông tin. Có thể sửa sự khó đọc bằng vị trí khoảng trống thay vì thêm đường viền. Animation Mentor đưa việc điều khiển khoảng trống giữa chi vào quá trình làm rõ pose. [Nguồn: Building Appealing Character Poses](https://www.animationmentor.com/blog/tutorial-building-appealing-character-poses-for-animation/).

**Áp dụng đề xuất:** kiểm ít nhất khoảng dưới khuỷu, giữa chân và cạnh dụng cụ chính. Dùng khe rộng/hẹp khác nhau, tránh chuỗi lỗ nhỏ đều nhau gây nhiễu. Khi cần chồng lấp, cho chồng có ý nghĩa thay vì hai mép chỉ vừa chạm nhau. Ở ảnh nhỏ, các khe phải còn xuất hiện sau phép thu nhỏ thực tế.

**Lỗi:** que giáo chạy đúng dọc chân; bàn tay đặt ngay rìa áo; hai chân khít ở pose cần bước; cố mở mọi khe làm người mất tự nhiên. **Kiểm:** nhìn bản đen trên nền sáng rồi đảo nền; quan sát các vùng nền bị khóa giữa chi.

**Ví dụ:** NV01 có thể để cuốc hơi chéo để tạo khoảng rõ với chân; NV23 cần khoảng giữa sistrum và đầu. Vị trí cuối cùng vẫn phải phù hợp cách cầm thật.

### 14 — Đơn giản hóa / Simplification

**Nguyên tắc:** giữ thông tin có giá trị ở mức hiển thị đích, gộp thông tin nhỏ thành mảng. Đơn giản hóa không đồng nghĩa mọi nhân vật ít chi tiết như nhau; chân dung và sprite có nhu cầu khác.

**Áp dụng đề xuất:** lập hai danh sách: dấu hiệu cần giữ và chi tiết có thể gộp. Mái tóc thành vài lọn lớn; nếp lanh thành nhóm kéo/nén; chuỗi hạt thành dải nhịp màu ở sprite nhỏ; họa tiết cần giữ ý nghĩa thì có phiên bản biểu tượng được duyệt. Làm sprite sớm rồi quyết định số chi tiết, thay vì vẽ cực lớn và hy vọng resize giải quyết.

**Lỗi:** xóa cả cấu tạo áo; gộp bàn tay khiến không thấy động tác; nét nhỏ thành muỗi nhiễu; tất cả gỗ chỉ có một màu và mất khác biệt với da. **Kiểm:** lần lượt tắt lớp texture và họa tiết; phần nào biến mất mà nhận diện không đổi có thể là ứng viên giản lược.

**Ví dụ đề xuất:** NV30 giữ dáng búi, đường áo choàng và một cụm trang sức; chi tiết khuyên tai chỉ xuất hiện trong portrait. Không cần vẽ từng sợi lanh ở hình cao 96 pixel.

### 15 — Phân cấp chi tiết / Detail Hierarchy

**Nguyên tắc:** phân bổ độ phức tạp theo thông tin, tạo vùng chú ý và vùng nghỉ. Valve đề xuất cân những cụm nhiều chi tiết bằng các mảng đơn giản, đồng thời đánh giá chi tiết theo kích cỡ trong game. [Nguồn: Valve, Areas of Rest and Detail](https://help.steampowered.com/en/faqs/view/0688-7692-4D5A-1935).

**Áp dụng đề xuất:** quy định cấp một là dáng tổng và hành động; cấp hai là mặt/đồ nghề/khối áo nhận diện; cấp ba là đường may, hạt nhỏ và mòn. Khuôn mặt thường là tiêu điểm khi hội thoại; trong chiến đấu, hướng vũ khí hoặc tín hiệu tấn công có thể ưu tiên cao hơn. Nhân vật không cần sáng nhất ở đầu trong mọi tình huống.

**Lỗi:** mọi nơi cùng sắc nét, cùng nhiều viền và cùng bão hòa; giày phụ hút hơn tay đang hành động; dồn trang trí để biểu thị sang trọng đến mức mất người. **Kiểm:** xem hình thu nhỏ và nheo mắt; ghi thứ tự ba thứ nhìn thấy đầu tiên rồi so với mục tiêu cảnh.

**Ví dụ:** NV16 ưu tiên đầu, tư thế tay và vùng viết; quai dép là cấp ba. NV28 ưu tiên hướng người, giáo/khiên và động tác chiến đấu, hoa văn mũ phụ hơn.

### 16 — Nhất quán trong một thiết kế / Design Consistency

**Nguyên tắc:** các góc nhìn, pose, skin và khung hình phải là cùng một người, cùng cấu tạo đồ. Sự biến dạng để diễn xuất có thể được phép, nhưng cần biết giới hạn và lúc nào trở về bản chuẩn.

**Áp dụng đề xuất:** khóa các đặc trưng nhận dạng: tỷ lệ sọ/mặt, độ rộng vai, dáng tóc, vị trí đai, tay thuận, số lớp áo và cách mang đồ. Ghi bên trái/phải theo cơ thể nhân vật để tránh nhầm với bên ảnh. Tách mẫu chuẩn trung tính khỏi pose diễn xuất. Có bảng lỗi không chấp nhận như dây biến mất hoặc túi tự chuyển bên.

**Lỗi:** mặt trẻ hơn ở góc nghiêng; áo quấn đổi mép; giày đổi thiết kế sau mỗi hình; vật đổi tay vì lật ảnh; hoa văn dịch trên thân. **Kiểm:** chồng các bản ở mốc phù hợp và đối chiếu một bảng thuộc tính cố định.

**Ví dụ đề xuất:** nếu NV18 có túi bên hông trái, turnaround và animation phải ghi túi trái. Với game chỉ dùng sprite lật, cần quyết định trước xem bất đối xứng này có được phép đảo hay cần ảnh riêng.

### 17 — Khả năng đọc thông tin / Character Readability

**Nguyên tắc:** người chơi hiểu được đúng thông tin cần cho tác vụ: ai, ở đâu, quay hướng nào, đang làm gì, có thể tương tác hay có nguy hiểm. Nhận tên từng nhân vật phụ trong đám đông không phải lúc nào cũng cần; nhận nhân vật có nhiệm vụ có thể rất cần.

**Áp dụng đề xuất:** thử trong cảnh với camera, nền, hiệu ứng, giao diện và chuyển động thật. Dùng ba mức: đứng riêng, nhóm nhỏ, đám đông. Kiểm cả idle và hành động. Nếu thông tin cốt yếu chỉ nằm ở một hạt vòng cổ sẽ không bền ở camera xa; chuyển nó sang dáng, vật cầm, chuyển động hoặc ký hiệu giao diện thích hợp.

**Lỗi:** kiểm trên nền trắng duy nhất; chân dung nhận tốt nhưng sprite lẫn nền; vệt hiệu ứng che hướng; các đòn nhìn giống nhau. **Kiểm:** cho người chưa biết thiết kế thực hiện tác vụ ngắn, ghi nhầm lẫn và thời gian; chọn mục tiêu dựa trên gameplay, không gọi một mốc “3 giây” là định luật.

**Ví dụ đề xuất:** cần người chơi tìm thư lại NV16 giữa NV01/NV18/NV22 bằng dáng và hành động. Không yêu cầu họ biết chữ Demotic để xác định nơi nhận nhiệm vụ.

### 18 — Kể chuyện qua ngoại hình / Visual Storytelling

**Nguyên tắc:** dấu hiệu ngoại hình nên có nguyên nhân trong đời sống nhân vật. CLIP STUDIO khuyến khích nối nét riêng như trang sức, dấu vết hoặc phục trang với quá khứ và tính cách. [Nguồn: Introductory Guide to Character Art](https://www.clipstudio.net/en/characterart/beginners-guide/).

**Áp dụng đề xuất:** viết ba dữ kiện cá nhân rồi biến mỗi dữ kiện thành một dấu hiệu quan sát được. Ví dụ người giữ đồ kỹ có áo vá sạch; người làm việc với đất có vết ở tay/gối; người hay đi đường có bao đựng và dép phù hợp. Chọn ít dấu vết có vị trí đúng thay vì phủ bụi ngẫu nhiên toàn thân.

**Lỗi:** dùng sẹo để biểu thị mọi người từng khổ; dùng nghèo đồng nghĩa bẩn; dùng quý tộc đồng nghĩa lạnh lùng; thêm ký hiệu tôn giáo không biết nghĩa. **Kiểm:** hỏi từng chi tiết “do hành động hoặc hoàn cảnh nào tạo ra?”. Một chi tiết không có câu trả lời vẫn có thể dùng để trang trí, nhưng không nên được diễn giải như chứng cứ lịch sử.

**Ví dụ:** NV08 có vùng sợi mắc ở nơi làm việc và đồ nghề giữ tốt; NV19 sở hữu rương/chứng từ, không cần mặc như nữ hoàng. Quyền tài sản không đồng nghĩa cá nhân đó biết đọc.

### 19 — Thiết kế đa góc / Character Turnaround

**Nguyên tắc:** turnaround là bản giải thích cấu trúc qua góc nhìn, giúp tái tạo nhân vật. Nó phục vụ mục tiêu khác với tranh hành động đẹp. Bộ góc cần thiết tùy camera; báo cáo đề xuất bộ chuẩn khởi đầu gồm trước, 3/4, nghiêng và sau.

**Áp dụng đề xuất:** dùng tư thế trung tính dễ đọc, cùng tỷ lệ và đường nền; kẻ mốc sọ/cằm/vai/eo/gối. Giữ hướng ánh sáng mẫu ổn định để khối không đổi vì bóng. Thêm chi tiết buộc/ghim, bàn tay, bàn chân và đạo cụ riêng. Nếu game có bốn hoặc tám hướng, chuẩn sản xuất phải thêm đúng các hướng gameplay, không suy rằng bốn hình giới thiệu đã đủ sprite.

**Lỗi:** góc nghiêng chỉ bóp ngang mặt trước; đầu mỗi góc khác cỡ; không giải thích áo sau; túi/đai tự dịch; foreshortening bị dùng như bản kích thước chuẩn. **Kiểm:** theo đường đi của đai và mép áo quanh thân; mặt cắt tưởng tượng phải nối được.

**Ví dụ đề xuất:** TP07 phải có lộ trình vải từ trước ra sau; NV28 cần bản tay cầm và khiên riêng. Không lật tự động để “hoàn thành” góc đối diện khi thiết kế có bất đối xứng quan trọng.

### 20 — Chất liệu và kết cấu / Material & Texture

**Nguyên tắc:** người xem phân biệt vật liệu qua độ rủ, mép, phản xạ, mức bóng và dấu mòn trước khi cần texture dày. Một vật liệu có thể được thể hiện bằng rất ít mảng nếu các tín hiệu đó đúng.

**Áp dụng đề xuất:** làm bảng thử lanh, len, da, gỗ, gốm, kim loại và faience trên hình đơn giản; sau đó giản lược về độ phân giải game. Lanh dùng nếp có hướng và bề mặt ít bóng; len có thể nặng/mềm hơn tùy loại; gốm thô phản xạ dịu; men faience có điểm sáng chọn lọc; kim loại có thay đổi sáng tối tập trung hơn. Đây là quy ước minh họa vật liệu, cần ảnh thật để chọn từng biến thể.

**Lỗi:** tất cả bóng như nhựa; gỗ có vân ngang bất kể cấu tạo; kim loại đang dùng xanh toàn bộ như hiện vật chôn lâu; mọi đồ đều xước đều. **Kiểm:** bỏ màu, xem còn phân biệt qua khối/bóng; bỏ texture xem cấu tạo có đứng được.

**Ví dụ:** cuốc NV01 sẫm tại cán nắm và bẩn ở đầu làm việc; gương NV30 có mặt đánh bóng, không giống đồng phủ gỉ đào từ mộ.

### 21 — Thống nhất phong cách / Style Consistency

**Nguyên tắc:** toàn bộ dàn dùng một hệ xử lý đường nét, tỷ lệ, bóng, màu và mức giản lược. Thống nhất phong cách không yêu cầu mọi người cùng thân hình hoặc cùng trang phục.

**Áp dụng đề xuất:** làm trang chuẩn phong cách bằng một mẫu đã duyệt và một bảng biến thể sai. Ghi quy tắc đường bao/nét trong, cạnh cứng/mềm, số lớp bóng, xử lý mắt/tay, độ lớn nếp vải, mức texture và mức phóng đại. Chốt cách đổi từ ảnh concept sang sprite. Có thể dùng riêng portrait chi tiết hơn, nhưng cần bảng chuyển đổi từ cùng cấu trúc.

**Lỗi:** một người anime mắt lớn, một người chân thực, một người vector phẳng; có nhân vật viền đen dày và người khác không viền vô cớ; AI mỗi lần sinh một kiểu ánh sáng. **Kiểm:** đặt cả dàn cùng tỷ lệ, cùng nền và ánh sáng; so từng thuộc tính thay vì chỉ nói “cảm giác chưa đồng bộ”.

**Ví dụ đề xuất:** NV01 và NV32 dùng chung nguyên tắc mặt/tay và mức bóng; hoàng gia hơn ở vải, vật liệu và biểu tượng quyền lực, không phải đột nhiên được vẽ siêu thực hơn tất cả NPC.

### 22 — Phân biệt giữa nhân vật / Visual Differentiation

**Nguyên tắc:** độ khác nhau cần phù hợp mức quan trọng trong gameplay. Nhân vật chính hoặc NPC thường gặp cần nhiều tín hiệu bền; đám đông có thể dùng biến thể trong một họ. Không cần mỗi NPC đều có một bộ trang phục dị biệt lịch sử.

**Áp dụng đề xuất:** lập ma trận đầu, thân, tỷ lệ, áo, tư thế, đạo cụ và màu. Mỗi nhân vật quan trọng nên khác những người gần nhất trên ít nhất hai trục đủ rõ trong bản thử. Đây là tiêu chí đề xuất, không là ngưỡng khoa học. Khác màu đơn độc yếu hơn kết hợp dáng, cử chỉ và vật dụng.

**Lỗi:** thay màu một mẫu rồi gọi là nhân vật mới; trang trí quá mức để cố khác; một giới chỉ có một vóc; nhân vật chỉ nhận được khi luôn cầm đồ nghề. **Kiểm:** xếp cả dàn thành lineup, tô đen, chuyển thang xám và thử ghép tên/vai trò. Bỏ phụ kiện chính giúp phát hiện các cặp dễ nhầm.

**Ví dụ:** hai người làm ruộng có thể khác độ dài thân, dáng tóc, cách giữ áo và tuổi; hai cộng đồng có thể dùng trang phục tương tác nhau. Không buộc mọi người Ai Cập giống nhau và mọi người Hy Lạp khác hẳn về mặt sinh học.

## D. Bộ quy tắc khởi đầu đề xuất cho game Ai Cập

Phần này là art direction đề xuất của báo cáo. Các con số dùng để làm mẫu thử trước khi sản xuất hàng loạt; không phải kết quả nghiên cứu về cơ thể hoặc phục trang cổ đại.

### D1. Thông số mỹ thuật và sản xuất cần thử

| Hạng mục | Đề xuất ban đầu | Điều kiện điều chỉnh |
|---|---|---|
| Hình thức | 2D cách điệu vừa; khối rõ, chi tiết lịch sử có chọn lọc | Nếu chọn pixel art, anime hoặc chân thực, thiết kế lại hệ mặt/nét trước |
| Tỷ lệ người lớn | Thử khoảng 6,5–7,5H, đa dạng vai/hông/thân | Thử đầu và tay lớn hơn nếu camera xa |
| Nhận diện | Một khối trang phục/đầu nổi bật, một tín hiệu nghề, một nét riêng | Phải nhận được trong tác vụ game, không chỉ trên sheet |
| Giá trị sáng tối | Bắt đầu với khoảng ba nhóm lớn | Không ép da/tóc thành nhóm mất thông tin hoặc mất tự nhiên |
| Màu | 3–5 họ màu vật liệu, nhấn chọn lọc | Điều chỉnh với nền và cách chiếu sáng |
| Nếp vải | Vài nhóm nếp lớn dựa trên cấu tạo | Chỉ tăng nếp ở portrait hoặc vùng tiêu điểm |
| Nét | Nếu dùng viền: thử viền ngoài mạnh hơn nét trong | Đo độ dày ở ảnh hiển thị, không dựa vào file nguồn lớn |
| Bóng | Thử nền + một lớp bóng, highlight chọn lọc | Chốt engine có chiếu sáng hay dùng bóng vẽ sẵn |
| Trang sức | Vật liệu/địa vị/nghi lễ phù hợp thư viện | Bùa sống và bùa mai táng phải kiểm riêng |
| Biểu cảm | Bản trung tính + nhóm trạng thái dùng trong kịch bản | NPC xa có thể biểu đạt qua thân nhiều hơn mặt |
| Góc | Sheet trước–3/4–nghiêng–sau để giải thích cấu tạo | Thêm đủ hướng camera khi làm sprite |
| Độ mòn | Theo vị trí chạm, nghề và lịch dùng | Không rải bụi/xước đồng đều |

### D2. Điều chỉnh theo camera và kỹ thuật

| Trường hợp | Ưu tiên | Cần tránh/kiểm |
|---|---|---|
| Góc ngang | Đường bao mặt, chân, tay, khoảng giữa người và dụng cụ | Mất tay khuất, lật sai đồ bất đối xứng, đồ dài bị cắt |
| Từ trên xuống | Khối đầu/vai, đồ nghề thấy từ trên, hướng trước/sau | Chi tiết ở bụng không thấy, đầu che hết tay thao tác |
| Góc chéo/isometric | Rút ngắn chi theo camera, footprint chân trên mặt đất | Dùng tỷ lệ mặt trước nguyên xi; sprite như đứng trượt trên nền |
| Portrait hội thoại | Bản sắc mặt, ánh mắt, cấu tạo áo phía trên | Vẽ một người khác với sprite; biểu cảm quá nhỏ khó đọc |
| Pixel art | Cụm pixel có chủ đích, số chi tiết theo kích cỡ đích | Downscale ảnh lớn rồi coi là pixel art; pixel chớp giữa frame |
| Cutout/rig 2D | Tách bộ phận, hình phần khuất, chỗ xoay và thứ tự lớp | Để lỗ hở khi gập khớp; áo che sai tay; mép bị kéo giãn |
| Vẽ từng frame | Model sheet, mốc thể tích, nhịp chuyển động | Đầu/tay co giãn vô cớ; hoa văn trượt; chi tiết nhấp nháy |

Với Spine, skin có thể dùng chung animation bằng hệ attachment, và slot quản lý lớp hiển thị. Vì vậy, nếu chọn công cụ này, nên định nghĩa trước điểm gắn đạo cụ và lớp tay–áo–đồ. Việc mọi skin tương thích vẫn phải được kiểm qua chuyển động thực tế. [Nguồn: Spine Skins](https://us.esotericsoftware.com/spine-skins), [Slots](https://us.esotericsoftware.com/spine-slots).

### D3. Ma trận áp dụng cho sáu mẫu trong thư viện

Mọi lựa chọn hình khối, tỷ lệ và tư thế dưới đây là phương án thiết kế, không phải mô tả hình thể nghề nghiệp trong lịch sử.

| Nhân vật | Khối và pose thử | Trang phục/đạo cụ đúng thư viện | Điểm chú ý | Cách kiểm đặc thù |
|---|---|---|---|---|
| NV01 Nông dân | Thân vừa, chân đỡ rõ, đường cúi làm việc | TP01, TS00/01; DC01 hoặc DC03 | Cách cầm và hướng cuốc | Bỏ texture vẫn đọc thao tác; dụng cụ không chìm vào chân |
| NV09 Thợ gốm | Pose tập trung thấp, cẳng tay ôm khối bình | TP01/05, TS00; DC24/25 | Bàn tay và bình đang làm | Bình–tay tách được, trục xoay đúng cảnh |
| NV16 Thư lại | Thân thuôn, đầu hướng xuống vùng viết | TP02/09; DC44–47 | Mặt, tay, bề mặt ghi | Chân dung và sprite cùng người; cầm bút có mục tiêu |
| NV18 Thương nhân | Khối thân và áo khác NV16, tay giao tiếp | TP02/03 hoặc TP06/07 C–D; DC49/50 | Hàng hóa và động tác trao | Nhận được giữa đám đông, không chỉ nhờ túi tiền |
| NV22 Tư tế | Nhịp đứng điềm tĩnh, mảng lanh sạch | TP13; DC58/59 | Động tác nghi lễ và vải | Không cần trang sức dày vẫn thể hiện bối cảnh đền |
| NV28 Bộ binh | Thân hướng đội hình, hai tay dùng giáo | TP06/17/18 tùy đơn vị; DC70/72/73 | Hướng quân và vũ khí | Pose có thể thực hiện, giáo không chồng thành nhiễu ở đội hình |

### D4. Ví dụ sửa một thiết kế chưa đạt

**Tình trạng giả định:** NV16 và NV18 cùng thân, cùng áo lanh trắng, cùng đứng thẳng; người vẽ chỉ đổi xanh sang đỏ ở dây đai. Ở xa không nhận được nghề, bút và túi tiền quá nhỏ.

**Sửa đề xuất:** trước hết xác định cần người chơi tìm ai. Cho NV16 pose làm việc với đầu cúi và bàn viết/khối tài liệu đọc được; NV18 có động tác đưa hàng, khối áo hoặc chiều rộng thân khác. Giữ màu vật liệu lịch sử và chỉ dùng màu nhấn phụ. Nếu thiếu rõ, bố trí quầy, biển hoặc biểu tượng tương tác phù hợp trong game. Không cần biến áo thư lại thành đồng phục hiện đại để nhận diện.

**Xác minh:** thử lại bằng hình đen, thang xám rồi trong cảnh thật. Nếu người xem nhận đúng nhờ quầy, đó là thành công của thiết kế cảnh; nếu nhân vật cần xuất hiện xa quầy, phải bổ sung tín hiệu trên người. Mỗi phép thử trả lời một câu hỏi riêng.

## E. Quy trình làm một nhân vật từ brief đến bàn giao

### E1. Các bước và cổng duyệt

1. **Chốt nhiệm vụ:** người chơi cần hiểu gì, camera nào, kích thước nào, hành động nào, độ quan trọng trong dàn.
2. **Chọn căn cứ:** mã NV/TP/TS/DC/NG, thời gian A–D, nguồn hiện vật và phần nào là K1/K2/K3.
3. **Khảo sát hình:** khoảng 8–12 thumbnail silhouette, thay tỷ lệ và khối chứ không chỉ thêm phụ kiện.
4. **Chọn phương án:** so vài mẫu bằng tác vụ nhận diện; duyệt dáng trước khi vẽ chi tiết.
5. **Dựng cấu trúc:** mannequin, khớp, trọng tâm, tay cầm và cấu tạo áo.
6. **Thử sáng tối/màu:** ba nhóm lớn trước; kiểm nền thật và tín hiệu màu phụ trợ.
7. **Làm bản chuẩn:** turnaround, mặt, phụ kiện, vật liệu, kích thước tương đối và ghi bên trái/phải.
8. **Thử chuyển động:** các pose gameplay và một vòng animation ngắn nếu cần; sửa chỗ kẹt và xuyên.
9. **Kiểm trong game:** cùng camera, nền, hiệu ứng và giao diện dự kiến; ghi nhầm lẫn cụ thể.
10. **Bàn giao:** file nguồn theo lớp, tài sản xuất đúng quy cách, sheet tham chiếu, nguồn và bảng quyết định đã duyệt.

Không cần khóa toàn bộ dàn trước mẫu thử. Nên thử một nhóm có đủ khó khăn: người lao động lanh sáng, người có áo choàng, người dùng đồ nghề dài và nhân vật có trang sức. Nhóm này sẽ bộc lộ vấn đề về silhouette, vật liệu và kỹ thuật sớm.

### E2. Bộ hồ sơ bàn giao đề xuất

| Hồ sơ | Nội dung |
|---|---|
| Brief 1 trang | Mã, vai trò, tính cách cá nhân, niên đại, camera, nhiệm vụ đọc hình |
| Model sheet | Góc chuẩn, tỷ lệ, mốc, hình phần khuất cần thiết |
| Expression/pose sheet | Trạng thái và hành động thực tế kịch bản cần |
| Costume/prop sheet | Cấu tạo, cách buộc/cầm/cất, mặt trước/sau, biến thể |
| Palette/material sheet | Màu vật liệu, bóng, ví dụ nền và cách tô từng chất |
| File sản xuất | Theo pipeline đã chọn; layer/attachment/frame và tên nhất quán |
| Bảng kiểm | Vấn đề phát hiện, thay đổi, người duyệt, phiên bản |
| Tư liệu | Nguồn, mã hiện vật nếu có, giấy phép ảnh và mức chắc chắn lịch sử |

## F. Bộ kiểm tra chất lượng

### F1. Kiểm bằng nhiều cách nhìn

| Phép thử | Tìm lỗi gì? | Hành động khi không đạt |
|---|---|---|
| Hình đen | Hướng, khối, tay/đồ dính nhau | Sửa khối và pose trước khi tô |
| Thang xám | Mảng sáng tối dính, tiêu điểm sai | Điều chỉnh value, không chỉ đổi hue |
| Kích cỡ thật | Mất mặt/đồ nghề, chi tiết thành nhiễu | Gộp chi tiết hoặc đổi tín hiệu |
| Nhiều nền | Lẫn đất, tường, nước, cây, bóng | Sửa tương phản cục bộ/đồ họa hỗ trợ |
| Đội hình/đám đông | Các mẫu bị lẫn hoặc đồ dài chồng | Sửa trục phân biệt và bố trí chuyển động |
| Bỏ đồ chính | Phụ thuộc vào prop đến đâu? | Thêm tín hiệu chỉ nếu gameplay cần |
| Lật hình và nhiều hướng | Bất đối xứng, ánh sáng, tay thuận sai | Làm biến thể riêng hoặc quy định cách lật |
| Chuỗi hành động | Trượt chân, mất thể tích, đồ xuyên | Sửa thiết kế hoặc animation trước xuất |
| Mô phỏng nhận màu | Tín hiệu chỉ dựa vào màu | Thêm hình/ký hiệu, kiểm người dùng khi có điều kiện |
| Người chưa biết mẫu | Họ có hiểu tác vụ thiết kế không? | Ghi dạng nhầm, thử lại thay vì tranh luận gu |

### F2. Phiếu duyệt 24 chủ đề

Chấm 0 = chưa đạt mục tiêu; 1 = dùng được nhưng còn vấn đề; 2 = đạt trong bài thử đã định. Đây là thang nội bộ đề xuất. Tổng điểm không thay được sửa lỗi nghiêm trọng; một nhân vật không đứng được hoặc gây nhầm phe có thể cần dừng dù tổng cao.

| Chủ đề | Câu hỏi duyệt |
|---|---|
| Silhouette | Hướng và khối quan trọng có rõ ở camera đích? |
| Shape language | Họ khối có chủ đích và hỗ trợ vai trò? |
| 01 Proportions | Các mốc và tỷ lệ giữ được qua góc/pose? |
| 02 Anatomy | Khớp, thể tích và tay cầm hợp lý? |
| 03 Line of action | Dòng lực/ý chính có thống nhất? |
| 04 Pose/Gesture | Động tác và thái độ có đọc đúng? |
| 05 Balance/Weight | Điểm tựa, tải và chuyển lực có tin được? |
| 06 Exaggeration | Phóng đại giúp thông tin mà vẫn hợp phong cách? |
| 07 Expressions | Cảm xúc đọc được và vẫn là cùng người? |
| 08 Costume | Cấu tạo, độ rủ và vận động có giải thích được? |
| 09 Props | Cầm, dùng, cất và vị trí gắn có rõ? |
| 10 Palette | Sáng tối, nền và tín hiệu phụ có hoạt động? |
| 11 Lighting | Bóng và nguồn sáng có theo pipeline? |
| 12 Shape contrast | Có nhịp lớn–vừa–nhỏ và thẳng–cong? |
| 13 Negative space | Khe quan trọng còn rõ, không chạm mép khó đọc? |
| 14 Simplification | Chi tiết hữu ích ở kích cỡ hiển thị? |
| 15 Detail hierarchy | Thứ tự nhìn có theo tác vụ? |
| 16 Design consistency | Chi tiết cố định và bên trái/phải có ổn định? |
| 17 Readability | Người chơi hiểu thông tin trong cảnh thật? |
| 18 Storytelling | Dấu vết ngoại hình có nguyên nhân phù hợp? |
| 19 Turnaround | Các góc nối được thành cấu trúc thống nhất? |
| 20 Materials | Vải, gỗ, da, gốm, kim loại khác nhau rõ? |
| 21 Style consistency | Hòa với hệ tạo hình của cả dàn? |
| 22 Differentiation | Các cặp quan trọng có đủ tín hiệu khác nhau? |

**Cổng sửa bắt buộc đề xuất:** còn lỗi gây hiểu sai hành động hoặc phe; khớp/tay cầm không thể thực hiện; thiếu góc sản xuất cần thiết; nhầm niên đại nghiêm trọng so với brief lịch sử; tài sản xuất không hoạt động trong pipeline. Các mục này cần sửa trực tiếp, không lấy điểm tốt ở trang trí bù lại.

## G. Mẫu brief ngắn dùng với họa sĩ hoặc AI

> Thiết kế nhân vật 2D [mã NV, nghề, tính cách riêng] cho game Ai Cập [năm/vùng], theo trang phục [TP], trang sức [TS], dụng cụ [DC]. Camera [góc], chiều cao hiển thị [pixel], phong cách [mô tả]. Ưu tiên silhouette rõ, tỷ lệ nhất quán, khớp và trọng tâm hợp lý, tư thế thể hiện [hành động]. Chọn họ khối [mô tả], phân cấp khối lớn–vừa–nhỏ, giữ khoảng trống quanh tay và dụng cụ. Bảng màu vật liệu có tổ chức, bóng theo [quy ước], chi tiết đủ đọc ở kích cỡ thật. Trình bày góc trước–3/4–nghiêng–sau, biểu cảm cần dùng và đạo cụ riêng. Giữ cùng người, cấu tạo áo và bên mang phụ kiện ở mọi hình. Ghi rõ chi tiết phục dựng chưa chắc chắn.

Sau khi có kết quả, cần kiểm từng ảnh theo F1/F2. Việc yêu cầu “consistent” trong prompt không bảo đảm model giữ đúng khuôn mặt, dây áo, tay thuận và phụ kiện. Sheet sinh tự động là bản đề xuất cần duyệt trước khi dùng làm mẫu chuẩn.

## H. Thư mục và phạm vi áp dụng nguồn

Tra cứu ngày 09/11/2026. Các bài hướng dẫn là tài liệu nghề nghiệp, không phải bộ quy chuẩn bắt buộc hoặc bằng chứng thực nghiệm cho mọi liên tưởng hình dạng.

1. [Valve — Dota 2 Workshop: Character Art Guide](https://help.steampowered.com/en/faqs/view/0688-7692-4D5A-1935). Nguồn nhà phát triển về silhouette, value, màu, vùng nghỉ và đánh giá trong game. Quy định về phản ứng ánh sáng, màu và camera gắn với Dota 2; không áp nguyên xi vào sprite.
2. [Etherington Brothers — Designing characters with 7 basic shapes](https://www.clipstudio.net/how-to-draw/archives/160863). Phương pháp khám phá khối, tỷ lệ và biến thể; không phải giới hạn rằng nghệ sĩ chỉ được dùng bảy hình.
3. [Proko — Measuring Techniques](https://www.proko.com/course-lesson/measuring-techniques/). Đo quan hệ lớn, hướng và ảnh hưởng của pose/phối cảnh đối với tỷ lệ thấy được.
4. [Proko — Torso Drawing Part 1](https://www.proko.com/course-lesson/torso-drawing-part-1-preparing-for-the-drawing-with-studies). Nghiên cứu cấu trúc, gesture, tỷ lệ và sắc độ trước khi hoàn thiện.
5. [Proko — How to Draw Balanced Poses](https://www.proko.com/course-lesson/how-to-draw-balanced-poses). Trọng tâm và pose cân bằng.
6. [Proko — Project: Gestural Torso Boxes](https://www.proko.com/course-lesson/project-gestural-torso-boxes). Phóng đại có kiểm soát so với trạng thái trung tính.
7. [Animation Mentor — Building Appealing Character Poses](https://www.animationmentor.com/blog/tutorial-building-appealing-character-poses-for-animation/). Ý nghĩa pose, silhouette, line of action, chuyển trọng lượng và không gian âm. Bối cảnh animation 3D nhưng có cách đánh giá pose như hình vẽ.
8. [Animation Mentor — Facial Expressions and Emotion](https://www.animationmentor.com/blog/tutorial-how-to-animate-facial-expressions-and-emotion/). Phối hợp vùng mặt, cấu trúc cơ và sắc thái diễn xuất. Không dùng danh sách cảm xúc như phân loại tâm lý tuyệt đối.
9. [Art Rocket — Essential Tips for Drawing Folds and Drapery](https://www.clipstudio.net/how-to-draw/archives/157926). Điểm kéo, nếp vải, vật liệu và quan sát thực tế.
10. [CLIP STUDIO — Introductory Guide to Character Art](https://www.clipstudio.net/en/characterart/beginners-guide/). Nhận diện, ngoại hình gắn quá khứ và biểu cảm cá nhân.
11. [Game Accessibility Guidelines — Colour alone](https://gameaccessibilityguidelines.com/ensure-no-essential-information-is-conveyed-by-a-fixed-colour-alone/). Bổ sung ký hiệu/hình bên cạnh màu cho thông tin cốt yếu.
12. [Adobe — Principles of Light and Shadow](https://www.adobe.com/creativecloud/photography/hub/guides/understanding-light-and-shadow-photography.html). Tài liệu khái quát nhiếp ảnh về sáng tối, tiêu điểm và chiều sâu; không phải hướng dẫn riêng cho sprite.
13. [Spine — Skins](https://us.esotericsoftware.com/spine-skins), [Spine — Slots](https://us.esotericsoftware.com/spine-slots). Nguồn kỹ thuật chính thức về attachment, thay skin và thứ tự vẽ khi chọn rig 2D này.

Tư liệu nội bộ để áp dụng lịch sử: [Báo cáo Ai Cập 350–246 TCN](BAO_CAO_CON_NGUOI_AI_CAP_350_246_TCN.md) và [Thư viện nhân vật–trang phục–dụng cụ](THU_VIEN_NHAN_VAT_TRANG_PHUC_DUNG_CU.md). Các ví dụ hình thể, màu và pose trong báo cáo thiết kế là đề xuất mỹ thuật; độ chắc chắn lịch sử tiếp tục theo nhãn K1/K2/K3 của thư viện.
