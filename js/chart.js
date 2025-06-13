import Chart from 'chart.js/auto';

export function renderHealthChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const labels = ['แรงบีบมือ', 'ความอ่อนตัว', 'ซิตอัพ', 'ยกเข่า'];
    const scores = [
        data.gripScore ? data.gripScore.score : 0,
        data.flexibilityScore ? data.flexibilityScore.score : 0,
        data.abdominalScore ? data.abdominalScore.score : 0,
        data.cardioScore ? data.cardioScore.score : 0
    ];
    
    const backgroundColors = scores.map(score => {
        if (score <= 2) return 'rgba(239, 83, 80, 0.7)';
        if (score <= 3) return 'rgba(255, 152, 0, 0.7)';
        return 'rgba(76, 175, 80, 0.7)';
    });
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'คะแนนสมรรถภาพ',
                data: scores,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                pointRadius: 4
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}