import { withUrqlClient } from "next-urql";
import { Header } from "../components/Header/Header";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <div>
      <Header />
      <div>Server data:</div>
      <div>{JSON.stringify(data?.posts)}</div>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
