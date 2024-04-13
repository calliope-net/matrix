
namespace matrix { // eeprom.ts
    // ========== I²C ==========
    export enum eI2Ceeprom { EEPROM_x50 = 0x50 }
    export enum eEEPROM_Startadresse { F800 = 0xF800, FC00 = 0xFC00, F000 = 0xF000, F400 = 0xF400 }

    //% blockId=matrix_eEEPROM_Startadresse block="%p" blockHidden=true
    export function matrix_eEEPROM_Startadresse(p: eEEPROM_Startadresse): number { return p }

    // I2C EEPROM nur lesen -> in Buffer
    function i2cReadEEPROM(eeprom_location: number, size: number, i2c = eI2Ceeprom.EEPROM_x50): Buffer {
        if (between(eeprom_location, 0, 65536 - size)) {
            let bu = Buffer.create(2)
            bu.setNumber(NumberFormat.UInt16BE, 0, eeprom_location)
            pins.i2cWriteBuffer(i2c, bu, true) // sendet 2 Byte 16 Bit Adresse
            return pins.i2cReadBuffer(i2c, size) // empfängt die Daten
        }
        else
            return Buffer.create(size)
    }



    //% group="Text in Matrix zeichnen (Zeichensatz aus EEPROM)" color="#FF7F3F" subcategory="EEPROM"
    //% block="Text Zeile %row von %col bis %end %text || %align Abstand x %dx y %dy %ut x %fx y %fy %eepromStartadresse %i2c" weight=7
    //% row.min=0 row.max=15 col.min=0 col.max=24 end.min=0 end.max=24 end.defl=15
    //% text.shadow="matrix_text"
    //% dx.min=-25 dx.max=25 dx.defl=8 dy.min=-25 dy.max=25 dy.defl=0
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% inlineInputMode=inline
    export function writeEEPROM(row: number, col: number, end: number, text: any, align = eAlign.links, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number, eepromStartadresse?: number, i2c = eI2Ceeprom.EEPROM_x50) {
        if (!eepromStartadresse) eepromStartadresse = eEEPROM_Startadresse.F800
        let len = end - col + 1
        if (between(row, 0, qMatrix.length - 1) && between(col, 0, 24) && between(len, 0, 25)) {
            let txt = formatText(text, len, align)
            for (let j = 0; j < txt.length; j++) {
                writeImage(get5x8EEPROMImage(txt.charCodeAt(j), eepromStartadresse, i2c), col * 8 + j * dx, row * 8 + j * dy, ut, fx, fy)
            }
        }
    }





    // ========== group="Bild aus EEPROM in Matrix zeichnen" color="#FF7F3F" subcategory="EEPROM"

    //% group="Bild aus EEPROM in Matrix zeichnen (128 Byte pro Zeile)" color="#FF7F3F" subcategory="EEPROM"
    //% block="zeichne aus EEPROM %eepromStartadresse || Zeilen %fromPage - %toPage %i2c"
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=7
    //% inlineInputMode=inline
    // expandableArgumentMode="toggle"
    export function paintEEPROM(eepromStartadresse: number, fromPage = 0, toPage = 15, i2c = eI2Ceeprom.EEPROM_x50) {
        fromPage = Math.constrain(fromPage, 0, qMatrix.length - 1) // qMatrix.length ist die Anzahl der Pages 8 oder 16
        toPage = Math.constrain(toPage, fromPage, qMatrix.length - 1)

        for (let page = fromPage; page <= toPage; page++) {
            fillMatrix(page, page, i2cReadEEPROM(eepromStartadresse + (page - fromPage) * 128, 128, i2c))
        }
    }


