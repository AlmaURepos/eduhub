export const themes = {
  light: {
    name: 'light',
    label: 'Светлая',
    icon: 'bi-sun'
  },
  dark: {
    name: 'dark',
    label: 'Темная',
    icon: 'bi-moon'
  }
};

export const getCurrentTheme = () => {
  const saved = localStorage.getItem('theme');
  return saved || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  
  // Обновляем мета-тег для системной темы
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
  }
};

export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

export const initializeTheme = () => {
  const theme = getCurrentTheme();
  setTheme(theme);
}; 