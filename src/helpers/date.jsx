export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
};


export const formatOffsetDateTime = (dateInput) => {
  const date = new Date(dateInput); 
  const isoString = date.toISOString();
  return isoString.split('.')[0] + 'Z'; // "YYYY-MM-DDTHH:MM:SSZ"
};
