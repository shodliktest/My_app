import type { Exercise, Lesson, Phrase, Word } from "@/lib/types";
import { gap, mcq, order, errx, tr } from "@/lib/content/helpers";

// Production content enrichment: every lesson receives additional lexical items,
// functional phrases, skill practice, and richer listening/reading material.
const BANKS: Record<string, Array<[string,string,string,string,string,string]>> = {
  everyday: [
    ["habit","odat","noun","/ˈhæbɪt/","something you do regularly","I am trying to build a good study habit."],
    ["choice","tanlov","noun","/tʃɔɪs/","an act of choosing between possibilities","You always have a choice."],
    ["prepare","tayyorlanmoq","verb","/prɪˈpeə/","to get ready for something","I prepare my lessons the night before."],
    ["notice","sezmoq","verb","/ˈnəʊtɪs/","to become aware of something","Did you notice the difference?"],
    ["improve","yaxshilamoq","verb","/ɪmˈpruːv/","to become or make better","Practice helps you improve."],
    ["comfortable","qulay","adjective","/ˈkʌmftəbl/","feeling relaxed and at ease","I feel comfortable speaking English now."],
    ["usually","odatda","adverb","/ˈjuːʒuəli/","in most cases","I usually study after dinner."],
    ["already","allaqachon","adverb","/ɔːlˈredi/","before the present time","I have already finished the task."],
  ],
  work: [
    ["agenda","kun tartibi","noun","/əˈdʒendə/","a list of items to discuss","The first item on the agenda is the budget."],
    ["deadline","muddat","noun","/ˈdedlaɪn/","the latest time something must be completed","We have a tight deadline."],
    ["delegate","vazifani topshirmoq","verb","/ˈdelɪɡeɪt/","to give a task to another person","Good managers know when to delegate."],
    ["collaborate","hamkorlik qilmoq","verb","/kəˈlæbəreɪt/","to work together","The teams collaborate on major projects."],
    ["productive","unumli","adjective","/prəˈdʌktɪv/","producing useful results","The meeting was short but productive."],
    ["flexible","moslashuvchan","adjective","/ˈfleksəbl/","able to change or adapt","We need a flexible schedule."],
    ["objective","maqsad","noun","/əbˈdʒektɪv/","a result you aim to achieve","Our main objective is customer satisfaction."],
    ["performance","ish samaradorligi","noun","/pəˈfɔːməns/","how well someone or something works","The review focused on performance."],
  ],
  technology: [
    ["bandwidth","tarmoq sig‘imi","noun","/ˈbændwɪθ/","the amount of data a connection can carry","The video uses a lot of bandwidth."],
    ["encryption","shifrlash","noun","/ɪnˈkrɪpʃən/","the process of protecting information by coding it","Encryption protects sensitive data."],
    ["database","ma’lumotlar bazasi","noun","/ˈdeɪtəbeɪs/","an organised collection of information","The app stores users in a database."],
    ["deploy","ishga joylashtirmoq","verb","/dɪˈplɔɪ/","to release software for use","We deploy the update tonight."],
    ["debug","xatoni tuzatmoq","verb","/ˌdiːˈbʌɡ/","to find and remove software errors","I need to debug this function."],
    ["scalable","kengaytiriladigan","adjective","/ˈskeɪləbl/","able to grow without losing performance","The architecture is scalable."],
    ["interface","interfeys","noun","/ˈɪntəfeɪs/","the part users interact with","The interface is simple and clear."],
    ["privacy","maxfiylik","noun","/ˈprɪvəsi/","protection of personal information","Privacy should be considered from the start."],
  ],
  education: [
    ["syllabus","fan dasturi","noun","/ˈsɪləbəs/","a list of topics covered in a course","The syllabus explains the weekly topics."],
    ["outcome","kutilgan natija","noun","/ˈaʊtkʌm/","a result of an activity or process","The learning outcomes are measurable."],
    ["revise","takrorlamoq","verb","/rɪˈvaɪz/","to study again before an assessment","I revise vocabulary every evening."],
    ["retain","eslab qolmoq","verb","/rɪˈteɪn/","to keep information in memory","Spaced repetition helps retain words."],
    ["fluency","ravonlik","noun","/ˈfluːənsi/","the ability to speak smoothly","Regular conversation builds fluency."],
    ["accuracy","aniqlik","noun","/ˈækjərəsi/","freedom from mistakes","Accuracy matters in formal writing."],
    ["feedback","fikr-mulohaza","noun","/ˈfiːdbæk/","information that helps improve performance","Useful feedback should be specific."],
    ["progress","rivojlanish","noun","/ˈprəʊɡres/","movement toward a higher level","Your progress is visible this month."],
  ],
  environment: [
    ["ecosystem","ekotizim","noun","/ˈiːkəʊsɪstəm/","a community of living things and their environment","A forest is a complex ecosystem."],
    ["pollution","ifloslanish","noun","/pəˈluːʃən/","harmful substances in the environment","Air pollution affects cities."],
    ["conserve","tejamoq/muhofaza qilmoq","verb","/kənˈsɜːv/","to protect or use carefully","We should conserve water."],
    ["disposal","yo‘q qilish","noun","/dɪˈspəʊzl/","the act of getting rid of something","Safe waste disposal is essential."],
    ["ecosystem","ekotizim","noun","/ˈiːkəʊsɪstəm/","a natural system of organisms and their surroundings","Climate change can disrupt an ecosystem."],
    ["drought","qurg‘oqchilik","noun","/draʊt/","a long period with little rain","The region suffered a severe drought."],
    ["habitat","yashash muhiti","noun","/ˈhæbɪtæt/","the natural home of an organism","The project protects wildlife habitat."],
    ["sustainable","barqaror","adjective","/səˈsteɪnəbl/","able to continue without serious environmental harm","We need sustainable solutions."],
  ],
  society: [
    ["access","foydalanish imkoniyati","noun","/ˈækses/","the right or ability to use something","Everyone should have access to education."],
    ["diversity","xilma-xillik","noun","/daɪˈvɜːsəti/","the presence of different people or ideas","Diversity can strengthen a team."],
    ["equality","tenglik","noun","/ɪˈkwɒləti/","the state of being treated fairly and equally","The policy aims to promote equality."],
    ["community","hamjamiyat","noun","/kəˈmjuːnəti/","people connected by a place or interest","The community organised a clean-up."],
    ["participate","ishtirok etmoq","verb","/pɑːˈtɪsɪpeɪt/","to take part in something","Students are encouraged to participate."],
    ["contribute","hissa qo‘shmoq","verb","/kənˈtrɪbjuːt/","to help achieve a result","Everyone can contribute ideas."],
    ["responsibility","mas’uliyat","noun","/rɪˌspɒnsəˈbɪləti/","a duty or obligation","Citizens have a responsibility to follow the law."],
    ["welfare","farovonlik","noun","/ˈwelfeə/","health, happiness and basic support","The programme focuses on child welfare."],
  ],
  health: [
    ["symptom","alomat","noun","/ˈsɪmptəm/","a sign of a health problem","A fever can be a symptom of infection."],
    ["prevention","oldini olish","noun","/prɪˈvenʃən/","action that stops a problem before it happens","Prevention is often cheaper than treatment."],
    ["recovery","tiklanish","noun","/rɪˈkʌvəri/","the process of becoming well again","Her recovery was gradual."],
    ["routine","kundalik tartib","noun","/ruːˈtiːn/","a regular pattern of activity","A healthy routine supports sleep."],
    ["balanced","muvozanatli","adjective","/ˈbælənst/","containing the right combination","A balanced diet includes different food groups."],
    ["fatigue","charchoq","noun","/fəˈtiːɡ/","extreme tiredness","Long hours can lead to fatigue."],
    ["hydration","suyuqlik yetarliligi","noun","/haɪˈdreɪʃən/","having enough water in the body","Hydration is important during exercise."],
    ["well-being","farovonlik","noun","/ˌwel ˈbiːɪŋ/","general health and happiness","Sleep affects mental well-being."],
  ],
  business: [
    ["revenue","daromad","noun","/ˈrevənjuː/","income earned by a business","Revenue increased this quarter."],
    ["margin","foyda marjasi","noun","/ˈmɑːdʒɪn/","the difference between cost and selling price","The company improved its profit margin."],
    ["stakeholder","manfaatdor tomon","noun","/ˈsteɪkhəʊldə/","a person affected by an organisation’s decisions","Stakeholders were invited to the meeting."],
    ["forecast","prognoz","noun","/ˈfɔːkɑːst/","a prediction about future conditions","The sales forecast is optimistic."],
    ["negotiate","muzokara qilmoq","verb","/nɪˈɡəʊʃieɪt/","to discuss to reach an agreement","They negotiated a better contract."],
    ["launch","ishga tushirmoq","verb","/lɔːntʃ/","to introduce a product or service","The company will launch the app in June."],
    ["customer","mijoz","noun","/ˈkʌstəmə/","a person who buys a product or service","Customer feedback guides our decisions."],
    ["strategy","strategiya","noun","/ˈstrætədʒi/","a plan for achieving a goal","We need a long-term strategy."],
  ],
  media: [
    ["headline","sarlavha","noun","/ˈhedlaɪn/","the title of a news story","The headline attracted attention."],
    ["source","manba","noun","/sɔːs/","where information comes from","Always check the original source."],
    ["bias","xolislikning buzilishi","noun","/ˈbaɪəs/","an unfair preference or perspective","Readers should be aware of possible bias."],
    ["verify","tekshirmoq","verb","/ˈverɪfaɪ/","to check that something is true","Journalists should verify claims."],
    ["coverage","yoritish","noun","/ˈkʌvərɪdʒ/","reporting of an event or issue","The event received international coverage."],
    ["audience","auditoriya","noun","/ˈɔːdiəns/","people who receive media content","The programme has a young audience."],
    ["claim","da’vo","noun","/kleɪm/","a statement that something is true","The report made a surprising claim."],
    ["misleading","chalg‘ituvchi","adjective","/ˌmɪsˈliːdɪŋ/","causing someone to believe something incorrect","The headline was misleading."],
  ],
  culture: [
    ["heritage","madaniy meros","noun","/ˈherɪtɪdʒ/","traditions and objects passed through generations","The city is proud of its cultural heritage."],
    ["tradition","an’ana","noun","/trəˈdɪʃən/","a custom passed through generations","The tradition has survived for centuries."],
    ["identity","o‘zlik","noun","/aɪˈdentəti/","the qualities that define a person or group","Language can shape cultural identity."],
    ["custom","urf-odat","noun","/ˈkʌstəm/","a traditional way of behaving","Each region has its own customs."],
    ["festival","bayram/festival","noun","/ˈfestɪvl/","a cultural celebration","The festival attracts visitors every year."],
    ["preserve","asramoq","verb","/prɪˈzɜːv/","to protect something from damage or loss","Museums preserve important artefacts."],
    ["influence","ta’sir","noun","/ˈɪnfluəns/","the power to change someone or something","Music has a strong cultural influence."],
    ["generation","avlod","noun","/ˌdʒenəˈreɪʃən/","people born around the same period","The story was passed to the next generation."],
  ],
  science: [
    ["evidence","dalil","noun","/ˈevɪdəns/","information supporting a conclusion","The evidence supports the hypothesis."],
    ["hypothesis","gipoteza","noun","/haɪˈpɒθəsɪs/","an idea tested by investigation","The researchers proposed a new hypothesis."],
    ["variable","o‘zgaruvchi","noun","/ˈveəriəbl/","a factor that can change","Temperature was the main variable."],
    ["sample","namuna","noun","/ˈsɑːmpəl/","a small part representing a larger group","The sample was tested in the laboratory."],
    ["analyse","tahlil qilmoq","verb","/ˈænəlaɪz/","to examine information carefully","Scientists analyse the results."],
    ["reliable","ishonchli","adjective","/rɪˈlaɪəbl/","able to be trusted","The results are reliable."],
    ["significant","muhim/sezilarli","adjective","/sɪɡˈnɪfɪkənt/","important or large enough to matter","The difference was statistically significant."],
    ["estimate","taxmin qilmoq","verb","/ˈestɪmeɪt/","to calculate approximately","Researchers estimate the population at two million."],
  ],
  travel: [
    ["destination","manzil","noun","/ˌdestɪˈneɪʃən/","the place someone is travelling to","Tashkent is a popular destination for business trips."],
    ["itinerary","sayohat rejasi","noun","/aɪˈtɪnərəri/","a plan of a journey","I sent the itinerary by email."],
    ["departure","jo‘nab ketish","noun","/dɪˈpɑːtʃə/","the act or time of leaving","Our departure is at six."],
    ["accommodation","turar joy","noun","/əˌkɒməˈdeɪʃən/","a place to stay","We booked accommodation near the station."],
    ["reservation","bron","noun","/ˌrezəˈveɪʃən/","an arrangement to keep a place or service","I made a hotel reservation."],
    ["delay","kechikish","noun","/dɪˈleɪ/","a period when something is late","The flight was delayed."],
    ["explore","o‘rganmoq/sayr qilmoq","verb","/ɪkˈsplɔː/","to travel around to learn about a place","We explored the old city."],
    ["luggage","bagaj","noun","/ˈlʌɡɪdʒ/","bags and cases used for travel","My luggage was checked in."],
  ],
};

