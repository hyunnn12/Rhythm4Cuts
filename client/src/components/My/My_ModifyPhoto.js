import { Modal, Box, Button, Stack, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import "./My_ModifyPhoto.css";
import axios from "axios";
import { getCookie } from "../../utils/cookie";

function SelectImageModal({ isOpen, handleClose, onSelect }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [1, 2, 3, 4];

  const handleImageClick = (imageName) => {
    setSelectedImage(imageName);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      handleClose();
    }
  };

  //사진 변경 반영
  const changeProfileImage = async () => {
    const headers = {
      Authorization: "Bearer " + getCookie("access"),
    };
    const email = getCookie("email");
    const profileImageSeq = selectedImage;
    try {
      console.log(email);
      console.log(profileImageSeq);
      const response = await axios.patch(
        "https://i9b109.p.ssafy.io:8443/member/profile",
        { email, profileImageSeq },
        { headers }
      );
      console.log(response);
    } catch (error) {
      console.error("Error fetching point logs:", error);
    }
  };

  useEffect(() => {
    changeProfileImage();
  }, [selectedImage]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          backgroundColor: "#F593B6",
          color: "#ffffff",
          padding: "50px",
          width: "500px",
          fontFamily: 'Ramche',
        }}
      >
        <h2 style={{ textAlign: "center", fontFamily: 'Ramche', }}>이미지 선택</h2>

        <Grid container spacing={2} justifyContent="center">
          {images.map((image, index) => (
            <Grid item key={index}>
              <img
                src={`/images/${image}.png`}
                alt={`Option ${index}`}
                style={{
                  cursor: "pointer",
                  width: "100px",
                  height: "100px",
                  border: selectedImage === image ? "2px solid blue" : "none",
                }}
                onClick={() => handleImageClick(image)}
              />
            </Grid>
          ))}
        </Grid>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          marginTop={2}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgba(0, 128, 255, 0.1)",
              width: "100px",
            }}
            onClick={handleConfirmSelection}
          >
            선택
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgba(0, 128, 255, 0.1)",
              width: "100px",
            }}
            onClick={handleClose}
          >
            취소
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default SelectImageModal;
