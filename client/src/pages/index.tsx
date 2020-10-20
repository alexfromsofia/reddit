import { Button, Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout variant="regular">
      <NextLink href="/create-post">
        <Link>
          <Button>Create post</Button>
        </Link>
      </NextLink>
      <div>{JSON.stringify(data?.posts)}</div>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
