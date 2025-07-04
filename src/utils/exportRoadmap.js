import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportRoadmapToPDF = async (roadmap) => {
  try {
    // Создаем временный элемент для рендеринга
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    // Сортируем темы по неделям
    const sortedTopics = Object.entries(roadmap.roadmap)
      .sort(([a], [b]) => {
        const weekA = parseInt(a.replace('week-', ''));
        const weekB = parseInt(b.replace('week-', ''));
        return weekA - weekB;
      });

    // Вычисляем прогресс
    const totalTopics = Object.keys(roadmap.roadmap).length;
    const completedTopics = Object.values(roadmap.roadmap).filter(topic => topic.status).length;
    const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Разбиваем темы на страницы (5 тем на страницу)
    const topicsPerPage = 5;
    const pages = [];
    for (let i = 0; i < sortedTopics.length; i += topicsPerPage) {
      pages.push(sortedTopics.slice(i, i + topicsPerPage));
    }

    // Создаем PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

        // Обрабатываем каждую страницу
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const pageTopics = pages[pageIndex];
      
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Создаем HTML для текущей страницы
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">${roadmap.title}</h1>
          <div style="margin-bottom: 20px;">
            <span style="background: #007bff; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">
              Прогресс: ${progressPercentage}%
            </span>
          </div>
          <div style="background: #f8f9fa; height: 10px; border-radius: 5px; margin-bottom: 10px;">
            <div style="background: #28a745; height: 100%; width: ${progressPercentage}%; border-radius: 5px;"></div>
          </div>
          <p style="color: #666; margin: 0;">${completedTopics} из ${totalTopics} тем завершено</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Тематический план</h2>
        </div>
        
        <div style="display: grid; gap: 20px;">
          ${pageTopics.map(([weekKey, topic], topicIndex) => {
            const weekNumber = weekKey.replace('week-', '');
            const isCompleted = topic.status;
            
            return `
              <div style="border: 2px solid ${isCompleted ? '#28a745' : '#dee2e6'}; border-radius: 12px; padding: 20px; background: ${isCompleted ? '#d4edda' : '#f8f9fa'};">
                <div style="display: flex; align-items: center;">
                  <div style="background: ${isCompleted ? '#28a745' : '#007bff'}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; margin-right: 15px;">
                    ${weekNumber}
                  </div>
                  <div style="flex-grow: 1;">
                    <h3 style="margin: 0; color: ${isCompleted ? '#28a745' : '#333'}; ${isCompleted ? 'text-decoration: line-through;' : ''}; font-size: 16px;">
                      ${topic.topic_name}
                    </h3>
                    <p style="margin: 5px 0 0 0; color: #666;">
                      Неделя ${weekNumber} ${isCompleted ? '• Завершено' : '• В процессе'}
                    </p>
                  </div>
                  ${isCompleted ? '<span style="color: #28a745; font-size: 24px;">✓</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Страница ${pageIndex + 1} из ${pages.length}</p>
          <p>Создано: ${roadmap.createdAt.toLocaleDateString()}</p>
          <p>EduHub - Платформа для студентов</p>
        </div>
      `;

      // Добавляем элемент в DOM
      document.body.appendChild(tempDiv);

      // Конвертируем в canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Удаляем временный элемент
      document.body.removeChild(tempDiv);

      // Добавляем изображение в PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdfWidth - 20; // Отступы по 10mm с каждой стороны
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    // Сохраняем PDF с именем предмета
    const fileName = `${roadmap.title.replace(/[^a-zA-Z0-9а-яё]/gi, '_')}.pdf`;
    pdf.save(fileName);

    return { success: true };
  } catch (error) {
    console.error('Ошибка экспорта в PDF:', error);
    return { success: false, error: error.message };
  }
}; 