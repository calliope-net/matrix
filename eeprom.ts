
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



    // ========== group="EEPROM in Matrix zeichnen" color="#FF7F3F" subcategory="EEPROM"

    //% group="EEPROM in Matrix zeichnen" color="#FF7F3F" subcategory="EEPROM"
    //% block="zeichne aus EEPROM %pEEPROM_Startadresse || Zeilen von %fromPage bis %toPage %pI2C"
    //% pEEPROM_Startadresse.shadow="matrix_eEEPROM_Startadresse"
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=7
    //% inlineInputMode=inline
    // expandableArgumentMode="toggle"
    export function fillScreen(pEEPROM_Startadresse: number, fromPage = 0, toPage = 15, pI2C = eI2Ceeprom.EEPROM_x50) {

        if (fromPage > qArray.length - 1) fromPage = qArray.length - 1
        if (toPage > qArray.length - 1) toPage = qArray.length - 1
        if (fromPage > toPage) fromPage = toPage
        //let i = 0
        for (let page = fromPage; page <= toPage; page++) { // qArray.length ist die Anzahl der Pages 8 oder 16
            qArray[page].write(cOffset, i2cReadEEPROM(pEEPROM_Startadresse + (page - fromPage) * 128, 128, pI2C))
        }


        // if (between(vonZeile, 0, 7) && between(bisZeile, 0, 7)) {
        /*     let buEEPROM = i2cReadEEPROM(pEEPROM_Startadresse,128)
 
            //  let buDisplay = Buffer.create(135)
            //   let offsetDisplay = this.setCursorBuffer6(buDisplay, 0, 0, 0)
            //   buDisplay.setUint8(offsetDisplay++, eCONTROL.x40_Data) // CONTROL+DisplayData
 
            for (let page = vonZeile; page <= bisZeile; page++) {
 
                buEEPROM.setNumber(NumberFormat.UInt16BE, 0, pEEPROM_Startadresse + page * 128)
 
                buDisplay.setUint8(1, 0xB0 | page) // an offset=1 steht die page number (Zeile 0-7)
                //offsetDisplay = 7 // offset 7-135 sind 128 Byte für die Pixel in einer Zeile
 
                this.i2cWriteBuffer_EEPROM(buEEPROM)
 
                buDisplay.write(7, this.i2cReadBuffer_EEPROM(128))
                
                this.i2cWriteBuffer_OLED(buDisplay)
            } */
        // }
    }


    //% group="Bild 5x8 aus Text Zeichen" subcategory="EEPROM"
    //% block="Bild aus ASCII-Code (EEPROM) %charCode" weight=4
    //% charCode.min=32 charCode.max=127 charCode.defl=48
    //% blockSetVariable=bild
    export function eepromImage(charCode: number): Image {
        return get5x8CharImage(charCode)
        //return bufferImage5x8(getUTF8_5x8(charCode))
    }

} // eeprom.ts
