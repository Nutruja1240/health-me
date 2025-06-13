// ข้อมูลเกณฑ์มาตรฐาน
const standards = {
    // แรงบีบมือ (กิโลกรัม/น้ำหนักตัว)
    gripStrength: {
        male: {
            '19-24': { veryLow: 0.50, low: [0.51, 0.60], medium: [0.61, 0.69], high: [0.70, 0.79], veryHigh: 0.80 },
            '25-29': { veryLow: 0.51, low: [0.52, 0.61], medium: [0.62, 0.70], high: [0.71, 0.80], veryHigh: 0.81 },
            '30-34': { veryLow: 0.52, low: [0.53, 0.61], medium: [0.62, 0.70], high: [0.71, 0.79], veryHigh: 0.80 },
            '35-39': { veryLow: 0.50, low: [0.51, 0.59], medium: [0.60, 0.68], high: [0.69, 0.77], veryHigh: 0.78 },
            '40-44': { veryLow: 0.41, low: [0.42, 0.51], medium: [0.52, 0.62], high: [0.63, 0.72], veryHigh: 0.73 },
            '45-49': { veryLow: 0.36, low: [0.37, 0.49], medium: [0.50, 0.60], high: [0.61, 0.71], veryHigh: 0.72 },
            '50-54': { veryLow: 0.35, low: [0.36, 0.47], medium: [0.48, 0.58], high: [0.59, 0.68], veryHigh: 0.69 },
            '55-59': { veryLow: 0.34, low: [0.35, 0.46], medium: [0.47, 0.57], high: [0.58, 0.68], veryHigh: 0.69 }
        },
        female: {
            '19-24': { veryLow: 0.40, low: [0.41, 0.48], medium: [0.49, 0.55], high: [0.56, 0.63], veryHigh: 0.64 },
            '25-29': { veryLow: 0.40, low: [0.41, 0.49], medium: [0.50, 0.58], high: [0.59, 0.67], veryHigh: 0.68 },
            '30-34': { veryLow: 0.42, low: [0.43, 0.52], medium: [0.53, 0.62], high: [0.63, 0.68], veryHigh: 0.69 },
            '35-39': { veryLow: 0.37, low: [0.38, 0.45], medium: [0.46, 0.54], high: [0.55, 0.62], veryHigh: 0.63 },
            '40-44': { veryLow: 0.36, low: [0.37, 0.44], medium: [0.45, 0.53], high: [0.54, 0.61], veryHigh: 0.62 },
            '45-49': { veryLow: 0.35, low: [0.36, 0.43], medium: [0.44, 0.52], high: [0.53, 0.60], veryHigh: 0.61 },
            '50-54': { veryLow: 0.32, low: [0.33, 0.39], medium: [0.40, 0.46], high: [0.47, 0.53], veryHigh: 0.54 },
            '55-59': { veryLow: 0.30, low: [0.31, 0.38], medium: [0.39, 0.45], high: [0.46, 0.51], veryHigh: 0.52 }
        }
    },

    // การนั่งงอตัวไปข้างหน้า (เซนติเมตร)
    flexibility: {
        male: {
            '19-24': { veryLow: 31, low: [32, 38], medium: [39, 45], high: [46, 53], veryHigh: 54 },
            '25-29': { veryLow: 30, low: [31, 38], medium: [39, 46], high: [47, 52], veryHigh: 53 },
            '30-34': { veryLow: 25, low: [26, 33], medium: [34, 42], high: [43, 51], veryHigh: 52 },
            '35-39': { veryLow: 24, low: [25, 33], medium: [34, 41], high: [42, 49], veryHigh: 50 },
            '40-44': { veryLow: 24, low: [25, 32], medium: [33, 40], high: [41, 47], veryHigh: 48 },
            '45-49': { veryLow: 22, low: [23, 29], medium: [30, 37], high: [38, 45], veryHigh: 46 },
            '50-54': { veryLow: 19, low: [20, 27], medium: [28, 35], high: [36, 42], veryHigh: 43 },
            '55-59': { veryLow: 18, low: [19, 25], medium: [26, 33], high: [34, 40], veryHigh: 41 }
        },
        female: {
            '19-24': { veryLow: 24, low: [25, 32], medium: [33, 40], high: [41, 48], veryHigh: 49 },
            '25-29': { veryLow: 23, low: [24, 30], medium: [31, 38], high: [39, 45], veryHigh: 46 },
            '30-34': { veryLow: 22, low: [23, 29], medium: [30, 37], high: [38, 44], veryHigh: 45 },
            '35-39': { veryLow: 21, low: [22, 28], medium: [29, 35], high: [36, 42], veryHigh: 43 },
            '40-44': { veryLow: 20, low: [21, 26], medium: [27, 33], high: [34, 40], veryHigh: 41 },
            '45-49': { veryLow: 16, low: [17, 22], medium: [23, 28], high: [29, 35], veryHigh: 36 },
            '50-54': { veryLow: 12, low: [13, 18], medium: [19, 24], high: [25, 30], veryHigh: 31 },
            '55-59': { veryLow: 11, low: [12, 17], medium: [18, 23], high: [24, 29], veryHigh: 30 }
        }
    },

    // การซิตอัพ 30 วินาที (ครั้ง)
    sitUps: {
        male: {
            '18-19': { veryLow: 12, low: [13, 15], medium: [16, 20], high: [21, 23], veryHigh: 24 },
            '20-29': { veryLow: 13, low: [14, 17], medium: [18, 22], high: [23, 26], veryHigh: 27 },
            '30-39': { veryLow: 10, low: [11, 14], medium: [15, 19], high: [20, 23], veryHigh: 24 },
            '40-49': { veryLow: 8, low: [9, 12], medium: [13, 18], high: [19, 21], veryHigh: 22 },
            '50-59': { veryLow: 5, low: [6, 9], medium: [10, 15], high: [16, 18], veryHigh: 19 }
        },
        female: {
            '18-19': { veryLow: 10, low: [11, 13], medium: [14, 18], high: [19, 20], veryHigh: 21 },
            '20-29': { veryLow: 6, low: [7, 10], medium: [11, 16], high: [17, 19], veryHigh: 20 },
            '30-39': { veryLow: 4, low: [5, 7], medium: [8, 13], high: [14, 16], veryHigh: 17 },
            '40-49': { veryLow: 3, low: [4, 5], medium: [6, 11], high: [12, 15], veryHigh: 16 },
            '50-59': { veryLow: 1, low: [2, 4], medium: [5, 9], high: [10, 12], veryHigh: 13 }
        }
    },

    // ยืนยกเข่าขึ้นลง 3 นาที (ครั้ง)
    stepTest: {
        male: {
            '19-24': { veryLow: 117, low: [118, 140], medium: [141, 163], high: [164, 186], veryHigh: 187 },
            '25-29': { veryLow: 113, low: [114, 137], medium: [138, 160], high: [161, 183], veryHigh: 184 },
            '30-34': { veryLow: 110, low: [111, 133], medium: [134, 157], high: [158, 180], veryHigh: 181 },
            '35-39': { veryLow: 107, low: [108, 131], medium: [132, 154], high: [155, 178], veryHigh: 179 },
            '40-44': { veryLow: 101, low: [102, 127], medium: [128, 152], high: [153, 178], veryHigh: 179 },
            '45-49': { veryLow: 100, low: [101, 126], medium: [127, 151], high: [152, 176], veryHigh: 177 },
            '50-54': { veryLow: 99, low: [100, 124], medium: [125, 149], high: [150, 174], veryHigh: 175 },
            '55-59': { veryLow: 96, low: [97, 122], medium: [123, 148], high: [149, 173], veryHigh: 174 }
        },
        female: {
            '19-24': { veryLow: 109, low: [110, 132], medium: [133, 154], high: [155, 177], veryHigh: 178 },
            '25-29': { veryLow: 104, low: [105, 128], medium: [129, 152], high: [153, 176], veryHigh: 177 },
            '30-34': { veryLow: 97, low: [98, 123], medium: [124, 149], high: [150, 175], veryHigh: 176 },
            '35-39': { veryLow: 97, low: [98, 122], medium: [123, 147], high: [148, 172], veryHigh: 173 },
            '40-44': { veryLow: 96, low: [97, 121], medium: [122, 146], high: [147, 170], veryHigh: 171 },
            '45-49': { veryLow: 93, low: [94, 118], medium: [119, 144], high: [145, 170], veryHigh: 171 },
            '50-54': { veryLow: 87, low: [88, 114], medium: [115, 142], high: [143, 169], veryHigh: 170 },
            '55-59': { veryLow: 83, low: [84, 110], medium: [111, 137], high: [138, 163], veryHigh: 164 }
        }
    }
};

