import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label, Form,
  Alert,
  Input
} from 'reactstrap';

import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/userAuthService';

function Login() { 
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await authService.Login(formData);
    const { data } = res;
    if (data?.errors != null) {
      setErrorMessage(data?.errors[0]?.msg)
    }
    else {
      setErrorMessage("")
    }
    if (data?.error != null) {
      setErrorMessage(data?.error)
    } 

    localStorage.setItem("token", data?.data?.token);
    if (data?.data?.token != null) { 
      
      navigate("/user/estimate");
    }

  };

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <CardBody className="pt-0">
                  <div className="p-3">
                    <h4 className="text-muted font-size-18 mb-1 text-center">Welcome Back User!</h4>
                    <p className="text-muted text-center">Sign in to continue to Lexa.</p>
                    <Form className="form-horizontal mt-4" onSubmit={handleSubmit}>
                      <div className="mb-3">

                        {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}

                        <Label htmlFor="username">Username</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="userpassword">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                      <Row className="mb-3 mt-4">
                        <div className="col-6">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="customControlInline"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="customControlInline">Remember me</label>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Log In</button>
                        </div>
                      </Row>
                      <Row className="form-group mb-0">
                        <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock"></i> Forgot your password?</Link>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>Don't have an account ? <Link to="/register" className="text-primary"> Signup Now </Link></p>
                © {new Date().getFullYear()} Lexa <span className="d-none d-sm-inline-block"> - Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand.</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Login;
