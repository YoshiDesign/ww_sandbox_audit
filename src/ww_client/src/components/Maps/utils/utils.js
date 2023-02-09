import axios from 'axios'
import DoDataMap from '../../../charts/do-datamap2'
import WorldSphere from '../../../charts/world-sphere'

const mapKeys = ["x", ""]

/**
 * Keys can be safely altered. Values must not be changed. They are also Redis keys
 */
export const countries = {
    // "Select a country": "/search",
    "All Countries":  "/world",
    "Andorra":  "/andorra",
    "Angola":  "/angola",
    "Argentina":  "/argentina",
    "Armenia":  "/armenia",
    "Australia":  "/australia",
    "Austria":  "/austria",
    "Azerbaijan":  "/azerbaijan",
    "Bahamas":  "/bahamas",
    "Bahrain":  "/bahrain",
    "Bangladesh":  "/bangladesh",
    "Belarus":  "/belarus",
    "Belgium":  "/belgium",
    "Bhutan":  "/bhutan",
    "Bolivia":  "/bolivia",
    "Bosnia and Herzegovina":  "/bosnia-herzegovina-1",
    // "Bosnia and Herzegovina 2":  "/bosnia-herzegovina-2",
    "Botswana":  "/botswana",
    "Brazil":  "/brazil",
    "Brunei Darussalam":  "/brunei-darussalam",
    "Bulgaria":  "/bulgaria",
    "Burkina Faso":  "/burkina-faso",
    "Burundi":  "/burundi",
    "Cambodia":  "/cambodia",
    "Cameroon":  "/cameroon",
    "Canada":  "/canada",
    "Cape Verde":  "/cape-verde",
    "Central African Republic":  "/central-african-republic",
    "Chad":  "/chad",
    "Chile":  "/chile",
    "China":  "/china",
    "Colombia":  "/colombia",
    "Congo":  "/congo",
    "Congo DR":  "/congo-dr",
    "Costa Rica":  "/costa-rica",
    "Croatia":  "/croatia",
    "Cuba":  "/cuba",
    "Cyprus":  "/cyprus",
    "Czech Republic":  "/czech-republic",
    "Denmark":  "/denmark",
    "Djibouti":  "/djibouti",
    "Dominican Republic":  "/dominican-republic",
    "Ecuador":  "/ecuador",
    "Egypt":  "/egypt",
    "El Salvador":  "/el-salvador",
    "Estonia":  "/estonia",
    "Ethiopia":  "/ethiopia",
    "Faroe Islands":  "/faroeIslands",
    "Finland":  "/finland",
    "France":  "/france",
    "France Departments":  "/france-departments",
    "France New":  "/france-new",
    "Georgia":  "/georgia",
    "Germany":  "/germany",
    "Greece":  "/greece",
    "Guatemala":  "/guatemala",
    "Guinea":  "/guinea",
    "Haiti":  "/haiti",
    "Honduras":  "/honduras",
    "Hong Kong":  "/hong-kong",
    "Hungary":  "/hungary",
    "Iceland":  "/iceland",
    "India":  "/india",
    "Indonesia":  "/indonesia",
    "Iran":  "/iran",
    "Iraq":  "/iraq",
    "Ireland":  "/ireland",
    "Israel":  "/israel",
    "Italy":  "/italy",
    "Ivory Coast":  "/ivory-coast",
    "Jamaica":  "/jamaica",
    "Japan":  "/japan",
    "Kazakhstan":  "/kazakhstan",
    "Kenya":  "/kenya",
    "Kosovo":  "/kosovo",
    "Kyrgyzstan":  "/kyrgyzstan",
    "Laos":  "/laos",
    "Latvia":  "/latvia",
    "Liechtenstein":  "/liechtenstein",
    "Lithuania":  "/lithuania",
    "Luxembourg":  "/luxembourg",
    "Macedonia":  "/macedonia",
    "Malaysia":  "/malaysia",
    "Mali":  "/mali",
    "Malta":  "/malta",
    "Mexico":  "/mexico",
    "Moldova":  "/moldova",
    "Montenegro":  "/montenegro",
    "Morocco":  "/morocco",
    "Mozambique":  "/mozambique",
    "Myanmar":  "/myanmar",
    "Namibia":  "/namibia",
    "Nepal":  "/nepal",
    "Netherlands":  "/netherlands",
    "New Zealand":  "/new-zealand",
    "Nicaragua":  "/nicaragua",
    "Nigeria":  "/nigeria",
    "Norway":  "/norway",
    "Oman":  "/oman",
    "Pakistan":  "/pakistan",
    "Palestine":  "/palestine",
    "Panama":  "/panama",
    "Paraguay":  "/paraguay",
    "Peru":  "/peru",
    "Philippines":  "/philippines",
    "Poland":  "/poland",
    "Portugal":  "/portugal",
    "Portugal Regions":  "/portugal-regions",
    "Puerto Rico":  "/puerto-rico",
    "Qatar":  "/qatar",
    "Romania":  "/romania",
    "Russia":  "/russia",
    "Rwanda":  "/rwanda",
    "San Marino":  "/san-marino",
    "Saudi Arabia":  "/saudi-arabia",
    "Serbia":  "/serbia",
    // "Serbia without Kosovo":  "/serbia-without-kosovo",
    "Sierra Leone":  "/sierra-leone",
    "Singapore":  "/singapore",
    "Slovakia":  "/slovakia",
    "Slovenia":  "/slovenia",
    "South Africa":  "/south-africa",
    // "South Africa 2":  "/south-africa-2",
    "South Korea":  "/south-korea",
    "Spain":  "/spain",
    "Spain provinces":  "/spain-provinces",
    "Sri Lanka":  "/sri-lanka",
    "Sudan":  "/sudan",
    "Sweden":  "/sweden",
    "Switzerland":  "/switzerland",
    "Syria":  "/syria",
    // "Taiwan":  "/taiwan",
    "Tajikistan":  "/tajikistan",
    "Thailand":  "/thailand",
    "Turkey":  "/turkey",
    "Uganda":  "/uganda",
    "Ukraine":  "/ukraine",
    "United Arab Emirates":  "/united-arab-emirates",
    "United Kingdom":  "/united-kingdom",
    "United Kingdom counties":  "/united-kingdom-counties",
    "United States of America": "/usa",
    "Uruguay":  "/uruguay",
    "Uzbekistan":  "/uzbekistan",
    "Venezuela":  "/venezuela",
    "Vietnam":  "/vietnam",
    "Vietnam with islands":  "/vietnam-with-islands",
    "Yemen":  "/yemen",
    "Zambia":  "/zambia",
    "Zimbabwe":  "/zimbabwe"

}

