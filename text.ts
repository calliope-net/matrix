// text.ts
namespace matrix {



    //% group="Text schreiben" subcategory="Text"
    //% block="Text %pText an x %x Page %page"
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function writeTextBuffer(pText: string, x: number, page: number) {
        // schreibt in den Buffer ab offset 1 Byte 0x40 + 8 Byte pro char im Text für die 8x8 Pixel
        // Buffer muss vorher die richtige Länge haben
        //let font: string
        // bu.setUint8(offset++, eCONTROL.x40_Data) // CONTROL Byte 0x40: Display Data

        for (let j = 0; j < pText.length; j++) {

            writeBuffer(x, page, getPixel_5x8(pText.charCodeAt(j)))

            //bu.write(offset, getPixel_8x8(pText.charCodeAt(j)))
            x += 5
        }
        //this.i2cWriteBuffer(bu)
        //control.waitMicros(50)
    }


    //% imageLiteral=1 shim=images::createImage
    function createImage(i: string): Image {
        const im = <Image><any>i;
        return im
    }



    //% group="Text schreiben" subcategory="Text"
    //% block="Bild aus Zeichencode %charCode"
    export function writeCharImage(charCode: number): Image {

        let i5x8 = createImage(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)

        let bu = getPixel_5x8(charCode)

        for (let iy = 0; iy < i5x8.height(); iy++) {
            for (let ix = 0; ix < i5x8.width(); ix++) {
                i5x8.setPixel(ix, iy, (bu.getUint8(ix) & 2 ** (iy & 7)) != 0)
            }
        }

        return i5x8
    }


    function getPixel_5x8(pCharCode: number): Buffer {
        let string5Byte: string
        if (between(pCharCode, 0x30, 0x3F)) {

            //string8Byte = this.x70.get(15)
            switch (pCharCode & 0xF0) { // 16 string-Elemente je 8 Byte = 128
                //case 0x20: string8Byte = this.x20.get(pCharCode & 0x0F); break
                case 0x30:
                    string5Byte = [
                        "\x3E\x51\x49\x45\x3E", // "0"
                        "\x00\x42\x7F\x40\x00", // "1"
                        "\x62\x51\x49\x49\x46", // "2"
                        "\x22\x41\x49\x49\x36", // "3"
                        "\x18\x14\x12\x7F\x10", // "4"
                        "\x27\x45\x45\x45\x39", // "5"
                        "\x3C\x4A\x49\x49\x30", // "6"
                        "\x01\x71\x09\x05\x03", // "7"
                        "\x36\x49\x49\x49\x36", // "8"
                        "\x06\x49\x49\x29\x1E", // "9"
                        /* "\x00\x00\x36\x36\x00\x00\x00\x00", // ":"
                        "\x00\x00\xAC\x6C\x00\x00\x00\x00", // ";"
                        "\x00\x08\x14\x22\x41\x00\x00\x00", // "<"
                        "\x00\x14\x14\x14\x14\x14\x00\x00", // "="
                        "\x00\x41\x22\x14\x08\x00\x00\x00", // ">"
                        "\x00\x02\x01\x51\x09\x06\x00\x00" // "?" */
                    ].get(pCharCode & 0x0F)

                    /* string8Byte = [
                        "\x00\x3E\x51\x49\x45\x3E\x00\x00", // "0"
                        "\x00\x00\x42\x7F\x40\x00\x00\x00", // "1"
                        "\x00\x62\x51\x49\x49\x46\x00\x00", // "2"
                        "\x00\x22\x41\x49\x49\x36\x00\x00", // "3"
                        "\x00\x18\x14\x12\x7F\x10\x00\x00", // "4"
                        "\x00\x27\x45\x45\x45\x39\x00\x00", // "5"
                        "\x00\x3C\x4A\x49\x49\x30\x00\x00", // "6"
                        "\x00\x01\x71\x09\x05\x03\x00\x00", // "7"
                        "\x00\x36\x49\x49\x49\x36\x00\x00", // "8"
                        "\x00\x06\x49\x49\x29\x1E\x00\x00", // "9"
                        "\x00\x00\x36\x36\x00\x00\x00\x00", // ":"
                        "\x00\x00\xAC\x6C\x00\x00\x00\x00", // ";"
                        "\x00\x08\x14\x22\x41\x00\x00\x00", // "<"
                        "\x00\x14\x14\x14\x14\x14\x00\x00", // "="
                        "\x00\x41\x22\x14\x08\x00\x00\x00", // ">"
                        "\x00\x02\x01\x51\x09\x06\x00\x00" // "?"
                    ].get(pCharCode & 0x0F) */

                    break
                //case 0x40: string8Byte = this.x40.get(pCharCode & 0x0F); break
                //case 0x50: string8Byte = this.x50.get(pCharCode & 0x0F); break
                //case 0x60: string8Byte = this.x60.get(pCharCode & 0x0F); break
                //case 0x70: string8Byte = this.x70.get(pCharCode & 0x0F); break
                //default: s8 = this.x70.get(15); break
            }
            return Buffer.fromUTF8(string5Byte)
        }
        else {
            let b: Buffer = Buffer.fromHex("FFFFFFFFFFFFFFFF")

            /* let s = "ÄÖÜäöüß€°"
            for (let j = 0; j < s.length; j++) {
                if ((s.charCodeAt(j)) == (pCharCode)) {
                    //string8Byte = this.h80.get(j)
                    b = this.b80.slice(j * 8, 8)
                    break
                }
            } */
            return b
        }
    }


} // text.ts
