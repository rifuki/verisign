'use client';

import AppWrapper from '@/components/AppWrapper';
import useFetchJsonPlace from '@/features/json_place/useFetchJsonPlace';
import { ChatIcon, ViewIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, HStack, SimpleGrid, Spinner, Text } from '@chakra-ui/react';

export default function Home() {
    const { data: posts, isLoading } = useFetchJsonPlace();

    if (isLoading) return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
            <Spinner size="xl" color="purple.400" />
        </Box>
    );
    return (
        <AppWrapper>
            <SimpleGrid minChildWidth="300px" padding={{ base: '20px', lg: '40px' }} gap={5}>
                {posts && posts.map((post, index) => (
                    <Card key={`post-${index}`} borderRadius={10}>
                        <CardHeader>
                            <Flex gap={5} alignItems="center">
                                <Avatar />
                                <Box flexGrow={1} width={0}>
                                    <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{post.title}</Text>
                                </Box>
                            </Flex>
                        </CardHeader>

                        <CardBody>
                            <Text align="justify">{post.body}</Text>
                        </CardBody>
                        
                        <Divider borderColor="purple.400" />
                        
                        <CardFooter>
                            <HStack>
                                <Button variant="ghost" leftIcon={<ViewIcon />} colorScheme="purple">Watch</Button>
                                <Button variant="ghost" leftIcon={<ChatIcon />}>Comment</Button>
                            </HStack>
                        </CardFooter>
                    </Card>
                ))}
            </SimpleGrid>
        </AppWrapper>
    );
}
