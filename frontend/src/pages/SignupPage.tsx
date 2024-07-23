import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Helmet } from 'react-helmet-async'
import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useSignupMutation } from '../hooks/userHooks'
import Button from 'react-bootstrap/Button'

export default function SignupPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState<boolean>(false)

  const { state, dispatch } = useContext(Store)
  const { userInfo, mode } = state

  const { mutateAsync: signup, isLoading } = useSignupMutation()

  const handleShow = () => {
    setShow(!show)
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const data = await signup({
        name,
        email,
        password,
      })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate(redirect || '/')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={show ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={handleShow}
              style={{ color: mode === "Dark" ? "black" : "white" }}
            >
              {show ? <i className="fa-solid fa-eye-slash" /> : <i className="fa-solid fa-eye"></i>}
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={show ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={handleShow}
              style={{ color: mode === "Dark" ? "black" : "white" }}
            >
              {show ? <i className="fa-solid fa-eye-slash" /> : <i className="fa-solid fa-eye"></i>}
            </Button>
          </InputGroup>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  )
}
