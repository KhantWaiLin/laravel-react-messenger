import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Home = () => {
    return <div>Messages</div>;
};

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profile
                </h2>
            }
            children={page}
        >
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;
