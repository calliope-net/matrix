
namespace matrix { // advanced.ts


    //% group="Kommentar" advanced=true
    //% block="// %text"
    export function comment(text: string): void { }



    // ========== group="internen Speicher lesen" advanced=true

    //% group="internen Speicher lesen" advanced=true
    //% block="get Buffer[]" weight=8
    export function getArray() { return qArray }


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


} // advanced.ts
