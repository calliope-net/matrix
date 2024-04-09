
namespace matrix { // advanced.ts


    //% group="Kommentar" advanced=true
    //% block="// %text"
    export function comment(text: string): void { }



    // ========== group="internen Speicher lesen" advanced=true

    //% group="internen Speicher lesen" advanced=true
    //% block="get Matrix[]" weight=8
    export function getMatrix() { return qMatrix }


    //% group="internen Speicher lesen" advanced=true
    //% block="get Image[]" weight=7
    export function getImages() { return qImages }


    // ========== group="Funktionen" advanced=true

    //% group="Funktionen" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=7
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }

    //% blockId=matrix_charCodeAt
    //% group="Funktionen" advanced=true
    //% block="charCodeAt %text index %index" weight=6
    export function charCodeAt(text: string, index: number) {
        return text.charCodeAt(index)
    }

    //% group="Funktionen" advanced=true
    //% block="π" weight=2
    export function pi() { return Math.PI }



    //% group="Test Funktionen" advanced=true
    //% block="zeichne alle ASCII Zeichen in Matrix"
    export function writeCharset() {
        //clearMatrix()
        for (let i = 0; i <= 5; i++) {
            clearImages() // internes Array Images[]
            for (let j = 0; j <= 15; j++) {
                pushImage(get5x8CharImage((2 + i) * 16 + j))
            }
            writeImageArray(matrix_Images(), 1, 16 + i * 8, 8)
        }

        let s = "ÄÖÜäöüß€°" // C4 D6 DC E4 F6 FC DF (20)AC B0
        let charCode: number
        for (let j = 0; j < s.length; j++) {
            charCode = s.charCodeAt(j)
            writeImage(asciiImage(charCode), 1 + (charCode & 0x0F) * 8, (charCode & 0xF0) >>> 1) // y Bit 7654 * 8 = /2 = 1 Bit nach rechts
        }
    }


} // advanced.ts
