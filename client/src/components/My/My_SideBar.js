import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  createTheme,
  Divider,
  ThemeProvider,
} from "@mui/material";
import { Info as InfoIcon, Photo as PhotoIcon } from "@mui/icons-material";
import { useLocation, Link } from "react-router-dom";
import React from "react";
import "./My_SideBarItem.css";

const theme = createTheme({
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#6496ed", // 선택된 항목의 배경색을 변경합니다.
          },
        },
      },
    },
  },
});

function Sidebar() {
  const pathName = useLocation().pathname;

  const menus = [
    {
      name: "My 회원 정보",
      icon: <InfoIcon />,
      subMenu: [
        { name: "가입 정보", path: "/Mypage" },
        { name: "친구 정보", path: "/MyFriend" },
        { name: "Point 정보", path: "/MyPoint" },
      ],
    },
    { name: "My Photo", path: "/MyPhoto", icon: <PhotoIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <List style={{ marginTop: "10%", fontFamily: 'Ramche', }}>
        {menus.map((menu, index) => (
          <div key={index}>
            <Divider sx={{ backgroundColor: "blue", fontFamily: 'Ramche', }} />
            <Link
              to={menu.path}
              style={{ textDecoration: "none", color: "inherit", fontFamily: 'Ramche', }}
            >
              <ListItem button selected={pathName === menu.path}>
                {menu.icon && (
                  <ListItemIcon
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      fontFamily: 'Ramche',
                    }}
                  >
                    {menu.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={menu.name}
                  primaryTypographyProps={{
                    style: {
                      fontFamily: 'Ramche',
                      fontWeight: "bold",
                      color: pathName === menu.path ? "black" : "white", // 현재 위치가 메뉴 항목의 경로와 일치하면 글자색을 검정색으로 설정합니다.
                      fontSize: "larger",
                    },
                  }}
                />
              </ListItem>
            </Link>
            {menu.subMenu &&
              menu.subMenu.map((subItem, subIndex) => (
                <Link
                  to={subItem.path}
                  style={{ textDecoration: "none", color: "inherit", fontFamily: 'Ramche', }}
                >
                  <ListItem
                    button
                    selected={pathName === subItem.path}
                    key={subIndex}
                    style={{
                      color: pathName === subItem.path ? "black" : "white",
                      fontFamily: 'Ramche',
                    }} // 현재 위치가 메뉴 항목의 경로와 일치하면 글자색을 검정색으로 설정합니다.
                  >
                    <ListItemText inset primary={subItem.name} style={{fontFamily: 'Ramche',}} />
                  </ListItem>
                </Link>
              ))}
            <Divider sx={{ backgroundColor: "blue", fontFamily: 'Ramche', }} />
          </div>
        ))}
      </List>
    </ThemeProvider>
  );
}

export default Sidebar;
