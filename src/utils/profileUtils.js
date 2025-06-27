export const getDefaultProfile = () => {
  return {
    firstName: "Иван",
    lastName: "Иванов",
    email: "ivan.ivanov@student.edu",
    phone: "+7 (999) 123-45-67",
    studentId: "2025-001",
    faculty: "Информационные технологии",
    course: "1",
    group: "ИТ-25-1",
    birthDate: "2000-01-01",
    address: "г. Алматы, ул. Примерная, д. 1, кв. 1"
  };
};

export const saveProfile = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const loadProfile = () => {
  const saved = localStorage.getItem('userProfile');
  if (saved) {
    return JSON.parse(saved);
  }
  return getDefaultProfile();
};

export const updateProfile = (updates) => {
  const currentProfile = loadProfile();
  const updatedProfile = { ...currentProfile, ...updates };
  saveProfile(updatedProfile);
  return updatedProfile;
}; 