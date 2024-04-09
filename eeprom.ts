
namespace matrix { // eeprom.ts
    // ========== I²C ==========
    export enum eI2Ceeprom { EEPROM_x50 = 0x50 }
    export enum eEEPROM_Startadresse { F800 = 0xF800, FC00 = 0xFC00, F000 = 0xF000, F400 = 0xF400 }

    //% blockId=matrix_eEEPROM_Startadresse block="%p" blockHidden=true
    export function matrix_eEEPROM_Startadresse(p: eEEPROM_Startadresse): number { return p }

    // EEPROM nur lesen
    function i2cReadEEPROM(eeprom_location: number, size: number, pI2C = eI2Ceeprom.EEPROM_x50): Buffer {
        if (between(eeprom_location, 0, 0xFFFF - size)) {
            let bu = Buffer.create(2)
            bu.setNumber(NumberFormat.UInt16BE, 0, eeprom_location)
            pins.i2cWriteBuffer(pI2C, bu, true)
            return pins.i2cReadBuffer(pI2C, size)
        }
        else
            return Buffer.create(size)
    }



    // ========== group="Bild aus EEPROM in Matrix zeichnen" color="#FF7F3F" subcategory="EEPROM"

    //% group="Bild aus EEPROM in Matrix zeichnen" color="#FF7F3F" subcategory="EEPROM"
    //% block="zeichne aus EEPROM %pEEPROM_Startadresse || Zeilen von %fromPage bis %toPage %pI2C"
    //% pEEPROM_Startadresse.shadow="matrix_eEEPROM_Startadresse"
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=7
    //% inlineInputMode=inline
    // expandableArgumentMode="toggle"
    export function paintEEPROM(pEEPROM_Startadresse: number, fromPage = 0, toPage = 15, pI2C = eI2Ceeprom.EEPROM_x50) {
        fromPage = Math.constrain(fromPage, 0, qMatrix.length - 1)
        toPage = Math.constrain(toPage, fromPage, qMatrix.length - 1)
        //if (fromPage > qArray.length - 1) fromPage = qArray.length - 1
        //if (toPage > qArray.length - 1) toPage = qArray.length - 1
        //if (fromPage > toPage) fromPage = toPage
        //let i = 0
        for (let page = fromPage; page <= toPage; page++) { // qArray.length ist die Anzahl der Pages 8 oder 16
            fillMatrix(page, page, i2cReadEEPROM(pEEPROM_Startadresse + (page - fromPage) * 128, 128, pI2C))
            // qArray[page].write(cOffset, i2cReadEEPROM(pEEPROM_Startadresse + (page - fromPage) * 128, 128, pI2C))
        }
    }


    //% group="EEPROM aus Matrix brennen" color="#FF7F3F" subcategory="EEPROM"
    //% block="programmiere EEPROM HEX %hex Zeilen %fromPage - %toPage Bytes %length Code %code || %pI2C"
    //% hex.defl="F800"
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=0
    //% inlineInputMode=inline
    export function burnEEPROM(hex: string, fromPage: number, toPage: number, length: number, code: number, pI2C = eI2Ceeprom.EEPROM_x50) {
        // let buEEPROM_Startadresse = Buffer.fromHex(hex)
        let a0 = Buffer.fromHex(hex).getNumber(NumberFormat.UInt16BE, 0)
        if (between(a0, 0, 65407) && a0 % 128 == 0 && a0 == code && between(length, 1, 128) && between(fromPage, 0, qMatrix.length - 1) && between(toPage, fromPage, qMatrix.length - 1)) {
            let bu = Buffer.create(2 + length)
            for (let page = fromPage; page <= toPage; page++) {
                bu.setNumber(NumberFormat.UInt16BE, 0, a0 + (page - fromPage) * 128)
                bu.write(2, qMatrix[page].slice(cOffset, length))
                if (pins.i2cWriteBuffer(pI2C, bu) != 0) {
                    basic.showNumber(pI2C)
                    return false
                }
            }
            return true
        } else
            return false
    }


    //% group="EEPROM Leer Test" color="#FF7F3F" subcategory="EEPROM"
    //% block="teste 128 Byte EEPROM %pEEPROM_Startadresse Byte %byte || %pI2C"
    //% pEEPROM_Startadresse.shadow="matrix_eEEPROM_Startadresse"
    //% inlineInputMode=inline
    export function checkEEPROM(pEEPROM_Startadresse: number, byte: number, pI2C = eI2Ceeprom.EEPROM_x50) {
        //  let a0 = Buffer.fromHex(hex).getNumber(NumberFormat.UInt16BE, 0)
        let count = 0
        let bu = i2cReadEEPROM(pEEPROM_Startadresse, 128, pI2C)
        for (let off = 0; off < bu.length; off++) {
            if (bu.getUint8(off) != byte)
                count++
        }
        return count
    }


    //% group="Bild 5x8 aus Text Zeichen" subcategory="EEPROM"
    //% block="Bild aus ASCII-Code (EEPROM) %charCode %pEEPROM_Startadresse || %pI2C" weight=4
    //% charCode.min=32 charCode.max=127 charCode.defl=48
    //% pEEPROM_Startadresse.shadow="matrix_eEEPROM_Startadresse"
    //% blockSetVariable=bild
    export function eepromImage(charCode: number, pEEPROM_Startadresse: number, pI2C = eI2Ceeprom.EEPROM_x50): Image {

        let bu = i2cReadEEPROM(pEEPROM_Startadresse + charCode * 8, 8, pI2C)

        return image5x8fromString(bu.toString().substr(1, 5))
    }

} // eeprom.ts
