import { ConfigProvider, Spin } from "antd";
import { DEFAULT_COLOR } from "../const/enum";

const SuspenseLoading = () => {
return (
    <div className="h-screen w-screen bg-white flex justify-center items-center">
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: DEFAULT_COLOR,
                },
            }}
        >
            <Spin size="large" />
        </ConfigProvider>
    </div>
);
};

export default SuspenseLoading;
