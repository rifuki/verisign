import useLogoutUser from '@/features/backend/useLogoutUser';
import {
    Avatar,
    Button,
    Flex,
    HStack,
    Heading,
    Spacer,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
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

    const { mutate: logout, isPending } = useLogoutUser({
        onSuccess: (data) => {
            toastSuccess(data.message);
            setTimeout(() => router.push("/login"), 1000)
        },
        onError: (error) => toastError(error.message),
    });

    return (
        <Flex
            p={{ base: '20px', lg: '40px' }}
            mt={{ base: '40px', md: '20px' }}
        >
            <Heading
                as="h3"
                fontSize="3xl"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
            >
                JWT Authentication
            </Heading>

            <Spacer />

            <HStack spacing="20px">
                <Avatar name="rifuki" />
                <Text style={{ textTransform: 'capitalize' }}>rifuki</Text>
                <Button onClick={() => logout()} isLoading={isPending} colorScheme="red">Logout</Button>
            </HStack>
        </Flex>
    );
}
