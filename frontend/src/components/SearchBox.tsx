import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    navigate(query ? `/search/?query=${query}` : '/search')
  }

  return (
    <Form className="flex-grow-1 d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          style={{borderRadius: "30px 0 0 30px"}} // Adjust border radius to fit the button inside the input area
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search For Item"
          aria-label="Search For Item"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search" style={{borderRadius: "0 30px 30px 0"}}>
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  )
}
