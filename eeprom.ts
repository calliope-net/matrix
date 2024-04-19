
namespace matrix { // eeprom.ts
    // ========== I²C ==========
    export enum eI2Ceeprom { EEPROM_x50 = 0x50 }
    export enum eEEPROM_Startadresse { F800 = 0xF800, FC00 = 0xFC00, F000 = 0xF000, F400 = 0xF400 }

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
    //% block="Text Zeile %row Spalte %col %text || Abstand x %dx y %dy %ut x %fx y %fy %eepromStartadresse %i2c" weight=7
    //% row.min=0 row.max=15 col.min=0 col.max=24
    //% text.shadow="matrix_text"
    //% dx.min=-25 dx.max=25 dx.defl=8 dy.min=-25 dy.max=25 dy.defl=0
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% inlineInputMode=inline
    export function writeTextEEPROM(row: number, col: number, text: any, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number, eepromStartadresse?: number, i2c = eI2Ceeprom.EEPROM_x50) {
        if (!eepromStartadresse) eepromStartadresse = eEEPROM_Startadresse.F800

        if (between(row, 0, qMatrix.length - 1) && between(col, 0, 24)) {
            let txt = convertToText(text)
            for (let j = 0; j < txt.length; j++) {
                writeImage(get8x8EEPROMImage(txt.charCodeAt(j), eepromStartadresse, i2c), col * 8 + j * dx, row * 8 + j * dy, ut, fx, fy)
            }
        }
    }



    //% group="Text in Bilder 8x8 umwandeln" color="#FF7F3F" subcategory="EEPROM"
    //% block="Image[] füllen aus Text %text || %eepromStartadresse %i2c" weight=5
    //% text.shadow="matrix_text"
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% inlineInputMode=inline
    export function imageArrayEEPROM(text: any, eepromStartadresse?: number, i2c = eI2Ceeprom.EEPROM_x50) {
        if (!eepromStartadresse) eepromStartadresse = eEEPROM_Startadresse.F800
        let txt = convertToText(text)

        clearImages()
        for (let j = 0; j < txt.length; j++) {
            pushImage(get8x8EEPROMImage(txt.charCodeAt(j), eepromStartadresse, i2c))
        }
    }


    //% group="Text in Bilder 8x8 umwandeln" color="#FF7F3F" subcategory="EEPROM"
    //% block="Bild aus ASCII-Code %charCode || %eepromStartadresse %i2c" weight=4
    //% charCode.min=32 charCode.max=127 charCode.defl=48
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% blockSetVariable=bild
    export function get8x8EEPROMImage(charCode: number, eepromStartadresse?: number, i2c = eI2Ceeprom.EEPROM_x50): Image {
        if (!eepromStartadresse) eepromStartadresse = eEEPROM_Startadresse.F800
        return image8x8fromBuffer(i2cReadEEPROM(eepromStartadresse + charCode * 8, 8, i2c))
    }


    /* export function get5x8EEPROMImage(charCode: number, eepromStartadresse?: number, i2c = eI2Ceeprom.EEPROM_x50): Image {
        if (!eepromStartadresse) eepromStartadresse = eEEPROM_Startadresse.F800
        let bu = i2cReadEEPROM(eepromStartadresse + charCode * 8 + 1, 5, i2c)
        return image5x8fromString(bu.toString())
        //let bu = i2cReadEEPROM(eepromStartadresse + charCode * 8, 8, i2c)
        //return image5x8fromString(bu.toString().substr(1, 5))
    } */




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

        for (let page = fromPage; page <= toPage; page++) {// kopiert bu in eine Zeile der Matrix ab 7
            qMatrix[page].write(cOffset, i2cReadEEPROM(eepromStartadresse + (page - fromPage) * 128, 128, i2c))
            qChangedPages[page] = true
        }
        //fillMatrix(page, page, i2cReadEEPROM(eepromStartadresse + (page - fromPage) * 128, 128, i2c))
    }



    // ========== group="Test Funktionen" color="#FF7F3F" subcategory="EEPROM"

    //% group="Test Funktionen" color="#FF7F3F" subcategory="EEPROM"
    //% block="zeichne alle Text-Zeichen vom EEPROM in Matrix" weight=5
    export function writeCharsetEEPROM() {
        // charCode 0..127 in Matrix Zeilen 0..7
        for (let y = 0; y <= 7; y++)
            for (let x = 0; x <= 15; x++) {
                writeImage(get8x8EEPROMImage(y * 16 + x), x * 8, y * 8)
                //writeImage(get5x8EEPROMImage(y * 16 + x), 1 + x * 8, y * 8)
            }

        // charCode ab 128 in Matrix Zeilen 8..15 (nur im 128x128 Display zu sehen)
        let s = "ÄÖÜäöüß€°" // C4 D6 DC E4 F6 FC DF (20)AC B0
        let charCode: number
        for (let j = 0; j < s.length; j++) {
            charCode = s.charCodeAt(j)
            writeImage(get8x8EEPROMImage(charCode), (charCode & 0x0F) * 8, (charCode & 0xF0) >>> 1) // y Bit 7654 * 8 = /2 = 1 Bit nach rechts
            //writeImage(get5x8EEPROMImage(charCode), 1 + (charCode & 0x0F) * 8, (charCode & 0xF0) >>> 1) // y Bit 7654 * 8 = /2 = 1 Bit nach rechts
        }
    }

    //% group="Test Funktionen" color="#FF7F3F" subcategory="EEPROM"
    //% block="vergleiche 128 Byte ab %eepromStartadresse mit Byte %byte || %i2c" weight=4
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

    //% blockId=matrix_eEEPROM_Startadresse 
    //% group="Test Funktionen" color="#FF7F3F" subcategory="EEPROM"
    //% block="%p" weight=3
    export function matrix_eEEPROM_Startadresse(p: eEEPROM_Startadresse): number { return p }



    // ========== group="Zeilen aus Matrix auf EEPROM speichern" color="#FF7F3F" subcategory="EEPROM"

    //% group="Zeilen aus Matrix auf EEPROM speichern" color="#FF7F3F" subcategory="EEPROM"
    //% block="EEPROM ab %hex Zeilen %fromPage - %toPage Bytes %length Code %code || %i2c"
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



    // ==========  group="EEPROM schreiben und lesen" color="#FF7F3F" subcategory="EEPROM"

    //% group="EEPROM schreiben und lesen" color="#FF7F3F" subcategory="EEPROM"
    //% block="EEPROM 1 Byte schreiben Adresse %adr Byte %byte || %i2c"
    //% byte.min=0 byte.max=255
    export function progEEPROM(adr: number, byte: number, i2c = eI2Ceeprom.EEPROM_x50) {
        let bu = Buffer.create(3)
        bu.setNumber(NumberFormat.UInt16BE, 0, adr)
        bu.setUint8(2, byte)
        if (pins.i2cWriteBuffer(i2c, bu) != 0) { // schreibt diese Bytes ab Startadresse in EEPROM
            basic.showNumber(i2c) // bei I²C Fehler die I²C Adresse anzeigen
            return false // und Abbruch
        } else
            return true
    }

    //% group="EEPROM schreiben und lesen" color="#FF7F3F" subcategory="EEPROM"
    //% block="EEPROM 1 Byte lesen Adresse %adr || %i2c"
    export function readEEPROM(adr: number, i2c = eI2Ceeprom.EEPROM_x50) {
        return i2cReadEEPROM(adr, 1, i2c).getUint8(0)
    }

} // eeprom.ts
