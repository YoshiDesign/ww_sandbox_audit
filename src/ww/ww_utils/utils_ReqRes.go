package ww_utils

// import(
// 	"time"
// )

/**
Request & Response Interfaces -- as denoted by their names
*/
type WLDataRequest struct {
	V_1      string `json:"V_1,omitempty" bson:"V_1,omitempty"`
	V_2      string `json:"V_2,omitempty" bson:"V_2,omitempty"`
	Occ_code string `json:"Occ_code,omitempty" bson:"Occ_code,omitempty"`
}

type WLInfoRequest struct {
	Fips string `json:"fips,omitempty" bson:"fips,omitempty"`
}

// type WLInstantRequest struct {
// 	// Type of the query (Occ / Loc)
// 	B string `json:",omitempty" bson:"fips,omitempty"`
// 	Query string `json:",omitempty" bson:"fips,omitempty"`
// }
type MapDataResponse struct {
	Geo         string      `json:"geo"`
	NationStats interface{} `json:"nation_stats"`
}

type AuthenticatedResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
}

type UserSignupRequest struct {
	Name            string `json:"name,omitempty" bson:"name,omitempty"`
	Handle          string `json:"handle,omitempty" bson:"handle,omitempty"`
	Email           string `json:"email,omitempty" bson:"email,omitempty"`
	Password        string `json:"password,omitempty" bson:"password,omitempty"`
	PasswordConfirm string `json:"passwordConfirm,omitempty" bson:"passwordConfirm,omitempty"`
	Agree           bool   `json:"agree,omitempty" bson:"agree,omitempty"`
}
type UserLoginRequest struct {
	Email    string `json:"email,omitempty" bson:"email,omitempty"`
	Password string `json:"password,omitempty" bson:"password,omitempty"`
}

type WLDataResponse struct {
	Dbuffer string `json:"dbuff"`
	CDomain string `json:"cDomain"`
}

type TypeaheadResponse struct {
	// Perf   time.Duration    `json:"perf"`
	Results string `json:"results"`
}
