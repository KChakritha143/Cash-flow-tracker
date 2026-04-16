let salary = 0;
let expenses = [];
let chart;

window.onload = function () {
    let savedSalary = localStorage.getItem("salary");
    let savedExpenses = localStorage.getItem("expenses");

    if (savedSalary) {
        salary = Number(savedSalary);
        document.getElementById("salaryDisplay").innerText = salary;
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }

    updateUI();
};

function setSalary() {
    let input = document.getElementById("salaryInput").value;
    salary = Number(input);

    localStorage.setItem("salary", salary);

    document.getElementById("salaryDisplay").innerText = salary;
    updateUI();
}

function addExpense() {
    let name = document.getElementById("expenseName").value;
    let amount = Number(document.getElementById("expenseAmount").value);

    if (!name || amount <= 0) {
        alert("Please enter valid expense details");
        return;
    }

    expenses.push({ name, amount });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateUI();

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
}

function updateUI() {
    let totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    let balance = salary - totalExpense;

    document.getElementById("balance").innerText = balance;

    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach((exp, index) => {
        let li = document.createElement("li");

        let text = document.createElement("span");
        text.innerText = `${exp.name}: ₹${exp.amount}`;

        let btn = document.createElement("button");
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>';

        btn.style.cursor = "pointer";
        btn.style.border = "none";
        btn.style.background = "transparent";

        btn.addEventListener("click", function () {
            deleteExpense(index);
        });

        li.appendChild(text);
        li.appendChild(btn);
        list.appendChild(li);
    });

    let ctx = document.getElementById("myChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Expenses", "Remaining"],
            datasets: [{
                data: [totalExpense, Math.max(0, balance)]
            }]
        },
        options: {
            responsive: false
        }
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateUI();
}