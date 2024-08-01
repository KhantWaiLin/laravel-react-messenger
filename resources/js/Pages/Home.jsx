import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Home = () => {
    return <div>Messages</div>;
};

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
            children={page}
        >
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;