export const countries_abbrev = {
    "US": "/usa",
    "CA": "/canada",
    "BR": "/brazil"
}

export const countries_title = {
    // "Select a country": "/search",
      "/world": "All Countries",
      "/andorra": "Andorra",
      "/angola": "Angola",
      "/argentina": "Argentina",
      "/armenia": "Armenia",
      "/australia": "Australia",
      "/austria": "Austria",
      "/azerbaijan": "Azerbaijan",
      "/bahamas": "Bahamas",
      "/bahrain": "Bahrain",
      "/bangladesh": "Bangladesh",
      "/belarus": "Belarus",
      "/belgium": "Belgium",
      "/bhutan": "Bhutan",
      "/bolivia": "Bolivia",
      "/bosnia-herzegovina-1": "Bosnia and Herzegovina",
    //   "/bosnia-herzegovina-2": "Bosnia and Herzegovina 2",
      "/botswana": "Botswana",
      "/brazil": "Brazil",
      "/brunei-darussalam": "Brunei Darussalam",
      "/bulgaria": "Bulgaria",
      "/burkina-faso": "Burkina Faso",
      "/burundi": "Burundi",
      "/cambodia": "Cambodia",
      "/cameroon": "Cameroon",
      "/canada": "Canada",
      "/cape-verde": "Cape Verde",
      "/central-african-republic": "Central African Republic",
      "/chad": "Chad",
      "/chile": "Chile",
      "/china": "China",
      "/colombia": "Colombia",
      "/congo": "Congo",
      "/congo-dr": "Congo DR",
      "/costa-rica": "Costa Rica",
      "/croatia": "Croatia",
      "/cuba": "Cuba",
      "/cyprus": "Cyprus",
      "/czech-republic": "Czech Republic",
      "/denmark": "Denmark",
      "/djibouti": "Djibouti",
      "/dominican-republic": "Dominican Republic",
      "/ecuador": "Ecuador",
      "/egypt": "Egypt",
      "/el-salvador": "El Salvador",
      "/estonia": "Estonia",
      "/ethiopia": "Ethiopia",
      "/faroeIslands": "Faroe Islands",
      "/finland": "Finland",
      "/france": "France",
      "/france-departments": "France Departments",
      "/france-new": "France New",
      "/georgia": "Georgia",
      "/germany": "Germany",
      "/greece": "Greece",
      "/guatemala": "Guatemala",
      "/guinea": "Guinea",
      "/haiti": "Haiti",
      "/honduras": "Honduras",
      "/hong-kong": "Hong Kong",
      "/hungary": "Hungary",
      "/iceland": "Iceland",
      "/india": "India",
      "/indonesia": "Indonesia",
      "/iran": "Iran",
      "/iraq": "Iraq",
      "/ireland": "Ireland",
      "/israel": "Israel",
      "/italy": "Italy",
      "/ivory-coast": "Ivory Coast",
      "/jamaica": "Jamaica",
      "/japan": "Japan",
      "/kazakhstan": "Kazakhstan",
      "/kenya": "Kenya",
      "/kosovo": "Kosovo",
      "/kyrgyzstan": "Kyrgyzstan",
      "/laos": "Laos",
      "/latvia": "Latvia",
      "/liechtenstein": "Liechtenstein",
      "/lithuania": "Lithuania",
      "/luxembourg": "Luxembourg",
      "/macedonia": "Macedonia",
      "/malaysia": "Malaysia",
      "/mali": "Mali",
      "/malta": "Malta",
      "/mexico": "Mexico",
      "/moldova": "Moldova",
      "/montenegro": "Montenegro",
      "/morocco": "Morocco",
      "/mozambique": "Mozambique",
      "/myanmar": "Myanmar",
      "/namibia": "Namibia",
      "/nepal": "Nepal",
      "/netherlands": "Netherlands",
      "/new-zealand": "New Zealand",
      "/nicaragua": "Nicaragua",
      "/nigeria": "Nigeria",
      "/norway": "Norway",
      "/oman": "Oman",
      "/pakistan": "Pakistan",
      "/palestine": "Palestine",
      "/panama": "Panama",
      "/paraguay": "Paraguay",
      "/peru": "Peru",
      "/philippines": "Philippines",
      "/poland": "Poland",
      "/portugal": "Portugal",
      "/portugal-regions": "Portugal Regions",
      "/puerto-rico": "Puerto Rico",
      "/qatar": "Qatar",
      "/romania": "Romania",
      "/russia": "Russia",
      "/rwanda": "Rwanda",
      "/san-marino": "San Marino",
      "/saudi-arabia": "Saudi Arabia",
      "/serbia": "Serbia",
    //   "/serbia-without-kosovo": "Serbia without Kosovo",
      "/sierra-leone": "Sierra Leone",
      "/singapore": "Singapore",
      "/slovakia": "Slovakia",
      "/slovenia": "Slovenia",
      "/south-africa": "South Africa",
    //   "/south-africa-2": "South Africa 2",
      "/south-korea": "South Korea",
      "/spain": "Spain",
      "/spain-provinces": "Spain provinces",
      "/sri-lanka": "Sri Lanka",
      "/sudan": "Sudan",
      "/sweden": "Sweden",
      "/switzerland": "Switzerland",
      "/syria": "Syria",
    //   "/taiwan": "Taiwan",
      "/tajikistan": "Tajikistan",
      "/thailand": "Thailand",
      "/turkey": "Turkey",
      "/uganda": "Uganda",
      "/ukraine": "Ukraine",
      "/united-arab-emirates": "United Arab Emirates",
      "/united-kingdom": "United Kingdom",
      "/united-kingdom-counties": "United Kingdom counties",
     "/usa": "United States of America",
      "/uruguay": "Uruguay",
      "/uzbekistan": "Uzbekistan",
      "/venezuela": "Venezuela",
      "/vietnam": "Vietnam",
      "/vietnam-with-islands": "Vietnam with islands",
      "/yemen": "Yemen",
      "/zambia": "Zambia",
      "/zimbabwe": "Zimbabwe",

}

