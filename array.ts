
namespace matrix { // array.ts

    //% group="Array (mehrere Bilder) in Buffer zeichnen" subcategory="Bilder Array"
    //% block="zeichne Array %im x %x y %y || Abstand x %dx y %dy" weight=6
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.defl=8 dy.defl=0
    //% inlineInputMode=inline
    export function writeImageArray(im: Image[], x: number, y: number, dx = 8, dy = 0) {
        for (let iImage = 0; iImage < im.length; iImage++) {
            writeImage(im.get(iImage), x + iImage * dx, y + iImage * dy)
        }
    }



} // array.ts
