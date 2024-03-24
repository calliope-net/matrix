
namespace matrix { // array.ts

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
        let im: Image[]

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
