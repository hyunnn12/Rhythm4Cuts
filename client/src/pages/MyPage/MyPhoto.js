// MyPhoto.js
import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { userInfo } from "../../apis/userInfo";
import { Stack } from "@mui/material";
import LoginMypageHeader from "../../components/Home/BlackHeader";
import ImageByMonth from "../../components/My/My_Image";
import Sidebar from "../../components/My/My_SideBar";
import Button from "@mui/material/Button";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./MyPhoto.css";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";

const MyPhoto = () => {
  const navigate = useNavigate();

  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기
  const [points, setPoints] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const email = getCookie("email");

  useEffect(() => {
    connectWebSocket();
  }, []);

  useEffect(() => {
    axios
      .get(`https://i9b109.p.ssafy.io:8443/member/info?email=${email}`, {
        headers: {
          Authorization: "Bearer " + getCookie("access"),
        },
      })
      .then((response) => {
        const data = response.data;
        setPoints(data.point);
      })
      .catch((error) => {});
  }, [email]);

  useEffect(() => {}, [points]);

  const handleDownloadClick = (imageSrc) => {
    if (points >= 300) {
      setSelectedImage(imageSrc);
      setShowModal(true);
    } else {
      window.alert("포인트가 부족합니다!");
    }
  };

  const confirmDownload = () => {
    // Assuming you have an API endpoint to pay points
    axios
      .post(
        `https://i9b109.p.ssafy.io:8443/member/pay`,
        {
          email: email,
          payPoints: "300",
        },
        {
          headers: {
            Authorization: "Bearer " + getCookie("access"),
          },
        }
      )
      .then((response) => {
        // Successfully paid points and received updated points from server
        const updatedPoints = response.data.point;
        setPoints(updatedPoints);

        // Proceed with download
        const downloadLink = document.createElement("a");
        downloadLink.href = selectedImage;
        downloadLink.download = "downloadedImage.jpg";
        downloadLink.click();
        setShowModal(false);
      })
      .catch((error) => {
        window.alert("포인트 차감 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  try {
    userInfo()
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
        }
      })
      .catch((error) => {
        window.alert("로그인을 해주세요!");
        navigate("/");
      });
  } catch (error) {}

  //사진 데이터 관리
  const [imagesData, setImagesData] = useState([
    {
      year: 2023,
      month: 3,
      images: [
        { src: "/images/네컷1.jpg", alt: "Image 1" },
        { src: "/images/네컷2.jfif", alt: "Image 2" },
        { src: "/images/네컷3.jfif", alt: "Image 2" },
      ],
    },
    {
      year: 2023,
      month: 2,
      images: [
        { src: "/images/네컷4.jfif", alt: "Image 1" },
        { src: "/images/네컷5.jfif", alt: "Image 2" },
      ],
    },
  ]);

  const bringImages = async () => {
    const headers = {
      Authorization: "Bearer " + getCookie("access"),
    };
    const email = getCookie("email");
    const result = await axios.get(
      `https://i9b109.p.ssafy.io:8443/film/photo?email=${email}`,
      {
        headers,
      }
    );
    console.log(result);
    setImagesData(result.data);
  };

  useEffect(() => {
    bringImages();
  }, []);

  const afterDeduction = points - 300;

  const modalBody = (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -60%)",
        backgroundColor: "rgba(50, 50, 255, 0.9)",
        color: "#ffffff",
        padding: "50px",
        width: "500px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>포인트 사용 확인</h2>
      <p style={{ marginBottom: "15px", textAlign: "center" }}>
        300포인트가 차감됩니다. 다운로드 하시겠습니까?
      </p>
      <p style={{ marginBottom: "30px", textAlign: "center" }}>
        현재 포인트: {points} -> 차감 후 포인트: {afterDeduction}
      </p>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          style={{
            backgroundColor: "rgba(0, 128, 255, 0.1)",
            width: "100px",
          }}
          onClick={confirmDownload}
        >
          확인
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "rgba(0, 128, 255, 0.1)",
            width: "100px",
          }}
          onClick={() => setShowModal(false)}
        >
          취소
        </Button>
      </Stack>
    </Box>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(to right, rgb(123,123,255), rgb(255,123,123))",
      }}
    >
      <LoginMypageHeader />
      <div className="page-container">
        <Sidebar></Sidebar>
        <div className="photo-container">
          {imagesData.map((data, index) => (
            <ImageByMonth
              key={index}
              month={new Date(data.createDate).getMonth() + 1} // 월 정보 추출
              year={new Date(data.createDate).getFullYear()} // 년 정보 추출
              images={data.commonUrl}
              onDownloadClick={handleDownloadClick}
              style={{
                background:
                  "linear-gradient(to right, rgb(163,163,255), rgb(255,163,163))",
              }}
            />
          ))}
        </div>
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          {modalBody}
        </Modal>
      </div>
    </div>
  );
};

export default MyPhoto;
