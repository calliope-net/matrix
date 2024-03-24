
namespace matrix { // array.ts




    //% group="OLED Display I²C" color="#007FFF" subcategory="Bilder Array"
    //% block="Animation auf Display schreiben %im x %x y %y || ⇔ %fx Pause(ms) %ms Zeilen %fromPage-%toPage %pI2C" weight=6
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% fx.shadow="oled_eFaktor"
    //% ms.shadow=timePicker
    //% fromPage.min=0 fromPage.max=15 fromPage.defl=0
    //% toPage.min=0 toPage.max=15 toPage.defl=15
    //% inlineInputMode=inline
    // expandableArgumentMode="toggle"
    export function writeDisplayAnimation(im: Image[], x: number, y: number, fx = 1, ms = 200, fromPage = 0, toPage = 15, pI2C = eI2C.I2C_x3C) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x, y, eTransparent.u, fx)
            writeDisplay(fromPage, toPage, pI2C)
            basic.pause(ms)
        }

    }




    //% group="Array (mehrere Bilder) in Buffer zeichnen" subcategory="Bilder Array"
    //% block="zeichne Array %im x %x y %y || Abstand x %dx y %dy %ut x %fx y %fy" weight=6
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.defl=8 dy.defl=0
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeImageArray(im: Image[], x: number, y: number, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x + iImage * dx, y + iImage * dy, ut, fx, fy)
        }
    }





    //% group="Animation Beispiele" subcategory="Bilder Array"
    //% block="Regen"
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
