// /**
//  * This function returns an object used to generate
//  * the data patterns across different types of maps
//  * @param {*} lookFor -- The type of map
//  */
// export function determineType(lookFor) {
//     let type = {}
//     switch (lookFor) {

//         case "col" :
//             type = {
//                 q_scale   : [1, 163],
//                 maptype: "col",
//                 d_title   : "Relative Cost of Living: "
//             }
//             break
//         case "rav_any" : 
//             type = {
//                 q_scale: [1, 2000],
//                 maptype: "rav",
//                 d_title: "Avg. Rent Price: "
//             }
//             break
//         case "rav_0" :
//             type = {
//                 q_scale: [150, 1210],
//                 maptype: "r0",
//                 d_title: "Avg. Studio Apartment Price: "
//             }

//             break
//         case "rav_1" :
//             type = {
//                 q_scale: [1, 1300],
//                 maptype: "r1",
//                 d_title: "Avg. 1 Bedroom Apartment Pricie: "
//             }

//             break
//         case "rav_2" :
//             type = {
//                 q_scale: [1, 1650],
//                 maptype: "r2",
//                 d_title: "Avg. 2 Bedroom Apartment Price: "
//             }

//             break
//         case "rav_3" :
//             type = {
//                 q_scale: [1, 1900],
//                 maptype: "r3",
//                 d_title: "Avg. 3 Bedroom Apartment Price: "
//             }

//             break
//         case "rav_4" :
//             type = {
//                 q_scale: [1, 2000],
//                 maptype: "r4",
//                 d_title: "Avg. 4 Bedroom Apartment Price: "
//             }

//             break

//         default:
//             type = {
//                 q_scale: [1, 163],
//                 maptype: "col",
//                 d_title: "Avg. Cost of Living: "
//             }
//     }

//     return type

// }