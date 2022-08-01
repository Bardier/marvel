import ErrorMessage from "../errorMessage/ErrorMessage";

import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div>
      <ErrorMessage />
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Page doesn't exist
      </p>
      <Link
        to="/"
        style={{
          display: "block",
          marginTop: "20px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
          color: "darkblue",
        }}
      >
        Back to main page
      </Link>
    </div>
  );
};

export default Page404;
