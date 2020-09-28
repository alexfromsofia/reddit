import React from "react";
import { Flex, Heading } from "@chakra-ui/core";
import NextLink from "next/link";
import { DarkModeSwitch } from "../DarkModeSwitch";
import { Authentication } from "./Authentication";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => (
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    padding="1.5rem"
    bg="teal.500"
    color="white"
    {...props}
  >
    <Flex align="center" mr={5}>
      <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
        <NextLink href="/">Reddit</NextLink>
      </Heading>
    </Flex>
    <Flex align="center">
      <DarkModeSwitch />
      <Authentication />
    </Flex>
  </Flex>
);
