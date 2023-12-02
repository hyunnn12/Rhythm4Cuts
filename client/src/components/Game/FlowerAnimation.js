import { LocalFlorist } from "@mui/icons-material";
import React from "react";

const FlowerAnimation = () => {
  return (
    // 이 컴포넌트의 위치는 'absolute'이며, 너비와 높이는 각각 100%, 100vh입니다.
    // 'z-index' 속성이 '-1'로 설정되어 있어 다른 요소들 뒤에 위치합니다.
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100vh",
        zIndex: -1,
        fontFamily: 'Ramche',
      }}
    >
      {/* 원하는 꽃가루 개수 넣어 헿 */}
      {[...Array(100)].map((_, index) => (
        // 각 꽃가루는 MUI의 LocalFlorist 아이콘으로 표현되며, 키는 인덱스로 설정됩니다.
        <LocalFlorist
          key={index}
          fontSize="large"
          style={{
            position: "absolute", // 각 꽃가루의 위치는 'absolute'입니다.
            animation: "fallingFlower 3s linear infinite", // 'fallingFlower'라는 애니메이션을 적용합니다.
            top: `${Math.random() * 100}vh`, // 꽃가루의 시작 위치는 랜덤하게 설정됩니다.
            left: `${Math.random() * 100}%`, // 꽃가루의 시작 위치는 랜덤하게 설정됩니다.
            fontFamily: 'Ramche',
            color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
              Math.random() * 255
            })`, // 꽃가루의 색상은 랜덤하게 설정됩니다.
          }}
        />
      ))}
      {/* 꽃가루 애니메이션을 정의하는 CSS입니다. */}
      <style>
        {`
                @keyframes fallingFlower {
                    0% {
                        transform: translateY(0); // 애니메이션 시작 시 꽃가루는 원 위치에 있습니다.
                        opacity: 0; // 시작 시 꽃가루는 보이지 않습니다.
                    }
                    100% {
                        transform: translateY(100vh); // 애니메이션 종료 시 꽃가루는 100vh 아래로 내려갑니다.
                        opacity: 1; // 애니메이션이 종료되면 꽃가루는 완전히 보입니다.
                    }
                }
                `}
      </style>
    </div>
  );
};

export default FlowerAnimation;
