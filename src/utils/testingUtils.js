export const programmingTests = {
  "basics": {
    title: "Основы программирования",
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: "Что такое переменная в программировании?",
        options: [
          "Контейнер для хранения данных",
          "Тип данных",
          "Функция",
          "Цикл"
        ],
        correct: 0,
        explanation: "Переменная - это именованный контейнер для хранения данных в памяти компьютера."
      },
      {
        id: 2,
        question: "Какой символ используется для присваивания значения переменной в большинстве языков программирования?",
        options: [
          "==",
          "=",
          "=>",
          "->"
        ],
        correct: 1,
        explanation: "Символ '=' используется для присваивания значения переменной."
      },
      {
        id: 3,
        question: "Что такое функция в программировании?",
        options: [
          "Переменная",
          "Блок кода, который выполняет определенную задачу",
          "Тип данных",
          "Оператор"
        ],
        correct: 1,
        explanation: "Функция - это блок кода, который выполняет определенную задачу и может быть вызван из других частей программы."
      },
      {
        id: 4,
        question: "Какой тип цикла используется, когда количество итераций известно заранее?",
        options: [
          "while",
          "for",
          "do-while",
          "if"
        ],
        correct: 1,
        explanation: "Цикл 'for' используется, когда количество итераций известно заранее."
      },
      {
        id: 5,
        question: "Что такое массив?",
        options: [
          "Одна переменная",
          "Коллекция элементов одного типа",
          "Функция",
          "Условие"
        ],
        correct: 1,
        explanation: "Массив - это коллекция элементов одного типа, хранящихся в последовательных ячейках памяти."
      }
    ]
  },
  "javascript": {
    title: "JavaScript основы",
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: "Как объявить переменную в JavaScript?",
        options: [
          "var x = 5;",
          "variable x = 5;",
          "let x = 5;",
          "const x = 5;"
        ],
        correct: 2,
        explanation: "В современном JavaScript используется 'let' для объявления переменных."
      },
      {
        id: 2,
        question: "Что выведет console.log(typeof [])?",
        options: [
          "array",
          "object",
          "undefined",
          "null"
        ],
        correct: 1,
        explanation: "В JavaScript массивы являются объектами, поэтому typeof [] возвращает 'object'."
      },
      {
        id: 3,
        question: "Как создать функцию в JavaScript?",
        options: [
          "function myFunc() {}",
          "func myFunc() {}",
          "def myFunc() {}",
          "create myFunc() {}"
        ],
        correct: 0,
        explanation: "Функции в JavaScript объявляются с помощью ключевого слова 'function'."
      },
      {
        id: 4,
        question: "Что такое callback функция?",
        options: [
          "Функция, которая вызывается сразу",
          "Функция, передаваемая как аргумент другой функции",
          "Функция без параметров",
          "Асинхронная функция"
        ],
        correct: 1,
        explanation: "Callback функция - это функция, которая передается как аргумент другой функции."
      },
      {
        id: 5,
        question: "Как проверить, является ли переменная массивом?",
        options: [
          "typeof arr === 'array'",
          "Array.isArray(arr)",
          "arr instanceof Array",
          "Все варианты верны"
        ],
        correct: 3,
        explanation: "Все три способа можно использовать для проверки, является ли переменная массивом."
      }
    ]
  }
};

export const getTestById = (testId) => {
  return programmingTests[testId];
};

export const getAllTests = () => {
  return Object.keys(programmingTests).map(id => ({
    id,
    ...programmingTests[id]
  }));
};

export const calculateTestScore = (answers, test) => {
  let correct = 0;
  const results = [];
  
  test.questions.forEach((question, index) => {
    const isCorrect = answers[index] === question.correct;
    if (isCorrect) correct++;
    
    results.push({
      question: question.question,
      userAnswer: answers[index],
      correctAnswer: question.correct,
      isCorrect,
      explanation: question.explanation
    });
  });
  
  const percentage = (correct / test.questions.length) * 100;
  
  return {
    correct,
    total: test.questions.length,
    percentage: Math.round(percentage),
    results
  };
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 