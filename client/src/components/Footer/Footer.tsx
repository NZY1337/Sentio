import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        padding: "20px 0",
        width: "100%",
        position: "relative",
        bottom: 0,
      }}
    >
      {/* Container to center the content */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body1" sx={{ textAlign: "center", flex: 1 }}>
            &copy; 2025 Your Company Name. All rights reserved.
          </Typography>

          {/* Social Media Links */}
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Typography
              component="a"
              href="#"
              sx={{ color: "white", textDecoration: "none" }}
            >
              Facebook
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: "white", textDecoration: "none" }}
            >
              Twitter
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: "white", textDecoration: "none" }}
            >
              Instagram
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

