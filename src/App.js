import './App.css';
import React, { useState, useEffect } from 'react';
import { auth } from './FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import styled from 'styled-components';
import { Col, Button, Row, Container, Card, Form, Modal, ListGroup, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useNavigate, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BsCloudUpload, BsCloudDownload, BsPeople } from 'react-icons/bs';
import { Spinner, Alert } from 'react-bootstrap';





function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('')

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConPasswordChange = (e) => setConPassword(e.target.value);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== conpassword) {
      alert("Passwords do not match")
      return
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        setUser(userCredential.user)
        navigate("/", { replace: true })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode)
        // ..
      });

  };

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="px-4">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center text-uppercase">
                    <SecureText>Secure</SecureText> - <CloudText>Cloud</CloudText>
                  </h2>
                  <div className="mb-3">
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={conpassword} onChange={handleConPasswordChange} />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Create Account
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Already have an account??{' '}
                        <a href="/" className="text-primary fw-bold">
                          Sign In
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function SignIn({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        setUser(userCredential.user)
        navigate("/", { replace: true })
      })
      .catch((error) => {
        // Handle sign-in errors here
        alert(error);
      });

  };

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="px-4">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center text-uppercase">
                    <SecureText>Secure</SecureText> - <CloudText>Cloud</CloudText>
                  </h2>
                  <div className="mb-3">
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Sign In
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Dont have an account??{' '}
                        <a href="signup" className="text-primary fw-bold" >
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


