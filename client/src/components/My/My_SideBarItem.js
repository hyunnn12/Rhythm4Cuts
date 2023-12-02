import { Link, useLocation } from "react-router-dom";
import React from "react";
import "./My_SideBarItem.css"; // CSS 파일 import

function SidebarItem({ menu, isActive, isSub, lastSubItem }) {
  const isTitle = menu.name === "My 회원 정보" || menu.name === "My Photo";
  const noHover = menu.name === "My 회원 정보";
  const photoHover = menu.name === "My Photo";
  const location = useLocation();
  // useLocation훅을 사용하여 현재 위치를 추적 가능
  const isMyModifyPage = location.pathname === "/MyModify";
  // 현재 위치가 /isMyModify인지 판단

  // 'My 회원 정보'일 때 hover 효과를 안 입히기 위한 noHover
  // 'My 회원 정보' 또는 'My Photo'일 때 true
  // isTitle일 때 제목 크기를 설정할 수 있게

  // 아래 div 코드에서 className은 여러 조건에 따라 다른 스타일을 적용.
  // isSub가 true면 "sidebar-item-sub" 클래스를 적용.
  // isTitle이 true면 "sidebar-item-title" 클래스를 적용.
  // isActive가 true면 "sidebar-item-selected" 클래스를 적용.
  // lastSubItem가 true면 "last-subitem" 클래스를 적용.
  return (
    <div
      style={{ fontFamily: 'Ramche', fontWeight: "bold", }}
      className={`sidebar-item ${isSub ? "sidebar-item-sub" : ""} ${
        isTitle ? "sidebar-item-title" : ""
      } ${
        menu.name === "가입 정보" && isMyModifyPage
          ? "sidebar-item-selected"
          : ""
      } ${isActive ? "sidebar-item-selected" : ""} ${
        lastSubItem ? "last-subitem" : ""
      } ${noHover ? "no-hover" : ""} ${photoHover ? "photo-hover" : ""}`}
      // 'My 회원 정보'인 경우 'no-hover' 클래스 추가
    >
      <p>
        {/*  Link 컴포넌트는 클릭할 때마다 다른 경로로 이동.
         스타일에서 textDecoration은 링크의 밑줄을 제거하고,
         color는 isActive에 따라 다른 색상을 적용. */}
        <Link
          to={menu.path}
          style={{
            textDecoration: "none",
            fontFamily: 'Ramche',
            color:
              isActive || (menu.name === "가입 정보" && isMyModifyPage)
                ? "black"
                : "white",
          }}
        >
          {menu.name}
        </Link>
      </p>
    </div>
  );
}

export default SidebarItem;
