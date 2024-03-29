// clock.ts
namespace matrix {

    //% group="Analog Uhr Zeiger"
    //% block="12 Stunden %hour Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel" weight=2
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


    //% group="Analog Uhr Zeiger"
    //% block="60 Minuten %minute Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel" weight=1
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
            Math.round(x + Math.cos(value) * l0), // x0
            Math.round(y + Math.sin(value) * l0), // y0
            Math.round(x + Math.cos(value) * l1), // x1
            Math.round(y + Math.sin(value) * l1), // y1
            pixel
        )
    }

} // clock.ts
