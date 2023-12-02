import { Grid } from "@mui/material";
import React from "react";

function MusicRank({ music }) {
  return (
    <Grid container textAlign="center" marginTop={"7px"}>
      <Grid item xs={1}>
        <span style={{fontFamily: 'Ramche',}}>{music.ranking}</span>
      </Grid>
      <Grid item xs={7}>
        <span style={{fontFamily: 'Ramche',}}>{music.title}</span>
      </Grid>
      <Grid item xs={4}>
        <span style={{fontFamily: 'Ramche',}}>{music.singer}</span>
      </Grid>
    </Grid>
  );
}

export default MusicRank;
