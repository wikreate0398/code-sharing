package helpers

import "strconv"

func SliceIntValToString(slice []int) []string {
	var stringSlice []string
	for i := 0; i < len(slice); i++ {
		stringSlice = append(stringSlice, IntToString(slice[i]))
	}

	return stringSlice
}

func SliceStrValToInt(slice []string) []int {
	data := make([]int, len(slice))
	for i := 0; i < len(slice); i++ {
		id, _ := strconv.Atoi(slice[i])
		data[i] = id
	}

	return data
}

func SliceIntValToInterface(slice []int) []interface{} {
	var stringSlice []interface{}
	for i := 0; i < len(slice); i++ {
		stringSlice = append(stringSlice, IntToString(slice[i]))
	}

	return stringSlice
}
