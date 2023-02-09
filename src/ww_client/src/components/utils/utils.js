import { useRef } from "react"

export const color_swatches = {
    // BluePurp
    "bivariate" : {
         
        "1" : {
            colors: [
                "#e8e8e8", "#cee2e2", "#b3dcdc", "#97d6d6", "#7acfcf", "#5ac8c8", 
                "#e0cedc", "#cecedc", "#b3cedc", "#97ced6", "#7acecf", "#5ac8c8", 
                "#d8b4d1", "#ceb4d1", "#b3b4d1", "#97b4d1", "#7ab4cf", "#5ab4c8", 
                "#cf9ac5", "#ce9ac5", "#b39ac5", "#979ac5", "#7a9ac5", "#5a9ac5", 
                "#c780b9", "#c780b9", "#b380b9", "#9780b9", "#7a80b9", "#5a80b9", 
                "#be64ac", "#be64ac", "#b364ac", "#9764ac", "#7a64ac", "#5a64ac"
            ],
            nodata: "black"
        },

        // RedBlue
        "2" : {
            colors: [
                "#ffffff", "#ffddd1", "#ffbaa3", "#ff9475", "#ff6644", "#ff0000", 
                "#dfd3f9", "#dfb7cc", "#df9a9f", "#df7a72", "#df5442", "#df0000", 
                "#bda9f3", "#bd92c7", "#bd7b9b", "#bd626f", "#bd4441", "#bd0000", 
                "#977fec", "#976ec1", "#975d97", "#974a6c", "#97333f", "#970000", 
                "#6b57e4", "#6b4bbb", "#6b3f92", "#6b3269", "#6b233d", "#6b0000", 
                "#2130db", "#212ab3", "#21238c", "#211c64", "#21133a", "#210000"
            ],
            nodata: "black"
        },

        // PurpOrange
        "3" : {
            colors: [
                "#ffffff", "#fff0d9", "#ffe0b2", "#ffd089", "#ffbe5e", "#ffac30", 
                "#e5d4ff", "#e5c8d9", "#e5bab2", "#e5ad89", "#e59e5e", "#e58f30", 
                "#caa9ff", "#ca9fd9", "#ca94b2", "#ca8a89", "#ca7e5e", "#ca7230", 
                "#af7dff", "#af76d9", "#af6eb2", "#af6689", "#af5d5e", "#af5430", 
                "#914cff", "#9148d9", "#9143b2", "#913e89", "#91395e", "#913330", 
                "#6200ff", "#6200d9", "#6200b2", "#620089", "#62005e", "#620030"
            ],
            nodata: "black"
        },

        // YellowGrn
        "4" : {
            colors: [
                "#e8e8e8", "#cee2e2", "#b3dcdc", "#97d6d6", "#7acfcf", "#5ac8c8", 
                "#e4debe", "#cedebe", "#b3dcbe", "#97d6be", "#7acfbe", "#5ac8be", 
                "#dfd492", "#ced492", "#b3d492", "#97d492", "#7acf92", "#5ac892", 
                "#dbc964", "#cec964", "#b3c964", "#97c964", "#7ac964", "#5ac864", 
                "#d6be34", "#cebe34", "#b3be34", "#97be34", "#7abe34", "#5abe34", 
                "#d1b200", "#ceb200", "#b3b200", "#97b200", "#7ab200", "#5ab200"
            ],
            nodata: "black"
        }
    },

    "monovar" : {
        "1" : {
            colors: ["#E5FBFF", "#CCE2FF", "#B3C9FF", "#99AFFF", "#7F95FF", "#667CFA", "#4D63E1", "#3349C7", "#1A30AE"],
            nodata: "black"
        },

        // RedBlue
        "2" : {
            colors: ["#FFEFFF", "#FFD6F6", "#FFBCDC", "#FFA2C2", "#FB89A9", "#E27090", "#C85676", "#AF3D5D", "#952343"],
            nodata: "black"
        },

        // BlueGreen
        "3" : {
            colors: ["#FDFFFD", "#E4FFE4", "#CBFFCB", "#B1FFB1", "#97E697", "#7ECD7E", "#65B465", "#4B9A4B", "#328132"],
            nodata: "black"
        },

        // PurpOrange
        "4" : {
            colors: ["#FFFFE5", "#FFFBCC", "#FFE2B3", "#FFC899", "#FFAE7F", "#FA9566", "#E17C4D", "#C76233", "#AE491A"],
            nodata: "black"
        },

        // YellowGrn
        "5" : {
            colors: ["#FFFFFF", "#E5E5E5", "#CCCCCC", "#B3B3B3", "#999999", "#7F7F7F", "#666666", "#4D4D4D", "#333333"],
            nodata: "black"
        }
    }
}