export const _disabledCountries = {
    "/andorra": true,
    "/angola": true,
    "/argentina": true,
    "/armenia": true,
    "/australia": true,
    "/austria": true,
    "/azerbaijan": true,
    "/bahamas": true,
    "/bahrain": true,
    "/bangladesh": true,
    "/belarus": true,
    "/belgium": true,
    "/bhutan": true,
    "/bolivia": true,
    "/bosnia-herzegovina-1": true,
    "/bosnia-herzegovina-2": true,
    "/botswana": true,
    "/brazil": true,
    "/brunei-darussalam": true,
    "/bulgaria": true,
    "/burkina-faso": true,
    "/burundi": true,
    "/cambodia": true,
    "/cameroon": true,
    "/canada": true,
    "/cape-verde": true,
    "/central-african-republic": true,
    "/chad": true,
    "/chile": true,
    "/china": true,
    "/colombia": true,
    "/congo": true,
    "/congo-dr": true,
    "/costa-rica": true,
    "/croatia": true,
    "/cuba": true,
    "/cyprus": true,
    "/czech-republic": true,
    "/denmark": true,
    "/djibouti": true,
    "/dominican-republic": true,
    "/ecuador": true,
    "/egypt": true,
    "/el-salvador": true,
    "/estonia": true,
    "/ethiopia": true,
    "/faroeIslands": true,
    "/finland": true,
    "/france": true,
    "/france-departments": true,
    "/france-new": true,
    "/georgia": true,
    "/germany": true,
    "/greece": true,
    "/guatemala": true,
    "/guinea": true,
    "/haiti": true,
    "/honduras": true,
    "/hong-kong": true,
    "/hungary": true,
    "/iceland": true,
    "/india": true,
    "/indonesia": true,
    "/iran": true,
    "/iraq": true,
    "/ireland": true,
    "/israel": true,
    "/italy": true,
    "/ivory-coast": true,
    "/jamaica": true,
    "/japan": true,
    "/kazakhstan": true,
    "/kenya": true,
    "/kosovo": true,
    "/kyrgyzstan": true,
    "/laos": true,
    "/latvia": true,
    "/liechtenstein": true,
    "/lithuania": true,
    "/luxembourg": true,
    "/macedonia": true,
    "/malaysia": true,
    "/mali": true,
    "/malta": true,
    "/mexico": true,
    "/moldova": true,
    "/montenegro": true,
    "/morocco": true,
    "/mozambique": true,
    "/myanmar": true,
    "/namibia": true,
    "/nepal": true,
    "/netherlands": true,
    "/new-zealand": true,
    "/nicaragua": true,
    "/nigeria": true,
    "/norway": true,
    "/oman": true,
    "/pakistan": true,
    "/palestine": true,
    "/panama": true,
    "/paraguay": true,
    "/peru": true,
    "/philippines": true,
    "/poland": true,
    "/portugal": true,
    "/portugal-regions": true,
    "/puerto-rico": true,
    "/qatar": true,
    "/romania": true,
    "/russia": true,
    "/rwanda": true,
    "/san-marino": true,
    "/saudi-arabia": true,
    "/serbia": true,
    "/serbia-without-kosovo": true,
    "/sierra-leone": true,
    "/singapore": true,
    "/slovakia": true,
    "/slovenia": true,
    "/south-africa": true,
    "/south-africa-2": true,
    "/south-korea": true,
    "/spain": true,
    "/spain-provinces": true,
    "/sri-lanka": true,
    "/sudan": true,
    "/sweden": true,
    "/switzerland": true,
    "/syria": true,
    "/taiwan": true,
    "/tajikistan": true,
    "/thailand": true,
    "/turkey": true,
    "/uganda": true,
    "/ukraine": true,
    "/united-arab-emirates": true,
    "/united-kingdom": true,
    "/united-kingdom-counties": true,
    "/usa": false,
    "/uruguay": true,
    "/uzbekistan": true,
    "/venezuela": true,
    "/vietnam": true,
    "/vietnam-with-islands": true,
    "/world": true,
    "/yemen": true,
    "/zambia": true,
    "/zimbabwe": true,
}


