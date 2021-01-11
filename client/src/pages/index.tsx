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
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { createUrqlClient } from "../utils/urql/createUrqlClient";

const Index = () => {
  const [{ data: meData, fetching: meDataFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [cursor, setCursor] = useState<string | null>(null);
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: 5, cursor },
  });
  const posts = data?.posts.posts;
  const hasMore = data?.posts.hasMore;
  const handleLoadMore = () => {
    if (!posts) return;

    const newCursor = posts[posts.length - 1].createdAt;
    if (!newCursor) return;
    setCursor(newCursor);
  };
  let content = null;

  if (!fetching && !posts && !meDataFetching) {
    content = <Heading>No posts in your feed.</Heading>;
  } else if (fetching && !posts) {
    content = (
      <Flex align="center" justify="center" my={8}>
        <CircularProgress value={50} />
      </Flex>
    );
  } else if (!fetching && posts?.length) {
    content = (
      <>
        <Stack spacing={8}>
          {posts.map(({ title, textSnippet, id, points, creatorId }) => (
            <Post
              key={id}
              id={id}
              title={title}
              text={textSnippet}
              points={points}
              creatorId={creatorId}
              me={meData?.me?.id}
            />
          ))}
        </Stack>
        <Flex align="center" justify="center" my={8}>
          <Button
            isDisabled={!hasMore}
            isLoading={fetching || fetching}
            onClick={handleLoadMore}
          >
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
