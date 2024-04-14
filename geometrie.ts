
namespace matrix { // geometrie.ts





    //% group="Linie, Fläche in Matrix zeichnen" subcategory="Geometrie"
    //% block="Linie von x %x0 y %y0 bis x %x1 y %y1 || Pixel %pixel" weight=3
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function line(x0: number, y0: number, x1: number, y1: number, pixel?: boolean) {
        x0 = Math.round(x0)
        y0 = Math.round(y0)
        x1 = Math.round(x1)
        y1 = Math.round(y1)

        // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
        let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
        let err = dx + dy, e2; // error value e_xy

        while (true) {
            setPixel(x0, y0, pixel)
            if (x0 == x1 && y0 == y1) break;
            e2 = 2 * err;
            if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
            if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
        }
    }

    //% group="Linie, Fläche in Matrix zeichnen" subcategory="Geometrie"
    //% block="Kreis Mittelpunkt x %x0 y %y0 Radius %radius || Pixel %pixel" weight=2
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function rasterCircle(x0: number, y0: number, radius: number, pixel?: boolean) {
        x0 = Math.round(x0)
        y0 = Math.round(y0)
        radius = Math.round(radius)

        // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
        let f = 1 - radius;
        let ddF_x = 0;
        let ddF_y = -2 * radius;
        let x = 0;
        let y = radius;

        setPixel(x0, y0 + radius, pixel);
        setPixel(x0, y0 - radius, pixel);
        setPixel(x0 + radius, y0, pixel);
        setPixel(x0 - radius, y0, pixel);

        while (x < y) {
            if (f >= 0) {
                y -= 1;
                ddF_y += 2;
                f += ddF_y;
            }
            x += 1;
            ddF_x += 2;
            f += ddF_x + 1;

            setPixel(x0 + x, y0 + y, pixel);
            setPixel(x0 - x, y0 + y, pixel);
            setPixel(x0 + x, y0 - y, pixel);
            setPixel(x0 - x, y0 - y, pixel);
            setPixel(x0 + y, y0 + x, pixel);
            setPixel(x0 - y, y0 + x, pixel);
            setPixel(x0 + y, y0 - x, pixel);
            setPixel(x0 - y, y0 - x, pixel);
        }
    }




    //% group="Uhr Zeiger in Matrix zeichnen" subcategory="Geometrie"
    //% block="12 Stunden %hour Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel" weight=3
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function hour_mark(hour: number, x: number, y: number, l0: number, l1: number, pixel?: boolean) {
        if (between(hour, 0, 11))
            minute_mark(hour * 5, x, y, l0, l1, pixel)
        else if (between(hour, 12, 23))
            minute_mark((hour - 12) * 5, x, y, l0, l1, pixel)
        else
            minute_mark(0, x, y, l0, l1, pixel)
    }


    //% group="Uhr Zeiger in Matrix zeichnen" subcategory="Geometrie"
    //% block="60 Minuten %minute Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel" weight=2
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function minute_mark(minute: number, x: number, y: number, l0: number, l1: number, pixel?: boolean) {

        if (between(minute, 0, 14))
            minute += 45
        else if (between(minute, 15, 59))
            minute -= 15
        else
            minute = 45

        let value = minute / 30 * Math.PI

        line(
            x + Math.cos(value) * l0, // x0
            y + Math.sin(value) * l0, // y0
            x + Math.cos(value) * l1, // x1
            y + Math.sin(value) * l1, // y1
            pixel
        )
    }

    //% group="Analog Uhr in Matrix zeichnen" subcategory="Geometrie"
    //% block="zeichne Uhr Mittelpunkt x %x y %y (Radius 24) Stunde %hour Minute %minute" weight=1
    //% x.min=24 x.max=103 x.defl=30 
    //% y.min=23 y.max=103 y.defl=23
    //% inlineInputMode=inline
    export function writeClock_radius24(x: number, y: number, hour: number, minute: number) {
        rasterCircle(x, y, 24)//30, 23

        for (let ih = 0; ih <= 11; ih++) {
            hour_mark(ih, x, y, 20, 23)
        }

        writeImage(imageDrehen(hexImage5x8("2241494936"), eZeichenDrehen.rechts), x + 17, y - 2)//47, 21//"2241494936"
        writeImage(hexImage5x8("3C4A494930"), x - 2, y + 17)//28, 40//"3C4A494930"
        writeImage(imageDrehen(hexImage5x8("064949291E"), eZeichenDrehen.links), x - 24, y - 5)//6, 18//"064949291E"
        writeImage(hexImage8x8("427F406251494946"), x - 4, y - 23)// 26, 0

        hour_mark(hour, x, y, 0, 10)
        minute_mark(minute, x, y, 0, 16)
    }

} // geometrie.ts

