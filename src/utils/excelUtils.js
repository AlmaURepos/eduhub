import * as XLSX from 'xlsx';

export async function downloadAndParseExcel(source, isUrlDownload, setProgressCallback) {
  try {
    let data;
    let sheets = [];

    if (isUrlDownload) {
      if (setProgressCallback) setProgressCallback(10);
      const response = await fetch(source, { method: 'HEAD' });
      if (!response.ok) throw new Error('Нет доступа к файлу по ссылке');

      if (setProgressCallback) setProgressCallback(20);
      const fileResponse = await fetch(source);
      const contentType = fileResponse.headers.get('content-type');
      if (!contentType || (!contentType.includes('excel') && !contentType.includes('text/plain'))) {
        throw new Error('Файл не является .xlsx');
      }

      if (setProgressCallback) setProgressCallback(50);
      data = await fileResponse.arrayBuffer();
    } else {
      if (setProgressCallback) setProgressCallback(20);
      if (!source || typeof source.arrayBuffer !== 'function') {
        throw new Error('Некорректный локальный файл');
      }
      data = await source.arrayBuffer();
    }

    if (setProgressCallback) setProgressCallback(70);
    const workbook = XLSX.read(data, { type: 'array', raw: false, codepage: 65001 });
    sheets = workbook.SheetNames;

    if (setProgressCallback) setProgressCallback(90);
    return { message: 'Файл обработан', sheets, workbook };
  } catch (error) {
    throw new Error(error.message || 'Ошибка обработки файла');
  }
}

export function parseSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', blankrows: true });
  const merges = sheet['!merges'] || []; // Объединенные ячейки

  // Дни недели на трех языках в lowercase
  const daysOfWeek = {
    ru: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
    kz: ['дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі', 'жексенбі'],
    en: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  };
  const allDays = [
    ...daysOfWeek.ru,
    ...daysOfWeek.kz,
    ...daysOfWeek.en
  ].map(day => day.toLowerCase());

  const rawData = [];
  let tableStarted = false;
  let currentDay = '';

  // Функция получения значения объединенной ячейки
  const getMergedValue = (sheet, rowIdx, colIdx) => {
    for (const merge of merges) {
      const { s, e } = merge; // s - начальная, e - конечная ячейка
      if (rowIdx >= s.r && rowIdx <= e.r && colIdx >= s.c && colIdx <= e.c) {
        const cellAddress = XLSX.utils.encode_cell({ r: s.r, c: s.c });
        return sheet[cellAddress] ? String(sheet[cellAddress].v).trim() : '';
      }
    }
    return '';
  };

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const [colA, colB, colC, colD, colE, colF] = row;
    const entry = {
      A: colA ? String(colA).trim().toLowerCase() : '',
      B: colB ? String(colB).trim().toLowerCase() : '',
      C: merges.some(m => m.s.r <= rowIdx && m.e.r >= rowIdx && m.s.c === 2) 
        ? getMergedValue(sheet, rowIdx, 2) 
        : colC ? String(colC).trim() : '',
      D: merges.some(m => m.s.r <= rowIdx && m.e.r >= rowIdx && m.s.c === 3) 
        ? getMergedValue(sheet, rowIdx, 3) 
        : colD ? String(colD).trim() : '',
      E: merges.some(m => m.s.r <= rowIdx && m.e.r >= rowIdx && m.s.c === 4) 
        ? getMergedValue(sheet, rowIdx, 4) 
        : colE ? String(colE).trim() : '',
      F: merges.some(m => m.s.r <= rowIdx && m.e.r >= rowIdx && m.s.c === 5) 
        ? getMergedValue(sheet, rowIdx, 5) 
        : colF ? String(colF).trim() : ''
    };

    // Проверка дня недели в A или B
    let dayInA = allDays.includes(entry.A);
    let dayInB = allDays.includes(entry.B);

    if (dayInA || dayInB) {
      tableStarted = true;
      currentDay = dayInA ? entry.A : entry.B;
      // Добавляем запись, только если есть предмет (C)
      if (entry.C) {
        rawData.push({ A: currentDay, B: entry.B, C: entry.C, D: entry.D, E: entry.E, F: entry.F });
      }
      continue;
    }

    // Добавляем строки с предметом (C не пустое)
    if (tableStarted && entry.C) {
      rawData.push({ A: currentDay, B: entry.B, C: entry.C, D: entry.D, E: entry.E, F: entry.F });
    }
  }

  return rawData;
}