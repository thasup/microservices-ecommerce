import Image from 'next/image';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';

import useRequest from '../../hooks/useRequest';
import Message from '../common/Message';

const EditProfile = ({ user }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(undefined);
  const [bio, setBio] = useState('');

  const [message, setMessage] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${user.id}`,
    method: 'patch',
    body: {
      email: user.email,
      isAdmin: user.isAdmin,
      name,
      image,
      gender,
      age,
      bio,
      jsonShippingAddress: user.shippingAddress
    },
    onSuccess: () => {
      setUpdateSuccess(true);
      Router.push('/dashboard');
    }
  });

  useEffect(() => {
    if (user || updateSuccess) {
      setName(user.name);
      setImage(user.image);
      setGender(user.gender);
      setAge(user.age);
      setBio(user.bio);
    }

    if (errors) {
      setLoadingUpdate(false);
      setShowErrors(true);
    }

    setTimeout(() => {
      setUpdateSuccess(false);
      setLoadingUpdate(false);
    }, 1000);
  }, [user, updateSuccess, errors]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowErrors(false);
    setLoadingUpdate(true);

    doRequest();
  };

  const myLoader = ({ src, width, quality }) => {
    if (src[0] === 'v') {
      return `https://res.cloudinary.com/thasup/image/upload/q_${quality || 60}/${src}`;
    } else {
      return `${src}&q=${quality || 40}`;
    }
  };

  return (
		<Form onSubmit={submitHandler}>
			<Row>
				{message && <Message variant="danger">{message}</Message>}
				{showErrors ? errors : null}
				{updateSuccess && <Message variant="success">Profile Updated</Message>}

				<Col xs={12} md={6}>
					<div className="dashboard-profile-img">
						<Image
							loader={myLoader}
							src={user.image}
							layout="fill"
							objectFit="cover"
							priority={true}
							alt={'profile image'}
						/>
					</div>
				</Col>

				<Col xs={12} md={6}>
					<Form.Group controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="image" className="my-3">
						<Form.Label>Image URL</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter image URL"
							value={image}
							onChange={(e) => setImage(e.target.value)}
						></Form.Control>
					</Form.Group>

					<div className="px-0 d-flex flex-row justify-content-between align-items-center age-gender-box">
						<Form.Group controlId="gender">
							<Form.Label>Gender</Form.Label>
							<Form.Control
								as="select"
								className="form-select"
								value={gender}
								onChange={(e) => setGender(e.target.value)}
							>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="age">
							<Form.Label>Age</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter age"
								value={age}
								onChange={(e) => setAge(e.target.value)}
							></Form.Control>
						</Form.Group>
					</div>

					<Form.Group controlId="bio" className="my-3">
						<Form.Label>Bio</Form.Label>
						<Form.Control
							as="textarea"
							style={{ height: '100px' }}
							placeholder="Enter bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Button type="submit" variant="dark">
						{loadingUpdate
						  ? (
							<Spinner
								animation="border"
								role="status"
								as="span"
								size="sm"
								aria-hidden="true"
							>
								<span className="visually-hidden">Loading...</span>
							</Spinner>
						    )
						  : null}{' '}
						Update
					</Button>
				</Col>
			</Row>
		</Form>
  );
};

export default EditProfile;
