
namespace matrix { // array.ts

    //% group="Array (mehrere Bilder) in Buffer zeichnen" subcategory="Bilder Array"
    //% block="zeichne Array %im x %x y %y || Abstand x %dx y %dy %ut x %fx y %fy" weight=6
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.defl=8 dy.defl=0
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeImageArray(im: Image[], x: number, y: number, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy = 1) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x + iImage * dx, y + iImage * dy, ut, fx, fy)
        }
    }



} // array.ts
