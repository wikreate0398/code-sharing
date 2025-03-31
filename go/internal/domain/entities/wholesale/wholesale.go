package wholesale

type Wholesale struct {
	id   int
	name string
}

func NewWholesale(id int, name string) Wholesale {
	return Wholesale{id: id, name: name}
}

func (p *Wholesale) Id() int {
	return p.id
}
