'use client';

import useLoginUser from '@/features/backend/useLoginUser';
import { LoginPayload } from '@/types/backend';
import {
    Container,
    Card,
    FormControl,
    FormLabel,
    Input,
    CardHeader,
    CardBody,
    Heading,
    Button,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

const initialValues: LoginPayload = {
    username: '',
    password: '',
};

export default function Login() {
    const router = useRouter();
    const toast = useToast();
    const toastSuccess = (msg: string) =>
        toast({
            title: 'Success',
            description: msg,
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top',
        });
    const toastError = (msg: string) =>
        toast({
            title: 'Error',
            description: msg,
            status: 'error',
            duration: 1000,
            isClosable: true,
            position: 'top',
        });

    const { mutate, isPending } = useLoginUser({
        onSuccess: (data) => {
            toastSuccess(data.message);
            setTimeout(() => router.push('/'), 1000);
        },
        onError: (error) => toastError(error.message),
    });

    const formik = useFormik<LoginPayload>({
        initialValues,
        onSubmit: (values) => {
            mutate(values);
        },
    });

    return (
        <Container
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Card width="480px" borderRadius={20}>
                <CardHeader>
                    <Heading as="h2" textAlign="center" fontSize="3xl">
                        Login
                    </Heading>
                </CardHeader>

                <CardBody>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl mb="40px">
                            <FormLabel>Username</FormLabel>
                            <Input
                                onChange={formik.handleChange}
                                type="text"
                                name="username"
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormControl mb="40px">
                            <FormLabel>Password</FormLabel>
                            <Input
                                onChange={formik.handleChange}
                                type="password"
                                name="password"
                            />
                        </FormControl>
                        <FormControl>
                            <Button
                                width="full"
                                type="submit"
                                colorScheme="purple"
                                isLoading={isPending}
                            >
                                Submit
                            </Button>
                        </FormControl>
                    </form>
                </CardBody>
            </Card>
        </Container>
    );
}
