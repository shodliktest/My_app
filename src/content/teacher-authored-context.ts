import type { Lesson } from "@/lib/types";

type Context = {
  title: string;
  titleUz: string;
  reading: string;
  readingUz: string;
  listening: [string, string][];
  speaking: string;
  speakingUz: string;
  writing: string;
  writingUz: string;
};

/**
 * Teacher-authored contextual seeds for the advanced pathway.
 * Each seed is tied to one lesson objective rather than being a generic
 * "about the topic" paragraph. The lesson engine expands these into the
 * interactive reading/listening/speaking/writing activities.
 */
export const TEACHER_CONTEXTS: Partial<Record<string, Context>> = {
  "b1-plus-53": {
    title: "A changing workplace", titleUz: "O‘zgarayotgan ish muhiti",
    reading: "When Dilnoza started her first job, she used to work in a small office and would travel there by bus every morning. Her team now works remotely several days a week, so she has had to change some of her old routines while keeping the habits that still help her work well. Looking at the two periods together shows how routines can change without changing a person’s basic priorities.",
    readingUz: "Dilnoza birinchi ishini boshlaganida kichik ofisda ishlardi va har kuni ertalab avtobusda borardi. Hozir jamoasi haftada bir necha kun masofadan ishlaydi, shuning uchun u eski odatlarining ayrimlarini o‘zgartirdi, foydali bo‘lganlarini esa saqlab qoldi. Ikki davrni taqqoslash odatlar o‘zgarishi mumkinligini, ammo asosiy ustuvorliklar saqlanib qolishini ko‘rsatadi.",
    listening: [["Manager", "When I joined the company, we used to have paper files everywhere."],["Employee", "Yes, and we would spend half a morning looking for one document."],["Manager", "Now most records are digital, although we still keep a few paper copies."],["Employee", "The technology changed the routine, but the need for accurate records did not."]],
    speaking: "Compare one routine you used to have with the routine you have now. Explain what changed and why.", speakingUz: "Oldin qilgan bir odatingizni hozirgi odatingiz bilan taqqoslang. Nima va nima uchun o‘zgarganini tushuntiring.",
    writing: "Write 120–150 words comparing a past routine with your current routine. Use used to and would accurately.", writingUz: "120–150 so‘zda avvalgi odatingizni hozirgi odatingiz bilan taqqoslang. Used to va wouldni to‘g‘ri ishlating."
  },
  "b1-plus-54": {
    title: "The missed train", titleUz: "O‘tkazib yuborilgan poyezd",
    reading: "By the time Kamol reached the station, the train had already left. He had been checking a message while he was walking, and he did not notice that the departure time had changed. While he was waiting for the next train, he called his colleague and explained what had happened.",
    readingUz: "Kamol vokzalga yetib kelganida, poyezd allaqachon jo‘nab ketgan edi. U yurayotganda xabarni tekshirayotgan va jo‘nash vaqti o‘zgarganini sezmagan. Keyingi poyezdni kutayotganida hamkasbiga qo‘ng‘iroq qilib, nima bo‘lganini tushuntirdi.",
    listening: [["Kamol", "I was walking to the station when I saw the notification."],["Colleague", "Had the train already left by then?"],["Kamol", "Yes. I had assumed the original timetable was still valid."],["Colleague", "At least you checked before going to the office."]],
    speaking: "Tell a short story with a clear background action and an earlier event. Make the sequence of events clear.", speakingUz: "Fon harakati va undan oldingi voqeani aniq ko‘rsatib, qisqa hikoya ayting.",
    writing: "Write a short narrative about a problem caused by a misunderstanding. Use Past Perfect and Past Continuous.", writingUz: "Noto‘g‘ri tushunish sabab yuzaga kelgan muammo haqida qisqa hikoya yozing. Past Perfect va Past Continuousdan foydalaning."
  },
  "b1-plus-55": {
    title: "Planning the school trip", titleUz: "Maktab sayohatini rejalash",
    reading: "The school is meeting parents next Friday to discuss a spring trip. The teachers are going to present the proposed route because they have already checked the transport and accommodation. The head teacher thinks the final cost will be lower than last year, but nobody knows yet how many families will join.",
    readingUz: "Maktab bahorgi sayohatni muhokama qilish uchun kelasi juma kuni ota-onalar bilan uchrashadi. O‘qituvchilar rejalashtirilgan yo‘nalishni taqdim etishmoqchi, chunki transport va turar joyni allaqachon tekshirishgan. Maktab direktori yakuniy xarajat o‘tgan yilgidan kamroq bo‘ladi deb o‘ylaydi, ammo nechta oila qatnashishi hozircha noma’lum.",
    listening: [["Teacher", "We are meeting the parents next Friday."],["Parent", "Are you going to visit the museum as well?"],["Teacher", "Yes. We have already booked the guide."],["Parent", "Then I think more families will join."]],
    speaking: "Describe a future plan and explain why you choose will, going to, or the present continuous.", speakingUz: "Kelajakdagi rejangizni ayting va nega will, going to yoki Present Continuousni tanlaganingizni tushuntiring.",
    writing: "Write an email about a planned event. Distinguish arrangements, intentions, and predictions.", writingUz: "Rejalashtirilgan tadbir haqida email yozing. Kelishilgan reja, niyat va bashoratni farqlang."
  },
  "b1-plus-56": {
    title: "The five-year project", titleUz: "Besh yillik loyiha",
    reading: "By the end of the project, the research team will have collected data from twelve cities. If the current timetable continues, they will have been working together for almost five years. The project manager is already preparing a report that explains which stages will have been completed and which questions will still need attention.",
    readingUz: "Loyiha oxiriga kelib tadqiqot jamoasi o‘n ikki shahardan ma’lumot to‘plagan bo‘ladi. Hozirgi jadval davom etsa, ular deyarli besh yil davomida birga ishlab kelayotgan bo‘ladilar. Loyiha rahbari qaysi bosqichlar tugagan bo‘lishi va qaysi savollar hali e’tibor talab qilishini tushuntiradigan hisobot tayyorlamoqda.",
    listening: [["Researcher", "By July, we will have finished the fieldwork."],["Manager", "And how long will you have been collecting data by then?"],["Researcher", "We will have been working on it for nearly four years."],["Manager", "That gives us enough material for the final analysis."]],
    speaking: "Describe what you will have completed and how long you will have been doing something by a future date.", speakingUz: "Kelajakdagi ma’lum sanagacha nimani tugatganingiz va qancha vaqt davomida ish bajarganingizni tasvirlang.",
    writing: "Write a project update using both Future Perfect and Future Perfect Continuous.", writingUz: "Future Perfect va Future Perfect Continuousdan foydalanib loyiha yangilanishini yozing."
  },
  "b1-plus-57": {
    title: "Reading the clues", titleUz: "Belgilar asosida xulosa qilish",
    reading: "The laboratory door is locked, the lights are on, and a fresh cup of coffee is on the desk. The researcher must be inside, although she might be in another room. She cannot be at home because her laptop is connected to the laboratory network. These clues do not prove everything, but they make some explanations more plausible than others.",
    readingUz: "Laboratoriya eshigi qulflangan, chiroqlar yoqilgan va stol ustida yangi qahva bor. Tadqiqotchi ichkarida bo‘lsa kerak, garchi boshqa xonada bo‘lishi mumkin. U uyda bo‘lishi mumkin emas, chunki noutbuki laboratoriya tarmog‘iga ulangan. Bu belgilar hamma narsani isbotlamaydi, ammo ayrim izohlarni boshqalaridan ehtimoliyroq qiladi.",
    listening: [["Student", "The office is empty, but the computer is still running."],["Tutor", "She might have gone to lunch."],["Student", "She must have left recently because the screen is active."],["Tutor", "That is possible, but we cannot be certain."]],
    speaking: "Look at three clues and make deductions using must, might, and can’t.", speakingUz: "Uchta belgini ayting va must, might, can’t yordamida xulosa chiqaring.",
    writing: "Write a short explanation of a situation using different strengths of probability.", writingUz: "Turli darajadagi ehtimollikni ifodalab, bir vaziyat haqida qisqa izoh yozing."
  },
  "b1-plus-58": {
    title: "A safer workplace", titleUz: "Xavfsizroq ish joyi",
    reading: "After a minor accident, the factory reviewed its safety rules. Workers should report damaged equipment immediately, while visitors have to wear identification badges. The new policy does not mean every task is dangerous; it means everyone needs to understand which precautions are necessary and which are simply recommended.",
    readingUz: "Kichik baxtsiz hodisadan keyin zavod xavfsizlik qoidalarini qayta ko‘rib chiqdi. Ishchilar shikastlangan jihozlar haqida darhol xabar berishlari kerak, tashrif buyuruvchilar esa identifikatsiya nishonlarini taqishlari shart. Yangi siyosat har bir ish xavfli degani emas; u qaysi ehtiyot chorasi majburiy, qaysi biri tavsiya ekanini tushunishni talab qiladi.",
    listening: [["Supervisor", "You have to wear a helmet in this area."],["Worker", "Do I need to wear one in the office too?"],["Supervisor", "No. You only need to wear it on the production floor."],["Worker", "And should I report the damaged cable?"],["Supervisor", "Yes, you should report it immediately."]],
    speaking: "Give advice and explain an external rule. Make the difference between should and have to clear.", speakingUz: "Maslahat bering va tashqi qoidani tushuntiring. Should va have to o‘rtasidagi farqni aniq ko‘rsating.",
    writing: "Write five practical rules for a safe workplace and explain two of them.", writingUz: "Xavfsiz ish joyi uchun beshta amaliy qoida yozing va ulardan ikkitasini tushuntiring."
  },
  "b1-plus-59": {
    title: "A different career", titleUz: "Boshqa kasb yo‘li",
    reading: "Aziz studied engineering, but he later discovered that he enjoyed teaching. If he had chosen a different university course, he might be teaching full-time now. The past decision cannot be changed, yet the mixed conditional helps him explain how a past choice is connected to his present situation.",
    readingUz: "Aziz muhandislikni o‘rgandi, ammo keyinchalik o‘qitishni yoqtirishini bildi. Agar u universitetda boshqa yo‘nalishni tanlaganida, hozir to‘liq stavkada dars berayotgan bo‘lishi mumkin edi. O‘tmishdagi qarorni o‘zgartirib bo‘lmaydi, ammo mixed conditional o‘tmishdagi tanlovning hozirgi vaziyat bilan bog‘liqligini ifodalashga yordam beradi.",
    listening: [["Aziz", "If I had taken the teaching course, I would probably work at a school now."],["Friend", "So you think the past choice affects your present career?"],["Aziz", "Exactly. I am happy with my job, but I sometimes imagine the alternative."],["Friend", "That is a good example of a mixed conditional."]],
    speaking: "Describe a past decision and an imagined present result. Keep the two time references clear.", speakingUz: "O‘tmishdagi qaror va uning tasavvuriy hozirgi natijasini tasvirlang. Ikki vaqtni aniq farqlang.",
    writing: "Write about one past choice and explain how your life might be different now.", writingUz: "Bitta o‘tmishdagi tanlov haqida yozing va hozir hayotingiz qanday boshqacha bo‘lishi mumkinligini tushuntiring."
  },
  "b1-plus-60": {
    title: "Passing on a message", titleUz: "Xabarni yetkazish",
    reading: "The project coordinator could not attend the meeting, so a colleague later reported the questions and instructions. Instead of repeating every word, she explained what the manager had asked the team to do and where the next meeting would take place. This made the report shorter while keeping the important information.",
    readingUz: "Loyiha koordinatori yig‘ilishga qatnasha olmadi, shuning uchun hamkasbi keyinroq savollar va ko‘rsatmalarni yetkazdi. U har bir so‘zni takrorlash o‘rniga menejer jamoaga nima qilishni buyurgani va keyingi uchrashuv qayerda bo‘lishini tushuntirdi. Bu muhim ma’lumotni saqlagan holda hisobotni qisqartirdi.",
    listening: [["Manager", "Ask Sam where the documents are."],["Assistant", "He asked where the documents were."],["Manager", "And tell him to send them before noon."],["Assistant", "I’ll tell him to send them before noon."]],
    speaking: "Report three questions or instructions that another person gave you.", speakingUz: "Boshqa odam bergan uchta savol yoki ko‘rsatmani bilvosita nutqda yetkazing.",
    writing: "Write a short report of a meeting using reported questions and commands.", writingUz: "Reported questions va commandsdan foydalanib yig‘ilish haqida qisqa hisobot yozing."
  },
  "b1-plus-61": {
    title: "Choosing the right information", titleUz: "Kerakli ma’lumotni tanlash",
    reading: "The training centre has introduced a new course for teachers who work with large classes. The course, which begins in October, focuses on practical classroom routines. Teachers who complete the programme receive a certificate that can be used in their professional portfolio. The extra information in the non-defining clause is useful, but it does not identify the course itself.",
    readingUz: "O‘quv markazi katta sinflarda ishlaydigan o‘qituvchilar uchun yangi kurs joriy qildi. Oktabrda boshlanadigan kurs amaliy sinf tartiblariga e’tibor qaratadi. Dasturni tugatgan o‘qituvchilar professional portfolioda ishlatish mumkin bo‘lgan sertifikat oladi. Non-defining clause ichidagi qo‘shimcha ma’lumot foydali, ammo kursni aniqlash uchun zarur emas.",
    listening: [["Teacher", "I enrolled in the course that starts next month."],["Colleague", "Is that the course which focuses on large classes?"],["Teacher", "Yes. Our trainer, who has taught for twenty years, designed it."],["Colleague", "It sounds practical."]],
    speaking: "Describe a person, place, or thing using both defining and non-defining relative clauses.", speakingUz: "Shaxs, joy yoki narsani defining va non-defining relative clauses yordamida tasvirlang.",
    writing: "Write a paragraph about a course or workplace using at least four relative clauses.", writingUz: "Kamida to‘rtta relative clause ishlatib kurs yoki ish joyi haqida paragraf yozing."
  },
  "b1-plus-62": {
    title: "A difficult decision", titleUz: "Qiyin qaror",
    reading: "Although the new system costs more at the beginning, it may save time later. Despite the initial expense, the school decided to test it for one term. Some teachers support the change, whereas others prefer the old method. However, the principal wants evidence before making a final decision.",
    readingUz: "Yangi tizim boshida qimmatroq bo‘lsa-da, keyinchalik vaqtni tejashi mumkin. Dastlabki xarajatga qaramay, maktab uni bir semestr sinab ko‘rishga qaror qildi. Ayrim o‘qituvchilar o‘zgarishni qo‘llab-quvvatlaydi, boshqalari esa eski usulni afzal ko‘radi. Biroq direktor yakuniy qarordan oldin dalil istaydi.",
    listening: [["Teacher", "Although the software is expensive, it could save us time."],["Teacher 2", "I agree. However, we need to test it first."],["Teacher", "Despite the cost, the trial seems reasonable."],["Teacher 2", "Whereas I would wait, you are ready to try it."]],
    speaking: "Give two contrasting views on a decision and connect them clearly.", speakingUz: "Bir qaror haqida ikki qarama-qarshi fikr bildiring va ularni aniq bog‘lang.",
    writing: "Write a balanced paragraph using although, despite, whereas, and however.", writingUz: "Although, despite, whereas va howeverdan foydalanib muvozanatli paragraf yozing."
  },
  "b2-63": {
    title: "The safety warning", titleUz: "Xavfsizlik ogohlantirishi",
    reading: "Never had the engineer seen the river level rise so quickly. Only after the emergency team arrived did residents realise how serious the warning was. The unusual word order puts attention on the exceptional situation rather than simply reporting a fact.",
    readingUz: "Muhandis daryo sathi bunchalik tez ko‘tarilganini hech qachon ko‘rmagan edi. Faqat favqulodda guruh kelgandan keyingina aholi ogohlantirish qanchalik jiddiy ekanini tushundi.",
    listening: [["Reporter", "Never have we faced conditions like these."],["Engineer", "Only after the measurements came in did we understand the risk."],["Reporter", "So the inversion adds emphasis?"],["Engineer", "Exactly."]],
    speaking: "Retell an important event using two negative-adverbial inversion structures.", speakingUz: "Muhim voqeani ikkita negative-adverbial inversion bilan qayta hikoya qiling.",
    writing: "Write a short formal account using never, rarely, only after, or under no circumstances.", writingUz: "Never, rarely, only after yoki under no circumstances yordamida qisqa rasmiy bayon yozing."
  },
  "b2-64": {
    title: "What changed the project", titleUz: "Loyihani nima o‘zgartirdi",
    reading: "The team tried several solutions, but it was the testing stage that revealed the real problem. What the engineers needed was better user feedback, not another feature. Cleft structures allow the writer to focus the reader’s attention on the information that matters most.",
    readingUz: "Jamoa bir nechta yechimni sinadi, ammo haqiqiy muammoni aynan test bosqichi ochib berdi. Muhandislarga yana bir xususiyat emas, yaxshiroq foydalanuvchi fikri kerak edi.",
    listening: [["Lead", "What helped us most was the user feedback."],["Designer", "And it was the testing stage that exposed the problem."],["Lead", "So the feature itself was not the main issue."],["Designer", "Exactly."]],
    speaking: "Use it-clefts and what-clefts to emphasise two important facts.", speakingUz: "Ikki muhim faktni ta’kidlash uchun it-cleft va what-cleftdan foydalaning.",
    writing: "Rewrite a short explanation using cleft structures to control emphasis.", writingUz: "Qisqa izohni cleft structures yordamida qayta yozib, ta’kidni boshqaring."
  },
  "b2-65": {
    title: "A system upgrade", titleUz: "Tizimni yangilash",
    reading: "The new software is believed to reduce processing time, but several older devices still need to be replaced. The company had the network checked before the upgrade and is having the final security tests carried out by an external team. These passive and causative forms keep the focus on the process rather than on the people performing each action.",
    readingUz: "Yangi dastur qayta ishlash vaqtini qisqartiradi deb hisoblanadi, ammo ayrim eski qurilmalarni almashtirish kerak. Kompaniya yangilanishdan oldin tarmoqni tekshirtirdi va yakuniy xavfsizlik testlarini tashqi guruhga bajartirmoqda.",
    listening: [["Manager", "The update is expected to improve performance."],["Engineer", "Yes, and we had the network checked yesterday."],["Manager", "Who is carrying out the security test?"],["Engineer", "An external team is doing it for us."]],
    speaking: "Explain a process using passive reporting and have/get something done.", speakingUz: "Passive reporting va have/get something done yordamida bir jarayonni tushuntiring.",
    writing: "Write a process description containing two passive reporting forms and two causative forms.", writingUz: "Ikki passive reporting va ikki causative shakl qatnashgan jarayon tavsifini yozing."
  },
  "b2-66": {
    title: "Learning through practice", titleUz: "Mashq orqali o‘rganish",
    reading: "The training centre encourages employees to practise new skills rather than simply memorising procedures. Managers avoid giving long lectures and prefer allowing staff to solve realistic problems. Learners often remember doing a task more clearly than being told how to do it.",
    readingUz: "O‘quv markazi xodimlarni protseduralarni yodlashdan ko‘ra yangi ko‘nikmalarni mashq qilishga undaydi. Menejerlar uzoq ma’ruza qilishdan qochib, xodimlarga haqiqiy muammolarni hal qilishga imkon berishni afzal ko‘radi.",
    listening: [["Trainer", "We want staff to practise the procedure."],["Employee", "Do we need to memorise every step?"],["Trainer", "Not exactly. Try doing the task and notice what causes difficulty."],["Employee", "That makes the process more practical."]],
    speaking: "Explain two activities you enjoy doing or avoid doing when learning.", speakingUz: "O‘rganishda bajarishni yoqtiradigan yoki bajarishdan qochadigan ikki faoliyatingizni tushuntiring.",
    writing: "Write advice for a learner using gerunds and infinitives naturally.", writingUz: "Gerund va infinitivlardan tabiiy foydalanib o‘quvchiga maslahat yozing."
  },
  "b2-67": {
    title: "Reducing waste", titleUz: "Chiqindini kamaytirish",
    reading: "Having analysed its waste, the factory changed the packaging process. Staff working on the production line now separate recyclable material before it reaches the main collection point. Compared with the old system, the new arrangement uses fewer resources and makes the source of each type of waste easier to identify.",
    readingUz: "Chiqindilarini tahlil qilgach, zavod qadoqlash jarayonini o‘zgartirdi. Ishlab chiqarish liniyasida ishlaydigan xodimlar endi qayta ishlanadigan materialni asosiy yig‘ish joyiga yetmasidan ajratadi.",
    listening: [["Supervisor", "Having reviewed the figures, we changed the process."],["Worker", "The team sorting the material starts earlier now."],["Supervisor", "Yes, and the amount sent to landfill has fallen."],["Worker", "That is a useful result."]],
    speaking: "Describe a process using participle clauses to connect actions.", speakingUz: "Harakatlarni bog‘lash uchun participle clauses yordamida jarayonni tasvirlang.",
    writing: "Rewrite a sequence of short sentences as a cohesive paragraph with participle clauses.", writingUz: "Qisqa gaplar ketma-ketligini participle clauses bilan bog‘langan paragrafga aylantiring."
  },
  "b2-68": {
    title: "What might have happened", titleUz: "Nima bo‘lgan bo‘lishi mumkin",
    reading: "The server went offline during the night. The technician should have received an alert, but the notification system failed. The administrator might have missed the warning earlier, while the backup system could have prevented the interruption if it had been configured correctly.",
    readingUz: "Server tun davomida ishlamay qoldi. Texnik xodim ogohlantirish olishi kerak edi, ammo bildirishnoma tizimi ishlamadi. Administrator avvalgi ogohlantirishni o‘tkazib yuborgan bo‘lishi mumkin, zaxira tizimi esa to‘g‘ri sozlanganida uzilishni oldini olishi mumkin edi.",
    listening: [["Technician", "We should have received an alert."],["Manager", "Could the backup have prevented the outage?"],["Technician", "It might have, if it had been configured correctly."],["Manager", "Then we need to review both systems."]],
    speaking: "Discuss a past situation using should have, might have, could have, and needn’t have.", speakingUz: "O‘tmishdagi vaziyatni should have, might have, could have va needn’t have bilan muhokama qiling.",
    writing: "Write a short incident review explaining what should or could have happened differently.", writingUz: "Nima boshqacha bo‘lishi kerak yoki mumkin bo‘lganini tushuntirib qisqa hodisa tahlili yozing."
  },
  "b2-69": {
    title: "A decision with consequences", titleUz: "Oqibatli qaror",
    reading: "The company lost an important client because it had not updated its service before the market changed. If the management team had invested earlier, the company might have kept its position. The third conditional can describe the unreal past, while a further clause can show the imagined consequence.",
    readingUz: "Bozor o‘zgarganida xizmatini yangilamaganligi sabab kompaniya muhim mijozini yo‘qotdi. Agar rahbariyat oldinroq sarmoya kiritganida, kompaniya o‘z mavqeini saqlab qolishi mumkin edi.",
    listening: [["Director", "If we had acted earlier, we might have kept the client."],["Analyst", "But the market was changing quickly."],["Director", "True. We should have responded sooner."],["Analyst", "The lesson is clear now."]],
    speaking: "Analyse a past decision and an alternative outcome without changing the time reference.", speakingUz: "O‘tmishdagi qaror va muqobil natijani vaqt ma’nosini o‘zgartirmasdan tahlil qiling.",
    writing: "Write a short reflection using third conditional forms to discuss an unreal past.", writingUz: "Haqiqiy bo‘lmagan o‘tmishni muhokama qilish uchun third conditional yordamida qisqa mulohaza yozing."
  },
  "b2-70": {
    title: "Regretting a missed opportunity", titleUz: "Boy berilgan imkoniyatdan afsuslanish",
    reading: "Malika wishes she had accepted the scholarship when it was offered. She also wishes she were more confident about speaking in public now. The two forms express different kinds of regret: one concerns a past choice, while the other concerns a present situation.",
    readingUz: "Malika stipendiya taklif qilinganida uni qabul qilmaganidan afsuslanadi. U hozir omma oldida gapirishga ishonchi ko‘proq bo‘lishini ham istaydi. Ikki shakl turli afsusni bildiradi: biri o‘tmishdagi tanlov, ikkinchisi hozirgi vaziyat haqida.",
    listening: [["Malika", "I wish I had accepted that scholarship."],["Friend", "Do you still regret it?"],["Malika", "Sometimes. I also wish I were more confident now."],["Friend", "At least you can work on that part."]],
    speaking: "Give one regret about the past and one wish about the present.", speakingUz: "O‘tmishdagi bitta afsus va hozirgi vaziyatga oid bitta istakni ayting.",
    writing: "Write a reflective paragraph using wish + past perfect and wish + past simple/be.", writingUz: "Wish + Past Perfect va wish + Past Simple/be yordamida mulohazali paragraf yozing."
  },
  "b2-71": {
    title: "How much evidence is enough?", titleUz: "Qancha dalil yetarli?",
    reading: "The report contains little evidence about the long-term effect, although a number of short-term changes were measured. Several researchers argue that enough participants were included, while others say that too few cases were studied. The choice of quantifier affects how strong the claim sounds.",
    readingUz: "Hisobotda uzoq muddatli ta’sir haqida kam dalil bor, garchi bir qator qisqa muddatli o‘zgarishlar o‘lchangan bo‘lsa ham. Ayrim tadqiqotchilar yetarli ishtirokchi qatnashganini aytadi, boshqalari esa holatlar juda kam bo‘lganini ta’kidlaydi.",
    listening: [["Researcher", "We collected enough data for the first analysis."],["Reviewer", "But there were only a few long-term cases."],["Researcher", "True. We should avoid making too many claims."],["Reviewer", "That is a more cautious conclusion."]],
    speaking: "Compare enough, too much, too many, few, a few, little, and a little in a real situation.", speakingUz: "Enough, too much, too many, few, a few, little va a little ni haqiqiy vaziyatda taqqoslang.",
    writing: "Write a short report using at least six different quantifiers accurately.", writingUz: "Kamida oltita turli quantifierdan to‘g‘ri foydalanib qisqa hisobot yozing."
  },
  "b2-72": {
    title: "A question of reference", titleUz: "Aniq yoki umumiy ma’no",
    reading: "The researcher entered the laboratory early and checked the equipment before starting the experiment. Later, she spoke to a technician about a problem with the sensor. The use of the article changes depending on whether the reader knows which laboratory, equipment, or sensor is meant.",
    readingUz: "Tadqiqotchi laboratoriyaga erta kirib, tajribani boshlashdan oldin jihozlarni tekshirdi. Keyin sensor bilan bog‘liq muammo haqida texnik xodim bilan gaplashdi. Artikllarning qo‘llanishi o‘quvchi qaysi laboratoriya, jihoz yoki sensor nazarda tutilganini bilish-bilmasligiga qarab o‘zgaradi.",
    listening: [["Student", "Why do we say the laboratory here?"],["Teacher", "Because the context identifies a specific place."],["Student", "And why is research sometimes used without an article?"],["Teacher", "Because it can refer to the activity in general."]],
    speaking: "Explain article choices in a short description of a place, job, or activity.", speakingUz: "Joy, ish yoki faoliyatni tasvirlashda article tanlovini tushuntiring.",
    writing: "Write a paragraph in which article choice changes from general to specific reference.", writingUz: "Umumiy ma’nodan aniq ma’noga o‘tishda article tanlovi o‘zgaradigan paragraf yozing."
  },
  "b2-73": {
    title: "Getting the phrase right", titleUz: "To‘g‘ri birikmani tanlash",
    reading: "The report focuses on the impact of transport on local businesses. Several firms are responsible for delivering goods, but they are not always aware of changes in demand. A small change in the preposition can make an otherwise familiar phrase sound unnatural, so learners need to notice dependent combinations rather than translate word by word.",
    readingUz: "Hisobot transportning mahalliy biznesga ta’siriga e’tibor qaratadi. Bir nechta kompaniya mahsulot yetkazib berish uchun mas’ul, ammo ular talabdagi o‘zgarishlarni har doim ham bilmaydi.",
    listening: [["Editor", "The report focuses on the impact of transport."],["Writer", "And the company is responsible for delivery."],["Editor", "Exactly. Notice the dependent prepositions."],["Writer", "I will learn the phrase as a whole."]],
    speaking: "Use five dependent preposition phrases in a short explanation.", speakingUz: "Qisqa izohda beshta dependent preposition birikmasidan foydalaning.",
    writing: "Write a paragraph containing at least five natural dependent preposition phrases.", writingUz: "Kamida beshta tabiiy dependent preposition birikmasi qatnashgan paragraf yozing."
  },
  "b2-74": {
    title: "Phrasal verbs at work", titleUz: "Ishdagi phrasal verblar",
    reading: "The project team put off the launch because the security checks had not been completed. After the problem was sorted out, the developers carried on with the testing. In formal writing, some phrasal verbs can be replaced by single-word alternatives, but the phrasal forms remain common in meetings and everyday professional speech.",
    readingUz: "Loyiha jamoasi xavfsizlik tekshiruvlari tugamagani uchun ishga tushirishni kechiktirdi. Muammo hal qilingach, dasturchilar testni davom ettirdi. Rasmiy yozuvda ayrim phrasal verblar bir so‘zli muqobillar bilan almashtirilishi mumkin, ammo ular yig‘ilish va professional nutqda keng qo‘llanadi.",
    listening: [["Manager", "We had to put off the launch."],["Developer", "Yes, but we have sorted out the security issue."],["Manager", "Can we carry on tomorrow?"],["Developer", "Certainly."]],
    speaking: "Retell a work problem using four phrasal verbs and their formal alternatives.", speakingUz: "Ishdagi muammoni to‘rtta phrasal verb va ularning rasmiy muqobillari bilan qayta tushuntiring.",
    writing: "Write a short professional message using phrasal verbs appropriately, then replace two with formal alternatives.", writingUz: "Phrasal verblardan mos foydalanib professional xabar yozing, keyin ikkitasini rasmiy muqobiliga almashtiring."
  },
  "b2-75": {
    title: "The right word", titleUz: "To‘g‘ri so‘z tanlovi",
    reading: "The committee made a decision after considering the available evidence. It also reached an agreement with the supplier and took responsibility for communicating the result. These combinations are predictable in English, which is why learning a word together with its common partners is often more useful than memorising a translation alone.",
    readingUz: "Qo‘mita mavjud dalillarni ko‘rib chiqib qaror qabul qildi. Shuningdek, yetkazib beruvchi bilan kelishuvga erishdi va natijani yetkazish uchun mas’uliyatni o‘z zimmasiga oldi.",
    listening: [["Teacher", "Which phrase sounds natural: make a decision or do a decision?"],["Student", "Make a decision."],["Teacher", "Good. What about reach an agreement?"],["Student", "Yes, that one is fixed too."]],
    speaking: "Explain three collocations from your field and give a natural sentence for each.", speakingUz: "O‘z sohangizdan uchta collocationni tushuntiring va har biri uchun tabiiy gap tuzing.",
    writing: "Write a paragraph using eight target collocations without translating them word for word.", writingUz: "Sakkizta target collocationni so‘zma-so‘z tarjima qilmasdan ishlatib paragraf yozing."
  },
  "b2-76": {
    title: "A qualified argument", titleUz: "Ehtiyotkor argument",
    reading: "Although online learning can increase access, it does not automatically improve learning outcomes. To some extent, the result depends on course design, teacher support, and the learner’s ability to study independently. Even when the evidence is positive, a careful writer should state the limits of the claim.",
    readingUz: "Onlayn ta’lim imkoniyatni kengaytirishi mumkin bo‘lsa-da, u avtomatik ravishda o‘qish natijasini yaxshilamaydi. Ma’lum darajada natija kurs dizayni, o‘qituvchi ko‘magi va o‘quvchining mustaqil o‘qish qobiliyatiga bog‘liq.",
    listening: [["Researcher", "The results are positive, to some extent."],["Reviewer", "Would you say the method always works?"],["Researcher", "No. Several limitations need to be considered."],["Reviewer", "That makes the claim more precise."]],
    speaking: "Make a claim, then qualify it with an exception or limitation.", speakingUz: "Fikr bildiring, keyin istisno yoki cheklov bilan uni ehtiyotkorlashtiring.",
    writing: "Write a balanced paragraph that contains a claim, a concession, and a qualification.", writingUz: "Da’vo, concession va qualification qatnashgan muvozanatli paragraf yozing."
  },
  "b2-77": {
    title: "Building an argument", titleUz: "Argument qurish",
    reading: "A strong argument does more than list opinions. It introduces a clear claim, supports it with relevant evidence, considers an alternative view, and explains why the evidence still supports the conclusion. In a meeting, the same structure can help speakers disagree without losing the main line of reasoning.",
    readingUz: "Kuchli argument faqat fikrlarni sanab o‘tmaydi. U aniq da’voni beradi, uni tegishli dalil bilan qo‘llab-quvvatlaydi, muqobil fikrni ko‘rib chiqadi va nima uchun xulosa hanuz asosli ekanini tushuntiradi.",
    listening: [["Analyst", "Our main claim is that the change will reduce costs."],["Manager", "What evidence supports that?"],["Analyst", "The pilot showed a fifteen-percent reduction."],["Manager", "And what is the strongest counterargument?"]],
    speaking: "Present a claim, two supporting points, and one counterargument.", speakingUz: "Da’vo, ikkita dalil va bitta qarshi argumentni taqdim eting.",
    writing: "Write a 180-word argument with a clear claim, evidence, counterargument, and conclusion.", writingUz: "Aniq da’vo, dalil, qarshi argument va xulosaga ega 180 so‘zli argument yozing."
  },
  "b2-plus-78": {
    title: "Choosing the right register", titleUz: "Mos uslubni tanlash",
    reading: "The sentence “We need to fix this soon” is natural in a team chat, but a formal report might say “The issue requires prompt attention.” Both sentences communicate a similar idea, yet the choice of vocabulary signals the relationship between writer, reader, and purpose. Effective advanced users change register without changing the core meaning.",
    readingUz: "“We need to fix this soon” jumlasi jamoa chatida tabiiy, ammo rasmiy hisobotda “The issue requires prompt attention” deyish mumkin. Ikkala gap mazmunan yaqin, biroq lug‘at tanlovi yozuvchi, o‘quvchi va maqsad o‘rtasidagi munosabatni bildiradi.",
    listening: [["Editor", "This phrase is fine for an email to a colleague."],["Writer", "But not for a formal report?"],["Editor", "Right. We need a more neutral register there."],["Writer", "So the audience changes the wording."]],
    speaking: "Say the same message to a friend, a colleague, and a senior manager.", speakingUz: "Bir xil xabarni do‘st, hamkasb va yuqori lavozimli menejerga turli uslubda ayting.",
    writing: "Rewrite one informal message as a neutral professional email and a formal report sentence.", writingUz: "Bitta norasmiy xabarni neytral professional email va rasmiy hisobot jumlasiga aylantiring."
  },
  "b2-plus-79": {
    title: "How certain is the evidence?", titleUz: "Dalil qanchalik aniq?",
    reading: "The pilot appears to have reduced waiting time, although the sample was relatively small. The results may indicate a useful trend, but they do not necessarily prove that the same effect will occur everywhere. Academic and professional writers use hedging to match the strength of a claim to the strength of the evidence.",
    readingUz: "Pilot loyiha kutish vaqtini kamaytirganga o‘xshaydi, garchi namuna nisbatan kichik bo‘lsa ham. Natijalar foydali tendensiyani ko‘rsatishi mumkin, ammo ayni ta’sir hamma joyda kuzatilishini isbotlamaydi.",
    listening: [["Researcher", "The results seem to suggest an improvement."],["Editor", "Can we say the method definitely works?"],["Researcher", "No. The evidence is limited."],["Editor", "Then we should hedge the claim."]],
    speaking: "State the same finding with three different levels of certainty.", speakingUz: "Bir xil natijani uch xil ishonchlilik darajasida ifodalang.",
    writing: "Write a short research-style paragraph using at least five hedging expressions.", writingUz: "Kamida beshta hedging ifodasi bilan qisqa tadqiqot uslubidagi paragraf yozing."
  },
  "b2-plus-80": {
    title: "From actions to concepts", titleUz: "Harakatdan tushunchaga",
    reading: "The committee decided to postpone the launch because the market had changed. In a formal report, this can become “The postponement of the launch followed a change in market conditions.” Nominalisation compresses information and can make writing more formal, but excessive nominalisation may make a sentence harder to read.",
    readingUz: "Qo‘mita bozor o‘zgargani uchun ishga tushirishni kechiktirishga qaror qildi. Rasmiy hisobotda bu fikr “The postponement of the launch followed a change in market conditions” tarzida berilishi mumkin. Nominalisation ma’lumotni ixchamlashtiradi, ammo haddan tashqari ko‘p ishlatilsa matnni og‘irlashtiradi.",
    listening: [["Student", "Why use postponement instead of postponed?"],["Teacher", "It packages the action as a formal concept."],["Student", "Does that always make the sentence better?"],["Teacher", "No. Clarity still matters."]],
    speaking: "Turn three action-based statements into concise formal noun phrases.", speakingUz: "Uchta harakatga asoslangan gapni ixcham rasmiy noun phrasega aylantiring.",
    writing: "Rewrite a short informal paragraph using controlled nominalisation without making it difficult to read.", writingUz: "Qisqa norasmiy paragrafni o‘qishga qiyinlashtirmagan holda nazoratli nominalisation bilan qayta yozing."
  },
  "b2-plus-81": {
    title: "Precise noun phrases", titleUz: "Aniq noun phrase lar",
    reading: "The university introduced a three-year regional teacher-development programme for early-career educators. The long noun phrase allows several pieces of information to be packed into one unit, but readers still need to identify the head noun and the modifiers around it.",
    readingUz: "Universitet yangi o‘qituvchilar uchun uch yillik hududiy professional rivojlanish dasturini joriy qildi. Uzun noun phrase bir nechta ma’lumotni bitta birlikka joylaydi, ammo o‘quvchi asosiy ot va uni aniqlovchi qismlarni topa olishi kerak.",
    listening: [["Coordinator", "We have a new regional teacher-development programme."],["Teacher", "The three-year programme for early-career educators?"],["Coordinator", "Yes, that one."],["Teacher", "The modifiers make the title precise."]],
    speaking: "Describe a course, product, or project using carefully controlled complex noun phrases.", speakingUz: "Kurs, mahsulot yoki loyihani murakkab noun phrase yordamida aniq tasvirlang.",
    writing: "Write five complex noun phrases and use three of them in a coherent paragraph.", writingUz: "Beshta murakkab noun phrase yozing va ulardan uchtasini bog‘langan paragrafda ishlating."
  },
  "b2-plus-82": {
    title: "Guiding the reader", titleUz: "O‘quvchini yo‘naltirish",
    reading: "The report first describes the problem; moreover, it compares two possible solutions. However, the second option is more expensive. As a result, the authors recommend a limited trial. Discourse markers do not simply decorate a paragraph: they signal the relationship between ideas and help readers predict what comes next.",
    readingUz: "Hisobot avval muammoni tasvirlaydi; bundan tashqari, ikki mumkin bo‘lgan yechimni taqqoslaydi. Biroq ikkinchi variant qimmatroq. Natijada mualliflar cheklangan sinovni tavsiya qiladi.",
    listening: [["Presenter", "First, we need to define the problem."],["Colleague", "Moreover, we should compare the costs."],["Presenter", "However, cost is not the only issue."],["Colleague", "As a result, the trial should include both measures."]],
    speaking: "Give a short explanation using contrast, addition, cause, and result markers.", speakingUz: "Qarama-qarshilik, qo‘shimcha, sabab va natija markerlari bilan qisqa tushuntirish bering.",
    writing: "Write a coherent paragraph in which every discourse marker has a clear function.", writingUz: "Har bir discourse marker aniq vazifaga ega bo‘lgan bog‘langan paragraf yozing."
  },
  "b2-plus-83": {
    title: "Avoiding repetition", titleUz: "Takrorni kamaytirish",
    reading: "The first group chose the digital option, while the second did not. The research team expected a larger difference, but there was little. English often omits repeated material when the meaning is recoverable from context. This ellipsis makes connected speech less heavy without removing essential information.",
    readingUz: "Birinchi guruh raqamli variantni tanladi, ikkinchisi esa tanlamadi. Tadqiqot jamoasi kattaroq farq kutgan edi, ammo farq juda kichik bo‘ldi. Ingliz tilida ma’no kontekstdan tushunarli bo‘lsa, takroriy qismlar ko‘pincha tushirib qoldiriladi.",
    listening: [["Researcher", "Did both teams accept the proposal?"],["Assistant", "The first did, but the second didn’t."],["Researcher", "And did the results change?"],["Assistant", "The first did; the second didn’t."]],
    speaking: "Give answers that avoid unnecessary repetition through ellipsis or substitution.", speakingUz: "Ellipsis yoki substitution orqali keraksiz takrorni kamaytirib javob bering.",
    writing: "Edit a repetitive paragraph by using ellipsis and substitution where the meaning remains clear.", writingUz: "Ma’no aniq qoladigan joylarda ellipsis va substitution ishlatib takroriy paragrafni tahrirlang."
  },
  "b2-plus-84": {
    title: "Comparing more than two options", titleUz: "Ikki variantdan ko‘proqni taqqoslash",
    reading: "The three proposals differ in cost, speed, and long-term value. The second is considerably cheaper than the first, whereas the third is by far the most flexible. However, flexibility alone does not make it the best fit for every department. Advanced comparison requires the speaker to state exactly which dimension is being compared.",
    readingUz: "Uchta taklif xarajat, tezlik va uzoq muddatli qiymat bo‘yicha farq qiladi. Ikkinchi variant birinchisidan ancha arzon, uchinchisi esa eng moslashuvchan. Biroq moslashuvchanlikning o‘zi uni har bir bo‘lim uchun mos variant qilmaydi.",
    listening: [["Manager", "The second option is considerably cheaper."],["Analyst", "But the third is by far the most flexible."],["Manager", "Which matters more for this project?"],["Analyst", "That depends on the implementation time."]],
    speaking: "Compare three choices using precise comparative and superlative language.", speakingUz: "Uchta tanlovni aniq comparative va superlative vositalari bilan taqqoslang.",
    writing: "Write a recommendation comparing three options across at least three criteria.", writingUz: "Kamida uch mezon bo‘yicha uchta variantni taqqoslab tavsiya yozing."
  },
  "b2-plus-85": {
    title: "Showing a position", titleUz: "Pozitsiyani ko‘rsatish",
    reading: "The director strongly supports the proposal, but she acknowledges one important limitation. From her perspective, the investment is justified because the long-term benefit outweighs the initial cost. The language of stance helps writers show not only what they think, but also how strongly they hold the position.",
    readingUz: "Direktor taklifni qat’iy qo‘llab-quvvatlaydi, ammo bitta muhim cheklovni tan oladi. Uning nuqtai nazaricha, uzoq muddatli foyda dastlabki xarajatdan ustun bo‘lgani uchun sarmoya o‘zini oqlaydi.",
    listening: [["Director", "I strongly support the proposal."],["Colleague", "But you also recognise the cost."],["Director", "Certainly. I am not claiming it is risk-free."],["Colleague", "That makes your position clearer."]],
    speaking: "State a position, strengthen it, then soften one part with a qualification.", speakingUz: "Pozitsiyangizni ayting, uni kuchaytiring, keyin bir qismini qualification bilan yumshating.",
    writing: "Write a short opinion paragraph using stance markers and one deliberate qualification.", writingUz: "Stance markerlari va bitta ataylab qo‘shilgan qualification bilan qisqa fikr paragrafi yozing."
  },
  "b2-plus-86": {
    title: "Reporting a complex discussion", titleUz: "Murakkab suhbatni bayon qilish",
    reading: "The committee chair explained that the pilot would continue, provided that the next review showed no serious problems. One member asked whether the budget had been approved, while another warned that the timetable might need to change. A good report preserves the relationships between claims rather than simply converting every sentence into reported speech.",
    readingUz: "Qo‘mita raisi keyingi tekshiruv jiddiy muammo ko‘rsatmasa, pilot davom etishini tushuntirdi. Bir a’zo byudjet tasdiqlanganmi deb so‘radi, boshqasi esa jadval o‘zgarishi mumkinligidan ogohlantirdi.",
    listening: [["Chair", "The pilot will continue if the review is positive."],["Member", "Did she say the budget had been approved?"],["Reporter", "Yes, but another member warned that the timetable might change."],["Member", "So there were several conditions."]],
    speaking: "Summarise a short discussion while preserving questions, warnings, and conditions.", speakingUz: "Savollar, ogohlantirishlar va shartlarni saqlagan holda qisqa suhbatni umumlashtiring.",
    writing: "Write a meeting summary that reports at least one question, one claim, and one warning.", writingUz: "Kamida bitta savol, da’vo va ogohlantirishni reported discourse orqali beradigan yig‘ilish xulosasini yozing."
  },
  "b2-plus-87": {
    title: "Making a text hold together", titleUz: "Matnni bog‘lash",
    reading: "The city introduced a bicycle scheme last year. The scheme has reduced short car journeys in several districts, and this change has also affected local traffic. Such repetition with controlled reference words allows readers to follow the topic without losing track of what each pronoun or noun phrase refers to. Cohesion is therefore a meaning relationship, not just a collection of linking words.",
    readingUz: "Shahar o‘tgan yili velosiped tizimini joriy qildi. Ushbu tizim bir nechta hududlarda qisqa avtomobil safarlarini kamaytirdi va bu o‘zgarish mahalliy transportga ham ta’sir qildi.",
    listening: [["Planner", "The scheme reduced short car journeys."],["Reporter", "And this affected local traffic too?"],["Planner", "Yes. The change was most visible in the centre."],["Reporter", "The references make the connection clear."]],
    speaking: "Explain how reference words connect a short spoken text.", speakingUz: "Reference so‘zlari qisqa og‘zaki matnni qanday bog‘lashini tushuntiring.",
    writing: "Edit a paragraph so that pronouns, repetition, substitution, and connectors create clear cohesion.", writingUz: "Olmosh, takror, substitution va connectorlar orqali paragraf cohesionini aniq qiling."
  },
  "c1-88": {
    title: "A long-running investigation", titleUz: "Uzoq davom etgan tadqiqot",
    reading: "The research team has been tracking the river for six years and has recently noticed a gradual change in water quality. By the end of the next phase, they will have collected measurements from every season twice. Because the project combines completed findings with continuing observations, tense and aspect choices help the reader understand what is finished, ongoing, and expected.",
    readingUz: "Tadqiqot jamoasi olti yildan beri daryoni kuzatmoqda va yaqinda suv sifatida bosqichma-bosqich o‘zgarishni sezdi. Keyingi bosqich oxiriga kelib ular har bir fasldan ikki marta o‘lchov to‘plagan bo‘ladi.",
    listening: [["Scientist", "We have been monitoring the river for six years."],["Colleague", "Have you found a clear pattern yet?"],["Scientist", "We have identified a possible trend, but we are still collecting data."],["Colleague", "So the conclusion is not final."]],
    speaking: "Explain a long project using several tense and aspect choices precisely.", speakingUz: "Uzoq davom etgan loyihani turli tense va aspect shakllari bilan aniq tushuntiring.",
    writing: "Write a research update distinguishing completed findings, ongoing work, and future milestones.", writingUz: "Tugagan topilmalar, davom etayotgan ish va kelajakdagi bosqichlarni farqlab tadqiqot yangilanishini yozing."
  },
  "c1-89": {
    title: "A formal recommendation", titleUz: "Rasmiy tavsiya",
    reading: "The committee recommends that every applicant be informed of the decision in writing. It is essential that the final notice contain the same information for all candidates. In highly formal contexts, the mandative subjunctive is still used to present recommendations and requirements without adding a personal subject-based modal.",
    readingUz: "Qo‘mita har bir arizachiga qaror haqida yozma ravishda xabar berilishini tavsiya qiladi. Yakuniy xabarda barcha nomzodlar uchun bir xil ma’lumot bo‘lishi juda muhim.",
    listening: [["Chair", "I recommend that the report be published next week."],["Secretary", "Should every department be informed?"],["Chair", "Yes. It is essential that each team be notified."],["Secretary", "Understood."]],
    speaking: "Give two formal recommendations using the mandative subjunctive.", speakingUz: "Mandative subjunctive yordamida ikkita rasmiy tavsiya bering.",
    writing: "Draft a formal recommendation containing three mandative subjunctive structures.", writingUz: "Uchta mandative subjunctive strukturasi qatnashgan rasmiy tavsiya yozing."
  },
  "c1-90": {
    title: "An exceptional warning", titleUz: "Favqulodda ogohlantirish",
    reading: "Under no circumstances should the laboratory doors be left unlocked after the final inspection. Not only does the rule protect equipment, but it also prevents unauthorised access to sensitive data. Little did the new assistant realise how seriously the research team treated the procedure until he received the induction briefing.",
    readingUz: "Yakuniy tekshiruvdan keyin laboratoriya eshiklari hech qanday holatda ochiq qoldirilmasligi kerak. Bu qoida nafaqat jihozlarni, balki maxfiy ma’lumotlarga ruxsatsiz kirishni ham himoya qiladi.",
    listening: [["Supervisor", "Under no circumstances should this door be left open."],["Assistant", "Is the data inside sensitive?"],["Supervisor", "Yes. Not only is it sensitive, but access is restricted."],["Assistant", "I understand."]],
    speaking: "Use inversion to give a strong formal warning and an emphatic statement.", speakingUz: "Kuchli rasmiy ogohlantirish va ta’kidlangan fikr berish uchun inversion ishlating.",
    writing: "Write a formal policy notice using two advanced inversion structures.", writingUz: "Ikki advanced inversion strukturasi bilan rasmiy siyosat xabarnomasini yozing."
  },
  "c1-91": {
    title: "Conditions in a policy plan", titleUz: "Siyosat rejasidagi shartlar",
    reading: "Provided that the funding remains stable, the programme can be expanded next year. Unless the evaluation reveals serious weaknesses, the board is expected to approve the next stage. Were the budget to fall sharply, however, the timetable would have to be revised.",
    readingUz: "Moliyalashtirish barqaror qolsa, dastur kelasi yil kengaytirilishi mumkin. Baholash jiddiy kamchiliklarni aniqlamasa, kengash keyingi bosqichni tasdiqlashi kutilmoqda. Ammo byudjet keskin kamayadigan bo‘lsa, jadval qayta ko‘rib chiqilishi kerak bo‘ladi.",
    listening: [["Director", "Provided that funding remains stable, we can expand."],["Analyst", "And what if the budget falls?"],["Director", "Were it to fall sharply, we would revise the timetable."],["Analyst", "That makes the condition clear."]],
    speaking: "Discuss a policy under three different conditions: provided that, unless, and were to.", speakingUz: "Siyosatni provided that, unless va were to bilan uch xil shart asosida muhokama qiling.",
    writing: "Write a conditional policy paragraph using formal condition structures accurately.", writingUz: "Rasmiy conditional strukturalardan to‘g‘ri foydalanib siyosat haqidagi paragraf yozing."
  },
  "c1-92": {
    title: "The process whereby data are collected", titleUz: "Ma’lumot yig‘iladigan jarayon",
    reading: "The study describes the process whereby household data are collected and explains the criteria according to which records are included. The dataset, the reliability of which was checked twice, contains information from several regions. Formal relative structures make the relationships between parts of a technical description explicit.",
    readingUz: "Tadqiqot uy xo‘jaliklari ma’lumotlari yig‘iladigan jarayonni tasvirlaydi va yozuvlar kiritiladigan mezonlarni tushuntiradi. Ishonchliligi ikki marta tekshirilgan ma’lumotlar to‘plami bir nechta hududdan axborotni o‘z ichiga oladi.",
    listening: [["Researcher", "We need a clear process whereby records are collected."],["Reviewer", "And what are the criteria according to which they are included?"],["Researcher", "The criteria are listed in the methods section."],["Reviewer", "Good. That makes the procedure reproducible."]],
    speaking: "Describe a formal process using whereby, whose, and preposition + which.", speakingUz: "Whereby, whose va preposition + which yordamida rasmiy jarayonni tasvirlang.",
    writing: "Write a technical paragraph containing three formal relative structures.", writingUz: "Uchta rasmiy relative structure qatnashgan texnik paragraf yozing."
  },
  "c1-93": {
    title: "Working despite uncertainty", titleUz: "Noaniqlikka qaramay ishlash",
    reading: "No matter how difficult the conditions become, the emergency team continues to collect reliable measurements. However much the weather changes, the monitoring schedule remains in place. The point is not that the work is easy; rather, the concession shows that the difficulty does not change the decision to continue.",
    readingUz: "Sharoit qanchalik qiyin bo‘lmasin, favqulodda guruh ishonchli o‘lchovlarni yig‘ishda davom etadi. Ob-havo qanchalik o‘zgarmasin, kuzatuv jadvali saqlanadi.",
    listening: [["Coordinator", "No matter how difficult the weather is, we continue."],["Researcher", "Does that mean the schedule never changes?"],["Coordinator", "It can change, but the monitoring itself continues."],["Researcher", "So the concession is about the decision, not the conditions."]],
    speaking: "Express a strong concession about a difficult situation.", speakingUz: "Qiyin vaziyat haqida kuchli concession ifodalang.",
    writing: "Write a paragraph using no matter how, however much, and while to contrast difficulty with persistence.", writingUz: "Qiyinchilik va davomiylikni qarama-qarshi qo‘yish uchun no matter how, however much va while ishlating."
  },
  "c1-94": {
    title: "Reporting evidence carefully", titleUz: "Dalilni ehtiyotkor bayon qilish",
    reading: "The latest study suggests that the intervention may reduce waiting times, although the evidence is not yet conclusive. It is widely believed that faster access improves patient satisfaction, but the researchers distinguish that belief from what their own data actually demonstrate. Such reporting protects the boundary between evidence, interpretation, and assumption.",
    readingUz: "So‘nggi tadqiqot aralashuv kutish vaqtini kamaytirishi mumkinligini ko‘rsatmoqda, garchi dalil hali yakuniy bo‘lmasa ham. Tezroq kirish imkoniyati bemorlar qoniqishini oshiradi deb keng tarqalgan, ammo tadqiqotchilar bu fikrni o‘z ma’lumotlari ko‘rsatadigan narsadan ajratadi.",
    listening: [["Researcher", "The evidence suggests a modest improvement."],["Editor", "Can we say the treatment definitely works?"],["Researcher", "Not yet. It is widely believed to help, but our evidence is limited."],["Editor", "Then the wording should remain cautious."]],
    speaking: "Separate a reported belief from what evidence actually demonstrates.", speakingUz: "Keng tarqalgan fikrni dalil amalda ko‘rsatadigan narsadan ajrating.",
    writing: "Write a research-style paragraph distinguishing evidence, interpretation, and uncertainty.", writingUz: "Dalil, talqin va noaniqlikni farqlaydigan tadqiqot uslubidagi paragraf yozing."
  },
  "c1-95": {
    title: "What the modal really implies", titleUz: "Modal fe’lning nozik ma’nosi",
    reading: "The manager needn’t have cancelled the meeting: the problem was resolved before the scheduled time. By contrast, she should have informed the participants earlier. These forms allow a speaker to distinguish unnecessary past action from criticism of an action that was expected but did not happen.",
    readingUz: "Menejer yig‘ilishni bekor qilishi shart emas edi: muammo belgilangan vaqtdan oldin hal bo‘lgan. Aksincha, u ishtirokchilarga ertaroq xabar berishi kerak edi.",
    listening: [["Assistant", "Did she need to cancel the meeting?"],["Manager", "No. She needn’t have cancelled it."],["Assistant", "But she should have informed everyone."],["Manager", "Exactly. The two forms imply different judgements."]],
    speaking: "Contrast unnecessary past action, missed obligation, and possibility.", speakingUz: "Keraksiz o‘tmish harakati, bajarilmagan majburiyat va ehtimolni taqqoslang.",
    writing: "Write a short incident review using three modal-perfect forms with precise meanings.", writingUz: "Aniq ma’noda uchta modal-perfect shakl bilan qisqa hodisa tahlili yozing."
  },
  "c1-96": {
    title: "Language beyond the literal", titleUz: "So‘zma-so‘z bo‘lmagan til",
    reading: "The new training programme aims to raise the bar across the department, but the phrase does not mean physically lifting anything. A second manager described the new policy as a grey area because the rules did not clearly distinguish minor and serious cases. Idiomatic language is efficient when the audience shares the cultural knowledge behind it.",
    readingUz: "Yangi o‘quv dasturi bo‘limdagi talab darajasini oshirishni maqsad qiladi, ammo bu ibora jismonan biror narsani ko‘tarish degani emas. Ikkinchi menejer yangi siyosatni “grey area” deb atadi, chunki qoidalar kichik va jiddiy holatlarni aniq ajratmagan.",
    listening: [["Manager", "We need to raise the bar this year."],["Employee", "You mean the performance standard?"],["Manager", "Exactly. It is an idiomatic expression."],["Employee", "And the new rule still has a grey area."]],
    speaking: "Explain two idioms in context and make clear why a literal translation would fail.", speakingUz: "Ikki idiomni kontekstda tushuntiring va nega so‘zma-so‘z tarjima noto‘g‘ri bo‘lishini ayting.",
    writing: "Write a short professional paragraph using two appropriate idiomatic expressions.", writingUz: "Ikki mos idiomdan foydalanib qisqa professional paragraf yozing."
  },
  "c1-97": {
    title: "From evidence to conclusion", titleUz: "Dalildan xulosaga",
    reading: "The survey found a clear difference between the two groups. However, the sample was limited to one region. Taken together, these findings suggest a meaningful pattern, although they do not justify a universal conclusion. The paragraph becomes coherent because each sentence moves the reader from result, to limitation, to qualified interpretation.",
    readingUz: "So‘rov ikki guruh o‘rtasida aniq farq topdi. Biroq namuna faqat bitta hudud bilan cheklangan. Birgalikda ko‘rib chiqilganda, bu topilmalar muhim tendensiyani ko‘rsatadi, ammo universal xulosani oqlamaydi.",
    listening: [["Analyst", "The survey found a clear difference."],["Reviewer", "But the sample was limited."],["Analyst", "Taken together, the findings suggest a pattern, not a universal rule."],["Reviewer", "That progression is much clearer."]],
    speaking: "Build a four-step spoken argument: finding, limitation, interpretation, conclusion.", speakingUz: "Og‘zaki argumentni to‘rt bosqichda tuzing: topilma, cheklov, talqin, xulosa.",
    writing: "Write a coherent mini-argument in which each sentence develops the previous one.", writingUz: "Har bir gap oldingisini rivojlantiradigan bog‘langan mini-argument yozing."
  },
  "c1-98": {
    title: "Saying the same thing differently", titleUz: "Bir ma’noni boshqacha ifodalash",
    reading: "The study found that attendance increased after the reminder system was introduced. A more formal synthesis would be: “The findings indicate an increase in attendance following the introduction of the reminder system.” The second version changes the structure and register without changing the underlying meaning.",
    readingUz: "Tadqiqot eslatma tizimi joriy qilingach qatnashish oshganini aniqladi. Rasmiyroq sintezda bu “The findings indicate an increase in attendance following the introduction of the reminder system” tarzida berilishi mumkin.",
    listening: [["Student", "Can I say the study found that attendance increased?"],["Teacher", "Yes. For a formal summary, you could say the findings indicate an increase in attendance."],["Student", "So the meaning stays the same."],["Teacher", "Exactly, but the structure and register change."]],
    speaking: "Paraphrase two statements without changing their meaning or level of certainty.", speakingUz: "Ikki gapni ma’no va ishonchlilik darajasini o‘zgartirmasdan parafraz qiling.",
    writing: "Write a short synthesis that combines two source statements without copying their wording.", writingUz: "Ikki manba fikrini so‘zlarini ko‘chirmasdan birlashtiradigan qisqa sintez yozing."
  },
  "c1-99": {
    title: "A difficult professional request", titleUz: "Murakkab professional so‘rov",
    reading: "A project lead needs a partner to revise a delivery date without damaging the relationship. Instead of saying “Change the date”, she asks, “Would you be in a position to review the delivery schedule?” The indirect wording is not empty politeness; it recognises the other person’s authority and leaves room for negotiation.",
    readingUz: "Loyiha rahbari munosabatni buzmasdan yetkazib berish sanasini o‘zgartirishni hamkordan so‘rashi kerak. “Sanani o‘zgartiring” deyish o‘rniga u “Yetkazib berish jadvalini ko‘rib chiqish imkoniyatingiz bormi?” deb so‘raydi.",
    listening: [["Lead", "Would you be in a position to review the schedule?"],["Partner", "We may be able to move it by two days."],["Lead", "That would help us considerably."],["Partner", "Let’s confirm the details this afternoon."]],
    speaking: "Make a request, negotiate a constraint, and clarify an agreement politely.", speakingUz: "Muloyim tarzda so‘rov bering, cheklovni muhokama qiling va kelishuvni aniqlashtiring.",
    writing: "Write a professional email making a sensitive request while leaving room for negotiation.", writingUz: "Muzokara uchun joy qoldirgan holda nozik professional so‘rov haqida email yozing."
  },
  "c1-100": {
    title: "Claim, evidence, limitation", titleUz: "Da’vo, dalil va cheklov",
    reading: "The evidence supports the claim that shorter response times improve customer satisfaction, although the dataset covers only large firms. The result is therefore useful, but its wider implication should be stated cautiously. A strong academic paragraph does not hide a limitation; it explains how the limitation affects the strength of the conclusion.",
    readingUz: "Dalillar qisqaroq javob vaqti mijozlar qoniqishini oshiradi degan da’voni qo‘llab-quvvatlaydi, garchi ma’lumotlar to‘plami faqat yirik firmalarni qamrab olsa ham. Shuning uchun natija foydali, ammo kengroq xulosani ehtiyotkorlik bilan ifodalash kerak.",
    listening: [["Researcher", "The evidence supports the main claim."],["Reviewer", "What is the main limitation?"],["Researcher", "The sample includes only large firms."],["Reviewer", "Then the implication should be qualified."]],
    speaking: "Present a claim, cite evidence, state one limitation, and explain its implication.", speakingUz: "Da’voni ayting, dalil keltiring, bitta cheklovni ko‘rsating va uning oqibatini tushuntiring.",
    writing: "Write a 180–220 word academic paragraph with claim, evidence, limitation, and implication.", writingUz: "Da’vo, dalil, cheklov va oqibatdan iborat 180–220 so‘zli akademik paragraf yozing."
  },
  "c1-101": {
    title: "Managing information flow", titleUz: "Axborot oqimini boshqarish",
    reading: "The new policy was announced last week. The policy affects all regional offices, but the first response came from the northern branch. This office had already tested a similar procedure, so its managers could identify several practical problems immediately. By introducing given information before new information, the paragraph keeps the reader oriented.",
    readingUz: "Yangi siyosat o‘tgan hafta e’lon qilindi. Siyosat barcha hududiy ofislarga ta’sir qiladi, ammo birinchi javob shimoliy filialdan keldi. Bu ofis avval o‘xshash tartibni sinagan edi, shuning uchun menejerlar amaliy muammolarni darhol aniqlay oldi.",
    listening: [["Editor", "The policy affects all regional offices."],["Writer", "Then the next sentence can focus on the northern branch."],["Editor", "Yes. The reader already knows what the office refers to."],["Writer", "That makes the information flow smoother."]],
    speaking: "Explain how you would introduce given information before adding a new detail.", speakingUz: "Yangi detal qo‘shishdan oldin given informationni qanday kiritishingizni tushuntiring.",
    writing: "Rewrite a paragraph so that given information introduces each new idea smoothly.", writingUz: "Har bir yangi fikr oldidan given information tabiiy keladigan qilib paragrafni qayta yozing."
  },
  "c1-102": {
    title: "Choosing the best form", titleUz: "Eng mos shaklni tanlash",
    reading: "A proficient user does not choose a difficult structure simply because it is advanced. The useful question is which form communicates the intended meaning, level of certainty, relationship, and register most precisely. In this review, learners compare alternatives and justify their choices rather than memorising isolated rules.",
    readingUz: "Yuqori darajadagi foydalanuvchi faqat murakkab ko‘ringani uchun strukturani tanlamaydi. Muhim savol — qaysi shakl ma’no, ishonchlilik, munosabat va uslubni eng aniq yetkazadi.",
    listening: [["Teacher", "Which structure would you choose here?"],["Student", "The formal conditional, because the context is a policy report."],["Teacher", "Good. What about the spoken version?"],["Student", "I would use a simpler form because the audience is a colleague."]],
    speaking: "Explain why one grammar or lexical choice is more appropriate than another in a given context.", speakingUz: "Berilgan kontekstda nega bitta grammatik yoki lug‘aviy tanlov boshqasidan mosroq ekanini tushuntiring.",
    writing: "Write a short reflective review explaining three advanced language choices you can now make confidently.", writingUz: "Endi ishonch bilan qila oladigan uchta advanced language tanlovingizni tushuntiradigan qisqa reflektiv matn yozing."
  },
  "c1-103": {
    title: "Grammar under pressure", titleUz: "Bosim ostida grammatika",
    reading: "In a diagnostic task, the learner must decide whether the context requires a completed result, an ongoing activity, a deduction, or an emphatic formal structure. The goal is not to recognise a grammar label but to select a form because of its meaning. This is closer to the decision-making required in real communication.",
    readingUz: "Diagnostik topshiriqda o‘quvchi kontekst tugallangan natija, davom etayotgan faoliyat, taxmin yoki kuchli rasmiy strukturani talab qilishini aniqlashi kerak. Maqsad grammatika nomini tanish emas, balki ma’noga qarab shaklni tanlashdir.",
    listening: [["Tutor", "What tells you to use the perfect rather than the continuous?"],["Learner", "The focus is on the completed result."],["Tutor", "And what would change if duration mattered?"],["Learner", "I would choose a continuous form."]],
    speaking: "Justify your grammar choices instead of only naming the tense.", speakingUz: "Faqat zamon nomini aytish o‘rniga grammatik tanlovingizni asoslang.",
    writing: "Write five short contexts and explain the grammar choice required by each.", writingUz: "Beshta qisqa kontekst yozing va har birida qaysi grammatika kerakligini tushuntiring."
  },
  "c1-104": {
    title: "Lexical precision", titleUz: "Lug‘aviy aniqlik",
    reading: "The proposal raises several issues that warrant further consideration. A less precise writer might say that the proposal “has some problems”, but the stronger expression identifies both the existence of issues and the need for additional analysis. Advanced vocabulary is valuable when it makes a distinction clearer, not merely when it sounds sophisticated.",
    readingUz: "Taklif qo‘shimcha ko‘rib chiqishni talab qiladigan bir qator masalalarni ko‘taradi. Kamroq aniq yozuvchi “taklifda ba’zi muammolar bor” deyishi mumkin, ammo kuchliroq ifoda masalalar mavjudligi va qo‘shimcha tahlil zarurligini birga bildiradi.",
    listening: [["Editor", "Could you make this phrase more precise?"],["Writer", "Instead of “some problems”, I could say “several issues warrant further consideration”."],["Editor", "Good. That also fits the register."],["Writer", "So precision and register work together."]],
    speaking: "Replace three vague expressions with precise alternatives and explain the difference.", speakingUz: "Uchta noaniq ifodani aniq muqobillar bilan almashtiring va farqini tushuntiring.",
    writing: "Write a short professional paragraph and revise three vague expressions for greater lexical precision.", writingUz: "Qisqa professional paragraf yozing va uchta noaniq ifodani aniqroq lug‘at bilan qayta ishlang."
  },
  "c1-105": {
    title: "From sources to synthesis", titleUz: "Manbalardan sintezga",
    reading: "Source A reports a clear short-term improvement, while Source B warns that the sample is too narrow for a broad conclusion. A strong synthesis does not choose one source and ignore the other; it identifies the relationship between them and produces a careful statement that preserves the important qualification.",
    readingUz: "A manbasi qisqa muddatli aniq yaxshilanish haqida xabar beradi, B manbasi esa namuna keng xulosa uchun juda tor ekanini ta’kidlaydi. Kuchli sintez manbalardan birini tanlab boshqasini e’tiborsiz qoldirmaydi.",
    listening: [["Student", "Source A is positive, but Source B is more cautious."],["Tutor", "Can you combine them without losing the limitation?"],["Student", "Yes. I can say the results are promising but not yet generalisable."],["Tutor", "That is a useful synthesis."]],
    speaking: "Combine two different pieces of information into one qualified conclusion.", speakingUz: "Ikki xil ma’lumotni bitta ehtiyotkor xulosaga birlashtiring.",
    writing: "Write a 200-word synthesis that paraphrases two viewpoints and preserves their different levels of certainty.", writingUz: "Ikki nuqtai nazarni parafraz qilib, ularning turli ishonchlilik darajasini saqlaydigan 200 so‘zli sintez yozing."
  },
  "c1-106": {
    title: "A final professional decision", titleUz: "Yakuniy professional qaror",
    reading: "The board has reviewed the evidence, considered the financial risk, and discussed how implementation would be monitored. Taken together, the evidence supports the proposal, provided that the reporting system remains transparent and the first review is completed on schedule. The final statement is deliberately precise: it is supportive, but it also states the conditions that limit the claim.",
    readingUz: "Kengash dalillarni ko‘rib chiqdi, moliyaviy xavfni baholadi va amalga oshirish qanday nazorat qilinishini muhokama qildi. Birgalikda ko‘rib chiqilganda, dalillar taklifni qo‘llab-quvvatlaydi, agar hisobot tizimi shaffof qolsa va birinchi tekshiruv jadval bo‘yicha tugatilsa.",
    listening: [["Chair", "Taken together, the evidence supports the proposal."],["Member", "Are there any conditions?"],["Chair", "Yes. Reporting must remain transparent and the first review must be on time."],["Member", "Then the conclusion is supportive but qualified."]],
    speaking: "Give a final decision that includes evidence, a condition, a qualification, and a clear conclusion.", speakingUz: "Dalil, shart, qualification va aniq xulosani o‘z ichiga olgan yakuniy qaror bildiring.",
    writing: "Write a 220–260 word final recommendation using precise C1 grammar, register, cohesion, and qualification.", writingUz: "Aniq C1 grammatikasi, uslubi, cohesion va qualificationdan foydalanib 220–260 so‘zli yakuniy tavsiya yozing."
  }
};

export function teacherContextFor(lesson: Lesson): Context | undefined {
  return TEACHER_CONTEXTS[lesson.id];
}
