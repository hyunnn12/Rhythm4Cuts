import { Grid } from "@mui/material";
import React from "react";

function UserRank({ user, index }) {
  return (
    <Grid container textAlign="center" marginTop={"3px"}>
      <Grid item xs={2.25}>
        <span style={{fontFamily: 'Ramche',}}>{index + 1}</span>
      </Grid>
      <Grid item xs={7.5}>
        <span style={{fontFamily: 'Ramche',}}>{user.nickname}</span>
      </Grid>
      <Grid item xs={2.25}>
        <span style={{fontFamily: 'Ramche',}}>{user.scoreSum}</span>
      </Grid>
    </Grid>
  );
}

export default UserRank;
