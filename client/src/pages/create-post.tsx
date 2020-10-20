import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import useIsAuth from "../hooks/useIsAuth";
import { createUrqlClient } from "../utils/createUrqlClient";

export const CreatePost: React.FC = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  useIsAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          try {
            await createPost({ input: values });
            router.push("/");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="Title" />
            <Box mt="4">
              <InputField
                name="text"
                label="Text"
                placeholder="Text"
                type="text"
                textarea
              />
            </Box>
            <Flex mt="4" justifyContent="space-between" alignItems="center">
              <Button isLoading={isSubmitting} type="submit">
                Create post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
