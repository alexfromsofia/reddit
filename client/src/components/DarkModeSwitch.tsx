import { useColorMode, Switch, Flex } from "@chakra-ui/core";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Flex align="center">
      <Switch
        mr={4}
        display="flex"
        color="black"
        isChecked={isDark}
        onChange={toggleColorMode}
      />
    </Flex>
  );
};
