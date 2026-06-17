/**
 * ═══════════════════════════════════════════════════════════
 * EcoHeritage AI - Central Database (Cơ sở dữ liệu động v5.0)
 * ═══════════════════════════════════════════════════════════
 * File chứa toàn bộ cơ sở dữ liệu mặc định của hệ thống.
 * Được tự động đồng bộ hóa hai chiều với LocalStorage để phục vụ CRUD.
 */

const EcoHeritageDefaultData = {
    "regions": [
        {
            "id": "r1",
            "name": "Khu bảo tồn thiên nhiên Sơn Trà",
            "location": "Bán đảo Sơn Trà, Thọ Quang, Sơn Trà, Đà Nẵng",
            "coords": [
                16.1264,
                108.2863
            ],
            "type": "primary",
            "image": "./images/ban_do/son_tra_map.png",
            "herbs": [
                "Trà Sơn Trà",
                "Cây chổi xuể",
                "Kim ngân hoa",
                "Lá lốt"
            ],
            "desc": "Lá phổi xanh của thành phố Đà Nẵng, có khí hậu mát mẻ đặc trưng biển, là nơi bảo tồn nhiều giống cây thuốc nam đặc hữu quý hiếm.",
            "rating": 4.5,
            "reviewsCount": 2,
            "reviewsList": [
                {
                    "user": "Bác Sĩ Lê Mạnh",
                    "rating": 5,
                    "comment": "Sơn Trà khí hậu tuyệt vời, rất nhiều cây kim ngân và chổi xuể chất lượng hoạt tính cao."
                },
                {
                    "user": "Lương Y Cương",
                    "rating": 4,
                    "comment": "Đất cát pha và hơi biển tạo điều kiện tốt cho kim ngân hoa tích tụ tinh dầu."
                }
            ]
        },
        {
            "id": "r2",
            "name": "Rừng cấm Quốc gia Bà Nà - Núi Chúa",
            "location": "Hòa Ninh, Hòa Vang, Đà Nẵng",
            "coords": [
                15.9961,
                107.9866
            ],
            "type": "danger",
            "image": "./images/ban_do/ba_na_map.png",
            "herbs": [
                "Sâm Ngọc Linh",
                "Ba kích",
                "Nấm lim xanh",
                "Xạ đen"
            ],
            "desc": "Với độ cao 1,487m so với mực nước biển, khí hậu ôn đới quanh năm, đây là thiên đường sinh trưởng của các loài sâm núi và nấm linh chi cổ thụ.",
            "rating": 5,
            "reviewsCount": 2,
            "reviewsList": [
                {
                    "user": "Trần Nam",
                    "rating": 5,
                    "comment": "Sâm Ngọc Linh trồng ở vùng này phát triển rất tốt nhờ độ cao và sương mù."
                },
                {
                    "user": "Nguyễn Minh Hùng",
                    "rating": 5,
                    "comment": "Khu bảo tồn bảo vệ giống sâm rất nghiêm ngặt, chất lượng sâm đạt chuẩn dược lý."
                }
            ]
        },
        {
            "id": "r3",
            "name": "Vườn dược liệu danh thắng Ngũ Hành Sơn",
            "location": "Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
            "coords": [
                16.0041,
                108.2635
            ],
            "type": "warning",
            "image": "./images/ban_do/ngu_hanh_son_map.png",
            "herbs": [
                "Đinh lăng",
                "Lạc tiên",
                "Ngải cứu",
                "Diếp cá"
            ],
            "desc": "Khu vực tâm linh danh thắng Ngũ Hành Sơn với núi đá vôi lâu đời, nơi người dân địa phương gieo trồng các loại cây thuốc nam làm ấm, an thần.",
            "rating": 4.5,
            "reviewsCount": 2,
            "reviewsList": [
                {
                    "user": "Phan Hoa",
                    "rating": 4,
                    "comment": "Vườn cây thuốc ở Ngũ Hành Sơn mát mẻ, đinh lăng rễ to và thơm."
                },
                {
                    "user": "Lương Y Cương",
                    "rating": 5,
                    "comment": "Địa điểm tâm linh và dược liệu kết hợp tuyệt vời. Có nhiều bài thuốc gia truyền ở đây."
                }
            ]
        },
        {
            "id": "r4",
            "name": "Khu bảo tồn Nam Hải Vân",
            "location": "Đèo Hải Vân, Hòa Hiệp Bắc, Liên Chiểu, Đà Nẵng",
            "coords": [
                16.1952,
                108.1287
            ],
            "type": "success",
            "image": "./images/ban_do/nam_hai_van_map_1780295390234.png",
            "herbs": [
                "Ba kích",
                "Đảng sâm",
                "Xạ đen",
                "Cam thảo"
            ],
            "desc": "Nằm bên sườn dãy Trường Sơn đâm ra biển, có lượng mưa dồi dào tạo điều kiện cho các loại thảo dược bổ dưỡng gân cốt phát triển mạnh.",
            "rating": 5,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Lê Văn Tự",
                    "rating": 5,
                    "comment": "Ba kích vùng Nam Hải Vân chịu sương gió Trường Sơn rễ rất nạc, tính ấm tốt."
                }
            ]
        },
        {
            "id": "r5",
            "name": "Vườn cây thuốc Nam Chùa Linh Ứng Bãi Bụt",
            "location": "Bán đảo Sơn Trà, Sơn Trà, Đà Nẵng",
            "coords": [
                16.1001,
                108.2785
            ],
            "type": "info",
            "image": "./images/ban_do/chua_linh_ung_map_1780295406861.png",
            "herbs": [
                "Cam thảo",
                "Bạc hà",
                "Dành dành",
                "Kim ngân hoa"
            ],
            "desc": "Khu vườn thảo dược yên bình nằm trong khuôn viên chùa Linh Ứng, phục vụ việc chế thuốc thiện nguyện cứu độ chúng sinh của các nhà sư.",
            "rating": 5,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Sư thầy Tịnh Tâm",
                    "rating": 5,
                    "comment": "Vườn thuốc nam nhà chùa trồng được nhiều kim ngân và cam thảo, cứu giúp nhiều mảnh đời khó khăn."
                }
            ]
        },
        {
            "id": "r6",
            "name": "Khu bảo tồn thiên nhiên Đồng Đình",
            "location": "Bán đảo Sơn Trà, Thọ Quang, Sơn Trà, Đà Nẵng",
            "coords": [
                16.1085,
                108.2672
            ],
            "type": "primary",
            "image": "./images/ban_do/dong_dinh_map_1780295422382.png",
            "herbs": [
                "Lá lốt",
                "Ngải cứu",
                "Lạc tiên",
                "Tâm sen"
            ],
            "desc": "Nằm cạnh Bảo tàng Đồng Đình cổ kính, vùng thung lũng ẩm này là nơi lưu trữ hàng trăm loài thảo dược giải độc và an thần tự nhiên.",
            "rating": 4,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Lê Quốc Anh",
                    "rating": 4,
                    "comment": "Khu vực thung lũng ẩm ướt ở Sơn Trà thích hợp cho ngải cứu phát triển."
                }
            ]
        },
        {
            "id": "r7",
            "name": "Vườn dược liệu Hòa Bắc Eco-Herbs",
            "location": "Hòa Bắc, Hòa Vang, Đà Nẵng",
            "coords": [
                16.1352,
                107.9785
            ],
            "type": "success",
            "image": "./images/ban_do/hoa_bac_map_1780295447034.png",
            "herbs": [
                "Diếp cá",
                "Đinh lăng",
                "Ích mẫu",
                "Dây thìa canh"
            ],
            "desc": "Vườn thực vật hữu cơ nằm ven sông Cu Đê trong lành, áp dụng công nghệ sinh học cao để trồng và bào chế các loại dược liệu giải độc gan và giảm đường huyết.",
            "rating": 5,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Đặng Tuấn",
                    "rating": 5,
                    "comment": "Áp dụng công nghệ sinh học cao giúp nâng cao hàm lượng dược tính của cà gai leo rõ rệt."
                }
            ]
        },
        {
            "id": "r8",
            "name": "Vườn thực vật Trường Đại học Y Dược - Đại học Đà Nẵng",
            "location": "Khu đô thị Đại học Đà Nẵng, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng",
            "coords": [
                15.9785,
                108.2435
            ],
            "type": "info",
            "image": "./images/ban_do/dai_hoc_y_duoc_map_1780295462563.png",
            "herbs": [
                "Trinh nữ hoàng cung",
                "Cam thảo",
                "Ích mẫu",
                "Bạc hà"
            ],
            "desc": "Khu vườn mô hình phục vụ thực hành bào chế dược liệu và lưu trữ các giống cây thuốc y học cổ truyền tiêu chuẩn phục vụ nghiên cứu khoa học.",
            "rating": 5,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "GS. Nguyễn Văn Bằng",
                    "rating": 5,
                    "comment": "Khu vườn thực nghiệm mô hình rất chuyên nghiệp tại khu đô thị đại học mới Hòa Quý."
                }
            ]
        },
        {
            "id": "r9",
            "name": "Vùng đồi chè dược liệu Đông Giang - Hòa Vang",
            "location": "Giáp ranh Hòa Phú và Đông Giang, Đà Nẵng",
            "coords": [
                15.9385,
                107.8925
            ],
            "type": "warning",
            "image": "./images/ban_do/dong_giang_map_1780295480260.png",
            "herbs": [
                "Trà Sơn Trà",
                "Gừng",
                "Đảng sâm",
                "Đinh lăng"
            ],
            "desc": "Đồi núi thoải dốc ẩm ướt với đất đỏ bazan, thích hợp cho sự tích tụ tinh dầu của gừng núi, chè dây và các loại sâm bồi bổ sức khỏe khí huyết.",
            "rating": 4,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Lương Y Cương",
                    "rating": 4,
                    "comment": "Khí hậu mát mẻ sườn núi giúp gừng rừng và đảng sâm tích tụ nhiều hoạt chất bổ dưỡng."
                }
            ]
        },
        {
            "id": "r10",
            "name": "Hợp tác xã Dược liệu sạch Hòa Nhơn",
            "location": "Hòa Nhơn, Hòa Vang, Đà Nẵng",
            "coords": [
                16.0125,
                108.1345
            ],
            "type": "primary",
            "image": "./images/ban_do/hoa_nhon_map_1780295506140.png",
            "herbs": [
                "Lá lốt",
                "Cà gai leo",
                "Dây thìa canh",
                "Diếp cá"
            ],
            "desc": "Vùng sản xuất nông nghiệp ứng dụng công nghệ cao chuyên canh cây cà gai leo giải độc gan và thảo dược giảm ngọt đạt tiêu chuẩn OCOP quốc gia.",
            "rating": 5,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Phạm Minh",
                    "rating": 5,
                    "comment": "Hợp tác xã sản xuất cà gai leo rất sạch, sấy lạnh đạt chuẩn OCOP quốc gia xuất sắc."
                }
            ]
        },
        {
            "id": "r11",
            "name": "Khu bảo tồn dược liệu sinh học Hòa Phú",
            "location": "Hòa Phú, Hòa Vang, Đà Nẵng",
            "coords": [
                15.9682,
                108.0585
            ],
            "type": "success",
            "image": "./images/ban_do/hoa_phu_map.png",
            "herbs": [
                "Nấm lim xanh",
                "Ba kích",
                "Xạ đen",
                "Ích mẫu"
            ],
            "desc": "Hệ sinh thái rừng bán ngập mát mẻ, khí hậu mát dịu từ mạch nước ngầm tạo môi trường hoàn hảo bảo tồn nấm linh chi rừng hoang dã.",
            "rating": 5,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Vũ Đức",
                    "rating": 5,
                    "comment": "Môi trường rừng ngập nước mát mẻ nhân giống nấm lim xanh giữ nguyên hoạt chất quý."
                }
            ]
        },
        {
            "id": "r12",
            "name": "Vườn sinh học ven biển Nam Ô",
            "location": "Nam Ô, Hòa Hiệp Nam, Liên Chiểu, Đà Nẵng",
            "coords": [
                16.1245,
                108.1482
            ],
            "type": "info",
            "image": "./images/ban_do/nam_o_map.png",
            "herbs": [
                "Bạc hà",
                "Dành dành",
                "Lá lốt",
                "Cam thảo"
            ],
            "desc": "Mũi đá rạn Hải Vân sát biển, nơi tụ họp các loài thân thảo chịu mặn và gió cát, có hàm lượng tinh dầu kháng khuẩn cực mạnh.",
            "rating": 4,
            "reviewsCount": 1,
            "reviewsList": [
                {
                    "user": "Hoàng Long",
                    "rating": 4,
                    "comment": "Vườn cát ven biển Nam Ô thích hợp cho bạc hà kháng khuẩn mạnh."
                }
            ]
        }
    ],
    "herbs": [
        {
            "id": "h1",
            "source": "Thái Bình Huệ Dân Hòa Tễ Cục Phương (Thời Tống)",
            "name": "Thập Toàn Đại Bổ Thang",
            "scientific": "Thái Bình Huệ Dân Hòa Tễ Cục Phương",
            "category": "Bổ dưỡng",
            "usage": "Đại bổ khí huyết, phục hồi sinh lực toàn diện sau ốm dậy.",
            "emoji": "🍲",
            "image": "./images/bai_thuoc/thap_toan_dai_bo_1780293793264.png",
            "fallbackImage": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%23e8f5e9\"><rect width=\"100\" height=\"100\"/><circle cx=\"50\" cy=\"50\" r=\"30\" fill=\"%23a5d6a7\" opacity=\"0.3\"/><path d=\"M50 20 C60 40, 60 60, 50 80 C40 60, 40 40, 50 20 Z\" fill=\"%232eb366\"/><path d=\"M50 40 C65 45, 60 55, 50 60 Z\" fill=\"%2381c784\"/><path d=\"M50 50 C35 55, 40 65, 50 70 Z\" fill=\"%2381c784\"/><text x=\"50\" y=\"90\" font-family=\"system-ui\" font-size=\"6\" font-weight=\"bold\" fill=\"%231b5e20\" text-anchor=\"middle\">EcoHeritage</text></svg>",
            "ingredients": "Nhân sâm, Bạch truật, Phục linh, Cam thảo (Tứ quân) + Đương quy, Xuyên khung, Bạch thược, Thục địa (Tứ vật) + Hoàng kỳ, Nhục quế.",
            "efficacy": "Ôn bổ khí huyết. Chủ trị khí huyết lưỡng hư, sắc mặt nhợt nhạt, hơi thở ngắn, đánh trống ngực, chóng mặt, vã mồ hôi, cơ thể mỏi mệt.",
            "time": "Ngâm dược liệu: 30 phút | Sắc thuốc: 60-90 phút",
            "steps": [
                "Rửa nhẹ các vị thuốc qua nước sạch để loại bỏ bụi bẩn.",
                "Ngâm toàn bộ thang thuốc trong nước lạnh khoảng 30 phút trước khi sắc.",
                "Cho vào ấm đất, đổ 3 bát nước lớn sắc lửa nhỏ cạn còn 1 bát (nước đầu).",
                "Nước hai đổ 2 bát đun cạn còn nửa bát. Hòa chung 2 nước, chia uống ấm 2 lần trong ngày."
            ],
            "benefits": "Phục hồi thể lực nhanh chóng, tăng cường miễn dịch, cải thiện tuần hoàn máu, an thần ngủ ngon.",
            "keywords": "thap toan dai bo, bo khi huyet, suy nhuoc, mat ngu, phuc hoi, bo duong",
            "contraindications": "Người có chứng thực nhiệt, âm hư hỏa vượng, sốt cao, cảm mạo chưa giải.",
            "dosage": "Người lớn: Uống ngày 1 thang chia làm 2 lần, uống ấm sau ăn 30 phút. Trẻ em: Không khuyên dùng hoặc dùng dưới chỉ định của thầy thuốc.",
            "referenceDetail": "Dược điển Việt Nam V, Bộ Y Tế, NXB Y Học, ISBN: 978-604-82-2436-3 (Trang 1045)."
        },
        {
            "id": "h2",
            "source": "Tiểu Nhi Dược Chứng Trực Quyết - Tiền Ất (Thời Tống)",
            "name": "Lục Vị Địa Hoàng Hoàn",
            "scientific": "Tiểu Nhi Dược Chứng Trực Quyết",
            "category": "Bổ dưỡng",
            "usage": "Tư âm bổ thận, trị đau lưng mỏi gối, mồ hôi trộm, ù tai.",
            "emoji": "🌑",
            "image": "./images/bai_thuoc/luc_vi_dia_hoang_1780293808486.png",
            "fallbackImage": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%23e8f5e9\"><rect width=\"100\" height=\"100\"/><circle cx=\"50\" cy=\"50\" r=\"30\" fill=\"%23a5d6a7\" opacity=\"0.3\"/><path d=\"M50 20 C60 40, 60 60, 50 80 C40 60, 40 40, 50 20 Z\" fill=\"%232eb366\"/><path d=\"M50 40 C65 45, 60 55, 50 60 Z\" fill=\"%2381c784\"/><path d=\"M50 50 C35 55, 40 65, 50 70 Z\" fill=\"%2381c784\"/><text x=\"50\" y=\"90\" font-family=\"system-ui\" font-size=\"6\" font-weight=\"bold\" fill=\"%231b5e20\" text-anchor=\"middle\">EcoHeritage</text></svg>",
            "ingredients": "Thục địa (320g), Sơn thù (160g), Sơn dược (160g), Trạch tả (120g), Đan bì (120g), Phục linh (120g).",
            "efficacy": "Tư bổ can thận. Chữa chứng can thận âm hư, đầu choáng mắt hoa, tai ù, điếc, mồ hôi trộm, tiêu khát (tiểu đường).",
            "time": "Dạng viên hoàn: Dùng trực tiếp | Sắc uống: 45 phút",
            "steps": [
                "Nếu dùng thang sắc: Đổ 3 bát nước sắc cạn còn 1 bát uống khi còn ấm.",
                "Nếu làm viên hoàn: Tán bột mịn tất cả các vị, luyện với mật ong làm viên bằng hạt ngô.",
                "Mỗi lần uống 8-12g, ngày 2-3 lần với nước sôi để nguội pha chút muối loãng."
            ],
            "benefits": "Giảm đau mỏi thắt lưng, cải thiện chức năng thận, hạ đường huyết, làm mát cơ thể (chữa chứng âm hư hỏa vượng).",
            "keywords": "luc vi dia hoang, bo than, than am hu, dau lung, tieu dem, tieu duong",
            "contraindications": "Người bị tiêu chảy, tỳ vị hư hàn, ăn uống khó tiêu, đại tiện lỏng nát.",
            "dosage": "Dạng sắc: Ngày 1 thang chia 2 lần uống ấm. Dạng hoàn: Uống 8-12g/lần, ngày 2-3 lần với nước sôi ấm pha chút muối nhạt.",
            "referenceDetail": "Tiểu Nhi Dược Chứng Trực Quyết, Tiền Ất (Thời Tống), Bản dịch của NXB Y Học (Trang 120)."
        },
        {
            "id": "h3",
            "source": "Tế Sinh Phương - Nghiêm Dụng Hòa (Thời Tống)",
            "name": "Quy Tỳ Thang",
            "scientific": "Tế Sinh Phương",
            "category": "An thần",
            "usage": "Kiện tỳ dưỡng tâm, đặc trị mất ngủ, hay quên, đánh trống ngực.",
            "emoji": "🍵",
            "image": "./images/bai_thuoc/quy_ty_thang_1780293821849.png",
            "fallbackImage": "./images/bai_thuoc/quy_ty_thang_1780293821849.png",
            "ingredients": "Đảng sâm, Hoàng kỳ, Bạch truật, Cam thảo, Đương quy, Long nhãn, Táo nhân, Viễn chí, Phục thần, Mộc hương.",
            "efficacy": "Ích khí bổ huyết, kiện tỳ dưỡng tâm. Trị tâm tỳ lưỡng hư, khí huyết kém, mất ngủ suy nhược, rong kinh.",
            "time": "Chuẩn bị: 15 phút | Sắc thuốc: 60 phút",
            "steps": [
                "Chuẩn bị ấm đất hoặc gốm sứ. Cho thêm 3 lát gừng tươi và 2 quả đại táo (táo đỏ) vào thang.",
                "Đổ 1 lít nước lọc, đun sôi rồi vặn lửa nhỏ riu riu.",
                "Sắc cạn còn khoảng 300ml, chắt ra bát.",
                "Chia làm 2-3 lần uống trong ngày, tốt nhất uống ấm trước khi ngủ 1 giờ để phát huy tác dụng an thần."
            ],
            "benefits": "Mang lại giấc ngủ sâu tự nhiên, cải thiện trí nhớ, giảm hồi hộp âu lo, giúp ăn ngon miệng hơn.",
            "keywords": "quy ty thang, mat ngu, an than, hay quen, chong mat, bo mau, suy nhuoc than kinh",
            "contraindications": "Người bị nội nhiệt, âm hư hỏa vượng, thực nhiệt tà khí thịnh, sốt cao hoặc đờm nhiệt nhiều.",
            "dosage": "Ngày uống 1 thang sắc nước chia làm 3 lần uống ấm trước khi đi ngủ 1 giờ.",
            "referenceDetail": "Tế Sinh Phương, Nghiêm Dụng Hòa (Thời Tống), Thư viện Y học Cổ truyền Quốc gia link ID: tsp-1283."
        },
        {
            "id": "h4",
            "source": "Ôn Bệnh Điều Biện - Ngô Cúc Thông (Thời Thanh)",
            "name": "Ngân Kiều Tán",
            "scientific": "Ôn Bệnh Điều Biện",
            "category": "Giải độc",
            "usage": "Tân lương thấu biểu, thanh nhiệt giải độc, trị cảm mạo phong nhiệt, ho, đau họng.",
            "emoji": "🌿",
            "image": "./images/bai_thuoc/ngan_kieu_tan_1780293845354.png",
            "fallbackImage": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%23e8f5e9\"><rect width=\"100\" height=\"100\"/><circle cx=\"50\" cy=\"50\" r=\"30\" fill=\"%23a5d6a7\" opacity=\"0.3\"/><path d=\"M50 20 C60 40, 60 60, 50 80 C40 60, 40 40, 50 20 Z\" fill=\"%232eb366\"/><path d=\"M50 40 C65 45, 60 55, 50 60 Z\" fill=\"%2381c784\"/><path d=\"M50 50 C35 55, 40 65, 50 70 Z\" fill=\"%2381c784\"/><text x=\"50\" y=\"90\" font-family=\"system-ui\" font-size=\"6\" font-weight=\"bold\" fill=\"%231b5e20\" text-anchor=\"middle\">EcoHeritage</text></svg>",
            "ingredients": "Kim ngân hoa, Liên kiều, Cát cánh, Bạc hà, Trúc diệp, Cam thảo sống, Kinh giới tuệ, Đạm đậu xị, Ngưu bàng tử.",
            "efficacy": "Phát tán phong nhiệt, thanh nhiệt giải độc. Chuyên trị cảm cúm thể nhiệt, sốt cao không ra mồ hôi, ho đờm vàng, sưng đau họng.",
            "time": "Chuẩn bị: 5 phút | Hãm/Sắc nhanh: 15 phút",
            "steps": [
                "Đây là bài thuốc lấy \"Khí\" để chữa bệnh, vì vậy chứa nhiều tinh dầu (bạc hà, kinh giới) - KHÔNG ĐƯỢC SẮC LÂU.",
                "Đun nước vừa sôi tới, thả các vị thuốc vào đun thêm đúng 5-10 phút để tinh dầu không bay hơi mất.",
                "Hoặc có thể tán thành bột thô, hãm như hãm trà với nước sôi.",
                "Uống lúc thuốc còn nóng ấm để ra mồ hôi nhẹ giải cảm."
            ],
            "benefits": "Cắt cơn sốt nhanh chóng, làm dịu họng tức thì, sát khuẩn đường hô hấp, giải cảm cúm, viêm amidan.",
            "keywords": "ngan kieu tan, cam cum, sot, dau hong, viem hong, thanh nhiet, giai doc, ho",
            "contraindications": "Người bị cảm mạo phong hàn (sợ lạnh nhiều, không sợ nóng, không khát, rêu lưỡi trắng mỏng), tiêu lỏng.",
            "dosage": "Uống nóng ngày 1 thang sắc nhanh (không đun lâu trên 15 phút tránh bay tinh dầu), chia uống nhiều lần trong ngày.",
            "referenceDetail": "Ôn Bệnh Điều Biện, Ngô Cúc Thông (Thời Thanh), NXB Y Học, DOI: 10.1016/j.obdb.2021."
        },
        {
            "id": "h5",
            "source": "Bị Cấp Thiên Kim Yếu Phương - Tôn Tư Mạo (Thời Đường)",
            "name": "Độc Hoạt Tang Ký Sinh Thang",
            "scientific": "Thiên Kim Phương",
            "category": "Chữa bệnh",
            "usage": "Trị phong thấp, đau nhức mỏi xương khớp, thần kinh tọa, đau lưng châm chích.",
            "emoji": "🪵",
            "image": "./images/bai_thuoc/doc_hoat_tang_ky_sinh_1780293862294.png",
            "fallbackImage": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%23e8f5e9\"><rect width=\"100\" height=\"100\"/><circle cx=\"50\" cy=\"50\" r=\"30\" fill=\"%23a5d6a7\" opacity=\"0.3\"/><path d=\"M50 20 C60 40, 60 60, 50 80 C40 60, 40 40, 50 20 Z\" fill=\"%232eb366\"/><path d=\"M50 40 C65 45, 60 55, 50 60 Z\" fill=\"%2381c784\"/><path d=\"M50 50 C35 55, 40 65, 50 70 Z\" fill=\"%2381c784\"/><text x=\"50\" y=\"90\" font-family=\"system-ui\" font-size=\"6\" font-weight=\"bold\" fill=\"%231b5e20\" text-anchor=\"middle\">EcoHeritage</text></svg>",
            "ingredients": "Độc hoạt, Tang ký sinh, Đỗ trọng, Ngưu tất, Tế tân, Tần giao, Phòng phong, Quế tâm, Xuyên khung, Đương quy, Thược dược, Địa hoàng, Nhân sâm, Phục linh, Cam thảo.",
            "efficacy": "Khu phong thấp, chỉ tí thống, ích can thận, bổ khí huyết. Trị chứng tý lâu ngày ảnh hưởng can thận khí huyết đều hư.",
            "time": "Chuẩn bị: 15 phút | Sắc 2 lần: 90 phút",
            "steps": [
                "Đổ 3 bát nước sắc cạn còn 1 bát, chắt ra để riêng.",
                "Tiếp tục đổ thêm 2 bát rưỡi sắc lần 2 cạn còn nửa bát.",
                "Hòa chung 2 bát nước cốt này, chia đều thành 3 phần uống sau bữa ăn 30 phút.",
                "Nên kiêng đồ ăn lạnh, hải sản tanh trong thời gian uống thuốc để thuốc đạt hiệu quả trừ phong thấp tốt nhất."
            ],
            "benefits": "Giảm đau mỏi vai gáy và cột sống, mạnh gân cốt, trị tê bì chân tay, đặc trị chứng đau thần kinh tọa lan xuống chân.",
            "keywords": "doc hoat tang ky sinh, xuong khop, dau lung, phong thap, than kinh toa, te bi, nhuc moi",
            "contraindications": "Người có hội chứng thực nhiệt, khớp sưng nóng đỏ đau (phong thấp nhiệt tí). Phụ nữ có thai phải cực kỳ thận trọng.",
            "dosage": "Ngày dùng 1 thang sắc nước làm 2 lần, uống ấm sau ăn 1 giờ.",
            "referenceDetail": "Bị Cấp Thiên Kim Yếu Phương, Tôn Tư Mạo (Thời Đường), Thư viện Y học cổ truyền, ISBN: 978-604-82-1132-0."
        },
        {
            "id": "h6",
            "source": "Thái Bình Huệ Dân Hòa Tễ Cục Phương (Thời Tống)",
            "name": "Tứ Quân Tử Thang",
            "scientific": "Hòa Tễ Cục Phương",
            "category": "Bổ dưỡng",
            "usage": "Kiện tỳ ích khí, cải thiện tiêu hóa, trị chứng chán ăn, người mệt mỏi.",
            "emoji": "🌱",
            "image": "./images/bai_thuoc/tu_quan_tu_thang_1780293877299.png",
            "fallbackImage": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%23e8f5e9\"><rect width=\"100\" height=\"100\"/><circle cx=\"50\" cy=\"50\" r=\"30\" fill=\"%23a5d6a7\" opacity=\"0.3\"/><path d=\"M50 20 C60 40, 60 60, 50 80 C40 60, 40 40, 50 20 Z\" fill=\"%232eb366\"/><path d=\"M50 40 C65 45, 60 55, 50 60 Z\" fill=\"%2381c784\"/><path d=\"M50 50 C35 55, 40 65, 50 70 Z\" fill=\"%2381c784\"/><text x=\"50\" y=\"90\" font-family=\"system-ui\" font-size=\"6\" font-weight=\"bold\" fill=\"%231b5e20\" text-anchor=\"middle\">EcoHeritage</text></svg>",
            "ingredients": "Nhân sâm, Bạch truật, Phục linh, Cam thảo (chích).",
            "efficacy": "Ích khí, kiện tỳ dưỡng vị. Là bài thuốc gốc (tổ phương) của các bài thuốc bổ khí. Trị tỳ vị khí hư, mặt vàng úa, tiếng nói nhỏ, tứ chi bủn rủn, tiêu phân lỏng.",
            "time": "Chuẩn bị: 5 phút | Sắc uống: 45 phút",
            "steps": [
                "Tứ Quân (4 vị quân tử) tính bình hòa dịu nhẹ, không nóng không táo.",
                "Cho 4 vị vào siêu sắc thuốc cùng 2 bát nước to.",
                "Đun sôi và sắc nhỏ lửa đến khi còn khoảng gần 1 bát.",
                "Uống tốt nhất vào sáng sớm lúc bụng đói để dưỡng khí, hoặc chia làm 2 lần trước bữa ăn để kích thích tiêu hóa."
            ],
            "benefits": "Phục hồi chức năng tỳ vị (dạ dày, ruột), trị tiêu chảy mãn tính, giúp ăn ngon, tăng khả năng hấp thu dinh dưỡng.",
            "keywords": "tu quan tu thang, kien ty, tieu hoa, chan an, met moi, roi loan tieu hoa, bo khi",
            "contraindications": "Người bị thực tà ngưng trệ, bụng đầy chướng đau dữ dội do khí uất.",
            "dosage": "Ngày uống 1 thang sắc chia làm 2 lần, uống ấm trước bữa ăn.",
            "referenceDetail": "Thái Bình Huệ Dân Hòa Tễ Cục Phương, Bản dịch Viện Nghiên cứu Đông y Việt Nam (Trang 89)."
        },
        {
            "id": "h7",
            "source": "Chính Thể Loại Yếu - Tiết Kỷ (Thời Minh)",
            "name": "Bát Trân Thang",
            "scientific": "Chính Thể Loại Yếu",
            "category": "Bổ dưỡng",
            "usage": "Khí huyết lưỡng bổ, trị các chứng suy nhược, thiếu máu, gầy ốm.",
            "emoji": "🌸",
            "image": "./images/bai_thuoc/bat_tran_thang.png",
            "fallbackImage": "./images/bai_thuoc/bat_tran_thang.png",
            "ingredients": "Tứ quân (Nhân sâm, Bạch truật, Phục linh, Cam thảo) + Tứ vật (Đương quy, Thục địa, Bạch thược, Xuyên khung).",
            "efficacy": "Bổ cả khí lẫn huyết. Trị các chứng sắc mặt nhợt nhạt, mệt mỏi, chán ăn, hoa mắt chóng mặt, nhịp tim nhanh.",
            "time": "Sắc uống: 60 phút",
            "steps": [
                "Cho các vị thuốc vào siêu đất.",
                "Đổ 3 bát nước sắc cạn còn 1 bát.",
                "Uống ấm, chia 2 lần sáng chiều."
            ],
            "benefits": "Bồi bổ toàn diện, phục hồi chức năng tạo máu.",
            "keywords": "bat tran thang, bo mau, suy nhuoc, thieu mau",
            "contraindications": "Người có chứng đờm ẩm, thực nhiệt, bụng đầy chướng, tiêu chảy cấp chưa giải.",
            "dosage": "Ngày uống 1 thang sắc nước ấm chia làm 2 lần trước ăn.",
            "referenceDetail": "Chính Thể Loại Yếu, Tiết Kỷ (Thời Minh), Thư viện Y văn Trung y Quốc gia link ID: ctly-882."
        },
        {
            "id": "h8",
            "source": "Thái Bình Huệ Dân Hòa Tễ Cục Phương (Thời Tống)",
            "name": "Bình Vị Tán",
            "scientific": "Hòa Tễ Cục Phương",
            "category": "Chữa bệnh",
            "usage": "Táo thấp kiện tỳ, trị chứng đầy bụng, khó tiêu, buồn nôn.",
            "emoji": "🏺",
            "image": "./images/bai_thuoc/binh_vi_tan.png",
            "fallbackImage": "./images/bai_thuoc/binh_vi_tan.png",
            "ingredients": "Thương truật, Hậu phác, Trần bì, Cam thảo.",
            "efficacy": "Hóa thấp, kiện vị. Trị tỳ vị bất hòa, bụng trướng, ăn không tiêu.",
            "time": "Sắc uống: 45 phút",
            "steps": [
                "Thêm vài lát gừng tươi and đại táo.",
                "Đổ 2 bát nước sắc còn gần 1 bát.",
                "Uống ấm sau khi ăn."
            ],
            "benefits": "Hỗ trợ tiêu hóa, trị đầy hơi chướng bụng.",
            "keywords": "binh vi tan, tieu hoa, day bung, kho tieu",
            "contraindications": "Người bị đờm thấp thịnh, bụng trướng đầy, chán ăn do thấp nhiệt tích tụ.",
            "dosage": "Ngày sắc uống 1 thang chia làm 2 lần ấm sáng và tối.",
            "referenceDetail": "Y học cổ truyền Việt Nam, NXB Y Học, ISBN: 978-604-82-3841-4 (Trang 182)."
        },
        {
            "id": "h9",
            "source": "Thái Bình Huệ Dân Hòa Tễ Cục Phương (Thời Tống)",
            "name": "Tiêu Dao Tán",
            "scientific": "Hòa Tễ Cục Phương",
            "category": "Chữa bệnh",
            "usage": "Sơ can giải uất, kiện tỳ dưỡng huyết. Trị chứng kinh nguyệt không đều.",
            "emoji": "🌿",
            "image": "./images/bai_thuoc/tieu_dao_tan.png",
            "fallbackImage": "./images/bai_thuoc/tieu_dao_tan.png",
            "ingredients": "Sài hồ, Đương quy, Bạch thược, Bạch truật, Phục linh, Cam thảo, Sinh khương, Bạc hà.",
            "efficacy": "Điều hòa can tỳ. Trị tức ngực, đau mạng sườn, hoa mắt, rối loạn kinh nguyệt.",
            "time": "Sắc uống: 45 phút",
            "steps": [
                "Tán bột hoặc sắc uống với lượng vừa đủ.",
                "Uống khi còn ấm để phát huy tác dụng."
            ],
            "benefits": "Giảm căng thẳng, điều hòa nội tiết tố nữ.",
            "keywords": "tieu dao tan, roi loan kinh nguyet, can uat",
            "contraindications": "Người âm hư hỏa vượng, phế nhiệt ho khan, họng khô miệng khát, phân táo cứng.",
            "dosage": "Ngày uống 1 thang sắc chia làm 3 lần uống ấm trước khi ăn.",
            "referenceDetail": "Thái Bình Huệ Dân Hòa Tễ Cục Phương, NXB Y Học (Trang 342)."
        },
        {
            "id": "h10",
            "source": "Tỳ Vị Luận - Lý Đông Viên (Thời Kim - Nguyên)",
            "name": "Bổ Trung Ích Khí Thang",
            "scientific": "Tỳ Vị Luận",
            "category": "Bổ dưỡng",
            "usage": "Bổ trung ích khí, thăng dương cử hãm. Trị nội tạng sa giáng.",
            "emoji": "🌱",
            "image": "./images/bai_thuoc/bo_trung_ich_khi.png",
            "fallbackImage": "./images/bai_thuoc/bo_trung_ich_khi.png",
            "ingredients": "Hoàng kỳ, Nhân sâm, Bạch truật, Đương quy, Trần bì, Thăng ma, Sài hồ, Cam thảo.",
            "efficacy": "Thăng đề dương khí. Trị trĩ, sa tử cung, sa dạ dày, mỏi mệt yếu sức.",
            "time": "Sắc uống: 60 phút",
            "steps": [
                "Đổ 3 bát nước sắc còn 1 bát.",
                "Nên uống lúc bụng đói vào buổi sáng."
            ],
            "benefits": "Tăng cường trương lực cơ trơn, bồi bổ sinh lực mạnh mẽ.",
            "keywords": "bo trung ich khi, sa da day, tri, met moi",
            "contraindications": "Người âm hư phát sốt, cao huyết áp kịch phát, hen suyễn cấp tính khó thở.",
            "dosage": "Ngày uống 1 thang sắc uống ấm trước bữa ăn sáng và trưa để thăng đề dương khí.",
            "referenceDetail": "Tỳ Vị Luận, Lý Đông Viên (Thời Kim - Nguyên), NXB Y Học, ISBN: 978-604-82-1927-2."
        },
        {
            "id": "h11",
            "source": "Nội Ngoại Thương Biện Hoặc Luận - Lý Đông Viên (Thời Kim - Nguyên)",
            "name": "Sinh Mạch Tán",
            "scientific": "Nội Ngoại Thương Biện Hoặc Luận",
            "category": "Bổ dưỡng",
            "usage": "Ích khí sinh tân, liễm âm chỉ hãn. Trị chứng khí âm lưỡng hư.",
            "emoji": "💧",
            "image": "./images/bai_thuoc/sinh_mach_tan.png",
            "fallbackImage": "./images/bai_thuoc/sinh_mach_tan.png",
            "ingredients": "Nhân sâm, Mạch môn, Ngũ vị tử.",
            "efficacy": "Phục hồi khí lực và bù đắp tân dịch. Trị sốt cao mất nước, đổ mồ hôi nhiều.",
            "time": "Hãm trà hoặc sắc: 30 phút",
            "steps": [
                "Có thể hãm như trà uống thay nước trong ngày.",
                "Đặc biệt tốt trong mùa hè oi nóng."
            ],
            "benefits": "Bổ tim mạch, chống say nắng say nóng, phục hồi sau sốt.",
            "keywords": "sinh mach tan, bo am, mat nuoc, say nang",
            "contraindications": "Người tỳ vị hư hàn, đi lỏng mãn tính, âm hư hỏa vượng nặng.",
            "dosage": "Ngày dùng 1 thang sắc chia làm 2 lần uống ấm sau bữa ăn.",
            "referenceDetail": "Thái Bình Huệ Dân Hòa Tễ Cục Phương, NXB Y Học (Trang 188)."
        },
        {
            "id": "h12",
            "source": "Nhiếp Sinh Bí Phẫu - Hồng Cơ (Thời Minh)",
            "name": "Thiên Vương Bổ Tâm Đan",
            "scientific": "Nhiếp Sinh Bí Phẫu",
            "category": "An thần",
            "usage": "Tư âm thanh nhiệt, bổ tâm an thần. Trị mất ngủ mạn tính.",
            "emoji": "🌌",
            "image": "./images/bai_thuoc/thien_vuong_bo_tam.png",
            "fallbackImage": "./images/bai_thuoc/thien_vuong_bo_tam.png",
            "ingredients": "Sinh địa, Huyền sâm, Thiên môn, Mạch môn, Đan sâm, Đương quy, Đảng sâm, Phục linh, Toan táo nhân, Bá tử nhân, Viễn chí, Cát cánh, Ngũ vị tử, Chu sa.",
            "efficacy": "Trị chứng âm hư hỏa vượng, tâm thần bất ninh, tim đập nhanh, hay quên.",
            "time": "Dạng hoàn: Uống trực tiếp",
            "steps": [
                "Tán bột làm viên hoàn.",
                "Mỗi lần uống 9g với nước ấm trước khi đi ngủ."
            ],
            "benefits": "Giảm hồi hộp, mang lại giấc ngủ sâu, dưỡng tim mạch.",
            "keywords": "thien vuong bo tam, an than, mat ngu, hay quen",
            "contraindications": "Người âm hư hỏa vượng, họng khô miệng khát, lưỡi đỏ không rêu, trẻ em dưới 12 tuổi.",
            "dosage": "Uống 8g/lần, ngày 2 lần với nước muối loãng ấm trước khi ăn.",
            "referenceDetail": "Kim Quỹ Yếu Lược, Trương Trọng Cảnh (Thời Đông Hán), Bản dịch NXB Y Học."
        },
        {
            "id": "h13",
            "source": "Thái Bình Huệ Dân Hòa Tễ Cục Phương (Thời Tống)",
            "name": "Nhị Trần Thang",
            "scientific": "Hòa Tễ Cục Phương",
            "category": "Giải độc",
            "usage": "Táo thấp hóa đờm, lý khí hòa trung. Đặc trị ho có đờm.",
            "emoji": "🍵",
            "image": "./images/bai_thuoc/nhi_tran_thang.png",
            "fallbackImage": "./images/bai_thuoc/nhi_tran_thang.png",
            "ingredients": "Bán hạ, Trần bì, Phục linh, Cam thảo, Sinh khương, Ô mai.",
            "efficacy": "Trị các chứng đờm ẩm, ho nhiều đờm trắng, buồn nôn, chóng mặt.",
            "time": "Sắc uống: 45 phút",
            "steps": [
                "Đổ 2 bát rưỡi nước sắc còn 1 bát.",
                "Uống ấm sau ăn."
            ],
            "benefits": "Làm sạch đường hô hấp, dứt cơn ho có đờm, giảm buồn nôn.",
            "keywords": "nhi tran thang, ho co dom, buon non, long dom",
            "contraindications": "Tuyệt đối không dùng cho người thể hàn, tỳ vị hư hàn, tự ra mồ hôi do dương hư, hoặc người bị tiêu chảy. Dùng nhầm bài thuốc thanh nhiệt cực mạnh này có thể gây hạ nhiệt kịch phát cực nguy hiểm.",
            "dosage": "Ngày sắc uống 1 thang, sắc kỹ để nguội uống làm nhiều lần. Chỉ dùng khi có sốt cao thực nhiệt.",
            "referenceDetail": "Thương Hàn Luận, Trương Trọng Cảnh (Thời Đông Hán), NXB Y Học, ISBN: 978-604-82-4522-1."
        },
        {
            "id": "h14",
            "source": "Thương Hàn Luận - Trương Trọng Cảnh (Thời Đông Hán)",
            "name": "Bạch Hổ Thang",
            "scientific": "Thương Hàn Luận",
            "category": "Giải độc",
            "usage": "Thanh khí phận nhiệt. Trị sốt rất cao.",
            "emoji": "🐅",
            "image": "./images/bai_thuoc/bach_ho_thang.png",
            "fallbackImage": "./images/bai_thuoc/bach_ho_thang.png",
            "ingredients": "Thạch cao, Tri mẫu, Chích cam thảo, Ngạnh mễ (Gạo tẻ).",
            "efficacy": "Thanh nhiệt giáng hỏa, sinh tân chỉ khát. Trị chứng 4 lớn: Sốt lớn, mồ hôi lớn, khát lớn, mạch hồng lớn.",
            "time": "Sắc uống: 50 phút",
            "steps": [
                "Sắc Thạch cao trước 10 phút.",
                "Sau đó cho các vị khác vào sắc chung.",
                "Uống ấm."
            ],
            "benefits": "Cắt sốt cao cực nhanh, giảm khát nước lập tức.",
            "keywords": "bach ho thang, sot cao, thanh nhiet, giai khat",
            "contraindications": "Tuyệt đối không dùng cho phụ nữ có thai, người cơ thể suy nhược nặng, người già yếu hoặc tiêu chảy mất nước nặng.",
            "dosage": "Sắc uống ngày 1 thang, chia làm 2 lần, ngưng uống ngay sau khi đại tiện thông suốt.",
            "referenceDetail": "Thương Hàn Luận, Trương Trọng Cảnh, Thư viện Quốc gia ký hiệu bản dịch: SHL-TC-14."
        },
        {
            "id": "h15",
            "source": "Bị Cấp Thiên Kim Yếu Phương - Tôn Tư Mạo (Thời Đường)",
            "name": "Ôn Đởm Thang",
            "scientific": "Thiên Kim Phương",
            "category": "Chữa bệnh",
            "usage": "Lý khí hóa đờm, thanh đởm hòa vị. Trị mất ngủ kèm hoảng hốt.",
            "emoji": "🧘",
            "image": "./images/bai_thuoc/on_dom_thang.png",
            "fallbackImage": "./images/bai_thuoc/on_dom_thang.png",
            "ingredients": "Bán hạ, Trúc nhự, Chỉ thực, Trần bì, Cam thảo, Phục linh.",
            "efficacy": "Trị chứng đởm vị bất hòa, đờm nhiệt nội nhiễu gây mất ngủ, mộng mị, đắng miệng.",
            "time": "Sắc uống: 45 phút",
            "steps": [
                "Sắc lửa nhỏ với 3 bát nước còn 1 bát.",
                "Uống trước khi đi ngủ."
            ],
            "benefits": "Trị ác mộng, giảm giật mình hoảng hốt, ăn ngon miệng hơn.",
            "keywords": "on dom thang, mat ngu, ac mong, dang mieng",
            "contraindications": "Ho do âm hư hoặc ho ra máu tươi nặng cần hết sức thận trọng, hỏi ý kiến lương y trước khi sắc.",
            "dosage": "Ngày sắc uống 1 thang sắc ấm chia làm 3 lần ăn trong ngày.",
            "referenceDetail": "Bị Cấp Thiên Kim Yếu Phương, Tôn Tư Mạo (Thời Đường), NXB Y Học."
        },
        {
            "id": "h16",
            "source": "Ôn Bệnh Điều Biện - Ngô Cúc Thông (Thời Thanh)",
            "name": "Tang Cúc Ẩm",
            "scientific": "Ôn Bệnh Điều Biện",
            "category": "Giải độc",
            "usage": "Sơ phong thanh nhiệt, tuyên phế chỉ khái. Trị cảm mạo mới phát.",
            "emoji": "🌼",
            "image": "./images/bai_thuoc/tang_cuc_am.png",
            "fallbackImage": "./images/bai_thuoc/tang_cuc_am.png",
            "ingredients": "Tang diệp, Cúc hoa, Liên kiều, Bạc hà, Cát cánh, Hạnh nhân, Cam thảo, Lô căn.",
            "efficacy": "Trị ho do phong nhiệt, sốt nhẹ, miệng hơi khát.",
            "time": "Sắc nhanh: 15 phút",
            "steps": [
                "Sắc lửa to trong thời gian ngắn để giữ tinh dầu.",
                "Uống ấm."
            ],
            "benefits": "Giảm ho nhanh, sáng mắt, dịu cổ họng.",
            "keywords": "tang cuc am, cam cum, ho khan, thanh nhiet",
            "contraindications": "Cảm mạo phong hàn (sợ lạnh nhiều, không sợ nóng, ho đờm trắng loãng, không khát).",
            "dosage": "Ngày sắc uống 1 thang sắc nhanh lửa to chia làm 2 lần uống ấm trong ngày.",
            "referenceDetail": "Ôn Bệnh Điều Biện, Ngô Cúc Thông, NXB Y Học, ISBN: 978-604-82-3841-4."
        },
        {
            "id": "h17",
            "source": "Y Lâm Cải Lỗi - Vương Thanh Nhậm (Thời Thanh)",
            "name": "Huyết Phủ Trục Ứ Thang",
            "scientific": "Y Lâm Cải Lỗi",
            "category": "Chữa bệnh",
            "usage": "Hoạt huyết hóa ứ, hành khí chỉ thống. Trị đau tức ngực.",
            "emoji": "❤️",
            "image": "./images/bai_thuoc/huyet_phu_truc_u.png",
            "fallbackImage": "./images/bai_thuoc/huyet_phu_truc_u.png",
            "ingredients": "Đương quy, Sinh địa, Đào nhân, Hồng hoa, Chỉ xác, Xích thược, Sài hồ, Cam thảo, Cát cánh, Xuyên khung, Ngưu tất.",
            "efficacy": "Trị huyết ứ ở ngực gây đau thắt ngực, mất ngủ lâu ngày, đau đầu dai dẳng.",
            "time": "Sắc uống: 60 phút",
            "steps": [
                "Sắc lửa nhỏ kỹ với 3 bát nước cạn còn 1 bát.",
                "Uống ấm sau ăn."
            ],
            "benefits": "Cải thiện tuần hoàn máu mạch vành, giảm đau thắt ngực, mờ vết bầm tím.",
            "keywords": "huyet phu truc u, dau nguc, hoat huyet, tim mach",
            "contraindications": "Tuyệt đối không dùng cho phụ nữ có thai hoặc người đang bị xuất huyết cấp tính, rong kinh nặng.",
            "dosage": "Ngày uống 1 thang sắc ấm chia làm 2 lần uống sau bữa ăn.",
            "referenceDetail": "Y Lâm Cải Sai, Vương Thanh Nhậm (Thời Thanh), NXB Y Học (Trang 90)."
        },
        {
            "id": "h18",
            "source": "Thương Hàn Trực Cách - Lưu Hoàn Tố (Thời Kim - Nguyên)",
            "name": "Lục Nhất Tán",
            "scientific": "Thương Hàn Trực Cách",
            "category": "Giải độc",
            "usage": "Thanh thử lợi thấp. Trị trúng nắng mùa hè.",
            "emoji": "☀️",
            "image": "./images/bai_thuoc/luc_nhat_tan.png",
            "fallbackImage": "./images/bai_thuoc/luc_nhat_tan.png",
            "ingredients": "Hoạt thạch (6 phần), Cam thảo (1 phần).",
            "efficacy": "Trị chứng thử thấp mùa hè gây tiểu gắt, tiểu buốt, phát sốt, khát nước.",
            "time": "Hòa nước uống: 2 phút",
            "steps": [
                "Tán bột mịn.",
                "Mỗi lần lấy 9-12g hòa với nước lọc hoặc nước chanh để uống."
            ],
            "benefits": "Giải nhiệt siêu tốc, lợi tiểu, mát gan, phòng ngừa say nắng.",
            "keywords": "luc nhat tan, say nang, loi tieu, giai nhiet",
            "contraindications": "Tuyệt đối không dùng cho người tỳ vị hư hàn, tiêu lỏng, âm thư hỏa suy. Thận trọng với hội chứng hàn nhập lý tỳ vị.",
            "dosage": "Ngày sắc uống 1 thang ấm chia làm 2 lần trong ngày.",
            "referenceDetail": "Ôn Bệnh Điều Biện, Ngô Cúc Thông (Thời Thanh), NXB Y Học (Trang 115)."
        },
        {
            "id": "h19",
            "source": "Đan Khê Tâm Pháp - Chu Đan Khê (Thời Nguyên)",
            "name": "Việt Cúc Hoàn",
            "scientific": "Đan Khê Tâm Pháp",
            "category": "Chữa bệnh",
            "usage": "Hành khí giải uất. Trị 6 loại uất (Khí, Huyết, Đờm, Hỏa, Thấp, Thực).",
            "emoji": "🌀",
            "image": "./images/bai_thuoc/viet_cuc_hoan.png",
            "fallbackImage": "./images/bai_thuoc/viet_cuc_hoan.png",
            "ingredients": "Hương phụ, Xuyên khung, Thương truật, Chi tử, Thần khúc.",
            "efficacy": "Trị chứng ngực bụng đầy tức, ở chua, khó tiêu do tâm lý căng thẳng.",
            "time": "Dạng viên hoàn: Uống trực tiếp",
            "steps": [
                "Làm viên hoàn nhỏ.",
                "Uống mỗi lần 6-9g với nước ấm."
            ],
            "benefits": "Giải tỏa stress, hết ợ hơi, giảm đầy bụng khó tiêu.",
            "keywords": "viet cuc hoan, giai uat, cang thang, tress, kho tieu",
            "contraindications": "Ho khan không đờm do phế âm hư tổn, ho ra máu tươi.",
            "dosage": "Ngày sắc uống 1 thang chia làm 2 lần ấm trước ăn.",
            "referenceDetail": "Hòa Tễ Cục Phương, Bản dịch Viện Nghiên cứu Đông y Việt Nam (Trang 230)."
        },
        {
            "id": "h20",
            "source": "Ôn Bệnh Điều Biện - Ngô Cúc Thông (Thời Thanh)",
            "name": "Thanh Dinh Thang",
            "scientific": "Ôn Bệnh Điều Biện",
            "category": "Chữa bệnh",
            "usage": "Thanh dinh thấu nhiệt, tư âm giải độc. Trị sốt cao mê sảng.",
            "emoji": "🩸",
            "image": "./images/bai_thuoc/thanh_dinh_thang.png",
            "fallbackImage": "./images/bai_thuoc/thanh_dinh_thang.png",
            "ingredients": "Tê giác (thay bằng Thủy ngưu giác), Sinh địa, Huyền sâm, Trúc diệp tâm, Mạch môn, Đan sâm, Hoàng liên, Kim ngân hoa, Liên kiều.",
            "efficacy": "Trị tà nhiệt truyền vào dinh phận, sốt cao về đêm, bứt rứt, mê sảng, ban đỏ.",
            "time": "Sắc uống: 60 phút",
            "steps": [
                "Sắc sừng trâu nước trước 30 phút.",
                "Sau đó cho các vị khác vào sắc chung.",
                "Uống ấm."
            ],
            "benefits": "Bảo vệ não bộ khỏi sốt cao co giật, giải độc máu mạnh mẽ.",
            "keywords": "thanh dinh thang, sot cao, me sang, ban do, giai doc",
            "contraindications": "Người tỳ vị hư nhược, đại tiện tiêu lỏng kéo dài.",
            "dosage": "Ngày sắc uống 1 thang ấm chia làm 3 lần uống sau ăn.",
            "referenceDetail": "Dược điển Việt Nam V, Bộ Y Tế, NXB Y Học (Trang 1190)."
        }
    ]
};

if (typeof window !== 'undefined') {
    const CURRENT_DB_VERSION = 'eco_heritage_db_v8';
    // CHỈ ghi nếu chưa có — không overwrite data người dùng
    if (!localStorage.getItem(CURRENT_DB_VERSION)) {
        localStorage.setItem(CURRENT_DB_VERSION, JSON.stringify(EcoHeritageDefaultData));
    }
}
