window.onload = function() {
    // --- 1. CONNECTING TO YOUR HTML (FIXED NAMES) ---
    const addBtn = document.getElementById('add-btn');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const list = document.getElementById('expense-list');
    const totalDisplay = document.getElementById('today-total');
    const progressFill = document.getElementById('progress-fill');
    const percentText = document.getElementById('budget-percent');
    const limitInput = document.getElementById('budget-limit-input');
    const dailyTipDisplay = document.getElementById('daily-tip');
    
    // NAVIGATION
    const navItems = document.querySelectorAll('.nav-item');
    const insightsModal = document.getElementById('insights-modal');
    const insightsContent = document.getElementById('insights-content'); // FIXED: Matches your HTML

    // GEN PREDICTOR
    const genBtn = document.getElementById('calc-gen-btn');
    const genLiters = document.getElementById('gen-liters');
    const genHours = document.getElementById('gen-hours');
    const fuelPrice = document.getElementById('fuel-price');
    const genResult = document.getElementById('gen-result');

    // --- 2. LOAD SAVED DATA ---
    let savedExpenses = JSON.parse(localStorage.getItem('nairaWiseData')) || [];
    let userBudgetLimit = parseFloat(localStorage.getItem('nairaWiseBudget')) || 0;

    // Keeps budget box empty for placeholder if 0
    limitInput.value = userBudgetLimit > 0 ? userBudgetLimit : '';

    const tips = [
        "Bulk-buy non-perishables; prices usually rise by month-end.",
        "Service your generator! A dirty air filter wastes 10% more fuel.",
        "Audit your data usage—streaming video uses 3x more data than social media.",
        "Negotiate with suppliers today; 2026 inflation hits late-movers hardest."
    ];
    dailyTipDisplay.innerText = tips[Math.floor(Math.random() * tips.length)];

    // --- 3. THE INSIGHTS ENGINE (FIXED CONNECTION) ---
    function updateInsights() {
        if (!insightsContent) return;
        
        if (savedExpenses.length === 0) {
            insightsContent.innerHTML = "<p style='color:gray; text-align:center; padding:20px;'>No logs found yet.</p>";
            return;
        }

        // Calculate Totals
        const totals = {};
        savedExpenses.forEach(item => {
            totals[item.category] = (totals[item.category] || 0) + item.amount;
        });

        // Write to the Insights box
        let html = "<div style='color:white; padding:10px;'>";
        for (let cat in totals) {
            html += `<div style='display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #333;'>
                        <span>${cat}</span>
                        <strong>₦${totals[cat].toLocaleString()}</strong>
                     </div>`;
        }
        html += "</div>";
        insightsContent.innerHTML = html;
    }

    // --- 4. CORE REFRESH FUNCTIONS ---
    function refreshUI() {
        list.innerHTML = '';
        let totalSpent = 0;
        savedExpenses.forEach((item, index) => {
            totalSpent += item.amount;
            const li = document.createElement('li');
            li.style = "display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #222; color:white;";
            li.innerHTML = `<span>${item.category}</span> <span>₦${item.amount.toLocaleString()} 
                            <span onclick="deleteEntry(${index})" style="color:red; margin-left:10px; cursor:pointer;">✕</span></span>`;
            list.appendChild(li);
        });
        
        totalDisplay.innerText = `₦${totalSpent.toLocaleString()}`;

        // Progress Bar Calculation
        if (userBudgetLimit > 0) {
            let percent = (totalSpent / userBudgetLimit) * 100;
            progressFill.style.width = Math.min(percent, 100) + '%';
            percentText.innerText = Math.round(percent) + '%';
            progressFill.style.background = percent >= 100 ? '#ff4444' : '#00A651';
        } else {
            progressFill.style.width = '0%';
            percentText.innerText = '0%';
        }
    }

    // --- 5. EVENT LISTENERS ---

    // Nav Logic: Home vs Insights vs Predictor
    navItems.forEach((item, index) => {
        item.onclick = function(e) {
            e.preventDefault();
            if (index === 1) { // Insights Clicked
                insightsModal.style.display = 'block';
                updateInsights();
            } else if (index === 2) { // Gen-Predict Clicked
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        };
    });

    // Monthly Budget Input
    limitInput.oninput = function() {
        let val = parseFloat(limitInput.value) || 0;
        if (val < 0) { val = 0; limitInput.value = ''; }
        userBudgetLimit = val;
        localStorage.setItem('nairaWiseBudget', userBudgetLimit);
        refreshUI();
    };

    // Log Expense Button
    addBtn.onclick = function() {
        const amt = parseFloat(amountInput.value);
        if (isNaN(amt) || amt <= 0) return;
        savedExpenses.push({ amount: amt, category: categorySelect.value });
        localStorage.setItem('nairaWiseData', JSON.stringify(savedExpenses));
        amountInput.value = '';
        refreshUI();
    };

    // Gen Predictor
    if (genBtn) {
        genBtn.onclick = function() {
            const l = parseFloat(genLiters.value) || 0;
            const h = parseFloat(genHours.value) || 0;
            const p = parseFloat(fuelPrice.value) || 0;
            const cost = l * h * p * 30;
            genResult.style = "margin-top:15px; font-weight:bold; color:#FF8C00;";
            genResult.innerText = `Monthly Cost: ₦${cost.toLocaleString()}`;
        };
    }

    // --- 6. GLOBAL HELPERS ---
    window.deleteEntry = function(i) {
        savedExpenses.splice(i, 1);
        localStorage.setItem('nairaWiseData', JSON.stringify(savedExpenses));
        refreshUI();
    };

    window.clearData = function() {
        if(confirm("Wipe all data?")) {
            localStorage.clear();
            location.reload();
        }
    };

    window.closeInsights = function() {
        insightsModal.style.display = 'none';
    };

    refreshUI();
};