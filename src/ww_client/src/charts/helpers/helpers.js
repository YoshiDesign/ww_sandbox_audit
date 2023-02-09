export function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

// Keeps letters, spaces, hyphens and apostrophes
export function normalString(s) {
    
    let re = /[a-zA-Z' -]/
    let spl = s.split("_")
    let fin = []

    for (let word of spl) {
        let newString = ""
        for (let letter of word){
            if (re.test(letter)){
                newString += letter
            }
        }
        fin.push(newString)
    }
    return fin.join(" ")
}

export function normTitle(s) {
    return titleCase(normalString(s))
}


export function assertButtonActives(stats)
{
    console.log("Stats:r")
    console.log(stats)
    // for (let i in stats) {

    //     if (stats[i]) {
    //         console.log("CHEKCSTATS")
    //         console.log(stats[i])
    //         document.getElementById(stats[i]).classList.add('bActive')
    //     }

    // }

}