export const callAccessor = (accessor, d, i) => (
    typeof accessor === "function" ? accessor(d, i) : accessor
)
  
export const combineChartDimensions = dimensions => {
    let parsedDimensions = {
      marginTop: 40,
      marginRight: 30,
      marginBottom: 40,
      marginLeft: 75,
      ...dimensions,
    }
    return {
        ...parsedDimensions,
        boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop  - parsedDimensions.marginBottom, 0),
        boundedWidth:  Math.max(parsedDimensions.width  - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
    }
}

/**
 * Retrieve our current chart's dimensions
 */
export const useChartDimensions = passedSettings => {

    // Create a ref
    const ref = useRef()
    // Override our default dimensions where needed
    const dimensions = combineChartDimensions(passedSettings)
  
    // Acquire a width and height that can be easily used by the ResizeObserver
    const height = window.innerHeight - 300
    const width =  "100%"

    const newSettings = combineChartDimensions({
        ...dimensions,
        scale : 1,
        width:  width,
        height: height,
        margin : {
            top : 10,
            bottom :  10,
            left : 10,
            right : 10
        }
    })
    // Let's do like a margin thing
    newSettings.boundedWidth  = newSettings.width - (newSettings.margin.left + newSettings.margin.right);
    newSettings.boundedHeight = newSettings.height - (newSettings.margin.top + newSettings.margin.bottom);
  
    return [ref, newSettings]
  }

  export function color(values, cScales, color_swatch, sortKeys) {

    /**
     * Warning: Normal execution flow in this function is performed > 3000 times
     * I would recommend setting a global flag/switch to avoid endless logging runaway
     */

    // console.log("COLOR FUNCTION ------------")
    // console.log("Values:",values)
    // console.log("cScales:", cScales)
    // console.log("color_swatch:", color_swatch)
    // console.log("sortKeys:",sortKeys)
    // console.log("[0]-------------------------")

    // No Data
    if (!values || values == undefined) return "#0003"; 

    // 1 of 2 data stats is missing in a bivariate: for now, just return it as though there is no data :\
    if (values[sortKeys[0]] === "PASS" || values[sortKeys[1]] === "PASS" ||
        Number(values[sortKeys[0]]) === 0 || Number(values[sortKeys[1]]) === 0)
        return "#0000";

    var swatch = null

    if (sortKeys.length === 2){

        // Choose a Bivariate Swatch
        swatch = color_swatches["bivariate"][color_swatch].colors
        let n = 6
        let x = cScales[sortKeys[0]]
        let y = cScales[sortKeys[1]]

        // (2 functions adding their results together) + n  To form the corresponding color index
        return swatch [
            x(values[sortKeys[0]]) * y(values[sortKeys[1]] + n) // Scaling fn 1
        ]

    } else {
        
        // Monovariate swatches
        swatch = color_swatches["monovar"][color_swatch].colors

        return swatch[
            // Warning - Super unreadable
            cScales[sortKeys[0]] (      // This is the scaling function
                values[sortKeys[0]]      // This is it's argument
            )
        ]
    }
    
}

// Preventative measure agains rapidly sending requests from easily repeatable events
export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var  timerId // IMPORTANT: Redeclare this variable where throttle will be used.
export function throttle (func, delay, args) {
	// If setTimeout is already scheduled, no need to do anything
	if (timerId) {
		return
	}

	// Schedule a setTimeout after delay seconds
	timerId  =  setTimeout(function () {

		func(args)
		
		// Once setTimeout function execution is finished, timerId = undefined so that in <br>
		// the next scroll event function execution can be scheduled by the setTimeout
		timerId  =  undefined;
	}, delay)
}