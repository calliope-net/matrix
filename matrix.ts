
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
    export let qChangedPages: boolean[] = []

    export enum ePages {
        //% block="128x64"
        y64 = 8,
        //% block="128x128"
        y128 = 16
    }

    // 6 Bytes zur Cursor Positionierung vor den Daten + 1 Byte 0x40 Display Data
    export const cOffset = 7 // Platz am Anfang des Buffer bevor die cx Pixel kommen

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



    // ========== group="Hilfe: calliope-net.github.io/matrix" color="#007FFF"

    //% group="Hilfe: calliope-net.github.io/matrix" color="#007FFF"
    //% block="I²C beim Start %pPages || invert %pInvert drehen %pFlip %i2c" weight=9
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% inlineInputMode=inline
    export function init(pPages: ePages, pInvert = false, pFlip = false, i2c = eI2C.I2C_x3C) {
        if (i2c == eI2C.I2C_x3D) qPages3D = pPages; else qPages3C = pPages
        //if (pI2C) qI2C = pI2C
        let bu: Buffer
        // pro Page einen Buffer(7+128) an Array anfügen (push)
        if (qMatrix.length < pPages) {
            qMatrix = []
            qChangedPages = []
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
                qChangedPages.push(false)
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

        i2cWriteBuffer(i2c, bu)
        control.waitMicros(100000) // 100ms Delay Recommended
    }

    //% group="calliope-net.github.io/matrix" color="#007FFF"
    //% block="I²C Matrix auf Display anzeigen (depecated) || Zeilen von %fromPage bis %toPage %pI2C" deprecated=true
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    export function writeDisplay(fromPage = 0, toPage = 15, pI2C = eI2C.I2C_x3C) {
        displayMatrix(fromPage, toPage, pI2C) //deprecated=true
    }

    //% group="Hilfe: calliope-net.github.io/matrix" color="#007FFF"
    //% block="I²C Matrix auf Display anzeigen || Zeilen %fromPage - %toPage %i2c" weight=6
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    export function displayMatrix(fromPage = 0, toPage = 15, i2c = eI2C.I2C_x3C) {
        let lastPage = (i2c == eI2C.I2C_x3D ? qPages3D : qPages3C) - 1
        fromPage = Math.constrain(fromPage, 0, lastPage)
        toPage = Math.constrain(toPage, fromPage, lastPage)

        for (let page = fromPage; page <= toPage; page++) {
            i2cWriteBuffer(i2c, qMatrix[page])
            qChangedPages[page] = false
            //control.waitMicros(50)
        }
        control.waitMicros(50)
    }



    // ========== group="Hilfe: calliope-net.github.io/matrix" color="#007FFF" advanced=true

    //% group="Hilfe: calliope-net.github.io/matrix" color="#007FFF" advanced=true
    //% block="I²C in Matrix geänderte Zeilen auf Display anzeigen || %i2c" weight=5
    export function displayMatrixChangedPages(i2c = eI2C.I2C_x3C) {
        for (let page = 0; page < (i2c == eI2C.I2C_x3D ? qPages3D : qPages3C); page++) {
            if (qChangedPages[page]) {
                i2cWriteBuffer(i2c, qMatrix[page])
                qChangedPages[page] = false
            }
        }
        control.waitMicros(50)
    }



    // ========== group="Matrix: für Pixel reservierter RAM" advanced=true

    //% group="Matrix: für Pixel reservierter RAM" advanced=true
    //% block="in Matrix geänderte Zeilen löschen" weight=4
    export function clearMatrixChangedPages() {
        for (let page = 0; page <= qMatrix.length - 1; page++) {
            if (qChangedPages[page]) { // löscht eine geänderte Zeile der Matrix nur im Buffer ab offset 7 bis zum Ende
                qMatrix[page].fill(0, cOffset)
                // qChangedPages[page] = true
            }
        }
    }



    // ========== group="Matrix: für Pixel reservierter RAM"

    //% group="Matrix: für Pixel reservierter RAM"
    //% block="Matrix löschen || Zeilen von %fromPage bis %toPage" weight=9
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% expandableArgumentMode="toggle"
    export function clearMatrix(fromPage = 0, toPage = 15) {
        fromPage = Math.constrain(fromPage, 0, qMatrix.length - 1)
        toPage = Math.constrain(toPage, fromPage, qMatrix.length - 1)
        for (let page = fromPage; page <= toPage; page++) { // löscht eine Zeile der Matrix nur im Buffer ab offset 7 bis zum Ende
            qMatrix[page].fill(0, cOffset)
            qChangedPages[page] = true
        }
    }

    //% group="Matrix: für Pixel reservierter RAM"
    //% block="set Pixel x %x y %y %pixel || debug %debug" weight=8
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% debug.shadow="toggleOnOff"
    //% inlineInputMode=inline
    export function setPixel(x: number, y: number, pixel: boolean, debug = false) {
        x = Math.trunc(x)
        y = Math.trunc(y)
        if (between(x, 0, cx - 1) && between(y, 0, qMatrix.length * 8 - 1)) {
            let page = y >> 3 // um 3 Bit nach rechts entspricht Division durch 8
            let exp = y & 7 // bitwise AND letze 3 Bit = 0..7
            if (pixel)
                qMatrix[page][cOffset + x] |= (2 ** exp)
            else
                qMatrix[page][cOffset + x] &= ~(2 ** exp)
            qChangedPages[page] = true
        }
        else if (debug && !between(x, 0, cx - 1)) {
            basic.showString("x " + x)
        }
        else if (debug && !between(y, 0, qMatrix.length * 8 - 1)) {
            basic.showString("y " + y)
        }
    }

    //% group="Matrix: für Pixel reservierter RAM"
    //% block="get Pixel x %x y %y" weight=7
    export function getPixel(x: number, y: number) {
        return (qMatrix[y >> 3][cOffset + x] & (2 ** (y & 7))) != 0
    }




    // ========== group="Text in Matrix zeichnen"

    //% group="Text in Matrix zeichnen"
    //% block="Zahl/Zeit Zeile %row Spalte %col %text || Abstand x %dx y %dy %ut x %fx y %fy" weight=8
    //% row.min=0 row.max=15 col.min=0 col.max=24
    //% text.shadow="matrix_text"
    //% dx.min=-25 dx.max=25 dx.defl=8 dy.min=-25 dy.max=25 dy.defl=0
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% inlineInputMode=inline
    export function writeDigits(row: number, col: number, text: any, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        // let len = end - col + 1
        if (between(row, 0, qMatrix.length - 1) && between(col, 0, 24)) {
            let txt = convertToText(text)// formatText(text, len, align)
            for (let j = 0; j < txt.length; j++) {
                writeImage(get5x8DigitImage(txt.charCodeAt(j)), col * 8 + j * dx, row * 8 + j * dy, ut, fx, fy)
            }
        }
    }



    //% group="lila Blöcke brauchen viel Programmspeicher" color="#7E84F7"
    //% block="Text Zeile %row Spalte %col %text || Abstand x %dx y %dy %ut x %fx y %fy" weight=7
    //% row.min=0 row.max=15 col.min=0 col.max=24
    //% text.shadow="matrix_text"
    //% dx.min=-25 dx.max=25 dx.defl=8 dy.min=-25 dy.max=25 dy.defl=0
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% inlineInputMode=inline
    export function writeTextCharset(row: number, col: number, text: any, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        // let len = end - col + 1
        if (between(row, 0, qMatrix.length - 1) && between(col, 0, 24)) {
            let txt = convertToText(text)// formatText(text, len, align)
            for (let j = 0; j < txt.length; j++)
                writeImage(get5x8CharImage(txt.charCodeAt(j)), col * 8 + j * dx, row * 8 + j * dy, ut, fx, fy)
        }
    }

} // matrix.ts
