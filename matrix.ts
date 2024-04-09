
//% color=#0000BF icon="\uf108" block="Matrix" weight=20
namespace matrix
/* 240306 240318 Lutz Elßner
CALLIOPE mini V2 erforderlich (32 KB RAM)
https://wiki.seeedstudio.com/Grove-OLED-Display-1.12-SH1107_V3.0/
https://files.seeedstudio.com/wiki/Grove-OLED-Display-1.12-(SH1107)_V3.0/res/SH1107V2.1.pdf
*/ {
    // ========== I²C ==========
    export enum eI2C { I2C_x3C = 0x3C, I2C_x3D = 0x3D }

    // OLED Display (SH1107) kann nur I²C Write; keine i2cRead-Funktion erforderlich
    function i2cWriteBuffer(pI2C: eI2C, buf: Buffer, repeat: boolean = false) { pins.i2cWriteBuffer(pI2C, buf, repeat) }


    // ========== Buffer ==========
    export let qMatrix: Buffer[] = [] // leeres Array Elemente Typ Buffer

    export enum ePages {
        //% block="128x64"
        y64 = 8,
        //% block="128x128"
        y128 = 16
    }

    // 6 Bytes zur Cursor Positionierung vor den Daten + 1 Byte 0x40 Display Data
    const cOffset = 7 // Platz am Anfang des Buffer bevor die cx Pixel kommen

    export const cx = 128 // max x Pixel (Bytes von links nach rechts)
    let qPages3C = ePages.y64 // Display Höhe (Pages) kann pro I²C Adresse verschieden sein
    let qPages3D = ePages.y64 // 8 oder 16 Pages

    //let qI2C = eI2C.I2C_x3C
    export function qy() { return qMatrix.length * 8 } // max. y Pixel (von oben nach unten)


    enum eCONTROL { // Co Continuation bit(7); D/C# Data/Command Selection bit(6); following by six "0"s
        // CONTROL ist immer das 1. Byte im Buffer
        x00_xCom = 0x00, // im selben Buffer folgen nur Command Bytes ohne CONTROL dazwischen
        x80_1Com = 0x80, // im selben Buffer nach jedem Command ein neues CONTROL [0x00 | 0x80 | 0x40]
        x40_Data = 0x40  // im selben Buffer folgen nur Display-Data Bytes ohne CONTROL dazwischen
    }



    // ========== group="OLED Display I²C"

    //% group="OLED Display I²C" color="#007FFF"
    //% block="beim Start %pPages || invert %pInvert drehen %pFlip %pI2C" weight=9
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% inlineInputMode=inline
    export function init(pPages: ePages, pInvert = false, pFlip = false, pI2C = eI2C.I2C_x3C) {
        if (pI2C == eI2C.I2C_x3D) qPages3D = pPages; else qPages3C = pPages
        //if (pI2C) qI2C = pI2C
        let bu: Buffer
        // pro Page einen Buffer(7+128) an Array anfügen (push)
        if (qMatrix.length < pPages) {
            qMatrix = []
            for (let page = 0; page < pPages; page++) { // Page 0..15 oder 0..7
                //basic.showNumber(page)
                bu = Buffer.create(cOffset + cx)
                bu.fill(0)

                // der Anfang vom Buffer 0..6 wird initialisiert und ändert sich nicht mehr; Daten ab Offset 7..135
                // Cursor Positionierung an den Anfang jeder Page
                bu.setUint8(0, eCONTROL.x80_1Com) // CONTROL+1Command
                bu.setUint8(1, 0xB0 | page & 0x0F) // page number 0-7 B0-B7 - beim 128x128 Display 0x0F
                // x (Spalte) 7 Bit 0..127 ist immer 0
                bu.setUint8(2, eCONTROL.x80_1Com) // CONTROL+1Command
                bu.setUint8(3, 0x00) // lower start column address 0x00-0x0F 4 Bit
                bu.setUint8(4, eCONTROL.x80_1Com) // CONTROL+1Command
                bu.setUint8(5, 0x10) // upper start column address 0x10-0x17 3 Bit

                // nach 0x40 folgen die Daten
                bu.setUint8(6, eCONTROL.x40_Data) // CONTROL Byte 0x40: Display Data

                qMatrix.push(bu) // Array aus 8 oder 16 Buffern je 128 Byte
            }
        }

        // Display initialisieren
        let offset = 0
        bu = Buffer.create(7)   // muss Anzahl der folgenden setUint8 entsprechen
        bu.setUint8(offset++, eCONTROL.x00_xCom) // CONTROL Byte 0x00: folgende Bytes (im selben Buffer) sind alle command und kein CONTROL

        bu.setUint8(offset++, 0x8D)  // Set Charge Pump (nur für Yellow&Blue SSD1315 erforderlich)
        bu.setUint8(offset++, 0x14)  //     Charge Pump (0x10 Disable; 0x14 7,5V; 0x94 8,5V; 0x95 9,0V)

        bu.setUint8(offset++, (pFlip ? 0xA1 : 0xA0)) // Set Segment Re-Map default 0xA0
        bu.setUint8(offset++, (pFlip ? 0xC8 : 0xC0)) // Set Com Output Scan Direction default 0xC0

        bu.setUint8(offset++, (pInvert ? 0xA7 : 0xA6))  // Set display not inverted / A6 Normal A7 Inverse display
        bu.setUint8(offset++, 0xAF)  // Set display ON (0xAE sleep mode)

        i2cWriteBuffer(pI2C, bu)
        control.waitMicros(100000) // 100ms Delay Recommended
    }

    //% group="OLED Display I²C" color="#007FFF"
    //% block="Matrix auf Display anzeigen || Zeilen von %fromPage bis %toPage %pI2C" weight=6
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    export function writeDisplay(fromPage = 0, toPage = 15, pI2C = eI2C.I2C_x3C) {
        let lastPage = (pI2C == eI2C.I2C_x3D ? qPages3D : qPages3C) - 1
        fromPage = Math.constrain(fromPage, 0, lastPage)
        toPage = Math.constrain(toPage, fromPage, lastPage)

        //if (fromPage > lastPage) fromPage = lastPage
        //if (toPage > lastPage) toPage = lastPage
       // if (fromPage > toPage) fromPage = toPage

        for (let page = fromPage; page <= toPage; page++) { 
            i2cWriteBuffer(pI2C, qMatrix[page])
            //control.waitMicros(50)
        }
        control.waitMicros(50)
    }





    // ========== group="Matrix (Pixel im Speicher)"


    //% group="Matrix im Speicher"
    //% block="Matrix löschen || Zeilen von %fromPage bis %toPage" weight=9
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% expandableArgumentMode="toggle"
    export function clearMatrix(fromPage = 0, toPage = 15) {
        fromPage = Math.constrain(fromPage, 0, qMatrix.length - 1)
        toPage = Math.constrain(toPage, fromPage, qMatrix.length - 1)

        fillMatrix(fromPage, toPage)
        /* if (fromPage > qArray.length - 1) fromPage = qArray.length - 1
        if (toPage > qArray.length - 1) toPage = qArray.length - 1
        if (fromPage > toPage) fromPage = toPage

        for (let page = fromPage; page <= toPage; page++) { // qArray.length ist die Anzahl der Pages 8 oder 16
            qArray[page].fill(0, cOffset) // löscht Buffer ab 7 bis zum Ende
        } */
    }

    export function fillMatrix(fromPage: number, toPage: number, bu?: Buffer) {
        //if (fromPage > qArray.length - 1) fromPage = qArray.length - 1
       // if (toPage > qArray.length - 1) toPage = qArray.length - 1 // qArray.length ist die Anzahl der Pages 8 oder 16
       // if (fromPage > toPage) fromPage = toPage

        for (let page = fromPage; page <= toPage; page++) {
            if (bu)
                qMatrix[page].write(cOffset, bu) // kopiert bu in eine Zeile der Matrix ab 7
            else
                qMatrix[page].fill(0, cOffset) // löscht eine Zeile der Matrix ab 7 bis zum Ende
        }
    }


    // ========== group="Pixel (Buffer)"
    /* 
        export function writeBuffer(x: number, page: number, srcBuffer: Buffer) {
            qArray[page].write(cOffset + x, srcBuffer)
        }
     */
    // group="Pixel (Buffer)" deprecated=true
    // block weight=9
    /* export function setPixel1(x: number, y: number, bit: boolean) {
        let page = Math.trunc(y / 8) // Page = y / 8
        let exp = y % 8 // Rest von Division durch 8 = Bit 0..7 im Byte
        let bu = qArray[page] // 1 Buffer von 16 aus dem Array
        let byte = bu[x] // 1 Byte von 128 aus dem Buffer
        if (bit)
            bu[cOffset + x] |= (2 ** exp)
        else
            bu[cOffset + x] &= ~(2 ** exp)
    } */

    //% group="Matrix im Speicher"
    //% block="set Pixel x %x y %y %pixel" weight=8
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    export function setPixel(x: number, y: number, pixel: boolean) {
        if (between(x, 0, cx - 1) && between(y, 0, qMatrix.length * 8 - 1)) {
            let exp = y & 7 // bitwise AND letze 3 Bit = 0..7
            if (pixel)
                qMatrix[y >> 3][cOffset + x] |= (2 ** exp) // um 3 Bit nach rechts entspricht Division durch 8
            else
                qMatrix[y >> 3][cOffset + x] &= ~(2 ** exp)
        }
    }

    //% group="Matrix im Speicher"
    //% block="get Pixel x %x y %y" weight=7
    export function getPixel(x: number, y: number) {
        return (qMatrix[y >> 3][cOffset + x] & (2 ** (y & 7))) != 0
    }



    //% group="Matrix im Speicher"
    //% block="Linie von x %x0 y %y0 bis x %x1 y %y1 || Pixel %pixel" weight=3
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function line(x0: number, y0: number, x1: number, y1: number, pixel?: boolean) {
        x0 = Math.round(x0)
        y0 = Math.round(y0)
        x1 = Math.round(x1)
        y1 = Math.round(y1)

        // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
        let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
        let err = dx + dy, e2; // error value e_xy

        while (true) {
            setPixel(x0, y0, pixel)
            if (x0 == x1 && y0 == y1) break;
            e2 = 2 * err;
            if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
            if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
        }
    }

    //% group="Matrix im Speicher"
    //% block="Kreis Mittelpunkt x %x0 y %y0 Radius %radius || Pixel %pixel" weight=2
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function rasterCircle(x0: number, y0: number, radius: number, pixel?: boolean) {
        x0 = Math.round(x0)
        y0 = Math.round(y0)
        radius = Math.round(radius)

        // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
        let f = 1 - radius;
        let ddF_x = 0;
        let ddF_y = -2 * radius;
        let x = 0;
        let y = radius;

        setPixel(x0, y0 + radius, pixel);
        setPixel(x0, y0 - radius, pixel);
        setPixel(x0 + radius, y0, pixel);
        setPixel(x0 - radius, y0, pixel);

        while (x < y) {
            if (f >= 0) {
                y -= 1;
                ddF_y += 2;
                f += ddF_y;
            }
            x += 1;
            ddF_x += 2;
            f += ddF_x + 1;

            setPixel(x0 + x, y0 + y, pixel);
            setPixel(x0 - x, y0 + y, pixel);
            setPixel(x0 + x, y0 - y, pixel);
            setPixel(x0 - x, y0 - y, pixel);
            setPixel(x0 + y, y0 + x, pixel);
            setPixel(x0 - y, y0 + x, pixel);
            setPixel(x0 + y, y0 - x, pixel);
            setPixel(x0 - y, y0 - x, pixel);
        }
    }

    /*
    
    
        // ========== group="Array: Buffer[]" advanced=true
    
        //% group="Array: Buffer[]" advanced=true
        //% block
        export function getArray() { return qArray }
    
    
        // ========== group="Logik (boolean)" advanced=true
    
        //% group="Logik (boolean)" advanced=true
        //% block="%i0 zwischen %i1 und %i2"
        export function between(i0: number, i1: number, i2: number): boolean {
            return (i0 >= i1 && i0 <= i2)
        }
    
        //% block="π" advanced=true
        export function pi() { return Math.PI }
    
        //% group="Text // Kommentar" advanced=true
        //% block="// %text"
        export function comment(text: string): void { }
    
    
        //% blockId=matrix_charCodeAt
        //% group="Zahl (number)" advanced=true
        //% block="charCodeAt %text index %index" weight=6
        export function charCodeAt(text: string, index: number) {
            return text.charCodeAt(index)
        } */

} // matrix.ts
