'use client';

import { Grid, GridItem } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppWrapper({children}:{children: ReactNode}) {
    return (
        <Grid 
            templateColumns="repeat(6, 1fr)" 
            bg="gray.50"
            height="100vh"
        >
            <GridItem 
                colSpan={{ base: 6, lg: 1 }}
                p={{ base: '20px', lg: '30px' }}
                bg="purple.400"
                minHeight={{lg: '100vh'}}
            >
                <Sidebar />
            </GridItem>
            <GridItem
                colSpan={{ base: 6, lg: 5,  }}
                overflowY="auto"
            >
                <Navbar />
                {children}
            </GridItem>
        </Grid>
    );
}