// เกณฑ์ดัชนีมวลกาย (BMI)
const bmiCategories = [
    { max: 18.5, category: 'น้ำหนักน้อย / ผอม', risk: 'ต่ำ', advice: 'ควรรับประทานอาหารที่มีประโยชน์ให้มากขึ้น' },
    { max: 22.9, category: 'ปกติ (สุขภาพดี)', risk: 'ปกติ', advice: 'รักษาน้ำหนักให้อยู่ในเกณฑ์นี้' },
    { max: 24.9, category: 'ท้วม / โรคอ้วนระดับ 1', risk: 'เพิ่มขึ้น', advice: 'ควรควบคุมอาหารและออกกำลังกาย' },
    { max: 29.9, category: 'อ้วน / โรคอ้วนระดับ 2', risk: 'สูง', advice: 'ควรปรึกษาแพทย์หรือนักโภชนาการ' },
    { max: Infinity, category: 'อ้วนมาก / โรคอ้วนระดับ 3', risk: 'สูงมาก', advice: 'ควรปรึกษาแพทย์เพื่อวางแผนลดน้ำหนัก' }
];

// เกณฑ์รอบเอว
const waistCircumference = {
    male: { highRisk: 90, veryHighRisk: 100 },
    female: { highRisk: 80, veryHighRisk: 90 }
};

// ฟังก์ชันช่วยเหลือ
function getAgeGroup(age) {
    if (age >= 19 && age <= 24) return '19-24';
    if (age >= 25 && age <= 29) return '25-29';
    if (age >= 30 && age <= 34) return '30-34';
    if (age >= 35 && age <= 39) return '35-39';
    if (age >= 40 && age <= 44) return '40-44';
    if (age >= 45 && age <= 49) return '45-49';
    if (age >= 50 && age <= 54) return '50-54';
    if (age >= 55 && age <= 59) return '55-59';
    return '19-24'; // ค่าเริ่มต้นหากอายุไม่อยู่ในช่วง
}

function getSitUpAgeGroup(age) {
    if (age >= 18 && age <= 19) return '18-19';
    if (age >= 20 && age <= 29) return '20-29';
    if (age >= 30 && age <= 39) return '30-39';
    if (age >= 40 && age <= 49) return '40-49';
    if (age >= 50 && age <= 59) return '50-59';
    return '20-29'; // ค่าเริ่มต้นหากอายุไม่อยู่ในช่วง
}

// ส่งออกข้อมูล
export { standards, bmiCategories, waistCircumference, getAgeGroup, getSitUpAgeGroup };