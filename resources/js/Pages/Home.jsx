import { useCallback, useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/EventBus";

const Home = ({ messages = null, selectedConversation = null }) => {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(null);
    const messagesCrtRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const { on } = useEventBus();

    const loadMoreMessages = useCallback(() => {
        const firstMessage = localMessages[0];
        if (noMoreMessages) {
            return;
        }
        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }
                const scrollHeight = messagesCrtRef.current.scrollHeight;
                const scrollTop = messagesCrtRef.current.scrollTop;
                const clientHeight = messagesCrtRef.current.clientHeight;
                const tmpScrollFromBottom =
                    scrollHeight - scrollTop - clientHeight;
                setScrollFromBottom(tmpScrollFromBottom);
                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                });
            });
    }, [localMessages, noMoreMessages]);

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => {
                return [...prevMessages, message];
            });
        }
        if (
            (selectedConversation &&
                selectedConversation.is_user &&
                selectedConversation.id == message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prevMessages) => {
                return [...prevMessages, message];
            });
        }
    };

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        setTimeout(() => {
            if (messagesCrtRef.current) {
                messagesCrtRef.current.scrollTop =
                    messagesCrtRef.current?.scrollHeight;
            }
        }, 10);
        const offCreated = on("message.created", messageCreated);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
        };
    }, [selectedConversation]);

    useEffect(() => {
        if (messagesCrtRef.current && scrollFromBottom !== null) {
            messagesCrtRef.current.scrollTop =
                messagesCrtRef.current.scrollHeight -
                messagesCrtRef.current.offsetHeight -
                scrollFromBottom;
        }
        if (noMoreMessages) {
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                );
            },
            { rootMargin: "0px 0px 250px 0px" }
        );
        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100);
        }
        return () => {
            observer.disconnect();
        };
    }, [localMessages]);
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
                                <div ref={loadMoreIntersect}></div>
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