function domainFor(l: Lesson): string {
  const s = `${l.topic} ${l.topicUz} ${l.reading.title}`.toLowerCase();
  if (/work|career|job|professional|office|meeting|leadership|management|employment/.test(s)) return "work";
  if (/tech|digital|software|internet|ai|algorithm|cyber|data|computer/.test(s)) return "technology";
  if (/education|learning|school|academic|study|teacher|student|exam/.test(s)) return "education";
  if (/environment|climate|energy|nature|wildlife|sustain|carbon|pollution/.test(s)) return "environment";
  if (/society|community|social|citizen|equality|inequality|government|policy/.test(s)) return "society";
  if (/health|fitness|medicine|sleep|nutrition|well/.test(s)) return "health";
  if (/media|news|journal|advert|social media|information/.test(s)) return "media";
  if (/culture|art|heritage|tradition|music|literature|identity/.test(s)) return "culture";
  if (/science|research|evidence|study|experiment/.test(s)) return "science";
  if (/travel|tour|hotel|airport|journey|transport/.test(s)) return "travel";
  if (/business|market|finance|company|customer|sales|investment/.test(s)) return "business";
  return "everyday";
}

const phrasePatterns = [
  ["One thing to keep in mind is that", "Yodda tutish kerak bo‘lgan narsa shuki"],
  ["What I mean is", "Men aytmoqchi bo‘lganim"],
  ["From my point of view", "Mening nuqtai nazarimcha"],
  ["It is worth noting that", "Shuni ta’kidlash kerakki"],
  ["As far as I am concerned", "Mening fikrimcha"],
  ["There is no doubt that", "Shubha yo‘qki"],
];

