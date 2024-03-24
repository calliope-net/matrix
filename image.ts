
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



    // ========== group="Bild in Buffer zeichnen" subcategory="Bilder"

    //% group="Bild in Buffer zeichnen" subcategory="Bilder"
    //% block="zeichne Bild %im x %x y %y || %ut x %fx y %fy" weight=8
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeImage(im: Image, x: number, y: number, ut = eTransparent.u, fx = 1, fy?: number) {
        if (im) {
            if (!between(fx, 1, 16)) fx = 1
            if (!fy) fy = fx; else if (!between(fy, 1, 16)) fy = 1
            if (!between(x, 0, cx - im.width() * fx)) x = cx - im.width() * fx
            if (!between(y, 0, qy() - im.height() * fy)) y = qy() - im.height() * fy

            for (let iy = 0; iy <= im.height() - 1; iy++) {
                for (let ix = 0; ix <= im.width() - 1; ix++) {
                    if (ut == eTransparent.u) // Pixel im Buffer überschreiben
                        setPixelFaktor(x, y, ix, iy, fx, fy, im.pixel(ix, iy))
                    else if ((im.pixel(ix, iy))) // Pixel nur an schalten (false lässt vorhandene Pixel unverändert)
                        setPixelFaktor(x, y, ix, iy, fx, fy, true)
                }
            }
        }
    }

    function setPixelFaktor(x: number, y: number, imagex: number, imagey: number, faktorx = 1, faktory = 1, pixel = true) {
        if (faktorx == 1 && faktory == 1)
            setPixel(imagex + x, imagey + y, pixel)
        else
            for (let jy = 0; jy < faktory; jy++) {
                for (let jx = 0; jx < faktorx; jx++) {
                    setPixel(x + imagex * faktorx + jx, y + imagey * faktory + jy, pixel)
                }
            }
    }



    //% group="Text in Buffer zeichnen" subcategory="Bilder"
    //% block="zeichne Text %text x %x y %y || Abstand x %dx y %dy %ut x %fx y %fy" weight=4
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% dx.min=-10 dx.max=10 dx.defl=8 dy.min=-10 dy.max=10 dy.defl=0
    //% fx.shadow="oled_eFaktor" fy.shadow="oled_eFaktor"
    //% inlineInputMode=inline
    export function writeTextImageArray(text: string, x: number, y: number, dx = 8, dy = 0, ut = eTransparent.u, fx = 1, fy?: number) {
        let ia: Image[] = []
        for (let j = 0; j < text.length; j++) {
            ia.push(charImage(text.charCodeAt(j)))
        }
        writeImageArray(ia, x, y, dx, dy, ut, fx, fy)
    }





    // ========== group="Bilder aus Text Zeichen (5x8 Pixel)" subcategory="Bilder" ==========

    //% group="Bilder aus Text Zeichen (5x8 Pixel)" subcategory="Bilder"
    //% block="Zeichen aus ASCII-Code %charCode" weight=6
    //% charCode.shadow="matrix_charCode"
    //% blockSetVariable=bild
    export function charImage(charCode: number): Image {
        return bufferImage5x8(getPixel_5x8(charCode))
    }

    //% group="Bilder aus Text Zeichen (5x8 Pixel)" subcategory="Bilder"
    //% block="Zeichen aus 10 HEX-Digits %hex" weight=5
    //% hex.defl="7F09192946"
    //% blockSetVariable=bild
    export function hexImage(hex: string): Image {
        return bufferImage5x8(Buffer.fromHex(hex))
    }

    function bufferImage5x8(bu: Buffer): Image {
        let i5x8: Image

        i5x8 = matrix5x8(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)

        for (let iy = 0; iy < i5x8.height(); iy++) {
            for (let ix = 0; ix < i5x8.width(); ix++) {
                i5x8.setPixel(ix, iy, (bu.getUint8(ix) & 2 ** (iy & 7)) != 0)
            }
        }
        return i5x8
    }





    //% group="Bilder 8 Pixel" subcategory="Bilder"
    //% block="Test Bild 8x8" weight=4
    //% blockSetVariable=bild
    export function testBild8x8(): Image {
        let i1 = matrix.matrix8x8(`
        # . . . # # # #
        . . . # # . . #
        . . # . # . . .
        . # . . # . . .
        # . . . # . . .
        . . . . # . . .
        . . . . # . . .
        # . . . # . . #
        `)
        return i1
    }


    //% imageLiteral=1 imageLiteralColumns=5 imageLiteralRows=8
    //% shim=images::createImage
    function matrix5x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Bilder 8 Pixel" subcategory="Bilder"
    //% block="Bild 8x8" weight=2
    //% imageLiteral=1 imageLiteralColumns=8 imageLiteralRows=8
    //% shim=images::createImage
    //% blockSetVariable=bild
    export function matrix8x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }





    // ========== group="Image Objekte" subcategory="Bilder 16" ==========

    //% group="Image Objekte" subcategory="Bilder 16"
    //% block="Bild 16x8" weight=7
    //% imageLiteral=1 imageLiteralColumns=16 imageLiteralRows=8
    //% shim=images::createImage
    //% blockSetVariable=bild
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
