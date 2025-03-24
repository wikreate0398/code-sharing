package iso_vo

var (
	RUB ISO = "RUB"
	UZS ISO = "UZS"
	USD ISO = "USD"
	AED ISO = "AED"
)

var ISOFields = map[ISO]string{
	RUB: "RUB",
	UZS: "UZS",
	USD: "USD",
	AED: "AED",
}

var isoRoundStep = map[ISO]map[bool]float64{
	RUB: {
		true:  10,
		false: 50,
	},
	UZS: {
		true:  10,
		false: 50,
	},
	USD: {
		true:  1,
		false: 0.1,
	},
	AED: {
		true:  1,
		false: 0.1,
	},
}

type ISO string

func (iso ISO) String() string {
	return ISOFields[iso]
}

func (iso ISO) RoundStep(flag bool) float64 {
	return isoRoundStep[iso][flag]
}
