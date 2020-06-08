/** @jsx jsx */
import { jsx, Image } from "theme-ui";
import { Link } from "gatsby";

export const Logo = () => (
  <Link to="/">
    <div
      sx={{
        marginTop: "20px",
        width: "100px",
        height: "50px",
        overflow: "hidden",
      }}
    >
      <Image src="../images/logo.png" />
    </div>
  </Link>
);
