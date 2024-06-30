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
        }
    }
}

const rellenarTableroInicial = () => {
    
    for (let i=0; i<8; i++) {
        
        const casilla = document.getElementsByClassName("casilla")[i+8]
        const pieza = document.createElement("p")
        casilla.appendChild(pieza)

        pieza.classList.add("piezas")

        const peon = new Pieza("peon negro")
        pieza.innerHTML = peon.figura
    }
}

rellenarTableroInicial()