const GroupList = ({ user }) => {
  const [people, setPeople] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const id = e.target.name.value;
    const response = await fetch(`https://secure-cloud.herokuapp.com/add-to-group?group_id=${user.uid}&user_id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      console.log(response)
      getGroup();
      setShowAddModal(false);
    } else {
      console.error("Failed to add person:", response);
    }
  };

  const handleRemoveClick = (person) => {
    setSelectedPerson(person);
    setShowRemoveModal(true);
  };

  const handleRemoveSubmit = async () => {
    const response = await fetch(`https://secure-cloud.herokuapp.com/remove-from-group?group_id=${user.uid}&user_id=${selectedPerson}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      getGroup();
      setShowRemoveModal(false);
      setSelectedPerson(null);
    } else {
      console.error("Failed to remove person:", response);
    }
  };

  const getGroup = async () => {
    const response = await fetch(`https://secure-cloud.herokuapp.com/get-group/${user.uid}`);
    if (response.ok) {
      const group = await response.json();
      setPeople(group);
      setLoading(false);
    } else {
      console.error("Failed to get group:", response);
    }
  };
  useEffect(() => {
    getGroup();
  }, []);

  return (
    <>
      {
        loading ? (
          <div className="d-flex justify-content-center align-items-center vh-100" >
            <Spinner animation="border" />
          </div >
        ) : (
          <div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <h2 className="fw-bold mb-2 text-center text-uppercase" style={{ fontSize: "64px" }}>
                <SecureText>Secure</SecureText> - <CloudText>Cloud</CloudText>
              </h2>
            </Link>
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
              <Modal.Header closeButton className="mx-auto">
                <Modal.Title>Add To Group</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleAddSubmit}>
                  <Form.Group controlId="name">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter ID" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
            <Button className="mt-3" variant="primary" onClick={handleAddClick}>
              Add
            </Button>
            <ListGroup className="mt-3" style={{}}>
              {people && people.map((person) => (console.log(person),
                <ListGroup.Item key={person} className="d-flex justify-content-between align-items-center">
                  {person}
                  <Button variant="danger" onClick={() => handleRemoveClick(person)}>
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Remove Person</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to remove {selectedPerson?.name} from the group?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleRemoveSubmit}>
                  Remove
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
    </>
  );
};


const UploadPage = ({ user }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`https://secure-cloud.herokuapp.com/upload-file?id=${user.uid}`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      setSuccess("File uploaded successfully");
      setError(null);
    } else {
      setError("Failed to upload file");
      setSuccess(null);
    }
    setLoading(false);
  };

  return (
    <>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="fw-bold mb-2 text-center text-uppercase" style={{ fontSize: "64px" }}>
          <SecureText>Secure</SecureText> - <CloudText>Cloud</CloudText>
        </h2>
      </Link>
      <Form className="mt-3 mx-auto w-75">
        <Form.Group controlId="file">
          <Form.Label>File</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button className='mx-auto' variant="primary" onClick={handleUpload}>
          Upload
        </Button>
      </Form>

      {loading && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger" className='mx-auto w-75 mt-4'>{error}</Alert>}
      {success && <Alert variant="success" className='mx-auto w-75 mt-4'>{success}</Alert>}
    </>
  );
};







const FileList = ({ user }) => {

  // const fileData = [
  //   { id: 1, name: 'file1.txt', author: 'John Doe' },
  //   { id: 2, name: 'file2.docx', author: 'Jane Smith' },
  //   { id: 3, name: 'file3.pdf', author: 'Mark Johnson' },
  //   { id: 4, name: 'file4.jpg', author: 'Emily Brown' },
  //   { id: 5, name: 'file5.png', author: 'David Lee' },
  //   { id: 6, name: 'file5.png', author: 'David Lee' },

  // ];
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get('https://secure-cloud.herokuapp.com/get-files-data');
        setFileData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getFiles();
  }, []);



  const handleDownload = async (file) => {

    try {

      const response = await axios.get(`https://secure-cloud.herokuapp.com/get-file?id=${user.uid}&file_id=${file.id}`, {
        responseType: 'blob',
      });
      console.log(response)
      // create a URL object from the blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // create a download link element
      const link = document.createElement('a');

      // set the download link attributes
      link.href = url;
      link.setAttribute('download', `${file.name}`);

      // display the link to download the file
      link.click();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="fw-bold mb-2 text-center text-uppercase" style={{ fontSize: "64px" }}>
          <SecureText>Secure</SecureText> - <CloudText>Cloud</CloudText>
        </h2>
      </Link>
      <div className="mt-3 mb-3">
        <h2 className="text-center">File List</h2>
        <Container>
          <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
            {fileData.map((file) => (
              <Col key={file.id}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{file.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{file.author}</Card.Subtitle>
                    <Button onClick={() => handleDownload(file)}>Download</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>

  );
};

const handleSignOut = async (setUser) => {
  try {
    await signOut(auth);
    setUser('')
  } catch (error) {
    console.error(error);
  }
};



const UploadButton = () => {
  return (
    <Link to="/upload">
      <Button variant="primary" className="w-100">
        <BsCloudUpload size={200} />
        <div className="mt-2">Upload</div>
      </Button>
    </Link>
  );
};

const DownloadButton = () => {
  return (
    <Link to="/download">
      <Button variant="primary" className="w-100">
        <BsCloudDownload size={200} />
        <div className="mt-2">Download</div>
      </Button>
    </Link>
  );
};

const SignOutButton = ({ setUser }) => {
  return (
    <Link to="/">
      <Button variant="danger" onClick={() => handleSignOut(setUser)} style={{
        position: "fixed",
        top: 10
      }}>
        Sign Out
      </Button>
    </Link>
  );
};

const GroupButton = () => {
  return (
    <Link to="/group">
      <Button variant="primary" className="w-100">
        <BsPeople size={200} />
        <div className="mt-2">Group</div>
      </Button>
    </Link>
  );
};

const Home = ({ user, setUser }) => {
  const [showUserId, setShowUserId] = useState(false);

  return (
    <>
      <h2 className="fw-bold mb-2 text-center text-uppercase" style={{ fontSize: "64px" }}>
        <SecureText>Secure</SecureText> - <CloudText>Cloud</CloudText>
      </h2>
      <div className="d-flex justify-content-center" style={{ marginTop: "100px" }}>
        <ButtonGroup className="gap-3">
          <UploadButton />
          <DownloadButton />
          <GroupButton />
        </ButtonGroup>
      </div>
      <SignOutButton setUser={setUser} />
      <div
        style={{
          position: "fixed",
          bottom: "50px",
          width: 500,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#eee",
          padding: "10px",
          textAlign: "center",
          cursor: "default",
        }}
        onMouseEnter={() => setShowUserId(true)}
        onMouseLeave={() => setShowUserId(false)}
      >
        {showUserId ? (
          <span>{user.uid}</span>
        ) : (
          <span style={{ color: "black" }}>User ID</span>
        )}
      </div>
    </>
  );
};




function App() {
  const [user, setUser] = useState('');
  return (
    <>
      <Router>
        <Routes>
          {user ? (
            <>
              <Route path="/download" element={<FileList user={user} />} />
              <Route path="/group" element={<GroupList user={user} />} />
              <Route path="/" element={<Home user={user} setUser={setUser} />} />
              <Route path="/upload" element={<UploadPage user={user} />} />
            </>
          ) : (
            <>
              <Route path="/signup" element={<SignUp setUser={setUser} />} />
              <Route path="/" element={<SignIn setUser={setUser} />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}


const SecureText = styled.span`
  color:green;
`
const CloudText = styled.span`
  color:white; 
  -webkit-text-stroke-color: black;
  -webkit-text-stroke-width: 1px;
`

export default App;


