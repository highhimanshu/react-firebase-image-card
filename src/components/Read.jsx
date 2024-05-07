import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";

const Read = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const user_data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    setUserData(user_data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   useEffect(() => {
  //     fetchData();
  //   }, [isLoading]);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "users", id));
      fetchData();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div class="container my-5">
      {isLoading && (
        <div className="alert alert-danger" role="alert">
          Data deleted
        </div>
      )}
      <div class="row">
        {userData.length <= 0 ? (
          <h2>No data found</h2>
        ) : (
          userData.map((user) => (
            <div class="col-4 my-2">
              <div class="card">
                <img
                  src={user.fileUrl}
                  class="rounded "
                  height={250}
                  alt={user.fName}
                />
                <div class="card-body">
                  <span>📅 - {user.created.toDate().toDateString()}</span>
                  <h5 class="card-title">{user.fName}</h5>
                  <p class="card-text">{user.fEmail}</p>
                  <button
                    class="btn btn-danger mx-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                  <Link to={`edit/${user.id}`}>
                    <button class="btn btn-secondary">Edit</button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Read;
