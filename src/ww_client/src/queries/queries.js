import { gql } from 'apollo-boost';

// COL ++ 
const getCOLQuery = gql`{
    counties {
        fip
        col
    }
}
`
const getCOLMHCQuery = gql`{
    counties {
        fip
        col
        mhc
    }
}
`
const getCOLRAVQuery = gql`{
counties {
    fip
    col
    rav
}

}
`
const getCOLRAV_0Query = gql`{
counties {
    fip
    col
    rav_0
}

}
`
const getCOLRAV_1Query = gql`{
counties {
    fip
    col
    rav_1
}
}
`
const getCOLRAV_2Query = gql`{
counties {
    fip
    col
    rav_2
}
}
`
const getCOLRAV_3Query = gql`{
counties {
    fip
    col
    rav_3
}
}
`
const getCOLRAV_4Query = gql`{
counties {
    fip
    col
    rav_4
}
}
`

// MHC ++
const getMHCQuery = gql`{
counties {
    fip
    mhc
}
}
`
const getMHCRAVQuery = gql`{
counties {
    fip
    mhc
    rav
}
}
`
const getMHCRAV_0Query = gql`{
counties {
    fip
    mhc
    rav_0
}
}
`
const getMHCRAV_1Query = gql`{
counties {
    fip
    mhc
    rav_1
}
}
`
const getMHCRAV_2Query = gql`{
counties {
    fip
    mhc
    rav_2
}
}
`
const getMHCRAV_3Query = gql`{
counties {
    fip
    mhc
    rav_3
}
}
`
const getMHCRAV_4Query = gql`{
counties {
    fip
    mhc
    rav_4
}
}
`

// RAV ++
const getRAVQuery = gql`{
counties {
    fip
    rav
}
}
`
const getRAVRAV_0Query = gql`{
counties {
    fip
    rav
    rav_0
}
}
`
const getRAVRAV_1Query = gql`{
counties {
    fip
    rav
    rav_1
}
}
`
const getRAVRAV_2Query = gql`{
counties {
    fip
    rav
    rav_2
}
}
`
const getRAVRAV_3Query = gql`{
counties {
    fip
    rav
    rav_3
}
}
`
const getRAVRAV_4Query = gql`{
counties {
    fip
    rav
    rav_4
}
}
`

// R_0 ++
const getRAV_0Query = gql`{
counties {
    fip
    rav_0
}
}
`
const getRAV_0RAV_1Query = gql`{
counties {
    fip
    rav_0
    rav_1
}
}
`
const getRAV_0RAV_2Query = gql`{
counties {
    fip
    rav_0
    rav_2
}
}
`
const getRAV_0RAV_3Query = gql`{
counties {
    fip
    rav_0
    rav_3
}
}
`
const getRAV_0RAV_4Query = gql`{
counties {
    fip
    rav_0
    rav_4
}
}
`

// R_1 ++
const getRAV_1Query = gql`{
counties {
    fip
    rav_1
}
}
`
const getRAV_1RAV_2Query = gql`{
counties {
    fip
    rav_1
    rav_2
}
}
`
const getRAV_1RAV_3Query = gql`{
counties {
    fip
    rav_1
    rav_3
}
}
`
const getRAV_1RAV_4Query = gql`{
counties {
    fip
    rav_1
    rav_4
}
}
`

// R_2 ++
const getRAV_2Query = gql`{
counties {
    fip
    rav_2
}
}
`
const getRAV_2RAV_3Query = gql`{
counties {
    fip
    rav_2
    rav_3
}
}
`
const getRAV_2RAV_4Query = gql`{
counties {
    fip
    rav_2
    rav_4
}
}
`

// R_3 ++
const getRAV_3Query = gql`{
counties {
    fip
    rav_3
}
}
`
const getRAV_3RAV_4Query = gql`{
counties {
    fip
    rav_3
    rav_4
}
}
`

// R_4
const getRAV_4Query = gql`{
counties {
    fip
    rav_4
}
}
`

export {
    getCOLQuery,
    getCOLMHCQuery,
    getCOLRAVQuery,
    getCOLRAV_0Query,
    getCOLRAV_1Query,
    getCOLRAV_2Query,
    getCOLRAV_3Query,
    getCOLRAV_4Query,
    getMHCQuery,
    getMHCRAVQuery,
    getMHCRAV_0Query,
    getMHCRAV_1Query,
    getMHCRAV_2Query,
    getMHCRAV_3Query,
    getMHCRAV_4Query,
    getRAVQuery,
    getRAVRAV_0Query,
    getRAVRAV_1Query,
    getRAVRAV_2Query,
    getRAVRAV_3Query,
    getRAVRAV_4Query,
    getRAV_0Query,
    getRAV_0RAV_1Query,
    getRAV_0RAV_2Query,
    getRAV_0RAV_3Query,
    getRAV_0RAV_4Query,
    getRAV_1Query,
    getRAV_1RAV_2Query,
    getRAV_1RAV_3Query,
    getRAV_1RAV_4Query,
    getRAV_2Query,
    getRAV_2RAV_3Query,
    getRAV_2RAV_4Query,
    getRAV_3Query,
    getRAV_3RAV_4Query,
    getRAV_4Query
};