function enrichVocabulary(l: Lesson): Word[] {
  const bank = BANKS[domainFor(l)];
  const existing = new Set(l.vocabulary.map(w => w.word.toLowerCase()));
  const extra = bank.filter(x => !existing.has(x[0].toLowerCase())).slice(0, 8).map((x, i) => ({
    id: `${l.id}-v${i+13}`,
    word: x[0], uz: x[1], pos: x[2] as Word["pos"], ipa: x[3],
    definition: x[4], example: x[5], exampleUz: `Bu misolda “${x[0]}” so‘zi “${x[1]}” ma’nosida ishlatilgan.`,
    collocations: [], synonyms: [], antonyms: [], family: [],
    level: l.level, category: domainFor(l), icon: "BookOpen",
  }));
  return [...l.vocabulary, ...extra];
}

function enrichPhrases(l: Lesson): Phrase[] {
  const base = [...l.phrases];
  const extra = phrasePatterns.map((p, i) => ({
    id: `${l.id}-ph${base.length+i+1}`,
    phrase: p[0], uz: p[1], ipa: "",
    example: `${p[0]} ${l.topic.toLowerCase()} can affect our decisions.`,
    exampleUz: `${p[1]} ${l.topicUz.toLowerCase()} qarorlarimizga ta’sir qilishi mumkin.`,
    speakingTask: `Use “${p[0]}” in a 30-second answer about ${l.topic}.`,
  }));
  return [...base, ...extra];
}

