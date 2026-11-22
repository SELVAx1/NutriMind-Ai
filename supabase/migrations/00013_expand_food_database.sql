-- Add missing columns to food_items for better filtering and UI
ALTER TABLE food_items
  ADD COLUMN IF NOT EXISTS is_veg boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_jain boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS typical_portion_g numeric DEFAULT 150,
  ADD COLUMN IF NOT EXISTS estimated_cost_inr numeric DEFAULT 20,
  ADD COLUMN IF NOT EXISTS prep_time_min int DEFAULT 15,
  ADD COLUMN IF NOT EXISTS glycemic_index text CHECK (glycemic_index IN ('low','medium','high')) DEFAULT 'medium';

-- Update existing 40 foods with is_veg, portion, cost
UPDATE food_items SET is_veg = true, is_jain = false, typical_portion_g = 150, estimated_cost_inr = 15 WHERE name = 'Idli';
UPDATE food_items SET is_veg = true, typical_portion_g = 120, estimated_cost_inr = 20 WHERE name = 'Dosa (plain)';
UPDATE food_items SET is_veg = true, typical_portion_g = 150, estimated_cost_inr = 10 WHERE name = 'Sambar';
UPDATE food_items SET is_veg = true, typical_portion_g = 150, estimated_cost_inr = 8 WHERE name = 'Rasam';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 20 WHERE name = 'Cooked rice';
UPDATE food_items SET is_veg = true, typical_portion_g = 60, estimated_cost_inr = 5 WHERE name = 'Chapati';
UPDATE food_items SET is_veg = true, typical_portion_g = 150, estimated_cost_inr = 15 WHERE name = 'Dal (toor)';
UPDATE food_items SET is_veg = true, typical_portion_g = 100, estimated_cost_inr = 10 WHERE name = 'Curd (plain)';
UPDATE food_items SET is_veg = false, typical_portion_g = 50, estimated_cost_inr = 8 WHERE name = 'Egg (boiled)';
UPDATE food_items SET is_veg = true, typical_portion_g = 120, estimated_cost_inr = 5 WHERE name = 'Banana';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 5 WHERE name = 'Buttermilk';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 10 WHERE name = 'Milk (whole)';
UPDATE food_items SET is_veg = true, typical_portion_g = 30, estimated_cost_inr = 10 WHERE name = 'Groundnut';
UPDATE food_items SET is_veg = true, typical_portion_g = 60, estimated_cost_inr = 8 WHERE name = 'Roti';
UPDATE food_items SET is_veg = true, typical_portion_g = 80, estimated_cost_inr = 15 WHERE name = 'Paratha (plain)';
UPDATE food_items SET is_veg = true, typical_portion_g = 60, estimated_cost_inr = 12 WHERE name = 'Poori';
UPDATE food_items SET is_veg = true, typical_portion_g = 80, estimated_cost_inr = 15 WHERE name = 'Vada';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 25 WHERE name = 'Paneer butter masala';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 25 WHERE name = 'Palak paneer';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 15 WHERE name = 'Rajma';
UPDATE food_items SET is_veg = true, typical_portion_g = 200, estimated_cost_inr = 15 WHERE name = 'Aloo gobi';
UPDATE food_items SET is_veg = true, typical_portion_g = 250, estimated_cost_inr = 30 WHERE name = 'Biryani (veg)';
UPDATE food_items SET is_veg = true, typical_portion_g = 50, estimated_cost_inr = 10 WHERE name = 'Soy chunks';

-- ============================================================
-- 160+ NEW INDIAN FOODS — IFCT 2017 approximate values
-- ============================================================

