const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 13;
const SQ = 30;
const COLOR = "WHITE";
let score = 0;

//Vẽ ô vuông:
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

//Mảng 2 chiều và màu của mảng
let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = COLOR;
    }
}

console.log(board)

function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]); //số hàng,số cột và màu
        }
    }
}

drawBoard();

// Tạo hình khối
class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0 // chỉ số góc quay đầu tiên
        this.activeTetromino = this.tetromino[this.tetrominoN];

        this.x = 5;
        this.y = -2;
    }

    fill(color) {
        for (let r = 0; r < this.activeTetromino.length; r++) { //duyệt qua hàng
            for (let c = 0; c < this.activeTetromino.length; c++) { // duyệt qua cột
                if (this.activeTetromino[r][c]) { //trường hợp nếu dữ liệu có giá trị
                    drawSquare(this.x + c, this.y + r, color); // gọi function và truyền dữ liệu
                }
            }
        }
    }

    draw() {
        this.fill(this.color)
    }

    undraw() {
        this.fill(COLOR)
    }

// Hàm di chuyển:
    moveDown() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.undraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            p = randomPiece();
        }
    };

    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) { // Hàm kiểm tra có đc di chuyển hay k
            this.undraw();
            this.x--;
            this.draw();
        }
    };

    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.undraw();
            this.x++;
            this.draw();
        }
    }

    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue
                }
                if (this.y + r < 0) { //Kết thúc
                    alert("Bái bai");
                    gameOver = true;
                    break;
                }

                board[this.y + r][this.x + c] = this.color;
            }
        }
        for (let r = 0; r < ROW; r++) { //Thuật toán tính ăn điểm
            let isFull = true;
            for (let c = 0; c < COL; c++) {
                isFull = isFull && (board[r][c] !== COLOR)
            }
            if (isFull) { // Cập nhật lại vị trí của các ô
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                for (let c = 0; c < COL; c++) {  //Tạo lại 1 hàng trắng trên đầu cột
                    board[0][c] = COLOR;
                }
                score += 10;
            }
        }
        drawBoard();
        document.querySelector('#score').innerText = score;
    }

    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let move = 0;
        if (this.collision(0, 0, nextPattern)) { // Trường hợp va chạm
            if (this.x > COL / 2) {
                move = -1;
            } else {
                move = 1
            }
        }
        if (!this.collision(0, 0, nextPattern)) { //Trường hợp k va chạm
            this.undraw();
            this.x += move;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }

// Hàm kiểm tra va chạm 2 cạnh trái phải
    collision(x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                if (!piece[r][c]) {
                    continue;
                }
// Cập nhật lại tọa độ mới
                let newX = this.x + c + x;
                let newY = this.y + r + y;
//Kiểm tra va chạm
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }

                if (newY < 0) {
                    continue;
                }
                if (board [newY] [newX] !== COLOR) {
                    return true;
                }
            }
        }
        return false;
    }
}

const PIECES = [
    [Z, "#EE0000"],
    [S, "#00BFFF"],
    [T, "#FF9933"],
    [O, "#0000FF"],
    [L, "#00FF00"],
    [I, "#FFC1C1"],
    [J, "#FFFF00"],
    [U, "#FF69B4"]
];

// Random hình đầu khi chạy game lấy từ PIECES

function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]); //random chỉ số có tetromino và màu
}

let p = randomPiece();
console.log(p);

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37) {
        p.moveLeft();
    } else if (e.keyCode === 39) {
        p.moveRight();
    } else if (e.keyCode === 40) {
        p.moveDown();
    } else if (e.keyCode === 38) {
        p.rotate();
    }
})
let gameOver = false;
let interval;

function drop() {
    console.log(1)
    interval = setInterval(function () {
        if (!gameOver) {
            p.moveDown()
        } else {
            clearInterval(interval)
        }
    }, 1000)
}
let d = 1;
function login3(){
    let login1 = document.getElementById("Login").value;
    let pass1 = document.getElementById("Pass").value;
    if (login1 === 'admin' && pass1 === 'admin'){
        alert('dang nhap thanh cong')
        drop();

    }
    else {
        alert('tai khoan sai' );
    }
}


