import React from "react";
import { Avatar, Button, Spinner } from "@chakra-ui/core";
import { NavItem } from "./NavItem";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";

interface AuthenticationProps {}

export const Authentication: React.FC<AuthenticationProps> = () => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  if (fetching) {
    return <Spinner />;
  }

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
        <Button
          ml={4}
          size="sm"
          variantColor="dark"
          isLoading={logoutFetching}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </>
    );
  }

  return null;
};
