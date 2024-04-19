
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
        //% block="* 5"
        f5 = 5,
        //% block="* 6"
        f6 = 6,
        //% block="* 7"
        f7 = 7,
        //% block="* 8"
        f8 = 8,
    }
    //% blockId=matrix_eFaktor block="%pFaktor" blockHidden=true
    export function matrix_eFaktor(pFaktor: eFaktor): number { return pFaktor }

    // blockId=oled_eFaktor block="%pFaktor" blockHidden=true
    //export function oled_eFaktor(pFaktor: eFaktor): number { return pFaktor }

    // ========== group="Bild in Matrix zeichnen" subcategory="Bilder"

    //% group="ein Bild in Matrix zeichnen" subcategory="Bilder"
    //% block="zeichne Bild %im x %x y %y || %ut x %fx y %fy" weight=8
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% fx.shadow="matrix_eFaktor" fy.shadow="matrix_eFaktor"
    //% inlineInputMode=inline
    export function writeImage(im: Image, x: number, y: number, ut = eTransparent.u, fx = 1, fy?: number) {
        if (im) {
            if (!between(fx, 1, 16)) fx = 1
            if (!fy) fy = fx; else if (!between(fy, 1, 16)) fy = 1
            //if (!between(x, 0, cx - im.width() * fx)) x = cx - im.width() * fx
            //if (!between(y, 0, 1 + qy() - im.height() * fy)) y = qy() - im.height() * fy

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


    export enum eZeichenDrehen {
        //%block="nicht drehen"
        nicht,
        //%block="links ↶ drehen"
        links,
        //%block="rechts ↷ drehen"
        rechts,
        //%block="halb ⤸ drehen"
        halb,
        //%block="↔ y spiegeln"
        yspiegeln,
        //% block="↕ x spiegeln"
        xspiegeln
    }

    //% group="ein Bild in Matrix zeichnen" subcategory="Bilder"
    //% block="8x8 %i0 %pDrehen" weight=7
    export function imageDrehen(i0: Image, pDrehen: eZeichenDrehen) {
        //if (pDrehen == eZeichenDrehen.nicht)
        //    return i0
        //else {
        let i1 = matrix8x8(`            
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        `)

        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                if (i < i0.width() && j < i0.height()) {
                    switch (pDrehen) {
                        case eZeichenDrehen.nicht: { // nur in 8x8 kopieren
                            i1.setPixel(i, j, i0.pixel(i, j)) // (i,j) (i,j)
                            break
                        }
                        case eZeichenDrehen.links: {
                            i1.setPixel(j, 7 - i, i0.pixel(i, j)) // (j,7-i) (i,j)
                            break
                        }
                        case eZeichenDrehen.rechts: {
                            i1.setPixel(7 - j, i, i0.pixel(i, j)) // (7-j,i) (i,j)
                            break
                        }
                        case eZeichenDrehen.halb: {
                            i1.setPixel(7 - i, 7 - j, i0.pixel(i, j)) // (7-i,7-j) (i,j)
                            break
                        }
                        case eZeichenDrehen.yspiegeln: {
                            i1.setPixel(7 - i, j, i0.pixel(i, j)) // (7-i,j) (i,j)
                            break
                        }
                        case eZeichenDrehen.xspiegeln: {
                            i1.setPixel(i, 7 - j, i0.pixel(i, j)) // (i,7-j) (i,j)
                            break
                        }
                    }
                }
            }
        }
        return i1
        //} // else
    }

   

    // ========== group="Bild 5x8 aus Text Zeichen" subcategory="Bilder" ==========

    //% group="ein Zeichen in Bild 5x8 umwandeln" subcategory="Bilder"
    //% block="%zahl" weight=7
    //% blockSetVariable=bild
    export function digitImage(zahl: eDigit): Image {
        return get5x8DigitImage(zahl)
    }


    //% group="ein Zeichen in Bild 5x8 umwandeln" color="#7E84F7" subcategory="Bilder"
    //% block="Bild aus ASCII-Code %charCode" weight=5
    //% charCode.min=32 charCode.max=127 charCode.defl=48
    //% blockSetVariable=bild
    export function asciiImage(charCode: number): Image {
        return get5x8CharImage(charCode)
    }



    // ========== group="Bild aus Hexadezimalzahl" subcategory="Bilder"

    //% group="Bild aus Hexadezimalzahl" subcategory="Bilder"
    //% block="Bild 5x8 aus HEX %hex" weight=5
    //% hex.defl="7F09192946"
    //% blockSetVariable=bild
    export function hexImage5x8(hex: string): Image {
        //return image5x8fromBuffer(Buffer.fromHex(hex))
        return image5x8fromString(Buffer.fromHex(hex).toString())
    }

    //% group="Bild aus Hexadezimalzahl" subcategory="Bilder"
    //% block="Bild 8x8 aus HEX %hex" weight=3
    //% hex.defl="427F406251494946"
    //% blockSetVariable=bild
    export function hexImage8x8(hex: string): Image {
        let bu = Buffer.fromHex(hex)
        let i8x8 = testBild8x8()
        i8x8.clear()
        for (let iy = 0; iy < i8x8.height(); iy++) {
            for (let ix = 0; ix < i8x8.width(); ix++) {
                i8x8.setPixel(ix, iy, (bu.getUint8(ix) & 2 ** (iy & 7)) != 0)
            }
        }
        return i8x8
    }


    //% group="Image Objekte" subcategory="Bilder"
    //% block="Bild 8x8" weight=2
    //% imageLiteral=1 imageLiteralColumns=8 imageLiteralRows=8
    //% shim=images::createImage
    //% blockSetVariable=bild
    export function matrix8x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }


    // ========== group="Image Objekte" subcategory="Bilder 8"

    //% group="Image Objekte" subcategory="Bilder 8 16"
    //% block="Test Bild 8x8" weight=8
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


    //% group="Image Objekte" subcategory="Bilder 8 16"
    //% block="Bild 5x8" weight=7
    //% imageLiteral=1 imageLiteralColumns=5 imageLiteralRows=8
    //% shim=images::createImage
    //% blockSetVariable=bild
    export function matrix5x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }




    // ========== group="Image Objekte" subcategory="Bilder 16" ==========

    //% group="Image Objekte" subcategory="Bilder 8 16"
    //% block="Bild 16x8" weight=5
    //% imageLiteral=1 imageLiteralColumns=16 imageLiteralRows=8
    //% shim=images::createImage
    //% blockSetVariable=bild
    export function matrix16x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Image Objekte" subcategory="Bilder 8 16"
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
