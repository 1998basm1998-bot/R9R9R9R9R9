// دالة للتبديل بين التبويبات
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// ==========================================
// 1. برمجة بيانات الشركة
// ==========================================
document.getElementById('companyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const companyData = {
        name: document.getElementById('compName').value,
        reg: document.getElementById('compReg').value,
        tax: document.getElementById('compTax').value,
        address: document.getElementById('compAddress').value,
        phone: document.getElementById('compPhone').value,
        cap1: document.getElementById('compCap1').value,
        cap2: document.getElementById('compCap2').value
    };
    localStorage.setItem('companyData', JSON.stringify(companyData));
    alert('تم حفظ بيانات الشركة محلياً بنجاح');
});

// استرجاع بيانات الشركة عند فتح التطبيق
window.onload = function() {
    const savedCompany = JSON.parse(localStorage.getItem('companyData'));
    if (savedCompany) {
        document.getElementById('compName').value = savedCompany.name || '';
        document.getElementById('compReg').value = savedCompany.reg || '';
        document.getElementById('compTax').value = savedCompany.tax || '';
        document.getElementById('compAddress').value = savedCompany.address || '';
        document.getElementById('compPhone').value = savedCompany.phone || '';
        document.getElementById('compCap1').value = savedCompany.cap1 || '';
        document.getElementById('compCap2').value = savedCompany.cap2 || '';
    }
    loadAccounts();
    loadJournals();
};

// ==========================================
// 2. برمجة الحسابات (دليل الحسابات)
// ==========================================
document.getElementById('accountForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem('accountsData')) || [];
    
    const newAcc = {
        code: document.getElementById('accCode').value,
        name: document.getElementById('accName').value,
        main: document.getElementById('accMain').value
    };
    
    accounts.push(newAcc);
    localStorage.setItem('accountsData', JSON.stringify(accounts));
    document.getElementById('accountForm').reset();
    loadAccounts();
});

function loadAccounts() {
    let accounts = JSON.parse(localStorage.getItem('accountsData')) || [];
    let tbody = document.querySelector('#accountsTable tbody');
    tbody.innerHTML = '';
    accounts.forEach(acc => {
        tbody.innerHTML += `<tr><td>${acc.code}</td><td>${acc.name}</td><td>${acc.main}</td></tr>`;
    });
}

// ==========================================
// 3. برمجة قيود اليومية
// ==========================================
document.getElementById('journalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let journals = JSON.parse(localStorage.getItem('journalsData')) || [];
    
    const newJournal = {
        num: document.getElementById('jNum').value,
        date: document.getElementById('jDate').value,
        desc: document.getElementById('jDesc').value,
        debit: parseFloat(document.getElementById('jDebit').value) || 0,
        credit: parseFloat(document.getElementById('jCredit').value) || 0
    };
    
    journals.push(newJournal);
    localStorage.setItem('journalsData', JSON.stringify(journals));
    document.getElementById('journalForm').reset();
    loadJournals();
});

function loadJournals() {
    let journals = JSON.parse(localStorage.getItem('journalsData')) || [];
    let tbody = document.querySelector('#journalTable tbody');
    tbody.innerHTML = '';
    journals.forEach(j => {
        tbody.innerHTML += `<tr><td>${j.num}</td><td>${j.date}</td><td>${j.desc}</td><td>${j.debit}</td><td>${j.credit}</td></tr>`;
    });
}

// ==========================================
// 4. برمجة التقارير
// ==========================================
function generateReport() {
    let journals = JSON.parse(localStorage.getItem('journalsData')) || [];
    let totalDebit = 0;
    let totalCredit = 0;
    
    journals.forEach(j => {
        totalDebit += j.debit;
        totalCredit += j.credit;
    });
    
    let resultDiv = document.getElementById('reportResult');
    resultDiv.innerHTML = `
        <p>إجمالي المدين: ${totalDebit}</p>
        <p>إجمالي الدائن: ${totalCredit}</p>
        <p>الفرق (الرصيد): ${totalDebit - totalCredit}</p>
    `;
    
    if(totalDebit === totalCredit) {
        resultDiv.innerHTML += `<p style="color:green;">الميزانية متزنة</p>`;
    } else {
        resultDiv.innerHTML += `<p style="color:red;">تنبيه: يوجد فرق في الميزانية، المدين لا يساوي الدائن</p>`;
    }
}