-- BREAKFAST ITEMS (20 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Masala dosa', 'மசாலா தோசை', 'मसाला डोसा', 'breakfast', 'South Indian', 'IFCT', true, true, 180, 30),
('Rava dosa', 'ரவா தோசை', 'रवा डोसा', 'breakfast', 'South Indian', 'IFCT', true, true, 150, 25),
('Uttapam', 'ஊத்தப்பம்', 'उत्तपम', 'breakfast', 'South Indian', 'IFCT', true, true, 150, 20),
('Pesarattu', NULL, 'पेसारट्टू', 'breakfast', 'South Indian', 'IFCT', true, true, 150, 15),
('Oats porridge', 'ஓட்ஸ் கஞ்சி', 'ओट्स दलिया', 'breakfast', 'All India', 'manual', true, true, 200, 15),
('Aloo paratha', 'உருளை பராத்தா', 'आलू पराठा', 'breakfast', 'North Indian', 'IFCT', true, true, 100, 20),
('Gobi paratha', NULL, 'गोभी पराठा', 'breakfast', 'North Indian', 'IFCT', true, true, 100, 20),
('Methi paratha', NULL, 'मेथी पराठा', 'breakfast', 'North Indian', 'IFCT', true, true, 100, 18),
('Moong dal chilla', 'பாசிப் பயறு தோசை', 'मूंग दाल चीला', 'breakfast', 'North Indian', 'IFCT', true, true, 120, 15),
('Bread toast (butter)', 'பிரெட்', 'ब्रेड टोस्ट', 'breakfast', 'All India', 'manual', true, true, 60, 10),
('Cornflakes with milk', NULL, 'कॉर्नफ्लेक्स', 'breakfast', 'All India', 'manual', true, true, 45, 20),
('Poori bhaji', 'பூரி பாஜி', 'पूरी भाजी', 'breakfast', 'All India', 'IFCT', true, true, 200, 25),
('Sabudana khichdi', NULL, 'साबूदाना खिचड़ी', 'breakfast', 'West Indian', 'IFCT', true, true, 200, 20),
('Kanda poha', NULL, 'कांदा पोहा', 'breakfast', 'West Indian', 'IFCT', true, true, 200, 15),
('Misal pav', NULL, 'मिसल पाव', 'breakfast', 'West Indian', 'IFCT', true, true, 250, 30),
('Rava upma', 'ரவா உப்புமா', 'रवा उपमा', 'breakfast', 'South Indian', 'IFCT', true, true, 200, 15),
('Paniyaram', 'பணியாரம்', 'पनियारम', 'breakfast', 'South Indian', 'IFCT', true, true, 120, 15),
('Egg omelette', 'முட்டை ஆம்லெட்', 'अंडा ऑमलेट', 'breakfast', 'All India', 'IFCT', false, false, 100, 15),
('Bread sandwich (veg)', NULL, 'वेज सैंडविच', 'breakfast', 'All India', 'manual', true, true, 150, 20),
('Wheat dosa', 'கோதுமை தோசை', 'गेहूं डोसा', 'breakfast', 'South Indian', 'IFCT', true, true, 120, 15);

-- RICE DISHES (10 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Tomato rice', 'தக்காளி சாதம்', 'टमाटर चावल', 'rice', 'South Indian', 'IFCT', true, true, 250, 15),
('Tamarind rice', 'புளியோதரை', 'इमली चावल', 'rice', 'South Indian', 'IFCT', true, true, 250, 15),
('Coconut rice', 'தேங்காய் சாதம்', 'नारियल चावल', 'rice', 'South Indian', 'IFCT', true, true, 250, 18),
('Jeera rice', NULL, 'जीरा चावल', 'rice', 'North Indian', 'IFCT', true, true, 200, 15),
('Pulao (veg)', 'புலாவ்', 'पुलाव', 'rice', 'All India', 'IFCT', true, true, 250, 25),
('Khichdi', 'கிச்சடி', 'खिचड़ी', 'rice', 'All India', 'IFCT', true, true, 250, 15),
('Chicken biryani', 'சிக்கன் பிரியாணி', 'चिकन बिरयानी', 'rice', 'All India', 'IFCT', false, false, 300, 60),
('Egg biryani', 'முட்டை பிரியாணி', 'अंडा बिरयानी', 'rice', 'All India', 'IFCT', false, false, 300, 45),
('Brown rice (cooked)', 'பிரவுன் அரிசி', 'ब्राउन राइस', 'rice', 'All India', 'IFCT', true, true, 200, 20),
('Bagara rice', NULL, 'बगारा चावल', 'rice', 'South Indian', 'IFCT', true, true, 250, 20);

-- CURRIES & DALS (25 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Chana masala', 'சென்னா மசாலா', 'चना मसाला', 'curry', 'North Indian', 'IFCT', true, true, 200, 20),
('Chole', NULL, 'छोले', 'curry', 'North Indian', 'IFCT', true, true, 200, 20),
('Dal makhani', 'தால் மக்கனி', 'दाल मखनी', 'curry', 'North Indian', 'IFCT', true, true, 200, 30),
('Moong dal', 'பாசிப் பருப்பு', 'मूंग दाल', 'curry', 'All India', 'IFCT', true, true, 200, 12),
('Masoor dal', NULL, 'मसूर दाल', 'curry', 'All India', 'IFCT', true, true, 200, 12),
('Kadhi', NULL, 'कढ़ी', 'curry', 'North Indian', 'IFCT', true, true, 200, 15),
('Baingan bharta', NULL, 'बैंगन भर्ता', 'curry', 'North Indian', 'IFCT', true, true, 150, 15),
('Bhindi masala', 'வெண்டை மசாலா', 'भिंडी मसाला', 'curry', 'All India', 'IFCT', true, true, 150, 15),
('Matar paneer', NULL, 'मटर पनीर', 'curry', 'North Indian', 'IFCT', true, true, 200, 30),
('Shahi paneer', NULL, 'शा���ी पनीर', 'curry', 'North Indian', 'IFCT', true, true, 200, 35),
('Mixed veg curry', 'காய்கறி கூட்டு', 'मिक्स वेज', 'curry', 'All India', 'IFCT', true, true, 200, 18),
('Egg curry', 'முட்டை குழம்பு', 'अंडा करी', 'curry', 'All India', 'IFCT', false, false, 200, 25),
('Chicken curry', 'சிக்கன் குழம்பு', 'चिकन करी', 'curry', 'All India', 'IFCT', false, false, 200, 50),
('Fish curry', 'மீன் குழம்பு', 'मछली करी', 'curry', 'South Indian', 'IFCT', false, false, 200, 45),
('Mutton curry', 'மட்டன் குழம்பு', 'मटन करी', 'curry', 'All India', 'IFCT', false, false, 200, 70),
('Avial', 'அவியல்', 'अवियल', 'curry', 'South Indian', 'IFCT', true, true, 150, 20),
('Olan', 'ஓலன்', NULL, 'curry', 'South Indian', 'IFCT', true, true, 150, 15),
('Keerai masiyal', 'கீரை மசியல்', 'साग', 'curry', 'South Indian', 'IFCT', true, true, 100, 10),
('Mor kuzhambu', 'மோர் குழம்பு', NULL, 'curry', 'South Indian', 'IFCT', true, true, 200, 10),
('Vattha kuzhambu', 'வத்தக்குழம்பு', NULL, 'curry', 'South Indian', 'IFCT', true, true, 200, 12),
('Paal kozhukattai', 'பால் கொழுக்கட்டை', NULL, 'dessert', 'South Indian', 'IFCT', true, true, 150, 20),
('Theeyal', 'தீயல்', NULL, 'curry', 'South Indian', 'IFCT', true, true, 150, 15),
('Kadala curry', NULL, NULL, 'curry', 'South Indian', 'IFCT', true, true, 200, 15),
('Erissery', NULL, NULL, 'curry', 'South Indian', 'IFCT', true, true, 200, 18),
('Vendakkai puli kuzhambu', 'வெண்டைக்காய் புளிக்குழம்பு', NULL, 'curry', 'South Indian', 'IFCT', true, true, 200, 12);

-- SNACKS & STREET FOOD (20 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Samosa', 'சமோசா', 'समोसा', 'snack', 'All India', 'IFCT', true, true, 80, 15),
('Vada pav', NULL, 'वडा पाव', 'snack', 'West Indian', 'IFCT', true, true, 150, 20),
('Bhel puri', NULL, 'भेल पूरी', 'snack', 'West Indian', 'IFCT', true, true, 150, 20),
('Pani puri', 'பானி பூரி', 'पानी पूरी', 'snack', 'All India', 'IFCT', true, true, 120, 20),
('Pakora (mixed veg)', 'பக்கோடா', 'पकोड़ा', 'snack', 'All India', 'IFCT', true, true, 100, 15),
('Bajji (banana)', 'வாழைக்காய் பஜ்ஜி', 'बज्जी', 'snack', 'South Indian', 'IFCT', true, true, 100, 15),
('Bonda', 'போண்டா', 'बोंडा', 'snack', 'South Indian', 'IFCT', true, true, 80, 12),
('Murukku', 'முறுக்கு', 'मुरुक्कू', 'snack', 'South Indian', 'IFCT', true, true, 30, 10),
('Mixture (snack)', 'மிக்ஸர்', 'मिक्सचर', 'snack', 'South Indian', 'IFCT', true, true, 30, 10),
('Roasted chana', 'பொட்டுக்கடலை', 'भुना चना', 'snack', 'All India', 'IFCT', true, true, 30, 5),
('Masala peanuts', 'மசாலா வேர்க்கடலை', 'मसाला मूंगफली', 'snack', 'All India', 'IFCT', true, true, 30, 10),
('Cutlet (veg)', 'கட்லெட்', 'कटलेट', 'snack', 'All India', 'IFCT', true, true, 80, 15),
('Spring roll', NULL, 'स्प्रिंग रोल', 'snack', 'All India', 'manual', true, true, 100, 20),
('Pav bhaji', NULL, 'पाव भाजी', 'snack', 'West Indian', 'IFCT', true, true, 250, 30),
('Dhokla', NULL, 'ढोकला', 'snack', 'West Indian', 'IFCT', true, true, 100, 15),
('Kachori', NULL, 'कचौरी', 'snack', 'North Indian', 'IFCT', true, true, 60, 12),
('Aloo tikki', NULL, 'आलू टिक्की', 'snack', 'North Indian', 'IFCT', true, true, 80, 15),
('Dahi vada', 'தயிர் வடை', 'दही वड़ा', 'snack', 'All India', 'IFCT', true, true, 150, 20),
('Peanut chikki', 'கடலை மிட்டாய்', 'चिक्की', 'snack', 'All India', 'IFCT', true, true, 30, 10),
('Banana chips', 'வாழைக்காய் சிப்ஸ்', 'केला चिप्स', 'snack', 'South Indian', 'IFCT', true, true, 30, 10);

-- FRUITS & VEGETABLES (20 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Apple', 'ஆப்பிள்', 'सेब', 'fruit', 'All India', 'IFCT', true, true, 150, 15),
('Mango', 'மாம்பழம்', 'आम', 'fruit', 'All India', 'IFCT', true, true, 150, 15),
('Papaya', 'பப்பாளி', 'पपीता', 'fruit', 'All India', 'IFCT', true, true, 150, 10),
('Guava', 'கொய்யா', 'अमरूद', 'fruit', 'All India', 'IFCT', true, true, 100, 8),
('Orange', 'ஆரஞ்சு', 'संतरा', 'fruit', 'All India', 'IFCT', true, true, 130, 10),
('Watermelon', 'தர்பூசணி', 'तरबूज', 'fruit', 'All India', 'IFCT', true, true, 200, 10),
('Pomegranate', 'மாதுளை', 'अनार', 'fruit', 'All India', 'IFCT', true, true, 100, 20),
('Grapes', 'திராட்சை', 'अंगूर', 'fruit', 'All India', 'IFCT', true, true, 100, 15),
('Chikoo (sapota)', 'சப்போட்டா', 'चीकू', 'fruit', 'All India', 'IFCT', true, true, 100, 10),
('Jackfruit', 'பலாப்பழம்', 'कटहल', 'fruit', 'South Indian', 'IFCT', true, true, 100, 10),
('Drumstick (moringa)', 'முருங்கை', 'सहजन', 'vegetable', 'South Indian', 'IFCT', true, true, 50, 8),
('Curry leaves', 'கறிவேப்பிலை', 'करी पत्ता', 'condiment', 'South Indian', 'IFCT', true, true, 5, 2),
('Bitter gourd', 'பாகற்காய்', 'करेला', 'vegetable', 'All India', 'IFCT', true, true, 100, 8),
('Bottle gourd', 'சுரைக்காய்', 'लौकी', 'vegetable', 'All India', 'IFCT', true, true, 150, 8),
('Ridge gourd', 'பீர்க்கங்காய்', 'तोरी', 'vegetable', 'All India', 'IFCT', true, true, 100, 8),
('Snake gourd', 'புடலங்காய்', 'चिचिंडा', 'vegetable', 'South Indian', 'IFCT', true, true, 100, 8),
('Brinjal (eggplant)', 'கத்திரிக்காய்', 'बैंगन', 'vegetable', 'All India', 'IFCT', true, true, 100, 8),
('Tomato', 'தக்காளி', 'टमाटर', 'vegetable', 'All India', 'IFCT', true, true, 100, 5),
('Onion', 'வெங்காயம்', 'प्याज', 'vegetable', 'All India', 'IFCT', true, true, 50, 3),
('Potato', 'உருளைக்கிழங்கு', 'आलू', 'vegetable', 'All India', 'IFCT', true, true, 150, 5);

-- SWEETS & DESSERTS (15 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Gulab jamun', 'குலாப் ஜாமூன்', 'गुलाब जामुन', 'dessert', 'All India', 'IFCT', true, true, 60, 15),
('Jalebi', 'ஜிலேபி', 'जलेबी', 'dessert', 'All India', 'IFCT', true, true, 60, 12),
('Rasgulla', NULL, 'रसगुल्ला', 'dessert', 'East Indian', 'IFCT', true, true, 80, 15),
('Halwa (sooji)', 'அல்வா', 'हलवा', 'dessert', 'All India', 'IFCT', true, true, 80, 15),
('Payasam (vermicelli)', 'பாயசம்', 'खीर', 'dessert', 'South Indian', 'IFCT', true, true, 150, 15),
('Laddu (besan)', 'லட்டு', 'लड्डू', 'dessert', 'All India', 'IFCT', true, true, 40, 10),
('Mysore pak', 'மைசூர் பாக்', 'मैसूर पाक', 'dessert', 'South Indian', 'IFCT', true, true, 40, 15),
('Kesari', 'கேசரி', 'केसरी', 'dessert', 'South Indian', 'IFCT', true, true, 80, 12),
('Gajar halwa', NULL, 'गाजर हलवा', 'dessert', 'North Indian', 'IFCT', true, true, 80, 18),
('Kulfi', NULL, 'कुल्फी', 'dessert', 'North Indian', 'IFCT', true, true, 80, 20),
('Kheer (rice)', NULL, 'खीर', 'dessert', 'North Indian', 'IFCT', true, true, 150, 15),
('Sandesh', NULL, 'संदेश', 'dessert', 'East Indian', 'IFCT', true, true, 40, 12),
('Shrikhand', NULL, 'श्रीखंड', 'dessert', 'West Indian', 'IFCT', true, true, 100, 20),
('Modak', 'கொழுக்கட்டை', 'मोदक', 'dessert', 'West Indian', 'IFCT', true, true, 60, 12),
('Adhirasam', 'அதிரசம்', NULL, 'dessert', 'South Indian', 'IFCT', true, true, 50, 10);

-- BEVERAGES (10 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Filter coffee', 'ஃபில்டர் காபி', 'फिल्टर कॉफी', 'beverage', 'South Indian', 'manual', true, true, 150, 15),
('Lassi (sweet)', NULL, 'लस्सी', 'beverage', 'North Indian', 'IFCT', true, true, 200, 15),
('Lassi (salted)', NULL, 'नमकीन लस्सी', 'beverage', 'North Indian', 'IFCT', true, true, 200, 12),
('Tender coconut water', 'இளநீர்', 'नारियल पानी', 'beverage', 'South Indian', 'IFCT', true, true, 200, 25),
('Sugarcane juice', 'கரும்பு ஜூஸ்', 'गन्ने का रस', 'beverage', 'All India', 'IFCT', true, true, 200, 15),
('Jaljeera', NULL, 'जलजीरा', 'beverage', 'North Indian', 'manual', true, true, 200, 10),
('Aam panna', NULL, 'आम पन्ना', 'beverage', 'North Indian', 'manual', true, true, 200, 12),
('Badam milk', 'பாதாம் பால்', 'बादाम दूध', 'beverage', 'All India', 'manual', true, true, 200, 20),
('Nimbu pani (lemon water)', 'எலுமிச்சை ஜூஸ்', 'नींबू पानी', 'beverage', 'All India', 'manual', true, true, 200, 5),
('Masala chai', 'மசாலா டீ', 'मसाला चाय', 'beverage', 'All India', 'manual', true, true, 150, 10);

-- PROTEIN SOURCES (15 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Paneer (raw)', 'பன்னீர்', 'पनीर', 'protein', 'All India', 'IFCT', true, true, 100, 30),
('Tofu', 'டோஃபு', 'टोफू', 'protein', 'All India', 'manual', true, true, 100, 25),
('Chicken breast (cooked)', 'சிக்கன் மார்பு', 'चिकन ब्रेस्ट', 'protein', 'All India', 'IFCT', false, false, 150, 45),
('Fish fry', 'மீன் வறுவல்', 'मछली फ्राई', 'protein', 'South Indian', 'IFCT', false, false, 120, 40),
('Prawn fry', 'இறால் வறுவல்', 'झींगा फ्राई', 'protein', 'South Indian', 'IFCT', false, false, 100, 50),
('Egg bhurji', 'முட்டை பொடிமாஸ்', 'अंडा भुर्जी', 'protein', 'All India', 'IFCT', false, false, 150, 20),
('Tandoori chicken', 'தந்தூரி சிக்கன்', 'तंदूरी चिकन', 'protein', 'North Indian', 'IFCT', false, false, 150, 60),
('Chicken tikka', NULL, 'चिकन टिक्का', 'protein', 'North Indian', 'IFCT', false, false, 150, 55),
('Mutton keema', NULL, 'कीमा', 'protein', 'North Indian', 'IFCT', false, false, 150, 70),
('Liver (chicken)', NULL, 'चिकन लीवर', 'protein', 'All India', 'IFCT', false, false, 100, 25),
('Whey protein (scoop)', NULL, 'व्हे प्रोटीन', 'protein', 'All India', 'manual', true, true, 30, 30),
('Sattu drink', NULL, 'सत्तू', 'protein', 'East Indian', 'IFCT', true, true, 200, 10),
('Sprouts salad', 'முளை கட்டிய பயறு', 'स्प्राउट्स सलाद', 'protein', 'All India', 'IFCT', true, true, 100, 10),
('Black chana (dry)', NULL, 'काला चना', 'protein', 'All India', 'IFCT', true, true, 50, 8),
('Peanut butter', NULL, 'पीनट बटर', 'protein', 'All India', 'manual', true, true, 30, 20);

-- RAW GRAINS & STAPLES (10 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Ragi mudde', 'ராகி முட்டை', 'रागी मुड्डे', 'staple', 'South Indian', 'IFCT', true, true, 150, 10),
('Jowar roti', NULL, 'ज्वार रोटी', 'staple', 'West Indian', 'IFCT', true, true, 60, 5),
('Bajra roti', NULL, 'बाजरा रोटी', 'staple', 'North Indian', 'IFCT', true, true, 60, 5),
('Naan', 'நான்', 'नान', 'staple', 'North Indian', 'IFCT', true, false, 80, 15),
('Kulcha', NULL, 'कुलचा', 'staple', 'North Indian', 'IFCT', true, false, 80, 15),
('Bhatura', NULL, 'भटूरा', 'staple', 'North Indian', 'IFCT', true, true, 80, 15),
('Thepla', NULL, 'थेपला', 'staple', 'West Indian', 'IFCT', true, true, 60, 8),
('Dosa (masala stuffed)', 'மசாலா தோசை', 'मसाला डोसा', 'staple', 'South Indian', 'IFCT', true, true, 200, 30),
('Idiyappam', 'இடியாப்பம்', 'इडियप्पम', 'staple', 'South Indian', 'IFCT', true, true, 100, 12),
('Pathiri', 'பத்திரி', NULL, 'staple', 'South Indian', 'IFCT', true, true, 60, 8);

-- PACKAGED / COMMON DAILY ITEMS (10 new)
INSERT INTO food_items (name, name_tamil, name_hindi, category, region, source, is_common, is_veg, typical_portion_g, estimated_cost_inr) VALUES
('Maggi noodles', 'மேகி', 'मैगी', 'snack', 'All India', 'manual', true, true, 70, 14),
('White bread (slice)', 'பிரெட்', 'ब्रेड', 'staple', 'All India', 'manual', true, true, 30, 3),
('Whole wheat bread (slice)', NULL, 'आटा ब्रेड', 'staple', 'All India', 'manual', true, true, 30, 4),
('Biscuit (Marie)', 'பிஸ்கட்', 'बिस्किट', 'snack', 'All India', 'manual', true, true, 25, 5),
('Biscuit (cream)', NULL, 'क्रीम बिस्किट', 'snack', 'All India', 'manual', true, true, 25, 5),
('Ghee', 'நெய்', 'घी', 'condiment', 'All India', 'IFCT', true, true, 10, 8),
('Coconut oil', 'தேங்காய் எண்ணெய்', 'नारियल तेल', 'condiment', 'South Indian', 'IFCT', true, true, 10, 3),
('Jaggery', 'வெல்லம்', 'गुड़', 'condiment', 'All India', 'IFCT', true, true, 20, 3),
('Honey', 'தேன்', 'शहद', 'condiment', 'All India', 'IFCT', true, true, 20, 8),
('Sugar (white)', 'சர்க்கரை', 'चीनी', 'condiment', 'All India', 'IFCT', true, true, 10, 1);

-- ============================================================
-- NUTRITIONAL VALUES for all 160+ new foods (per 100g)
-- ============================================================

INSERT INTO nutritional_values (food_item_id, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, sugar_per_100g, sodium_mg, calcium_mg, iron_mg, vitamin_a_mcg, vitamin_b12_mcg, vitamin_c_mg, vitamin_d_mcg, potassium_mg)
SELECT fi.id, v.cal, v.prot, v.carb, v.fat, v.fib, v.sug, v.sod, v.calc, v.iron, v.va, v.vb12, v.vc, v.vd, v.pot
FROM (VALUES
  -- BREAKFAST
  ('Masala dosa',               190, 4.5, 26.0, 7.5, 1.2, 0.5, 280, 25, 1.0, 5, 0, 2, 0, 80),
  ('Rava dosa',                 180, 3.0, 24.0, 8.0, 0.5, 0.3, 250, 15, 0.5, 3, 0, 0, 0, 50),
  ('Uttapam',                   160, 4.0, 25.0, 5.0, 1.5, 0.5, 220, 20, 0.8, 5, 0, 3, 0, 70),
  ('Pesarattu',                 140, 7.0, 18.0, 4.0, 3.0, 0.5, 180, 25, 1.5, 5, 0, 2, 0, 150),
  ('Oats porridge',             110, 4.0, 19.0, 2.0, 2.5, 1.0, 100, 20, 1.5, 0, 0, 0, 0, 130),
  ('Aloo paratha',              250, 5.0, 32.0, 12.0, 2.0, 1.0, 300, 20, 1.2, 8, 0, 5, 0, 180),
  ('Gobi paratha',              230, 5.5, 30.0, 10.0, 2.5, 1.5, 280, 25, 1.0, 10, 0, 20, 0, 160),
  ('Methi paratha',             240, 6.0, 30.0, 11.0, 3.0, 1.0, 280, 30, 2.5, 50, 0, 5, 0, 170),
  ('Moong dal chilla',          150, 8.0, 18.0, 5.0, 2.0, 0.5, 200, 25, 1.5, 5, 0, 2, 0, 180),
  ('Bread toast (butter)',      310, 8.0, 42.0, 12.0, 2.5, 2.0, 450, 50, 1.5, 30, 0, 0, 0, 100),
  ('Cornflakes with milk',      370, 8.0, 80.0, 1.5, 3.0, 8.0, 700, 10, 8.0, 0, 0, 0, 0, 120),
  ('Poori bhaji',               280, 5.0, 32.0, 15.0, 2.5, 1.0, 350, 25, 1.5, 10, 0, 8, 0, 200),
  ('Sabudana khichdi',          180, 1.5, 32.0, 6.0, 0.5, 0.3, 200, 15, 0.5, 5, 0, 2, 0, 100),
  ('Kanda poha',                170, 3.0, 30.0, 5.0, 1.0, 0.5, 220, 15, 1.2, 3, 0, 3, 0, 60),
  ('Misal pav',                 200, 7.0, 28.0, 7.0, 4.0, 2.0, 400, 35, 2.0, 10, 0, 5, 0, 200),
  ('Rava upma',                 155, 3.5, 23.0, 5.5, 1.5, 0.5, 280, 15, 1.0, 5, 0, 0, 0, 50),
  ('Paniyaram',                 180, 4.0, 28.0, 5.5, 1.0, 0.5, 200, 15, 0.8, 3, 0, 0, 0, 60),
  ('Egg omelette',              200, 14.0, 1.5, 16.0, 0, 1.0, 300, 60, 1.5, 180, 1.2, 0, 2, 150),
  ('Bread sandwich (veg)',      190, 5.0, 25.0, 8.0, 2.0, 1.5, 350, 30, 1.0, 10, 0, 5, 0, 120),
  ('Wheat dosa',                180, 5.0, 28.0, 5.0, 2.5, 1.0, 200, 20, 1.5, 5, 0, 0, 0, 80),
  -- RICE DISHES
  ('Tomato rice',               160, 2.8, 28.0, 4.0, 0.8, 1.0, 250, 15, 0.8, 15, 0, 8, 0, 120),
  ('Tamarind rice',             175, 2.5, 30.0, 5.0, 1.0, 0.5, 300, 12, 0.8, 5, 0, 3, 0, 80),
  ('Coconut rice',              190, 3.0, 28.0, 7.5, 1.5, 0.5, 200, 15, 0.5, 2, 0, 1, 0, 90),
  ('Jeera rice',                155, 3.0, 28.0, 3.5, 0.5, 0.2, 180, 12, 0.5, 3, 0, 0, 0, 40),
  ('Pulao (veg)',               165, 3.5, 25.0, 5.5, 1.0, 0.5, 300, 18, 0.8, 10, 0, 3, 0, 100),
  ('Khichdi',                   130, 4.5, 20.0, 3.0, 1.5, 0.5, 200, 20, 1.0, 5, 0, 2, 0, 120),
  ('Chicken biryani',           200, 10.0, 22.0, 8.0, 0.5, 0.3, 400, 20, 1.2, 15, 0.2, 2, 0, 150),
  ('Egg biryani',               185, 8.0, 24.0, 6.5, 0.5, 0.3, 380, 25, 1.0, 50, 0.3, 1, 0, 130),
  ('Brown rice (cooked)',       120, 2.6, 25.0, 1.0, 1.8, 0.1, 5, 10, 0.5, 0, 0, 0, 0, 50),
  ('Bagara rice',               160, 2.5, 27.0, 5.0, 0.5, 0.2, 250, 12, 0.5, 5, 0, 0, 0, 50),
  -- CURRIES & DALS
  ('Chana masala',              160, 8.0, 22.0, 5.0, 6.0, 2.0, 350, 50, 2.5, 10, 0, 4, 0, 290),
  ('Chole',                     165, 8.5, 23.0, 5.0, 6.5, 2.0, 380, 55, 2.8, 8, 0, 3, 0, 300),
  ('Dal makhani',               140, 6.0, 14.0, 7.0, 3.5, 1.0, 350, 45, 2.0, 15, 0, 2, 0, 250),
  ('Moong dal',                 105, 7.0, 14.0, 2.0, 2.5, 0.8, 200, 30, 1.5, 5, 0, 1, 0, 220),
  ('Masoor dal',                115, 7.5, 16.0, 2.0, 2.0, 0.8, 200, 25, 2.0, 5, 0, 1, 0, 200),
  ('Kadhi',                     90, 3.0, 8.0, 5.0, 0.5, 1.0, 300, 80, 0.5, 15, 0.1, 1, 0, 100),
  ('Baingan bharta',            85, 2.0, 8.0, 5.5, 3.0, 1.5, 250, 20, 0.8, 15, 0, 5, 0, 200),
  ('Bhindi masala',             90, 2.5, 8.0, 5.5, 3.0, 1.0, 250, 65, 0.8, 35, 0, 12, 0, 250),
  ('Matar paneer',              170, 9.0, 8.0, 12.0, 2.0, 1.5, 350, 150, 1.0, 80, 0.1, 5, 0, 150),
  ('Shahi paneer',              200, 8.0, 7.0, 16.0, 0.5, 2.0, 400, 160, 0.5, 100, 0.1, 2, 0, 100),
  ('Mixed veg curry',           85, 3.0, 10.0, 4.0, 2.5, 1.5, 280, 35, 1.0, 40, 0, 10, 0, 200),
  ('Egg curry',                 140, 9.0, 5.0, 10.0, 0.5, 1.0, 350, 55, 1.5, 120, 0.8, 3, 1, 150),
  ('Chicken curry',             165, 15.0, 4.0, 10.0, 0.5, 0.5, 400, 20, 1.2, 20, 0.3, 3, 0, 200),
  ('Fish curry',                130, 14.0, 4.0, 6.5, 0.5, 0.5, 380, 30, 1.0, 15, 2.0, 5, 5, 250),
  ('Mutton curry',              195, 18.0, 3.0, 12.0, 0.5, 0.3, 400, 15, 2.5, 10, 2.5, 2, 0, 250),
  ('Avial',                     90, 2.0, 8.0, 6.0, 3.0, 1.0, 200, 40, 0.8, 30, 0, 8, 0, 200),
  ('Olan',                      70, 1.5, 6.0, 5.0, 1.5, 1.0, 150, 30, 0.5, 10, 0, 5, 0, 150),
  ('Keerai masiyal',            60, 3.5, 5.0, 3.0, 2.5, 0.5, 200, 120, 3.5, 400, 0, 25, 0, 350),
  ('Mor kuzhambu',              55, 2.0, 5.0, 3.0, 0.5, 1.0, 250, 80, 0.5, 15, 0.1, 1, 0, 120),
  ('Vattha kuzhambu',           70, 1.5, 8.0, 3.5, 1.0, 1.5, 300, 20, 1.0, 10, 0, 5, 0, 100),
  ('Paal kozhukattai',          160, 3.0, 28.0, 4.0, 0.5, 1.0, 100, 60, 0.3, 20, 0.1, 0, 0, 80),
  ('Theeyal',                   110, 3.0, 8.0, 7.5, 2.0, 1.0, 250, 30, 1.0, 15, 0, 3, 0, 150),
  ('Kadala curry',              150, 7.5, 20.0, 5.0, 5.0, 1.5, 300, 40, 2.0, 5, 0, 3, 0, 250),
  ('Erissery',                  120, 4.0, 15.0, 5.0, 3.0, 1.0, 200, 35, 1.5, 20, 0, 5, 0, 200),
  ('Vendakkai puli kuzhambu',   80, 2.0, 8.0, 4.5, 2.5, 1.5, 280, 50, 1.0, 30, 0, 10, 0, 200),
  -- SNACKS
  ('Samosa',                    260, 4.5, 28.0, 15.0, 2.0, 1.0, 350, 15, 1.0, 5, 0, 3, 0, 150),
  ('Vada pav',                  290, 5.0, 35.0, 14.0, 2.0, 1.0, 400, 20, 1.5, 5, 0, 5, 0, 150),
  ('Bhel puri',                 200, 5.0, 30.0, 7.0, 3.0, 1.5, 350, 20, 1.5, 5, 0, 5, 0, 120),
  ('Pani puri',                 220, 3.5, 32.0, 9.0, 2.0, 1.0, 400, 15, 1.0, 3, 0, 5, 0, 100),
  ('Pakora (mixed veg)',        280, 5.0, 22.0, 19.0, 2.5, 1.5, 350, 30, 1.5, 15, 0, 8, 0, 150),
  ('Bajji (banana)',            250, 3.0, 30.0, 13.0, 1.5, 1.0, 300, 15, 0.8, 3, 0, 5, 0, 200),
  ('Bonda',                     300, 4.0, 28.0, 19.0, 1.5, 0.5, 280, 15, 0.8, 5, 0, 3, 0, 100),
  ('Murukku',                   450, 8.0, 55.0, 22.0, 2.0, 0.5, 400, 20, 1.5, 3, 0, 0, 0, 100),
  ('Mixture (snack)',           480, 10.0, 50.0, 26.0, 3.0, 1.0, 500, 30, 2.0, 5, 0, 0, 0, 150),
  ('Roasted chana',             370, 22.0, 58.0, 5.0, 15.0, 2.0, 50, 200, 4.5, 5, 0, 3, 0, 800),
  ('Masala peanuts',            560, 24.0, 18.0, 47.0, 7.0, 3.0, 300, 80, 4.0, 0, 0, 0, 0, 650),
  ('Cutlet (veg)',              200, 4.0, 20.0, 12.0, 2.0, 1.0, 350, 20, 1.0, 10, 0, 5, 0, 150),
  ('Spring roll',               220, 4.0, 25.0, 12.0, 1.5, 1.0, 300, 15, 1.0, 5, 0, 3, 0, 100),
  ('Pav bhaji',                 200, 5.0, 28.0, 8.0, 3.0, 2.0, 400, 30, 1.5, 30, 0, 15, 0, 250),
  ('Dhokla',                    160, 5.0, 25.0, 4.0, 1.5, 1.0, 300, 20, 1.0, 3, 0, 0, 0, 100),
  ('Kachori',                   350, 6.0, 35.0, 20.0, 2.5, 1.0, 350, 20, 1.5, 5, 0, 2, 0, 120),
  ('Aloo tikki',                220, 3.5, 28.0, 11.0, 2.0, 1.5, 300, 15, 1.0, 5, 0, 5, 0, 200),
  ('Dahi vada',                 150, 5.0, 18.0, 6.0, 1.5, 1.0, 250, 60, 1.0, 15, 0.1, 2, 0, 120),
  ('Peanut chikki',             480, 14.0, 55.0, 24.0, 3.0, 15.0, 50, 50, 2.5, 0, 0, 0, 0, 400),
  ('Banana chips',              520, 2.0, 55.0, 33.0, 4.0, 3.0, 200, 10, 0.5, 3, 0, 5, 0, 350),
  -- FRUITS & VEGETABLES
  ('Apple',                     52, 0.3, 14.0, 0.2, 2.4, 10.0, 1, 6, 0.1, 3, 0, 5, 0, 107),
  ('Mango',                     60, 0.8, 15.0, 0.4, 1.6, 14.0, 1, 11, 0.2, 54, 0, 36, 0, 168),
  ('Papaya',                    43, 0.5, 11.0, 0.3, 1.7, 8.0, 8, 20, 0.3, 47, 0, 62, 0, 182),
  ('Guava',                     68, 2.6, 14.0, 1.0, 5.4, 9.0, 2, 18, 0.3, 31, 0, 228, 0, 417),
  ('Orange',                    47, 0.9, 12.0, 0.1, 2.4, 9.0, 0, 40, 0.1, 11, 0, 53, 0, 181),
  ('Watermelon',                30, 0.6, 8.0, 0.2, 0.4, 6.0, 1, 7, 0.2, 28, 0, 8, 0, 112),
  ('Pomegranate',               83, 1.7, 19.0, 1.2, 4.0, 14.0, 3, 10, 0.3, 0, 0, 10, 0, 236),
  ('Grapes',                    69, 0.7, 18.0, 0.2, 0.9, 16.0, 2, 10, 0.4, 3, 0, 4, 0, 191),
  ('Chikoo (sapota)',           83, 0.4, 20.0, 1.1, 5.3, 15.0, 12, 21, 0.8, 4, 0, 15, 0, 193),
  ('Jackfruit',                 95, 1.7, 23.0, 0.6, 1.5, 19.0, 2, 24, 0.2, 5, 0, 14, 0, 448),
  ('Drumstick (moringa)',       37, 2.1, 8.3, 0.2, 2.0, 0, 42, 30, 0.4, 74, 0, 141, 0, 461),
  ('Curry leaves',              108, 6.1, 18.7, 1.0, 6.4, 0, 34, 830, 5.0, 1000, 0, 4, 0, 800),
  ('Bitter gourd',              17, 1.0, 3.7, 0.2, 2.8, 1.0, 5, 19, 0.4, 24, 0, 84, 0, 296),
  ('Bottle gourd',              15, 0.6, 3.4, 0.1, 0.5, 2.0, 2, 26, 0.2, 16, 0, 10, 0, 150),
  ('Ridge gourd',               20, 1.2, 3.0, 0.5, 0.6, 1.5, 3, 18, 0.4, 55, 0, 5, 0, 139),
  ('Snake gourd',               18, 0.5, 3.3, 0.3, 0.6, 1.0, 3, 26, 0.3, 20, 0, 3, 0, 170),
  ('Brinjal (eggplant)',        25, 1.0, 6.0, 0.2, 3.0, 3.5, 2, 9, 0.2, 1, 0, 2, 0, 229),
  ('Tomato',                    18, 0.9, 3.9, 0.2, 1.2, 2.6, 5, 10, 0.3, 42, 0, 14, 0, 237),
  ('Onion',                     40, 1.1, 9.3, 0.1, 1.7, 4.2, 4, 23, 0.2, 0, 0, 7, 0, 146),
  ('Potato',                    77, 2.0, 17.0, 0.1, 2.2, 0.8, 6, 12, 0.8, 0, 0, 20, 0, 421),
  -- SWEETS
  ('Gulab jamun',               370, 5.0, 54.0, 15.0, 0.5, 40.0, 100, 40, 0.5, 30, 0.1, 0, 0, 50),
  ('Jalebi',                    380, 2.0, 60.0, 15.0, 0.3, 50.0, 50, 10, 0.5, 5, 0, 0, 0, 30),
  ('Rasgulla',                  186, 5.0, 35.0, 3.0, 0, 30.0, 50, 80, 0.2, 20, 0.1, 0, 0, 40),
  ('Halwa (sooji)',             310, 4.0, 45.0, 13.0, 0.5, 25.0, 80, 20, 0.5, 60, 0, 0, 0, 40),
  ('Payasam (vermicelli)',      150, 3.0, 22.0, 5.5, 0.3, 15.0, 50, 70, 0.3, 30, 0.2, 1, 0, 80),
  ('Laddu (besan)',             430, 8.0, 50.0, 22.0, 2.0, 20.0, 30, 25, 1.5, 20, 0, 0, 0, 120),
  ('Mysore pak',                450, 5.0, 48.0, 27.0, 0.5, 35.0, 40, 30, 0.5, 80, 0, 0, 0, 50),
  ('Kesari',                    280, 2.5, 40.0, 12.0, 0.3, 30.0, 50, 15, 0.3, 50, 0, 0, 0, 30),
  ('Gajar halwa',               250, 3.5, 35.0, 11.0, 1.5, 22.0, 60, 40, 0.5, 200, 0, 3, 0, 150),
  ('Kulfi',                     200, 4.0, 25.0, 10.0, 0, 20.0, 80, 100, 0.2, 50, 0.2, 1, 0, 120),
  ('Kheer (rice)',              140, 3.5, 20.0, 5.0, 0.2, 15.0, 40, 80, 0.2, 30, 0.2, 1, 0, 100),
  ('Sandesh',                   280, 8.0, 40.0, 10.0, 0, 30.0, 30, 120, 0.3, 30, 0.1, 0, 0, 50),
  ('Shrikhand',                 250, 5.0, 35.0, 10.0, 0, 30.0, 50, 100, 0.2, 40, 0.2, 1, 0, 80),
  ('Modak',                     300, 3.0, 42.0, 14.0, 1.5, 20.0, 50, 20, 0.8, 10, 0, 2, 0, 100),
  ('Adhirasam',                 350, 4.0, 55.0, 13.0, 1.0, 25.0, 30, 15, 1.0, 5, 0, 0, 0, 80),
  -- BEVERAGES
  ('Filter coffee',             45, 1.5, 5.0, 2.0, 0, 3.5, 30, 50, 0.1, 15, 0.1, 0, 0, 80),
  ('Lassi (sweet)',             100, 3.0, 16.0, 3.0, 0, 14.0, 50, 100, 0.1, 25, 0.2, 1, 0, 130),
  ('Lassi (salted)',            55, 3.5, 5.0, 2.5, 0, 4.0, 200, 110, 0.1, 20, 0.2, 1, 0, 140),
  ('Tender coconut water',      19, 0.7, 3.7, 0.2, 1.1, 2.5, 105, 24, 0.3, 0, 0, 2, 0, 250),
  ('Sugarcane juice',           73, 0.2, 18.0, 0, 0, 17.0, 5, 10, 0.4, 0, 0, 0, 0, 40),
  ('Jaljeera',                  15, 0.3, 3.5, 0.1, 0.5, 2.0, 300, 10, 0.3, 0, 0, 5, 0, 50),
  ('Aam panna',                 50, 0.3, 12.0, 0.1, 0.3, 10.0, 200, 8, 0.2, 10, 0, 15, 0, 60),
  ('Badam milk',                95, 4.0, 12.0, 4.0, 0.5, 10.0, 50, 120, 0.5, 20, 0.3, 1, 1, 180),
  ('Nimbu pani (lemon water)',  25, 0.1, 6.0, 0.1, 0.1, 5.0, 200, 5, 0.1, 0, 0, 15, 0, 30),
  ('Masala chai',               42, 1.5, 5.0, 1.5, 0, 4.0, 30, 55, 0.2, 15, 0.1, 0, 0, 70),
  -- PROTEIN SOURCES
  ('Paneer (raw)',              265, 18.0, 1.2, 21.0, 0, 0, 18, 208, 0.2, 82, 0.4, 0, 0, 100),
  ('Tofu',                      76, 8.0, 1.9, 4.8, 0.3, 0, 7, 350, 5.4, 0, 0, 0, 0, 121),
  ('Chicken breast (cooked)',   165, 31.0, 0, 3.6, 0, 0, 74, 15, 1.0, 6, 0.3, 0, 0, 256),
  ('Fish fry',                  200, 20.0, 8.0, 10.0, 0.5, 0, 350, 40, 1.5, 20, 3.0, 2, 5, 280),
  ('Prawn fry',                 210, 22.0, 5.0, 12.0, 0, 0, 400, 60, 2.0, 30, 1.5, 2, 0, 200),
  ('Egg bhurji',                180, 12.0, 2.0, 14.0, 0.5, 0.5, 350, 50, 1.5, 150, 1.0, 2, 1.5, 140),
  ('Tandoori chicken',          175, 25.0, 3.0, 7.0, 0, 0.5, 500, 20, 1.5, 15, 0.5, 0, 0, 250),
  ('Chicken tikka',             170, 24.0, 4.0, 6.5, 0.5, 0.5, 450, 15, 1.2, 10, 0.4, 2, 0, 230),
  ('Mutton keema',              210, 20.0, 2.0, 14.0, 0, 0, 400, 15, 3.0, 10, 3.0, 2, 0, 250),
  ('Liver (chicken)',           167, 24.0, 1.0, 7.0, 0, 0, 80, 8, 9.0, 3300, 17.0, 28, 0, 230),
  ('Whey protein (scoop)',      400, 80.0, 8.0, 4.0, 0, 2.0, 200, 100, 2.0, 0, 0.5, 0, 0, 400),
  ('Sattu drink',               120, 6.0, 18.0, 2.5, 3.0, 1.0, 100, 30, 2.0, 5, 0, 3, 0, 200),
  ('Sprouts salad',             100, 7.0, 13.0, 1.5, 4.0, 1.0, 15, 30, 1.5, 5, 0, 12, 0, 200),
  ('Black chana (dry)',         360, 19.0, 61.0, 5.0, 17.0, 2.0, 25, 200, 7.5, 5, 0, 4, 0, 870),
  ('Peanut butter',             590, 25.0, 20.0, 50.0, 6.0, 6.0, 350, 45, 2.0, 0, 0, 0, 0, 650),
  -- STAPLES
  ('Ragi mudde',                120, 3.5, 25.0, 1.0, 3.5, 0.5, 20, 344, 3.9, 5, 0, 0, 0, 280),
  ('Jowar roti',                280, 9.0, 55.0, 3.5, 6.0, 1.0, 30, 25, 3.5, 5, 0, 0, 0, 300),
  ('Bajra roti',                290, 8.5, 54.0, 5.0, 4.5, 0.5, 20, 40, 6.0, 5, 0, 0, 0, 350),
  ('Naan',                      290, 8.0, 48.0, 7.5, 2.0, 2.0, 400, 30, 2.0, 10, 0, 0, 0, 80),
  ('Kulcha',                    280, 7.5, 45.0, 8.0, 2.0, 2.0, 400, 25, 1.5, 10, 0, 0, 0, 70),
  ('Bhatura',                   330, 7.0, 42.0, 15.0, 1.5, 1.0, 350, 20, 1.5, 5, 0, 0, 0, 80),
  ('Thepla',                    270, 8.0, 38.0, 10.0, 3.0, 1.0, 300, 30, 2.0, 30, 0, 3, 0, 150),
  ('Dosa (masala stuffed)',     195, 4.5, 26.0, 8.0, 1.5, 0.5, 300, 25, 1.0, 5, 0, 3, 0, 120),
  ('Idiyappam',                 160, 2.0, 35.0, 1.0, 0.5, 0.2, 100, 10, 0.5, 0, 0, 0, 0, 30),
  ('Pathiri',                   230, 6.0, 40.0, 5.0, 2.0, 0.5, 200, 15, 1.5, 0, 0, 0, 0, 60),
  -- PACKAGED
  ('Maggi noodles',             400, 9.0, 57.0, 15.0, 2.0, 1.0, 1100, 20, 2.0, 0, 0, 0, 0, 100),
  ('White bread (slice)',       265, 9.0, 49.0, 3.2, 2.7, 5.0, 490, 72, 2.0, 0, 0, 0, 0, 100),
  ('Whole wheat bread (slice)', 247, 13.0, 41.0, 3.4, 7.0, 4.0, 400, 107, 2.5, 0, 0, 0, 0, 250),
  ('Biscuit (Marie)',           420, 7.0, 73.0, 11.0, 2.0, 10.0, 400, 30, 2.0, 5, 0, 0, 0, 100),
  ('Biscuit (cream)',           480, 5.0, 65.0, 22.0, 1.0, 20.0, 300, 20, 1.0, 10, 0, 0, 0, 80),
  ('Ghee',                      900, 0, 0, 99.5, 0, 0, 0, 1, 0, 500, 0, 0, 3, 0),
  ('Coconut oil',               862, 0, 0, 100.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  ('Jaggery',                   383, 0.4, 98.0, 0.1, 0, 65.0, 30, 80, 11.0, 0, 0, 0, 0, 150),
  ('Honey',                     304, 0.3, 82.0, 0, 0.2, 82.0, 4, 6, 0.4, 0, 0, 1, 0, 52),
  ('Sugar (white)',             387, 0, 100.0, 0, 0, 100.0, 1, 1, 0, 0, 0, 0, 0, 2)
) AS v(name, cal, prot, carb, fat, fib, sug, sod, calc, iron, va, vb12, vc, vd, pot)
JOIN food_items fi ON fi.name = v.name
WHERE NOT EXISTS (SELECT 1 FROM nutritional_values nv WHERE nv.food_item_id = fi.id);
