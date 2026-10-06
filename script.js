// =====================================================
// EXPENSE TRACKER
// =====================================================


// =====================================================
// DOM ELEMENTS
// =====================================================

const transactionForm = document.getElementById("transactionForm");

const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const categoryLabel = document.getElementById("categoryLabel");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");

const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

const clearAllBtn = document.getElementById("clearAllBtn");

const typeButtons = document.querySelectorAll(".type-btn");

const submitTransactionBtn =
    document.getElementById("submitTransactionBtn");


// =====================================================
// SUMMARY ELEMENTS
// =====================================================

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");


// =====================================================
// BUDGET ELEMENTS
// =====================================================

const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budget");

const budgetAmountElement =
    document.getElementById("budgetAmount");

const spentAmountElement =
    document.getElementById("spentAmount");

const remainingAmountElement =
    document.getElementById("remainingAmount");

const budgetProgress =
    document.getElementById("budgetProgress");

const budgetMessage =
    document.getElementById("budgetMessage");


// =====================================================
// SPENDING OVERVIEW ELEMENTS
// =====================================================

const foodBar = document.getElementById("foodBar");
const foodValue = document.getElementById("foodValue");

const transportBar =
    document.getElementById("transportBar");

const transportValue =
    document.getElementById("transportValue");

const shoppingBar =
    document.getElementById("shoppingBar");

const shoppingValue =
    document.getElementById("shoppingValue");

const otherBar =
    document.getElementById("otherBar");

const otherValue =
    document.getElementById("otherValue");


// =====================================================
// CATEGORIES
// =====================================================

const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Rent",
    "Bills",
    "Education",
    "Healthcare",
    "Entertainment",
    "Other"
];

const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other"
];


// =====================================================
// VARIABLES
// =====================================================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let monthlyBudget =
    Number(localStorage.getItem("monthlyBudget")) || 0;

let transactionType = "expense";


// =====================================================
// INITIAL SETUP
// =====================================================

setDefaultDate();

updateFormForType("expense");

displayTransactions();

updateDashboard();

updateBudgetDisplay();


// =====================================================
// SET DEFAULT DATE
// =====================================================

function setDefaultDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;
}


// =====================================================
// UPDATE FORM BASED ON TYPE
// =====================================================

function updateFormForType(type) {

    transactionType = type;


    // ---------------------------------------------
    // EXPENSE
    // ---------------------------------------------

    if (type === "expense") {

        categoryLabel.textContent = "Category";

        submitTransactionBtn.textContent =
            "Add Expense";

        descriptionInput.placeholder =
            "Example: Lunch, Bus ticket, Shopping";

        updateCategoryOptions(expenseCategories);

    }


    // ---------------------------------------------
    // INCOME
    // ---------------------------------------------

    else {

        categoryLabel.textContent =
            "Income Source";

        submitTransactionBtn.textContent =
            "Add Income";

        descriptionInput.placeholder =
            "Example: Monthly salary, Freelance work";

        updateCategoryOptions(incomeCategories);

    }

}


// =====================================================
// UPDATE CATEGORY OPTIONS
// =====================================================

function updateCategoryOptions(categories) {

    categorySelect.innerHTML = "";

    const firstOption =
        document.createElement("option");

    firstOption.value = "";

    firstOption.textContent =
        transactionType === "expense"
            ? "Select category"
            : "Select income source";

    categorySelect.appendChild(firstOption);


    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categorySelect.appendChild(option);

    });

}


// =====================================================
// TYPE BUTTONS
// =====================================================

typeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Remove active class from all buttons

        typeButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Add active class to clicked button

        button.classList.add("active");


        // Get selected type

        const selectedType =
            button.dataset.type;


        // Update complete form

        updateFormForType(selectedType);

    });

});


// =====================================================
// ADD TRANSACTION
// =====================================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const amount =
            Number(amountInput.value);

        const category =
            categorySelect.value;

        const description =
            descriptionInput.value.trim();

        const date =
            dateInput.value;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (amount <= 0) {

            alert("Please enter a valid amount.");

            return;

        }


        if (!category) {

            alert("Please select a category.");

            return;

        }


        if (!description) {

            alert("Please enter a description.");

            return;

        }


        if (!date) {

            alert("Please select a date.");

            return;

        }


        // ---------------------------------------------
        // CREATE TRANSACTION
        // ---------------------------------------------

        const transaction = {

            id: Date.now(),

            type: transactionType,

            amount: amount,

            category: category,

            description: description,

            date: date

        };


        // Add transaction

        transactions.push(transaction);


        // Save

        saveTransactions();


        // Update everything

        displayTransactions();

        updateDashboard();

        updateBudgetDisplay();


        // Reset form

        transactionForm.reset();


        // Restore today's date

        setDefaultDate();


        // Keep selected type

        updateFormForType(transactionType);


        // Show success message

        alert(
            transactionType === "expense"
                ? "Expense added successfully!"
                : "Income added successfully!"
        );

    }
);


