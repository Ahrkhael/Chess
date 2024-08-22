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
            square.classList.add("white-square")
        }else {
            square.classList.add("black-square")
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
const whiteTower3 = new Tower("White")
const blackTower1 = new Tower("Black")
const blackTower2 = new Tower("Black")
const blackTower3 = new Tower("Black")

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
    addSquaresEventListeners()

}

fillInitialBoard()

// Function to remove all pieces from the board
const cleanBoard = () => {

    for (let i=0; i<64; i++) {
        
        square = document.getElementsByClassName("square")[i]
        square.innerHTML = ""
        
    }
}

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

function translateColor(color) {
    if(color === "White") {
        return "Blancas"
    }else if(color === "Black") {
        return "Negras"
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
        case "tower3":
            if (square.querySelector('.pieces').dataset.player === "White") {
                return whiteTower3
            }else {
                return blackTower3
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
            winner = translateColor(getOpponentColor(playerActive))
            removeSquaresEventListeners()
            showModalGameEnded()
            return
        }
    }
}

// Function to start a new game
function newGame() {
    playerActive = "White"
    gameFinished = false
    winner = null

    cleanBoard()
    fillInitialBoard()

    document.getElementById("draw").hidden = false
    document.getElementById("surrender").hidden = false
}

// Function to show draw offering modal
function showModalDrawOffering() {

    const modal = document.getElementById("draw-offering-modal")
    const textToShow = document.getElementById("draw-confirm-message")
    textToShow.classList.add("text-modal")
    textToShow.innerHTML = `¿El jugador de ${translateColor(getOpponentColor(playerActive)).toLowerCase()} acepta las tablas?`

    modal.style.display = "block"

    confirmButton.addEventListener('click', () => {
        modal.style.display = "none"
        gameFinished = true
        removeSquaresEventListeners()
        showModalGameEnded()
        document.getElementById("draw").hidden = true
        document.getElementById("surrender").hidden = true
    })

    cancelButton.addEventListener('click', () => {
        modal.style.display = "none"
    })

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none"
        }
    }
}

// Function to let player active surrender
function surrender() {
    gameFinished = true
    winner = translateColor(getOpponentColor(playerActive))
    removeSquaresEventListeners()
    showModalGameEnded()
}

