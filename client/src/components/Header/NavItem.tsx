import * as React from "react";
import { Button, Link, ButtonProps, Flex } from "@chakra-ui/core";
import NextLink from "next/link";

interface NavItemProps {
  label: string;
  href: string;
  props?: ButtonProps;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  href,
  props = { variant: "link", variantColor: "white" },
}) => {
  return (
    <NextLink href={href}>
      <Link ml={4}>
        <Flex align="center">
          <Button {...props}>{label}</Button>
        </Flex>
      </Link>
    </NextLink>
  );
};