function extraExercises(l: Lesson, words: Word[]): Exercise[] {
  const out: Exercise[] = [];
  const g = l.grammar;
  const w = words.slice(-8);
  for (let i = 0; i < w.length; i++) {
    const x = w[i]!;
    out.push(gap(`${l.id}-p${i+1}`, `Complete the sentence: ${x.example.replace(new RegExp(x.word, "i"), "___")}`, x.word, x.definition, `${x.word} — ${x.uz}.`, { skill: "vocabulary" }));
    out.push(mcq(`${l.id}-p${i+1}b`, `Which meaning matches “${x.word}”?`, [x.definition, "the opposite of this lesson", "a punctuation mark", "an unrelated object"], x.definition, `${x.word} means ${x.definition}.`, `${x.word} — ${x.uz}.`, { skill: "vocabulary" }));
  }
  out.push(order(`${l.id}-px1`, g.examples[0].en.replace(/[.,!?]/g, "").split(/\s+/), g.examples[0].en.replace(/[.,!?]/g, ""), g.form, g.formUz));
  out.push(errx(`${l.id}-px2`, g.mistakes[0].wrong, g.mistakes[0].right, g.mistakes[0].why, g.mistakes[0].whyUz));
  out.push(tr(`${l.id}-px3`, g.examples[1]?.uz ?? g.examples[0].uz, g.examples[1]?.en ?? g.examples[0].en, g.meaning, { skill: "translation", explanationUz: g.meaningUz }));
  out.push(mcq(`${l.id}-px4`, `Choose the best question form.`, [g.question.examples[0].en, g.examples[0].en, g.mistakes[0].wrong, "Question is the sentence."], g.question.examples[0].en, g.question.form, g.formUz));
  return [...l.exercises, ...out];
}

