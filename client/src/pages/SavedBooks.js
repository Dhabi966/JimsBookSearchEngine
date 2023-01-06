import React, { useEffect, useState } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { getMe } from '../utils/API';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  // const { loading } = useQuery(GET_ME, {
  //   onCompleted: (dt) => {
  //     setUserData(dt.me);
  //   },
  // });

  // const [removeBook] = useMutation(REMOVE_BOOK);

  // if (!Auth.loggedIn()) {
  //   return <h1>Please login to save books</h1>;
  // }

  // if (loading) {
  //   return <h2>LOADING...</h2>;
  // }

  const userDataLength = Object.keys(userData).length;
  useEffect(()=> {
    const userData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }
        const response = await getMe(token);
        const user = await response.json();
        setUserData(user)
      } catch(err) {
        console.log (err)
      }
    }
    userData();
  }, [userDataLength]) 

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // try {
    //   const result = await removeBook({
    //     variables: { bookId: bookId },
    //   });
    //   const { data } = result;
    //   console.log(data);
    //   setUserData(data.removeBook);
    //   removeBookId(bookId);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>

                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;