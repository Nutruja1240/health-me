import { standards, bmiCategories, waistCircumference, getAgeGroup, getSitUpAgeGroup } from './data.js';

// ตรวจสอบว่าอยู่ในหน้าไหน
const isResultsPage = document.getElementById('resultDate') !== null;

if (isResultsPage) {
    // หน้าแสดงผล
    displayResultsFromStorage();
    setupResultPage();
} else {
    // หน้าฟอร์ม
    setupFormPage();
}

function setupFormPage() {
    document.getElementById('healthForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // รับค่าจากฟอร์ม
        const age = parseInt(document.getElementById('age').value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const waist = document.getElementById('waist').value ? parseFloat(document.getElementById('waist').value) : null;
        const gripStrength = document.getElementById('gripStrength').value ? parseFloat(document.getElementById('gripStrength').value) : null;
        const sitAndReach = document.getElementById('sitAndReach').value ? parseFloat(document.getElementById('sitAndReach').value) : null;
        const sitUps = document.getElementById('sitUps').value ? parseInt(document.getElementById('sitUps').value) : null;
        const stepTest = document.getElementById('stepTest').value ? parseInt(document.getElementById('stepTest').value) : null;
        
        // ประเมินผล
        const results = evaluateHealth(age, gender, weight, height, waist, gripStrength, sitAndReach, sitUps, stepTest);
        
        // บันทึกผลและไปหน้าผลลัพธ์
        saveResults(results);
        window.location.href = 'results.html';
    });
}

function setupResultPage() {
    // ปุ่มทำแบบทดสอบใหม่
    document.getElementById('newTest').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // ปุ่มบันทึกผล
    document.getElementById('saveResult').addEventListener('click', function() {
        alert('บันทึกผลเรียบร้อยแล้ว');
    });
    
    // ปุ่มแชร์ผลลัพธ์
    document.getElementById('shareResult').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'ผลประเมินสุขภาพของฉัน',
                text: 'ดูผลประเมินสุขภาพจาก Health Me V.2',
                url: window.location.href
            }).catch(err => {
                console.error('Error sharing:', err);
                fallbackShare();
            });
        } else {
            fallbackShare();
        }
    });
    
    // แสดงประวัติ
    displayHistory();
}

function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('คัดลอกลิงก์ผลลัพธ์ไปยังคลิปบอร์ดแล้ว\nคุณสามารถแชร์ลิงก์นี้ได้');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        prompt('คัดลอกลิงก์ด้านล่างเพื่อแชร์ผลลัพธ์', url);
    });
}

function evaluateHealth(age, gender, weight, height, waist, gripStrength, sitAndReach, sitUps, stepTest) {
    // กลุ่มอายุ
    const ageGroup = getAgeGroup(age);
    const sitUpAgeGroup = getSitUpAgeGroup(age);
    
    // คำนวณ BMI
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);
    
    // ประเมินรอบเอว
    let waistRisk = null;
    let waistCategory = null;
    if (waist !== null) {
        waistRisk = evaluateWaistCircumference(gender, waist);
        waistCategory = waistRisk === 'veryHigh' ? 'สูงมาก' : 
                       waistRisk === 'high' ? 'สูง' : 'ปกติ';
    }
    
    // ประเมินแรงบีบมือ
    let gripScore = null;
    if (gripStrength !== null && weight > 0) {
        const gripRatio = gripStrength / weight;
        gripScore = evaluateGripStrength(gender, ageGroup, gripRatio);
    }
    
    // ประเมินความอ่อนตัว
    let flexibilityScore = null;
    if (sitAndReach !== null) {
        flexibilityScore = evaluateFlexibility(gender, ageGroup, sitAndReach);
    }
    
    // ประเมินซิตอัพ
    let abdominalScore = null;
    if (sitUps !== null) {
        abdominalScore = evaluateSitUps(gender, sitUpAgeGroup, sitUps);
    }
    
    // ประเมินยกเข่า
    let cardioScore = null;
    if (stepTest !== null) {
        cardioScore = evaluateStepTest(gender, ageGroup, stepTest);
    }
    
    // คะแนนรวม
    const overallScore = calculateOverallScore([gripScore, flexibilityScore, abdominalScore, cardioScore]);
    
    // คำแนะนำ
    const recommendations = generateRecommendations(
        bmi, waistRisk, 
        gripScore, flexibilityScore, 
        abdominalScore, cardioScore
    );
    
    return {
        date: new Date().toISOString(),
        age,
        gender,
        weight,
        height,
        bmi,
        bmiCategory,
        waist,
        waistRisk,
        waistCategory,
        gripStrength,
        gripScore,
        sitAndReach,
        flexibilityScore,
        sitUps,
        abdominalScore,
        stepTest,
        cardioScore,
        overallScore,
        recommendations
    };
}

