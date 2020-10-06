import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";

import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

export const ForgotPassword: React.FC = ({}) => {
  const [completed, setCompleted] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setCompleted(true);
        }}
      >
        {({ isSubmitting }) =>
          completed ? (
            <Box>We sent you an email with a link to reset your password.</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
              />
              <Button mt="4" isLoading={isSubmitting} type="submit">
                Send password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
