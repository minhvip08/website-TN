# Frontend – Danh sách nội dung cần sửa


## `frontend/.env`
- `VITE_SUPABASE_URL` → URL project Supabase của bạn
- `VITE_SUPABASE_PUBLISHABLE_KEY` → anon key của bạn


## `frontend/src/supabase.js`
- Dòng 3-4: xoá fallback `|| 'https://cjvsllxvtsuvzgshgykv...'` (kẻo project khác bị 401)


## `frontend/public/` — file cần thay
- `pt1.jpg`, `pt2.jpg`, `pt3.jpg`, `pt4.jpg`, `pt5.jpg` → ảnh cá nhân bạn
- `UITMap.png` → sơ đồ khuôn viên của bạn (hoặc xoá)
- `music.mp3` → file nhạc của bạn
- `favicon.svg` → favicon của bạn
- `thành.jpg`, `thuMoiTN.png` → xoá (ảnh dư của Phúc Thành)


## `frontend/index.html`
- Dòng 7: `<title>Thư mời Tốt nghiệp - Minh Dương</title>`
- Dòng 8: `<meta name="description" content="...Minh Dương...Ulaw." />`


## `frontend/src/App.jsx`


### Ảnh
- Dòng 40-45: mảng `personalPhotos = ['/pt2.jpg', '/pt3.jpg', '/pt4.jpg', '/pt5.jpg']`


### Intro (thư chào)
- Dòng 105, 182, 329: chuỗi `fullText` chứa "Minh Dương" (3 lần trong đoạn)


### Ngày tổ chức
- Dòng 118: `const targetDate = new Date('2026-06-09T11:00:00+07:00')`
- Dòng 530: `14 giờ 00 đến 16 giờ 00`
- Dòng 531: `Thứ Sáu, ngày 07/8/2026`
- Dòng 673: `Hãy phản hồi giúp tớ trước ngày 06/8/2026 để tớ đón tiếp được chu đáo nhất ạaaaaa ❤️`


### Địa điểm
- Dòng 542: `Sân trường - Sảnh A`
- Dòng 543: `(ngay logo Ulaw vàng chói ở sảnh A)`
- Dòng 544: `Trường Đại học Luật TP. Hồ Chí Minh`
- Dòng 545: `Số 02 Nguyễn Tất Thành, phường Xóm Chiếu, TP. Hồ Chí Minh`
- Dòng 565: `📍 Trường Đại học Luật TP. Hồ Chí Minh (cơ sở 1): Số 02 Nguyễn Tất Thành, phường Xóm Chiếu, TP. Hồ Chí Minh`
- Dòng 568: text mô tả đường đi
- Dòng 574: `src="https://maps.app.goo.gl/ZspPUchBfXjSqYF1A?g_st=ic"`
- Dòng 578: `title="Bản đồ Ulaw"`
- Dòng 587: `href="https://maps.app.goo.gl/ZspPUchBfXjSqYF1A?g_st=ic"`
- Dòng 603: `Sơ đồ Khuôn viên UIT`
- Dòng 606: text mô tả sơ đồ
- Dòng 610: `src="/UITMap.png"`
- Dòng 611: `alt="Sơ đồ khuôn viên UIT"`


### Hướng dẫn gửi xe
- Dòng 637: text "Bãi gửi xe: Gần trường như chỉ dẫn bên trên thì có 2 bãi giữ xe là “Bãi giữ xe 1 Bến Vân Đồn” và “Bãi giữ xe Bộ đội Biên phòng cũ” để mọi người gửi xe ạ. Tuy nhiên, tớ thấy Bãi giữ xe 1 Bến Vân Đồn tốt hơn nhiều, nếu được mọi người hãy gửi ở đó nhé! Với cả mọi người nhớ đi đúng chiều, đừng chạy ngược chiều dễ bị “mấy ảnh” giữ lại lắm nhooo"
- Dòng 643: text "Lấy thẻ xe..." -> EM K MUỐN ĐỂ DÒNG NÀY NÊN E MUỐN XOÁ NÓ ĐI Ạ
- Dòng 649: text "Chi phí gửi xe: Mỗi lượt gửi xe gắn máy ở bãi sẽ là 6.000 đồng ạ"
- Dòng 655: text "Lưu ý..." -> EM K MUỐN ĐỂ DÒNG NÀY NÊN E MUỐN XOÁ NÓ ĐI Ạ


### Nhạc
- Dòng 344: `src="/music.mp3"`


### Tên hiển thị
- Dòng 424: `alt="Minh Dương Graduation"`
- Dòng 444: `<div className="polaroid-caption">MINH DƯƠNG</div>`
- Dòng 451: `Nhấp vào ảnh để xem Minh Dương xinh xắn như thế nèo nhóaaa`
- Dòng 489: `Thân mời bạn đến chung vui và chúc mừng cho tân cử nhân`
- Dòng 499: `MINH DƯƠNG aka MIND`
- Dòng 503: `Cử nhân ngành Luật – khoa Luật Thương mại`
- Dòng 507: `Được chụp cùng bạn một tấm ảnh và nhận lời chúc mừng của bạn là niềm vui lớn nhất trong điểm cuối của chặng đường vừa qua 😍`


