export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
};


export const formatOffsetDateTime = (date) => {
    const isoString = date.toISOString();
    return isoString.split('.')[0] + 'Z'; // Format: "YYYY-MM-DDTHH:MM:SSZ"
  };