window.onload = function() {
    // --- 1. CONNECTING HTML ELEMENTS ---
    const addBtn = document.getElementById('add-btn');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const list = document.getElementById('expense-list');
    const totalDisplay = document.getElementById('today-total');
    const progressFill = document.getElementById('progress-fill');
    const percentText = document.getElementById('budget-percent');
    const limitInput = document.getElementById('budget-limit-input');
    const dailyTipDisplay = document.getElementById('daily-tip');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    // --- 2. DATA MEMORY ---
    let savedExpenses = JSON.parse(localStorage.getItem('nairaWiseData')) || [];
    let totalSpent = 0;
    let userBudgetLimit = parseFloat(localStorage.getItem('nairaWiseBudget')) || 0;

    if (userBudgetLimit === 0 || userBudgetLimit === 10000 || userBudgetLimit === 1) {
        limitInput.value = ''; 
        userBudgetLimit = 0;
        localStorage.setItem('nairaWiseBudget', 0);
    } else {
        limitInput.value = userBudgetLimit;
    }

    const tips = [
        "Bulk-buy non-perishables; prices usually rise by month-end.",
        "Service your generator! A dirty air filter wastes 10% more fuel.",
        "Audit your data usage—streaming video uses 3x more data than social media.",
        "Negotiate with suppliers today; 2026 inflation hits late-movers hardest."
    ];
    dailyTipDisplay.innerText = tips[Math.floor(Math.random() * tips.length)];

    // --- 3. THE CALCULATION ENGINES ---
    function updateProgressBar() {
        if (!progressFill || userBudgetLimit <= 0) {
            if(progressFill) progressFill.style.width = '0%';
            if(percentText) percentText.innerText = '0%';
            return;
        }
        let percentage = (totalSpent / userBudgetLimit) * 100;
        progressFill.style.width = Math.min(percentage, 100) + '%';
        percentText.innerText = Math.round(percentage) + '%';
        progressFill.style.background = percentage >= 100 ? 'red' : '#00A651';
    }

    function refreshList() {
        list.innerHTML = '';
        totalSpent = 0;
        let catTotals = {};

        savedExpenses.forEach((item, index) => {
            totalSpent += item.amount;
            catTotals[item.category] = (catTotals[item.category] || 0) + item.amount;
            
            const li = document.createElement('li');
            li.style = "display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #222; color:white;";
            li.innerHTML = `<span>${item.category}</span><span>₦${item.amount.toLocaleString()}</span>
                <button onclick="deleteEntry(${index})" style="background:none;border:none;color:red;margin-left:10px;cursor:pointer;">✕</button>`;
            list.appendChild(li);
        });

        totalDisplay.innerText = `₦${totalSpent.toLocaleString()}`;
        updateProgressBar();

        // THE SHARE BUTTON FIX (The only thing I added to your old version)
        if (whatsappBtn) {
            let msg = `*Naira-Wise Report* 📈%0A%0A`;
            for (let cat in catTotals) {
                msg += `• ${cat}: ₦${catTotals[cat].toLocaleString()}%0A`;
            }
            msg += `%0A*Total Spent: ₦${totalSpent.toLocaleString()}*`;
            whatsappBtn.href = "https://api.whatsapp.com/send?text=" + msg;
        }
    }

    // --- 4. THE INSIGHTS FIX (The "Global" Bridge) ---
    window.showInsights = function() {
        const modal = document.getElementById('insights-modal');
        const content = document.getElementById('insights-content');
        
        let reportHtml = `<ul style="list-style:none; padding:0; color:white;">`;
        let catSummary = {};
        savedExpenses.forEach(item => {
            catSummary[item.category] = (catSummary[item.category] || 0) + item.amount;
        });

        for (let cat in catSummary) {
            let p = totalSpent > 0 ? ((catSummary[cat] / totalSpent) * 100).toFixed(1) : 0;
            reportHtml += `<li style="margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                <strong>${cat}:</strong> ₦${catSummary[cat].toLocaleString()} (${p}%)
            </li>`;
        }
        reportHtml += `</ul><p style="margin-top:15px; color:#00A651; font-weight:bold;">Total: ₦${totalSpent.toLocaleString()}</p>`;
        
        if(content) content.innerHTML = reportHtml;
        if(modal) modal.style.display = 'block';
    };

    window.closeInsights = function() {
        const modal = document.getElementById('insights-modal');
        if (modal) modal.style.display = 'none';
    };

    // --- 5. EVENT LISTENERS ---
    addBtn.onclick = function() {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) return;
        savedExpenses.push({ amount, category: categorySelect.value });
        localStorage.setItem('nairaWiseData', JSON.stringify(savedExpenses));
        amountInput.value = '';
        refreshList();
    };

    limitInput.oninput = function() {
        userBudgetLimit = parseFloat(limitInput.value) || 0;
        localStorage.setItem('nairaWiseBudget', userBudgetLimit);
        updateProgressBar();
    };

    window.deleteEntry = function(index) {
        if(confirm("Delete this log?")) {
            savedExpenses.splice(index, 1);
            localStorage.setItem('nairaWiseData', JSON.stringify(savedExpenses));
            refreshList();
        }
    };

    window.clearData = function() {
        if(confirm("Wipe everything?")) {
            localStorage.clear();
            location.reload();
        }
    };

    refreshList();
};
  // --- ⛽ GEN-PREDICTOR ENGINE (RESTORING WHAT I DELETED) ---
    const calcGenBtn = document.getElementById('calc-gen-btn');
    const genResult = document.getElementById('gen-result');

    if (calcGenBtn) {
        calcGenBtn.onclick = function() {
            // Pull the numbers from the input boxes
            const liters = parseFloat(document.getElementById('gen-liters').value);
            const hours = parseFloat(document.getElementById('gen-hours').value);
            const price = parseFloat(document.getElementById('fuel-price').value);

            // Check if all three boxes have numbers
            if (!isNaN(liters) && !isNaN(hours) && !isNaN(price)) {
                const daily = liters * hours * price;
                const monthly = daily * 30;
                
                // Show the result in that empty div
                genResult.innerHTML = `
                    <div style="margin-top:15px; padding:15px; background:rgba(255,140,0,0.1); border-radius:10px; border:1px solid #FF8C00;">
                        <small style="color:#FF8C00; font-weight:bold;">ESTIMATED MONTHLY COST</small>
                        <h2 style="margin:5px 0; color:white;">₦${monthly.toLocaleString()}</h2>
                        <small style="color:#888;">Daily cost: ₦${daily.toLocaleString()}</small>
                    </div>`;
            } else {
                // Error message if a box is empty
                genResult.innerHTML = `<p style="color:#ff4444; font-size:0.8rem; margin-top:10px;">⚠️ Please enter liters, hours, and price first!</p>`;
            }
        };
    }
