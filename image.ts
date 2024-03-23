
namespace matrix { // image.ts

    export enum eTransparent {
        //% block="überschreiben"
        u,
        //% block="transparent"
        t
    }

    export enum eFaktor {
        //% block="* 1"
        f1 = 1,
        //% block="* 2"
        f2 = 2,
        //% block="* 3"
        f3 = 3,
        //% block="* 4"
        f4 = 4,
    }
    //% blockId=oled_eFaktor block="%pFaktor" blockHidden=true
    export function oled_eFaktor(pFaktor: eFaktor): number { return pFaktor }



    // ========== group="Image in Buffer zeichnen" subcategory="Bilder"

    //% group="Image in Buffer zeichnen" subcategory="Bilder"
    //% block="zeichne Bild %im x %xpos y %ypos || 0-Pixel löschen %del" weight=9 deprecated=1
    //% x.min=0 x.max=127 y.min=0 y.max=127

    //% inlineInputMode=inline
    export function writeImageOLED(im: Image, x: number, y: number, pTransparent = eTransparent.u) {

        for (let iy = 0; iy <= im.height() - 1; iy++) {
            for (let ix = 0; ix <= im.width() - 1; ix++) {
                if (pTransparent == eTransparent.u) // Pixel im Buffer überschreiben
                    setPixel(ix + x, iy + y, im.pixel(ix, iy))
                else if ((im.pixel(ix, iy))) // Pixel nur an schalten (false lässt vorhandene Pixel unverändert)
                    setPixel(ix + x, iy + y, true)
            }
        }
    }

    //% group="Image in Buffer zeichnen" subcategory="Bilder"
    //% block="zeichne Bild %im x %x y %y || Pixel %pTransparent vergrößern x %fx y %fy" weight=8
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeImage(im: Image, x: number, y: number, pTransparent = eTransparent.u, fx = 1, fy = 1) {
        if (im) {
            if (!between(fx, 1, 16)) fx = 1
            if (!between(fy, 1, 16)) fy = 1
            if (!between(x, 0, cx - im.width() * fx)) x = cx - im.width() * fx
            if (!between(y, 0, qy() - im.height() * fy)) y = qy() - im.height() * fy

            for (let iy = 0; iy <= im.height() - 1; iy++) {
                for (let ix = 0; ix <= im.width() - 1; ix++) {
                    if (pTransparent == eTransparent.u) // Pixel im Buffer überschreiben
                        setPixelFaktor(x, y, ix, iy, fx, fy, im.pixel(ix, iy))
                    else if ((im.pixel(ix, iy))) // Pixel nur an schalten (false lässt vorhandene Pixel unverändert)
                        setPixelFaktor(x, y, ix, iy, fx, fy, true)
                }
            }
        }
    }

    function setPixelFaktor(x: number, y: number, ix: number, iy: number, faktorx = 1, faktory = 1, pixel = true) {
        if (faktorx == 1 && faktory == 1)
            setPixel(ix + x, iy + y, pixel)
        else
            for (let jy = 0; jy < faktory; jy++) {
                //basic.showNumber(jy)
                //setPixel(x + ix * faktor, y + iy * faktor + fy, pixel)
                for (let jx = 0; jx < faktorx; jx++) {
                    setPixel(x + ix * faktorx + jx, y + iy * faktory + jy, pixel)
                }
            }
    }



    /* function setPixelFaktor(x: number, y: number, ix: number, iy: number, fx = 1, fy = 1, pixel = true) {
        if (fx == 1 && fy == 1)
            setPixel(ix + x, iy + y, pixel)
        else
            for (let jy = 0; jy < fy; jy++) {
                basic.showNumber(jy)
                 for (let ix = 0; ix < fx; ix++) {
                    setPixel(x + ix * fx + ix, y + iy * fy + iy, pixel)
                } 
            }
    } */



    /*  function setPixelFaktor(x: number, y: number, ix: number, iy: number, fx = 1, fy = 1, pixel = true) {
         if (fx == 1)
             setPixel(ix + x, iy + y, pixel)
         else
             for (let fy = 0; fy < fx; fy++) {
                 //setPixel(x + ix * faktor, y + iy * faktor + fy, pixel)
                 for (let fx = 0; fx < fx; fx++) {
                     setPixel(x + ix * fx + fx, y + iy * fx + fy, pixel)
                 }
             }
     } */






    // ========== group="Image Objekte" subcategory="Bilder" ==========

    //% group="Image Objekte" subcategory="Bilder"
    //% block="Bild 8x8" weight=8
    //% imageLiteral=1 imageLiteralColumns=8 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix8x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }



    // ========== group="Image Objekte" subcategory="Bilder 16" ==========

    //% group="Image Objekte" subcategory="Bilder 16"
    //% block="Bild 16x8" weight=7
    //% imageLiteral=1 imageLiteralColumns=16 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix16x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Image Objekte" subcategory="Bilder 16"
    //% block="Bild 16x16" weight=4
    //% imageLiteral=1 imageLiteralColumns=16 imageLiteralRows=16
    //% shim=images::createImage
    export function matrix16x16(i: string): Image {
        const im = <Image><any>i;
        return im
    }



    // ========== group="Image Objekte" subcategory="Bilder 32"

    //% group="Image Objekte" subcategory="Bilder 32"
    //% block="Bild 32x8" weight=6
    //% imageLiteral=1 imageLiteralColumns=32 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix32x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Image Objekte" subcategory="Bilder 32"
    //% block="Bild 32x32" weight=3
    //% imageLiteral=1 imageLiteralColumns=32 imageLiteralRows=32
    //% shim=images::createImage
    export function matrix32x32(i: string): Image {
        const im = <Image><any>i;
        return im
    }



    // ========== group="Image Objekte" subcategory="Bilder 64"

    //% group="Image Objekte" subcategory="Bilder 64"
    //% block="Bild 64x8" weight=5
    //% imageLiteral=1 imageLiteralColumns=64 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix64x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Image Objekte" subcategory="Bilder 64"
    //% block="Bild 64x64" weight=2
    //% imageLiteral=1 imageLiteralColumns=64 imageLiteralRows=64
    //% shim=images::createImage
    export function matrix64x64(i: string): Image {
        const im = <Image><any>i;
        return im
    }


} // image.ts
