import React from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";

import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          console.log(response);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="Username"
            />
            <Box mt="4">
              <InputField name="email" label="Email" placeholder="Email" />
            </Box>
            <Box mt="4">
              <InputField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </Box>

            <Flex mt="4" justifyContent="space-between" alignItems="center">
              <Button isLoading={isSubmitting} type="submit">
                Register
              </Button>
              <NextLink href="/login">
                <Link>Already registered?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
