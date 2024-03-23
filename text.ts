// text.ts
namespace matrix {


    //% blockId=matrix_charCode
    //% block="%text" blockHidden=true
    export function charCode(text: string) { return text.charCodeAt(0) }



    export enum eZeichenDrehen {
        //%block="nicht drehen"
        nicht,
        //%block="nach links drehen"
        links,
        //%block="nach rechts drehen"
        rechts,
        //%block="spiegeln"
        spiegeln
    }

    //% group="Bilder 8 Pixel" subcategory="Bilder"
    //% block="Bild drehen 8x8 %i0 %pDrehen" weight=3
    export function imageDrehen(i0: Image, pDrehen: eZeichenDrehen) {
        let byte0: number
        let i1 = createImage(`
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        `)
        switch (pDrehen) {
            case eZeichenDrehen.nicht: {
                return i0
            }
            case eZeichenDrehen.links: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach links drehen
                    //byte0 =i0.pixel() )// b0.getUint8(7 - i)

                    if (i0.pixel(7 - i, 7)) { i1.setPixel(7, i, true) }
                    if (i0.pixel(7 - i, 6)) { i1.setPixel(6, i, true) }
                    if (i0.pixel(7 - i, 5)) { i1.setPixel(5, i, true) }
                    if (i0.pixel(7 - i, 4)) { i1.setPixel(4, i, true) }
                    if (i0.pixel(7 - i, 3)) { i1.setPixel(3, i, true) }
                    if (i0.pixel(7 - i, 2)) { i1.setPixel(2, i, true) }
                    if (i0.pixel(7 - i, 1)) { i1.setPixel(1, i, true) }
                    if (i0.pixel(7 - i, 0)) { i1.setPixel(0, i, true) }
                    /* 
                                        if ((b0.getUint8(7 - i) & 2 ** 7) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 6) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 5) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 4) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 3) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 2) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 1) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                                        if ((b0.getUint8(7 - i) & 2 ** 0) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                                         */
                }
                return i1
            }
        }

        basic.showNumber(i1.height())
        return i1
    }

