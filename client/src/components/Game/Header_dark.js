import { AppBar, Toolbar, IconButton } from "@mui/material";
import { keyframes } from "@emotion/react";
import { css } from "@mui/system";
import React from "react";

// Define the keyframes
const move = keyframes`git
  0% { transform: translateX(0); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`;

// Add the animation to the css
const style = css`
  &:hover {
    animation: ${move} 0.5s ease infinite;
  }
`;

function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="home" href="/">
          <img
            src="/images/Mypage_Logo.png"
            width="240"
            height="80"
            alt="Game Header Logo"
            className="d-inline-block align-top"
            sx={style}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
