#!/usr/bin/env python3
"""Builds src/data/clubs.json from the school's clubs and programmes PDFs
(Pazinimo_medis_activities_after_the_school.pdf, Pazinimo_medis_programs_and_international_projects.pdf,
 information from pazinimomedis.lt, 15 October 2026). Run: python3 scripts/build-clubs.py
Lithuanian text is copied from the PDFs. English is a working translation for review."""
import json, pathlib

DAY = {'Pr':'Mon','An':'Tue','Tr':'Wed','Kt':'Thu','Pn':'Fri','Š':'Sat'}
CAMPUS = {
 'vg': {'en':'Vilnius, K. Kalinausko g. 13','lt':'Vilnius, K. Kalinausko g. 13','sub':{'en':'Gymnasium, grades 0 to 12','lt':'Gimnazija, 0–12 kl.'}},
 'vp': {'en':'Vilnius, Ozo g. 37','lt':'Vilnius, Ozo g. 37','sub':{'en':'Primary school, grades 0 to 4','lt':'Pradinė mokykla, 0–4 kl.'}},
 'k':  {'en':'Kaunas, Vilties g. 2','lt':'Kaunas, Vilties g. 2','sub':{'en':'School, grades 0 to 5','lt':'Mokykla, 0–5 kl.'}},
}
DIRS = {
 'tech':  {'en':'Technology and natural sciences','lt':'Technologijos ir gamtos mokslai','strategic':'technology'},
 'think': {'en':'Thinking, language and leadership','lt':'Mąstymas, kalba ir lyderystė','strategic':'entrepreneurship'},
 'create':{'en':'Creativity and crafts','lt':'Kūryba ir rankų darbai','strategic':'creativity'},
 'stage': {'en':'Music, dance and stage','lt':'Muzika, šokis ir scena','strategic':None},
 'move':  {'en':'Sport and movement','lt':'Sportas ir judesys','strategic':None},
}
items = []
def club(id, campus, d, name_lt, name_en, desc_lt, desc_en, slots, grades_lt, grades_en, price_lt, price_en, nvs=None, extra=None, flags=None, amount=None, **kw):
    it = {'id':id,'kind':'club','campus':campus,'direction':d,
      'name':{'lt':name_lt,'en':name_en},'desc':{'lt':desc_lt,'en':desc_en},
      'slots':[{'day':DAY[s[0]],'time':s[1], **({'note':s[2]} if len(s)>2 else {})} for s in slots],
      'grades':{'lt':grades_lt,'en':grades_en},
      'price':{'lt':price_lt,'en':price_en}, 'amount':amount}
    if nvs: it['nvs']={'lt':nvs[0],'en':nvs[1]}
    if extra: it['extra']={'lt':extra[0],'en':extra[1]}
    it['flags']=flags or []
    it.update(kw)
    items.append(it)

