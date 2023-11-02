import { useState, useEffect } from "react";
import { db } from "./fbconfig";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { storage } from "./fbconfig";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import "./style.css";

export default function CRUD()
{
    const [dataItem, setDataItem] = useState("");
    const [dataClassType, setDataClassType] = useState("");
    const [dataDescription, setDataDescription] = useState("");
    const [dataContainment, setDataContainment] = useState("");

    const [showButton, setShowButton] = useState(false);

    const [readData, setReadData] = useState([]);

    const [id, setId] = useState("");
    const [showDoc, setShowDoc] = useState(false);

    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const OurCollection = collection(db, "data");

    const crudCreate = async () => {
        await addDoc(OurCollection, {item:dataItem, classtype:dataClassType, description:dataDescription, containment:dataContainment, imageURL:imageURL});
        window.location.reload();
    }

    const crudDelete = async (id) => {
        const docToDelete = doc(db, "data", id);
        await deleteDoc(docToDelete);
        window.location.reload();
    }

    const crudUpdate = async () => {
        const updateData = doc(db, "data", id);
        await updateDoc(updateData, {item:dataItem, classtype:dataClassType, description:dataDescription, containment:dataContainment, imageURL:imageURL});
        setShowDoc(false);
        setDataItem("");
        setDataClassType("");
        setDataDescription("");
        setDataContainment("");
        window.location.reload();
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

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

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [OurCollection]);

    const showEdit = async (id, item, classtype, description, containment, imageURL) => {
        document.documentElement.scrollTop = 0;
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
        const storageRef = ref(storage, "images/" + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on("state_changed",
            // progress function
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload " + progress + "% done.");
            },
            //error function
            (error) => {console.log(error)},
            // complete upload retrieve URL to upload image
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImageURL(downloadURL);
            }
        );
    }

    const classtypeToBorderColor = {
        Safe: 'border-success',
        Euclid: 'border-primary',
        Keter: 'border-warning',
        Thaumiel: 'border-danger',
    }

    const handleScroll = () => {
        if (window.scrollY > 20) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      };
    
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return(
        <>
        <div className="card card-body m-2 shadow rounded row g-3 align-items-start">
                
                <input className="form-control" value={dataItem} onChange={(item) => setDataItem(item.target.value)} placeholder="Item" />
                
                <input className="form-control" value={dataClassType} onChange={(classtype) => setDataClassType(classtype.target.value)} placeholder="Class" />
                
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={dataDescription} onChange={(description) => setDataDescription(description.target.value)} placeholder="Description"></textarea>
                
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={dataContainment} onChange={(containment) => setDataContainment(containment.target.value)} placeholder="Containment"></textarea>
                
                <input className="form-control" type="file" onChange={handleImageChange} />
                {" "}
                <button className="btn btn-secondary" onClick={uploadImage}>Upload Image</button>
                {imageURL && <img src={imageURL} alt="Uploaded Preview" style={{maxWidth: "200px", height: "auto"}} />}
                {!showDoc?<button className="btn btn-secondary" onClick={crudCreate}>Create new Document</button>:
                <button className="btn btn-secondary" onClick={crudUpdate}>Update Document</button>}
        </div>

        {/* {
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
        } */}


        {/* Sorting the items in order of class type then numerical order */}
        {
        readData
        .slice() // Create a copy of the array to avoid modifying the original
        .sort((a, b) => a.classtype.localeCompare(b.classtype) || a.item.localeCompare(b.item, undefined, { numeric: true })) 
        .map((values) => (
            <div id="card" className={`card card-body m-2 shadow rounded border border-4 ${classtypeToBorderColor[values.classtype] || 'border-dark' }`} key={values.id}>
                <h1>{values.item}</h1>
                <h3>{values.classtype}</h3>
                <p><strong>Description: </strong>{values.description}</p>
                <p><strong>Containment: </strong>{values.containment}</p>
                <p>{values.imageURL && <img src={values.imageURL} alt={values.imageURL} style={{maxWidth: "200px", height: "auto"}} />}</p>
                <div className="ms-auto p-2">
                <button className="btn btn-success" onClick={() => showEdit(values.id, values.item, values.classtype, values.description, values.containment, values.imageURL)}>Edit</button>
                {' '}
                <button className="btn btn-danger" onClick={() => crudDelete(values.id)}>Delete</button>
                </div>
            </div>
            ))
        }


    <button id="myBtn" className="btn" title="Go to top" onClick={scrollToTop} style={{ display: showButton ? "block" : "none" }} >
        <img id="scrollImage" src="../images/arrow.gif" alt="Scroll to Top"  />
    </button>
        </>
    )
}