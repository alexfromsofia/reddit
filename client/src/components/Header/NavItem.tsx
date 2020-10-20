import { Button, ButtonProps, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import * as React from "react";

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
