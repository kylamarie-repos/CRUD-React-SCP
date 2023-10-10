import { useState, useEffect } from "react";
import { db } from "./fbconfig";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { storage } from "./fbconfig";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";

export default function CRUD()
{
    const [dataItem, setDataItem] = useState("");
    const [dataClassType, setDataClassType] = useState("");
    const [dataDescription, setDataDescription] = useState("");
    const [dataContainment, setDataContainment] = useState("");

    const [readData, setReadData] = useState([]);

    const [id, setId] = useState("");
    const [showDoc, setShowDoc] = useState(false);

    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const OurCollection = collection(db, "data");

    const crudCreate = async () => {
        await addDoc(OurCollection, {item:dataItem, classtype:dataClassType, description:dataDescription, containment:dataContainment, imageURL:imageURL});
    }

    const crudDelete = async (id) => {
        const docToDelete = doc(db, "data", id);
        await deleteDoc(docToDelete);
    }

    const crudUpdate = async () => {
        const updateData = doc(db, "data", id);
        await updateDoc(updateData, {item:dataItem, classtype:dataClassType, description:dataDescription, containment:dataContainment, imageURL:imageURL});
        setShowDoc(false);
        setDataItem("");
        setDataClassType("");
        setDataDescription("");
        setDataContainment("");
    }

    useEffect(() => {
        const getData = async () =>
        {
            const ourDocsToRead = await getDocs(OurCollection);
            setReadData(
                ourDocsToRead.docs.map(
                    doc=>({...doc.data(), id:doc.id})
                )
            );
        }
        getData()
    }, []);

    const showEdit = async (id, item, classtype, description, containment) => {
        setDataItem(item);
        setDataClassType(classtype);
        setDataDescription(description);
        setDataContainment(containment);
        setImageURL(imageURL);
        setId(id);
        setShowDoc(true);
    }

    const handleImageChange = (e) => {
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }
    }

    const uploadImage = async () => {
        const storageRef = ref(storage, "images/" + image.item);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload " + progress + "% done.");
            },
            (error) => {console.log(error)},
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImageURL(downloadURL);
            }
        );
    }

    return(
        <>
        <div className="card card-body m-2 shadow rounded align-items-start">
        <input value={dataItem} onChange={(item) => setDataItem(item.target.value)} placeholder="Item" />
        <br />
        <br />
        <input value={dataClassType} onChange={(classtype) => setDataClassType(classtype.target.value)} placeholder="Class" />
        <br />
        <br />
        <input value={dataDescription} onChange={(description) => setDataDescription(description.target.value)} placeholder="Description" />
        <br />
        <br />
        <input value={dataContainment} onChange={(containment) => setDataContainment(containment.target.value)} placeholder="Containment" />
        <br />
        <br />
        <input type="file" onChange={handleImageChange} />
        {" "}
        <button onClick={uploadImage}>Upload Image</button>
        <br />
        {imageURL && <img src={imageURL} alt="Uploaded Preview" style={{maxWidth: "200px", height: "auto"}} />}
        <br />
        <br />
        {!showDoc?<button onClick={crudCreate}>Create new Document</button>:
        <button onClick={crudUpdate}>Update Document</button>}
        </div>

        {
            readData.map(
                values => (
                    <div className="card card-body m-2 shadow rounded" key={values.id}>
                        <h1>{values.item}</h1>
                        <h3>{values.classtype}</h3>
                        <p><strong>Description: </strong>{values.description}</p>
                        <p><strong>Containment: </strong>{values.containment}</p>
                        <p>{values.imageURL && <img src={values.imageURL} alt={values.imageURL} style={{maxWidth: "200px", height: "auto"}} />}</p>
                        <div className="ms-auto p-2">
                        <button className="btn btn-success" onClick={()=>showEdit(values.id, values.item, values.classtype, values.description, values.containment, values.imageURL)}>Edit</button>
                        {' '}
                        <button className="btn btn-danger" onClick={()=>crudDelete(values.id)}>Delete</button>
                        </div>
                        
                    </div>
                )
            )
        }
        </>
    )
}