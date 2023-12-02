import React from "react";
import "./My_Image.css";

// ImageByMonth component
// ImageByMonth component
const ImageByMonth = ({ month, year, images, onDownloadClick }) => {
  return (
    <div className="image-container">
      <h2 style={{ fontFamily: "Ramche" }}>
        {year}년 {month}월
      </h2>
      <div className="images">
        <div className="image-block">
          {/* image-block : 이미지와 다운로드 버튼을 하나의 블록으로 묶는다. */}
          <img src={images} className="image-size" />
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onDownloadClick(images);
            }}
            className="download-btn"
          >
            download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageByMonth;
