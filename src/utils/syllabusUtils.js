import mammoth from 'mammoth';

// Утилиты для работы с силлабусом

// Нормализация текста
const normalizeText = (text) => {
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
};

// Очистка номера недели
const cleanWeekNumber = (weekText) => {
  weekText = weekText.replace(/\s+/g, '');
  weekText = weekText.replace(/[/]/g, '-');
  return weekText;
};

// Извлечение номеров недель
const extractWeekNumbers = (weekText) => {
  try {
    if (weekText.includes('-')) {
      const [start, end] = weekText.split('-').map(Number);
      return [start, end];
    }
    const week = parseInt(weekText);
    return [week, week];
  } catch (error) {
    return [0, 0];
  }
};

// Извлечение названия предмета
const extractSubjectName = (tables) => {
  for (const table of tables) {
    // Проходим по всем ячейкам всех таблиц
    for (const row of table) {
      for (const cell of row) {
        const cellText = normalizeText(cell);
        
        // Ищем ячейку, которая начинается с "КОД И НАЗВАНИЕ ДИСЦИПЛИНЫ:"
        if (cellText && cellText.includes('КОД И НАЗВАНИЕ ДИСЦИПЛИНЫ:')) {
          // Извлекаем название после двоеточия
          const parts = cellText.split('КОД И НАЗВАНИЕ ДИСЦИПЛИНЫ:');
          if (parts.length > 1) {
            let subjectName = parts[1].trim();
            
            // Если есть код предмета (например, SDT1005), убираем его
            // Ищем пробел и берем текст после него, но только если это код (содержит цифры)
            const spaceIndex = subjectName.indexOf(' ');
            if (spaceIndex !== -1) {
              const beforeSpace = subjectName.substring(0, spaceIndex);
              // Проверяем, содержит ли часть до пробела цифры (это код предмета)
              if (/\d/.test(beforeSpace)) {
                subjectName = subjectName.substring(spaceIndex + 1).trim();
              }
              // Если нет цифр, оставляем как есть (это уже название предмета)
            }
            
            return subjectName;
          }
        }
      }
    }
  }
  return 'Неизвестный предмет';
};

// Парсинг тематического плана
const parseThematicPlan = (tables) => {
  const result = {};
  let headers = null;
  let lastWeekEnd = 0;

  for (const table of tables) {
    // Проверяем, что таблица имеет 6 колонок (как в Python коде)
    if (table.length === 0 || table[0].length !== 6) {
      continue;
    }

    if (!headers) {
      headers = table[0].map(cell => normalizeText(cell).trim());
      table.splice(0, 1); // Удаляем заголовок
    }

    for (const row of table) {
      if (row.length !== 6) {
        continue;
      }

      const rowData = {};
      headers.forEach((header, i) => {
        const cellText = normalizeText(row[i] || '');
        rowData[header] = cellText || "Нет данных";
      });

      const weekText = cleanWeekNumber(rowData[headers[0]]);
      if (!weekText) {
        continue;
      }

      // Проверяем, что weekText содержит цифры (это действительно номер недели)
      if (!/\d/.test(weekText)) {
        continue;
      }

      const [weekStart, weekEnd] = extractWeekNumbers(weekText);

      // Проверяем, что номера недель валидные (больше 0)
      if (weekStart <= 0 || weekEnd <= 0) {
        continue;
      }

      if (weekStart <= lastWeekEnd && lastWeekEnd !== 0) {
        continue;
      }

      if (!rowData[headers[0]] && lastWeekEnd) {
        rowData[headers[0]] = String(lastWeekEnd);
      }

      lastWeekEnd = Math.max(lastWeekEnd, weekEnd);

      const weekKey = `week-${weekText}`;
      result[weekKey] = {
        topic_name: rowData[headers[1]],
        status: false,
        source: []
      };
    }
  }

  if (Object.keys(result).length > 0) {
    return result;
  }
  throw new Error("Таблица не найдена");
};

// Извлечение таблиц из HTML
const extractTablesFromHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tables = doc.querySelectorAll('table');
  
  const extractedTables = [];
  
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    const tableData = [];
    
    for (const row of rows) {
      const cells = row.querySelectorAll('td, th');
      const rowData = [];
      
      for (const cell of cells) {
        rowData.push(cell.textContent || '');
      }
      
      if (rowData.length > 0) {
        tableData.push(rowData);
      }
    }
    
    if (tableData.length > 0) {
      extractedTables.push(tableData);
    }
  }
  
  return extractedTables;
};

export const downloadAndParseWord = async (file, setProgress) => {
  try {
    setProgress(10);
    
    // Читаем Word файл
    const arrayBuffer = await file.arrayBuffer();
    setProgress(30);
    
    // Конвертируем в HTML
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;
    
    setProgress(50);
    
    // Извлекаем таблицы
    const tables = extractTablesFromHtml(html);
    
    setProgress(70);
    
    // Извлекаем название предмета
    const subjectName = extractSubjectName(tables);
    console.log('Название предмета:', subjectName);
    
    // Парсим тематический план
    const thematicPlan = parseThematicPlan(tables);
    console.log('Тематический план:', thematicPlan);
    
    setProgress(100);
    
    return {
      message: 'Силлабус успешно обработан',
      data: {
        subjectName: subjectName,
        weeks: thematicPlan,
        rawTables: tables // Для отладки
      }
    };
  } catch (error) {
    console.error('Ошибка парсинга:', error);
    throw new Error(`Ошибка обработки файла: ${error.message}`);
  }
};

export const parseSyllabus = (rawData) => {
  try {
    return {
      courseName: 'Программирование на JavaScript',
      courseCode: 'CS-101',
      credits: 3,
      instructor: 'Иванов И.И.',
      semester: 'Весна 2025',
      description: 'Курс по основам программирования на JavaScript',
      weeks: rawData.weeks || {},
      objectives: [
        'Изучить основы JavaScript',
        'Понять DOM манипуляции',
        'Освоить асинхронное программирование'
      ]
    };
  } catch (error) {
    throw new Error(`Ошибка парсинга силлабуса: ${error.message}`);
  }
};

export const formatSyllabusData = (data) => {
  return {
    ...data,
    weeks: data.weeks || {}
  };
}; 