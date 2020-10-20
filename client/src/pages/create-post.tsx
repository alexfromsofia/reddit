import { Box, Flex, Button, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { useRouter } from "next/router";

import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";
import { useCreatePostMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

export const CreatePost: React.FC = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          try {
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
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
