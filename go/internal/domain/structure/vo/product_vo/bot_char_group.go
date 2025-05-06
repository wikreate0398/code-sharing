package product_vo

import "encoding/json"

type BotGroupChars struct {
	Ids  string `json:"ids"`
	Name string `json:"name"`
}

func BotGroupCharsToStruct(value string) BotGroupChars {
	var b BotGroupChars
	_ = json.Unmarshal([]byte(value), &b)
	return b
}

func (s *BotGroupChars) BotGroupCharsToStr() string {
	data, err := json.Marshal(s)
	if err != nil {
		return ""
	}
	return string(data)
}