    //% group="EEPROM aus Matrix brennen" color="#FF7F3F" subcategory="EEPROM"
    //% block="programmiere EEPROM HEX %hex Zeilen %fromPage - %toPage Bytes %length Code %code || %i2c"
    //% hex.defl="F800"
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=0
    //% inlineInputMode=inline
    export function burnEEPROM(hex: string, fromPage: number, toPage: number, length: number, code: number, i2c = eI2Ceeprom.EEPROM_x50) {
        let a0 = Buffer.fromHex(hex).getNumber(NumberFormat.UInt16BE, 0) // code muss der Dezimalwert von hex sein
        if (between(a0, 0, 65407) && a0 % 128 == 0 && a0 == code && between(length, 1, 128) && between(fromPage, 0, qMatrix.length - 1) && between(toPage, fromPage, qMatrix.length - 1)) {
            let bu = Buffer.create(2 + length) // 2 Byte 16 Bit Adresse, dann die Daten Byte (length)
            for (let page = fromPage; page <= toPage; page++) { // page ist in der Matrix 8 Pixel hoch (y) und 128 Pixel breit (x)
                bu.setNumber(NumberFormat.UInt16BE, 0, a0 + (page - fromPage) * 128) // EEPROM Startadresse 16 Bit
                bu.write(2, qMatrix[page].slice(cOffset, length)) // holt aus Matrix von links (x=0) 1 bis 128 Byte (length)
                if (pins.i2cWriteBuffer(i2c, bu) != 0) { // schreibt diese Bytes ab Startadresse in EEPROM
                    basic.showNumber(i2c) // bei I²C Fehler die I²C Adresse anzeigen
                    return false // und Abbruch
                }
            }
            return true // erfolgreich programmiert
        } else
            return false // nicht programmiert, weil nicht alle Bedingungen erfüllt
    }


    //% group="EEPROM Leer Test" color="#FF7F3F" subcategory="EEPROM"
    //% block="vergleiche 128 Byte ab %eepromStartadresse mit Byte %byte || %i2c"
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% inlineInputMode=inline
    export function checkEEPROM(eepromStartadresse: number, byte: number, i2c = eI2Ceeprom.EEPROM_x50) {
        let count = 0
        let bu = i2cReadEEPROM(eepromStartadresse, 128, i2c)
        for (let off = 0; off < bu.length; off++) {
            if (bu.getUint8(off) == byte)
                count++
        }
        return count
    }


    //% group="Bild 5x8 aus Text Zeichen" color="#FF7F3F" subcategory="EEPROM"
    //% block="Bild aus ASCII-Code (EEPROM) %charCode || %eepromStartadresse %i2c" weight=4
    //% charCode.min=32 charCode.max=127 charCode.defl=48
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% blockSetVariable=bild
    export function get5x8EEPROMImage(charCode: number, eepromStartadresse?: number, i2c = eI2Ceeprom.EEPROM_x50): Image {
        if (!eepromStartadresse) eepromStartadresse = eEEPROM_Startadresse.F800
        let bu = i2cReadEEPROM(eepromStartadresse + charCode * 8, 8, i2c)
        return image5x8fromString(bu.toString().substr(1, 5))
    }

    //% group="Test Funktionen" color="#FF7F3F" subcategory="EEPROM"
    //% block="zeichne alle Text-Zeichen vom EEPROM in Matrix"
    export function writeCharsetEEPROM() {
        // charCode 0..127 in Matrix Zeilen 0..7
        let images: Image[] = []
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 15; j++)
                writeImage(get5x8EEPROMImage(i * 16 + j), 1 + j * 8, i * 8)
            // images.push(get5x8EEPROMImage(i * 16 + j))
            //  writeImageArray(images, 1, i * 8, 8)
        }
        // charCode ab 128 in Matrix Zeilen 8..15 (nur im 128x128 Display zu sehen)
        let s = "ÄÖÜäöüß€°" // C4 D6 DC E4 F6 FC DF (20)AC B0
        let charCode: number
        for (let j = 0; j < s.length; j++) {
            charCode = s.charCodeAt(j)
            writeImage(get5x8EEPROMImage(charCode), 1 + (charCode & 0x0F) * 8, (charCode & 0xF0) >>> 1) // y Bit 7654 * 8 = /2 = 1 Bit nach rechts
        }
    }


} // eeprom.ts
