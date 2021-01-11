import React from "react";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/core";
import { useVoteMutation, VoteMutationVariables } from "../generated/graphql";

interface PostProps {
  title: string;
  text: string;
  points: number;
  id: number;
  creatorId: number;
  me?: number;
}

export const Post: React.FC<PostProps> = ({
  title,
  id,
  text,
  points,
  me,
  creatorId,
  ...rest
}) => {
  const [, vote] = useVoteMutation();
  console.log(creatorId);
  return (
    <Flex p={5} shadow="md" borderWidth="1px" {...rest}>
      <Flex direction="column" alignItems="center" mr={4}>
        <IconButton
          // isDisabled={me === creatorId}
          onClick={() => vote({ value: 1, postId: id })}
          icon="chevron-up"
          aria-label=""
          size="md"
        />
        {points}
        <IconButton
          // isDisabled={me === creatorId}
          onClick={() => vote({ value: -1, postId: id })}
          icon="chevron-down"
          aria-label=""
          size="md"
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{title}</Heading>
        <Text mt={4}>{text}</Text>
      </Box>
    </Flex>
  );
};