// =====================================================
// SAVE TRANSACTIONS
// =====================================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =====================================================
// CALCULATE TOTALS
// =====================================================

function calculateTotals() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            totalIncome += Number(transaction.amount);

        }

        else {

            totalExpense += Number(transaction.amount);

        }

    });


    const balance =
        totalIncome - totalExpense;


    return {
        totalIncome,
        totalExpense,
        balance
    };

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const totals =
        calculateTotals();


    balanceElement.textContent =
        formatCurrency(totals.balance);

    incomeElement.textContent =
        formatCurrency(totals.totalIncome);

    expenseElement.textContent =
        formatCurrency(totals.totalExpense);


    updateSpendingOverview();

}


// =====================================================
// DISPLAY TRANSACTIONS
// =====================================================

function displayTransactions() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        filterCategory.value;


    const filteredTransactions =
        transactions.filter(function (transaction) {


            // -----------------------------------------
            // SEARCH
            // -----------------------------------------

            const matchesSearch =

                transaction.description
                    .toLowerCase()
                    .includes(searchText)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                transaction.type
                    .toLowerCase()
                    .includes(searchText);


            // -----------------------------------------
            // CATEGORY FILTER
            // -----------------------------------------

            const matchesCategory =

                selectedCategory === "All"

                ||

                transaction.category ===
                selectedCategory;


            return matchesSearch &&
                matchesCategory;

        });


    // Clear list

    transactionList.innerHTML = "";


    // No transactions

    if (filteredTransactions.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "empty-message";

        emptyMessage.textContent =
            transactions.length === 0
                ? "No transactions yet."
                : "No matching transactions found.";

        transactionList.appendChild(
            emptyMessage
        );

        return;

    }


    // Display newest first

    filteredTransactions
        .slice()
        .reverse()
        .forEach(function (transaction) {

            createTransactionElement(
                transaction
            );

        });

}


// =====================================================
// CREATE TRANSACTION ELEMENT
// =====================================================

function createTransactionElement(transaction) {

    const transactionItem =
        document.createElement("div");

    transactionItem.className =
        "transaction-item";


    // ---------------------------------------------
    // ICON
    // ---------------------------------------------

    const icon =
        getCategoryIcon(
            transaction.category,
            transaction.type
        );


    // ---------------------------------------------
    // SIGN
    // ---------------------------------------------

    const sign =
        transaction.type === "income"
            ? "+"
            : "-";


    // ---------------------------------------------
    // TYPE TEXT
    // ---------------------------------------------

    const typeText =
        transaction.type === "income"
            ? "Income"
            : "Expense";


    // ---------------------------------------------
    // TRANSACTION HTML
    // ---------------------------------------------

    transactionItem.innerHTML = `

        <div class="transaction-icon">
            ${icon}
        </div>


        <div class="transaction-info">

            <h3>
                ${escapeHTML(transaction.description)}
            </h3>

            <p>
                ${escapeHTML(transaction.category)}
                •
                ${formatDate(transaction.date)}
            </p>

            <small>
                ${typeText}
            </small>

        </div>


        <div class="transaction-right">

            <strong class="${transaction.type}">
                ${sign}${formatCurrency(transaction.amount)}
            </strong>


            <button
                class="delete-btn"
                data-id="${transaction.id}">

                Delete

            </button>

        </div>

    `;


    transactionList.appendChild(
        transactionItem
    );


    // ---------------------------------------------
    // DELETE BUTTON
    // ---------------------------------------------

    const deleteButton =
        transactionItem.querySelector(
            ".delete-btn"
        );


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTransaction(
                transaction.id
            );

        }
    );

}


// =====================================================
// DELETE TRANSACTION
// =====================================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(function (transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    displayTransactions();

    updateDashboard();

    updateBudgetDisplay();

}


// =====================================================
// CATEGORY ICONS
// =====================================================

function getCategoryIcon(category, type) {

    if (type === "income") {

        const incomeIcons = {

            Salary: "💰",

            Freelance: "💻",

            Business: "🏢",

            Investment: "📈",

            Gift: "🎁",

            Other: "💵"

        };


        return incomeIcons[category] || "💵";

    }


    const expenseIcons = {

        Food: "🍔",

        Transport: "🚗",

        Shopping: "🛍️",

        Rent: "🏠",

        Bills: "🧾",

        Education: "📚",

        Healthcare: "🏥",

        Entertainment: "🎬",

        Other: "📦"

    };


    return expenseIcons[category] || "💸";

}


// =====================================================
// BUDGET FORM
// =====================================================

budgetForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const newBudget =
            Number(budgetInput.value);


        if (newBudget <= 0) {

            alert(
                "Please enter a valid budget."
            );

            return;

        }


        monthlyBudget =
            newBudget;


        localStorage.setItem(
            "monthlyBudget",
            monthlyBudget
        );


        updateBudgetDisplay();


        budgetForm.reset();


        alert(
            "Monthly budget updated!"
        );

    }
);


// =====================================================
// GET THIS MONTH'S EXPENSE
// =====================================================

function getCurrentMonthExpenses() {

    const today =
        new Date();

    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();


    let total = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type !== "expense") {

            return;

        }


        const transactionDate =
            new Date(transaction.date);


        if (
            transactionDate.getMonth() ===
            currentMonth &&

            transactionDate.getFullYear() ===
            currentYear
        ) {

            total += Number(
                transaction.amount
            );

        }

    });


    return total;

}


// =====================================================
// UPDATE BUDGET DISPLAY
// =====================================================

function updateBudgetDisplay() {

    const spent =
        getCurrentMonthExpenses();


    const remaining =
        monthlyBudget - spent;


    budgetAmountElement.textContent =
        formatCurrency(monthlyBudget);

    spentAmountElement.textContent =
        formatCurrency(spent);

    remainingAmountElement.textContent =
        formatCurrency(remaining);


    // ---------------------------------------------
    // PROGRESS
    // ---------------------------------------------

    let percentage = 0;


    if (monthlyBudget > 0) {

        percentage =
            (spent / monthlyBudget) * 100;

    }


    // Maximum 100% visually

    const visualPercentage =
        Math.min(percentage, 100);


    budgetProgress.style.width =
        `${visualPercentage}%`;


    // ---------------------------------------------
    // MESSAGE
    // ---------------------------------------------

    if (monthlyBudget === 0) {

        budgetMessage.textContent =
            "Set a monthly budget to start tracking.";

    }

    else if (spent > monthlyBudget) {

        budgetMessage.textContent =
            `Budget exceeded by ${formatCurrency(
                Math.abs(remaining)
            )}`;

    }

    else {

        budgetMessage.textContent =
            `${percentage.toFixed(1)}% of your budget used`;

    }

}


// =====================================================
// SPENDING OVERVIEW
// =====================================================

function updateSpendingOverview() {

    const categories = {

        Food: 0,

        Transport: 0,

        Shopping: 0,

        Other: 0

    };


    transactions.forEach(function (transaction) {

        if (
            transaction.type === "expense" &&
            categories.hasOwnProperty(
                transaction.category
            )
        ) {

            categories[transaction.category] +=
                Number(transaction.amount);

        }

    });


    const totalExpense =
        calculateTotals().totalExpense;


    // ---------------------------------------------
    // FOOD
    // ---------------------------------------------

    foodValue.textContent =
        formatCurrency(categories.Food);


    foodBar.style.width =
        getPercentage(
            categories.Food,
            totalExpense
        ) + "%";


    // ---------------------------------------------
    // TRANSPORT
    // ---------------------------------------------

    transportValue.textContent =
        formatCurrency(categories.Transport);


    transportBar.style.width =
        getPercentage(
            categories.Transport,
            totalExpense
        ) + "%";


    // ---------------------------------------------
    // SHOPPING
    // ---------------------------------------------

    shoppingValue.textContent =
        formatCurrency(categories.Shopping);


    shoppingBar.style.width =
        getPercentage(
            categories.Shopping,
            totalExpense
        ) + "%";


    // ---------------------------------------------
    // OTHER
    // ---------------------------------------------

    const otherAmount =
        categories.Other;


    // Include remaining expense categories
    // inside Other

    transactions.forEach(function (transaction) {

        if (
            transaction.type === "expense" &&
            ![
                "Food",
                "Transport",
                "Shopping"
            ].includes(transaction.category)
        ) {

            // Avoid adding Other twice

            if (transaction.category !== "Other") {

                categories.Other +=
                    Number(transaction.amount);

            }

        }

    });


    otherValue.textContent =
        formatCurrency(categories.Other);


    otherBar.style.width =
        getPercentage(
            categories.Other,
            totalExpense
        ) + "%";

}


// =====================================================
// CALCULATE PERCENTAGE
// =====================================================

function getPercentage(value, total) {

    if (total === 0) {

        return 0;

    }


    return Math.min(
        (value / total) * 100,
        100
    );

}


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    function () {

        displayTransactions();

    }
);


// =====================================================
// FILTER
// =====================================================

filterCategory.addEventListener(
    "change",
    function () {

        displayTransactions();

    }
);


// =====================================================
// CLEAR ALL
// =====================================================

clearAllBtn.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            alert(
                "There are no transactions to clear."
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmed) {

            return;

        }


        transactions = [];


        saveTransactions();


        displayTransactions();

        updateDashboard();

        updateBudgetDisplay();


        alert(
            "All transactions have been cleared."
        );

    }
);


// =====================================================
// FORMAT CURRENCY
// =====================================================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    ).format(amount);

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}