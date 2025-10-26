/**
 * @return JSX Element
 *
 */

import { CenteredCard } from "../(customMuiComp)/CenteredCard";

const Footer = () => {
  return (
    <CenteredCard
      sx={{
        background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
        boxShadow: "0 3px 15px rgba(102, 126, 234, 0.4)",
        height: "10%",
        marginTop: "auto",
      }}
    >
      <p>&copy; {new Date().getFullYear()} SHOP APP</p>
    </CenteredCard>
  );
};

export default Footer;
