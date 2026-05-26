import { PrismaClient } from "@prisma/client";
import { SCENARIOS } from "../lib/communication-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LingoFox database...");

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@lingofox.app" },
    update: {},
    create: {
      email: "demo@lingofox.app",
      name: "Fox Cadet",
      xp: 120,
      level: 1,
      streak: 3,
      dailyGoal: 50,
      lastStudyDate: new Date(),
      avatarConfig: JSON.stringify({
        hat: "none",
        outfit: "none",
        accessory: "none",
        backgroundColor: "#ff8f3d",
      }),
    },
  });

  // Achievements
  const achievements = [
    { slug: "first_steps", title: "First Steps", description: "Started the journey", badgeImage: "🌱", xpThreshold: 0 },
    { slug: "level_5", title: "Rising Star", description: "Reached Level 5", badgeImage: "⭐", xpThreshold: 500 },
    { slug: "daily_goal", title: "Focused Mind", description: "Hit Daily XP Goal", badgeImage: "🎯", xpThreshold: 50 },
    { slug: "test_taker", title: "Exam Master", description: "Took an exam", badgeImage: "🎓", xpThreshold: 0 },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }
  await prisma.userAchievement.upsert({
    where: {
      userId_achievementId: {
        userId: demoUser.id,
        achievementId: (await prisma.achievement.findUniqueOrThrow({ where: { slug: "first_steps" } })).id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      achievementId: (await prisma.achievement.findUniqueOrThrow({ where: { slug: "first_steps" } })).id,
    },
  });

  // Lessons
  const lessonsData = [
    {
      slug: "beginner_vocab_1",
      title: "Daily Objects & Family Relations",
      description: "Master essential vocabulary for daily life.",
      category: "Vocabulary",
      difficulty: "Beginner",
      xpReward: 30,
      order: 1,
      steps: [
        {
          title: "Key Vocabulary",
          type: "vocab",
          order: 0,
          content: JSON.stringify({
            vocabItems: [
              { word: "Mother", translation: "Mẹ", definition: "A female parent who has given birth or raised a child.", example: "My mother always tells me to study hard." },
              { word: "Father", translation: "Bố", definition: "A male parent who has raised a child.", example: "His father is a high school teacher." },
              { word: "Key", translation: "Chìa khóa", definition: "A small metal tool used for opening or locking a door.", example: "Where are my house keys?" },
            ],
          }),
        },
        {
          title: "Multiple Choice Practice",
          type: "quiz",
          order: 1,
          question: "Which word refers to 'a male parent who has raised a child'?",
          options: JSON.stringify(["Mother", "Sister", "Father", "Key"]),
          correctAnswer: "Father",
        },
        {
          title: "Listen and Write What You Hear",
          type: "listening",
          order: 2,
          question: "Type what you hear",
          correctAnswer: "Where are my house keys?",
          content: JSON.stringify({ listeningAudioText: "Where are my house keys?" }),
        },
      ],
    },
    {
      slug: "daily_conv_1",
      title: "Café Ordering & Greetings",
      description: "Practice café vocabulary and polite ordering.",
      category: "Communication English",
      difficulty: "Beginner",
      xpReward: 40,
      order: 2,
      steps: [
        {
          title: "Café Vocabulary",
          type: "vocab",
          order: 0,
          content: JSON.stringify({
            vocabItems: [
              { word: "Espresso", translation: "Cà phê espresso", definition: "Strong black coffee made by forcing steam through ground coffee beans.", example: "I would like a double shot of espresso, please." },
              { word: "Croissant", translation: "Bánh sừng bò", definition: "A flaky, buttery French pastry shaped like a crescent.", example: "A fresh croissant and hot coffee is the perfect breakfast." },
              { word: "Order", translation: "Đặt hàng", definition: "A request for food or drink in a restaurant or cafe.", example: "Are you ready to order, sir?" },
            ],
          }),
        },
        {
          title: "Ordering Quiz",
          type: "quiz",
          order: 1,
          question: "Which item is a buttery, flaky French pastry shaped like a crescent?",
          options: JSON.stringify(["Espresso", "Bagel", "Muffin", "Croissant"]),
          correctAnswer: "Croissant",
        },
        {
          title: "Listen and Write What You Hear",
          type: "listening",
          order: 2,
          question: "Type what you hear",
          correctAnswer: "I would like a fresh croissant, please.",
          content: JSON.stringify({ listeningAudioText: "I would like a fresh croissant, please." }),
        },
      ],
    },
    {
      slug: "grammar_part_5",
      title: "TOEIC Part 5 Grammar",
      description: "Prepositions & gerunds for TOEIC Part 5.",
      category: "Grammar",
      difficulty: "TOEIC",
      xpReward: 40,
      order: 3,
      isLocked: true,
      steps: [
        {
          title: "Grammar Tip",
          type: "text",
          order: 0,
          content: JSON.stringify({ body: "TOEIC Part 5 tests incomplete sentences. Watch for prepositions + gerunds (-ing)." }),
        },
        {
          title: "Quick Quiz",
          type: "quiz",
          order: 1,
          question: "Employees are reminded that all safety gear _______ be worn.",
          options: JSON.stringify(["must", "would", "can", "might"]),
          correctAnswer: "must",
        },
      ],
    },
    {
      slug: "ielts_speaking_2",
      title: "IELTS Speaking Coach",
      description: "Describe an interesting event — cue card practice.",
      category: "Speaking",
      difficulty: "IELTS",
      xpReward: 50,
      order: 4,
      isLocked: true,
      steps: [
        {
          title: "Cue Card Prompt",
          type: "text",
          order: 0,
          content: JSON.stringify({ body: "Describe an interesting event you attended. You should say: what it was, when/where, and why it was memorable." }),
        },
      ],
    },
  ];

  for (const lesson of lessonsData) {
    const { steps, ...lessonFields } = lesson;
    const saved = await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: lessonFields,
      create: { ...lessonFields, slug: lesson.slug },
    });
    await prisma.lessonStep.deleteMany({ where: { lessonId: saved.id } });
    await prisma.lessonStep.createMany({
      data: steps.map((s) => ({
        lessonId: saved.id,
        title: s.title,
        type: s.type,
        order: s.order,
        content: s.content ?? "",
        question: s.question ?? null,
        options: s.options ?? null,
        correctAnswer: s.correctAnswer ?? null,
      })),
    });
  }

  // Mark first lesson complete for demo
  const firstLesson = await prisma.lesson.findUnique({ where: { slug: "beginner_vocab_1" } });
  if (firstLesson) {
    await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: demoUser.id, lessonId: firstLesson.id } },
      update: { completed: true, score: 100 },
      create: { userId: demoUser.id, lessonId: firstLesson.id, completed: true, score: 100 },
    });
  }

  // Exams
  const toeicExam = await prisma.exam.upsert({
    where: { slug: "toeic_mock_1" },
    update: {},
    create: {
      slug: "toeic_mock_1",
      title: "TOEIC Listening & Reading Sprint",
      type: "TOEIC",
      duration: 15,
      totalXp: 100,
    },
  });
  await prisma.examQuestion.deleteMany({ where: { examId: toeicExam.id } });
  await prisma.examQuestion.createMany({
    data: [
      {
        examId: toeicExam.id,
        section: "Listening",
        questionNumber: 1,
        questionText: "Listen and select the best statement describing the photograph.",
        passage: "He is looking at some books in the library.",
        options: JSON.stringify([
          "(A) He is eating in a busy restaurant.",
          "(B) He is looking at some books in the library.",
          "(C) He is walking outside in a green park.",
          "(D) He is sleeping on a wood bench.",
        ]),
        correctAnswer: "(B) He is looking at some books in the library.",
      },
      {
        examId: toeicExam.id,
        section: "Reading",
        questionNumber: 2,
        passage: "The marketing director announced that the advertising campaign was a huge _______.",
        questionText: "Choose the word that best completes the sentence.",
        options: JSON.stringify(["(A) succeed", "(B) success", "(C) successful", "(D) successfully"]),
        correctAnswer: "(B) success",
      },
      {
        examId: toeicExam.id,
        section: "Reading",
        questionNumber: 3,
        passage: "Employees are reminded that all safety gear _______ be worn in the factory area.",
        questionText: "Choose the word that best completes the sentence.",
        options: JSON.stringify(["(A) must", "(B) would", "(C) can", "(D) might"]),
        correctAnswer: "(A) must",
      },
      {
        examId: toeicExam.id,
        section: "Reading",
        questionNumber: 4,
        passage: "Despite the _______ weather, the charity run was attended by over 500 runners.",
        questionText: "Choose the word that best completes the sentence.",
        options: JSON.stringify(["(A) adverse", "(B) adversity", "(C) adversely", "(D) adverseness"]),
        correctAnswer: "(A) adverse",
      },
      {
        examId: toeicExam.id,
        section: "Reading",
        questionNumber: 5,
        passage: "The new software update will allow users to customize their interface _______.",
        questionText: "Choose the word that best completes the sentence.",
        options: JSON.stringify(["(A) easily", "(B) ease", "(C) easy", "(D) easiness"]),
        correctAnswer: "(A) easily",
      },
    ],
  });

  const ieltsExam = await prisma.exam.upsert({
    where: { slug: "ielts_mock_1" },
    update: {},
    create: {
      slug: "ielts_mock_1",
      title: "IELTS Reading & Speaking Review",
      type: "IELTS",
      duration: 20,
      totalXp: 150,
    },
  });
  await prisma.examQuestion.deleteMany({ where: { examId: ieltsExam.id } });
  await prisma.examQuestion.createMany({
    data: [
      {
        examId: ieltsExam.id,
        section: "Reading",
        questionNumber: 1,
        passage: "Climate scientists agree that human activities are the primary driver of global temperature rise since the mid-20th century.",
        questionText: "What is the main driver of global temperature rise according to the text?",
        options: JSON.stringify([
          "(A) Natural volcanic cycles",
          "(B) Human activities",
          "(C) Solar radiation changes",
          "(D) Ocean current shifts",
        ]),
        correctAnswer: "(B) Human activities",
      },
      {
        examId: ieltsExam.id,
        section: "Reading",
        questionNumber: 2,
        passage: "Renewable energy sources such as wind and solar power have become increasingly cost-competitive with fossil fuels.",
        questionText: "According to the passage, renewable energy is:",
        options: JSON.stringify([
          "(A) More expensive than fossil fuels",
          "(B) Becoming cost-competitive",
          "(C) Not widely used",
          "(D) Harmful to the environment",
        ]),
        correctAnswer: "(B) Becoming cost-competitive",
      },
    ],
  });

  // Listening exercises
  const listening = [
    { title: "Café Order — US Accent", type: "dictation", difficulty: "Beginner", accent: "US", transcript: "I would like a medium cappuccino with oat milk, please.", question: "Listen and type exactly what you hear.", correctAnswer: "I would like a medium cappuccino with oat milk, please.", imageUrl: "cozy café interior morning light" },
    { title: "Airport Announcement — UK Accent", type: "multiple_choice", difficulty: "Intermediate", accent: "UK", transcript: "Flight BA284 to London Heathrow is now boarding at Gate 12.", question: "Which gate is boarding?", options: JSON.stringify(["Gate 10", "Gate 12", "Gate 14", "Gate 22"]), correctAnswer: "Gate 12", imageUrl: "airport departure gate" },
    { title: "Beach Scene — AU Accent", type: "image_match", difficulty: "Beginner", accent: "AU", transcript: "There are several people surfing near a yellow lifeguard tower on a sunny beach.", question: "Does the audio match this scene?", options: JSON.stringify(["Yes, it matches", "No, different scene"]), correctAnswer: "Yes, it matches", imageUrl: "sunny beach surfers" },
  ];
  await prisma.listeningExercise.deleteMany();
  await prisma.listeningExercise.createMany({ data: listening });

  // Communication scenarios from lib
  for (const [slug, data] of Object.entries(SCENARIOS)) {
    const scenario = await prisma.communicationScenario.upsert({
      where: { slug },
      update: {
        title: data.title,
        description: data.description,
        category: slug,
        icon: data.icon,
        gradient: data.gradient,
        startNodeId: data.startId,
        xpReward: data.xpReward,
      },
      create: {
        slug,
        title: data.title,
        description: data.description,
        category: slug,
        icon: data.icon,
        gradient: data.gradient,
        startNodeId: data.startId,
        xpReward: data.xpReward,
        difficulty: "Beginner",
      },
    });
    await prisma.communicationDialogue.deleteMany({ where: { scenarioId: scenario.id } });
    const nodes = Object.values(data.nodes);
    await prisma.communicationDialogue.createMany({
      data: nodes.map((node, i) => ({
        scenarioId: scenario.id,
        nodeId: node.id,
        order: i,
        speaker: node.speaker,
        speakerRole: node.speakerRole,
        text: node.text,
        translation: node.translation ?? null,
        isEnd: node.isEnd ?? false,
        choices: node.choices ? JSON.stringify(node.choices) : null,
      })),
    });
  }

  // Voice rooms
  await prisma.voiceStudyRoom.deleteMany();
  const room1 = await prisma.voiceStudyRoom.create({ data: { name: "☕ English Cafe (Speaking Practice)" } });
  const room2 = await prisma.voiceStudyRoom.create({ data: { name: "📚 IELTS 7.0+ Group Study Room" } });
  await prisma.voiceStudyRoom.create({ data: { name: "🎧 TOEIC Listening Sprint" } });

  // Community posts
  const alex = await prisma.user.upsert({
    where: { email: "alex@lingofox.app" },
    update: {},
    create: { email: "alex@lingofox.app", name: "Alex The Fox", xp: 4520, level: 12, streak: 45 },
  });
  await prisma.post.deleteMany();
  const post1 = await prisma.post.create({
    data: {
      userId: alex.id,
      title: "How I reached IELTS 8.0 in 6 months! 🦊🏆",
      content: "Focus on collocation dictionaries, write daily essays, and practice shadowing 15 minutes a day!",
    },
  });
  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: demoUser.id,
      content: "Totally agree on shadowing! It improved my intonation so much.",
    },
  });
  await prisma.post.create({
    data: {
      userId: demoUser.id,
      title: "Need a study partner for TOEIC Reading Section",
      content: "Aiming for TOEIC 800+. Let's solve mock tests together this evening!",
    },
  });

  // AI welcome message
  await prisma.aIConversation.deleteMany({ where: { userId: demoUser.id, topic: "kiko_general" } });
  await prisma.aIConversation.create({
    data: {
      userId: demoUser.id,
      role: "assistant",
      message: "Hello! 🦊 I'm Kiko, your AI English Teacher. Let's practice speaking or writing!",
      topic: "kiko_general",
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
