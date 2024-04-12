
namespace matrix { // eeprom.ts
    // ========== I²C ==========
    export enum eI2Ceeprom { EEPROM_x50 = 0x50 }
    export enum eEEPROM_Startadresse { F800 = 0xF800, FC00 = 0xFC00, F000 = 0xF000, F400 = 0xF400 }

    //% blockId=matrix_eEEPROM_Startadresse block="%p" blockHidden=true
    export function matrix_eEEPROM_Startadresse(p: eEEPROM_Startadresse): number { return p }

    // I2C EEPROM nur lesen -> in Buffer
    function i2cReadEEPROM(eeprom_location: number, size: number, i2c = eI2Ceeprom.EEPROM_x50): Buffer {
        if (between(eeprom_location, 0, 0xFFFF - size)) {
            let bu = Buffer.create(2)
            bu.setNumber(NumberFormat.UInt16BE, 0, eeprom_location)
            pins.i2cWriteBuffer(i2c, bu, true) // sendet 2 Byte 16 Bit Adresse
            return pins.i2cReadBuffer(i2c, size) // empfängt die Daten
        }
        else
            return Buffer.create(size)
    }



    // ========== group="Bild aus EEPROM in Matrix zeichnen" color="#FF7F3F" subcategory="EEPROM"

    //% group="Bild aus EEPROM in Matrix zeichnen (128 Byte pro Zeile)" color="#FF7F3F" subcategory="EEPROM"
    //% block="zeichne aus EEPROM %eepromStartadresse || Zeilen von %fromPage bis %toPage %i2c"
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
    //% block="vergleiche 128 Byte ab %pEEPROM_Startadresse mit Byte %byte || %i2c"
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


    //% group="Bild 5x8 aus Text Zeichen" subcategory="EEPROM"
    //% block="Bild aus ASCII-Code (EEPROM) %charCode %pEEPROM_Startadresse || %i2c" weight=4
    //% charCode.min=32 charCode.max=127 charCode.defl=48
    //% eepromStartadresse.shadow="matrix_eEEPROM_Startadresse"
    //% blockSetVariable=bild
    export function eepromImage(charCode: number, eepromStartadresse: number, i2c = eI2Ceeprom.EEPROM_x50): Image {

        let bu = i2cReadEEPROM(eepromStartadresse + charCode * 8, 8, i2c)

        return image5x8fromString(bu.toString().substr(1, 5))
    }

} // eeprom.ts
