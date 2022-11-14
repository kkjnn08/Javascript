const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score');

const ROW = 20;
const COL = 10;
const SQ = 25;
const VACANT = "black";


// 한개의 칸 채우기
function drawSquare(x, y, color) {             //좌표,색상
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);             //좌표,너비,높이

    ctx.strokeStyle = "black";
    ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}

// 보드판 형성
let board = [];
for(r = 0; r < ROW; r++) {
    board[r] = [];
    for(c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}


// 보드판 그리기
function drawBoard() {
    for(r = 0; r < ROW; r++) {
        for(c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();


// Pieces
const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

// generate random
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();


// Object Piece

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

// fill function
Piece.prototype.fill = function(color){
    for(r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}


// draw piece
Piece.prototype.draw = function() {
    this.fill(this.color);
}


// undraw
Piece.prototype.unDraw = function() {
    this.fill(VACANT);
}


// move down
Piece.prototype.moveDown = function() {
    if(!this.collision(0, 1, this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        this.lock();
        p = randomPiece();
    }
}

// move right
Piece.prototype.moveRight = function() {
    if(!this.collision(1, 0, this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move left
Piece.prototype.moveLeft = function() {
    if(!this.collision(-1, 0, this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate
Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;

    if(this.collision(0, 0, nextPattern)){
        if(this.x > COL/2){
            kick = -1;
        }else{
            kick = 1;
        }
    }
    if(!this.collision(kick, 0, nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function() {
    for(r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if(!this.activeTetromino[r][c]){
                continue;
            }
            if(this.y + r < 0){
                alert("Game Over");
                gameOver = true;
                break;
            }
            board[this.y+r][this.x+c] = this.color;
        }
    }
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for(c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            for(y = r; y > 1; y--){
                for(c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            for(c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            score += 10;
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;
}

// collision
Piece.prototype.collision = function(x, y, piece){
    for(r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // 비어있다면 충돌x
            if(!piece[r][c]){
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            if(newY < 0){
                continue;
            }
            if(board[newY][newX] != VACANT){
                return true;
            }
            
        }
    }return false;
}

// control
document.addEventListener("keydown", CONTROL);
function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
    }else if(event.keyCode == 38) {
        p.rotate();
    }else if(event.keyCode == 39) {
        p.moveRight();
    }else if(event.keyCode == 40) {
        p.moveDown();
    }
}

// drop the piece every 1sc
let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    
    let delta = now - dropStart;
    if(delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    else if(score >= 10 && delta > 500){
        p.moveDown();
        dropStart = Date.now()
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
    
console.log(now);
}

drop();