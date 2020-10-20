import React from "react";
import { Header } from "./Header/Header";
import { Wrapper } from "./Wrapper";

interface WrapperProps {
  variant?: "small" | "regular";
}

export const Layout: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <>
      <Header />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