export function enrichLesson(l: Lesson): Lesson {
  const vocabulary = enrichVocabulary(l);
  const phrases = enrichPhrases(l);
  const newWords = vocabulary.slice(-8);
  const oldScript = l.listening.script.map(s => ({ en: s.en, uz: s.uz }));
  const extraLines = newWords.slice(0, 6).map(w => ({ en: w.example, uz: w.exampleUz }));
  const script = [...oldScript, ...extraLines].map((x, i) => ({ t: i * 4, ...x }));
  const readingExtra = newWords.map(w => `${w.word} is important when we discuss ${l.topic.toLowerCase()}. ${w.example}`).join(" ");
  const readingText = `${l.reading.text.trim()} ${readingExtra}`.trim();
  const readingQuestions = [...l.reading.questions,
    mcq(`${l.id}-read-extra`, `Which target word is used in the extended reading?`, [newWords[0]?.word ?? "practice", newWords[1]?.word ?? "example", "unrelated", "never"], newWords[0]?.word ?? "practice", "The word appears in the extended passage.", "Bu so‘z kengaytirilgan matnda ishlatilgan.", { skill: "reading" }),
  ];
  return {
    ...l,
    vocabulary,
    phrases,
    listening: { ...l.listening, script, questions: [...l.listening.questions, ...newWords.slice(0, 3).map((w,i) => gap(`${l.id}-listen-${i}`, `Listen and complete: ${w.example.replace(new RegExp(w.word,"i"), "___")}`, w.word, w.definition, `${w.word} — ${w.uz}.`, { skill: "listening", audioText: w.example }))] },
    reading: { ...l.reading, text: readingText, words: readingText.split(/\s+/).length, questions: readingQuestions },
    exercises: extraExercises(l, vocabulary),
    test: [...l.test, ...newWords.slice(0, 4).map((w,i) => mcq(`${l.id}-final-${i}`, `Final check: ${w.word}`, [w.uz, "unknown", "opposite", "none"], w.uz, `${w.word} means ${w.uz}.`, `${w.word} — ${w.uz}.`, { skill: "vocabulary" }))],
  };
}

export function enrichAll(lessons: Lesson[]): Lesson[] {
  return lessons.map(enrichLesson);
}
