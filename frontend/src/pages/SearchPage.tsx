import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getError } from '../utils'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Rating from '../components/Rating'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import ProductItem from '../components/ProductItem'
import { LinkContainer } from 'react-router-bootstrap'
import { ApiError } from '../types/ApiError'
import {
  useGetCategoriesQuery,
  useSearchProductsQuery,
} from '../hooks/productHooks'
import { useContext } from 'react'
import { Store } from '../Store'

const prices = [
  {
    name: 'Ksh. 1 to Ksh. 5000',
    value: '1-5000',
  },
  {
    name: 'Ksh. 5001 to Ksh. 30000',
    value: '5001-30000',
  },
  {
    name: 'Ksh. 30001 to Ksh. 300000',
    value: '30001-300000',
  },
]

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const price = sp.get('price') || 'all'
  const rating = sp.get('rating') || 'all'
  const order = sp.get('order') || 'newest'
  const page = Number(sp.get('page') || 1)
  const { state: { mode }, dispatch } = useContext(Store)

  const { data, isLoading, error } = useSearchProductsQuery({
    category,
    order,
    page,
    price,
    query,
    rating,
  })

  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useGetCategoriesQuery()

  const getFilterUrl = (
    filter: {
      category?: string
      price?: string
      rating?: string
      order?: string
      page?: number
      query?: string
    },
    skipPathname: boolean = false
  ) => {
    const filterPage = filter.page || page
    const filterCategory = filter.category || category
    const filterQuery = filter.query || query
    const filterRating = filter.rating || rating
    const filterPrice = filter.price || price
    const sortOrder = filter.order || order
    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
  }

  const getLinkClassName = (isActive:boolean, isDarkMode:boolean) => {
    let className = isDarkMode ? 'search-links-dark' : 'search-links-light'
    if (isActive) {
      className += ' text-bold'
    }
    return className
  }

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <div className={mode === "light" ? 'search-product-div search-product-light' : "search-product-div"}>
            <h3>Department</h3>
            <ul className='search-product-ul'>
              <li>
                <Link
                  className={getLinkClassName('all' === category, mode === 'dark')}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {loadingCategories ? (
                <LoadingBox />
              ) : error ? (
                <MessageBox variant="danger">
                  {getError(errorCategories as ApiError)}
                </MessageBox>
              ) : (
                categories!.map((c) => (
                  <li key={c}>
                    <Link
                      className={getLinkClassName(c === category, mode === 'dark')}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className={mode === "light" ? 'search-product-div search-product-light' : "search-product-div"}>
            <h3>Price</h3>
            <ul className='search-product-ul'>
              <li>
                <Link
                  className={getLinkClassName('all' === price, mode === 'dark')}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={getLinkClassName(p.value === price, mode === 'dark')}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={mode === "light" ? 'search-product-div search-product-light' : "search-product-div"}>
            <h3>Avg. Customer Review</h3>
            <ul className='search-product-ul'>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating.toString() })}
                    className={getLinkClassName(`${r.rating}` === `${rating}`, mode === 'dark')}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={getLinkClassName(rating === 'all', mode === 'dark')}
                >
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {isLoading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">
              {getError(error as ApiError)}
            </MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {data!.countProducts === 0 ? 'No' : data!.countProducts}{' '}
                    Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }))
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {data!.products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {data!.products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <ProductItem product={product}></ProductItem>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(data!.pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/search',
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}
