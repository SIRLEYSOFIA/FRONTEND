interface Category {
  id: string
  name: string
}

interface CategoryFilterProps {
  categories: Category[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="tablist" aria-label="Product categories">
      <button
        role="tab"
        aria-selected={selected === null}
        className={`category-pill ${selected === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={selected === cat.id}
          className={`category-pill ${selected === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
