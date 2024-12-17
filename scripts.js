// 초기 설정
let money = 1000000; // 시작 금액 100만 원
const stocks = [
    { name: "주식 A", price: 1000, owned: 0, history: [] },
    { name: "주식 B", price: 1500, owned: 0, history: [] },
    { name: "주식 C", price: 2000, owned: 0, history: [] },
];
const maxHistory = 50; // 그래프에 표시될 최대 데이터 수

// DOM 요소
const moneyDisplay = document.getElementById("money");
const stocksContainer = document.getElementById("stocks");
const canvas = document.getElementById("stockChart");
const ctx = canvas.getContext("2d");

// 주식 표시
function renderStocks() {
    stocksContainer.innerHTML = "";
    stocks.forEach((stock, index) => {
        const stockDiv = document.createElement("div");
        stockDiv.className = "stock";
        stockDiv.innerHTML = `
            <h3>${stock.name}</h3>
            <p>가격: <strong>${stock.price}</strong> 원</p>
            <p>보유 주식: <strong>${stock.owned}</strong> 주</p>
            <input type="number" id="quantity${index}" min="1" placeholder="수량 입력">
            <button onclick="buyStock(${index})">구매</button>
            <button class="sell" onclick="sellStock(${index})">판매</button>
            <button onclick="buyAll(${index})">전부 구매</button>
            <button class="sell" onclick="sellAll(${index})">전부 판매</button>
        `;
        stocksContainer.appendChild(stockDiv);
    });
}

// 주식 가격 업데이트
function updateStockPrices() {
    stocks.forEach((stock) => {
        const randomEvent = Math.random();
        let change = (Math.random() - 0.5) * 200;

        if (randomEvent > 0.95) change = (Math.random() - 0.5) * 3000; // 급등/급락

        stock.price = Math.max(100, stock.price + Math.round(change));
        stock.history.push(stock.price);
        if (stock.history.length > maxHistory) stock.history.shift();
    });
    renderStocks();
    drawGraph();
}

// 그래프 그리기
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;

    stocks.forEach((stock, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = ["#00ff00", "#ff0000", "#0000ff"][idx];
        const prices = stock.history;
        const maxPrice = Math.max(...prices, 1);
        const minPrice = Math.min(...prices, 0);

        prices.forEach((price, i) => {
            const x = (canvas.width / maxHistory) * i;
            const y = canvas.height - ((price - minPrice) / (maxPrice - minPrice)) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    });
}

// 거래 기능
function buyStock(index) {
    const quantity = parseInt(document.getElementById(`quantity${index}`).value);
    if (isNaN(quantity) || quantity <= 0) return alert("올바른 수량을 입력하세요.");
    const cost = stocks[index].price * quantity;

    if (money >= cost) {
        money -= cost;
        stocks[index].owned += quantity;
        updateDisplays();
    } else {
        alert("돈이 부족합니다.");
    }
}

function sellStock(index) {
    const quantity = parseInt(document.getElementById(`quantity${index}`).value);
    if (isNaN(quantity) || quantity <= 0) return alert("올바른 수량을 입력하세요.");

    if (stocks[index].owned >= quantity) {
        money += stocks[index].price * quantity;
        stocks[index].owned -= quantity;
        updateDisplays();
    } else {
        alert("보유 주식이 부족합니다.");
    }
}

function buyAll(index) {
    const maxBuyable = Math.floor(money / stocks[index].price);
    if (maxBuyable > 0) {
        money -= stocks[index].price * maxBuyable;
        stocks[index].owned += maxBuyable;
        updateDisplays();
    }
}

function sellAll(index) {
    if (stocks[index].owned > 0) {
        money += stocks[index].price * stocks[index].owned;
        stocks[index].owned = 0;
        updateDisplays();
    }
}

// 화면 업데이트
function updateDisplays() {
    moneyDisplay.textContent = money.toLocaleString();
    renderStocks();
}

// 10초마다 주식 가격 업데이트
setInterval(() => {
    updateStockPrices();
}, 1000);

// 초기 실행
updateDisplays();
