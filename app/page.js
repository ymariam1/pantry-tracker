"use client"
import {Box, Stack, Typography, Button, Modal, TextField, IconButton} from "@mui/material"
import {firestore} from  "./firebase";
import { collection, getDocs, query, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, React, useRef } from "react";
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {Camera} from "react-camera-pro";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 3,
  flexDirection: 'column',
  justifyContent: 'center',
};

const childStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 3,
  flexDirection: 'column',
  justifyContent: 'center',
}
export default function Home() {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [childOpen, setChildOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); setChildOpen(false);}
  const handleChildOpen = () => setChildOpen(true);
  const handleChildClose = () => setChildOpen(false);


  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry()
  }, [])

  const handleAddItem = async () => {
    if (newItem.trim()) {
      await addDoc(collection(firestore, "pantry"), { name: newItem, quantity });
      setNewItem("");
      setQuantity(1);
      handleClose();
      updatePantry();
    }
  };


  const handleUpdateQuantity = async (id, newQuantity) => {
    const docRef = doc(firestore, "pantry", id);
    await updateDoc(docRef, { quantity: newQuantity });
    updatePantry();
  };

  const handleRemoveItem = async (id) => {
    const docRef = doc(firestore, "pantry", id);
    await deleteDoc(docRef);
    updatePantry();
  };

  const filteredPantry = pantry.filter((item) =>
    item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (filteredPantry.length === 0) {
      alert("Item not found in pantry");
      setSearchTerm("");
    }
  };

  return (
      <Box width = "100vw" height = "100vh" display= {"flex"} justifyContent= {"center"} alignItems={"center"} flexDirection={'column'}>
        {pantry.length > 0 && (
        <TextField
          label="Search Pantry"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />
      )}
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2} display={'column'} justifyContent={'center'}>
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={newItem} onChange={(e) => setNewItem(e.target.value)}/>
            {pantry.length > 0 && (
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          )}
            <Button variant="contained" onClick={handleAddItem} >Add</Button>
            <Stack>
            <PhotoCameraIcon onClick={handleChildOpen}></PhotoCameraIcon>
            <Modal open={childOpen} onClose={handleChildClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx = "height: 400, width: '100%'">
                <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={'center'}>Take an Image</Typography>
                <div>
                <Camera ref={camera} />
                <button onClick={() => setImage(camera.current.takePhoto())}>Take photo</button>
                <img src={image} alt='Taken photo'/>
                </div>
              </Box>
            </Modal>
            <PhotoCameraBackIcon></PhotoCameraBackIcon>
            </Stack>
          </Stack>
        </Box>
      </Modal>
        <Box border={'1px solid #333'}>
        
        <Box width="800px" height="100px" bgcolor={"#f0f0f0"} paddingTop={'12px'}>
          <Typography variant="h2"color={"#333"} textAlign={"center"}>Pantry Items</Typography>
        </Box>
        <Stack width={'800px'} height={'300px'} spacing={'2vh'} overflow={'auto'}>
          {filteredPantry.map((item) => (
            <Box key={item.id}
            width={'100%'}
            minheight={'100px'}
            display={'flex'}
            justifyContent={'space-evenly'}
            alignItems={'center'}
            bgcolor={'lightgray'}>
              <Typography
              variant="h3"
              color={'black'}
              textAlign={'center'}
              >{
                item.name.charAt(0).toUpperCase() + item.name.slice(1)
              }</Typography>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  -
                </IconButton>
                <Typography variant={"h5"}>{item.quantity}</Typography>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </IconButton>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
        </Box>
        <Button variant="contained" onClick={handleOpen}>Add</Button>
        </Box>
      );
  }

