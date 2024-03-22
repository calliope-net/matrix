// clock.ts
namespace matrix {

    //% group="Analog Uhr" subcategory="Uhr"
    //% block="12 Stunden %hour Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel"
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function hour_mark(hour: number, x: number, y: number, l0: number, l1: number, pixel?: boolean) {



        if (between(hour, 0, 11))
            minute_line(hour * 5, x, y, l0, l1, pixel)
        else if (between(hour, 12, 23))
            minute_line((hour - 12) * 5, x, y, l0, l1, pixel)
        else
            minute_line(0, x, y, l0, l1, pixel)

        //minute_line(hour * 5, x, y, l0, l1, pixel)

        /*
                //let value = hour * Math.PI * 30 / 180
                let value = hour / 6 * Math.PI
        
                line(
                    Math.round(x + Math.cos(value) * l0), // x0
                    Math.round(y + Math.sin(value) * l0), // y0
                    Math.round(x + Math.cos(value) * l1), // x1
                    Math.round(y + Math.sin(value) * l1), // y1
                    pixel
                ) */
    }


    //% group="Analog Uhr" subcategory="Uhr"
    //% block="60 Minuten %minute Mittelpunkt x %x y %y Linie %l0 - %l1 || Pixel %pixel"
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function minute_line(minute: number, x: number, y: number, l0: number, l1: number, pixel?: boolean) {

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
