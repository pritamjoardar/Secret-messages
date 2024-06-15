import * as React from 'react';
import { 
    Html, 
    Button,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
 } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({username,otp}: VerificationEmailProps) {

  return (
    <Html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
      </head>
      <Preview>
        Here&apos;s your verification code:  {otp}
      </Preview>
      <Section>
        <Row>
            <Heading as="h2">Hello {username} ,</Heading>
        </Row>
        <Row>
            <Text>
                Thank you for registering. Please use the following verification code to complete your registration:
            </Text>
        </Row>
        <Row>
            <Text>
                {otp}
            </Text>
        </Row>
        <Row>
            <Text>
                If you did not make this request, please ignore this email.
            </Text>
        </Row>
      </Section>
    </Html>
  );
}


