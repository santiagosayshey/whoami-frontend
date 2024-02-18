import React, { useState, useEffect } from 'react'; // Import useEffect
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleSignupModal = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        setShowLoginModal(false);
        setUser(data.user);
        setError('');
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in local storage
      } else {
        setError(data.message || 'An error occurred during login.');
      }
    } catch (error) {
      setError('There was a problem with the login request: ' + error.message);
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError(''); // Clear previous error messages
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (response.ok) {
        setShowSignupModal(false);
        setSignupData({ firstName: '', lastName: '', email: '', password: '' });
        // Optionally, directly log the user in after signup
        setUser(data.user); // Adjust according to the response structure
      } else {
        setError(data.message || 'An error occurred during signup.');
      }
    } catch (error) {
      setError('There was a problem with the signup request: ' + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div className='container'>
      <nav className='navbar navbar-expand-lg'>
        <a className="navbar-brand" href="/">whoami</a>
        <div className="ms-auto">
          {user ? (
            <Button className="btn btn-outline-primary me-4" onClick={handleLogout}>Log out</Button>
          ) : (
            <>
              <Button className="btn btn-outline-primary me-3" onClick={handleLoginModal}>Login</Button>
              <Button className="btn btn-outline-secondary me-4" onClick={handleSignupModal}>Sign Up</Button>
            </>
          )}
        </div>
      </nav>
      {/* Login Modal*/}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstName"
                value={signupData.firstName}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={signupData.lastName}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Sign Up</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Dashboard userId={user ? user.id : null} />
    </div>
  );
}

export default App;
