// import { ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import db, { storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const Create = () => {
  const [fName, setFName] = useState();
  const [fEmail, setFEmail] = useState();
  const [fileUrl, setFileUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  console.log(id);

  useEffect(() => {
    if (!id) {
      setIsEdit(false);
      setFName("");
      setFEmail("");
      setFileUrl("");
    } else {
      setIsEdit(true);
      fetchSingleData();
    }
  }, [id]);

  const fetchSingleData = async () => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      setFName(docSnap.data().fName);
      setFEmail(docSnap.data().fEmail);
      setFileUrl(docSnap.data().fileUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e) => {
    let file = e.target.files[0];
    setIsLoading(true);

    try {
      let imageRef = ref(storage, `images/${file.name}`);
      await uploadBytesResumable(imageRef, file);
      const url = await getDownloadURL(imageRef);
      console.log(url);
      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    let data = {
      _id: new Date().getUTCMilliseconds(),
      fName: fName,
      fEmail: fEmail,
      fileUrl: fileUrl,
      created: Timestamp.now(),
    };

    //Here Firebase creates database automatically
    const ref = collection(db, "users");
    console.log(ref);

    try {
      await addDoc(ref, data);

      setFName("");
      setFEmail("");
      setFileUrl("");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "users", id), {
        fName: fName,
        fEmail: fEmail,
        fileUrl: fileUrl,
      });
      setFName("");
      setFEmail("");
      setFileUrl("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-50 mx-auto">
      <h2>{isEdit ? "Update a card" : "Add a card"} </h2>
      {isLoading && (
        <div className="alert alert-secondary" role="alert">
          Wait, file is uploading
        </div>
      )}
      <form>
        <div className="mb-3">
          <label htmlFor="input_name" className="form-label">
            Enter Name
          </label>
          <input
            type="name"
            name="input_name"
            className="form-control"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="input_email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={fEmail}
            name="input_email"
            onChange={(e) => setFEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="input_file" className="form-label">
            Add image
          </label>
          {fileUrl && (
            <div>
              <img
                className="m-2 rounded"
                src={fileUrl}
                alt={fName}
                width={100}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            name="input_file"
            // value={fileUrl}
            onChange={(e) => handleUpload(e)}
          />
        </div>

        {isEdit ? (
          <button
            type="submit"
            className={`btn btn-secondary ${isLoading ? "disabled" : ""}`}
            onClick={handleEdit}
          >
            Update
          </button>
        ) : (
          <button
            type="submit"
            className={`btn btn-primary ${isLoading ? "disabled" : ""}`}
            onClick={handleAdd}
          >
            Add
          </button>
        )}
      </form>
    </div>
  );
};

export default Create;
