import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import { ApiError } from '../types/ApiError'
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../hooks/productHooks'

export default function ProductEditPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { id: productId } = params

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [banner, setBanner] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId!)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setSlug(product.slug)
      setPrice(product.price)
      setImage(product.image)
      setImages(product.images)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setBrand(product.brand)
      setDescription(product.description)
      setBanner(product.banner || '')
      setIsFeatured(product.isFeatured)
    }
  }, [product])

  const { mutateAsync: updateProduct, isLoading: loadingUpdate } =
    useUpdateProductMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await updateProduct({
        _id: productId!,
        name,
        slug,
        price,
        image,
        images,
        category,
        brand,
        countInStock,
        description,
        banner,
        isFeatured,
      })
      toast.success('Product updated successfully')
      navigate('/admin/products')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const addImageHandler = (url: string) => {
    setImages([...images, url])
  }

  const deleteFileHandler = async (fileName: string) => {
    setImages(images.filter((x) => x !== fileName))
    toast.success('Image removed successfully. Click Update to apply it')
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form.Group className="mb-3" controlId="additionalImageURL">
              <Form.Label>Additional Image URL</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => addImageHandler(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="banner">
            <Form.Label>Banner URL</Form.Label>
            <Form.Control
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="isFeatured">
            <Form.Check
              type="checkbox"
              label="Is Featured?"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  )
}
