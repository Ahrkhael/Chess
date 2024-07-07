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

        if(player==="white") {
            this.figure="\u{2654}"
        }else if(player==="black") {
            this.figure="\u{265A}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
}

class Queen {
    constructor(player) {
        this.player = player

        if(player==="white") {
            this.figure="\u{2655}"
        }else if(player==="black") {
            this.figure="\u{265B}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
}

class Pawn {
    constructor(player) {
        this.player = player

        if(player==="white") {
            this.figure="\u{2659}"
        }else if(player==="black") {
            this.figure="\u{265F}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
}

class Knight {
    constructor(player) {
        this.player = player

        if(player==="white") {
            this.figure="\u{2658}"
        }else if(player==="black") {
            this.figure="\u{265E}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
}

class Bishop {
    constructor(player) {
        this.player = player

        if(player==="white") {
            this.figure="\u{2657}"
        }else if(player==="black") {
            this.figure="\u{265D}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
}

class Tower {
    constructor(player) {
        this.player = player
        this.hasMoved = false

        if(player==="white") {
            this.figure="\u{2656}"
        }else if(player==="black") {
            this.figure="\u{265C}"
        }else {
            throw new Error("Player must be white or black")
        }
    }
}

const whitePawn = new Pawn("white")
const blackPawn = new Pawn("black")

const whiteKing = new King("white")
const blackKing = new King("black")

const whiteQueen = new Queen("white")
const blackQueen = new Queen("black")

const whiteKnight = new Knight("white")
const blackKnight = new Knight("black")

const whiteBishop = new Bishop("white")
const blackBishop = new Bishop("black")

const whiteTower = new Tower("white")
const blackTower = new Tower("black")

// Function to fill the initial board
const fillInitialBoard = () => {

    for (let i=0; i<8; i++) {
        
        square = document.getElementsByClassName("square")[i+8]
        let piece = document.createElement("p")
        square.appendChild(piece)

        piece.classList.add("pieces")

        piece.innerHTML = blackPawn.figure
        piece.dataset.player = "black"
        piece.dataset.chessPiece = "pawn"

        square = document.getElementsByClassName("square")[i+48]
        piece = document.createElement("p")
        square.appendChild(piece)

        piece.classList.add("pieces")

        piece.innerHTML = whitePawn.figure
        piece.dataset.player = "white"
        piece.dataset.chessPiece = "pawn"
        
        switch (i) {
            case 4:
    
                square = document.getElementsByClassName("square")[60]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKing.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "king"
    
                square = document.getElementsByClassName("square")[4]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKing.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "king"

                break
            
            case 3:
                
                square = document.getElementsByClassName("square")[59]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteQueen.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "queen"
                
                square = document.getElementsByClassName("square")[3]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackQueen.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "queen"

                break    
            
            case 2 || 5:

                square = document.getElementsByClassName("square")[58]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteBishop.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "bishop"

                square = document.getElementsByClassName("square")[61]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteBishop.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "bishop"

                square = document.getElementsByClassName("square")[2]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackBishop.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "bishop"

                square = document.getElementsByClassName("square")[5]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackBishop.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "bishop"

                break

            case 1 || 6:
                
                square = document.getElementsByClassName("square")[57]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKnight.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "knight"

                square = document.getElementsByClassName("square")[62]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKnight.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "knight"

                square = document.getElementsByClassName("square")[1]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKnight.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "knight"

                square = document.getElementsByClassName("square")[6]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKnight.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "knight"

                break  
            
            case 0 || 7:
            
                square = document.getElementsByClassName("square")[56]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteTower.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "tower"
                
                square = document.getElementsByClassName("square")[63]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteTower.figure
                piece.dataset.player = "white"
                piece.dataset.chessPiece = "tower"

                square = document.getElementsByClassName("square")[0]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackTower.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "tower"
                
                square = document.getElementsByClassName("square")[7]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackTower.figure
                piece.dataset.player = "black"
                piece.dataset.chessPiece = "tower"

                break
        }
    }
}

fillInitialBoard()

// Function for getting the chess piece of the square
const getChessPiece = (square) => {
    switch (square.querySelector('.pieces').dataset.chessPiece) {
        case "pawn":
            if (square.querySelector('.pieces').dataset.player === "white") {
                return whitePawn
            }else {
                return blackPawn
            }
        case "king":
            if (square.querySelector('.pieces').dataset.player === "white") {
                return whiteKing
            }else {
                return blackKing
            }
        case "queen":
            if (square.querySelector('.pieces').dataset.player === "white") {
                return whiteQueen
            }else {
                return blackQueen
            }
        case "knight":
            if (square.querySelector('.pieces').dataset.player === "white") {
                return whiteKnight
            }else {
                return blackKnight
            }
        case "bishop":
            if (square.querySelector('.pieces').dataset.player === "white") {
                return whiteBishop
            }else {
                return blackBishop
            }
        case "tower":
            if (square.querySelector('.pieces').dataset.player === "white") {
                return whiteTower
            }else {
                return blackTower
            }
    }
}

let pieceSelected = null
let squareOrigin = null

document.querySelectorAll('.square').forEach((square, index) => {
    square.addEventListener('click', () => {
        if (pieceSelected) {
            movePiece(square, index)
        } else if (square.querySelector('.pieces')) {
            selectPiece(square)
            console.log(pieceSelected.dataset.player)
            console.log(pieceSelected.dataset.chessPiece)
        }
    })
})

function selectPiece(square) {
    pieceSelected = square.querySelector('.pieces')
    squareOrigin = square
    square.dataset.originalColor = square.style.backgroundColor; // Guardar el color original
    square.style.backgroundColor = 'yellow'
}

function movePiece(square, index) {

    if (square !== squareOrigin) {
        console.log(getChessPiece(squareOrigin))
        if(!square.querySelector('.pieces')) {
            square.appendChild(pieceSelected)
        }else if (square.querySelector('.pieces').dataset.player !== pieceSelected.dataset.player) {
            square.querySelector('.pieces').remove()
            square.appendChild(pieceSelected)
        }
        squareOrigin.style.backgroundColor = squareOrigin.dataset.originalColor; // Restaurar el color original
        pieceSelected = null
        squareOrigin = null
    }
}
