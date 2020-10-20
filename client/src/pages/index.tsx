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
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: 10, cursor },
  });
  const handleLoadMore = () => {
    if (!data) return;
    const { posts } = data;
    if (!posts[0].createdAt) return;

    setCursor(posts[0].createdAt);
  };
  let content = null;

  if (!fetching && !data) {
    content = <Heading>No posts in your feed.</Heading>;
  } else if (fetching && !data) {
    content = <CircularProgress value={50} />;
  } else if (!fetching && data) {
    content = (
      <>
        <Stack spacing={8}>
          {data?.posts.map(({ title, textSnippet }) => (
            <Post title={title} text={textSnippet} />
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
