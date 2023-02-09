export function dollarize (dollars) {

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });

      return String(formatter.format(dollars))//.replace(".00", "")

}

export function should_dollarize(stat){


    console.log(stat)

    if (
        stat.includes("ex") ||
        stat.includes("mhc") ||
        stat.includes("rav") ||
        stat.includes("r0") ||
        stat.includes("r1") ||
        stat.includes("r2") ||
        stat.includes("r3") ||
        stat.includes("r4")
    ) {
        return true
    }

    return false

}
const dont_title = ['in', 'of', 'the', 'and', 'or', 'with', ' ']
export function titleCase(str) {

    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        if (!dont_title.includes(str[i]))
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
    
}
// No time
export function titleCaseUnderscore(str) {
    
    str = str.toLowerCase().split('_');
    for (var i = 0; i < str.length; i++) {
        if (!dont_title.includes(str[i]))
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');

}