### Form RSVP
- Dòng 73-74: dữ liệu mẫu (`Nguyễn Văn A`, `Trần Thị B` + 2 lời chúc)
- Dòng 266: `showToast('Em đã nhận được tín hiệu của mình ạaaa ❤️‍🔥')`
- Dòng 286: `showToast('🎉 Đã ghi nhận lời mời (Chế độ Offline/Demo)!')`
- Dòng 679: `Cho tớ xin danh tính cụa bạn với nhooooa! ...`
- Dòng 693: `Bạn có thể đến và chụp cùng tớ tấm ảnh chứ ạ?`
- Dòng 702: `Tớ sẽ đến chung vui với Minh Dương đáng iu nhóaaa 👏`
- Dòng 703: `ok iu iu moa moa!`
- Dòng 712: `Ú nâu, hôm đó tớ có việc bận rùi 🙁!`
- Dòng 713: ` Dạ hỏng seo, mình sẽ hẹn gặp nhau sau nhé, chưa thoát khỏi tớ đựợc đâu hẹ hẹ 😁`
- Dòng 721: `Bạn có điều gì muốn nhắn gửi tớ hăm ạ 😊`
- Dòng 726: placeholder `Gửi lời chúc mừng hoặc lời nhắn tại đây...`
- Dòng 738: `Đang gửi phản hồi...` / `Gửi xác nhận của bạn`


### Thông tin liên lạc
- Dòng 800: `href="tel:0908056949"`
- Dòng 804: `0908 056 949`
- Dòng 812: `href="mailto:leminhduong1604@gmail.com"`
- Dòng 816: `leminhduong1604@gmail.com`
- Dòng 825: `href="https://www.facebook.com/share/18wApis99D/?mibextid=wwXIfr"`
- Dòng 834: `fb.com/minhduong`


### Footer
- Dòng 844: `🎓 Made with ❤️ for Minh Dương's Graduation Day 🎓`
- Dòng 845: `© 2026 Minh Dương. All rights reserved.`




Link Google Maps bãi giữ xe 1 Bến Vân Đồn: https://maps.app.goo.gl/4b7LMUuTdgAcLUkv8?g_st=ic  
Link Google Maps bãi giữ xe Bộ đội Biên phòng cũ: https://maps.app.goo.gl/myQLZ4KFxc7CAjdV8?g_st=ic


TÂM SỰ 1: 
Thân gửi những mảnh ghép đặc biệt trong thanh xuân của tớ 🌺
Nếu bạn đang đọc những dòng này, nghĩa là bạn đã trở thành một phần thật đẹp trong thanh xuân của Minh Dương. Cảm ơn bạn vì đã đồng hành cùng tớ suốt bốn năm đại học đầy kỷ niệm. Hãy cùng tớ lưu giữ khoảnh khắc rực rỡ cuối cùng ở trạm dừng này, để rồi một ngày nắng đẹp rất gần thôi chúng ta sẽ gặp lại nhau 🌇
Cảm ơn bạn vì đã cùng tớ đi đến thời khắc này 🎆



TÂM SỰ 2
Em cảm ơn mọi người vì đã là một phần trong thanh xuân của em. Sự hiện diện và những lời chúc mừng của mọi người đã là món quà quý giá nhất với em nên mọi người đừng bận tâm đến việc có quà hay không nhé 😘
Nếu vẫn muốn tặng em một món quà, em sẽ rất vui nếu đó là một món quà lưu niệm để sau này nhìn lại em sẽ luôn nhớ về mọi người.
Còn nếu mọi người định mua hoa chúc mừng, em xin phép được gửi một lời nhắn nhỏ. Thay vì mua hoa, mọi người có thể chuyển khoản số tiền đó vào quỹ từ thiện của em để em tiếp tục thực hiện các dự án tình nguyện trong thời gian tới. Dù là 1.000 đồng, 10.000 đồng hay 100.000 đồng, với em đều vô cùng trân quý. Nhờ vậy, thay vì một bó hoa chỉ rực rỡ trong ngày tốt nghiệp, mọi người sẽ cùng em trao đi những “bông hoa” của yêu thương đến những hoàn cảnh khó khăn 🌻
Em rất mong mọi người hiểu đây chỉ là mong muốn cá nhân của em, hoàn toàn không phải là sự đòi hỏi quà hay tiền. Nếu lời nhắn này khiến mọi người hiểu lầm thì em thật lòng xin lỗi, và mọi người cứ nhắn cho em nếu muốn em giải thích thêm ạ 🥰
Cuối cùng, em cảm ơn mọi người vì đã luôn yêu thương, ủng hộ và đồng hành cùng em trong suốt chặng đường vừa qua. Yêu cả nhà mình rất nhiều ạaaaaa 💞

