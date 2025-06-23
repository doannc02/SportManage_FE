const ones = [
  "",
  "một",
  "hai",
  "ba",
  "bốn",
  "lăm",
  "sáu",
  "bảy",
  "tám",
  "chín",
];
const tens = [
  "",
  "mười",
  "hai mươi",
  "ba mươi",
  "bốn mươi",
  "năm mươi",
  "sáu mươi",
  "bảy mươi",
  "tám mươi",
  "chín mươi",
];
const hundreds = [
  "",
  "một trăm ",
  "hai trăm ",
  "ba trăm ",
  "bốn trăm ",
  "năm trăm ",
  "sáu trăm ",
  "bảy trăm ",
  "tám trăm ",
  "chín trăm ",
];
const levels = ["", "nghìn", "triệu", "tỷ"];

export function convertNumberToWords(num) {
  if (num === 0) return "không đồng";

  let str = num.toString().replace(/,/g, "");
  let result = "";
  let level = 0;

  while (str.length > 0) {
    const chunk = str.length > 3 ? str.slice(-3) : str;
    str = str.slice(0, str.length - chunk.length);

    let chunkResult = convertChunkToWords(chunk);

    if (chunkResult) {
      result =
        chunkResult + (levels[level] ? " " + levels[level] : "") + " " + result;
    }
    level++;
  }

  // Sửa tại đây: Bỏ " đồng" ở cuối vì hàm convertCurrency đã thêm
  return result.trim();
}

export function convertCurrency(amount, currency) {
  const integerPart = amount.toFixed(2).split(".")[0];
  let result = convertNumberToWords(parseInt(integerPart));

  // Thêm "đồng" ở đây thay vì trong convertNumberToWords
  return result.charAt(0).toUpperCase() + result.slice(1) + " đồng";
}

function convertChunkToWords(chunk) {
  const length = chunk.length;
  let chunkResult = "";
  const chunkDigits = chunk.split("").map(Number);

  // Xử lý phần trăm trăm
  if (length === 3) {
    chunkResult += hundreds[chunkDigits[0]];
    if (chunkDigits[1] === 0 && chunkDigits[2] > 0) {
      chunkResult += " linh";
    }
  }

  // Xử lý phần mười và đơn vị
  if (length >= 2) {
    if (chunkDigits[length - 2] === 1) {
      chunkResult += " mười";
    } else if (chunkDigits[length - 2] > 1) {
      chunkResult += tens[chunkDigits[length - 2]];
    }
  }

  // Xử lý phần đơn vị (đặc biệt xử lý số 5 là 'lăm' thay vì 'năm')
  if (chunkDigits[length - 1] > 0) {
    // Nếu số cuối là 5 và không phải trong trường hợp 15, 25,... thì dùng 'lăm'
    if (
      chunkDigits[length - 1] === 5 &&
      (length === 1 || chunkDigits[length - 2] !== 1)
    ) {
      chunkResult += " lăm";
    } else {
      chunkResult += " " + ones[chunkDigits[length - 1]];
    }
  }

  return chunkResult.trim();
}

// Hàm chuyển đổi phần thập phân - Đã bị loại bỏ
// function convertFraction(fraction: string) {
//   if (!fraction) return ''

//   return (
//     fraction
//       .split('')
//       .map((digit) => ones[parseInt(digit)]) // Chuyển từng chữ số thập phân thành chữ
//       .join(' ') + ' xu'
//   )
// }