function calculateBMI(weight, height) {
    if (weight <= 0 || height <= 0) return 0;
    const heightInMeter = height / 100;
    return parseFloat((weight / (heightInMeter * heightInMeter)).toFixed(1);
}

function getBMICategory(bmiValue) {
    for (const category of bmiCategories) {
        if (bmiValue <= category.max) {
            return {
                value: category.category,
                risk: category.risk,
                advice: category.advice
            };
        }
    }
    return {
        value: 'ไม่สามารถระบุได้',
        risk: 'ไม่ทราบ',
        advice: 'กรุณาตรวจสอบข้อมูลอีกครั้ง'
    };
}

function evaluateWaistCircumference(gender, waist) {
    const criteria = waistCircumference[gender];
    if (waist >= criteria.veryHighRisk) return 'veryHigh';
    if (waist >= criteria.highRisk) return 'high';
    return 'normal';
}

function evaluateGripStrength(gender, ageGroup, gripRatio) {
    const groupStandards = standards.gripStrength[gender][ageGroup];
    
    if (gripRatio < groupStandards.veryLow) return { level: 'ต่ำมาก', score: 1, percent: 10 };
    if (gripRatio <= groupStandards.low[1]) return { level: 'ต่ำ', score: 2, percent: 30 };
    if (gripRatio <= groupStandards.medium[1]) return { level: 'ปานกลาง', score: 3, percent: 50 };
    if (gripRatio <= groupStandards.high[1]) return { level: 'ดี', score: 4, percent: 75 };
    return { level: 'ดีมาก', score: 5, percent: 95 };
}

function evaluateFlexibility(gender, ageGroup, sitAndReach) {
    const groupStandards = standards.flexibility[gender][ageGroup];
    
    if (sitAndReach < groupStandards.veryLow) return { level: 'ต่ำมาก', score: 1, percent: 10 };
    if (sitAndReach <= groupStandards.low[1]) return { level: 'ต่ำ', score: 2, percent: 30 };
    if (sitAndReach <= groupStandards.medium[1]) return { level: 'ปานกลาง', score: 3, percent: 50 };
    if (sitAndReach <= groupStandards.high[1]) return { level: 'ดี', score: 4, percent: 75 };
    return { level: 'ดีมาก', score: 5, percent: 95 };
}

function evaluateSitUps(gender, ageGroup, sitUps) {
    const groupStandards = standards.sitUps[gender][ageGroup];
    
    if (sitUps < groupStandards.veryLow) return { level: 'ต่ำ', score: 1, percent: 10 };
    if (sitUps <= groupStandards.low[1]) return { level: 'ค่อนข้างต่ำ', score: 2, percent: 30 };
    if (sitUps <= groupStandards.medium[1]) return { level: 'พอใช้', score: 3, percent: 50 };
    if (sitUps <= groupStandards.high[1]) return { level: 'ดี', score: 4, percent: 75 };
    return { level: 'ดีมาก', score: 5, percent: 95 };
}

function evaluateStepTest(gender, ageGroup, stepTest) {
    const groupStandards = standards.stepTest[gender][ageGroup];
    
    if (stepTest < groupStandards.veryLow) return { level: 'ต่ำมาก', score: 1, percent: 10 };
    if (stepTest <= groupStandards.low[1]) return { level: 'ต่ำ', score: 2, percent: 30 };
    if (stepTest <= groupStandards.medium[1]) return { level: 'ปานกลาง', score: 3, percent: 50 };
    if (stepTest <= groupStandards.high[1]) return { level: 'ดี', score: 4, percent: 75 };
    return { level: 'ดีมาก', score: 5, percent: 95 };
}

function calculateOverallScore(scores) {
    const validScores = scores.filter(score => score !== null);
    if (validScores.length === 0) return null;
    
    const total = validScores.reduce((sum, score) => sum + score.score, 0);
    const average = total / validScores.length;
    
    let level, percent;
    if (average < 1.5) { level = 'ต่ำมาก'; percent = 10; }
    else if (average < 2.5) { level = 'ต่ำ'; percent = 30; }
    else if (average < 3.5) { level = 'ปานกลาง'; percent = 50; }
    else if (average < 4.5) { level = 'ดี'; percent = 75; }
    else { level = 'ดีมาก'; percent = 95; }
    
    return { level, score: average, percent };
}

function generateRecommendations(bmi, waistRisk, gripScore, flexibilityScore, abdominalScore, cardioScore) {
    const recommendations = [];
    
    // คำแนะนำตาม BMI
    const bmiCategory = getBMICategory(bmi);
    recommendations.push(bmiCategory.advice);
    
    // คำแนะนำตามรอบเอว
    if (waistRisk === 'high' || waistRisk === 'veryHigh') {
        recommendations.push('รอบเอวเกินมาตรฐาน เสี่ยงต่อโรคเมตาบอลิก ควรลดน้ำหนักและออกกำลังกาย');
    }
    
    // คำแนะนำตามผลทดสอบสมรรถภาพ
    if (gripScore && (gripScore.score <= 2)) {
        recommendations.push('ความแข็งแรงของมือต่ำ ควรฝึกบีบลูกบอลหรืออุปกรณ์เพิ่มความแข็งแรง');
    }
    
    if (flexibilityScore && (flexibilityScore.score <= 2)) {
        recommendations.push('ความอ่อนตัวต่ำ ควรฝึกยืดเหยียดกล้ามเนื้อเป็นประจำ');
    }
    
    if (abdominalScore && (abdominalScore.score <= 2)) {
        recommendations.push('ความแข็งแรงของกล้ามเนื้อท้องต่ำ ควรฝึกซิตอัพหรือแพลงก์เป็นประจำ');
    }
    
    if (cardioScore && (cardioScore.score <= 2)) {
        recommendations.push('สมรรถภาพหัวใจและปอดต่ำ ควรออกกำลังกายแบบแอโรบิก เช่น วิ่ง ว่ายน้ำ ปั่นจักรยาน');
    }
    
    // คำแนะนำทั่วไปหากผลทดสอบดี
    if (recommendations.length === 1) {
        recommendations.push('สมรรถภาพร่างกายโดยรวมอยู่ในเกณฑ์ดี รักษาสุขภาพด้วยการออกกำลังกายสม่ำเสมอและรับประทานอาหารที่มีประโยชน์');
    }
    
    return recommendations;
}

function saveResults(results) {
    // บันทึกลง localStorage
    localStorage.setItem('latestResults', JSON.stringify(results));
    
    // บันทึกลงประวัติ
    const history = JSON.parse(localStorage.getItem('healthHistory')) || [];
    history.unshift(results); // เพิ่มผลล่าสุดไว้ด้านหน้า
    localStorage.setItem('healthHistory', JSON.stringify(history));
}

function displayResultsFromStorage() {
    const results = JSON.parse(localStorage.getItem('latestResults'));
    if (results) {
        displayResults(results);
    } else {
        // ถ้าไม่มีผลล่าสุด ให้กลับไปหน้าฟอร์ม
        window.location.href = 'index.html';
    }
}

function displayResults(results) {
    // แสดงวันที่
    const resultDate = document.getElementById('resultDate');
    if (resultDate) {
        const date = new Date(results.date);
        resultDate.textContent = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // แสดงผล BMI
    const bmiResult = document.getElementById('bmiResult');
    if (bmiResult) {
        bmiResult.querySelector('.result-value').textContent = results.bmi;
        bmiResult.querySelector('.result-category').textContent = results.bmiCategory.value;
        
        // กำหนดสีตามค่า BMI
        if (results.bmi < 18.5) {
            bmiResult.querySelector('.result-category').classList.add('text-warning');
        } else if (results.bmi >= 23) {
            bmiResult.querySelector('.result-category').classList.add('text-danger');
        }
    }
    
    // แสดงผลรอบเอว
    const waistResult = document.getElementById('waistResult');
    if (waistResult) {
        if (results.waist !== null) {
            waistResult.querySelector('.result-value').textContent = `${results.waist} ซม.`;
            waistResult.querySelector('.result-category').textContent = results.waistCategory;
            
            if (results.waistRisk === 'high' || results.waistRisk === 'veryHigh') {
                waistResult.querySelector('.result-category').classList.add('text-danger');
            }
        } else {
            waistResult.querySelector('.result-value').textContent = 'ไม่ทราบ';
            waistResult.querySelector('.result-category').textContent = 'ไม่ได้วัด';
        }
    }
    
    // แสดงผลรวม
    const overallResult = document.getElementById('overallResult');
    if (overallResult && results.overallScore) {
        overallResult.querySelector('.overall-score').textContent = results.overallScore.score.toFixed(1);
        overallResult.querySelector('.result-category').textContent = results.overallScore.level;
        
        // กำหนดสีตามคะแนนรวม
        if (results.overallScore.score <= 2) {
            overallResult.querySelector('.result-category').classList.add('text-danger');
        } else if (results.overallScore.score <= 3) {
            overallResult.querySelector('.result-category').classList.add('text-warning');
        } else {
            overallResult.querySelector('.result-category').classList.add('text-success');
        }
    }
    
    // แสดงผลแรงบีบมือ
    updateTestResult('gripResult', results.gripStrength, results.gripScore, 'กก.');
    
    // แสดงผลความอ่อนตัว
    updateTestResult('flexibilityResult', results.sitAndReach, results.flexibilityScore, 'ซม.');
    
    // แสดงผลซิตอัพ
    updateTestResult('abdominalResult', results.sitUps, results.abdominalScore, 'ครั้ง');
    
    // แสดงผลยกเข่า
    updateTestResult('cardioResult', results.stepTest, results.cardioScore, 'ครั้ง');
    
    // แสดงคำแนะนำ
    const recommendationList = document.getElementById('recommendationList');
    if (recommendationList) {
        recommendationList.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationList.appendChild(li);
        });
    }
}

