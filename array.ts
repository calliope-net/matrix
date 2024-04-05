
namespace matrix { // array.ts

 export   let qImages: Image[] = [] // leeres Array Elemente Typ Image

    //% blockId=matrix_Images
    //% block="Image[]" blockHidden=true
    export function matrix_Images() { return qImages }


    //% group="OLED Display I²C" color="#007FFF" subcategory="Bilder Array"
    //% block="Animation auf Display anzeigen %im x %x y %y || x %fx y %fy Pause(ms) %ms Zeilen %fromPage-%toPage %pI2C" weight=6
    //% im.shadow=matrix_Images
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% ms.shadow=timePicker
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% inlineInputMode=inline
    // expandableArgumentMode="toggle"
    export function writeDisplayAnimation(im: Image[], x: number, y: number, fx = 1, fy?: number, ms = 200, fromPage = 0, toPage = 15, pI2C = eI2C.I2C_x3C) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x, y, eTransparent.u, fx, fy)
            writeDisplay(fromPage, toPage, pI2C)
            basic.pause(ms)
        }
    }




    //% group="Array (mehrere Bilder) in Buffer zeichnen" subcategory="Bilder Array"
    //% block="zeichne Bilder %im x %x y %y || Abstand x %dx y %dy %ut x %fx y %fy" weight=6
    //% im.shadow=matrix_Images
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.defl=8 dy.defl=0
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeImageArray(im: Image[], x: number, y: number, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x + iImage * dx, y + iImage * dy, ut, fx, fy)
        }
    }



    //% group="Speicher für Bilder: Image[]" subcategory="Bilder Array"
    //% block="Bild anhängen %im" weight=8
    export function pushImage(im: Image) { qImages.push(im) }

    //% group="Speicher für Bilder: Image[]" subcategory="Bilder Array"
    //% block="Bild lesen an index %index" weight=7
    export function getImage(index:number) {return qImages.get(index) }


    //% group="Speicher für Bilder: Image[]" subcategory="Bilder Array"
    //% block="Image[] Länge" weight=3
    export function lengthImages() {return qImages.length }

    //% group="Speicher für Bilder: Image[]" subcategory="Bilder Array"
    //% block="Image[] löschen" weight=2
    export function clearImages() { qImages = [] }



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
