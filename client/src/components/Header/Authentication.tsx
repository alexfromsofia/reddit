import React from "react";
import { Avatar, Spinner } from "@chakra-ui/core";
import { NavItem } from "./NavItem";
import { useMeQuery } from "../../generated/graphql";

interface AuthenticationProps {}

export const Authentication: React.FC<AuthenticationProps> = () => {
  const [{ data, fetching }] = useMeQuery();

  if (fetching) {
    return <Spinner />;
  }
  console.log(data);
  if (!data?.me) {
    return (
      <>
        <NavItem href="/login" label="Login" />
        <NavItem href="/register" label="Register" />
      </>
    );
  }

  if (data?.me) {
    return (
      <>
        <Avatar size="sm" name={data.me.username} />
        <NavItem href="/logout" label="Logout" />
      </>
    );
  }

  return null;
};
