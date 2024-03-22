// clock.ts
namespace matrix {

    //% group="Analog Uhr" subcategory="Uhr"
    //% block="Markierung Stunde %hour Mittelpunkt x %x y %y || Pixel %pixel"
    //% pixel.shadow="toggleOnOff" pixel.defl=1
    //% inlineInputMode=inline
    export function hour_mark(hour: number, x: number, y: number, pixel?: boolean) {
        //for (let Index = 0; Index <= 11; Index++) {
        let value = hour * Math.PI * 30 / 180
        line(
            x + Math.cos(value) * 50, // x0
            y + Math.sin(value) * 50, // y0
            x + Math.cos(value) * 60, // x1
            y + Math.sin(value) * 60,  // y1
            pixel
        )

        //matrix.writeDisplay()
        //}
        //matrix.setPixel(0, 0, true)
    }

    /* function radians(degrees: number) {
        return degrees * (matrix.pi() / 180)
    } */

} // clock.ts
