import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";

const Home = ({ messages = null, selectedConversation = null }) => {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCrtRef = useRef(null);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        setTimeout(()=>{
            messagesCrtRef.current.scrollTop = messagesCrtRef.current?.scrollHeight;
        },10)
    }, [selectedConversation]);
    return (
        <>
            {!messages && (
                <div
                    className="flex flex-col gap-8 justify-center items-center text-center
                 h-full opacity-35"
                >
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCrtRef}
                        className="flex-1 overflow-y-auto p-5 "
                    >
                        {localMessages?.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages?.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
        </>
    );
};

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user} children={page}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;
