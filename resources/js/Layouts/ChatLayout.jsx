import { usePage } from "@inertiajs/react";
import React, { useEffect } from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversations = page.props.selectedConversations;
    console.log(page.props);
    console.log(conversations);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                console.log("here", users);
            })
            .joining((user) => {
                console.log("joining", user);
            })
            .leaving((user) => {
                console.log("leaving", user);
            });
    }, []);
    return (
        <>
            ChatLayout
            <div>{children}</div>
        </>
    );
};

export default ChatLayout;
