
namespace matrix {


    // ========== group="Image in Buffer zeichnen" subcategory="Bilder"

    //% group="Image in Buffer zeichnen" subcategory="Bilder"
    //% block="zeichne Bild %im x %xpos y %ypos || 0-Pixel löschen %del" weight=9 deprecated=1
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% del.shadow="toggleYesNo"
    //% inlineInputMode=inline
    export function writeImageOLED(im: Image, x: number, y: number, del = false) {

        for (let iy = 0; iy <= im.height() - 1; iy++) {
            for (let ix = 0; ix <= im.width() - 1; ix++) {
                if (del) // Pixel im Buffer an und aus schalten
                    setPixel(ix + x, iy + y, im.pixel(ix, iy))
                else if ((im.pixel(ix, iy))) // Pixel nur an schalten (false lässt vorhandene Pixel unverändert)
                    setPixel(ix + x, iy + y, true)
            }
        }
    }

    //% group="Image in Buffer zeichnen" subcategory="Bilder"
    //% block="zeichne Bild %im x %xpos y %ypos || Faktor %faktor 0-Pixel löschen %del" weight=8
    //% x.min=0 x.max=127 y.min=0 y.max=127
    //% faktor.min=1 faktor.max=8 faktor.defl=1
    //% del.shadow="toggleYesNo"
    //% inlineInputMode=inline
    export function writeImage(im: Image, x: number, y: number, faktor = 1, del = false) {
        if (im) {
            if (!between(faktor, 1, 16)) faktor = 1
            if (!between(x, 0, cx - im.width() * faktor)) x = cx - im.width() * faktor
            if (!between(y, 0, qy() - im.height() * faktor)) y = qy() - im.height() * faktor

            for (let iy = 0; iy <= im.height() - 1; iy++) {
                for (let ix = 0; ix <= im.width() - 1; ix++) {
                    if (del)  // Pixel im Buffer an und aus schalten
                        setPixelFaktor(x, y, ix, iy, faktor, im.pixel(ix, iy))
                    else if ((im.pixel(ix, iy))) // Pixel nur an schalten (false lässt vorhandene Pixel unverändert)
                        setPixelFaktor(x, y, ix, iy, faktor, true)
                }
            }
        }
    }

    function setPixelFaktor(x: number, y: number, ix: number, iy: number, faktor = 1, pixel = true) {
        if (faktor == 1)
            setPixel(ix + x, iy + y, pixel)
        else
            for (let fy = 0; fy < faktor; fy++) {
                //setPixel(x + ix * faktor, y + iy * faktor + fy, pixel)
                for (let fx = 0; fx < faktor; fx++) {
                    setPixel(x + ix * faktor + fx, y + iy * faktor + fy, pixel)
                }
            }
    }


    // ========== subcategory="Bilder" ==========



    //% group="Image Objekte" subcategory="Bilder"
    //% block="Bild 8x8" weight=8
    //% imageLiteral=1 imageLiteralColumns=8 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix8x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Image Objekte" subcategory="Bilder"
    //% block="Bild 16x8" weight=7
    //% imageLiteral=1 imageLiteralColumns=16 imageLiteralRows=8
    //% shim=images::createImage
    export function matrix16x8(i: string): Image {
        const im = <Image><any>i;
        return im
    }

    //% group="Image Objekte" subcategory="Bilder"
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
