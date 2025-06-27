export const universityEvents = [
  {
    id: 1,
    title: "День открытых дверей 2025",
    category: "academic",
    image: "https://images.unsplash.com/photo-1523240794102-9c5f2a0b0b1a?w=400&h=250&fit=crop",
    shortDescription: "Приглашаем абитуриентов и их родителей на день открытых дверей",
    fullDescription: "Университет проводит традиционный день открытых дверей для будущих студентов. В программе: презентация факультетов, встреча с преподавателями, экскурсия по кампусу, мастер-классы и консультации по поступлению.",
    date: "2025-02-15",
    time: "10:00",
    location: "Главный корпус университета",
    maxParticipants: 200,
    currentParticipants: 45,
    registrationRequired: true,
    tags: ["абитуриенты", "поступление", "презентация"]
  },
  {
    id: 2,
    title: "Научная конференция по ИИ",
    category: "research",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    shortDescription: "Международная конференция по искусственному интеллекту",
    fullDescription: "Ежегодная научная конференция, посвященная последним достижениям в области искусственного интеллекта. Участвуют ведущие исследователи из разных стран. Презентации, дискуссии, нетворкинг.",
    date: "2025-03-20",
    time: "09:00",
    location: "Конференц-зал №1",
    maxParticipants: 150,
    currentParticipants: 89,
    registrationRequired: true,
    tags: ["искусственный интеллект", "наука", "конференция"]
  },
  {
    id: 3,
    title: "Спортивный турнир между факультетами",
    category: "sport",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    shortDescription: "Ежегодные соревнования между студентами разных факультетов",
    fullDescription: "Традиционный спортивный турнир, включающий соревнования по футболу, баскетболу, волейболу и легкой атлетике. Команды представляют все факультеты университета.",
    date: "2025-04-10",
    time: "14:00",
    location: "Спортивный комплекс",
    maxParticipants: 300,
    currentParticipants: 156,
    registrationRequired: false,
    tags: ["спорт", "соревнования", "команды"]
  },
  {
    id: 4,
    title: "Выставка студенческих проектов",
    category: "academic",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    shortDescription: "Демонстрация лучших студенческих работ и проектов",
    fullDescription: "Ежегодная выставка, где студенты представляют свои лучшие проекты, исследования и разработки. Посетители смогут увидеть инновационные решения и пообщаться с авторами.",
    date: "2025-05-05",
    time: "11:00",
    location: "Выставочный зал",
    maxParticipants: 500,
    currentParticipants: 234,
    registrationRequired: false,
    tags: ["проекты", "выставка", "студенты"]
  },
  {
    id: 5,
    title: "Мастер-класс по программированию",
    category: "workshop",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
    shortDescription: "Практическое занятие по современным технологиям разработки",
    fullDescription: "Интерактивный мастер-класс для студентов, интересующихся программированием. Практические задания, работа с реальными проектами, советы от опытных разработчиков.",
    date: "2025-01-25",
    time: "15:00",
    location: "Компьютерный класс №3",
    maxParticipants: 50,
    currentParticipants: 32,
    registrationRequired: true,
    tags: ["программирование", "мастер-класс", "технологии"]
  },
  {
    id: 6,
    title: "Концерт студенческих талантов",
    category: "culture",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    shortDescription: "Музыкальный вечер с участием талантливых студентов",
    fullDescription: "Ежегодный концерт, где студенты демонстрируют свои музыкальные, танцевальные и вокальные таланты. Отличная возможность отдохнуть и насладиться творчеством.",
    date: "2025-06-15",
    time: "18:00",
    location: "Актовый зал",
    maxParticipants: 400,
    currentParticipants: 189,
    registrationRequired: false,
    tags: ["музыка", "концерт", "творчество"]
  }
];

export const categories = [
  { id: "all", name: "Все события", icon: "bi-grid" },
  { id: "academic", name: "Академические", icon: "bi-book" },
  { id: "research", name: "Научные", icon: "bi-lightbulb" },
  { id: "sport", name: "Спортивные", icon: "bi-trophy" },
  { id: "workshop", name: "Мастер-классы", icon: "bi-tools" },
  { id: "culture", name: "Культурные", icon: "bi-music-note" }
];

export const getEventsByCategory = (category) => {
  if (category === "all") return universityEvents;
  return universityEvents.filter(event => event.category === category);
};

export const searchEvents = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return universityEvents.filter(event => 
    event.title.toLowerCase().includes(lowercaseQuery) ||
    event.shortDescription.toLowerCase().includes(lowercaseQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getEventById = (id) => {
  return universityEvents.find(event => event.id === parseInt(id));
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : "Неизвестная категория";
}; 