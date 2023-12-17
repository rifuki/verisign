'use client';

import { AtSignIcon, CalendarIcon, EditIcon } from '@chakra-ui/icons';
import { List, ListIcon, ListItem } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';

export default function Sidebar() {
    return (
        <List fontSize="1.2em" spacing={4} color="white" >
            <ListItem>
                <ListIcon as={CalendarIcon} />
                <Link href="/">Dashboard</Link>
            </ListItem>
            <ListItem>
                <ListIcon as={EditIcon} />
                <Link href="/create">New Task</Link>
            </ListItem>
            <ListItem>
                <ListIcon as={AtSignIcon} />
                <Link href="/profile">Profile</Link>
            </ListItem>
        </List>
    );
}