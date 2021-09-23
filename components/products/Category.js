import React from 'react'

const Category = ({ categories, setActiveCategory, activeCategory }) => {
  return (
    <div className='row g-1 mb-2'>
      {categories &&
        categories.map((category) => (
          <div key={category._id} className='col-lg-3 col-md-4 col-6'>
            <button
              onClick={() => setActiveCategory(category._id)}
              className={`btn btn-light form-control ${
                activeCategory === category._id &&
                'shadow-lg border border-light btn-primary'
              }`}
            >
              {category.name}
            </button>
          </div>
        ))}
    </div>
  )
}

export default Category
