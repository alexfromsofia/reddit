import {
  Button,
  CircularProgress,
  Flex,
  Heading,
  Link,
  Stack,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/urql/createUrqlClient";

const Index = () => {
  const [cursor, setCursor] = useState<string>(`${+new Date()}`);
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: 5, cursor },
  });
  const handleLoadMore = () => {
    if (!data) return;
    const { posts } = data;
    const newCursor = posts[posts.length - 1].createdAt;
    if (!newCursor) return;
    setCursor(newCursor);
  };
  let content = null;

  if (!fetching && !data) {
    content = <Heading>No posts in your feed.</Heading>;
  } else if (fetching && !data) {
    content = (
      <Flex align="center" justify="center" my={8}>
        <CircularProgress value={50} />
      </Flex>
    );
  } else if (!fetching && data) {
    content = (
      <>
        <Stack spacing={8}>
          {data?.posts.map(({ title, textSnippet, id }) => (
            <Post key={id} title={title} text={textSnippet} />
          ))}
        </Stack>
        <Flex align="center" justify="center" my={8}>
          <Button isLoading={fetching} onClick={handleLoadMore}>
            Load more
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <Layout variant="regular">
      <NextLink href="/create-post">
        <Link>
          <Flex align="center">
            <Button m="auto" mb={8}>
              Create post
            </Button>
          </Flex>
        </Link>
      </NextLink>
      {content}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
