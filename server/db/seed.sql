-- Seed data. Dialect text is PLACEHOLDER content: have native speakers verify it before any public demo.
insert into regions(id,name,color,note,weight,description) values
('mysuru',  'Mysuru',              '#e0452b','Mysuru, Mandya, Chamarajanagar',            420,'Old Mysore region dialects.'),
('coastal', 'Coastal Karnataka',   '#f08a24','Dakshina Kannada, Udupi, Uttara Kannada',    310,'Coastal Kannada, influenced by Tulu and Konkani.'),
('north',   'North Karnataka',     '#f7c325','Dharwad, Belagavi, Vijayapura',              260,'Dharwad-Belagavi style Kannada.'),
('malnad',  'Malnad',              '#8e1015','Shivamogga, Chikkamagaluru',                 120,'Hill and forest region dialects.'),
('hk',      'Hyderabad-Karnataka', '#f59e0b','Kalaburagi, Raichur, Ballari',                60,'Kalyana Karnataka speech.'),
('kodagu',  'Kodagu Borders',      '#f4795f','Kodagu, Hassan border',                       40,'Border speech around Kodagu.')
on conflict (id) do nothing;

insert into districts(region_id,name) values
('mysuru','Mysuru'),('mysuru','Mandya'),('mysuru','Chamarajanagar'),('mysuru','Bengaluru Urban'),('mysuru','Bengaluru Rural'),
('mysuru','Ramanagara'),('mysuru','Tumakuru'),('mysuru','Chikkaballapura'),('mysuru','Kolar'),
('coastal','Dakshina Kannada'),('coastal','Udupi'),('coastal','Uttara Kannada'),
('north','Belagavi'),('north','Dharwad'),('north','Vijayapura'),('north','Bagalkot'),('north','Gadag'),
('north','Haveri'),('north','Davanagere'),('north','Chitradurga'),
('malnad','Shivamogga'),('malnad','Chikkamagaluru'),
('hk','Kalaburagi'),('hk','Raichur'),('hk','Ballari'),('hk','Bidar'),('hk','Yadgir'),('hk','Koppal'),('hk','Vijayanagara'),
('kodagu','Kodagu'),('kodagu','Hassan')
on conflict (name) do nothing;

insert into stamps(id,region_id,name) select id, id, name || ' stamp' from regions on conflict (id) do nothing;

insert into concepts(id,english_meaning) values
('c1','What are you doing?'),('c2','Where are you going?'),('c3','Have you eaten?'),
('c4','Come here'),('c5','Salt'),('c6','Water')
on conflict (id) do nothing;

insert into entries(id,concept_id,region_id,kannada_script,romanized,status) values
('e1','c1','mysuru','ಏನ್ ಮಾಡ್ತಿದ್ದೀಯ?','En maadtidiya?','verified'),
('e2','c1','north','ಏನ್ ಮಾಡಾಕತ್ತೀ?','En maadakatti?','verified'),
('e3','c1','coastal','ಎಂತ ಮಾಡ್ತೀ?','Entha maadthi?','verified'),
('e4','c2','mysuru','ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯ?','Elli hogtidiya?','verified'),
('e5','c2','north','ಎಲ್ಲಿಗೆ ಹೊಂಟೀ?','Elli hontee?','verified'),
('e6','c2','coastal','ಎಲ್ಲಿಗೆ ಹೋಪುದು?','Elli hopudu?','verified'),
('e7','c3','mysuru','ಊಟ ಆಯ್ತಾ?','Oota aayta?','verified'),
('e8','c3','north','ಊಟ ಆತೇನ್ರಿ?','Oota aatenri?','verified'),
('e9','c3','coastal','ಊಟ ಆಯ್ತಾ?','Oota aayta?','pending'),
('e10','c4','mysuru','ಇಲ್ಲಿ ಬಾ','Illi baa','verified'),
('e11','c4','north','ಇಲ್ಲೆ ಬಾ','Ille baa','verified'),
('e12','c4','malnad','ಇಲ್ಲಿ ಬನ್ನಿ','Illi banni','pending'),
('e13','c5','coastal','ಉಪ್ಪು','Uppu','verified'),
('e14','c6','mysuru','ನೀರು','Neeru','verified'),
('e15','c6','coastal','ನೀರ್','Neer','verified')
on conflict (id) do nothing;

insert into spelling_variants(entry_id,variant) values
('e4','hogtidiya'),('e4','hogthidiya'),('e5','honti'),('e5','hontee'),
('e6','hopudu'),('e7','ootaayta'),('e13','uppu'),('e13','upppu')
on conflict do nothing;

insert into cultural_notes(entry_id,story,tags)
select 'e13','PLACEHOLDER: a short story about salt (uppu) in coastal Karnataka kitchens. Have a native speaker write the real note.', array['food','coastal']
where not exists (select 1 from cultural_notes where entry_id = 'e13');

-- Talk to a Local scenarios (PLACEHOLDER dialogue: verify with native speakers)
insert into scenarios(id,sort) values ('Shopping',1),('Travelling',2),('Village',3),('Elder',4) on conflict (id) do nothing;
insert into scenario_nodes(scenario_id,node_id,speaker,kn,rom,en,choices) values
('Shopping','n0','Vendor (Mysuru)','ಏನ್ ಬೇಕು?','En beku?','What do you need?','[["Ask the price","n1"],["Just looking","n2"]]'),
('Shopping','n1','Vendor (Mysuru)','ಇಪ್ಪತ್ತು ರೂಪಾಯಿ','Ippattu roopaayi','Twenty rupees','[["Restart","n0"]]'),
('Shopping','n2','Vendor (Mysuru)','ನೋಡಿ, ಬನ್ನಿ','Nodi, banni','Please look around','[["Restart","n0"]]'),
('Travelling','n0','Local (North Karnataka)','ಎಲ್ಲಿಗೆ ಹೊಂಟೀ?','Elli hontee?','Where are you going?','[["To the bus stand","n1"]]'),
('Travelling','n1','Local (North Karnataka)','ಹಿಂಗೆ ಹೋಗು','Hinge hogu','Go this way','[["Restart","n0"]]'),
('Village','n0','Villager (Malnad)','ಬನ್ನಿ, ಕೂತ್ಕೊಳ್ಳಿ','Banni, kootkolli','Come, please sit','[["Thank them","n1"],["Ask for water","n2"]]'),
('Village','n1','Villager (Malnad)','ಊಟ ಆಯ್ತಾ?','Oota aayta?','Have you eaten?','[["Restart","n0"]]'),
('Village','n2','Villager (Malnad)','ನೀರು ತಗೊಳ್ಳಿ','Neeru tagolli','Please take some water','[["Restart","n0"]]'),
('Elder','n0','Elder (Mysuru)','ಹೇಗಿದ್ದೀಯ ಮಗು?','Hegiddiya magu?','How are you, child?','[["I am fine","n1"]]'),
('Elder','n1','Elder (Mysuru)','ಚೆನ್ನಾಗಿರು','Chennagiru','Stay well','[["Restart","n0"]]')
on conflict (scenario_id,node_id) do nothing;
