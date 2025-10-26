import { Grid } from "@mui/material";
import ShowItems from "./(components)/ShowItems";

export default function Home() {
  return (
    <Grid sx={{ minHeight: "100vh" }}>
      <ShowItems />
    </Grid>
  );
}