export function getCurrentCountryFromString(url) {


    console.log("Get Current Country From String")
    // for (let c of Object.entries(countries)) {
    //     if (url.indexOf(c[1]) > -1) {
    //         return c
    //     }
    // }

    // // Default render when there is no country in the pathname
    // return ["World", "/world"]

}

/**
 * Does what it says it do
 * @param {*} map_key 
 * @param {*} mapState 
 * @param {*} mapDispatch 
 * @param {*} census 
 * @param {*} updateCensus 
 */
export function drawAnyMap(map_key, mapState, mapDispatch, census, updateCensus) {

    console.log("drawAnyMap():map_Key: ", map_key)

    axios.get('/api/datas/mapData?map_key=' + map_key, {}, {
        proxy: {
            host: 'localhost',
            port: 4000
        }
    }).then( async (res) => {

        // Actually construct the map
        initializeMap(mapState, mapDispatch, JSON.parse(res.data.geo), "country", census, updateCensus).then(() => {

            mapDispatch({
                type: "END_LOADING",
            })

            mapDispatch({   // TODO: Set nationStats to null when it's not needed. It's a memory hog
                type: "SET_NATION_STATS",
                nationStats: res.data.nation_stats
            })
        })

        // Really store the map in session storage
        // sessionStorage.setItem('current_map', JSON.stringify(res.data))
    }).catch( err => {
        // Drink
        console.error("Map utils server error", err);
    })

}

