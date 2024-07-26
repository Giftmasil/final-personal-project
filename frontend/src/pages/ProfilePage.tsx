import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { ApiError } from '../types/ApiError';
import LoadingBox from '../components/LoadingBox';
import { useUpdateProfileMutation } from '../hooks/userHooks';
import { InputGroup } from 'react-bootstrap';

export default function ProfilePage() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo!.name);
  const [email, setEmail] = useState(userInfo!.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: updateProfile, isLoading } = useUpdateProfileMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      const data = await updateProfile({
        name,
        email,
        password,
      });

      dispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash" />
              ) : (
                <i className="fa-solid fa-eye" />
              )}
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <i className="fa-solid fa-eye-slash" />
              ) : (
                <i className="fa-solid fa-eye" />
              )}
            </Button>
          </InputGroup>
        </Form.Group>
        <div className="mb-3">
          <Button disabled={isLoading} type="submit">
            Update
          </Button>
          {isLoading && <LoadingBox />}
        </div>
      </form>
    </div>
  );
}
