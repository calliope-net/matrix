
namespace matrix { // advanced.ts

    // ========== group="Kommentar" advanced=true

    //% group="Kommentar" advanced=true
    //% block="// %text"
    export function comment(text: string): void { }



    // ========== group="internen Speicher lesen" advanced=true

    //% group="internen Speicher lesen" advanced=true
    //% block="get Matrix[]" weight=8
    export function getMatrix() { return qMatrix }

    //% group="internen Speicher lesen" advanced=true
    //% block="get Image[]" weight=7
    export function getImages() { return matrix_Images() }



    // ========== group="Funktionen" advanced=true

    //% group="Funktionen" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=8
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
    //% block="formatiere %pText Länge %len || %align" weight=5
    //% pText.shadow="matrix_text"
    //% inlineInputMode=inline
    export function formatText(pText: any, len: number, align = eAlign.links) {
        let text: string = convertToText(pText)
        if (text.length > len)
            return text.substr(0, len)
        else if (text.length < len && align == eAlign.rechts)
            return c25.substr(0, len - text.length) + text
        else if (text.length < len)
            return text + c25.substr(0, len - text.length)
        else
            return text
    }

    const c25 = "                         " // 25 Leerzeichen

    export enum eAlign {
        //% block="linksbündig"
        links,
        //% block="rechtsbündig"
        rechts
    }

    //% group="Funktionen" advanced=true
    //% block="π" weight=2
    export function pi() { return Math.PI }



    // ========== group="Test Funktionen" color="#7E84F7" advanced=true

    //% group="Test Funktionen" color="#7E84F7" advanced=true
    //% block="zeichne alle Text-Zeichen in Matrix"
    export function writeCharset() {
        // charCode 0..127 in Matrix Zeilen 0..7
        for (let y = 2; y <= 7; y++)  // 0-1 Steuerzeichen ignorieren
            for (let x = 0; x <= 15; x++)
                writeImage(get5x8CharImage(y * 16 + x), x * 8, y * 8)


        // charCode ab 128 in Matrix Zeilen 8..15 (nur im 128x128 Display zu sehen)
        let s = "ÄÖÜäöüß€°" // C4 D6 DC E4 F6 FC DF (20)AC B0
        let charCode: number
        for (let j = 0; j < s.length; j++) {
            charCode = s.charCodeAt(j)
            writeImage(get5x8CharImage(charCode), (charCode & 0x0F) << 3, (charCode & 0xF0) >>> 1) // y Bit 7654 * 8 = /2 = 1 Bit nach rechts
            //writeImage(get5x8CharImage(charCode), (charCode & 0x0F) * 8, (charCode & 0xF0) >>> 1) // y Bit 7654 * 8 = /2 = 1 Bit nach rechts
        }
    }


} // advanced.ts
