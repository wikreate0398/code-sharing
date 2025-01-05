package catalog

import (
	"encoding/json"
	"fmt"
	"time"
)

type GenerateNamesQueue struct {
	input *payloadInput
}

type payloadInput struct {
	id_group  int            `json:"id_group"`
	ids_chars map[int]string `json:"ids_chars"`
	ids_val   map[int]string `json:"ids_val"`
}

func NewGenerateNamesQueue() *GenerateNamesQueue {
	return new(GenerateNamesQueue)
}

func (r *GenerateNamesQueue) Handle() {
	fmt.Printf("Received a message: %+v", r.input)
	fmt.Printf("Sleeping")
	time.Sleep(10 * time.Second)
	fmt.Printf("wake up")
}

func (r *GenerateNamesQueue) ToStruct(result []byte) {
	json.Unmarshal(result, &r.input)
}
