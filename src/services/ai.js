// GROQ API Configuration
const GROQ_TOKEN = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = '/groq/openai/v1/chat/completions'; 
const MODEL = 'llama-3.3-70b-versatile'; 

const BUSY_MSG = "ИИ временно занят, пожалуйста, подождите 10 секунд";

const FALLBACKS = {
  en: {
    title: "Web Development Basics (Standard Course)",
    description: "Since the AI is currently overloaded, we've prepared a quality baseline roadmap for creating modern websites.",
    image_query: "coding",
    steps: [
      { id: 1, title: "Introduction to HTML5", content: "Learn page structure and semantic markup." },
      { id: 2, title: "Styling with CSS3", content: "Master Flexbox and Grid layouts." },
      { id: 3, title: "JavaScript Basics", content: "Learn variables, functions, and DOM manipulation." },
      { id: 4, title: "Working with APIs", content: "Learn how to fetch data from servers." },
      { id: 5, title: "Final Project", content: "Build a full landing page." }
    ]
  },
  ru: {
    title: "Основы веб-разработки (Стандартный курс)",
    description: "Поскольку ИИ сейчас перегружен, мы подготовили для вас качественный базовый маршрут по созданию современных сайтов.",
    image_query: "coding",
    steps: [
      { id: 1, title: "Введение в HTML5", content: "Изучите структуру веб-страницы, основные теги и семантическую верстку." },
      { id: 2, title: "Стилизация с CSS3", content: "Познакомьтесь с селекторами, Flexbox и Grid для создания адаптивных макетов." },
      { id: 3, title: "Основы JavaScript", content: "Разберитесь с переменными, функциями и манипуляцией DOM-деревом." },
      { id: 4, title: "Работа с API", content: "Узнайте, как получать данные с серверов и отображать их на своем сайте." },
      { id: 5, title: "Финальный проект", content: "Создайте полноценный лендинг, объединив все полученные знания." }
    ]
  },
  uz: {
    title: "Veb-ishlab chiqish asoslari (Standart курс)",
    description: "AI hozirda band bo'lgani sababli, biz siz uchun zamonaviy veb-saytlarni yaratish bo'yicha sifatli bazaviy yo'l xaritasini tayyorladik.",
    image_query: "coding",
    steps: [
      { id: 1, title: "HTML5 ga kirish", content: "Veb-sahifa tuzilishi va semantik belgilashni o'rganing." },
      { id: 2, title: "CSS3 yordamida uslublash", content: "Flexbox va Grid layoutlarini o'zlashtiring." },
      { id: 3, title: "JavaScript asoslari", content: "O'zgaruvchilar, funksiyalar va DOM manipulyatsiyasini o'rganing." },
      { id: 4, title: "API bilan ishlash", content: "Serverlardan ma'lumotlarni qanday olishni o'rganing." },
      { id: 5, title: "Yakuniy loyiha", content: "To'liq landing page yarating." }
    ]
  }
};

export const generateCourse = async (topic, locale = 'ru') => {
  const languageNames = { ru: 'Russian', en: 'English', uz: 'Uzbek' };
  const targetLang = languageNames[locale] || 'Russian';

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `Ты — ИИ-ментор платформы SkillSwap. Отвечай кратко и профессионально на языке пользователя (${locale.toUpperCase()}). 
            Create a personalized 5-step learning path for the user's goal.
            Follow these rules:
            1. Return ONLY a valid JSON object.
            2. The language of ALL content MUST be strictly ${targetLang}.
            3. The format MUST be:
            {
              "title": "Course Title",
              "description": "Short description",
              "image_query": "search_keyword",
              "steps": [
                { "id": 1, "title": "Step 1 Title", "content": "Brief theory content" }
              ]
            }`
          },
          { role: "user", content: `Goal: ${topic}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq Service Error:', errorData);
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    return JSON.parse(text);
  } catch (error) {
    console.error('Groq Generation Error:', error);
    const fallback = FALLBACKS[locale] || FALLBACKS.en;
    return { ...fallback, is_fallback: true, info_notif: BUSY_MSG };
  }
};

export const chatWithMentor = async (courseTitle, stepTitle, stepContent, userQuery, locale = 'ru') => {
  const languageNames = { ru: 'Russian', en: 'English', uz: 'Uzbek' };
  const targetLang = languageNames[locale] || 'Russian';

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `Ты — ИИ-ментор платформы SkillSwap. Отвечай кратко и профессионально на языке пользователя (${locale.toUpperCase()}). 
            Context: Course "${courseTitle}", Step "${stepTitle}". Content: "${stepContent}".`
          },
          { role: "user", content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 1024
      }),
    });

    if (!response.ok) {
      console.error('Groq Chat Error:', response.status);
      throw new Error('Groq API Error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq Chat Error:', error);
    return BUSY_MSG;
  }
};

export default { generateCourse, chatWithMentor };
