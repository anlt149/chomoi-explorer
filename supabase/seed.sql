-- seed: Initial data for Cho Moi restaurants
INSERT INTO public.restaurants (name, phone, image_url, category, has_delivery, rating, address, description, "openTime", "closeTime")
VALUES
('Bún Mắm Cô Thủy', '0912345678', 'https://images.unsplash.com/photo-1555126634-323283e09096?w=500&q=80', 'Bún/Phở', true, 4.8, 'Khu vực Chợ Mới, Thị Trấn Chợ Mới, Huyện Chợ Mới, An Giang', 'Bún mắm ngon nổi tiếng khu vực chợ, nước dùng đậm đà miền Tây.', '06:00', '20:00'),
('Bánh Xèo Rau Sạch Phương Nam', '0987654321', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80', 'Ăn vặt', false, 4.5, 'Đường Tỉnh 942, Thị Trấn Chợ Mới, Huyện Chợ Mới, An Giang', 'Bánh xèo miền Tây vỏ giòn rụm, cuốn rau hái tại vườn.', '15:00', '22:00'),
('Quán Ốc Cầu Ông Chưởng', '0909090909', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', 'Lẩu/Nướng', true, 4.2, 'Gần Cầu Ông Chưởng, Thị Trấn Chợ Mới, Huyện Chợ Mới, An Giang', 'Chuyên ốc bươu nướng tiêu xanh, lẩu thái hải sản ven sông.', '16:00', '23:30'),
('Cơm Tấm Lò Muối', '0123456789', 'https://images.unsplash.com/photo-1623653387945-2fd2540b0805?w=500&q=80', 'Cơm', true, 4.6, 'Ấp Thị 1, Thị Trấn Chợ Mới, Huyện Chợ Mới, An Giang', 'Sườn nướng bì chả ngon, rẻ, phục vụ nhanh khu lò muối cũ.', '06:00', '13:00'),
('Ăn Vặt Bờ Kè Cái Hố', '0933221144', 'https://plus.unsplash.com/premium_photo-1674106347895-655bdef822b3?w=500&q=80', 'Ăn vặt', false, 4.0, 'Bờ Kè Cái Hố, Thị Trấn Chợ Mới, Huyện Chợ Mới, An Giang', 'Xiên nướng, bánh tráng nướng dọc bờ kè buổi tối mát mẻ.', '17:00', '23:00')
ON CONFLICT DO NOTHING;
