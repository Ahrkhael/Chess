const board = document.getElementById("board")

for(let i=0; i<8; i++) {

    const row = document.createElement("div")
    row.classList.add("row")
    board.appendChild(row)

    for (let j=0; j<8; j++) {

        const square = document.createElement("div")
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

const fillInitialBoard = () => {

    for (let i=0; i<8; i++) {
        
        let square = document.getElementsByClassName("square")[i+8]
        let piece = document.createElement("p")
        square.appendChild(piece)

        piece.classList.add("pieces")

        piece.innerHTML = blackPawn.figure

        square = document.getElementsByClassName("square")[i+48]
        piece = document.createElement("p")
        square.appendChild(piece)

        piece.classList.add("pieces")

        piece.innerHTML = whitePawn.figure
        
        switch (i) {
            case 4:
    
                square = document.getElementsByClassName("square")[60]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKing.figure
    
                square = document.getElementsByClassName("square")[4]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKing.figure

                break
            
            case 3:
                
                square = document.getElementsByClassName("square")[59]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteQueen.figure
                
                square = document.getElementsByClassName("square")[3]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackQueen.figure

                break    
            
            case 2 || 5:

                square = document.getElementsByClassName("square")[58]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteBishop.figure

                square = document.getElementsByClassName("square")[61]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteBishop.figure

                square = document.getElementsByClassName("square")[2]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackBishop.figure

                square = document.getElementsByClassName("square")[5]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackBishop.figure

                break

            case 1 || 6:
                
                square = document.getElementsByClassName("square")[57]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKnight.figure

                square = document.getElementsByClassName("square")[62]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteKnight.figure

                square = document.getElementsByClassName("square")[1]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKnight.figure

                square = document.getElementsByClassName("square")[6]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackKnight.figure

                break  
            
            case 0 || 7:
            
                square = document.getElementsByClassName("square")[56]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteTower.figure
                
                square = document.getElementsByClassName("square")[63]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = whiteTower.figure

                square = document.getElementsByClassName("square")[0]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackTower.figure
                
                square = document.getElementsByClassName("square")[7]
                piece = document.createElement("p")
                square.appendChild(piece)
                piece.classList.add("pieces")
                piece.innerHTML = blackTower.figure

                break
        }
    }
}

fillInitialBoard()

let pieceSelected = null;
let squareOrigin = null;

document.querySelectorAll('.square').forEach(square => {
    square.addEventListener('click', () => {
        if (pieceSelected) {
            movePiece(square)
        } else if (square.querySelector('.pieces')) {
            console.log(square.querySelector('.pieces').innerHTML)
            selectPiece(square)
        }
    });
});

function selectPiece(square) {
    pieceSelected = square.querySelector('.pieces')
    squareOrigin = square
    square.dataset.originalColor = square.style.backgroundColor; // Guardar el color original
    square.style.backgroundColor = 'yellow'
}

function movePiece(square) {

    if (square !== squareOrigin && (!square.querySelector('.pieces') || square.querySelector('.pieces').dataset.color !== pieceSelected.dataset.color)) {
        
        square.appendChild(pieceSelected)
        squareOrigin.style.backgroundColor = squareOrigin.dataset.originalColor; // Restaurar el color original
        pieceSelected = null
        squareOrigin = null
    }
}