// Function to show modal when the game finishes
function showModalGameEnded() {
    const modal = document.getElementById("game-ended-modal")
    const span = document.getElementsByClassName("close")[0]
    const textToShow = document.getElementById("result-message")
    textToShow.classList.add("text-modal")

    textToShow.innerHTML = "La partida ha acabado."

    if(winner) {
        textToShow.innerHTML += `<br><br>${winner} ganan.`
    }else {
        textToShow.innerHTML += "<br><br>Se han firmado tablas."
    }

    document.getElementById("draw").hidden = true
    document.getElementById("surrender").hidden = true

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
function removeSquaresEventListeners() {
    document.querySelectorAll('.square').forEach((square) => {
        square.removeEventListener('click', handleSquareClick)
    })
}

// Add event listeners to all squares
function addSquaresEventListeners() {
    document.querySelectorAll('.square').forEach((square) => {
        square.addEventListener('click', handleSquareClick)
    })
}

function selectPiece(square) {
    pieceSelected = square.querySelector('.pieces')
    squareOrigin = square
    square.dataset.originalColor = square.style.backgroundColor
    square.style.backgroundColor = 'yellow'

    const possibleMovesPieceSelected = getAllPossibleMovesSquare(playerActive, square)
    highlightSquares(possibleMovesPieceSelected)
    
}

function movePiece(square) {
    removeHighlights()
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
                if(getChessPiece(square) === whitePawn && square.dataset.row == 8) {
                    showPromotionMenu(square, "White")
                }else if(getChessPiece(square) === blackPawn && square.dataset.row == 1) {
                    showPromotionMenu(square, "Black")
                }
                changeTurn()
            }else {
                squareOrigin.appendChild(pieceSelected)
                if(getChessPiece(squareOrigin) === whiteKing) {
                    squareWhiteKing = squareOrigin
                }else if(getChessPiece(squareOrigin) === blackKing) {
                    squareBlackKing = squareOrigin
                }
                showErrorEffect(getKingPosition(playerActive))
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
                if(getChessPiece(square) === whitePawn && square.dataset.row == 8) {
                    showPromotionMenu(square, "White")
                }else if(getChessPiece(square) === blackPawn && square.dataset.row == 1) {
                    showPromotionMenu(square, "Black")
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
                showErrorEffect(getKingPosition(playerActive))
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

function showPromotionMenu(square, color) {

    removeSquaresEventListeners()

    square.querySelector('.pieces').remove()

    const menu = document.createElement("div")
    if(color === "White") {
        menu.classList.add("promotion-menu-white")
    }else {
        menu.classList.add("promotion-menu-black")
    }

    square.appendChild(menu)
    const select = document.createElement("select")
    select.setAttribute("id", "promotion-select")
    menu.appendChild(select)

    const emptyOption = document.createElement("option")
    emptyOption.hidden = true
    emptyOption.selected = true
    select.appendChild(emptyOption)

    let options = [
        new Queen(color),
        new Knight(color),
        new Bishop(color),
        new Tower(color)
    ]

    if(menu.classList.contains("promotion-menu-black")) {
        options = options.reverse()
    }
    
    for (let i = 0; i < options.length; i++) {
        let option = document.createElement("option")
        option.value = i
        option.text = options[i].figure
        select.appendChild(option)
    }

    select.size = options.length

    select.addEventListener("input", () => {
        const selectedOption = options[select.value]
        promotePawn(square, selectedOption)
        addSquaresEventListeners()
    })
}

function promotePawn(square, value) {
    square.innerHTML = ''
    let piece = document.createElement("p")
    piece.classList.add('pieces')
    piece.innerHTML = value.figure
    piece.dataset.player = value.player

    if (value instanceof Queen) {
        piece.dataset.chessPiece = "queen";
    } else if (value instanceof Knight) {
        piece.dataset.chessPiece = "knight";
    } else if (value instanceof Bishop) {
        piece.dataset.chessPiece = "bishop";
    } else if (value instanceof Tower) {
        piece.dataset.chessPiece = "tower3";
    }

    square.appendChild(piece)
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
    const squares = getSquares(color)
    let moves = []

    for (let squarePiece of squares) {
        const piece = getChessPiece(squarePiece)
        document.querySelectorAll('.square').forEach((square) => {
            if (piece.isLegalMove(square, squarePiece)) {
                moves.push({ piece, from: squarePiece, to: square })
            }
        })
    }

    return moves
}

// Function to get all moves that are possible for a piece in a square
function getAllPossibleMovesSquare(color, square) {

    const squares = getAllPossibleMoves(color)
    
    let filteredMoves = squares.filter(move => move.from === square)

    if(getChessPiece(square) === whiteKing) {
        if(canCastle(whiteKing, whiteTower1)) {
            filteredMoves.push({ whiteKing, from: square, to: document.getElementsByClassName("square")[58] })
        }
        if(canCastle(whiteKing, whiteTower2)) {
            filteredMoves.push({ whiteKing, from: square, to: document.getElementsByClassName("square")[62] })
        }
    }else if(getChessPiece(square) === blackKing) {
        if(canCastle(blackKing, blackTower1)) {
            filteredMoves.push({ whiteKing, from: square, to: document.getElementsByClassName("square")[2] })
        }
        if(canCastle(blackKing, blackTower2)) {
            filteredMoves.push({ whiteKing, from: square, to: document.getElementsByClassName("square")[6] })
        }
    }

    return filteredMoves.map(move => move.to)
}

// Function for highlighting the squares
function highlightSquares(squares) {
    squares.forEach(square => {
        square.classList.add('highlight')
        if(square.querySelector('.pieces')) {
            square.classList.add('highlight-piece-square')
        }else {
            square.classList.add('highlight-empty-square')
        }
    })
}

// Function to remove highlights from all squares
function removeHighlights() {
    document.querySelectorAll('.highlight').forEach(square => {
        square.classList.remove('highlight')
        square.classList.remove('highlight-empty-square')
        square.classList.remove('highlight-piece-square')
    })
}

// Function for knowing if the color player it's on check or not
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
                if(piece instanceof King) {
                    if(piece.player === "White") {
                        squareWhiteKing = from
                    }else {
                        squareBlackKing = from
                    }
                }
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
                if(piece instanceof King) {
                    if(piece.player === "White") {
                        squareWhiteKing = from
                    }else {
                        squareBlackKing = from
                    }
                }
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

const errorSound = new Audio('./public/sounds/sound-effect-error.mp3')

function showErrorEffect(square) {
    
    if (square.classList.contains('white-square')) {
        square.classList.add('blinking-white')
    } else if (square.classList.contains('black-square')) {
        square.classList.add('blinking-black')
    }

    errorSound.play()

    setTimeout(() => {
        square.classList.remove('blinking-white', 'blinking-black')
    }, 3000)
}
