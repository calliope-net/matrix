// clock.ts
namespace matrix {

    //% group="Analog Uhr" subcategory="Uhr"
    //% block="Markierung Stunde %hour Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel"
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function hour_mark(hour: number, x: number, y: number, l0: number, l1: number, pixel?: boolean) {

        if (between(hour, 0, 2))
            hour += 9
        else if (between(hour, 3, 12))
            hour -= 3
        else
            hour = 9

        let value = hour * Math.PI * 30 / 180

        line(
            Math.round(x + Math.cos(value) * l0), // x0
            Math.round(y + Math.sin(value) * l0), // y0
            Math.round(x + Math.cos(value) * l1), // x1
            Math.round(y + Math.sin(value) * l1), // y1
            pixel
        )
    }


} // clock.ts