export async function initializeGlobeMap(data)
{
    console.log("Initializing globe...")
    var ws = new WorldSphere()
    ws.loadData(data.geo /*, data.countries */)    // data.countries was the list of country names for hover tooltips when that was in use
}

async function initializeMap(mapState, mapDispatch, data, mapType, census, updateCensus)
{

    // Tip: Census and upateCensus are the result of useState, but attached to the MDC

    // Initialize a new map
    var theMap = new DoDataMap(mapState.currentCountry, null, null)

    // Store references to information in theMap
    // theMap.mapTools      = buildMapTools(geoData.objects.counties.geometries)  // A json object of every county name and its state abbreviation and enumerated polygon arcs
    theMap.layer_1    = data['layer_1']     // State mesh data  (could be in ctor, but im being explicit)
    theMap.layer_2    = data['layer_2']     // County mesh data (could be in ctor, but im being explicit)
    theMap.viewport   = data['viewport']    // The SVG viewport values for this map
    // theMap.updateCensus  = updateCensus     // Census state object
    // theMap.census        = census           // updateCensus function
    theMap.MDC = { mapState: mapState, mapDispatch: mapDispatch, updateCensus: updateCensus, census: census }

    // TheMap is now part of the MDC. We can call methods on it, such as reset(), and respond to key events
    mapDispatch({...mapState, theMap: theMap, type: "ADD_THE_MAP", mapType: mapType})

    await theMap.makemap().then( e => {

        /**
         * Key event listener
         */
        window.addEventListener('keydown', function(e) {
            if (mapKeys.includes(e.key)) {
                theMap.selectKey(e.key)
            }
        });

        mapDispatch({type:"END_LOADING", mapType: "country"})

        // if (!sessionStorage.getItem("map_" + mapState.mapType)) {
        //     // save last map
        //     sessionStorage.setItem("map_" + mapState.mapType, JSON.stringify(data))
        // }


    }).catch( err => {
        console.log("Failed to load USA: ", err)
    })

}

export function selectCountry (mapInfo, dispatch) {

    console.log("Map utils.js:: selectCountry")
    let url = new URL(window.location)
    
    var currentCountryTitle = mapInfo[0] // ex: "Argentina"
    var currentCountry = mapInfo[1]      // ex: "/argentina"
    var countrySlug = mapInfo[1].split("/")[1]
    console.log("Country Slug", countrySlug)
    url.searchParams.set("q", countrySlug)

    // Current country slug goes to sessionStorage
    sessionStorage.setItem("cc_slug", countrySlug)

    window.history.pushState(
        {tabId:mapInfo[1]},
        mapInfo[0],
        url.pathname + url.search
    )

    /**
     * @IMPORTANT
     * The presence of mapType causes <Nation> to render.
     * This dispatch does not trigger any useStates in the Context/Provider,
     * 
     * This will fetch the map data from Redis and draw it.
     * it's simply conditional rendering.
     */
    dispatch({
        type: "UPDATE_COUNTRY",
        currentCountry: currentCountry,
        currentCountryTitle: currentCountryTitle,
        mapType: "country"
    })

}

