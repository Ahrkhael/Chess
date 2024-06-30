const tablero = document.getElementById("board")

for(let i=0; i<8; i++) {

    const linea = document.createElement("div")
    linea.classList.add("linea")
    tablero.appendChild(linea)

    for (let j=0; j<8; j++) {

        const casilla = document.createElement("div")
        casilla.classList.add("casilla")

        if ((i+j)%2===0) {
            casilla.style.backgroundColor="#FFF8DC"
        }else {
            casilla.style.backgroundColor="#DEB887"
        }

        linea.appendChild(casilla)

        if(j===7) {
            const br = document.createElement("br")
            linea.appendChild(br)
        }
    }
}

class Pieza {
    constructor(nombre) {
        this.nombre=nombre
        switch (nombre) {
            case "peon blanco":
                this.figura="\u{2659}"
                break
            case "peon negro":
                this.figura="\u{265F}"
                break
            case "rey blanco":
                this.figura="\u{2654}"
                break
            case "rey negro":
                this.figura="\u{265A}"
                break
            case "reina blanca":
                this.figura="\u{2655}"
                break
            case "reina negra":
                this.figura="\u{265B}"
                break
            case "caballo blanco":
                this.figura="\u{2658}"
                break
            case "caballo negro":
                this.figura="\u{265E}"
                break
            case "torre blanca":
                this.figura="\u{2656}"
                break
            case "torre negra":
                this.figura="\u{265C}"
                break
            case "alfil blanco":
                this.figura="\u{2657}"
                break
            case "alfil negro":
                this.figura="\u{265D}"
                break
        }
    }
}

const rellenarTableroInicial = () => {

    for (let i=0; i<8; i++) {
        
        let casilla = document.getElementsByClassName("casilla")[i+8]
        let pieza = document.createElement("p")
        casilla.appendChild(pieza)

        pieza.classList.add("piezas")

        const peonNegro = new Pieza("peon negro")
        pieza.innerHTML = peonNegro.figura

        casilla = document.getElementsByClassName("casilla")[i+48]
        pieza = document.createElement("p")
        casilla.appendChild(pieza)

        pieza.classList.add("piezas")

        const peonBlanco = new Pieza("peon blanco")
        pieza.innerHTML = peonBlanco.figura

        
        switch (i) {
            case 4:
                
                const reyBlanco = new Pieza("rey blanco")
    
                casilla = document.getElementsByClassName("casilla")[60]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = reyBlanco.figura

                const reyNegro = new Pieza("rey negro")
    
                casilla = document.getElementsByClassName("casilla")[4]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = reyNegro.figura

                break
            
            case 3:
                
                const reinaBlanca = new Pieza("reina blanca")
                
                casilla = document.getElementsByClassName("casilla")[59]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = reinaBlanca.figura

                const reinaNegra = new Pieza("reina negra")
                
                casilla = document.getElementsByClassName("casilla")[3]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = reinaNegra.figura

                break    
            
            case 2 || 5:
                
                const alfilBlanco = new Pieza("alfil blanco")

                casilla = document.getElementsByClassName("casilla")[58]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = alfilBlanco.figura

                casilla = document.getElementsByClassName("casilla")[61]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = alfilBlanco.figura

                const alfilNegro = new Pieza("alfil negro")

                casilla = document.getElementsByClassName("casilla")[2]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = alfilNegro.figura

                casilla = document.getElementsByClassName("casilla")[5]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = alfilNegro.figura

                break

            case 1 || 6:
                
                const caballoBlanco = new Pieza("caballo blanco")

                casilla = document.getElementsByClassName("casilla")[57]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = caballoBlanco.figura

                casilla = document.getElementsByClassName("casilla")[62]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = caballoBlanco.figura

                const caballoNegro = new Pieza("caballo negro")

                casilla = document.getElementsByClassName("casilla")[1]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = caballoNegro.figura

                casilla = document.getElementsByClassName("casilla")[6]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = caballoNegro.figura

                break  
            
            case 0 || 7:
            
                const torreBlanca = new Pieza("torre blanca")

                casilla = document.getElementsByClassName("casilla")[56]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = torreBlanca.figura
                
                casilla = document.getElementsByClassName("casilla")[63]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = torreBlanca.figura

                const torreNegra = new Pieza("torre negra")

                casilla = document.getElementsByClassName("casilla")[0]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = torreNegra.figura
                
                casilla = document.getElementsByClassName("casilla")[7]
                pieza = document.createElement("p")
                casilla.appendChild(pieza)
                pieza.classList.add("piezas")
                pieza.innerHTML = torreNegra.figura

                break
        }
    }
}

rellenarTableroInicial()