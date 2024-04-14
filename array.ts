
namespace matrix { // array.ts

    let qImages: Image[] = [] // leeres Array Elemente Typ Image

    //% blockId=matrix_Images
    //% block="Image[]" blockHidden=true
    export function matrix_Images() { return qImages }


    //% group="Hilfe: calliope-net.github.io/matrix" color="#007FFF" subcategory="Bilder Array"
    //% block="I²C Animation auf Display anzeigen %im x %x y %y || x %fx y %fy Pause(ms) %ms Zeilen %fromPage-%toPage %i2c" weight=6
    //% im.shadow=matrix_Images
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% ms.shadow=timePicker
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% inlineInputMode=inline
    // expandableArgumentMode="toggle"
    export function displayAnimation(im: Image[], x: number, y: number, fx = 1, fy?: number, ms = 200, fromPage = 0, toPage = 15, i2c = eI2C.I2C_x3C) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x, y, eTransparent.u, fx, fy)
            writeDisplay(fromPage, toPage, i2c)
            basic.pause(ms)
        }
    }




    //% group="Image[]: Array für Bilder" subcategory="Bilder Array"
    //% block="Image[] löschen" weight=9
    export function clearImages() { qImages = [] }

    //% group="Image[]: Array für Bilder" subcategory="Bilder Array"
    //% block="Image[] Länge" weight=6
    export function lengthImages() { return qImages.length }

    //% group="Image[]: Array für Bilder" subcategory="Bilder Array"
    //% block="Image[] anhängen %im" weight=4
    export function pushImage(im: Image) { qImages.push(im) }

    //% group="Image[]: Array für Bilder" subcategory="Bilder Array"
    //% block="Image[%index]" weight=3
    //% blockSetVariable=bild
    export function getImage(index: number) { return qImages.get(index) }






    //% group="Image[] in Matrix zeichnen" subcategory="Bilder Array"
    //% block="zeichne Bilder %images x %x y %y || Abstand x %dx y %dy %ut x %fx y %fy" weight=6
    //% images.shadow=matrix_Images
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.defl=8 dy.defl=0
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% inlineInputMode=inline
    export function writeImageArray(images: Image[], x: number, y: number, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        for (let iImage = 0; iImage < images.length; iImage++) {
            writeImage(images.get(iImage), x + iImage * dx, y + iImage * dy, ut, fx, fy)
        }
    }


    //% group="Image[] in Matrix zeichnen" subcategory="Bilder Array"
    //% block="8x8 %images %drehen" weight=5
    export function imageArrayDrehen(images: Image[], drehen: eZeichenDrehen) {
        let images1: Image[] = []
        for (let i = 0; i < images.length; i++) {
            images1.push(imageDrehen(images[i], drehen))
        }
        return images1
    }



    // ========== group="Text in Bilder 5x8 umwandeln" subcategory="Bilder Array"

    //% group="Text in Bilder 5x8 umwandeln" subcategory="Bilder Array"
    //% block="Image[] füllen aus Zahl/Zeit %text" weight=6
    //% text.shadow="matrix_text"
    export function imageArrayDigit(text: any) {
        let txt = convertToText(text)
        clearImages()
        for (let j = 0; j < txt.length; j++)
            pushImage(get5x8DigitImage(txt.charCodeAt(j))) // nur Zahl/Zeit Zeichen
    }

    //% group="Text in Bilder 5x8 umwandeln" color="#7E84F7" subcategory="Bilder Array"
    //% block="Image[] füllen aus Text %text" weight=5
    //% text.shadow="matrix_text"
    export function imageArrayCharset(text: any) {
        let txt = convertToText(text)
        clearImages()
        for (let j = 0; j < txt.length; j++)
            pushImage(get5x8CharImage(txt.charCodeAt(j)))
    }



    //% group="Text in Bilder 5x8 umwandeln" subcategory="Bilder Array"
    //% block="# zeichne Zahl/Zeit %zahl x %x y %y || Abstand x %dx y %dy %ut x %fx y %fy" weight=1
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.min=-25 dx.max=25 dx.defl=8 dy.min=-25 dy.max=25 dy.defl=0
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeDigitImageArray(zahl: any, x: number, y: number, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        let text = convertToText(zahl)
        let ia: Image[] = []
        for (let j = 0; j < text.length; j++) {
            //ia.push(digitImage(zahl, j)) // nur Ziffern, Minus und Punkt (spart Programmcode)
            // ia.push(bufferImage5x8(getDigit_5x8(text.charCodeAt(j))))
            ia.push(get5x8DigitImage(text.charCodeAt(j)))
        }
        writeImageArray(ia, x, y, dx, dy, ut, fx, fy)
    }



    // ========== group="Text in Matrix zeichnen" subcategory="Bilder Array"




    //% group="Animation Beispiele" subcategory="Bilder Array"
    //% block="Regen 16x8 (7 Bilder)"
    export function beispielRegen16x8(): Image[] {
        let im: Image[] = []

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        . . . # . . . . # . . . . . # .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        `))

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        # . . # # . . . # . . # . # # .
        # . . # . . . . # . . . . # # .
        . . . . . . . . . . . . . # . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        `))

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        # . . # # . . . # . . # . # # .
        # . . # # . . . # . . # . # # .
        # . . # . . . . # . . . . # # .
        . . . . . . . . . . . . . # . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        `))

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        # # . # # . # . # . . # . # # .
        # # . # # . # . # . . # . # # .
        # . . # . . . . # . . # . # # .
        # . . . . . . . # . . # . # # .
        . . . . . . . . # . . . . # # .
        . . . . . . . . . . . . . # . .
        . . . . . . . . . . . . . . . .
        `))

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        # # . # # # # . # . # # . # # #
        # # . # # . # . # . # # . # # .
        # # . # # . # . # . . # . # # .
        # . . # . . . . # . . # . # # .
        # . . . . . . . # . . . . # # .
        . . . . . . . . # . . . . # . .
        . . . . . . . . . . . . . . . .
        `))

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # #
        # # # # # # # . # . # # # # # #
        # # . # # . # . # . # # . # # .
        # . . # . . . . # . # . . # # .
        # . . . . . . . # . . . . # # .
        . . . . . . . . # . . . . # . .
        `))

        im.push(matrix16x8(`
        # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # #
        # # # # # # # # # # # # # # # #
        # # . # # # # . # # # # . # # .
        # . . # . # . . # . # # . # # .
        # . . . . . . . # . . # . # . .
        `))

        return im
    }

} // array.ts