/* 
    function drehen(b0: Buffer, pDrehen: eZeichenDrehen) { // Buffer mit 8 Byte
        let b1 = Buffer.create(8)
        b1.fill(0b00000000)

        switch (pDrehen) {
            case eZeichenDrehen.nicht: {
                return b0
            }
            case eZeichenDrehen.links: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach links drehen
                    if ((b0.getUint8(7 - i) & 2 ** 7) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 6) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 5) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 4) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 3) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 2) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 1) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                    if ((b0.getUint8(7 - i) & 2 ** 0) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                }
                return b1
            }
            case eZeichenDrehen.rechts: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/4 nach rechts drehen
                    if ((b0.getUint8(i) & 2 ** 0) != 0) { b1.setUint8(7, b1.getUint8(7) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 1) != 0) { b1.setUint8(6, b1.getUint8(6) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 2) != 0) { b1.setUint8(5, b1.getUint8(5) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 3) != 0) { b1.setUint8(4, b1.getUint8(4) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 4) != 0) { b1.setUint8(3, b1.getUint8(3) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 5) != 0) { b1.setUint8(2, b1.getUint8(2) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 6) != 0) { b1.setUint8(1, b1.getUint8(1) | 2 ** i) }
                    if ((b0.getUint8(i) & 2 ** 7) != 0) { b1.setUint8(0, b1.getUint8(0) | 2 ** i) }
                }
                return b1
            }
            case eZeichenDrehen.spiegeln: {
                for (let i = 0; i <= 7; i++) { // 8x8 Bit 1/2 nach rechts drehen
                    if ((b0.getUint8(i) & 2 ** 0) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 0) }
                    if ((b0.getUint8(i) & 2 ** 1) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 1) }
                    if ((b0.getUint8(i) & 2 ** 2) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 2) }
                    if ((b0.getUint8(i) & 2 ** 3) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 3) }
                    if ((b0.getUint8(i) & 2 ** 4) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 4) }
                    if ((b0.getUint8(i) & 2 ** 5) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 5) }
                    if ((b0.getUint8(i) & 2 ** 6) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 6) }
                    if ((b0.getUint8(i) & 2 ** 7) != 0) { b1.setUint8(7 - i, b1.getUint8(7 - i) | 2 ** 7) }
                }
                return b1
            }
            default: return b0
        }
    }
 */


    //% imageLiteral=1 shim=images::createImage
    export function createImage(i: string): Image {
        const im = <Image><any>i;
        return im
    }


    export function getPixel_5x8(pCharCode: number): Buffer {

        if (between(pCharCode, 0x20, 0x7F)) {

            switch (pCharCode & 0xF0) { // 16 string-Elemente je 5 Byte
                case 0x20:
                    return Buffer.fromHex([
                        "0000000000", // " "
                        "005F000000", // "!"
                        "0007000700", // """
                        "147F147F14", // "#"
                        "242A7F2A12", // "$"
                        "2313086462", // "%"
                        "3649552250", // "&"
                        "0005030000", // "'"
                        "1C22410000", // "("
                        "41221C0000", // ")"
                        "082A1C2A08", // "*"
                        "08083E0808", // "+"
                        "A060000000", // ","
                        "0808080808", // "-"
                        "6060000000", // "."
                        "2010080402" // "/"
                    ].get(pCharCode & 0x0F))

                case 0x30:
                    return Buffer.fromHex([
                        "3E5149453E", // "0"
                        "00427F4000", // "1"
                        "6251494946", // "2"
                        "2241494936", // "3"
                        "1814127F10", // "4"
                        "2745454539", // "5"
                        "3C4A494930", // "6"
                        "0171090503", // "7"
                        "3649494936", // "8"
                        "064949291E", // "9"
                        "0036360000", // ":"
                        "00AC6C0000", // ";"
                        "0814224100", // "<"
                        "1414141414", // "="
                        "4122140800", // ">"
                        "0201510906"  // "?"
                    ].get(pCharCode & 0x0F))

                case 0x40:
                    return Buffer.fromHex([
                        "324979413E", // "@""
                        "7E0909097E", // "A"
                        "7F49494936", // "B"
                        "3E41414122", // "C"
                        "7F4141221C", // "D"
                        "7F49494941", // "E"
                        "7F09090901", // "F"
                        "3E41415172", // "G"
                        "7F0808087F", // "H"
                        "417F410000", // "I"
                        "2040413F01", // "J"
                        "7F08142241", // "K"
                        "7F40404040", // "L"
                        "7F020C027F", // "M"
                        "7F0408107F", // "N"
                        "3E4141413E" // "O"
                    ].get(pCharCode & 0x0F))

                case 0x50:
                    return Buffer.fromHex([
                        "7F09090906", // "P"
                        "3E4151215E", // "Q"
                        "7F09192946", // "R"
                        "2649494932", // "S"
                        "01017F0101", // "T"
                        "3F4040403F", // "U"
                        "1F2040201F", // "V"
                        "3F4038403F", // "W"
                        "6314081463", // "X"
                        "0304780403", // "Y"
                        "6151494543", // "Z"
                        "7F41410000", // """
                        "0204081020", // "\"
                        "41417F0000", // """
                        "0402010204", // "^"
                        "8080808080" // "_"
                    ].get(pCharCode & 0x0F))

                case 0x60:
                    return Buffer.fromHex([
                        "0102040000", // "`"
                        "2054545478", // "a"
                        "7F48444438", // "b"
                        "3844442800", // "c"
                        "384444487F", // "d"
                        "3854545418", // "e"
                        "087E090200", // "f"
                        "18A4A4A47C", // "g"
                        "7F08040478", // "h"
                        "007D000000", // "i"
                        "80847D0000", // "j"
                        "7F10284400", // "k"
                        "417F400000", // "l"
                        "7C04180478", // "m"
                        "7C08047C00", // "n"
                        "3844443800" // "o"
                    ].get(pCharCode & 0x0F))

                case 0x70:
                    return Buffer.fromHex([
                        "FC24241800", // "p"
                        "182424FC00", // "q"
                        "007C080400", // "r"
                        "4854542400", // "s"
                        "047F440000", // "t"
                        "3C40407C00", // "u"
                        "1C2040201C", // "v"
                        "3C4030403C", // "w"
                        "4428102844", // "x"
                        "1CA0A07C00", // "y"
                        "4464544C44", // "z"
                        "0836410000", // "{"
                        "007F000000", // "|"
                        "4136080000", // "}"
                        "0201010201", // "~"
                        "FFFFFFFFFF"  // 127
                    ].get(pCharCode & 0x0F))

                default:
                    return Buffer.fromHex("FFFFFFFFFF")
            }
        }
        else {
            let b: Buffer = Buffer.fromHex("FFFFFFFFFF")
            let s = "ÄÖÜäöüß€°"
            for (let j = 0; j < s.length; j++) {
                if (s.charCodeAt(j) == pCharCode) {
                    b = Buffer.fromHex([
                        "7D0A090A7D", // "Ä"
                        "3D4241423D", // "Ö"
                        "3D4040403D", // "Ü"
                        "2154545578", // "ä"
                        "3944443900", // "ö"
                        "3D40407D00", // "ü"
                        "FE09493600", // "ß"
                        "143E555555", // "€" "143E5555551400"
                        "0205020000"  // "°"
                    ].get(j))
                    break
                }
            }
            return b
        }
    }

} // text.ts