export const data_series_lookup_table = {

    "SP.POP.TOTL"       : "Pop, total",
    "SP.POP.TOTL.FE.IN" : "Pop, female",
    "SP.POP.TOTL.MA.IN" : "Pop, male",
    "EN.POP.DNST"       : "Pop density (people per sq. km of land area)",
    "ST.INT.ARVL"       : "International tourism, number of arrivals",
    "ST.INT.DPRT"       : "International tourism, number of departures",
    "SP.POP.1564.TO"    : "Pop ages 15-64, total",
    "SP.POP.1564.TO.ZS" : "Pop ages 15-64 (% of total Pop)",
    "SP.POP.1564.FE.IN" : "Pop ages 15-64, female",
    "SP.POP.1564.FE.ZS" : "Pop ages 15-64, female (% of females)",
    "SP.POP.1564.MA.IN" : "Pop ages 15-64, male",
    "SP.POP.1564.MA.ZS" : "Pop ages 15-64, male (% of males)",
    "SP.POP.65UP.TO"    : "Pop ages 65 and above, total",
    "SP.POP.65UP.TO.ZS" : "Pop ages 65 and above (% of total)",
    "SP.POP.65UP.FE.IN" : "Pop ages 65 and above, female",
    "SP.POP.65UP.FE.ZS" : "Pop ages 65 and above, female (% of females)",
    "SP.POP.65UP.MA.IN" : "Pop ages 65 and above, male",
    "SP.POP.65UP.MA.ZS" : "Pop ages 65 and above, male (% of males)",
    "SP.RUR.TOTL"       : "Rural Pop",
    "SP.RUR.TOTL.ZS"    : "Rural Pop (% of total)",
    "SP.RUR.TOTL.ZG"    : "Rural Pop growth (annual %)",
    "SP.URB.TOTL"       : "Urban Pop",
    "SP.URB.TOTL.IN.ZS" : "Urban Pop (% of total)",
    "SP.URB.GROW"       : "Urban Pop growth (annual %)",
    "EG.ELC.ACCS.RU.ZS" : "Access to electricity, rural (% of rural pop.)",
    "EG.ELC.ACCS.UR.ZS" : "Access to electricity, urban (% of urban pop.)",
    "EG.USE.COMM.FO.ZS" : "Fossil fuel energy consumption (% of total)",
    "EN.ATM.CO2E.KT"    : "CO2 emissions (kilotons)",
    "EN.ATM.CO2E.GF.KT" : "CO2 emissions from gaseous fuel consumption (kt)",
    "EN.CO2.ETOT.ZS"    : "CO2 emissions from electricity and heat production, total (% of total fuel combustion)",
    "EN.CO2.TRAN.ZS"    : "CO2 emissions from transport (% of total fuel combustion)",
    "EN.ATM.METH.AG.KT.CE"  : "Agricultural methane emissions (thousand metric tons of CO2 equivalent)",
    "EN.ATM.METH.AG.ZS"     : "Agricultural methane emissions (% of total)",
    "EN.ATM.METH.EG.ZS"     : "Energy related methane emissions (% of total)",
    "EG.ELC.RNWX.ZS"    : "Percentage of total electricity production from renewable sources, excluding hydroelectric",
    "EG.ELC.HYRO.ZS"    : "Percentage of total electricity production from hydroelectric sources",
    "EG.ELC.NUCL.ZS"    : "Percentage of total electricity production from nuclear sources.",
    "EG.ELC.PETR.ZS"    : "Percentage of total electricity production from oil sources",
    "EG.ELC.NGAS.ZS"    : "Percentage of total electricity production from natural gas sources.",
    "EG.ELC.COAL.ZS"    : "Percentage of total electricity production from coal sources",
    "EN.ATM.PM25.MC.T3.ZS"  : "Percentage of Pop exposed to levels of air pollution in excess of WHO health guidelines.",
    "ER.H2O.INTR.PC"    : "Renewable internal freshwater resources per capita (cubic meters)",
    "AG.LND.TOTL.UR.K2" : "Urban land area (sq. km)",
    "AG.LND.TOTL.RU.K2" : "Rural land area (sq. km)",
    "AG.LND.ARBL.ZS"    : "Arable land (% of land area)",
    "AG.LND.FRST.K2"    : "Forest area (sq. km)",
    "EN.BIR.THRD.NO"    : "Bird species, threatened",
    "ER.PTD.TOTL.ZS"    : "Terrestrial and marine protected areas (% of total territorial area)",
    "SE.SEC.TCHR"       : "Secondary education, teachers",
    "SE.TER.CUAT.DO.FE.ZS"  : "Educational attainment, Doctoral or equivalent, Pop 25+, female (%) (cumulative)",
    "SE.TER.CUAT.DO.MA.ZS"  : "Educational attainment, Doctoral or equivalent, Pop 25+, male (%) (cumulative)",
    "SE.PRM.ENRL.TC.ZS"     : "Pupil-teacher ratio, primary",
    "SE.SEC.ENRL.TC.ZS"     : "Pupil-teacher ratio, secondary",
    "SE.SEC.ENRL.UP.TC.ZS"  : "Pupil-teacher ratio, upper secondary",
    "SE.TER.ENRL.TC.ZS"     : "Pupil-teacher ratio, tertiary",
    "SE.PRM.PRIV.ZS"    : "School enrollment, primary, private (% of total primary)",
    "SE.SEC.PRIV.ZS"    : "School enrollment, secondary, private (% of total secondary)",
    "SP.POP.SCIE.RD.P6" : "Researchers in R&D (per million people)",
    "SH.STA.BRTC.ZS"    : "Births attended by skilled health staff (% of total)",
    "SH.MED.BEDS.ZS"    : "Hospital beds (per 1,000 people)",
    "SH.STA.SUIC.MA.P5" : "Suicide mortality rate, male (per 100,000 male Pop)",
    "SN.ITK.DEFC.ZS"    : "Prevalence of undernourishment (% of Pop)",
    "NY.GDP.MKTP.CN"    : "GDP (current LCU)",
    "NY.GDP.MKTP.KN"    : "GDP (constant LCU)",
    "NY.GDP.PCAP.CN"    : "GDP per capita (current LCU)",
    "NY.GDP.PCAP.KN"    : "GDP per capita (constant LCU)",
    "NY.GDP.PCAP.KD.ZG" : "GDP per capita growth (annual %)",
    "NY.GDS.TOTL.CN"    : "Gross domestic savings (current LCU)",
    "NE.GDI.TOTL.CN"    : "Gross capital formation (current LCU)",
    "SL.UEM.TOTL.NE.ZS" : "Unemployment, total (% of total labor force) (national estimate)",
    "FM.AST.NFRG.CN"    : "Net foreign assets",
    "GC.TAX.EXPT.CN"    : "Taxes on exports (current LCU)",
    "GC.TAX.EXPT.ZS"    : "Taxes on exports (% of tax revenue)",
    "GC.REV.XGRT.CN"    : "Revenue, excluding grants (current LCU)",
    "GC.REV.XGRT.GD.ZS" : "Revenue, excluding grants (% of GDP)",
    "BX.GSR.TRVL.ZS"    : "Travel services (% of service exports, BoP)",
    "GC.TAX.YPKG.RV.ZS" : "Taxes on income, profits and capital gains (% of revenue)",
    "GC.XPN.INTP.ZS"    : "Interest payments (% of expense)",
    "TX.VAL.TECH.MF.ZS" : "High-technology exports (% of manufactured exports)",
    "NE.DAB.TOTL.KN"    : "Gross national expenditure (constant LCU)",
    "FR.INR.LEND"       : "Lending interest rate (%)",
    "IP.PAT.RESD"       : "Patent applications, residents",
    "IP.PAT.NRES"       : "Patent applications, nonresidents",
    "IP.TMK.TOTL"       : "Trademark applications, total",
    "NY.GDP.MINR.RT.ZS" : "Mineral rents (% of GDP)",
    "IT.NET.SECR"       : "Secure Internet servers",
    "IT.NET.USER.ZS"    : "Individuals using the Internet (% of Pop)",
    "TM.VAL.AGRI.ZS.UN" : "Agricultural raw materials imports (% of merchandise imports)",
    "TX.VAL.AGRI.ZS.UN" : "Agricultural raw materials exports (% of merchandise exports)",
    "TM.VAL.FOOD.ZS.UN" : "Food imports (% of merchandise imports)",
    "TX.VAL.FOOD.ZS.UN" : "Food exports (% of merchandise exports)",
    "IS.RRS.TOTL.KM"    : "Rail lines (total route-km)",
    "IS.AIR.DPRT"       : "Air transport, registered carrier departures worldwide",
    "IS.AIR.PSGR"       : "Air transport, passengers carried",
    "MS.MIL.XPND.CN"    : "Military expenditure (current LCU)",
    "MS.MIL.XPND.GD.ZS" : "Military expenditure as a percentage of GDP",
    "MS.MIL.XPND.ZS"    : "Military expenditure (% of general government expenditure)",

}