# ---------- Vilnius gymnasium, K. Kalinausko g. 13 ----------
club('robotics-academy-vg','vg','tech','Robotikos akademija','Robotics academy','LEGO robotų konstravimas ir programavimas.','Building and programming LEGO robots.',[('Kt','16:15–17:45')],'1–4 kl.','Grades 1 to 4','79 €/mėn.','€79 a month',('su NVŠ 54 €/mėn.','€54 a month with NVŠ'),amount=79)
club('roblox-pro-vg','vg','tech','CodeAcademy Kids – Roblox Pro','CodeAcademy Kids: Roblox Pro','Žaidimų kūrimas „Roblox Studio“, „Lua“ programavimas, DI įrankiai.','Game making in Roblox Studio, Lua programming and AI tools.',[('Pn','16:15–17:45')],'1–4 kl.','Grades 1 to 4','69 €/mėn.','€69 a month',('su NVŠ 44 €/mėn.','€44 a month with NVŠ'),amount=69)
club('3d-lab-vg','vg','tech','3D modeliavimo ir spausdinimo laboratorija','3D modelling and printing lab','3D modelių kūrimas ir spausdinimas.','Making and printing 3D models.',[('Š','12:30–14:00')],'5–7 kl.','Grades 5 to 7','69 €/mėn.','€69 a month',('su NVŠ 44 €/mėn.','€44 a month with NVŠ'),amount=69)
club('chess-vg','vg','think','Šachmatai ir šaškės','Chess and draughts','Žaidimo pagrindai, užduotys, turnyrai.','The basics of the game, exercises and tournaments.',[('Kt','15:00–15:45')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',amount=50)
club('debate-vg','vg','think','World Scholar Debate & Trivia','World Scholar Debate and Trivia','Debatai, viktorinos, kūrybinis rašymas. „World Scholar’s Cup“ renginiai.',"Debates, quizzes and creative writing, with World Scholar's Cup events.",[('Pr','17:30–18:30')],'5–8 kl.','Grades 5 to 8','45 €/mėn.','€45 a month',extra=('+ galimos kelionių išlaidos','+ possible travel costs'),flags=['english'],amount=45)
club('muster-vg','vg','think','MUST’er academy','MUST’er academy','Verslumas, finansinis raštingumas, karjeros tyrinėjimas, susitikimai su verslininkais.','Entrepreneurship, financial literacy, career exploration and meetings with business people.',[('Š','10:00–12:00')],'9–12 m. ir 13–16 m.','Ages 9 to 12 and 13 to 16','190 €/mėn.; bendruomenei 150 €/mėn.','€190 a month, or €150 for the community',amount=150)
club('kalbykla-vg','vg','think','Kalbykla. Jaunimui','Kalbykla for teenagers','Iškalba, argumentavimas, viešojo kalbėjimo baimės įveika.','Eloquence, argument and overcoming the fear of public speaking.',[('An','17:00–18:30','arba / or'),('Tr','17:00–18:30','arba / or')],'14–18 m.','Ages 14 to 18','12 užsiėmimų: 360 € arba 3 × 140 €','12 sessions: €360, or 3 × €140',amount=360)
club('connected-vg','vg','think','Ryšyje su savimi ir pasauliu','Connected to yourself and the world','Emocijų pažinimas, bendravimas, streso valdymas.','Understanding emotions, communication and managing stress.',[('An','15:00','kas antrą / every second week, 2,5–3 val. / hours')],'1–4 kl.','Grades 1 to 4','70 €, priemonės įskaičiuotos','€70, materials included',amount=70)
club('art-lab-vg','vg','create','Dailės laboratorija','Art lab','Piešimas, tapyba, grafika, origami, mozaika. Pradedančiųjų ir pažengusiųjų grupės.','Drawing, painting, graphics, origami and mosaic, in beginner and advanced groups.',[('Kt','15:00–16:00','pradedantieji / beginners'),('Kt','16:15–17:15','pažengusieji / advanced')],'0–4 kl.','Grades 0 to 4','45 €/mėn.','€45 a month',('su NVŠ 20 €/mėn.','€20 a month with NVŠ'),('+ 10 € priemonėms','+ €10 for materials'),amount=45)
club('ceramics-vg','vg','create','Keramika','Ceramics','Molio darbai, pasakų personažai, liaudies ornamentai. Darbų paroda.','Clay work, fairy-tale characters and folk ornaments, ending with an exhibition of the work.',[('Pr','15:00–16:00','arba / or'),('Pr','16:15–17:15','arba / or')],'0–4 kl.','Grades 0 to 4','55 €/mėn.','€55 a month',('su NVŠ 30 €/mėn.','€30 a month with NVŠ'),amount=55)
club('cardboard-vg','vg','create','Cardboard Creation Lab','Cardboard Creation Lab','Konstravimas iš kartono ir antrinių medžiagų.','Building from cardboard and recycled materials.',[('Pr','16:15–17:15')],'0–8 kl.','Grades 0 to 8','45 €/mėn.','€45 a month',extra=('+ 10 € priemonėms','+ €10 for materials'),flags=['english'],amount=45)
club('pastry-vg','vg','create','Konditerija','Pastry','Desertų gamyba nuo nulio ir dekoravimas.','Making desserts from scratch and decorating them.',[('An','15:00–16:00','arba / or'),('An','16:15–17:15','arba / or')],'0–4 kl.','Grades 0 to 4','70 €/mėn.','€70 a month',amount=70)
club('theatre-vg','vg','stage','Teatras','Theatre','Teatriniai žaidimai, improvizacija, istorijų kūrimas. Veda aktorė Giedrė Giedraitytė.','Theatre games, improvisation and storytelling, led by the actress Giedrė Giedraitytė.',[('Pr','15:00–16:00')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',amount=50)
club('kpop-vg','vg','stage','K-pop šokiai','K-pop dance','Korėjietiškos pop muzikos choreografijos.','Choreography to Korean pop music.',[('Š','10:30–11:30','10–14 m. / ages 10 to 14'),('Š','11:45–13:15','14+ m. / ages 14+')],'10–14 m. ir 14+ m.','Ages 10 to 14 and 14+','45 € (10–14 m.) ir 55 € (14+ m.)','€45 for ages 10 to 14, €55 for 14+',('su NVŠ 20 € ir 30 €','with NVŠ €20 and €30'),amount=45)
club('karate-vg','vg','move','Karatė','Karate','Savikontrolė, pasitikėjimas savimi, savigyna. Veda Rimantas Balčius.','Self-control, confidence and self-defence, led by Rimantas Balčius.',[('Pr','15:00–16:00'),('Pn','15:00–16:00')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',('su NVŠ 25 €/mėn.','€25 a month with NVŠ'),amount=50)
club('sporto-galia-vg','vg','move','Sporto Galia','Sporto Galia','Taisyklingas judėjimas, laikysena, koordinacija per žaidimus.','Correct movement, posture and coordination through games.',[('An','16:15–17:15'),('Kt','16:15–17:15')],'0–6 kl.','Grades 0 to 6','2 k./sav.: 70 €; 1 k./sav.: 45 €/mėn.','Twice a week €70, once a week €45 a month',('su NVŠ (2 k./sav.) 45 €','with NVŠ (twice a week) €45'),amount=45)
club('ballet-fitness-vg','vg','move','Ballet Fitness moterims nuo 14 m.','Ballet Fitness for women from 14','Strength ir Motion & Balance užsiėmimai bendruomenei.','Strength and Motion & Balance sessions for the community.',[('Pr','19:00–19:50','arba / or 20:00–20:50'),('Tr','19:00–19:50','arba / or 20:00–20:50')],'moterims nuo 14 m.','Women from 14','45 €/mėn.; „Pažinimo medžio“ bendruomenei 35 €/mėn.','€45 a month, or €35 for the Pažinimo medis community',flags=['community'],amount=35)

# ---------- Vilnius primary, Ozo g. 37 ----------
club('frog-nature-vp','vp','tech','Varliuko gamtos klasė','Little Frog nature class','Gamtos tyrinėjimas, mikroskopai, ekologija. Klasėje ir lauke.','Exploring nature with microscopes and ecology, in class and outdoors.',[('Kt','15:00–16:00')],'0–4 kl.','Grades 0 to 4','45 €/mėn.','€45 a month',amount=45)
club('chess-vp','vp','think','Šachmatai ir šaškės','Chess and draughts','Žaidimo pagrindai, užduotys, turnyrai.','The basics of the game, exercises and tournaments.',[('Kt','16:45–17:30')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',amount=50)
club('art-lab-vp','vp','create','Dailės laboratorija','Art lab','Piešimas, tapyba, grafika, origami, mozaika, dekupažas.','Drawing, painting, graphics, origami, mosaic and decoupage.',[('An','15:00–16:00')],'0–4 kl.','Grades 0 to 4','45 €/mėn.','€45 a month',('su NVŠ 20 €/mėn.','€20 a month with NVŠ'),('+ 10 € priemonėms','+ €10 for materials'),amount=45)
club('ceramics-vp','vp','create','Keramika','Ceramics','Molio darbai, pasakų personažai, liaudies ornamentai.','Clay work, fairy-tale characters and folk ornaments.',[('An','16:15–17:15')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',flags=['full'],amount=50)
club('nature-makers-vp','vp','create','Nature Makers','Nature Makers','Kūryba iš gamtos medžiagų. Dalis veiklų lauke.','Making things from natural materials, with part of the activities outdoors.',[('An','16:15–17:15')],'0–4 kl.','Grades 0 to 4','40 €/mėn.','€40 a month',flags=['english'],amount=40)
club('pastry-vp','vp','create','Konditerija','Pastry','Sausainiai, keksiukai ir tortukai nuo nulio.','Cookies, cupcakes and small cakes from scratch.',[('Pr','15:00–16:00')],'0–4 kl.','Grades 0 to 4','65 €/mėn.','€65 a month',amount=65)
club('ukulele-vp','vp','stage','Ukulelė','Ukulele','Populiarios melodijos ir dainos, pasirodymai mokyklos koncertuose.','Popular tunes and songs, with performances at school concerts.',[('Kt','16:15–17:15')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',amount=50)
club('karate-vp','vp','move','Karatė','Karate','Savikontrolė, pasitikėjimas savimi, savigyna. Veda Rimantas Balčius.','Self-control, confidence and self-defence, led by Rimantas Balčius.',[('An','15:00–16:00'),('Kt','15:00–16:00')],'0–4 kl.','Grades 0 to 4','50 €/mėn.','€50 a month',('su NVŠ 25 €/mėn.','€25 a month with NVŠ'),amount=50)
club('sporto-galia-vp','vp','move','Sporto Galia','Sporto Galia','Taisyklingas judėjimas, laikysena, koordinacija per žaidimus.','Correct movement, posture and coordination through games.',[('Pr','16:15–17:15'),('Pn','15:00–16:00')],'0–8 kl.','Grades 0 to 8','2 k./sav.: 70 €; 1 k./sav.: 45 €/mėn.','Twice a week €70, once a week €45 a month',('su NVŠ (2 k./sav.) 45 €','with NVŠ (twice a week) €45'),amount=45)

# ---------- Kaunas, Vilties g. 2 ----------
club('robotics-k','k','tech','Robotika','Robotics','Robotų konstravimas ir programavimas mažiesiems.','Building and programming robots for younger children.',[('Pr','16:30–17:30')],'Darželis nuo 4 m. ir 0 kl.','Kindergarten from age 4 and grade 0','59 €/mėn.','€59 a month',extra=('4 užsiėmimai po 60 min.','4 sessions of 60 minutes'),amount=59)
club('steam-k','k','tech','STEAM tyrinėjimai','STEAM explorations','Eksperimentai, mikroskopas, konstravimas.','Experiments, microscope and building.',[('Pn','15:00–17:00')],'0–5 kl.','Grades 0 to 5','10 €/mėn.','€10 a month',amount=10)
club('chess-k','k','think','Šachmatai','Chess','Taisyklės, strategija, sprendimų priėmimas.','Rules, strategy and decision making.',[('Pr','15:00–16:00')],'0–5 kl.','Grades 0 to 5','45 €/mėn.','€45 a month',amount=45)
club('art-k','k','create','Dailė','Art','Tapyba, piešimas, koliažas. Studija „Dailė kitaip“.','Painting, drawing and collage, with the studio Dailė kitaip.',[('Kt','15:00–16:00')],'0–5 kl.','Grades 0 to 5','50 €/mėn., priemonės įskaičiuotos','€50 a month, materials included',amount=50)
club('ceramics-k','k','create','Keramika','Ceramics','Molio darbai, pasakų personažai, liaudies ornamentai.','Clay work, fairy-tale characters and folk ornaments.',[('Tr','16:15–17:15')],'0–5 kl.','Grades 0 to 5','50 €/mėn.','€50 a month',amount=50)
club('bold-chords-k','k','stage','Drąsūs akordai','Bold Chords','Perkusija, dainavimas dviem balsais, drąsa scenoje.','Percussion, two-part singing and courage on stage.',[('Kt','15:00–16:00')],'0–5 kl.','Grades 0 to 5','30 €/mėn.','€30 a month',amount=30)
club('street-dance-k','k','stage','Gatvės šokiai','Street dance','Gatvės šokių stiliai, ritmas, koordinacija.','Street dance styles, rhythm and coordination.',[('Pn','15:00–16:00')],'0–5 kl.','Grades 0 to 5','40 €/mėn.','€40 a month',amount=40)
club('piano-k','k','stage','Individualios fortepijono pamokos','Individual piano lessons','Pradedantiesiems ir pažengusiems.','For beginners and advanced pupils.',[],'0–5 kl.','Grades 0 to 5','25 €/val.','€25 an hour',extra=('Sutartu laiku','At a time agreed with the teacher'),amount=25)
club('karate-k','k','move','Karatė (kyokushin)','Karate (kyokushin)','Kyokushin technika, fizinė būklė, disciplina.','Kyokushin technique, fitness and discipline.',[('Pr','16:30–17:30')],'0–5 kl.','Grades 0 to 5','40 €/mėn.','€40 a month',amount=40)
club('basketball-k','k','move','Krepšinis','Basketball','Treniruotės su treneriu Luku Šitkausku.','Training with the coach Lukas Šitkauskas.',[('Tr','15:00–16:00'),('Pn','16:15–17:15')],'0–5 kl.','Grades 0 to 5','45 €/mėn.','€45 a month',('su NVŠ 30 €/mėn.','€30 a month with NVŠ'),amount=45)

# ---------- Programmes ----------
def program(id, campuses, name_lt, name_en, tag_lt, tag_en, desc_lt, desc_en, who_lt, who_en, when, dur_lt, dur_en, price_lt, price_en, amount, steps, extra_lt, extra_en, **kw):
    items.append({'id':id,'kind':'program','campus':campuses,'direction':kw.pop('direction',None),
      'name':{'lt':name_lt,'en':name_en},'tag':{'lt':tag_lt,'en':tag_en},'desc':{'lt':desc_lt,'en':desc_en},
      'grades':{'lt':who_lt,'en':who_en},'whenText':when,'duration':{'lt':dur_lt,'en':dur_en},
      'price':{'lt':price_lt,'en':price_en},'amount':amount,'steps':steps,'note':{'lt':extra_lt,'en':extra_en},'flags':[]})

program('knowledge-lab',['vg','vp','k'],'Pažinimo laboratorija','Knowledge Lab','Mokslių vaikų programa · LUMOS','Programme for gifted learners · LUMOS',
 'Popamokinė programa smalsiems, kūrybiškiems ir iššūkių ieškantiems mokiniams, kuriems norisi daugiau nei standartinis mokymo turinys. Vaikai eksperimentuoja, susitinka su profesionalais ir kuria savo projektą nuo problemos iki veikiančio prototipo.',
 'An after-school programme for curious, creative pupils who look for challenges and want more than the standard curriculum. Children experiment, meet professionals and build their own project, from a problem to a working prototype.',
 'Motyvuoti 1–5 kl. mokiniai','Motivated pupils in grades 1 to 5',
 {'vg':{'lt':'Kalinausko g. 13: Tr 15:00–16:30','en':'K. Kalinausko g. 13: Wednesdays 15:00 to 16:30'},'vp':{'lt':'Ozo g. 37: Tr 15:00–16:30','en':'Ozo g. 37: Wednesdays 15:00 to 16:30'},'k':{'lt':'Vilties g. 2, Kaunas: An 15:00–16:30','en':'Vilties g. 2, Kaunas: Tuesdays 15:00 to 16:30'}},
 'Rugsėjis–gegužė, kartą per savaitę','September to May, once a week',
 '88 €/mėn. bendruomenei; 118 €/mėn. kitiems. Pavakariai įskaičiuoti','€88 a month for the community, €118 for others. Afternoon snack included',88,
 [{'t':{'lt':'1. Susipažinimas','en':'1. Getting acquainted'},'w':{'lt':'Rugsėjis, 3 sav.','en':'September, 3 weeks'},'d':{'lt':'Komanda, pirmieji iššūkiai, pvz., „Kaip pastatyti tiltą?“','en':'The team and the first challenges, such as "How do you build a bridge?"'}},
  {'t':{'lt':'2. Atradimai','en':'2. Discoveries'},'w':{'lt':'Spalis–sausis, 14 sav.','en':'October to January, 14 weeks'},'d':{'lt':'Gamta, išradimai, menai ir scena, kūrybinės dirbtuvės.','en':'Nature, inventions, arts and stage, and creative workshops.'}},
  {'t':{'lt':'3. Savo sprendimas','en':'3. Your own solution'},'w':{'lt':'Vasaris–gegužė, 14 sav.','en':'February to May, 14 weeks'},'d':{'lt':'Projektas su mentoriais, pristatymas Mokslo šventėje.','en':'A project with mentors, presented at the Science Festival.'}}],
 'Metodika: J. Renzulli praturtinimo triados modelis ir dizaino mąstymas. Per Erasmus+ projektą LUMOS mokytojai mokosi atpažinti ir ugdyti gabius vaikus mišriose klasėse.',
 'Method: the Renzulli enrichment triad and design thinking. Through the Erasmus+ project LUMOS, teachers learn to recognise and nurture gifted children in mixed classes.',direction='tech')
program('reading-journey',['k'],'Skaitymo kelionė','Reading Journey','Akademinis pagrindas','Academic foundation',
 'Programa priešmokyklinukams ir pirmokams, kuri stiprina skaitymą ir teksto supratimą. Kiekvienas vaikas mokosi savo tempu ir lyginamas tik su savimi. Programos žinutė: „Man pavyksta. Aš galiu. Skaitau ir mėgaujuosi.“',
 'A programme for pre-primary children and first graders that strengthens reading and text comprehension. Each child learns at their own pace and is compared only with themselves. The message of the programme: "I can do it. I succeed. I read and I enjoy it."',
 '5–7 m. vaikai, priešmokyklinukai ir pirmokai','Children aged 5 to 7, in pre-primary and grade 1',
 {'k':{'lt':'Vilties g. 2, Kaunas: An 15:00–17:00, nuo spalio','en':'Vilties g. 2, Kaunas: Tuesdays 15:00 to 17:00, from October'}},
 'Grupė iki 10 vaikų','Groups of up to 10 children',
 '70 €/mėn. Pavakariai įskaičiuoti','€70 a month. Afternoon snack included',70,
 [{'t':{'lt':'Ką lavina','en':'What it builds'},'w':{'lt':'','en':''},'d':{'lt':'Skaitymą, garsinę analizę, teksto suvokimą, kalbinę raišką.','en':'Reading, sound analysis, text comprehension and spoken expression.'}},
  {'t':{'lt':'Knygų šventė','en':'Book celebration'},'w':{'lt':'Kartą per mėnesį','en':'Once a month'},'d':{'lt':'Vaikai pristato, ką nuveikė, ir išsikelia naują tikslą.','en':'Children present what they have done and set a new goal.'}},
  {'t':{'lt':'Ryšys su šeima','en':'Link with the family'},'w':{'lt':'Kartą per mėnesį','en':'Once a month'},'d':{'lt':'Tėvai gauna mokytojos grįžtamąjį ryšį apie pažangą.','en':"Parents receive the teacher's feedback on progress."}}],
 'Vadovė: priešmokyklinio ugdymo mokytoja Raimonda.','Led by the pre-primary teacher Raimonda.',direction='think')
program('business-academy',['vg'],'Verslumo akademija','Business Academy','Strateginė kryptis: verslumas','Strategic direction: entrepreneurship',
 'Trijų dienų praktinė akademija: nuo pastebėtos problemos iki drąsiai pristatytos idėjos. Komandos ieško realių problemų, kuria sprendimą, parengia prototipą ir pristato jį kviestinei komisijai. Verslo idėjos iš anksto turėti nereikia.',
 'A three-day hands-on academy that takes teams from a problem they notice to an idea they present with confidence. Teams look for real problems, build a solution, prepare a prototype and present it to an invited panel. You do not need a business idea in advance.',
 '7–9 kl. mokiniai; 20 dalyvių, 4 komandos','Pupils in grades 7 to 9; 20 participants in 4 teams',
 {'vg':{'lt':'Kalinausko g. 13 ir partnerių erdvės, lapkritį, 9:00–17:00','en':'K. Kalinausko g. 13 and partner spaces, in November, 9:00 to 17:00'}},
 'Trys dienos','Three days',
 '89 € „Pažinimo medžio“ mokiniams ir darbuotojų vaikams; 119 € kitiems','€89 for Pažinimo medis pupils and children of staff, €119 for others',89,
 [{'t':{'lt':'1 diena – Atrask','en':'Day 1: Discover'},'w':{'lt':'','en':''},'d':{'lt':'Komandos, miesto iššūkis, vizitas į startuolių centrą ROCKIT.','en':'Teams, a city challenge and a visit to the ROCKIT start-up centre.'}},
  {'t':{'lt':'2 diena – Sukurk','en':'Day 2: Build'},'w':{'lt':'','en':''},'d':{'lt':'Dizaino mąstymas, prototipas, sesija su FIRSTPICK investuotojais.','en':'Design thinking, a prototype and a session with FIRSTPICK investors.'}},
  {'t':{'lt':'3 diena – Pristatyk','en':'Day 3: Present'},'w':{'lt':'','en':''},'d':{'lt':'Repeticijos su LJA mentoriais, finalinis pristatymas komisijai.','en':'Rehearsals with LJA mentors and the final presentation to the panel.'}}],
 'Partneriai: ROCKIT, FIRSTPICK ir LJA (Lietuvos Junior Achievement) mentoriai.','Partners: ROCKIT, FIRSTPICK and mentors from LJA (Junior Achievement Lithuania).',direction='think')

out = {'campuses':CAMPUS,'directions':DIRS,'items':items,
 'info':{
  'who':{'lt':'Ir kitų mokyklų mokiniai. Kai vietų trūksta, pirmenybė „Pažinimo medžio“ mokiniams.','en':'Pupils from other schools are welcome too. When places run short, Pažinimo medis pupils come first.'},
  'nvs':{'lt':'Valstybės finansavimas neformaliajam švietimui. Kaina „su NVŠ“ yra jau pritaikius krepšelį.','en':'State funding for non-formal education. A price "with NVŠ" already has the voucher applied.'},
  'cancel':{'lt':'Atšaukus mokestis taikomas iki einamojo mėnesio pabaigos.','en':'If you cancel, the fee applies until the end of the current month.'},
  'contact':'kristina.balci@pazinimo-medis.lt',
  'source':{'lt':'Informacija iš pazinimomedis.lt, 2026-10-15.','en':'Information from pazinimomedis.lt, 15 October 2026.'},
  'dayNames':{'Mon':{'en':'Monday','lt':'Pirmadienis'},'Tue':{'en':'Tuesday','lt':'Antradienis'},'Wed':{'en':'Wednesday','lt':'Trečiadienis'},'Thu':{'en':'Thursday','lt':'Ketvirtadienis'},'Fri':{'en':'Friday','lt':'Penktadienis'},'Sat':{'en':'Saturday','lt':'Šeštadienis'}}
 }}
p = pathlib.Path(__file__).resolve().parent.parent/'src'/'data'/'clubs.json'
p.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
c=sum(1 for i in items if i['kind']=='club'); print('clubs',c,'programs',len(items)-c)
from collections import Counter
print(Counter((i['campus'] if isinstance(i['campus'],str) else 'prog') for i in items if i['kind']=='club'))
