export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
};


export const formatOffsetDateTime = (dateInput) => {
  const date = new Date(dateInput); 
  const isoString = date.toISOString();
  return isoString.split('.')[0] + 'Z'; // "YYYY-MM-DDTHH:MM:SSZ"
};



  // Dùng để tính toán ngày đặt hàng và thời gian dự kiến nhận hàng
export  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
  };