
namespace matrix { // text.ts


    //% blockId=matrix_charCode
    //% block="%text" blockHidden=true
    //% text.defl="R"
    export function charCode(text: string) { return text.charCodeAt(0) }



    export enum eZeichenDrehen {
        //%block="nicht drehen"
        nicht,
        //%block="links ↶ drehen"
        links,
        //%block="rechts ↷ drehen"
        rechts,
        //%block="halb ⤸ drehen"
        halb,
        //%block="↔ y spiegeln"
        yspiegeln,
        //% block="↕ x spiegeln"
        xspiegeln
    }

    //% group="Bild in Buffer zeichnen" subcategory="Bilder"
    //% block="8x8 %i0 %pDrehen" weight=7
    export function imageDrehen(i0: Image, pDrehen: eZeichenDrehen) {
        //if (pDrehen == eZeichenDrehen.nicht)
        //    return i0
        //else {
        let i1 = matrix8x8(`            
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        `)

        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                if (i < i0.width() && j < i0.height()) {
                    switch (pDrehen) {
                        case eZeichenDrehen.nicht: { // nur in 8x8 kopieren
                            i1.setPixel(i, j, i0.pixel(i, j)) // (i,j) (i,j)
                            break
                        }
                        case eZeichenDrehen.links: {
                            i1.setPixel(j, 7 - i, i0.pixel(i, j)) // (j,7-i) (i,j)
                            break
                        }
                        case eZeichenDrehen.rechts: {
                            i1.setPixel(7 - j, i, i0.pixel(i, j)) // (7-j,i) (i,j)
                            break
                        }
                        case eZeichenDrehen.halb: {
                            i1.setPixel(7 - i, 7 - j, i0.pixel(i, j)) // (7-i,7-j) (i,j)
                            break
                        }
                        case eZeichenDrehen.yspiegeln: {
                            i1.setPixel(7 - i, j, i0.pixel(i, j)) // (7-i,j) (i,j)
                            break
                        }
                        case eZeichenDrehen.xspiegeln: {
                            i1.setPixel(i, 7 - j, i0.pixel(i, j)) // (i,7-j) (i,j)
                            break
                        }
                    }
                }
            }
        }
        return i1
        //} // else
    }

    export function getDigit_5x8(pCharCode: number) { // nur Ziffern, Minus und Punkt (spart Programmcode)
        if (between(pCharCode, 0x30, 0x3A)) {
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
                "0036360000"  // ":"
            ].get(pCharCode & 0x0F))
        }
        else if (pCharCode == 0x2D) return Buffer.fromHex("0808080808") // "-"
        else if (pCharCode == 0x2E) return Buffer.fromHex("6060000000") // "."
        else return Buffer.fromHex("FFFFFFFFFF")
    }


    export function getChar_5x8(pCharCode: number): Buffer {

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
                        "143E555541", // "€" "143E5555551400"
                        "0205020000"  // "°"
                    ].get(j))
                    break
                }
            }
            return b
        }
    }

} // text.ts
