package mysql

import (
	"fmt"
	"reflect"
	"strings"
	"time"
)

type BatchUpdate struct {
	table      string
	identifier string
	arg        interface{}
}

func NewBatchUpdate(table, identifier string, arg interface{}) *BatchUpdate {
	return &BatchUpdate{table, identifier, arg}
}

func (b *BatchUpdate) Query() (string, error) {
	type value struct {
		fieldTag   string
		fieldValue any
	}

	var whereIn []string
	set := make(map[string][]string)

	tOf := reflect.TypeOf(b.arg)

	if tOf.Kind() != reflect.Slice {
		return "", fmt.Errorf("Arg must be a slice")
	}

	valueOf := reflect.ValueOf(b.arg)
	for i := 0; i < valueOf.Len(); i++ {
		row := valueOf.Index(i)
		typ := row.Type()

		structValues := make(map[any]value)
		for i := 0; i < typ.NumField(); i++ {
			field := typ.Field(i) // Получаем информацию о поле
			fieldTag := field.Tag.Get("db")

			var val = row.Field(i).Interface()

			switch v := val.(type) {
			case time.Time:
				val = v.Format("2006-01-02 15:04:05")
			case bool:
				if val == true {
					val = 1
				} else {
					val = 0
				}
			default:
				//
			}

			structValues[fieldTag] = value{
				fieldTag:   fieldTag,
				fieldValue: val,
			}
		}

		identifierVal := structValues[b.identifier].fieldValue
		for _, val := range structValues {
			if val.fieldTag == b.identifier {
				continue
			}

			v := val.fieldValue
			if _, ok := v.(string); ok {
				v = b.escapeSQL(fmt.Sprintf("%v", v))
			}

			str := fmt.Sprintf("WHEN %s = %v THEN '%v'", b.identifier, identifierVal, v)
			set[val.fieldTag] = append(set[val.fieldTag], str)
		}

		whereIn = append(whereIn, fmt.Sprintf("%v", identifierVal))
	}

	format := "UPDATE `%s` SET %s where %s in (%s)"
	return fmt.Sprintf(format,
		b.table,
		b.fieldCaseStringfy(set),
		b.identifier,
		strings.Join(whereIn, ","),
	), nil
}

func (b BatchUpdate) escapeSQL(value string) string {
	return strings.ReplaceAll(value, "'", "\\'")
}

func (b BatchUpdate) fieldCaseStringfy(set map[string][]string) string {
	fields := []string{}
	for field, val := range set {
		str := fmt.Sprintf(` %s = (CASE %s ELSE %s END)`, field, strings.Join(val, " "), field)
		fields = append(fields, str)
	}

	return strings.Join(fields, ", ")
}
