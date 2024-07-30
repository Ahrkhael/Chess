// At the beginning, we must create the board
const board = document.getElementById("board")
let square = null
for(let i=0; i<8; i++) {

    const row = document.createElement("div")
    row.classList.add("row")
    board.appendChild(row)

    for (let j=0; j<8; j++) {

        square = document.createElement("div")
        square.classList.add("square")

        if ((i+j)%2===0) {
            square.style.backgroundColor="#FFF8DC"
        }else {
            square.style.backgroundColor="#DEB887"
        }

        row.appendChild(square)
        square.dataset.row = 8-i //The first row will be the bottom one
        square.dataset.column = j+1

        if(j===7) {
            const br = document.createElement("br")
            row.appendChild(br)
        }
    }
}

// Create a class for every chess piece
class King {
    constructor(player) {
        this.player = player
        this.hasMoved = false

        if(player==="White") {
            this.figure="\u{2654}"
        }else if(player==="Black") {
            this.figure="\u{265A}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
    isLegalMove(square, squareOrigin) {
        if(square === squareOrigin || squareHasOwnPiece(square, this.player)) {
            return false
        }

        const diffX = Number(square.dataset.column) - Number(squareOrigin.dataset.column)
        const diffY = Number(square.dataset.row) - Number(squareOrigin.dataset.row)

        // Movimientos horizontales, verticales y diagonales de un cuadro
        if(Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {
            return true
        }
        
        return false
    }
}

// Function for checking if the king can castle or not
function canCastle(king, tower) {
    if (king.hasMoved || tower.hasMoved) {
        return false
    }

    const opponentColor = getOpponentColor(king.player)
    const enemyPossibleMoves = getAllPossibleMoves(opponentColor)

    if (isCheck(king.player)) {
        return false
    }

    const squaresBetween = getSquaresBetween(king, tower)

    if(squaresBetween.length === 2) {
        for (let square of squaresBetween) {
            if (square.querySelector('.pieces') || enemyPossibleMoves.some(move => move.to === square)) {
                return false
            }
        }
    }else {
        for (let square of squaresBetween) {
            if (square.querySelector('.pieces')) {
                return false
            }
        }
        if( enemyPossibleMoves.some(move => move.to === squaresBetween[1]) || enemyPossibleMoves.some(move => move.to === squaresBetween[2]) ) {
            return false
        }
    }

    return true
}

function getSquaresBetween(king, tower) {
    const squares = []

    if(king.player === "White") {
        if(tower === whiteTower1) {
            for (let i = 57; i <= 59; i++) {
                squares.push(document.getElementsByClassName('square')[i])
            }
        }else {
            for (let i = 61; i <= 62; i++) {
                squares.push(document.getElementsByClassName('square')[i])
            }
        }
    }else {
        if(tower === blackTower1) {
            for (let i = 1; i <= 3; i++) {
                squares.push(document.getElementsByClassName('square')[i])
            }
        }else {
            for (let i = 5; i <= 6; i++) {
                squares.push(document.getElementsByClassName('square')[i])
            }
        }
    }

    return squares
}

class Queen {
    constructor(player) {
        this.player = player

        if(player==="White") {
            this.figure="\u{2655}"
        }else if(player==="Black") {
            this.figure="\u{265B}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
    isLegalMove(square, squareOrigin) {
        if(square !== squareOrigin && !squareHasOwnPiece(square, this.player)) {
            let squareOriginNumber = Number(squareOrigin.dataset.column) - 1 + 8*(8 - Number(squareOrigin.dataset.row))
            // Check if it's moving verically or horizontally
            if(square.dataset.row === squareOrigin.dataset.row) {
                let diffX = Number(square.dataset.column) - Number(squareOrigin.dataset.column)
                if(diffX < 0) {
                    for(let i=1; i<Math.abs(diffX); i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX > 0) {
                    for(let i=1; i<diffX; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }
                return true
            }else if(square.dataset.column === squareOrigin.dataset.column) {
                let diffY = Number(squareOrigin.dataset.row) - Number(square.dataset.row)
                if(diffY < 0) {
                    for(let i=1; i<Math.abs(diffY); i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - 8 * i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffY > 0) {
                    for(let i=1; i<diffY; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + 8 * i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }
                return true
            }
            // Check if it's moving in diagonal
            let diffX = Number(square.dataset.column) - Number(squareOrigin.dataset.column)
            let diffY = Number(squareOrigin.dataset.row) - Number(square.dataset.row)
            if(Math.abs(diffX) === Math.abs(diffY)) {
                if(diffX < 0 && diffY < 0) {
                    for(let i=1; i<Math.abs(diffX); i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - 9*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX > 0 && diffY < 0) {
                    for(let i=1; i<diffX; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - 7*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX < 0 && diffY > 0) {
                    for(let i=1; i<diffY; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + 7*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX > 0 && diffY > 0) {
                    for(let i=1; i<diffX; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + 9*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }
                return true
            }
        }
    }
}

class Pawn {
    constructor(player) {
        this.player = player

        if(player==="White") {
            this.figure="\u{2659}"
        }else if(player==="Black") {
            this.figure="\u{265F}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
    isLegalMove(square, squareOrigin) {
        if(square !== squareOrigin && !squareHasOwnPiece(square, this.player)) {
            if(squareOrigin.dataset.column === square.dataset.column) {
                if(this.player === "White") {
                    if(!square.querySelector('.pieces')) {
                        if(square.dataset.row == Number(squareOrigin.dataset.row) + 1) {
                            return true
                        }else if (squareOrigin.dataset.row == 2 && square.dataset.row == 4) {
                            if(!document.getElementsByClassName('square')[Number(square.dataset.column)+39].querySelector('.pieces')) {
                                return true
                            }
                        }
                    }
                }else if(this.player === "Black") {
                    if(!square.querySelector('.pieces')) {
                        if(square.dataset.row == Number(squareOrigin.dataset.row) - 1) {
                            return true
                        }else if (squareOrigin.dataset.row == 7 && square.dataset.row == 5) {
                            if(!document.getElementsByClassName('square')[Number(square.dataset.column)+15].querySelector('.pieces')) {
                                return true
                            }
                        }
                    }
                }
            }else if(squareOrigin.dataset.column == Number(square.dataset.column) + 1 || squareOrigin.dataset.column == Number(square.dataset.column) - 1) {
                if(square.querySelector('.pieces')) {
                    if(this.player === "White") {
                        if(square.querySelector('.pieces').dataset.player === "Black" && square.dataset.row == Number(squareOrigin.dataset.row) + 1) {
                            return true
                        }
                    }else if(this.player === "Black") {
                        if(square.querySelector('.pieces').dataset.player === "White" && square.dataset.row == Number(squareOrigin.dataset.row) - 1) {
                            return true
                        }
                    }
                }
            }
        }
    }
}

class Knight {
    constructor(player) {
        this.player = player

        if(player==="White") {
            this.figure="\u{2658}"
        }else if(player==="Black") {
            this.figure="\u{265E}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
    isLegalMove(square, squareOrigin) {
        if(square !== squareOrigin && !squareHasOwnPiece(square, this.player)) {
            if(square.dataset.row == Number(squareOrigin.dataset.row) + 2 && square.dataset.column == Number(squareOrigin.dataset.column) - 1) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) + 2 && square.dataset.column == Number(squareOrigin.dataset.column) + 1) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) + 1 && square.dataset.column == Number(squareOrigin.dataset.column) - 2) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) + 1 && square.dataset.column == Number(squareOrigin.dataset.column) + 2) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) - 2 && square.dataset.column == Number(squareOrigin.dataset.column) - 1) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) - 2 && square.dataset.column == Number(squareOrigin.dataset.column) + 1) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) - 1 && square.dataset.column == Number(squareOrigin.dataset.column) - 2) {
                return true
            }else if(square.dataset.row == Number(squareOrigin.dataset.row) - 1 && square.dataset.column == Number(squareOrigin.dataset.column) + 2) {
                return true
            }
        }
    }
}

class Bishop {
    constructor(player) {
        this.player = player

        if(player==="White") {
            this.figure="\u{2657}"
        }else if(player==="Black") {
            this.figure="\u{265D}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
    isLegalMove(square, squareOrigin) {
        if(square !== squareOrigin && !squareHasOwnPiece(square, this.player)) {
            let diffX = Number(square.dataset.column) - Number(squareOrigin.dataset.column)
            let diffY = Number(squareOrigin.dataset.row) - Number(square.dataset.row)
            let squareOriginNumber = Number(squareOrigin.dataset.column) - 1 + 8*(8 - Number(squareOrigin.dataset.row))
            if(Math.abs(diffX) === Math.abs(diffY)) {
                if(diffX < 0 && diffY < 0) {
                    for(let i=1; i<Math.abs(diffX); i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - 9*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX > 0 && diffY < 0) {
                    for(let i=1; i<diffX; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - 7*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX < 0 && diffY > 0) {
                    for(let i=1; i<diffY; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + 7*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX > 0 && diffY > 0) {
                    for(let i=1; i<diffX; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + 9*i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }
                return true
            }
        }
    }
}

class Tower {
    constructor(player) {
        this.player = player
        this.hasMoved = false

        if(player==="White") {
            this.figure="\u{2656}"
        }else if(player==="Black") {
            this.figure="\u{265C}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
    isLegalMove(square, squareOrigin) {
        if(square !== squareOrigin && !squareHasOwnPiece(square, this.player)) {
            let squareOriginNumber = Number(squareOrigin.dataset.column) - 1 + 8*(8 - Number(squareOrigin.dataset.row))
            if(square.dataset.row === squareOrigin.dataset.row) {
                let diffX = Number(square.dataset.column) - Number(squareOrigin.dataset.column)
                if(diffX < 0) {
                    for(let i=1; i<Math.abs(diffX); i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffX > 0) {
                    for(let i=1; i<diffX; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }
                return true
            }else if(square.dataset.column === squareOrigin.dataset.column) {
                let diffY = Number(squareOrigin.dataset.row) - Number(square.dataset.row)
                if(diffY < 0) {
                    for(let i=1; i<Math.abs(diffY); i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber - 8 * i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }else if(diffY > 0) {
                    for(let i=1; i<diffY; i++) {
                        if(document.getElementsByClassName('square')[squareOriginNumber + 8 * i].querySelector('.pieces')) {
                            return false
                        }
                    }
                }
                return true
            }
        }
    }
}

const whitePawn = new Pawn("White")
const blackPawn = new Pawn("Black")

const whiteKing = new King("White")
const blackKing = new King("Black")

const whiteQueen = new Queen("White")
const blackQueen = new Queen("Black")

const whiteKnight = new Knight("White")
const blackKnight = new Knight("Black")

const whiteBishop = new Bishop("White")
const blackBishop = new Bishop("Black")

const whiteTower1 = new Tower("White")
const whiteTower2 = new Tower("White")
const blackTower1 = new Tower("Black")
const blackTower2 = new Tower("Black")

let squareWhiteKing = null
let squareBlackKing = null

// Function to fill the initial board
const fillInitialBoard = () => {

    for (let i=0; i<8; i++) {
        
        square = document.getElementsByClassName("square")[i+8]
        let piece = document.createElement("p")
        square.appendChild(piece)

        piece.classList.add("pieces")

        piece.innerHTML = blackPawn.figure
        piece.dataset.player = "Black"
        piece.dataset.chessPiece = "pawn"

        square = document.getElementsByClassName("square")[i+48]
        piece = document.createElement("p")
        square.appendChild(piece)

        piece.classList.add("pieces")

        piece.innerHTML = whitePawn.figure
        piece.dataset.player = "White"
        piece.dataset.chessPiece = "pawn"
        
        switch (i) {
            case 4:
    
                square = document.getElementsByClassName("square")[60]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKing.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "king"

                squareWhiteKing = square
    
                square = document.getElementsByClassName("square")[4]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKing.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "king"

                squareBlackKing = square

                break
            
            case 3:
                
                square = document.getElementsByClassName("square")[59]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteQueen.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "queen"
                
                square = document.getElementsByClassName("square")[3]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackQueen.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "queen"

                break    
            
            case 2 || 5:

                square = document.getElementsByClassName("square")[58]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteBishop.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "bishop"

                square = document.getElementsByClassName("square")[61]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteBishop.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "bishop"

                square = document.getElementsByClassName("square")[2]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackBishop.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "bishop"

                square = document.getElementsByClassName("square")[5]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackBishop.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "bishop"

                break

            case 1 || 6:
                
                square = document.getElementsByClassName("square")[57]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKnight.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "knight"

                square = document.getElementsByClassName("square")[62]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKnight.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "knight"

                square = document.getElementsByClassName("square")[1]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKnight.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "knight"

                square = document.getElementsByClassName("square")[6]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKnight.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "knight"

                break  
            
            case 0 || 7:
            
                square = document.getElementsByClassName("square")[56]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteTower1.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "tower1"
                
                square = document.getElementsByClassName("square")[63]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteTower2.figure
                piece.dataset.player = "White"
                piece.dataset.chessPiece = "tower2"

                square = document.getElementsByClassName("square")[0]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackTower1.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "tower1"
                
                square = document.getElementsByClassName("square")[7]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackTower2.figure
                piece.dataset.player = "Black"
                piece.dataset.chessPiece = "tower2"

                break
        }
    }
}

fillInitialBoard()

let playerActive = "White"

function changeTurn() {
    if(playerActive === "White") {
        playerActive = "Black"
    }else if(playerActive === "Black") {
        playerActive = "White"
    }
}

// Function for getting the king's position
function getKingPosition(color) {
    let squareKing
    if(color === "White") {
        squareKing = squareWhiteKing
    }else {
        squareKing = squareBlackKing
    }
    return squareKing
}

// Function for getting the tower's position
function getTowerInitialPosition(tower) {
    let squareStartTower
    if(tower === blackTower1) {
        squareStartTower = document.getElementsByClassName('square')[0]
    }else if(tower === blackTower2) {
        squareStartTower = document.getElementsByClassName('square')[7]
    }else if(tower === whiteTower1) {
        squareStartTower = document.getElementsByClassName('square')[56]
    }else if(tower === whiteTower2) {
        squareStartTower = document.getElementsByClassName('square')[63]
    }
    return squareStartTower
}

function squareHasOwnPiece(square, player) {
    if(square.querySelector('.pieces')) {
        if(square.querySelector('.pieces').dataset.player === player) {
            return true
        }else {
            return false
        }
    }else {
        return false
    }
}

function getOpponentColor(color) {
    if(color === "White") {
        return "Black"
    }else {
        return "White"
    }
}

// Function for getting the chess piece of the square
const getChessPiece = (square) => {
    switch (square.querySelector('.pieces').dataset.chessPiece) {
        case "pawn":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whitePawn
            }else {
                return blackPawn
            }
        case "king":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteKing
            }else {
                return blackKing
            }
        case "queen":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteQueen
            }else {
                return blackQueen
            }
        case "knight":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteKnight
            }else {
                return blackKnight
            }
        case "bishop":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteBishop
            }else {
                return blackBishop
            }
        case "tower1":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteTower1
            }else {
                return blackTower1
            }
        case "tower2":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteTower2
            }else {
                return blackTower2
            }
    }
}

let pieceSelected = null
let squareOrigin = null

let gameFinished = false
let winner = null

function handleSquareClick(event) {
    if (gameFinished) {
        return
    }

    let square = event.target;
    if(!square.classList.contains('square')) {
        square = square.parentElement
    }

    if (pieceSelected) {
        movePiece(square)
    } else if (squareHasOwnPiece(square, playerActive)) {
        selectPiece(square)
    }

    if (isCheck(playerActive)) {
        if (isCheckMate(playerActive)) {
            gameFinished = true
            winner = getOpponentColor(playerActive)
            removeEventListeners()
            showModal()
            return
        }
    }
}

function showModal() {
    const modal = document.getElementById("myModal")
    const span = document.getElementsByClassName("close")[0]
    const modalContent = document.getElementsByClassName("modal-content")[0]
    const textToShow = document.createElement("p")
    modalContent.appendChild(textToShow)

    textToShow.innerHTML = "The game is over."

    if(winner) {
        textToShow.innerHTML += `</br>${winner} has won.`
    }else {
        textToShow.innerHTML += "It's a draw."
    }

    modal.style.display = "block"

    span.onclick = function() {
        modal.style.display = "none"
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none"
        }
    }
}

// Remove event listeners from all squares
function removeEventListeners() {
    document.querySelectorAll('.square').forEach((square) => {
        square.removeEventListener('click', handleSquareClick)
    })
}

// Add event listeners to all squares
document.querySelectorAll('.square').forEach((square) => {
    square.addEventListener('click', handleSquareClick)
})

function selectPiece(square) {
    pieceSelected = square.querySelector('.pieces')
    squareOrigin = square
    square.dataset.originalColor = square.style.backgroundColor; // Save the original color
    square.style.backgroundColor = 'yellow'
}

function movePiece(square) {
    if(getChessPiece(squareOrigin).isLegalMove(square, squareOrigin)) {
        if(!square.querySelector('.pieces')) {
            square.appendChild(pieceSelected)
            if(getChessPiece(square) === whiteKing) {
                squareWhiteKing = square
            }else if(getChessPiece(square) === blackKing) {
                squareBlackKing = square
            }
            if(!isCheck(playerActive)) {
                if(getChessPiece(square) === whiteKing) {
                    whiteKing.hasMoved = true
                }else if(getChessPiece(square) === blackKing) {
                    blackKing.hasMoved = true
                }else if(getChessPiece(square) === whiteTower1) {
                    whiteTower1.hasMoved = true
                }else if(getChessPiece(square) === whiteTower2) {
                    whiteTower2.hasMoved = true
                }else if(getChessPiece(square) === blackTower1) {
                    blackTower1.hasMoved = true
                }else if(getChessPiece(square) === blackTower2) {
                    blackTower2.hasMoved = true
                }
                changeTurn()
            }else {
                squareOrigin.appendChild(pieceSelected)
                if(getChessPiece(squareOrigin) === whiteKing) {
                    squareWhiteKing = squareOrigin
                }else if(getChessPiece(squareOrigin) === blackKing) {
                    squareBlackKing = squareOrigin
                }
            }
        }else if (square.querySelector('.pieces').dataset.player !== pieceSelected.dataset.player) {
            const enemyPiece = square.querySelector('.pieces')
            square.querySelector('.pieces').remove()
            square.appendChild(pieceSelected)
            if(getChessPiece(square) === whiteKing) {
                squareWhiteKing = square
            }else if(getChessPiece(square) === blackKing) {
                squareBlackKing = square
            }
            if(!isCheck(playerActive)) {
                if(getChessPiece(square) === whiteKing) {
                    whiteKing.hasMoved = true
                }else if(getChessPiece(square) === blackKing) {
                    blackKing.hasMoved = true
                }else if(getChessPiece(square) === whiteTower1) {
                    whiteTower1.hasMoved = true
                }else if(getChessPiece(square) === whiteTower2) {
                    whiteTower2.hasMoved = true
                }else if(getChessPiece(square) === blackTower1) {
                    blackTower1.hasMoved = true
                }else if(getChessPiece(square) === blackTower2) {
                    blackTower2.hasMoved = true
                }
                changeTurn()
            }else {
                squareOrigin.appendChild(pieceSelected)
                square.appendChild(enemyPiece)
                if(getChessPiece(squareOrigin) === whiteKing) {
                    squareWhiteKing = squareOrigin
                }else if(getChessPiece(squareOrigin) === blackKing) {
                    squareBlackKing = squareOrigin
                }
            }
        }
    }else if(getChessPiece(squareOrigin) === whiteKing && square === document.getElementsByClassName('square')[62]) {
        if(canCastle(whiteKing, whiteTower2)) {
            squareWhiteKing = square
            whiteKing.hasMoved = true
            square.appendChild(pieceSelected)
            document.getElementsByClassName('square')[61].appendChild(getTowerInitialPosition(whiteTower2).querySelector('.pieces'))
            changeTurn()
        }
    }else if(getChessPiece(squareOrigin) === whiteKing && square === document.getElementsByClassName('square')[58]) {
        if(canCastle(whiteKing, whiteTower1)) {
            squareWhiteKing = square
            whiteKing.hasMoved = true
            square.appendChild(pieceSelected)
            document.getElementsByClassName('square')[59].appendChild(getTowerInitialPosition(whiteTower1).querySelector('.pieces'))
            changeTurn()
        }
    }else if(getChessPiece(squareOrigin) === blackKing && square === document.getElementsByClassName('square')[6]) {
        if(canCastle(blackKing, blackTower2)) {
            squareBlackKing = square
            blackKing.hasMoved = true
            square.appendChild(pieceSelected)
            document.getElementsByClassName('square')[5].appendChild(getTowerInitialPosition(blackTower2).querySelector('.pieces'))
            changeTurn()
        }
    }else if(getChessPiece(squareOrigin) === blackKing && square === document.getElementsByClassName('square')[2]) {
        if(canCastle(blackKing, blackTower1)) {
            squareBlackKing = square
            blackKing.hasMoved = true
            square.appendChild(pieceSelected)
            document.getElementsByClassName('square')[3].appendChild(getTowerInitialPosition(blackTower1).querySelector('.pieces'))
            changeTurn()
        }
    }
    squareOrigin.style.backgroundColor = squareOrigin.dataset.originalColor; // Restore the original color
    pieceSelected = null
    squareOrigin = null
}

// Function to get all squares that have a player piece
function getSquares(color) {
    const squares = []
    document.querySelectorAll('.square').forEach((square) => {
        if(squareHasOwnPiece(square, color)) {
            squares.push(square)
        }
    })
    return squares
}

// Function to get all moves that are possible for a player
function getAllPossibleMoves(color) {
    const squares = getSquares(color);
    let moves = [];

    for (let squarePiece of squares) {
        const piece = getChessPiece(squarePiece);
        document.querySelectorAll('.square').forEach((square) => {
            if (piece.isLegalMove(square, squarePiece)) {
                moves.push({ piece, from: squarePiece, to: square });
            }
        });
    }

    return moves;
}


//function for knowing if the color player it's on check or not
function isCheck(color) {
    const enemyPossibleMoves = getAllPossibleMoves(getOpponentColor(color))
    const squareKing = getKingPosition(color)
    if(enemyPossibleMoves.some(move => move.to === squareKing)) {
        return true
    }
}

// Function for knowing if it's check mate or not
function isCheckMate(color) {
    const pieceImaginary = document.createElement("p")
    pieceImaginary.classList.add("pieces")
    const possibleMoves = getAllPossibleMoves(color)

    for(let move of possibleMoves) {
        const { piece, from, to } = move

        if(to.querySelector('.pieces')) {
            const enemyPiece = to.querySelector('.pieces')
            to.querySelector('.pieces').remove()
            to.appendChild(pieceImaginary)
            if(piece instanceof King) {
                if(piece.player === "White") {
                    squareWhiteKing = to
                }else {
                    squareBlackKing = to
                }
            }
            if(!isCheck(color)) {
                to.querySelector('.pieces').remove()
                to.appendChild(enemyPiece)
                return false
            }else {
                to.querySelector('.pieces').remove()
                to.appendChild(enemyPiece)
            }
            if(piece instanceof King) {
                if(piece.player === "White") {
                    squareWhiteKing = from
                }else {
                    squareBlackKing = from
                }
            }
        }else {
            to.appendChild(pieceImaginary)
            if(piece instanceof King) {
                if(piece.player === "White") {
                    squareWhiteKing = to
                }else {
                    squareBlackKing = to
                }
            }
            if(!isCheck(color)) {
                to.querySelector('.pieces').remove()
                return false
            }else {
                to.querySelector('.pieces').remove()
            }
            if(piece instanceof King) {
                if(piece.player === "White") {
                    squareWhiteKing = from
                }else {
                    squareBlackKing = from
                }
            }
        }
    }

    return true
}