function updateTestResult(elementId, value, score, unit) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (value !== null && score !== null) {
        element.querySelector('.result-value').textContent = `${value} ${unit}`;
        element.querySelector('.result-category').textContent = score.level;
        
        // กำหนดสีตามคะแนน
        if (score.score <= 2) {
            element.querySelector('.result-category').classList.add('bg-danger');
        } else if (score.score <= 3) {
            element.querySelector('.result-category').classList.add('bg-warning');
        } else {
            element.querySelector('.result-category').classList.add('bg-success');
        }
        
        // อัพเดทความยาว Meter Bar
        const meterBar = element.querySelector('.meter-bar');
        if (meterBar) {
            meterBar.style.width = `${score.percent}%`;
        }
    } else {
        element.querySelector('.result-value').textContent = 'ไม่ทราบ';
        element.querySelector('.result-category').textContent = 'ไม่ได้ทดสอบ';
        element.querySelector('.meter-bar').style.width = '0%';
    }
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const history = JSON.parse(localStorage.getItem('healthHistory')) || [];
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">ไม่มีประวัติการประเมิน</p>';
        return;
    }
    
    // แสดงเฉพาะ 5 รายการล่าสุด
    const recentHistory = history.slice(0, 5);
    
    recentHistory.forEach((item, index) => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="history-date">${dateStr}</span>
            <span class="history-score">${item.overallScore ? item.overallScore.level : 'ไม่ทราบ'}</span>
        `;
        
        historyItem.addEventListener('click', () => {
            displayResults(item);
            window.scrollTo(0, 0);
        });
        
        historyList.appendChild(historyItem);
    });
}